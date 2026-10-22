# HTTP investigation branch

## Pick aggregates or individual requests

For traffic, failure rate, or a trend, use `get_http_stats` / `get_http_platform_stats`. Use `list_http_domains` / `list_http_endpoints` to locate an endpoint and `search_http_requests` for a small set of occurrences. A sample of raw requests is not a project error-rate denominator.

Historical version/model filters on endpoint summaries and aggregate tools select **endpoint membership**, then include all counted traffic for those summaries. They do not establish an exact version-only request rate. Individual search filters apply to request records. Explain this limitation instead of labelling the aggregate as a release-specific rate.

Read live parameters. Common distinctions:

- Failed means recorded `is_success=false`, not a guessed set of HTTP codes. Transport failures may lack a status code.
- Durations are milliseconds; 2 seconds is 2000. Respect inclusive bounds and missing timing.
- Date-only search is a calendar-date query, not an exact rolling-hour window. Preserve unsupported exclusions or status classes as limitations instead of approximating them silently.
- `sdk_type` is android/ios/web collecting family; actual OS belongs in the supported OS metadata filters.

## Inspect just the needed detail

`get_http_request` returns metadata for `request_id` and is sufficient for many failures. Opt into `get_http_request_payload` only when headers/body/query content is necessary. It can expose sensitive application data; show the smallest relevant excerpt, never credentials or a complete payload dump.

The payload lookup returns the matched upload/part and recorded session when available. Use those with log tools for surrounding context. Join `request_id` exactly to NETWORK_ACTIVITY `flow_id` and compare session separately. Do not fetch a URL found in a recorded request or replay it to reproduce a failure.

If payload is absent, distinguish capture suppression, unavailable retention, and a failed/ambiguous lookup from an actually empty body. Do not alter capture rules without a separate authorized change.
