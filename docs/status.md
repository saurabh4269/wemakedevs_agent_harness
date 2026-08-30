# Status

Rewrite this file when PRs, blockers, or URLs change. Do not append a log. Last rewrite: **2026-08-31 ~02:45 IST**.

## PRs

| PR | Branch | What | State |
| --- | --- | --- | --- |
| [#1](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/1) | `feat/loop-trueforge-agent` | Agent spec, fixture MCP, skills, import, tests | **Merged** (`f1651fa`). Head SHA `9b8b17ed44ca453fb62a27c8e8973491d8d951dd`. Qodo follow-up on that SHA: **Bugs (0)**. All five findings resolved, including High MCP URL logging and Medium lockfile `engines` (`>=22.14.0`). README Qodo evidence section links this PR. Human merge. |
| [#2](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/2) | `feat/loop-ui` | Thin LOOP TrueForgeUI rail for the write pause | **Merged** (`e221fb05`, 2026-08-31 02:08 IST). Head SHA `8c964169480c3fa91ee32ca6b0af4b6d3e0853cb`. Qodo follow-up on that SHA: **Bugs (0)**. Highs fixed (workspaces + no client token). Human merge. Do not clobber `feat/loop-ui`. |
| [#3](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/3) | `docs/agent-handoff` | AGENTS.md rewrite + `docs/` | **Merged** (`36aa532`, 2026-08-31). Head SHA `209073831aa0536e5a4ba6dfcf2c70b9e18fb9da`. Honest shared-tool-set wording kept. Qodo: subagents inherit `loop-github` is a documented platform limit. **Do not pretend TrueForge can hide tools.** `DynamicSubAgentsConfig` is `{ enabled }` only. Writes still pause; deny extra patcher / approve root. |

CodeRabbit comments exist; ignore for evidence.

## Live TrueForge

- Standalone **v0.1.4** at http://localhost:8790 (local npx, SQLite, no login).
- Fixture MCP at `127.0.0.1:8788` (warehouse adapter, `mode:fixture`).
- LOOP UI at http://localhost:5173 (optional extra; PR #2 is on main).
- Operator runbook: [demo.md](demo.md).
- Intended public host https://loop.thexplorers.xyz is **not live hosted yet**. Compose path is :8791.

### Seeded conversion-drop

- Three **named** subagents first: analytics / logs / deploys. Root does **not** call `query_*`.
- Pause on **root** `open_draft_pr` (Approve/Deny in Agent steps).
- Extra **patcher** subagent still sometimes spawned. Deny its write; approve the root. Writes are root-only. TrueForge **cannot lock tools per subagent**.

### Session reconnect — PASS

Session `01m1a43y65y97gka0md622ksg5`: **51 events** before and after a new SDK process. Both `open_draft_pr` pauses still present. `analytics` / `logs` / `deploys` / `patcher` threads still listed. A refresh of http://localhost:8790 still shows the pause.

### Spark hole (sandbox)

Daytona snapshot create is **403** and no provider is configured — **not a vague 401**. The stored key authenticates (api-keys/current returns 200) but snapshot create is forbidden (403). Scopes are write:sandboxes + delete:sandboxes only; **write:snapshots is missing**. TrueForge sandbox-providers settings returns 404: **no provider configured**. Sandbox/skills off until the operator mints a Daytona dashboard key with **Sandboxes write** and **Snapshots write (create)** and pastes it **only** in TrueForge Settings → Sandbox providers. Never paste keys in chat or git. Type A sandbox patch is **BLOCKED** until then. Do not fake a patch.

## Form URLs (draft)

- Repo: https://github.com/saurabh4269/wemakedevs_agent_harness
- Deployed (optional on the form): https://loop.thexplorers.xyz/ — not live hosted yet
- Video field is **YouTube**, ≤3 min. Recording outline: [hackathon.md](hackathon.md). Current placeholder https://vimeo.com/1222508816 (4s, Shiwani) is the **wrong host** — replace.
- Blog https://saurabh4269.github.io/blog/trueforge-harness/ — 404, do last.

## Deadline

Clock deadline (Sun 30 Aug 2026 8:00pm London) has **passed**. Live page still said **Submissions are open** as of 2026-08-31 morning IST fetch. **No official late policy** is written. User said **keep building**.

## Box

Node on the box was 20.19.2. TrueForge and this package `engines` want 22.14+.
