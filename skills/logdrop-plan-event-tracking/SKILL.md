---
name: logdrop-plan-event-tracking
description: Design or audit a LogDrop event tracking plan for business goals, define missing custom-event schemas when requested, and specify emission and verification steps. Use to decide what to measure before building a funnel or journey; SDK installation and conversion analysis are separate workflows.
---

# Plan event tracking

Translate a business question into the smallest useful event contract: what happened, where to emit it, which properties are needed, and how to verify the measurement. A registered schema is not an emitted event.

## Audit before proposing new events

Resolve the selected LogDrop connection/project through context or `list_projects`. Read the live tool schemas. Clarify the business outcome only when it materially changes the plan: a purchase confirmation is different from tapping a purchase button, and a signup start is different from account creation.

Use `list_event_definitions` and relevant `get_event_schema` calls to reuse existing/default events. Inspect bounded `list_event_summaries`, `get_event_summary`, or `get_event_parameters` when actual coverage or observed property types matter. Discovery is a catalog, while counts are observations. Empty data can reflect missing instrumentation, date/retention limits, or an unshipped feature; it does not prove that customers never took the action.

Do not create a second event merely because its name differs from a business label. Check meaning, trigger, property types, and current producers first. Do not recreate hidden/internal SDK events as visible custom events to work around access restrictions.

## Specify an implementable contract

For each necessary event, identify:

- The business fact and exact emission point: once the app has observed the authoritative success/failure, not every render, screen recomposition, retry callback, or button tap unless those interactions are the actual metric.
- Existing event/code to reuse, or a proposed new name. Names must satisfy the current validator; use a letter first and then ASCII letters, digits, or underscores. Current event-name matching ignores case while property names are case-sensitive; preserve the live schema rather than silently renaming existing producers.
- Only properties required for segmentation, diagnosis, or the intended measure, with explicit types, units, and business definitions. Distinguish amount from minor units, milliseconds from seconds, and event properties from custom user attributes.
- Identity/session behavior, including anonymous-to-authenticated transitions where relevant. Do not treat a device UUID or order ID as the application's user identity. Avoid unnecessary personal data, credentials, payment details, or unbounded free text.
- Expected repeat behavior and verification: a retry/re-render can create multiple reports. An order/reference property may support diagnosis but does not itself make the SDK/backend deduplicate events.

If source is available, locate the relevant business callbacks and existing instrumentation. Propose the smallest insertion points. Make application code changes only when the requested scope includes implementation, using current official SDK docs for the actual framework/API. Do not install or upgrade the SDK just to produce a tracking plan.

## Register only authorized schema changes

For a requested new definition, use `preview_custom_event_definition` with the appropriate create/merge mode and inspect the result before `create_custom_event_definition` or `merge_custom_event_definition`. The server allocates codes; preview codes are provisional. Merging preserves omitted existing fields and cannot remove, rename, or incompatibly retype them. Discuss a compatible migration when the desired contract conflicts with an existing type instead of forcing it through.

A request for a plan authorizes no saved schema changes by itself. After an uncertain create, read definitions before retrying. Never claim schema creation backfills past data or implements SDK emission.

## Deliver and verify

Return a compact table of business action, existing/proposed event, trigger, property types/units, intended consumers, and verification step. Mark each item as already observed, defined but unverified, or proposed. Include any missing identity/coverage assumptions that affect funnel or journey use.

When implementation is requested and tested, use a small known test action/version/device and relevant event reads to verify actual records/properties. Do not derive project-wide completeness from one sample or poll indefinitely for delayed ingestion. Hand off a concrete tracking contract for the later funnel/journey; do not automatically create an analysis or campaign.
