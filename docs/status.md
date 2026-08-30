# Status

Rewrite this file when PRs, blockers, or URLs change. Do not append a log. Last rewrite: **2026-08-31 ~03:20 IST**.

## PRs

| PR | Branch | What | State |
| --- | --- | --- | --- |
| [#1](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/1) | `feat/loop-trueforge-agent` | Agent spec, fixture MCP, skills, import, tests | **Merged** (`f1651fa`). Qodo follow-up **Bugs (0)**. README Qodo evidence links this PR. |
| [#2](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/2) | `feat/loop-ui` | LOOP TrueForgeUI shell | **Merged** (`e221fb05`). Qodo **Bugs (0)**. Do not clobber `feat/loop-ui`. |
| [#3](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/3) | `docs/agent-handoff` | AGENTS.md + `docs/` | **Merged** (`36aa532`). |
| [#4](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/4) | `feat/loop-product-first` | Production-shaped LOOP | **Closed** without merge (stale Daytona-403). Do not reopen. |
| [#5](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/5) | `feat/loop-sandbox-tenant` | Seed tenant into Daytona; empty-cwd clone + MUST `open_draft_pr` | **Merged**. |
| [#6](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/6) | `feat/docs-organizer-research` | Organizer extras + previous-winners | **Merged**. |
| this branch | `feat/render-host` | Hosted TrueForge on Render | Open. Human merges after Qodo. |

Worktrees: one writer per branch. New work from `origin/main`.

## Live TrueForge

- Standalone **v0.1.4** on **[::1]:8790** (IPv6). SQLite, no login. Local demo / sitting pause. `127.0.0.1:8790` may miss it. **Do not kill local :8790.**
- Fixture MCP at `127.0.0.1:8788`.
- LOOP UI at http://localhost:5173 (optional; PR #2 on main).
- Agent `loop` id `01m1a383mce9cs0bsr7hs26zct`. Model still leftover `openrouter/gpt-4.1-mini`. User is OpenRouter **FREE** ($0 credits). Hosted model is `openrouter/nemotron-3-super-120b-a12b-free` (TrueForge FQN; upstream OpenRouter id `nvidia/nemotron-3-super-120b-a12b:free`). Do **not** use `gpt-5.6-luna`. NVIDIA Build is the spare provider. **Do not PUT the local live agent model.**
- Secrets: `/home/box/.secrets/loop-trueforge.env` (mode 600). Never echo. Never commit. User pasted a Daytona key in chat — **rotate** if that transcript is shared.

### Hosting (Render) — in progress on `feat/render-host`

- Intended public host https://loop.thexplorers.xyz is **not live**. DNS is still **Namecheap parking**.
- Expected CNAME after first web deploy: `loop` → `loop-trueforge.onrender.com` (**not live until the service exists**).
- One free web service `loop-trueforge` (`STANDALONE=false`, Postgres + Redis). Fixture MCP is **colocated** in that image on `127.0.0.1:8788`. No Render private service (`plan: free` is not valid for pserv).
- Existing workspace `tea-ctoktrjtq21c73cufog0` already has `loop-postgres` (`dpg-daaa7k4s728c73fr0feg-a`) and `loop-redis` (`red-daaa7ohsrm7s73ed64mg`). **Do not Blueprint-Apply there** (duplicates). Create the web service from this branch via API. `render.yaml` still lists the DBs for a greenfield Apply.
- Secrets stay in the Render dashboard (`sync: false`). Never commit keys.
- Sitting pause session `01m1a87xjewncn310ymqy3yz01` is **still local-only**. Qualify **PASS**. **Do not click Approve/Deny** on that TrueForge session.
- Hosted import is **not** this PR. After the web service is up: set `TRUEFORGE_BASE_URL` to the onrender.com URL, point LOOP MCP warehouse/github at `http://127.0.0.1:8788/warehouse` and `http://127.0.0.1:8788/github`, then `npx tsx scripts/import-loop.ts`. Hosted model must be OpenRouter free Nemotron (`nvidia/nemotron-3-super-120b-a12b:free`, FQN `openrouter/nemotron-3-super-120b-a12b-free`), **not** gpt-5.6-luna and not the local leftover gpt-4.1-mini. Do not change the local live agent model.

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
- Deployed (optional on the form): https://loop.thexplorers.xyz/ — not live hosted yet (Render Apply + Namecheap CNAME still pending)
- Video field is **YouTube**, ≤3 min. Shot list: [demo.md](demo.md). Placeholder https://vimeo.com/1222508816 (4s, Shiwani) is the **wrong host** — replace.
- Blog https://saurabh4269.github.io/blog/trueforge-harness/ — 404, do last.

## Deadline

Clock deadline (Sun 30 Aug 2026 8:00pm London) has **passed**. Live page still said **Submissions are open** as of 2026-08-31 morning IST. **No official late policy** is written. User said **keep building**.

## Next (priority)

1. Film YouTube ≤3 min from the **sitting pause** + Agent Steps. Do not click Approve yet. Linger the write hold.
2. Optional host loop.thexplorers.xyz.
3. After the pause is captured: switch model to `openrouter/nemotron-3-super-120b-a12b-free` (hosted live TrueForge FQN; upstream OpenRouter id `nvidia/nemotron-3-super-120b-a12b:free`). Do not PUT before capture. Do not use `gpt-5.6-luna`.
4. Gen UI / Code Mode on a later take if time ([organizers.md](organizers.md)).
5. Blog last. Form only when repo + Qodo + video exist.

## Box

TrueForge and this package `engines` want Node 22.14+.
