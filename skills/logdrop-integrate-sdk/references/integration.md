# Integration references

Read only the relevant framework guide and the feature pages it links to:

| Framework | Guide | Changelog |
| --- | --- | --- |
| Native iOS | https://developer.logdrop.io/docs/sdk/ios | https://developer.logdrop.io/docs/sdk/ios/changelog |
| Native Android | https://developer.logdrop.io/docs/sdk/android | https://developer.logdrop.io/docs/sdk/android/changelog |
| React Native | https://developer.logdrop.io/docs/sdk/react-native | https://developer.logdrop.io/docs/sdk/react-native/changelog |
| Flutter | https://developer.logdrop.io/docs/sdk/flutter | https://developer.logdrop.io/docs/sdk/flutter/changelog |

For other supported targets, follow the current `integration_documents` returned by the onboarding tools or the official documentation navigation. Do not substitute a mobile guide for web setup. If a guide is unreachable, report that limitation; do not invent APIs from a different SDK.

## Feature-specific completion

- **Initialization:** check the correct application startup entry point and build configuration. Preserve an existing integration rather than installing a second one.
- **Identity:** connect application login/logout to the documented SDK identity lifecycle when requested. Do not invent identifying values or collect additional personal data to make a demo work.
- **Custom events:** define the business action and trigger first. Inspect `list_event_definitions` and `get_event_schema` before creating another event. New event/property names must satisfy the live validators; use ASCII letters followed by letters, digits, or underscores, starting with a letter. The server allocates codes. Creating a schema does not emit an event or backfill history.
- **HTTP:** use the documented client/library integration and existing payload-redaction policy. Metadata capture and body/header capture are separate. Do not enable sensitive payload collection merely to prove integration works.
- **Crash resolution:** read the current symbol/mapping instructions for the actual framework and build variant. A raw stack trace and a symbolicated release trace are different levels of verification. Use `prepare_crash_dsym_upload` for a human symbol-archive upload when needed; do not load archives into tool arguments.
- **Push:** distinguish SDK permission/token integration from a configured provider. Use the panel review flow for any real test send; do not silently send a test campaign.

Record progress supported by actual evidence. A build can pass while delivery is blocked by consent, connectivity, capture settings, or delayed ingestion. Investigate the relevant cause instead of marking platforms deferred.
