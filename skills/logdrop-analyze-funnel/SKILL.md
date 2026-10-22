---
name: logdrop-analyze-funnel
description: Measure conversion and drop-off in LogDrop Event Analytics, preview a proposed funnel, or create/update a saved funnel definition. Use for ordered event progression and conversion questions, not for publishing a messaging automation.
---

# Analyze and build event funnels

Turn the business question into an explicit ordered-event measurement, then report counts, conversion, and waiting states without inventing behavioral causes.

## Resolve the measurement

Reuse a known connection/project or use `list_projects`; read current tool schemas. Determine the goal, ordered events, entry-date range, conversion window, and desired breakdown. If a usable saved funnel exists, use `list_event_analytics` and `get_event_analytic` rather than silently redefining it.

`analytic_id` identifies a funnel definition, `event_code` identifies a registered event, and `property_code` identifies its property. Discover events with `list_event_definitions`; use `get_event_schema` for exact filter codes/types and `get_event_property_suggestions` for observed values or nested fields. Event suggestions are not an allowlist. A user can intentionally filter a valid but not-yet-observed value; preserve its type and explain the evidence limit.

Use `list_event_summaries`, `get_event_summary`, or `get_event_daily_trends` when the question is event volume/trend rather than ordered conversion. Never multiply independent event totals into a funnel result. A registered definition or system template does not prove that events were emitted.

## Calculate before saving when possible

For a saved funnel, call `get_event_analytic_result` with the intended dates and breakdown. For a proposed definition, use `preview_event_analytic` to calculate without creating it. An analysis request alone does not require saving a new funnel. If essential event/filter mappings are missing, ask for the intended action or explain instrumentation needs instead of inventing a code.

Read [result interpretation](references/interpretation.md) before explaining drop-off or inspecting actors. In particular, keep `still_waiting` separate from expired drop-off, explain provisional results, and preserve the entry-date versus conversion-window distinction.

Compare compatible definitions, windows, and populations. A funnel breakdown uses the entry event's attributes; it does not measure later-stage attribute changes. A cohort difference or nearby crash is an investigative lead, not proof that it caused abandonment. If a technical explanation is requested, inspect a relevant example with the appropriate evidence tools rather than asserting causality from a chart.

## Save only the requested definition

Use `create_event_analytic` when the user requests a saved funnel. For an update, read the current definition first: `update_event_analytic` replaces the full definition, and omitted description/breakdown/window can clear or reset them. Preserve unrelated steps, filters, and settings. Input uses camelCase; read responses may use snake_case. Use the live operator/type schema, not operators copied from journey or segment filters.

After an uncertain create response, inspect saved analyses before retrying. Verify the saved definition with `get_event_analytic`, then calculate results if needed. Creating a funnel does not emit events, backfill them, create a journey, or send messages.

Present the question, exact steps/filters/window, entrants/completions and step losses/waiting, relevant breakdown, uncertainty, and practical next experiment. Provide a chart when supported, with the measured scope visible. For a saved change, include its returned ID and verification result.
