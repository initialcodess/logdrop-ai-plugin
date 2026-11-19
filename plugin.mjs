import assert from 'node:assert/strict';
import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// This script lives on the `tooling` branch, checked out at `.tooling/` inside a main checkout,
// so the plugin root is the parent folder. See README.md on main, "Maintainer tooling".
const root = fileURLToPath(new URL('../', import.meta.url));
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const load = async (path) => JSON.parse(await readFile(join(root, path), 'utf8'));

async function checkMarkdownLinks(path) {
  const body = await readFile(path, 'utf8');
  for (const match of body.matchAll(/\]\(([^)]+)\)/g)) {
    const link = match[1];
    if (/^[a-z][a-z\d+.-]*:/i.test(link) || link.startsWith('#')) continue;
    const target = resolve(dirname(path), link.split('#')[0]);
    const fromRoot = relative(root, target);
    assert.ok(fromRoot !== '..' && !fromRoot.startsWith(`..${sep}`), `${path}: link escapes package`);
    await readFile(target);
  }
}

async function checkSkills() {
  let entries;
  try {
    entries = await readdir(join(root, 'skills'), { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return 0;
    throw error;
  }
  let count = 0;
  for (const entry of entries) {
    assert.ok(entry.isDirectory(), `Unexpected file in skills/: ${entry.name}`);
    const directory = join(root, 'skills', entry.name);
    const body = await readFile(join(directory, 'SKILL.md'), 'utf8');
    const frontmatter = body.match(/^---\n([\s\S]*?)\n---\n/);
    assert.ok(frontmatter, `${entry.name}: missing YAML frontmatter`);
    const name = frontmatter[1].match(/^name: ([a-z0-9-]+)$/m)?.[1];
    const description = frontmatter[1].match(/^description: (.+)$/m)?.[1];
    assert.equal(name, entry.name, `${entry.name}: name must match directory`);
    assert.ok(name.length < 64 && !name.includes('--'), `${entry.name}: invalid name`);
    assert.ok(description?.length > 0 && description.length <= 1024, `${entry.name}: missing/oversized description`);
    assert.doesNotMatch(body, /\[TODO:|\[INSERT|\[PLACEHOLDER/);
    // Optional UI data is not a hard tool dependency or a second workflow.
    const ui = await readFile(join(directory, 'agents', 'openai.yaml'), 'utf8');
    assert.ok(ui.includes(`$${name}`), `${entry.name}: default prompt must name the skill`);
    count += 1;
  }
  return count;
}

async function checkDocumentation(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['dist', 'node_modules', '.git', '.tooling'].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await checkDocumentation(path);
    else if (entry.name.endsWith('.md')) await checkMarkdownLinks(path);
  }
}

// The portable manifest and MCP configuration are the only editable definitions.
// Claude uses the same data, but names the HTTP transport differently.
function claudeFiles(manifest, mcp) {
  const { name, version, description, author, homepage, repository, license, keywords } = manifest;
  return {
    '.claude-plugin/plugin.json': {
      name,
      version,
      description,
      author,
      homepage,
      ...(repository ? { repository } : {}),
      license,
      icon: manifest.extensions['com.openai'].interface.logo,
      privacyPolicyUrl: manifest.extensions['com.anthropic'].privacyPolicyUrl,
      keywords,
    },
    '.mcp.json': {
      mcpServers: Object.fromEntries(
        Object.entries(mcp.mcpServers).map(([name, server]) => {
          assert.equal(server.type, 'streamable-http', 'Only remote HTTP MCP is supported.');
          assert.deepEqual(Object.keys(server).sort(), ['type', 'url']);
          return [name, { type: 'http', url: server.url }];
        }),
      ),
    },
  };
}

// The Claude plugin directory refuses a version (for organizations that are not Verified) when
// the tracked branch holds anything except Markdown, text, JSON, YAML, allowed images, LICENSE
// and .gitignore, or a package.json with fields it does not allow. That is why this tooling is
// not on main. Keep main to these files; see README.md on main, "Maintainer tooling".
async function checkDirectoryPolicy() {
  const tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
  const allowed = /(\.(md|txt|json|ya?ml|png|jpe?g|gif|webp|ico)$|^LICENSE$|^\.gitignore$)/i;
  const refused = tracked.filter((path) => !allowed.test(path) || /(^|\/)package\.json$/.test(path));
  assert.deepEqual(refused, [], `Claude directory policy: keep these off main (use the tooling branch): ${refused.join(', ')}`);
  for (const path of tracked) {
    const body = await readFile(join(root, path));
    assert.ok(!body.subarray(0, 2).equals(Buffer.from('#!')), `${path}: starts with #!`);
    if (!/\.(png|jpe?g|gif|webp|ico)$/i.test(path)) assert.ok(!body.includes(0), `${path}: contains NUL bytes`);
  }
}

// OpenAI plugin directory: fields and limits required for a public MCP submission
// (https://developers.openai.com/plugins/deploy/submission#manifest-fields).
function checkOpenAiSubmission(manifest) {
  const openai = manifest.extensions['com.openai'];
  const ui = openai.interface;
  const limits = { displayName: 30, shortDescription: 30, longDescription: 4000, developerName: 80, category: 200 };
  for (const [field, max] of Object.entries(limits)) {
    assert.ok(typeof ui[field] === 'string' && ui[field].trim() && ui[field].length <= max, `OpenAI interface.${field}: required, at most ${max} characters`);
  }
  for (const field of ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL']) {
    assert.match(ui[field] ?? '', /^https:\/\/[^@\s]+$/, `OpenAI interface.${field}: required HTTPS URL for MCP review`);
  }
  const prompts = [ui.defaultPrompt ?? []].flat();
  assert.ok(prompts.length <= 3 && prompts.every((text) => text.length <= 128) && new Set(prompts).size === prompts.length,
    'OpenAI interface.defaultPrompt: at most three unique prompts of 128 characters');
  const cases = openai.review?.test_cases;
  assert.equal(cases?.positive?.length, 5, 'OpenAI review: exactly five positive test cases');
  assert.equal(cases?.negative?.length, 3, 'OpenAI review: exactly three negative test cases');
  for (const item of cases.positive) assert.ok(item.description && item.prompt && item.tools_triggered && item.expected_behavior, `OpenAI positive case incomplete: ${item.description}`);
  for (const item of cases.negative) assert.ok(item.description && item.prompt, `OpenAI negative case incomplete: ${item.description}`);
  assert.ok(!('test_credentials' in openai.review) && !('reviewer_instructions' in openai.review), 'OpenAI review: credentials belong in the dashboard, not the package');
  if (!openai.review.demo_recording_url) console.warn('Warning: OpenAI review.demo_recording_url is not set; MCP review needs a video walkthrough (it can also be added in the dashboard).');
}

async function check(manifest, mcp, generated) {
  assert.equal(manifest.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
  assert.equal(mcp.$schema, 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json');
  assert.equal(manifest.name, 'logdrop');
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.equal((await load('.tooling/package.json')).version, manifest.version);
  assert.equal(manifest.author.name, 'LogDrop');
  assert.equal(manifest.license, 'MIT');
  assert.equal(generated['.claude-plugin/plugin.json'].privacyPolicyUrl, 'https://logdrop.io/privacy');
  assert.ok((await readFile(join(root, 'LICENSE'), 'utf8')).startsWith('MIT License'));
  assert.deepEqual(mcp.mcpServers, {
    logdrop: { type: 'streamable-http', url: 'https://mcp.logdrop.io/mcp' },
  });
  for (const [path, expected] of Object.entries(generated)) {
    assert.equal(await readFile(join(root, path), 'utf8'), json(expected), `${path}: run npm run sync`);
  }
  const ui = manifest.extensions['com.openai'].interface;
  for (const asset of [ui.logo, ui.composerIcon]) {
    assert.equal(asset, './assets/logo.png');
    const image = await readFile(join(root, asset));
    assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    // Claude listing icon: a square PNG, 512 to 2048 px per side, under 2 MB.
    const [width, height] = [image.readUInt32BE(16), image.readUInt32BE(20)];
    assert.ok(width === height && width >= 512 && width <= 2048 && image.length < 2 * 1024 * 1024,
      `${asset}: the Claude icon must be a square PNG of 512-2048 px under 2 MB`);
  }
  await checkDirectoryPolicy();
  checkOpenAiSubmission(manifest);
  // A package must never carry a static credential or a tool implementation.
  for (const config of [manifest, mcp, ...Object.values(generated)]) {
    assert.doesNotMatch(json(config), /Bearer\s|clientSecret|api_key|private_key|localhost|127\.0\.0\.1/);
  }
  const skillCount = await checkSkills();
  await checkDocumentation(root);
  console.log(`Configuration, Claude compatibility, assets, links, and ${skillCount} skill entry points passed.`);
}

async function main() {
  const action = process.argv[2];
  assert.ok(['sync', 'check', 'package'].includes(action), 'Use sync, check, or package.');
  const manifest = await load('plugin.json');
  const mcp = await load('mcp.json');
  const generated = claudeFiles(manifest, mcp);

  if (action === 'sync') {
    for (const [path, value] of Object.entries(generated)) {
      await mkdir(dirname(join(root, path)), { recursive: true });
      await writeFile(join(root, path), json(value));
    }
    console.log('Updated Claude compatibility files from plugin.json and mcp.json.');
  }
  await check(manifest, mcp, generated);

  if (action === 'package') {
    const output = join(root, 'dist', `logdrop-${manifest.version}`);
    // Refuse an existing package so removed components cannot remain in a release.
    await mkdir(join(root, 'dist'), { recursive: true });
    await mkdir(output);
    const files = ['plugin.json', 'mcp.json', '.claude-plugin', '.mcp.json', 'assets', 'LICENSE', 'README.md', 'docs'];
    try {
      await readdir(join(root, 'skills'));
      files.push('skills');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    for (const path of files) await cp(join(root, path), join(output, path), { recursive: true });
    execFileSync('zip', ['-qr', `${output}.zip`, '.'], { cwd: output });
    console.log(`Package ready: ${output} and ${output}.zip (upload the ZIP to OpenAI)`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
