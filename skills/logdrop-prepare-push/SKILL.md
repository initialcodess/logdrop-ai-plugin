---
name: logdrop-prepare-push
description: Prepare a LogDrop push campaign with the intended audience, platforms, content and action, returning a prefilled panel link for human sending, or look up one send's status. Use for one-off campaign setup; broader engagement comparison and optimization is a performance-review task.
---

# Prepare a push campaign

Produce the requested campaign form and a clear handoff. This skill cannot send, queue, or schedule a push through MCP.

## Establish the campaign

Resolve the selected connection/project with context or `list_projects`. Read the current `prepare_push_notification` schema. Determine the requested platforms, one audience mode, title/body, and intended message action. Keep an explicit platform exclusion; never add iOS or another platform the user excluded.

Audience modes are mutually exclusive: all users, custom-attribute segment, exact user IDs, or exact device IDs. Do not turn a few sample users or funnel actors into an entire segment. Explicit ID list bounds are form limits, not a maximum campaign reach.

For a segment, use `list_segment_attribute_keys` for exact custom-user attribute suggestions. They are not event properties and not an allowlist. Preserve user-supplied dynamic keys and the requested value's JSON type. The catalog does not establish consent or valid values; ask for material missing values rather than enumerating all people or guessing them.

Use `get_messaging_configuration` when channel/platform readiness matters. Missing configuration calls for setup guidance, not silently changing credentials or switching platforms. A configured flag is not proof a provider accepts the credentials.

## Build the form accurately

Use the live push definition, not a journey PUSH node payload: their structures differ. For this tool, `message.text` is the body; use the documented schema version, explicit platforms, and supported message/action combinations. Fit title/body and platform override limits without silently changing the user's meaning.

For a deep link or in-app message, use the requested target/mode/buttons and available documented options. Do not invent an app route or visit a payload URL to test it. A silent notification can execute an SDK command and is not a dry run; only prepare one when that is actually requested.

`preview_push_notification` can estimate token-eligible devices when helpful; it is optional and does not reserve an audience. Counts can overlap across providers and do not prove consent, unique people, delivery, or final reach. Unknown counts stay unknown.

Call `prepare_push_notification` and return the exact clickable `panel_url` with expiry information when supplied. Explain that the form is prefilled and the user must review and send in the panel. No message was sent or queued. Do not automate Send, attempt a direct API, or treat a request to “send” as permission to bypass the panel-only boundary. Preparing a form has no artificial 1000-recipient cap.

## Inspect results only when they exist

For a user's question about an existing send, use `list_push_messages` / `get_push_message`. Provider records may repeat the campaign totals; do not sum duplicates. Received/click events are not unique people, and provider acceptance is not confirmed delivery. Missing event counters remain unavailable, not zero.

Report the selected project, platforms, audience rule, content/action summary, readiness limitations, and the human handoff. Do not describe a prepared form as a campaign already present in send history.
