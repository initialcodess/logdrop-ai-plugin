# IP reputation event interpretation

Code-checked on 2026-10-22. Use this to interpret returned evidence; discover the live event/property schema before constructing filters. Names and short codes below are orientation, not permission to query hidden data or a replacement for the server's schema.

## What the event measures

`ip_reputation_detected` is an assessment of an observed network IP. It does not prove that the device is compromised, its user is malicious, or the application contains a vulnerability. Shared corporate networks, carrier NAT, VPN exits, and hosting networks can represent many unrelated clients.

The current backend uses threat-list matches for reputation and IPinfo Lite for network/country enrichment, with an additional ASN/organization-based potential-datacenter heuristic. These sources do not provide equivalent certainty or coverage. False/absent flags are not a universal clean-IP certificate.

## Properties

| Schema name (short code) | Interpretation |
| --- | --- |
| `ip_address` (`ip`) | Observed network address; potentially shared or changed since the event. Minimize disclosure. It is not a unique person/device identifier. |
| `risk_score` (`rs`) | Recorded IP assessment on a 0–100 scale. It is not a probability, the SDK's per-signal score, or the dashboard score. Missing source scores can be serialized as zero; do not override contradictory level/reason evidence with a blanket safe verdict. |
| `threat_level` (`tl`) | Recorded IP severity. Current mapping: LOW below 40, MEDIUM 40–69, HIGH 70–89, CRITICAL 90–100. This differs from dashboard Threat Score bands. Preserve unknown/unrecognized levels. |
| `risk_reasons` (`rr`) | Reasons for the classification. `FIREHOL_MATCH:<list>` denotes a list match; `POTENTIAL_DATACENTER_*` denotes the weaker ASN/organization heuristic. Interpret the actual reasons, not an invented attack technique. |
| `threat_lists` (`tls`) | Matched list identifiers, currently such as `firehol_level1`, `firehol_level2`, `firehol_proxies`, `tor_exits`. Multiple lists can overlap; they are not separate attackers or independent incidents. |
| `is_proxy` (`px`) | Proxy-list indicator in this assessment. It does not prove local device proxy settings; false does not exclude an unlisted proxy or a VPN. |
| `is_tor` (`tor`) | Tor-exit-list indicator. It is not evidence of a particular Tor user or an exploit. |
| `is_potential_datacenter` (`pdc`) | Heuristic hosting/datacenter association from ASN/organization. Legitimate cloud traffic is possible; this is weaker than proof of abuse. |
| `usage_type` (`ut`) | Optional source classification. The current processing path leaves it unset; do not invent residential/mobile/business categories. |
| `country_code` / `country_name` (`cc` / `cn`) | Network-location enrichment, not verified physical location or nationality of a person. |
| `autonomous_system_number` / `organization` (`asn` / `org`) | Network allocation/operator context, not the attacker's identity. Shared provider membership is not shared intent. |
| `action_signature` (`sig`) | Optional action-correlation value. Its presence is not proof that a device received or enforced an action. |

Optional properties can be absent rather than false/empty. Read returned JSON types; distributions can omit or truncate values.

## Timing and coverage

The current emitter creates this event for MEDIUM/HIGH/CRITICAL assessments with a known device ID, not every IP lookup. Low-risk results, disabled processing, unavailable sources, or missing device attribution can all leave no visible event. Reputation can be cached or refreshed asynchronously; an event timestamp is not proof of a new external lookup at that exact instant.

These events are backend-generated. The current `session_id` marker `backend-ip-reputation` is synthetic, not the user's SDK session. Device/app metadata can come from the recorded device state at processing time. Do not join that marker to application logs as a real session or claim the metadata proves the exact app state when the network address was observed.

Prefer relevant counts/reason distributions, then a small number of actual records when device context is needed. Use policy metadata/settings to explain configured responses; do not automatically block the IP/device, change rules, or send it to an external lookup service.
