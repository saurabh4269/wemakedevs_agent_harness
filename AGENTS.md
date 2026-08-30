# AGENTS.md

Operating system for any coding agent in this repo. Read this first. Then [docs/README.md](docs/README.md). Live state: [docs/status.md](docs/status.md).

Keep `docs/` current. Rewrite [docs/status.md](docs/status.md) when PRs, blockers, or URLs change. Do not append chat dumps.

## What LOOP is

One TrueForge investigation agent. Not a fleet. Chat is the UI.

Given a product signal, LOOP spawns three one-level subagents (analytics, logs, deploys), refuses a root cause if those three are restatements of one query, then either patches a break in the sandbox (Type A) or writes a proposal (Type B). Writes pause for a human. LOOP never merges. LOOP never prod-deploys the tenant.

Hackathon hero card is **Incident responder**. That is this product.

## Hard rules

1. **TypeScript only.** `.ts` / `.tsx`. `"type": "module"`. Strict `tsconfig`. No Python product code. No untyped JS.
2. **No Cursor CloudAgent** unless Saurabh explicitly asks. Work in this repo with `gh` as `saurabh4269`.
3. **No secrets in git.** Never commit `.env`, `node_modules`, keys. `.env.example` keeps empty slots. Box secrets path: `/home/box/.secrets/loop-trueforge.env`. Do not echo that file.
4. **Qodo PR trail.** Branch → PR → `/agentic_review` → fix High or dismiss in-thread with a reason → follow-up review → **human** merge. Direct pushes to `main` do not count. You never merge.
5. **Never merge.** Agents open PRs. Humans merge after Qodo is clean.
6. **Never prod-deploy the tenant.** `request_prod_deploy` always refuses. Fixture GitHub never talks to live GitHub.

## Architecture

Root coordinates. Root does **not** investigate itself.

Spawn exactly three **one-level** subagents. Distinct questions. Subagents do not ask the user. Subagents do not call `loop-github`.

| Subagent | Tool | Must contribute |
| --- | --- | --- |
| analytics | `query_analytics` | metric, funnel step, segment |
| logs | `query_logs` | error, code path, timestamp, count |
| deploys | `query_deploys` | service, release time, version/commit |

**Independence** (`src/independence.ts`, skill `three-source-independence`): if the three reports collapse (same claim, same evidence id, high overlap), refuse a root cause. Do not patch. Do not open a PR.

If independent, skill `type-a-vs-b`:

- **Type A** (break): patch `fixtures/tenant` in the **sandbox**, measure, write a lesson.
- **Type B** (opportunity): proposal only. Do not patch production.

Then skill `license-to-write`. Writes live only on `loop-github` (`open_draft_pr`, `flag_incident`, `request_prod_deploy`). `require_approval_for_tools` is `@write` and `@destructive`. Wait for Allow/Deny.

**Fixture MCP** is `mode:fixture`. Warehouse `@read-only`. GitHub connector is fake. Official page wants tools **connected, not mocked** — fixture warehouse is an honest Best Use risk. Conversion-drop story stays on fixtures; live GitHub write can stay gated. Do not pretend fixtures are production.

**Honest shared-tool-set limit.** TrueForge dynamic subagents inherit the **root** MCP tools. There is no per-subagent connector list. The warehouse/github split is enable lists + approval + skills, not isolation. Say so if asked. A subagent can see `open_draft_pr`; deny the pause.

Skills require sandbox. Daytona key needs **Sandboxes** access and **Snapshots write**. LOOP spec sets `config.sandbox.enabled: true`. If Daytona 401s, skills will not load — fix that; do not silently drop the three-subagent path.

## Layout

```
agents/loop.json          TrueForge agent { name, manifest }
fixtures/mcp/             mode:fixture warehouse + github
fixtures/tenant/          patchable checkout (enterprise alias still enterprise-annual after *-v3)
skills/*/SKILL.md         git-backed skills
src/                      independence, write-policy, spec
scripts/import-loop.ts    SDK import
tests/
apps/loop-ui/             optional TrueForgeUI embed — on feat/loop-ui if present. Do not clobber.
docs/                     curated handoff. status.md is the living file.
```

## How to run

Root [README.md](README.md). Local: `npx @truefoundry/trueforge@latest` → http://localhost:8790 (SQLite, no login). Compose: :8791 (Postgres + Redis). Intended public host: https://loop.thexplorers.xyz with `PUBLIC_BASE_URL`.

TrueForge wants Node **22.14+**. Kickoff blog says Node 22+. This package `engines.node` is `>=22.14.0` (PR #1). Tests can still run on Node 20.

Prefer OpenRouter. NVIDIA NIM backup. Daytona required for skills/sandbox.

## What NOT to build

- A 19-agent fleet. One agent, three one-level subagents.
- A campus / dark SOC UI. Light Apple-like if themed.
- A Product OS / ADK / Goodman / Bhoonaksha port. Prior art only. Do not ship it. Do not mention it in README, form, or judge-facing copy.
- Auth for judges. Login ON only if live GitHub writes require it.
- Custom chat unless it is a themed `@truefoundry/trueforge-ui` embed (`apps/loop-ui`). Sai: stock TrueForge UI unless the product needs another.

## Demo prompt

TrueForge chat, agent `loop`:

> Checkout conversion dropped about 19% since Friday afternoon on desktop Chrome. Find the root cause. If it is a break, patch the tenant in the sandbox and open a draft PR. Do not merge. Do not deploy prod.

Expect three subagent threads, Type A patch on `fixtures/tenant/src/checkout.ts` (enterprise alias still `enterprise-annual` after `*-v3`), pause on `open_draft_pr`. Collapsed story (`LOOP_STORY=collapsed`) must refuse a root cause.

## Docs

[docs/README.md](docs/README.md). Living state: [docs/status.md](docs/status.md).
