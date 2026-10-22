# Journey graph review

Use current tool validation as the authority. These checks explain the business behavior behind the graph; they are not a second JSON schema.

- Exactly one `ENTRY_EVENT` begins a run. Use at least one reachable `EXIT`, with every branch routed and every referenced node present. New graph-local node keys are different from server-returned journey/event/property IDs.
- `WAIT_DURATION` delays progression. It does not detect a purchase or cancel a reminder by itself.
- `WAIT_UNTIL_EVENT` needs its event branches and timeout route. Define what happens when the success/cancellation event arrives and what happens when time expires. Use the live schema's event/filter representation.
- `CONDITION` supports the documented EVENT or DEVICE source. For EVENT conditions, identify the intended event node; do not treat an arbitrary current user attribute as an event field. Use condition/filter operators from the live journey schema, not the differently named funnel or segment operators.
- PUSH, SMS, and WHATSAPP nodes need complete channel-specific content and routing, including the supported skipped route where applicable. A wait timeout or skipped message must not accidentally fall through to the wrong message step.
- `EXIT` outcome `COMPLETED` describes run termination; it is not proof of a purchase or business conversion. Choose labels that do not misrepresent it.
- Times use seconds. Check each wait/timeout and maximum journey duration together. Reentry eligibility/cooldown is a business decision; do not enable repeated campaigns by default merely because a flow validates.

## Example: abandoned checkout

For “remind users who start checkout but do not purchase within a day,” distinguish the **intended** structure from discovered IDs and actual campaign choices:

1. Enter on the discovered checkout-start event, with any requested filters.
2. Wait for the discovered purchase event within the agreed window.
3. On purchase, exit without sending the abandonment reminder.
4. On timeout, reach the authorized reminder action, then exit.

Do not replace step 2 with a simple delay followed by an unconditional push. Ask about identity, reentry, consent/channel fields, and the reminder content only when they are unresolved and materially affect the flow. Validation and saved configuration do not prove that all eligible behavior will be captured by the SDK.

## Existing versions and runs

`get_customer_journey_publish_impact` describes current runs and compatibility, not future audience size. Old runs can continue on an older published graph even when the current saved graph has changed. A publication link shows current panel state and does not freeze the graph. The human chooses KEEP_EXISTING / MIGRATE_EXISTING / CANCEL_EXISTING where supported; the skill must not choose a hidden strategy.

Pausing is not cancellation or recall of in-flight deliveries. Deletion is not a convenient way to stop or migrate all existing runs. Those actions require their own explicitly requested scope and the live tools' confirmation requirements.
