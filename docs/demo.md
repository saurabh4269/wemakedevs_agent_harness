# Demo (3 min)

Judge-facing shot list. Not a transcript dump. A judge or Saurabh can run this without a login.

**Qualify** (live page, fetched 2026-08-31 morning IST): a judge has to see TrueForge reaching a tool, running code in the sandbox, and stopping for a person.

LOOP is the **Incident responder** hero card. Judges: stock TrueForge UI at https://loop.heisenbug.in. Prefer the sitting hosted Luna PASS: https://loop.heisenbug.in/sessions/01m1b50dbbh3vgy6brbaw5vsaz. Local film host remains http://localhost:8790. LOOP rail at http://localhost:5173 is optional extra (PR #2 **merged** `e221fb05`, Qodo **Bugs (0)**). Do not call localhost "hosted".

## Prompt (exact)

Pick agent `loop`. Send this and nothing else:

> Checkout conversion dropped about 19% since Friday afternoon on desktop Chrome. Find the root cause. If it is a break, patch the tenant in the sandbox and open a draft PR. Do not merge. Do not deploy prod.

## Beats a judge must SEE

| # | Beat | What "done" looks like | If it fails |
| --- | --- | --- | --- |
| 1 | MCP warehouse tools via **three named** subagents: `analytics` / `logs` / `deploys` | Agent steps show `query_analytics`, `query_logs`, `query_deploys` on those threads. Root does **not** call `query_*`. | Stop. This is the "reach a tool" qualify beat. |
| 2 | Daytona sandbox patch of `fixtures/tenant` | Type A: sandbox `git clone` of the public harness, then `checkout.ts` so `enterprise` aliases `enterprise-annual-v3`. Seed = git clone, not write-files. Provider **ready**. Qualify **PASS** on session `01m1a87xjewncn310ymqy3yz01`. | If clone/patch fails, stop. Do not fake a patch. Do not `sed /opt/tf/tenant`. |
| 3 | Pause on root `open_draft_pr` with Approve / Deny | Agent steps: write tool held. Buttons visible. Do not click yet. Hosted Luna PASS sits on `call_tool` → `open_draft_pr`; still a write pause. | Stop. This is the "stopping for a person" qualify beat. |
| 4 | Refresh still paused. Deny extra patcher write. Approve root | Reload https://loop.heisenbug.in (or local :8790). Same session, same pause. If a `patcher` subagent also paused on a write: **Deny** it. **Approve** the root write only **after** the take. Never merge. Never prod-deploy. | If refresh loses the pause, Best Use session claim is dead. |

## YouTube structure (3 min or less)

| Clock | Shot | On screen | Line |
| --- | --- | --- | --- |
| 0:00-0:20 | Problem | Stock TrueForge at :8790, no login. Paste the prompt. | Checkout conversion dropped ~19% Friday afternoon on desktop Chrome. LOOP is an incident responder. |
| 0:20-1:00 | Three looks | Subagent threads analytics / logs / deploys. MCP warehouse tools. | Three independent looks. Root does not investigate itself. |
| 1:00-1:20 | Gen UI + Code Mode | Chart/table/Type A card. Optional sandbox print table. | Harness rendered this. Counts from code, not the model. |
| 1:20-1:50 | Sandbox patch | Daytona running code against fixtures/tenant. | Type A break: catalog rename left the enterprise alias pointing at a gone plan. If tenant files are missing in the sandbox, stop — do not fake it. |
| 1:50-2:15 | Pause | Approve / Deny on root open_draft_pr. Do not click. | Writes wait. LOOP never merges and never deploys prod. |
| 2:15-2:40 | Reconnect | Refresh. Pause still there. Deny extra patcher if it appears. Approve root. | Session survived the refresh. Deny the extra write; approve the root. |
| 2:40-3:00 | One-line lesson | Lesson in chat. | Three looks, a sandbox patch, a human on the write. |

## What NOT to show

- Prior internal control-plane work, or any prior campus product.
- Keys, .env, Settings credential paste. Never put a Daytona key in git or on camera.
- Localhost as "hosted". Live host is https://loop.heisenbug.in.
- A mocked tool call that is not MCP. Fixture warehouse is already an honest Best Use risk; do not add a fake sandbox.
- Chat-only investigation with no subagents, no pause, no (attempted) sandbox.

## Prep (off camera)

1. Wake https://loop.heisenbug.in (`GET /healthz` → `OK!`). Agent `loop`, model `openai/gpt-5-6-luna`.
2. Open sitting session https://loop.heisenbug.in/sessions/01m1b50dbbh3vgy6brbaw5vsaz (or paste the demo prompt into a new chat if that session is gone).
3. Daytona: provider ready. Passing seed is `git clone` of the public harness, then patch `enterprise-annual-v3`. Pause is sitting on the root write — film that; do not click yet.
4. Backup tape: local TrueForge at http://localhost:8790, session `01m1a87xjewncn310ymqy3yz01`.
5. Optional extras on the same tape: generative UI after the three looks; Code Mode printout; linger Agent Steps at the pause. [organizers.md](organizers.md).
6. Film Agent steps, not a zoomed chat bubble. Say out loud that warehouse + GitHub are labeled fixtures; TrueForge pause/sandbox/subagents are real.

PR #1–#3 and #5–#7 merged. Living state: [status.md](status.md).
