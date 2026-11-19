# LogDrop AI plugin: maintainer tooling

This branch holds only the maintainer scripts for the plugin on `main`. It is kept off `main` on
purpose: the Claude plugin directory refuses a version when the tracked branch contains scripts or a
`package.json` with fields it does not allow (our organization is not Verified). See "Maintainer
tooling" in the `main` README.

Check it out inside a `main` checkout, at `.tooling/` (ignored by Git on `main`):

```sh
git fetch origin tooling
git worktree add .tooling tooling
npm --prefix .tooling run sync      # regenerate Claude files from plugin.json and mcp.json
npm --prefix .tooling run check     # offline checks, including the Claude directory file rules
npm --prefix .tooling run package   # build dist/logdrop-<version>/ for Codex and local tests
```

Never merge this branch into `main` or copy these files there.
