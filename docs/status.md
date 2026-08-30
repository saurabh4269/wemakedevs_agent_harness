# Status

Rewrite this file when PRs, blockers, or URLs change. Do not append a log. Last rewrite: **2026-08-31 ~09:50 IST**.

## PRs

| PR | Branch | What | State |
| --- | --- | --- | --- |
| [#1](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/1) | `feat/loop-trueforge-agent` | Agent spec, fixture MCP, skills, import, tests | **Merged** (`f1651fa`). Qodo follow-up **Bugs (0)**. README Qodo evidence links this PR. |
| [#2](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/2) | `feat/loop-ui` | LOOP TrueForgeUI shell | **Merged** (`e221fb05`). Qodo **Bugs (0)**. Do not clobber `feat/loop-ui`. |
| [#3](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/3) | `docs/agent-handoff` | AGENTS.md + `docs/` | **Merged** (`36aa532`). |
| [#4](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/4) | `feat/loop-product-first` | Production-shaped LOOP | **Closed** without merge (stale Daytona-403). Do not reopen. |
| [#5](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/5) | `feat/loop-sandbox-tenant` | Seed tenant into Daytona; empty-cwd clone + MUST `open_draft_pr` | **Merged**. |
| [#6](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/6) | `feat/docs-organizer-research` | Organizer extras + previous-winners | **Merged**. |
| [#7](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/7) | `feat/render-host` | Hosted TrueForge on Render + live URL + audit | Open. This worktree. Live image is still `fc7621c` until this lands. |

Worktrees: one writer per branch. New work from `origin/main`.

## Live TrueForge

### Judge host (live)

- **Judge URL:** https://loop.heisenbug.in — custom domain verified. TLS is Google Trust Services WE1, SAN `loop.heisenbug.in`.
- Render web: `loop-trueforge` (`srv-daaaa65g1s2s73cjsq0g`), Oregon free. Dashboard: https://dashboard.render.com/web/srv-daaaa65g1s2s73cjsq0g
- Fallback: https://loop-trueforge.onrender.com — keep it. Do not disable the onrender subdomain.
- Hosted LOOP agent `01m1aaemb86czjax2v232nxygf`, model `openrouter/nemotron-3-super-120b-a12b-free`, `max_tokens` 8192.
- `PUBLIC_BASE_URL` is `https://loop.heisenbug.in` (set after first deploy; second deploy `dep-daaam7cs728c73fs35vg` from `fc7621c` so the running process picked it up).
- Postgres `loop-postgres` (`dpg-daaa7k4s728c73fr0feg-a`) available, free, Oregon. Redis `loop-redis` (`red-daaa7ohsrm7s73ed64mg`) available. Project `loop` `prj-daaa8g5g1s2s73cjo950`, env production `evm-daaa8g5g1s2s73cjo95g`.
- `autoDeploy: no`. **Do not Apply `render.yaml` Blueprint** on this workspace (unrelated existing services + would duplicate DBs).
- Free web sleeps when idle. Ping `/healthz` first (~30s wake) before a judge demo.
- OIDC unset: anyone who can reach the server is admin (intended no-login judge path).
- Fixture MCP is colocated in that image on `127.0.0.1:8788`. No Render private service (`plan: free` is not valid for pserv).
- Secrets stay in the Render dashboard (`sync: false`). Never commit keys.

### DNS

- `thexplorers.xyz` is **expired** (Namecheap parking). Do not rely on `loop.thexplorers.xyz`. That Render custom domain was deleted to free the Hobby 2-domain slot.
- `heisenbug.in` is Cloudflare (`aisha` / `ken.ns.cloudflare.com`). Apex and `www` stay on Vercel — **never touch `@` or `www`**.
- Only subdomain: CNAME `loop` → `loop-trueforge.onrender.com`, DNS only (grey cloud) until cert issued. Cert is now issued.

### Local (keep running)

- Standalone **v0.1.4** on **[::1]:8790** (IPv6). SQLite, no login. Sitting-pause film host. `127.0.0.1:8790` may miss it. **Do not kill local :8790.**
- Fixture MCP at `127.0.0.1:8788`.
- LOOP UI at http://localhost:5173 (optional extra; PR #2 is on main).
- Local agent `loop` id `01m1a383mce9cs0bsr7hs26zct`. Model leftover `openrouter/gpt-4.1-mini`. **Do not PUT the local live agent model.** User is OpenRouter **FREE**. Do **not** use `gpt-5.6-luna`.
- Secrets: `/home/box/.secrets/loop-trueforge.env` (mode 600). Never echo. Never commit. User pasted a Daytona key in chat — **rotate** if that transcript is shared.
- Sitting pause session `01m1a87xjewncn310ymqy3yz01` is **still local-only**. Qualify **PASS**. **Do not click Approve/Deny** on that TrueForge session.
- Shot list: [demo.md](demo.md).

### Session reconnect — PASS

Session `01m1a43y65y97gka0md622ksg5`: 51 events unchanged after SDK reconnect. Keep this claim; film refresh on the sitting pause.

### Conversion-drop named `loop` — qualify **PASS** (attempt 2)

Clock ~02:42 IST, session `01m1a87xjewncn310ymqy3yz01` / turn `01m1a87xk1s82h6j3t804hgks5.local`.

- **MCP three looks PASS:** spawned `analytics`, `logs`, `deploys` first. Root did **not** call `query_*`.
- **Daytona PASS:** `git clone` of the public harness, then `enterprise` alias → `enterprise-annual-v3`. Seed = **git clone**, not write-files fallback.
- **Pause PASS:** Approve sitting on **root** `open_draft_pr` (`thread_id=main`, `merge:false`). **Not clicked.** Do not Approve/Deny yet — film it.

Attempt 1 FAIL (`01m1a80698wrqk841j72tey3fy`): fourth subagent `type-a-vs-b`; `sed` on `/opt/tf/tenant` missing. Instruction harden (never spawn skill names as subagents; root clones then pauses) is on PR #5 `agents/loop.json`; live PUT already applied.

Gen UI and Code Mode did **not** appear on the passing run. Still Spark extras, not qualify blockers. Prior `cp -r fixtures/tenant` hole is closed for this qualify trio.

### Sandbox (Daytona)

Hosted sandbox providers: **ready** (full-access key stored off-git in TrueForge Settings). Local qualify PASS cloned the public tenant then paused on root `open_draft_pr`. Do not paste keys in chat or git.

Honest audit of real vs fixture: [audit.md](audit.md).

## Form / demo URLs (draft)

- Repo: https://github.com/saurabh4269/wemakedevs_agent_harness
- Deployed (optional on the form): https://loop.heisenbug.in — live. Fallback https://loop-trueforge.onrender.com. Do not put `loop.thexplorers.xyz` on the form.
- Video field is **YouTube**, ≤3 min. Shot list: [demo.md](demo.md). Current placeholder https://vimeo.com/1222508816 (4s, Shiwani) is the **wrong host** — replace.
- Blog https://saurabh4269.github.io/blog/trueforge-harness/ — 404, do last.

## Deadline

Clock deadline (Sun 30 Aug 2026 8:00pm London) has **passed**. Live page still said **Submissions are open** as of 2026-08-31 morning IST. **No official late policy** is written. User said **keep building**.

## Next (priority)

1. Film YouTube ≤3 min from the **sitting pause** + Agent Steps. Do not click Approve yet. Linger the write hold.
2. Judge host https://loop.heisenbug.in is live. Keep `/healthz` wake in the demo.
3. Hosted model is already `openrouter/nemotron-3-super-120b-a12b-free`. Do not use `gpt-5.6-luna`. Do not PUT the local live agent model.
4. Gen UI / Code Mode on a later take if time ([organizers.md](organizers.md)).
5. Blog last. Form only when repo + Qodo + video exist.

## Box

TrueForge and this package `engines` want Node 22.14+.
