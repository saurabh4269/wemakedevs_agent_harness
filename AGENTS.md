# AGENTS.md

Operating system for any coding agent in this repo. Read this first. Then [docs/README.md](docs/README.md). Live state: [docs/status.md](docs/status.md). Pitfalls: [docs/learnings.md](docs/learnings.md). How to run/deploy: [docs/runbook.md](docs/runbook.md). Remaining work: [docs/next.md](docs/next.md).

Keep `docs/` current. Rewrite [docs/status.md](docs/status.md) when PRs, blockers, or URLs change. Do not append chat dumps. Do not commit secrets.

## What LOOP is

One TrueForge investigation agent. Not a fleet. Chat is the UI.

Given a product signal, LOOP spawns three one-level subagents (analytics, logs, deploys), refuses a root cause if those three are restatements of one query, then either patches a break in the sandbox (Type A) or writes a proposal (Type B). Writes pause for a human. LOOP never merges. LOOP never prod-deploys the tenant.

Hackathon hero card is **Incident responder**. That is this product.

## Hard rules

1. **TypeScript only.** `.ts` / `.tsx`. `"type": "module"`. Strict `tsconfig`. No Python product code. No untyped JS.
2. **No Cursor CloudAgent** unless Saurabh explicitly asks. Work in this repo with `gh` as `saurabh4269`.
3. **No secrets in git.** Never commit `.env`, `node_modules`, keys. `.env.example` keeps empty slots. Box secrets path: `/home/box/.secrets/loop-trueforge.env`. Do not echo that file. Render keys stay `sync: false` in the dashboard.
4. **Qodo PR trail.** Branch → PR → `/agentic_review` → fix Highs → follow-up review. Direct pushes to `main` do not count as the Qodo evidence trail.
5. **Never prod-deploy the tenant.** `request_prod_deploy` always refuses. Fixture GitHub never talks to live GitHub.
6. **Do not Apply `render.yaml`** on workspace `tea-ctoktrjtq21c73cufog0`. It would duplicate Postgres/Redis. The live web service already exists.
7. **Do not Approve/Deny** film/qualify sessions listed in [docs/status.md](docs/status.md).
8. **Hosted model is OpenAI GPT-5.6 Luna.** Cost-tier. Do not use Sol/Terra on hosted. Local film agent may stay on 4.1-mini.
9. **Do not touch** `heisenbug.in` apex or `www` (Vercel). Only the `loop` CNAME is ours.
10. **Do not mention** prior control-plane work, Goodman, or Bhoonaksha in README, form, or judge-facing copy.

## Architecture

Root coordinates. Root does **not** investigate itself. Root does **not** call `query_*` as direct tools. After the three subagents return: OpenUI (chart + table + Type A/B card) and Code Mode aggregations (`mcp_client`, no `open_draft_pr` in the script).

Spawn exactly three **one-level** subagents. Distinct questions. Subagents do not ask the user. **Never spawn skill names as subagents** (`type-a-vs-b`, `three-source-independence`, `license-to-write`). Loading a skill is not `create_sub_agent`.

| Subagent | Tool | Must contribute |
| --- | --- | --- |
| analytics | `query_analytics` | metric, funnel step, segment |
| logs | `query_logs` | error, code path, timestamp, count |
| deploys | `query_deploys` | service, release time, version/commit |

**Independence** (`src/independence.ts`, skill `three-source-independence`): if the three reports collapse (same claim, same evidence id, high overlap), refuse a root cause. Do not patch. Do not open a PR.

If independent, skill `type-a-vs-b`:

- **Type A** (break): `sandbox.created` means a sandbox exists. Clone `https://github.com/saurabh4269/wemakedevs_agent_harness.git` into the Daytona sandbox (snapshot has no repo). Empty cwd with no `wemakedevs_agent_harness/` is the **normal case and still clones**. If that dir exists without `checkout.ts`, `rm -rf` then clone. Clone at most twice. If still missing, skip and say clone failed — do not loop, do not fabricate tenant sources. Patch `fixtures/tenant/src/checkout.ts` (`enterprise` alias `enterprise-annual` → `enterprise-annual-v3`). Then the root **MUST** call native MCP `open_draft_pr` with `merge: false` and `still_true: true` (not `call_tool`). A written next-steps list is not a substitute. Skipping the write because the cwd looked empty is forbidden.
- **Type B** (opportunity): proposal only. Do not patch production.

Then skill `license-to-write`. Writes live on `loop-github` (`open_draft_pr`, `flag_incident`, `request_prod_deploy`). `require_approval_for_tools` is `@write` and `@destructive`. Wait for Allow/Deny. Never merge. Never prod-deploy.

**Fixture MCP** is `mode:fixture`. Warehouse `@read-only`. GitHub connector is fake (`html_url` is `https://github.example.invalid/loop-tenant/pull/42`). Official page wants tools **connected, not mocked** — fixture warehouse is an honest Best Use risk. Say this out loud in the video. Do not pretend fixtures are production.

**Shared tool set.** TrueForge dynamic subagents inherit the **root** MCP tools. `config.dynamic_sub_agents` is `{ enabled: true }` only — `DynamicSubAgentsConfig` has no per-subagent `enable_tools` / `disable_tools`. Do not invent one. A subagent can see `open_draft_pr`. Demo: deny the extra **patcher** write; approve the **root**.

Skills require sandbox. Hosted Daytona provider is **ready**. LOOP spec sets `config.sandbox.enabled: true`. `ask_user_questions.enabled` is **false** — hosted Nemotron used it to bail.

## Layout

```
agents/loop.json          TrueForge agent { name, manifest }
fixtures/mcp/             mode:fixture warehouse + github
fixtures/tenant/          patchable checkout (enterprise alias still enterprise-annual after *-v3)
skills/*/SKILL.md         git-backed skills
src/                      independence, freshness, write-policy, spec, benchmark, hosted-env
scripts/import-loop.ts    SDK import
scripts/benchmark.ts      LOOP vs chat baseline (`npm run benchmark`)
scripts/start-hosted-trueforge.ts  colocated fixture + TrueForge
heroku.yml                Heroku container stack (web + Postgres + Redis)
deploy/trueforge.Dockerfile
tests/
apps/loop-ui/             optional TrueForgeUI embed
docs/                     curated handoff. status.md is the living file.
render.yaml               Blueprint for a *greenfield* workspace only
```

## How to run / deploy

Full commands: [docs/runbook.md](docs/runbook.md).

- **Local film host:** `npx @truefoundry/trueforge@latest` on `[::1]:8790` (SQLite). **Do not kill it.** Local agent `loop` is `openrouter/gpt-4.1-mini`. Do not PUT that model off 4.1-mini while the sitting pause is the film source.
- **Judge host:** https://loop.heisenbug.in. Render free is exhausted — stand up Heroku with [docs/heroku.md](docs/heroku.md). Do **not** Apply `render.yaml`. Do not put `HEROKU_API_KEY` or `RENDER_API_KEY` in git.
- **Import is not on boot.** Postgres persists the hosted agent. After `agents/loop.json` / skills change, re-run `npx tsx scripts/import-loop.ts` against `TRUEFORGE_BASE_URL=https://loop.heisenbug.in` with `LOOP_MODEL_FQN=openai/gpt-5-6-luna` and `OPENAI_MODEL_*`. `import-loop.ts` refuses a judge-host upsert that is not that FQN.
- TrueForge wants Node **22.14+**. Package `engines.node` is `>=22.14.0`. Tests can still run on Node 20.
- Prefer OpenAI GPT-5.6 Luna on the judge host. Local film may stay OpenRouter 4.1-mini. NVIDIA NIM is backup locally. Daytona required for skills/sandbox.

## What NOT to build

- A 19-agent fleet. One agent, three one-level subagents.
- A campus / dark SOC UI. Light Apple-like if themed.
- Prior internal control-plane work, Goodman, or Bhoonaksha. Prior art only. Do not ship it. Do not mention it in README, form, or judge-facing copy.
- Auth for judges. Login ON only if live GitHub writes require it.
- Custom chat unless it is a themed `@truefoundry/trueforge-ui` embed (`apps/loop-ui`). Sai: stock TrueForge UI unless the product needs another.
- A GitHub Action that stores `RENDER_API_KEY` or `HEROKU_API_KEY` in git. Deploy from the Heroku dashboard/CLI.
- A second product for generative UI / Code Mode. Those extras stay inside the same LOOP incident.

## Demo prompt

TrueForge chat, agent `loop`:

> Checkout conversion dropped about 19% since Friday afternoon on desktop Chrome. Find the root cause. If it is a break, patch the tenant in the sandbox and open a draft PR. Do not merge. Do not deploy prod.

Expect three subagent threads, Type A patch on `fixtures/tenant/src/checkout.ts` (enterprise alias still `enterprise-annual` after `*-v3`), pause on `open_draft_pr`. Extra patcher write: deny. Root write: approve (only after filming). Collapsed story (`LOOP_STORY=collapsed`) must refuse a root cause.

## Docs

Keep `docs/` current as the work changes. Curate. No transcript dumps. No secrets.

[docs/README.md](docs/README.md) index. Living state: [docs/status.md](docs/status.md). Pitfalls: [docs/learnings.md](docs/learnings.md). Run/deploy: [docs/runbook.md](docs/runbook.md). Remaining work: [docs/next.md](docs/next.md). Judge shot list: [docs/demo.md](docs/demo.md). Organizer extras: [docs/organizers.md](docs/organizers.md). Previous WeMakeDevs winners / TrueForge examples: [docs/previous-winners.md](docs/previous-winners.md). Honest real vs fixture: [docs/audit.md](docs/audit.md).
