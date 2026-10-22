# LogDrop AI plugin

Connect Codex, Claude Code, Cursor, or GitHub Copilot to LogDrop.

Investigate app health, crashes, device logs, HTTP requests, and security findings. Use supported project management features within the permissions you grant.

**Status:** initial version for review, not yet published to plugin directories. Local Codex smoke tests covered skill selection and read-only health, security, and tracking-plan workflows using an existing authenticated MCP connection. First-time bundled-plugin OAuth and the other client/workflow combinations still need testing.

## How it works

The plugin connects to the hosted LogDrop MCP server:

```text
https://mcp.logdrop.io/mcp
```

Sign in with your LogDrop account in the browser and choose the projects and permissions to share. The plugin contains no account credentials. Installing it does not grant access by itself.

Tool definitions, tool parameters, access checks, and the main usage instructions come from the MCP server. They are not copied into this package. Shared skills add focused investigation, integration, and marketing workflows. No agents or hooks are included.

See the [LogDrop user guide](https://developer.logdrop.io/docs/panel/mcp) for permissions, connection management, usage limits, and troubleshooting.

## Supported formats

| Client | Manifest | MCP configuration |
| --- | --- | --- |
| Codex | `plugin.json` | `mcp.json` |
| Cursor | `plugin.json` | `mcp.json` |
| GitHub Copilot CLI and VS Code | `plugin.json` | `mcp.json` |
| Claude Code | `.claude-plugin/plugin.json` | `.mcp.json` |

Codex, Cursor, and Copilot use the portable Agent Plugins 1.0 format. Claude compatibility files are generated from the same source definitions. Use a client version that supports the selected format.

Claude's web connector is a separate installation route. A Claude Code plugin does not automatically register a connector in claude.ai. You can use **Settings → MCP → Connect MCP** in the LogDrop panel for the available client setup options.

## Example requests

- “Use LogDrop to check my app's health over the last 24 hours.”
- “Investigate the latest crashes in my project.”
- “Show failed HTTP requests for this device.”
- “Review my app's security findings.”

Specify the project and time range when you know them. The available tools depend on your LogDrop role, selected projects, and permissions. Actions such as sending a push or publishing a customer journey use a panel review link where supported; the plugin does not bypass that step.

## Skills

Skills are shared across the supported clients. They use the live LogDrop tools and preserve the selected project's permissions. Clients can select the appropriate skill from its name and description; the precise invocation UI depends on the client.

| Skill | When to use it |
| --- | --- |
| [logdrop-integrate-sdk](skills/logdrop-integrate-sdk/SKILL.md) | Install or upgrade the SDK, implement the requested features, and verify real signals. |
| [logdrop-plan-event-tracking](skills/logdrop-plan-event-tracking/SKILL.md) | Design the business-event contract, reuse existing instrumentation, and register requested missing schemas. |
| [logdrop-investigate-crash](skills/logdrop-investigate-crash/SKILL.md) | Trace a crash occurrence into logs/source and fix it when requested. |
| [logdrop-debug-logs](skills/logdrop-debug-logs/SKILL.md) | Reconstruct an application or HTTP failure using logs and session context. |
| [logdrop-investigate-anomaly](skills/logdrop-investigate-anomaly/SKILL.md) | Test a stored anomaly assessment against actual evidence and plan a remedy. |
| [logdrop-review-app-health](skills/logdrop-review-app-health/SKILL.md) | Review broad app health or release quality and prioritize the main issues. |
| [logdrop-review-security](skills/logdrop-review-security/SKILL.md) | Investigate static findings, runtime risk events, and Threat Score with coverage limits. |
| [logdrop-manage-alerts](skills/logdrop-manage-alerts/SKILL.md) | Build or tune alert rules, preview conditions, and investigate matching/suppression/delivery. |
| [logdrop-analyze-funnel](skills/logdrop-analyze-funnel/SKILL.md) | Calculate conversion/drop-off, preview a funnel, or save a requested definition. |
| [logdrop-build-customer-journey](skills/logdrop-build-customer-journey/SKILL.md) | Design/validate a journey draft or edit a flow with its actual runtime effects explained. |
| [logdrop-prepare-push](skills/logdrop-prepare-push/SKILL.md) | Prepare an audience/content form for human sending or inspect an existing campaign. |
| [logdrop-review-campaign-performance](skills/logdrop-review-campaign-performance/SKILL.md) | Evaluate campaign engagement and journey run outcomes without inventing attribution or reach. |

The skills distinguish diagnosis from a requested change, drafts from publication, and observed evidence from assumptions. They do not automatically close incidents or publish/send campaigns. Code fixes need application source and suitable build/test tools; telemetry access alone cannot supply them.

## Review and local testing

Use Node.js 20 or newer. There are no npm dependencies.

```sh
npm run check
```

Edit `plugin.json` for shared metadata or `mcp.json` for the connection. Then update the Claude files:

```sh
npm run sync
npm run check
```

Build a clean, allowlisted plugin folder:

```sh
npm run package
```

The output is `dist/logdrop-0.1.0/`. Packaging refuses to overwrite an existing output folder. Remove that generated folder before rebuilding the same version.

- [Local installation steps](docs/local-testing.md)
- [Platform differences and official sources](docs/platforms.md)
- [Maintaining shared skills](docs/adding-skills.md)
- [Skill review scenarios](docs/skill-review.md)

## Project layout

```text
plugin.json                   Shared identity and Codex presentation
mcp.json                      Portable connection configuration
.claude-plugin/plugin.json    Generated Claude metadata
.mcp.json                     Generated Claude HTTP connection
assets/logo.png               LogDrop logo
skills/                       Shared SKILL.md workflows and focused references
scripts/plugin.mjs            Sync, configuration checks, packaging
docs/                         Platform notes and local testing
```

## Before publication

The plugin source is available under the [MIT License](LICENSE). LogDrop service access remains subject to its own terms. See the [Privacy Policy](https://logdrop.io/privacy). Complete the client checks in the local testing guide. Directory review and approval are separate from hosting this source repository.
