# Status

Rewrite this file when PRs, blockers, or URLs change. Do not append a log. Last rewrite: **2026-08-31 ~23:00 IST**.

## PRs

| PR | Branch | What | State |
| --- | --- | --- | --- |
| [#1](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/1) | `feat/loop-trueforge-agent` | Agent spec, fixture MCP, skills, import, tests | **Merged** (`f1651fa`). Qodo follow-up **Bugs (0)**. |
| [#2](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/2) | `feat/loop-ui` | LOOP TrueForgeUI shell | **Merged** (`e221fb05`). Qodo **Bugs (0)**. Do not clobber `feat/loop-ui`. |
| [#3](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/3) | `docs/agent-handoff` | First AGENTS.md + `docs/` | **Merged** (`36aa532`). |
| [#4](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/4) | `feat/loop-product-first` | Production-shaped LOOP | **Closed** without merge (stale Daytona-403). Do not reopen. |
| [#5](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/5) | `feat/loop-sandbox-tenant` | Empty-cwd clone + MUST `open_draft_pr` | **Merged** (`42734a2`). |
| [#6](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/6) | `feat/docs-organizer-research` | Organizer extras + previous-winners | **Merged** (`8b6b043`). |
| [#7](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/7) | `feat/render-host` | Hosted TrueForge + live URL + audit | **Merged** (`25fd7a0`). |
| [#8](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/8) | `docs/living-handoff-autodeploy` | Living handoff + `render.yaml` auto-deploy on `main` | **Merged** (`93882ac`). |
| [#9](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/9) | `cursor/hosted-qualify-harden-7d0f` | Hosted-qualify: Luna, `ask_user` off, native write, `still_true` gate | **Merged** (`a9200b2`). |
| [#10](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/10) | `cursor/judge-demo-remotion-7d0f` | Remotion judge demo: Safari on Sequoia wallpaper + conversational cedar VO | **Merged** (`7020bd6`). |
| [#11](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/11) | `cursor/loop-benchmark-7d0f` | Honest LOOP vs chat-baseline table + stranger README (qualify trio, fixture line, Qodo #5–#9) | **Merged** (`a63d1b1`). |
| [#12](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/12) | `cursor/heroku-host-7d0f` | Shift judge host to Heroku (Render free exhausted) | **Open**. |

`origin/main` tip at last rewrite: `b2d9c87`. Heroku deploy is CLI/dashboard; do not store `HEROKU_API_KEY` in git. Re-import LOOP after the new Postgres exists.

## Live TrueForge

### Judge host

- **Judge URL:** https://loop.heisenbug.in — keep this. TLS stays on Cloudflare once CNAME `loop` points at Heroku ACM.
- **Live host is moving to Heroku.** Render free quota is exhausted. Stand-up: [heroku.md](heroku.md). Do not Apply `render.yaml`.
- Fallback while DNS catches up: `https://<app>.herokuapp.com` (app name must contain `loop`).
- Previous Render web: `loop-trueforge` (`srv-daaaa65g1s2s73cjsq0g`). Stop it after Heroku `/healthz` is 200.
- `GET /healthz` → 200 `OK!`.
- Hosted LOOP agent on Render Postgres (`01m1aaemb86czjax2v232nxygf`) will **not** copy. Re-import Luna after Heroku Postgres exists.
- `PUBLIC_BASE_URL` stays `https://loop.heisenbug.in`.
- **Do not Apply `render.yaml` Blueprint** on workspace `tea-ctoktrjtq21c73cufog0`.
- Hosted TrueForge does **not** re-import LOOP on boot. See [runbook.md](runbook.md) and [heroku.md](heroku.md).
- OIDC unset: anyone who can reach the server is **admin** (intended no-login judge path).
- Fixture MCP is colocated in the image on `127.0.0.1:8788`.
- Secrets stay in `heroku config` (and the old Render dashboard until you stop it). Never commit keys.

### DNS

- `thexplorers.xyz` is **expired**. Do not rely on `loop.thexplorers.xyz`.
- `heisenbug.in` is Cloudflare. Apex and `www` stay on Vercel — **never touch `@` or `www`**.
- Only subdomain: CNAME `loop` → Heroku DNS target from `heroku domains` (was `loop-trueforge.onrender.com`). DNS only (grey cloud). Never touch `@` or `www`.

### Local (keep running)

- Standalone **v0.1.4** on **`[::1]:8790`** (IPv6). SQLite, no login. Alternate film host. `127.0.0.1:8790` may miss it. **Do not kill local :8790.**
- Local agent `loop` id `01m1a383mce9cs0bsr7hs26zct`. Model `openrouter/gpt-4.1-mini`. **Do not PUT the local live agent model.**
- Secrets: `/home/box/.secrets/loop-trueforge.env` (mode 600). Never echo. Never commit.
- Local sitting pause `01m1a87xjewncn310ymqy3yz01` is **still local-only**. Qualify **PASS**. **Do not click Approve/Deny.**
- Shot list: [demo.md](demo.md).

## Conversion-drop qualify

### Hosted Luna — PASS (film this)

Clock 2026-08-31 05:34–05:35 UTC, session **`01m1b50dbbh3vgy6brbaw5vsaz`** / turn `01m1b50dekr6a7ec6svghbvj3j.xswmv9`. Model `openai/gpt-5-6-luna`. URL: https://loop.heisenbug.in/sessions/01m1b50dbbh3vgy6brbaw5vsaz

- **MCP three looks PASS:** one message spawned `analytics`, `logs`, `deploys`. `query_logs` + `query_deploys` native; analytics used `call_tool` wrap of `query_analytics` (same evidence). Root did not self-query.
- **Daytona PASS:** `git clone` of the public harness, then `enterprise` alias → `enterprise-annual-v3` (`patched wemakedevs_agent_harness/fixtures/tenant/src/checkout.ts`, exit 0).
- **OpenUI PASS:** chart + table + Type A card in the thread.
- **Pause PASS:** Approve sitting on **root** write. Inner tool is `open_draft_pr` (`merge: false`) via system `call_tool` (`loop-github`). **Not clicked.** This PR teaches native `open_draft_pr` + `still_true` as a tool argument so the next run does not wrap.

**Do not Approve/Deny this session.** Prefer it for the YouTube take.

### Local — PASS (attempt 2) — backup film source

Clock ~02:42 IST 31 Aug, session `01m1a87xjewncn310ymqy3yz01` / turn `01m1a87xk1s82h6j3t804hgks5.local`. Approval id `01m1a88qvsn8ztv7vyy82bj548`. Branch `fix/plan-id-alias`.

- **MCP three looks PASS.** Daytona clone + v3 alias. Pause on root `open_draft_pr`. **Not clicked.**

### Hosted — FAIL (do not retry these sessions)

1. `01m1advv5np7mqwse1xf2hdpyc` — empty-cwd skip, no `open_draft_pr`.
2. `01m1ayqn9563da3mgerw6nwpq5` — asked the user about subagent overload; no clone, no pause.
3. Empty `01m1ayra0m7tdj5rphtnsqevyw` — ignore.
4. `01m1b2226f575dw2j3z0bwc3gx` — retried analytics/logs; deploys 503'd.
5. `01m1b281j4khan5aqjnf8xy9nq` — cloned and patched, then `npx` hunt, NVIDIA 503 before write.
6. `01m1b2hank3g4jyxqxqysdappp` — OpenRouter `429 free-models-per-day`.
7. `01m1b4vnc8nz9j48jpmeb3v1yg` — API probe, empty prompt (`Invalid prompt: messages must not be empty`). Ignore.

Honest audit of real vs fixture: [audit.md](audit.md). Pitfalls: [learnings.md](learnings.md).

## Form / demo URLs (draft)

- Repo: https://github.com/saurabh4269/wemakedevs_agent_harness
- Deployed: https://loop.heisenbug.in. Render free exhausted; Heroku cutover: [heroku.md](heroku.md).
- Video field is **YouTube**, ≤3 min. File in git: [docs/demo/loop-judge-demo.mp4](demo/loop-judge-demo.mp4). Shot list: [demo.md](demo.md). Placeholder https://vimeo.com/1222508816 is the **wrong host** — replace.
- Blog draft: [blog.md](blog.md). Live URL https://saurabh4269.github.io/blog/trueforge-harness/ is still 404 until the MDX is published to `saurabh4269.github.io`.
- Form answers: [form.md](form.md). Not submitted.

## Deadline

Clock deadline (Sun 30 Aug 2026 8:00pm London / 12:30am IST Monday) has **passed**. Live page still said **Submissions are open** as of 2026-08-31 morning IST. **No official late policy** is written. User said **keep building**.

## Next

Ordered list: [next.md](next.md).
