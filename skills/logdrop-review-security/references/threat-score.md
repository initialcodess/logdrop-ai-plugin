# Threat Score, device risk, and event scores

Code-checked on 2026-10-22. Preserve live tool interpretation fields when they differ from these notes. These scores prioritize investigation; none is a probability of compromise or a universal application health grade.

| Measurement | Meaning and limits |
| --- | --- |
| IP reputation event `risk_score` | Assessment of an observed IP from reputation/list/enrichment evidence. Its level bands differ from dashboard bands. |
| SDK risk/bot signal score | SDK/version-specific environment/behavior assessment. Some scores describe a signal and others a category; not a project-level rate. |
| `get_device_detail` risk score | Stored bounded device score based on recent risk-event contributions, using the current 30-day lookback, event-type weighting and age decay. It is not the latest single event's score, a sum of event counts, or proof of present enforcement. |
| `get_dashboard_threat_scores` | Stored project Threat Score history and latest available score. Current calculation averages stored device risk over devices considered active during that calculation's 30-day lookback, with missing device scores contributing zero. Each point is a retained calculation, not a fresh score for the chart's selected date range. A zero is also possible for an empty eligible population. It is not an arithmetic average of IP reputation events. |

Repeated same-type evidence is not simply added as a new independent risk contribution. Do not try to reconstruct these scores by summing sample events, property buckets, or a page of devices. Stored scores and their underlying evidence can be calculated at different times; not all components are exposed through visible-event tools.

## Interpret the chart

Use `get_dashboard_threat_scores` for the relevant project/dates. The current dashboard level bands are LOW below 25, MEDIUM 25–less than 50, HIGH 50–less than 75, and CRITICAL 75 or higher. Do not apply IP reputation's 40/70/90 cutoffs to this chart.

When a chart helps and the client supports it, plot the returned daily points with the requested range and label it **Threat Score (0–100; higher means greater assessed risk)**. Preserve missing dates as missing; do not invent zero points, exact times, or a causal story. Stored date labels have no supplied timezone. Show the latest score separately when its date falls outside the selected series, or disclose that its date cannot be established from the response.

A low project average can dilute an isolated high-risk installation, and a falling score can reflect population or evidence-aging changes rather than a fix. Inspect relevant event reasons, anomalies, and known-device details before claiming improvement. Do not enumerate all devices merely to recreate the chart. Correlate dates/releases cautiously and distinguish an observed change from a verified cause.

Keep security posture separate from availability, crash-free rate, conversion, or the stored version-health assessment. Do not invent a combined “health score” by averaging unrelated metrics.
