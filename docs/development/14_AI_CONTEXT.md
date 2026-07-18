# AI Context

## 1. Runtime and baseline

- Runtime: Node.js 20+, npm, TypeScript strict mode and ES Modules.
- Browser integration: Playwright only behind an infrastructure port.
- Architecture: modular monolith with `core`, `application`, `infrastructure`,
  `interfaces`, `modules` and `composition`.
- Active roadmap position: local System Verification complete; remote CI is the
  remaining release gate before Product Owner considers Release 0.1.

## 2. Before every task

Read the AI Guide, executive context, active decisions, Project Roadmap 0.1,
Architecture Baseline, Unified Workflow, own constitution and task
specification. Verify that the task belongs to the active roadmap stage.

## 3. Non-negotiable rules

- No baseline change without ADR or explicit Product Owner decision.
- No direct dependency from business logic or modules to Playwright.
- No secrets, cookies, session data or PII in Git, logs or test fixtures.
- No coordinates or unjustified fixed sleeps.
- No unreported failing checks or implicit scope expansion.

## 4. Current limitation

Current evidence and support runbook are in
`docs/development/23_TASK_AE_014_SYSTEM_VERIFICATION.md`. Do not begin a new
site-specific module before a release decision or separate approved roadmap task.
