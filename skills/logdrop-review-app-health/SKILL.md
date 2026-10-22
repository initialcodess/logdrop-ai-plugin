---
name: logdrop-review-app-health
description: Review overall LogDrop application health or release quality and prioritize problems across crashes, HTTP, activity, and anomalies. Use for broad health or release-status questions; a known crash, request, or anomaly should use its focused investigation.
---

# Review application health

Produce a small, prioritized assessment with comparable measurements and a next action for each important issue. Do not run every tool simply because the question is broad.

## Choose a meaningful scope

Resolve the connection/project through existing context or `list_projects`. Identify the requested release, SDK family, and window. Use the live tool schemas and documented defaults; state the actual dates used. A tool accepting calendar dates cannot promise an exact rolling-hour assessment.

For a release comparison, choose an explicit baseline and align observation windows, SDK families, and available traffic. State when a tool cannot isolate the release precisely. Current device state, date-bound activity, and lifetime counts are different views.

## Start with a few independent signals

Pick the sources relevant to the question and granted access:

- **Crash health:** `get_crash_overview`, then a relevant `get_crash_daily_metrics` series or `get_crash_distribution` when it explains a change. Use the supplied range-level rates; do not average daily percentages or add daily distinct estimates. A default 100% with a zero denominator is not evidence of healthy traffic.
- **Network health:** `get_http_stats` and, when needed, `get_http_platform_stats` or endpoint summaries. Compare recorded failure rate, timed-request duration, and traffic. Never invent percentiles. Version/model aggregate filters can select endpoint membership rather than the exact request population.
- **Activity and coverage:** `get_event_overview` and relevant `get_dashboard_daily_stats` / `get_dashboard_project_status`. Upload activity is not a count of application log lines; device status is not online presence.
- **Investigative leads:** `get_anomaly_summary` and a small targeted `search_anomalies` result. Stored confidence/root-cause assessments need corroboration.

Use `list_app_version_summaries` / `get_app_version_summary` or a relevant weekly report only when a retained assessment helps. Label snapshots by their period; do not treat their delivery state as app health. An inaccessible source leaves partial coverage, not a failed entire review.

## Prioritize and drill down

Rank findings using severity, measured impact, recurrence, recency, and release evidence. A rare critical incident can outrank a common minor error. Keep error occurrences, installations, anonymous identities, sessions, and people distinct.

Investigate the strongest signals with the corresponding detail tools, reusing scope and IDs. Corroborate with a relevant crash occurrence, HTTP request, or anomaly/log sequence. Avoid raw-record pagination to rebuild statistics already available as aggregates.

If traffic or expected signals are absent, check the narrow plausible coverage issue before claiming the app is healthy. Do not enable collection or change settings to manufacture data. Stop when there is enough evidence to prioritize next work.

## Present an actionable result

Summarize overall status with explicit coverage, then list the main findings with metric/window/baseline, supporting evidence IDs, confidence, and recommended next action. Include unavailable data and insufficient post-release observation. A diagnosis does not authorize closing issues, changing alerts, or editing the application; perform fixes only within the user's requested scope.
