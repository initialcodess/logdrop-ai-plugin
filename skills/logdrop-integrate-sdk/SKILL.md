---
name: logdrop-integrate-sdk
description: Install, upgrade, or troubleshoot the LogDrop SDK in an application and verify integration signals. Use for native iOS/Android, React Native, Flutter, or a supported web setup; not for installing an MCP client connection.
---

# Integrate the LogDrop SDK

Deliver a working application integration, with a clear distinction between code changes, a successful build, and telemetry actually observed by LogDrop.

## Establish the setup

Reuse the selected LogDrop connection and project; otherwise resolve them with `list_projects`. Read the live tool schemas before calling them. Do not silently choose between production and another environment.

Inspect the application manifest, dependency lockfiles, initialization path, and existing LogDrop setup when source access is available. Identify the actual framework and target platforms. A React Native or Flutter app can use the android/ios collecting families; `sdk_type` alone does not identify its framework. Ask for the framework when neither the project nor the source establishes it.

Use `get_sdk_onboarding_status`, `get_sdk_setup_guide`, `get_project_access`, and `list_project_packages` as needed. Reuse already returned values. Choose `app_id` or `web_app_id` for the intended SDK; an App ID is not a bundle ID, package name, OAuth token, or Analyzer license. Read the real package/bundle identifier from the target app rather than inventing one.

## Implement the smallest complete change

Read the current official guide for the framework and relevant feature before editing. For an upgrade, read its changelog and compare it to the installed version. See [integration references](references/integration.md) for guide links and feature checks. Do not copy version numbers or API calls from this skill.

Preserve the app's startup lifecycle, existing identity/consent handling, build variants, and unrelated dependencies. Avoid duplicate initialization or double instrumentation. Follow documented native setup for bridges when required. If docs or source cannot be read, identify the gap and provide a scoped plan rather than claim implementation.

The user's integration request can authorize beginning/resuming onboarding and recording genuine progress under the tools' approval requirements. `start_sdk_onboarding`, `resume_sdk_onboarding`, and `update_sdk_onboarding_progress` change saved state. Do not skip or defer a platform merely to obtain a completed status. Package registration and SDK settings changes have their own tool confirmation requirements.

## Verify honestly

Run appropriate available dependency/build checks for the changed target. Let the user perform any unavailable device/runtime step; do not launch expensive device workflows just to complete a checklist.

After the instrumented app has run, use `verify_sdk_integration` when authorized. This operation can persist onboarding progress. Historical device signals can satisfy it: a successful result alone does not prove that this build sent a fresh event. Correlate fresh activity with the tested app version, platform, and run time where available. Verify requested features separately; basic device registration does not prove HTTP, crash, push, and custom-event coverage.

If signals are pending, explain exactly what the user needs to run and stop polling. Recheck after their action or when a meaningful new signal is available.

Report changed files, framework/platform and App ID source, checks performed, observed versus pending signals, and any remaining manual steps. Never report skipped onboarding as successful integration.
