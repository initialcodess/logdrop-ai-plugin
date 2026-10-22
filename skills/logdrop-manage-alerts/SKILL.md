---
name: logdrop-manage-alerts
description: Create, tune, or troubleshoot LogDrop alert rules and destinations, including noisy alerts, missing notifications, and condition previews. Use for alert rules and their delivery history, not outbound marketing pushes or the user's panel notification inbox.
---

# Manage alert rules

Turn the requested signal into an explainable rule, or determine whether a missing/noisy alert comes from matching, thresholds, suppression, or delivery. Keep sample matching separate from a real notification test.

## Inspect the current configuration

Resolve the selected project/connection with existing context or `list_projects`, then read the live tool schemas. Use `list_alert_rules`, `get_alert_rule`, `list_alert_destinations`, and relevant `list_alert_history` records. Reuse known IDs rather than searching unrelated projects. Rule summaries omit conditions; read the full rule before judging it or editing it.

Identify the signal/source, intended condition, threshold/window, distinct-device requirement if any, cooldown, and destination. For noise reduction, examine representative triggers and SUPPRESSED/FAILED states before recommending a change. A rule existing or being enabled does not establish that it fired, and SENT is not proof a human received/read it.

Read [rule and test semantics](references/rule-semantics.md) when constructing conditions or diagnosing a rule. It covers event name versus property code, open comparison values, count versus rate, and the limits of sample preview. Do not silently approximate an unsupported request, such as a percentage threshold, with an arbitrary event count.

## Propose and preview a narrow change

Use actual project signals when helpful, but do not scan all logs/events just to populate suggestions. For a new rule, specify all required settings. For an existing rule, read the current definition and exact `updated_at`: `update_alert_rule` is a full replacement, not a partial patch. Preserve unrelated conditions, destinations, description, and distinct-device policy; omitted fields can clear them.

Preview with `preview_alert_rule` using minimized representative and non-matching sample payloads when constructing or changing conditions. Preview validates/matches the sample only; it does not simulate production threshold/window, cooldown, distinct-device counts, delivery, or name uniqueness. A matching preview is not evidence that the real rule would fire.

Explain the proposed threshold/cooldown in business terms and label any baseline-derived recommendation as a proposal. Do not disable all alerts, remove a recipient, or weaken critical coverage merely to reduce the number of notifications.

## Apply the requested operation with its real effects

Use `create_alert_rule`, `update_alert_rule`, or `set_alert_rule_enabled` for the authorized change. Enabling delivery and changes involving an already-enabled rule require the live tool's fresh final confirmation of the target and future notification effect. A disabled rule may be saved without inventing a separate live-send approval requirement. Follow exact tool requirements rather than treating write scope as approval.

Destinations can be shared by several rules. Before `update_alert_destination`, inspect referencing rules and explain the shared effect. Read responses omit addresses, URLs, and authorization; do not overwrite an omitted secret/recipient with a guessed value. Use supported preservation semantics, user-known values, or panel review when the identity is uncertain. A destination cannot be deleted while any undeleted rule references it, including disabled rules; do not silently detach references to bypass this.

`test_alert_destination` and `test_alert_destination_draft` send real external notifications, even if the target is disabled. Use them only when a real test is requested and the tool's final confirmation requirements are met. Do not send merely to validate a definition, and do not automatically retry an uncertain send. A stored test changes the destination revision; re-read it before a subsequent edit.

Read back the requested saved state and inspect relevant history after a real signal when available. Do not claim new delivery before it is recorded. Return the diagnosis/proposed change or saved result, affected destinations/rules, preview versus real-test outcome, and any remaining observation step. A diagnostic request alone authorizes no configuration changes.
