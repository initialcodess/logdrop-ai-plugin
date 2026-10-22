# Platform formats

Official documentation checked on 2026-10-22. This is a source-based compatibility plan, not a claim that every installed client version has been tested.

## Shared package

Codex, Cursor, and Copilot document support for Agent Plugins 1.0. Its fixed entry points are `plugin.json`, `mcp.json`, and optional `skills/`. The portable HTTP transport name is `streamable-http`.

We use one portable package with shared skills and a remote MCP connection. There is no need for a separate Cursor manifest or Copilot-specific directory for these components. The logo is included as an asset; how a directory displays it depends on that directory's submission metadata.

## Claude Code

Claude uses `.claude-plugin/plugin.json` and `.mcp.json`. Its HTTP transport name is `http`. `npm run sync` maps the portable metadata and connection into those files. Do not edit the generated files directly.

The plugin does not install a Claude web connector. Claude web and organization distribution have their own setup and policy requirements.

Sources: [manifest reference](https://code.claude.com/docs/en/plugins-reference), [MCP configuration](https://code.claude.com/docs/en/mcp).

## Codex

Codex documents root Agent Plugins manifests and portable MCP configuration. OpenAI presentation data belongs in `extensions.com.openai` in `plugin.json`; this package uses it for the display name, logo, and example prompts.

For this local draft, authentication uses the client's MCP OAuth flow and server discovery. No credentials or scope list are fixed in the package. OpenAI's public directory requires its own remote MCP submission and authentication review. Check its current requirements before submission; a local package is not a completed public listing.

Source: [package and install plugins](https://developers.openai.com/plugins/build/plugins).

## Cursor

Cursor accepts the portable format for skills and MCP. Its `.cursor-plugin/plugin.json` format adds Cursor-specific rules, agents, commands, hooks, and variables. We do not need those components in this first version. A public listing requires a public repository and Cursor review.

Sources: [plugin reference](https://cursor.com/docs/reference/plugins), [local plugin testing](https://cursor.com/docs/plugins).

## GitHub Copilot

Copilot recommends Agent Plugins 1.0 for new portable MCP/skill packages. CLI and VS Code have different installation interfaces. VS Code supports local plugin paths; the CLI supports installation from a local path. Organization policies can restrict both.

Sources: [plugin formats](https://docs.github.com/en/copilot/concepts/customizations/plugins), [CLI reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference), [VS Code plugin support](https://code.visualstudio.com/docs/agent-customization/agent-plugins).

## Validation boundaries

`npm run check` runs offline consistency checks for this package, including generated Claude files, matching versions, the production endpoint, the logo, skill entry points, and local Markdown links. It is not a replacement for a client's native validator, behavioral evaluation, or an OAuth test.

Portable schema definitions: [plugin schema](https://agent-plugins.org/schemas/1.0.0/plugin.schema.json), [MCP schema](https://agent-plugins.org/schemas/1.0.0/mcp.schema.json).

## Publication decisions still open

- Approved license for the public source and plugin package.
- Approved support, privacy, and terms links required by each listing.
- Directory-specific registration, publisher verification, and OAuth review.
- Interactive installation, login, tool discovery, and a read-only call on each client.
