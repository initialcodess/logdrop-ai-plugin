import assert from 'node:assert/strict';
import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

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
    if (['dist', 'node_modules', '.git'].includes(entry.name)) continue;
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

async function check(manifest, mcp, generated) {
  assert.equal(manifest.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
  assert.equal(mcp.$schema, 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json');
  assert.equal(manifest.name, 'logdrop');
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.equal((await load('package.json')).version, manifest.version);
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
  }
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
    console.log(`Package ready: ${output}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
