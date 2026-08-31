# Status

Rewrite this file when PRs, blockers, or URLs change. Do not append a log. Last rewrite: **2026-08-31 ~10:20 IST**.

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
| this PR | `cursor/hosted-qualify-harden-7d0f` | Hosted-qualify harden: `ask_user_questions` off, playbook, `still_true`, hosted-import guard, blog/form draft | Open until Qodo Highs are 0, then merge. |

`origin/main` tip at last rewrite: `93882ac`. Worktrees: one writer per branch. New work from `origin/main`.

## Live TrueForge

### Judge host

- **Judge URL:** https://loop.heisenbug.in — custom domain verified. TLS Google Trust Services WE1, SAN `loop.heisenbug.in`. Domain id `cdm-daaajnon74is73abbuh0`.
- Render web: `loop-trueforge` (`srv-daaaa65g1s2s73cjsq0g`), Oregon free. Dashboard: https://dashboard.render.com/web/srv-daaaa65g1s2s73cjsq0g
- Fallback: https://loop-trueforge.onrender.com — keep it. Do not disable the onrender subdomain.
- `GET /healthz` → 200 `OK!` (checked 2026-08-31).
- Hosted LOOP agent `01m1aaemb86czjax2v232nxygf`, model `openrouter/nemotron-3-super-120b-a12b-free`. Re-import after this PR merges (or against this branch with `LOOP_SKILL_REF`). `import-loop.ts` now refuses a judge-host upsert that is not that FQN. `agents/loop.json` sets `max_tokens: 8192` and `ask_user_questions.enabled: false`.
- `PUBLIC_BASE_URL` is `https://loop.heisenbug.in`.
- Postgres `loop-postgres` (`dpg-daaa7k4s728c73fr0feg-a`) available, free, Oregon. Redis `loop-redis` (`red-daaa7ohsrm7s73ed64mg`) available. Project `loop` `prj-daaa8g5g1s2s73cjo950`, env production `evm-daaa8g5g1s2s73cjo95g`. Workspace `tea-ctoktrjtq21c73cufog0`.
- **CI/CD:** live service tracks branch **`main`**, `autoDeploy: yes`, `autoDeployTrigger: commit`. **Do not Apply `render.yaml` Blueprint** on this workspace.
- Hosted TrueForge does **not** re-import LOOP on boot. Image deploy ≠ live agent instructions. See [runbook.md](runbook.md).
- Free web sleeps when idle. Ping `/healthz` first (~25–30s white "Loading application…") before a judge demo.
- OIDC unset: anyone who can reach the server is **admin** (intended no-login judge path).
- Fixture MCP is colocated in that image on `127.0.0.1:8788`.
- Secrets stay in the Render dashboard (`sync: false`). Never commit keys.
- Daytona sandbox providers on hosted: **Connected / `status: ready`**.

### DNS

- `thexplorers.xyz` is **expired**. Do not rely on `loop.thexplorers.xyz`.
- `heisenbug.in` is Cloudflare. Apex and `www` stay on Vercel — **never touch `@` or `www`**.
- Only subdomain: CNAME `loop` → `loop-trueforge.onrender.com`, DNS only (grey cloud). Cert issued.
- Box DNS sometimes cannot resolve `loop.heisenbug.in` without `--resolve loop.heisenbug.in:443:216.24.57.7` (Render IPs `216.24.57.7` / `216.24.57.15`).

### Local (keep running)

- Standalone **v0.1.4** on **`[::1]:8790`** (IPv6). SQLite, no login. Sitting-pause film host. `127.0.0.1:8790` may miss it. **Do not kill local :8790.**
- Local agent `loop` id `01m1a383mce9cs0bsr7hs26zct`. Model `openrouter/gpt-4.1-mini`. **Do not PUT the local live agent model.** User is OpenRouter **FREE**. Do **not** use `gpt-5.6-luna`.
- Secrets: `/home/box/.secrets/loop-trueforge.env` (mode 600). Never echo. Never commit.
- Sitting pause session `01m1a87xjewncn310ymqy3yz01` is **still local-only**. Qualify **PASS**. **Do not click Approve/Deny.**
- Shot list: [demo.md](demo.md).

### Session reconnect — PASS

Session `01m1a43y65y97gka0md622ksg5`: 51 events unchanged after SDK reconnect. Keep this claim; film refresh on the sitting pause.

## Conversion-drop qualify

### Local — PASS (attempt 2) — film source

Clock ~02:42 IST 31 Aug, session `01m1a87xjewncn310ymqy3yz01` / turn `01m1a87xk1s82h6j3t804hgks5.local`. Approval id `01m1a88qvsn8ztv7vyy82bj548`. Branch `fix/plan-id-alias`.

- **MCP three looks PASS:** spawned `analytics`, `logs`, `deploys` first. Root did **not** call `query_*`.
- **Daytona PASS:** `git clone` of the public harness, then `enterprise` alias → `enterprise-annual-v3`.
- **Pause PASS:** Approve sitting on **root** `open_draft_pr` (`thread_id=main`, `merge:false`). **Not clicked.**

Attempt 1 FAIL (`01m1a80698wrqk841j72tey3fy`): fourth subagent `type-a-vs-b`; `sed` on `/opt/tf/tenant` missing. Instruction harden is on main via PR #5.

Gen UI and Code Mode did **not** appear on the passing run. Spark extras, not qualify blockers.

### Hosted — FAIL (do not retry these sessions)

1. Session `01m1advv5np7mqwse1xf2hdpyc` — spawned analytics/logs/deploys and Daytona sandbox but skipped the patch (empty cwd, no git clone) and never called `open_draft_pr`. Do not POST a follow-up turn here.
2. Session `01m1ayqn9563da3mgerw6nwpq5` / turn `01m1ayqw5eqseg1hd8vt7tj3cz.ujw6of` — DONE 2026-08-31 03:48 UTC / 09:18 IST. Spawned `analytics` (three times), then `logs`, then `deploys`. `sandbox.created` + one `exec`. Then main called `ask_user_question` ("Subagent creation is failing due to service overload"). **No git clone. No `open_draft_pr`. No pending approval.** Output null; required action is that question. **Do not answer it. Do not Approve/Deny.** URL: https://loop.heisenbug.in/sessions/01m1ayqn9563da3mgerw6nwpq5
3. Accidental empty session `01m1ayra0m7tdj5rphtnsqevyw` — ignore. Do not POST a turn there.

This PR turns `ask_user_questions` **off** so Nemotron cannot bail that way. New hosted session only after import of this spec. Nemotron Super `:free` is still slow and can flake subagent creation. Local 4.1-mini remains the proven film source.

Honest audit of real vs fixture: [audit.md](audit.md). Pitfalls: [learnings.md](learnings.md).

## Form / demo URLs (draft)

- Repo: https://github.com/saurabh4269/wemakedevs_agent_harness
- Deployed: https://loop.heisenbug.in — live. Fallback https://loop-trueforge.onrender.com.
- Video field is **YouTube**, ≤3 min. Shot list: [demo.md](demo.md). Placeholder https://vimeo.com/1222508816 (4s, Shiwani) is the **wrong host** — replace.
- Blog draft: [blog.md](blog.md). Live URL https://saurabh4269.github.io/blog/trueforge-harness/ is still 404 until the MDX is published to `saurabh4269.github.io`.
- Form answers: [form.md](form.md). Not submitted.

## Deadline

Clock deadline (Sun 30 Aug 2026 8:00pm London / 12:30am IST Monday) has **passed**. Live page still said **Submissions are open** as of 2026-08-31 morning IST. **No official late policy** is written. User said **keep building**.

## Next

Ordered list: [next.md](next.md).
