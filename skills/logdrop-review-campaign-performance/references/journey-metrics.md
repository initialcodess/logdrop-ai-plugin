# Journey measurement limits

`get_customer_journey_stats` returns stored journey-wide run counters across published versions: entered, active, waiting, completed, exited, and failed. The current tool has no date, version, cohort, node, or channel filter and returns no per-run history or delivery receipts.

- **Runs are not people.** Repeat entries/reentry can create several runs for one identity. Do not divide these counters by a separate device estimate and call the result a person conversion rate.
- **Active excludes waiting.** Do not count waiting runs as failures. `get_customer_journey_publish_impact.active_instances` has different semantics: its current impact population includes ACTIVE and WAITING.
- **Completed is a run outcome.** It is not proof of purchase, successful message delivery, open, or click. A configured EXIT label does not supply a measured business conversion.
- **Exited includes cancellation.** An exited run is not automatically an uninterested customer or an unsubscribed user.
- **Counters are best effort.** Concurrent transitions, missed metric writes, and clamped values can make them inconsistent. `stats_record_present=false` returns panel-compatible zeros, not proof the journey never ran. `counters_updated_at` and `observed_at` are different clocks and do not establish complete ingestion.
- **No per-node measurements.** The saved graph can show a consent-related skipped route, but the current stats cannot count how many runs took it. Describe a possible explanation, not an observed skip rate. SMS/WhatsApp configuration and run completion do not establish provider delivery outcomes.
- **Versions matter.** Current saved nodes/settings can differ from the published graph used by older running/completed instances. Do not attribute old outcomes to a message just edited today.

Present available counters directly with their coverage. A completed/entered arithmetic ratio may describe stored run outcomes if the counters are usable, but cannot be relabelled as a purchase/recipient conversion rate. Explain inconsistent or missing counters instead of repairing them into an invented partition.

For date-bounded business conversion, use a separately defined measurable event funnel when available. It has its own identity/window/provisional semantics and does not automatically become a per-journey attribution report.
