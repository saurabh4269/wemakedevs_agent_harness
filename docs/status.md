# Status

Rewrite this file when PRs, blockers, or URLs change. Do not append a log. Last rewrite: **2026-08-31 ~02:50 IST**.

## PRs

| PR | Branch | What | State |
| --- | --- | --- | --- |
| [#1](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/1) | `feat/loop-trueforge-agent` | Agent spec, fixture MCP, skills, import, tests | **Merged** (`f1651fa`). Qodo follow-up **Bugs (0)**. README Qodo evidence links this PR. |
| [#2](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/2) | `feat/loop-ui` | LOOP TrueForgeUI shell | **Merged** (`e221fb05`). Qodo **Bugs (0)**. Do not clobber `feat/loop-ui`. |
| [#3](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/3) | `docs/agent-handoff` | AGENTS.md + `docs/` | **Merged** (`36aa532`). |
| [#4](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/4) | `feat/loop-product-first` | Production-shaped LOOP, not demo-theater | **Open**. Do not merge. Its status still talks Daytona 403 — stale. Do not clobber. |
| [#5](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/5) | `feat/loop-sandbox-tenant` | Seed tenant into Daytona; instruction harden (`agents/loop.json`) | **Open**. Live PUT already applied. Do not clobber. |
| [#6](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/6) | `feat/docs-organizer-research` | Organizer extras + previous-winners + this living status | This PR. |

CodeRabbit comments exist; ignore for evidence. Worktrees: one writer per branch. New work from `origin/main`. Agents never merge. Human merges after Qodo.

## Live TrueForge

- Standalone **v0.1.4** on **[::1]:8790** (IPv6). SQLite, no login. This is the demo. `127.0.0.1:8790` may miss it.
- Fixture MCP at `127.0.0.1:8788`.
- LOOP UI at http://localhost:5173 (optional; PR #2 on main).
- Intended public host https://loop.thexplorers.xyz is **not live hosted yet**. Compose path is :8791.
- Agent `loop` id `01m1a383mce9cs0bsr7hs26zct`. Model still leftover `openrouter/gpt-4.1-mini`. User is OpenRouter **FREE** ($0 credits). Next model after the pause is captured: `nvidia/nemotron-3-super-120b-a12b:free`. Do **not** use `gpt-5.6-luna`. NVIDIA Build is the spare provider. **Do not PUT the model until the sitting pause is filmed.**
- Secrets: `/home/box/.secrets/loop-trueforge.env` (mode 600). Never echo. Never commit. User pasted a Daytona key in chat — **rotate** if that transcript is shared.

### Session reconnect — PASS

Session `01m1a43y65y97gka0md622ksg5`: 51 events unchanged after SDK reconnect. Keep this claim; film refresh on the sitting pause.

### Conversion-drop named `loop` — qualify **PASS** (attempt 2)

Clock ~02:42 IST, session `01m1a87xjewncn310ymqy3yz01` / turn `01m1a87xk1s82h6j3t804hgks5.local`.

- **MCP three looks PASS:** spawned `analytics`, `logs`, `deploys` first. Root did **not** call `query_*`.
- **Daytona PASS:** `git clone` of the public harness, then `enterprise` alias → `enterprise-annual-v3`. Seed = **git clone**, not write-files fallback.
- **Pause PASS:** Approve sitting on **root** `open_draft_pr` (`thread_id=main`, `merge:false`). **Not clicked.** Do not Approve/Deny yet — film it.

Attempt 1 FAIL (`01m1a80698wrqk841j72tey3fy`): fourth subagent `type-a-vs-b`; `sed` on `/opt/tf/tenant` missing. Instruction harden (never spawn skill names as subagents; root clones then pauses) is on PR #5 `agents/loop.json`; live PUT already applied.

Gen UI and Code Mode did **not** appear on the passing run. Still Spark extras, not qualify blockers. Prior `cp -r fixtures/tenant` hole is closed for this qualify trio.

## Form / demo URLs (draft)

- Repo: https://github.com/saurabh4269/wemakedevs_agent_harness
- Deployed (optional): https://loop.thexplorers.xyz/ — not live hosted yet
- Video field is **YouTube**, ≤3 min. Shot list: [demo.md](demo.md). Placeholder https://vimeo.com/1222508816 (4s, Shiwani) is the **wrong host** — replace.
- Blog https://saurabh4269.github.io/blog/trueforge-harness/ — 404, do last.

## Deadline

Clock deadline (Sun 30 Aug 2026 8:00pm London) has **passed**. Live page still said **Submissions are open** as of 2026-08-31 morning IST. **No official late policy** is written. User said **keep building**.

## Next (priority)

1. Film YouTube ≤3 min from the **sitting pause** + Agent Steps. Do not click Approve yet. Linger the write hold.
2. Optional host loop.thexplorers.xyz.
3. After the pause is captured: switch model to `nvidia/nemotron-3-super-120b-a12b:free` (OpenRouter free). Do not PUT before capture. Do not use `gpt-5.6-luna`.
4. Gen UI / Code Mode on a later take if time ([organizers.md](organizers.md)).
5. Blog last. Form only when repo + Qodo + video exist.

## Box

TrueForge and this package `engines` want Node 22.14+.
