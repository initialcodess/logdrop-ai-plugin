# Local testing

No client settings are changed by the build scripts. The steps below are manual and have not been run as part of creating this draft.

Run `npm run check` and `npm run package` from the project folder first. In these examples, replace `/absolute/path/to/LogDrop-AI-Plugin` with your checkout location. Avoid installing a second LogDrop connection if you already have one enabled; choose which connection to use for the test.

## Claude Code

With Claude Code installed:

```sh
claude plugin validate /absolute/path/to/LogDrop-AI-Plugin/dist/logdrop-0.1.0
claude --plugin-dir /absolute/path/to/LogDrop-AI-Plugin/dist/logdrop-0.1.0
```

Open `/mcp`, select the plugin's LogDrop server, and authenticate. Complete the browser permission screen. This is a Claude Code test; it does not test Claude's web connector.

## Codex

Codex supports a project marketplace at `.agents/plugins/marketplace.json`. For a test workspace, copy the packaged folder to `plugins/logdrop/` under that workspace and use:

```json
{
  "name": "logdrop-local",
  "plugins": [
    {
      "name": "logdrop",
      "source": {
        "source": "local",
        "path": "./plugins/logdrop"
      },
      "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL"
      },
      "category": "Productivity"
    }
  ]
}
```

Merge with an existing marketplace rather than replacing it. Paths resolve from the workspace root. Restart the desktop app, open the local marketplace, and install LogDrop. Finish sign-in when prompted. See the official Codex source in [platforms.md](platforms.md) for client-specific details.

## Cursor

Copy the **contents** of the packaged folder into `~/.cursor/plugins/local/logdrop/`. The resulting manifest should be `~/.cursor/plugins/local/logdrop/plugin.json`. Inspect any existing folder before replacing it. Use a real copy, not a symlink to a directory outside Cursor's local plugin folder.

Restart Cursor or run **Developer: Reload Window**. Open **Customize** and check the LogDrop MCP entry. Authenticate using the connection's sign-in action. Local imports must be allowed by organization policy.

## GitHub Copilot CLI

With Copilot CLI installed:

```sh
copilot plugin install /absolute/path/to/LogDrop-AI-Plugin/dist/logdrop-0.1.0
```

Use the client's MCP authentication action for the plugin-provided LogDrop server. Confirm the displayed server identifier before choosing it; plugin namespacing can differ from a manually added server.

## GitHub Copilot in VS Code

For a local folder test, merge this setting into your VS Code settings:

```json
{
  "chat.pluginLocations": {
    "/absolute/path/to/LogDrop-AI-Plugin/dist/logdrop-0.1.0": true
  }
}
```

Agent plugins must be enabled (`chat.plugins.enabled`). Open **Agent Customizations → Plugins** and check LogDrop, then authenticate its MCP connection. This setting is documented as experimental. If a client build has migration or plugin discovery problems, record the version and error; do not assume an empty list means LogDrop authorization failed.

## Check after login

1. Confirm the browser page names the expected application and shows the intended projects.
2. Grant only the permissions needed for the test.
3. Ask: “Use LogDrop to list the projects I can access.”
4. Verify a read-only result for a selected project.
5. Confirm the connection appears in **Settings → MCP** in LogDrop.

If the tool list is stale, try the client's refresh action or fully quit and reopen the application. After adding new permissions, authenticate again as needed and revoke an old connection only after the replacement works. Plugin updates and connection permissions are separate.

Record client version, installation result, login result, and read-call result when testing. No push sending or customer journey publication is needed to validate this connection package.

## Check skill selection and outcomes

Confirm the client's skill list shows the shared skills. Use a realistic request from [skill-review.md](skill-review.md), rather than pasting the expected procedure into the test prompt. Check the selected workflow, tool arguments, evidence interpretation, and resulting explanation. Start with read-only scenarios or isolated test data. A draft/save test must have its own authorized target; never send or publish just to test a skill.
