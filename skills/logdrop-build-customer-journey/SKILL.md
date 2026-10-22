---
name: logdrop-build-customer-journey
description: Design, validate, create, copy, or edit a LogDrop Customer Journey automation and explain its saved flow. Use for event-triggered follow-ups, branching and waits; historical campaign performance and Event Analytics conversion measurement are separate tasks. Publication stays in the panel.
---

# Build a Customer Journey

Translate the requested business behavior into a complete saved graph with explicit entry, branching, timeout, messaging, and exit behavior. Keep draft creation distinct from live execution.

## Resolve the business rule

Use the selected connection/project or `list_projects`, then the live tool schemas. For an existing flow, use `list_customer_journeys` / `get_customer_journey` and retain the exact `updated_at` revision. IDs from Event Analytics are not journey IDs.

Identify the entry event, eligibility conditions, timing, success/cancellation event, channel/content, and reentry policy. Ask only for material choices that cannot be established from the request or existing flow. Do not decide an audience, consent value, deep link, or message timing on the user's behalf.

Discover exact events/properties with `list_event_definitions` / `get_event_schema`, and observed suggestions with `get_event_property_suggestions`. For SMS/WhatsApp phone and consent attribute names, or related audience planning, use `list_segment_attribute_keys`. These user attributes are not event properties or journey CONDITION sources. Key suggestions do not provide values, consent, or future recipient counts.

Read `get_messaging_configuration` when channels are involved; use `list_whatsapp_templates` for a WhatsApp template. Configured flags do not prove live credentials. Never invent provider IDs; the server resolves supported connections. A graph can be valid but not ready for publication.

## Construct and validate the graph

Read [graph review](references/graph-review.md) for supported node semantics and common marketing mistakes. Use the live camelCase write schema and translate snake_case read fields explicitly. Assign unique graph-local IDs to new nodes; retain existing IDs/routes that should remain.

Validate a never-published draft with `validate_customer_journey_draft`; use `validate_customer_journey` when validating a proposed change to a previously published flow. Inspect returned errors and correct the intended graph rather than dropping branches to pass validation.

Use `create_customer_journey_draft` or `update_customer_journey_draft` for authorized draft changes. Updates replace the full definition: preserve every intended route, message, setting, and attribution. For copying, run `preview_customer_journey_copy` first with the exact source revision, new name, and intended target project, then use `copy_customer_journey_draft` if requested and supported. Do not assume channel configuration or event codes transfer across projects.

If a create/copy response is lost, inspect the destination's saved journeys before retrying; these operations can already have created a draft.

## Handle live flows deliberately

Editing a previously published flow with `update_customer_journey` can pause an ACTIVE journey, while older instances keep their published version. Read `get_customer_journey_publish_impact`, explain the actual effect, and follow the tool's fresh confirmation requirements before a live edit. Do not silently use the live-update tool when a draft-only edit fails.

Read back the saved graph and current revision. Publication, republishing, and resume use **`prepare_customer_journey_publication`**. Return its clickable `panel_url` and state that nothing was published or sent. The human reviews the saved flow and existing-run strategy in the panel. Never automate Publish or call another API to bypass this boundary.

For performance questions, `get_customer_journey_stats` reports run counters, not unique people, conversions, recipient counts, or delivery receipts. A saved graph is not an observed traffic diagram. Label visualizations as configuration/draft unless real measured counters support the labels.

Report the saved/draft status, readable flow, choices and warnings, validation/read-back result, and the panel link when publication was requested. Unknown future reach stays unknown.
