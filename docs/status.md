# Status

Rewrite this file when PRs, blockers, or URLs change. Do not append a log. Last rewrite: **2026-08-31 ~02:45 IST**.

## PRs

| PR | Branch | What | State |
| --- | --- | --- | --- |
| [#1](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/1) | `feat/loop-trueforge-agent` | Agent spec, fixture MCP, skills, import, tests | **Merged** (`f1651fa`). Qodo follow-up **Bugs (0)**. README Qodo evidence links this PR. |
| [#2](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/2) | `feat/loop-ui` | LOOP TrueForgeUI shell | **Merged** (`e221fb05`). Qodo **Bugs (0)**. Do not clobber `feat/loop-ui`. |
| [#3](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/3) | `docs/agent-handoff` | AGENTS.md + `docs/` | **Merged** (`36aa532`). |
| [#4](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/4) | `feat/loop-product-first` | Production-shaped LOOP, not demo-theater | **Open**. Do not clobber. |
| [#5](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/5) | `feat/loop-sandbox-tenant` | Seed `fixtures/tenant` into Daytona | **Open**. Do not clobber. |
| this branch | `feat/docs-organizer-research` | Organizer extras + previous-winners handoff | This PR. |

CodeRabbit comments exist; ignore for evidence. Worktrees: one writer per branch. New work from `origin/main`.

## Live TrueForge

- Standalone **v0.1.4** at http://localhost:8790 (SQLite, no login). This is the demo.
- Fixture MCP at `127.0.0.1:8788`.
- LOOP UI at http://localhost:5173 (optional; PR #2 on main).
- Intended public host https://loop.thexplorers.xyz is **not live hosted yet**. Compose path is :8791.
- Agent `loop` id `01m1a383mce9cs0bsr7hs26zct`. Model `openrouter/gpt-4.1-mini`.
- Secrets: `/home/box/.secrets/loop-trueforge.env` (mode 600). Never echo. Never commit. User pasted a Daytona key in chat — **rotate** if that transcript is shared.

### Session reconnect — PASS

Session `01m1a43y65y97gka0md622ksg5`: 51 events unchanged after SDK reconnect. `open_draft_pr` pause still on root and patcher. analytics / logs / deploys / patcher threads still listed.

### Daytona — provider ready, exec proven

Full-access Daytona key stored off-git. TrueForge sandbox-providers status **ready**. Snapshot `trueforge-build-0dab475d…` exists. LOOP `config.sandbox.enabled: true`.

Probe (not named LOOP): session `01m1a72jep6882qqjxpn9v2txc`, `sandbox.created`, `echo LOOP_SANDBOX_OK` exit 0.

### Conversion-drop named `loop` — partial

Session `01m1a78me4akxa5fdkcxzh3pmj`.

- **PASS:** three named subagents first (analytics, logs, deploys). Daytona sandbox created (`v1:daytona:default.613846e1-…`).
- **FAIL:** root also called `query_*` (spec violation). Type A `cp -r fixtures/tenant` failed (`cannot stat` — sandbox cwd has no repo). Agent skipped `open_draft_pr`. **No Approve sitting.**

Remaining Spark hole: get tenant sources into Daytona, patch `checkout.ts`, pause on **root** `open_draft_pr`. That is PR #5. Then re-run until Approve sits. Deny any patcher write.

## Form / demo URLs (draft)

- Repo: https://github.com/saurabh4269/wemakedevs_agent_harness
- Deployed (optional): https://loop.thexplorers.xyz/ — not live hosted yet
- Video field is **YouTube**, ≤3 min. Shot list: [demo.md](demo.md). Placeholder https://vimeo.com/1222508816 (4s, Shiwani) is the **wrong host** — replace.
- Blog https://saurabh4269.github.io/blog/trueforge-harness/ — 404, do last.

## Deadline

Clock deadline (Sun 30 Aug 2026 8:00pm London) has **passed**. Live page still said **Submissions are open** as of 2026-08-31 morning IST. **No official late policy** is written. User said **keep building**.

## Next (priority)

1. Land tenant-in-sandbox (PR #5) and re-run conversion-drop until root `open_draft_pr` pauses.
2. Fold gen UI + Code Mode into that same incident ([organizers.md](organizers.md) extras).
3. Film YouTube ≤3 min. Optional refresh. Linger Agent Steps.
4. Optional host loop.thexplorers.xyz. Blog last. Form only when repo + Qodo + video exist.

## Box

TrueForge and this package `engines` want Node 22.14+.
