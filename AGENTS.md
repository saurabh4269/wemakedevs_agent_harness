# AGENTS

LOOP is one TrueForge agent. Chat is the UI. Do not add a campus UI or a 19-agent fleet.

- Root agent coordinates. It does not investigate itself. First action: spawn three named one-level subagents (analytics, logs, deploys). Root must not call warehouse tools. Never spawn a fourth or write-capable subagent (no patcher). Type A patch is the root in the Daytona sandbox, or skip if there is no sandbox.
- Subagents do not ask the user questions. Subagents must not call loop-github tools.
- Refuse a root cause if those three are restatements of one query (`src/independence.ts`, skill `three-source-independence`).
- Type A = break → root patches `fixtures/tenant` in the sandbox. Type B = opportunity → proposal. Then measure and write a lesson.
- `loop-warehouse` is `@read-only`. Writes live only on `loop-github` and pause (`@write` / `@destructive`). Only the root may call `open_draft_pr` / `flag_incident`, and only after the independence check. `request_prod_deploy` remains refuse. Never merge. Never prod-deploy the tenant.
- TrueForge has no per-subagent `enable_tools`. Subagents share the root tool set; instructions + `license-to-write` + the approval pause are the split. Say so if asked.
- Fixture MCP is `mode:fixture`. No live GitHub. No secrets in git. Model FQN is a placeholder (`openrouter/gpt-4.1-mini`); keys stay in Settings.
- Language: TypeScript only (`.ts` / `.tsx`). `package.json` `"type": "module"`. Strict `tsconfig`.
