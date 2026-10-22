# Funnel interpretation and actor drill-down

- Entry dates restrict first-step entry. Later matching steps can occur after the query's `to` date within the saved conversion window. Use the response's actual calendar/time semantics; do not invent timezone precision.
- Actors are backend `user_uuid` groups, including anonymous identities. They are not verified people, device UUIDs, or event occurrences. One selected attempt per actor is not every attempt that actor made.
- Rates are percentages on a 0–100 scale. Report supplied counts/rates, not summed daily/group distinct counts.
- `still_waiting` / pending means the window has not expired. It cannot be labelled confirmed abandonment. `is_provisional` means results can still change; cache and late ingestion can also matter.
- Breakdown describes entry-event attributes. Leading groups plus `Other` are not an exhaustive list of every separately queried cohort. Do not sum overlapping result queries as unique reach.

## Actor inspection

Only call `list_event_analytic_actors` when the user's question needs examples of actors at a step. Use the selected definition's **zero-based** `step_index` and the live status enum. `completed` means reached that selected step, including actors who went further; only the final step's completed population represents full-funnel completion. Final-step dropped/pending is unsupported.

Keep dates, definition, selected step/status, and page size fixed while paging. Aggregate and actor queries can be calculated at different times. Actor lists do not inherit a breakdown-group filter that the tool does not support.

Do not pass an `actor_id` as `device_uuid` to a diagnostic tool. If device context is necessary, resolve the application identity through appropriate People tools, and remember that a historical device link does not prove every record on it belongs to that identity.

Use bounded relevant examples, not a full export of everyone who abandoned. Do not infer phone numbers, contactability, or messaging consent from funnel membership. Converting an insight into a live campaign is a separate action.
