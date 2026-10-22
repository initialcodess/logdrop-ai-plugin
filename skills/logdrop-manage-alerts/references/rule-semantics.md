# Rule conditions and test semantics

Use the current tool schema as the authority. Alert, funnel, journey, and push-segment filter syntax differs; do not copy an operator or property path between them blindly.

## Sources and fields

| Source | Current condition fields and interpretation |
| --- | --- |
| APPLICATION_LOG | `level`, `message`; match recorded log fields rather than pretending a substring rule counts unique incidents. |
| HTTP_ERROR | `status`, `method`, `domain`, `path`, `latencyms`, `errortype`, `errormessage`. Latency values are milliseconds; policy windows/cooldowns are seconds. |
| EVENT | `eventname` is the discovered **event name**, not `event_code`. Property conditions use `property.<propertyCode>`, not the property's display name. Resolve codes/types with `get_event_schema`. |
| CRASH | `title`, `stacktrace`, `isnewissue`, `isregression`, `isfrequent`, `frequency`; booleans are not arbitrary descriptive strings. |
| ANOMALY | `type`, `severity`, `confidence`, `isregression`; confidence is on a 0–1 scale, not a 0–100 percentage. |

Conditions combine with AND. `IN` handles alternatives within one field; two conflicting EQUALS conditions are not an OR group. EQUALS accepts one comparison value; numeric comparisons require one numeric value. Preserve original value casing; field names normalize independently.

Suggested methods, statuses, error types, severity labels, and event property values are examples, not exhaustive allowlists. PATCH/OPTIONS, a new SDK error type, or an intentionally new business value can be valid. Use explicit user input or relevant observed values; do not replace it with a familiar suggestion merely to make the rule look conventional.

## Counts and suppression

The current rule schema uses event threshold counts within `windowSeconds`, optionally `distinctDeviceThreshold`, and `cooldownSeconds`. Distinct-device threshold cannot exceed event threshold. A device threshold is not a unique-person count. There is no percentage/rate denominator field in this schema.

For “notify when HTTP failures exceed 5%,” explain the missing rate condition and offer an explicit alternative the user can choose. Do not save “5 failures” as though it meant 5%. Cooldowns suppress repeated notifications rather than remove the underlying errors. Destination-level cooldown and rule-level policy can both matter; inspect actual history/suppression reasons.

Every rule destination must be an enabled, undeleted destination in the same project. Readiness or a matching condition does not prove delivery, and disable/delete operations do not recall queued or already accepted notifications.

## Preview versus external test

- `preview_alert_rule`: no saved mutation or delivery. It matches the provided scalar sample fields and supported EVENT properties; nested objects/lists are not a general-purpose condition engine. It does not evaluate threshold accumulation, cooldowns, or distinct-device windows.
- `test_alert_destination` / `test_alert_destination_draft`: real email/Slack/webhook or other supported outbound test. Disabled state does not turn it into a dry run. Confirm the actual destination identity before sending; its URL/contacts may be redacted from read tools.
- Destination save/update: configuration change, not a test send. An enabled target update can change routing for all referring rules. Preserve omitted compatible credentials according to the live tool; do not reconstruct them from redacted output.

Keep credentials and webhook URLs out of the answer. A test timeout can occur after successful delivery; inspect state rather than send again automatically.
