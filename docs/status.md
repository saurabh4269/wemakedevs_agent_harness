# Status

Rewrite this file when PRs, blockers, or URLs change. Do not append a log. Last rewrite: **2026-08-31 ~01:45 IST**.

## PRs

| PR | Branch | What | State |
| --- | --- | --- | --- |
| [#1](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/1) | `feat/loop-trueforge-agent` | Agent spec, fixture MCP, skills, import, tests | **Merged** (`f1651fa`). Head SHA `9b8b17ed44ca453fb62a27c8e8973491d8d951dd`. Qodo follow-up on that SHA: **Bugs (0)**. All five findings resolved, including High MCP URL logging and Medium lockfile `engines` (`>=22.14.0`). README Qodo evidence section links this PR. Human merge. |
| [#2](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/2) | `feat/loop-ui` | LOOP TrueForgeUI shell for the write-pause demo | Open. Qodo **5 bugs being fixed now**. Do not clobber. |
| [#3](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/3) | `docs/agent-handoff` | AGENTS.md rewrite + `docs/` | This docs PR. Open against `feat/loop-trueforge-agent`. |

CodeRabbit comments exist; ignore for evidence.

## Live TrueForge

- Standalone **v0.1.4** at http://localhost:8790 (local npx, SQLite, no login).
- Fixture MCP at `127.0.0.1:8788`.
- LOOP UI at http://localhost:5173.
- Intended public host https://loop.thexplorers.xyz is **not live hosted yet**. Compose path is :8791.

### Conversion-drop demo

- Three **named** subagents first: analytics / logs / deploys. Root does **not** call `query_*`.
- Pause on **root** `open_draft_pr` (Approve/Deny in Agent steps).
- Extra **patcher** subagent still sometimes spawned. Deny its write; approve the root. TrueForge **cannot lock tools per subagent**.

### Session reconnect — PASS

Session `01m1a43y65y97gka0md622ksg5`: **51 events** before and after a new SDK process. Both `open_draft_pr` pauses still present. `analytics` / `logs` / `deploys` / `patcher` threads still listed. A judge refresh of http://localhost:8790 would still show the pause.

### Spark hole (sandbox)

Daytona API key **401**. Sandbox/skills **off**. That is the Best Use / Spark hole. User must put a **fresh** key in TrueForge **Settings → Sandbox**. Never paste keys in chat.

## Form / demo URLs (draft)

- Repo: https://github.com/saurabh4269/wemakedevs_agent_harness
- Deployed (optional on the form): https://loop.thexplorers.xyz/ — not live hosted yet
- Video field is **YouTube**, ≤3 min. Current placeholder https://vimeo.com/1222508816 (4s, Shiwani) is the **wrong host** — replace.
- Blog https://saurabh4269.github.io/blog/trueforge-harness/ — 404, do last.

## Deadline

Clock deadline (Sun 30 Aug 2026 8:00pm London) has **passed**. Live page still said submissions open. **No official late policy** is written. User said **keep building**.

## Box

Node on the box was 20.19.2. TrueForge and this package `engines` want 22.14+.
