# SDK risk signals and action evidence

Code-checked against native Android/iOS and Web SDK sources on 2026-10-22. Availability, evidence, and scoring can differ by SDK version/platform/configuration. React Native/Flutter use their documented underlying native collectors; a framework name is not an OS or a separate guarantee of every detector.

## Read only evidence exposed by the current tools

`risk_detected` and `sdk_action_cleared` are currently internal registry events. Ordinary visible-event discovery, summaries, and device-event tools do not offer them. This reference explains their semantics if relevant evidence is returned through another authorized surface; it does not create a new MCP reader or justify forcing their short codes into a query.

`whitelist_domain_detected` and `ip_reputation_detected` are visible families. Resolve them and their properties through live discovery. A filtered-out/internal event cannot be treated as zero occurrences, and missing detailed signals do not invalidate an aggregate score.

## Native Android/iOS signals

| `risk_type` | What it suggests; what to check before concluding abuse |
| --- | --- |
| `jailbreak_detected` | Device-integrity/root/jailbreak indicators. The shared name also covers Android checks. Assess supported platform, test environment, and corroborating evidence. |
| `debugger_attached` | Debugger/debug state; development and legitimate diagnostics are plausible. Not proof of exploitation. |
| `hooking_suspected` | Runtime instrumentation/hooking indicators. Treat the suspected classification and evidence as such; do not claim code was modified solely from the label. |
| `proxy_configured` | Local HTTP/HTTPS proxy configuration. Corporate proxies and test tooling are plausible; distinct from backend IP proxy-list classification. |
| `vpn_suspected` | VPN transport/interface indicators. VPN usage is not itself an attack; distinct from Tor/proxy IP reputation. |
| `simulator_in_use` | Simulator/emulator indicators; common in development and automation. |
| `automation_environment_detected` | Test/automation environment indicators. Determine whether automated testing is expected. |
| `automation_touch_pattern` | Repetitive/regular touch behavior. Evidence can include `pattern`, `touch_count`, and `duration_ms`; the count is the analyzed sample, not all lifetime touches or distinct bots. |
| `device_clock_mismatch` | Device time differs from a trusted server-time estimate. Evidence can include `device_time`, `expected_time`, absolute `difference_seconds`, and `direction` (`ahead`/`behind`). Do not apply the offset to every record without corroboration or equate an incorrect clock with intentional tampering. |

The native reporters expose selected customer evidence for touch-pattern and clock-mismatch signals; they do not serialize every internal detector clue. An absent evidence object does not prove the detector found nothing. Do not fabricate a hook library name, filesystem path, or proxy address from the risk label.

## Web signals

Web-specific types include `devtools_open`, `headless_browser_detected`, `automation_pointer_pattern`, `keyboard_too_uniform`, `private_browsing_detected`, `session_not_persistent`, and `hardware_inconsistency`, plus `automation_environment_detected`.

These are browser/behavior heuristics, not confirmed threats: developer tools and headless browsers can be legitimate, regular input can have benign causes, private browsing is not malicious, and persistence restrictions can come from browser policy. Private-mode detection is browser-dependent and incomplete. Explain actual returned evidence without assuming mobile detectors ran in a browser.

Web risk and bot scoring are separate categories; emitted signal scores can describe the relevant category rather than an isolated signal's contribution. Native emitters normally use the signal's score when available. Do not sum scores or compare two SDKs' values as an identical probability model.

## Detection versus action

For generic risk evidence, resolve `risk_type`, `risk_score`, `evidence`, `blocked`, `sdk_actions_applied`, and optional `action_signature` using the returned schema/types. The action list may appear as a comma-separated SDK string rather than a ready-made JSON array. Preserve the actual representation.

Native generic detection reports currently start with `blocked=false` and actions `none`; that event alone does not establish the final policy enforcement outcome. Web reports can include the current evaluated action state. Do not conclude that protection failed by comparing those representations without checking the source/version and relevant policy evidence.

`whitelist_domain_detected` means an observed request did not match the configured domain/path allowlist; it is not a universal malicious-domain verdict. Inspect `domain`, `path`, `method`, `blocked`, and action labels. A new legitimate endpoint or an incomplete allowlist can explain it. An `app_block_configured` label is configuration evidence, not proof the app was stopped. Do not replay or visit recorded destinations.

The native SDKs throttle repeated whitelist reports and deduplicate unchanged generic risk state within a session/type. Web deduplicates unchanged detected-signal scores. Counts are emitted reports, not every check, request, attempted attack, or unique person. No repeated event is not proof a condition disappeared.

Where available, `sdk_action_cleared` describes a previously active action being removed/expired. Its `blocked`/action fields can describe the **previous** action, not a new block. Read `action_source`, `clear_reason`, and signature before interpreting it. Clearing a protection action is not proof the underlying risk was remediated or all network traffic is now permitted.

Use `get_risk_setting_metadata` for current event/action IDs and supported SDK families; do not hardcode policy IDs from this table. Read section `risk` with `get_project_settings` for configuration context. ANY/ALL matching, enabled rules, and separate bot/other-risk switches can change which configured response applies. Saved policy, alert configuration, delivery, and actual device enforcement are distinct evidence layers.
