---
name: logdrop-review-campaign-performance
description: Evaluate or compare existing LogDrop push campaigns and Customer Journey performance, diagnose weak engagement or run outcomes, and propose evidence-backed improvements. Use for performance/optimization questions; a simple send-status lookup or creating a campaign is a different task.
---

# Review campaign and journey performance

Explain what the available measurements establish, which stage appears weak, and what improvement or experiment to try next. Do not invent attribution, revenue, unique reach, or delivery evidence that the tools do not provide.

## Define a comparable question

Reuse the selected LogDrop connection/project or use `list_projects`. Read live tool schemas. Identify the campaigns/journeys, intended goal, and requested comparison window. Keep push `notification_id` / `record_id`, journey `journey_id`, and funnel `analytic_id` distinct.

If the requested date/version/cohort filter is unsupported by a tool, state the limitation. Do not silently label cumulative counters as “last week” or a current saved graph as the flow that all past recipients experienced. Preserve timestamp/timezone uncertainty, observation times, and unavailable event counters.

## Push campaign branch

Use bounded `list_push_messages` discovery and `get_push_message` for the requested campaign's grouped send results, message details, and recorded received/click events. Provider rows can share one notification ID and repeat campaign-wide totals; deduplicate the campaign before comparing or summing. Never add repeated engagement totals as independent audience counts.

Separate provider acceptance/send state, recorded received events, and recorded click events. These are not verified unique people and not a confirmed end-to-end delivery/open funnel. Missing counters stay unknown, especially when `event_counts_available=false`. Compute a ratio only when its numerator/denominator have compatible meaning and coverage; label it as a recorded-count ratio rather than a unique-person conversion rate. Do not silently clamp an unexpected ratio or assume each interaction can occur only once.

Where a stage looks weak, distinguish delivery/capture gaps from content, platform, timing, and audience hypotheses. Configuration flags do not prove live provider credentials; a failed send is not evidence the copy was ineffective. Do not fetch credentials or send a test as an automatic part of analysis.

## Journey branch

Use `list_customer_journeys`, `get_customer_journey`, and `get_customer_journey_stats`. Read [journey measurement limits](references/journey-metrics.md) before explaining results. Inspect entry conditions, waits, timeout/skipped paths, channel configuration, and reentry behavior as possible explanations, without attaching invented counts to graph nodes.

The current saved graph may differ from versions that produced the counters. `get_customer_journey_publish_impact` can describe current run compatibility when a proposed edit is being considered; it does not reveal a future audience or explain historical per-node performance.

## Connect business outcomes only when measurable

Use actual event definitions/schema and a suitable saved or unsaved Event Analytics funnel when the goal requires observed ordered conversion. `get_event_analytic_result` or `preview_event_analytic` can answer the defined event question, but proximity in time does not attribute those conversions to the campaign. Campaign-specific attribution needs an actually recorded, usable campaign identifier/filter or an appropriate evaluation design; do not infer it from matching titles or a traffic increase.

Do not force hidden internal push events through visible-event tools. Use the push reader's supported engagement counters and disclose any missing attribution path. A purchase event total without campaign linkage cannot establish campaign revenue or ROI.

## Recommend the next action without executing it

Compare only like-for-like populations, exposure time, and measurement coverage. Mark small/incomplete cohorts and still-open conversion windows. Avoid declaring a winning campaign from incomparable raw counts or presenting a proposed A/B test as an experiment already supported/executed by LogDrop.

Return observed stages and evidence IDs, the strongest supported explanation versus alternative hypotheses, measurement gaps, and a prioritized improvement/measurement plan. Performance analysis does not authorize changing active flows, retargeting actors, sending another push, or publishing a journey. If the user later requests an implementation, use the applicable draft/preview and human panel review flows.
