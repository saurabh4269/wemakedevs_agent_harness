# AGENTS

LOOP is one TrueForge agent. Chat is the UI. Do not add a campus UI or a 19-agent fleet.

- Root agent coordinates. It does not investigate itself. First action: spawn three named one-level subagents (analytics, logs, deploys). Root must not call warehouse tools. Root must not spawn a patch subagent until those three reports exist.
- Subagents do not ask the user questions.
- Refuse a root cause if those three are restatements of one query (`src/independence.ts`, skill `three-source-independence`).
- Type A = break → patch `fixtures/tenant` in the sandbox. Type B = opportunity → proposal. Then measure and write a lesson.
- `loop-warehouse` is `@read-only`. Writes live only on `loop-github` and pause (`@write` / `@destructive`). Never merge. Never prod-deploy the tenant.
- Subagents share the root tool set; enable lists + approval + skills are the split. Say so if asked.
- Fixture MCP is `mode:fixture`. No live GitHub. No secrets in git. Model FQN is a placeholder (`openrouter/gpt-4.1-mini`); keys stay in Settings.
- Language: TypeScript only (`.ts` / `.tsx`). `package.json` `"type": "module"`. Strict `tsconfig`.
