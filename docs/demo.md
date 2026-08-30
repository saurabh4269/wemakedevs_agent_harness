# Demo (3 min)

Judge-facing shot list. Not a transcript dump. A judge or Saurabh can run this without a login.

**Qualify** (live page, fetched 2026-08-31 morning IST): a judge has to see TrueForge reaching a tool, running code in the sandbox, and stopping for a person.

LOOP is the **Incident responder** hero card. Stock TrueForge UI at http://localhost:8790 is the demo. LOOP rail at http://localhost:5173 is optional extra (PR #2 **merged** `e221fb05`, Qodo **Bugs (0)**). Do not call localhost "hosted".

## Prompt (exact)

Pick agent `loop`. Send this and nothing else:

> Checkout conversion dropped about 19% since Friday afternoon on desktop Chrome. Find the root cause. If it is a break, patch the tenant in the sandbox and open a draft PR. Do not merge. Do not deploy prod.

## Beats a judge must SEE

| # | Beat | What "done" looks like | If it fails |
| --- | --- | --- | --- |
| 1 | MCP warehouse tools via **three named** subagents: `analytics` / `logs` / `deploys` | Agent steps show `query_analytics`, `query_logs`, `query_deploys` on those threads. Root does **not** call `query_*`. | Stop. This is the "reach a tool" qualify beat. |
| 2 | Daytona sandbox patch of `fixtures/tenant` | Type A: sandbox edits `fixtures/tenant/src/checkout.ts` so `enterprise` aliases `enterprise-annual-v3`. | **BLOCKED.** Key authenticates (`GET api-keys/current` 200) but `POST /snapshots` is **403**. Scopes are `write:sandboxes` + `delete:sandboxes` only — missing `write:snapshots`. TrueForge `GET /api/v1/settings/sandbox-providers` is **404** (none configured). Spark hole. Do not fake a patch. |
| 3 | Pause on root `open_draft_pr` with Approve / Deny | Agent steps: write tool held. Buttons visible. Do not click yet. | Stop. This is the "stopping for a person" qualify beat. |
| 4 | Refresh still paused. Deny extra patcher write. Approve root | Reload http://localhost:8790. Same session, same pause. If a `patcher` subagent also paused on a write: **Deny** it. **Approve** the root `open_draft_pr` only. Never merge. Never prod-deploy. | If refresh loses the pause, Best Use session claim is dead. |

## YouTube structure (3 min or less)

| Clock | Shot | On screen | Line |
| --- | --- | --- | --- |
| 0:00-0:25 | Problem | Stock TrueForge at :8790, no login. Paste the prompt. | Checkout conversion dropped ~19% Friday afternoon on desktop Chrome. LOOP is an incident responder. |
| 0:25-1:10 | Three looks | Subagent threads analytics / logs / deploys. MCP warehouse tools. | Three independent looks. Root does not investigate itself. |
| 1:10-1:40 | Sandbox patch | Daytona running code against fixtures/tenant. | Type A break: catalog rename left the enterprise alias pointing at a gone plan. If snapshots 403 / no provider: hold a card that says BLOCKED, Spark hole. |
| 1:40-2:10 | Pause | Approve / Deny on root open_draft_pr. Do not click. | Writes wait. LOOP never merges and never deploys prod. |
| 2:10-2:40 | Reconnect | Refresh. Pause still there. Deny extra patcher if it appears. Approve root. | Session survived the refresh. Deny the extra write; approve the root. |
| 2:40-3:00 | One-line lesson | Lesson in chat. | Three looks, a sandbox patch, a human on the write. |

## What NOT to show

- Product OS, ADK, or any prior campus product.
- Keys, .env, Settings credential paste. Never put a Daytona key in git or on camera.
- Localhost as "hosted" (https://loop.thexplorers.xyz is not live).
- A mocked tool call that is not MCP. Fixture warehouse is already an honest Best Use risk; do not add a fake sandbox.
- Chat-only investigation with no subagents, no pause, no (attempted) sandbox.

## Prep (off camera)

1. TrueForge at http://localhost:8790 (npx, SQLite, no login). Fixture MCP at `127.0.0.1:8788`. Agent `loop` imported.
2. Optional extra: LOOP rail on port 5173 for Doing / Waiting / Did.
3. Daytona Spark hole (not a vague auth failure):
   - Stored key authenticates (api-keys/current returns 200) but snapshot create is forbidden (403).
   - Scopes on that key: write:sandboxes and delete:sandboxes only. Missing write:snapshots.
   - TrueForge sandbox-providers settings endpoint returns 404: no provider configured.
   - User action: Daytona dashboard, mint a key with Sandboxes write plus Snapshots write (create). Paste only in TrueForge Settings, Sandbox providers. Until then beat 2 is BLOCKED.
4. Film Agent steps, not a zoomed chat bubble.

PR #1 merged (f1651fa, Qodo Bugs (0)). PR #2 merged (e221fb05, Qodo Bugs (0)). Living state: [status.md](status.md).
