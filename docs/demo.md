# Run an investigation against the local warehouse

Operator runbook. Stock TrueForge at http://localhost:8790. No login on local npx. Do not call localhost "hosted".

The Friday ~19% conversion drop is the seeded incident in the warehouse (`independent` dataset in `fixtures/mcp`). It is not a live board. The `collapsed` dataset is the negative test: three restatements of one query; LOOP must refuse a root cause.

The thin LOOP rail at http://localhost:5173 is optional extra (PR #2 **merged** `e221fb05`, Qodo **Bugs (0)**).

## Signal

Pick agent `loop`. Send:

> Checkout conversion dropped about 19% since Friday afternoon on desktop Chrome. Find the root cause. If it is a break, patch the tenant in the sandbox and open a draft PR. Do not merge. Do not deploy prod.

## What should happen

| Step | What you should see | If it fails |
| --- | --- | --- |
| 1 | Three named subagents: `analytics` / `logs` / `deploys`. Agent steps show `query_analytics`, `query_logs`, `query_deploys` on those threads. Root does **not** call `query_*`. | Stop. The root must not investigate itself. |
| 2 | Type A patch of `fixtures/tenant` in the Daytona sandbox: `src/checkout.ts` so `enterprise` aliases `enterprise-annual-v3`. | **BLOCKED.** Key authenticates (`GET api-keys/current` 200) but `POST /snapshots` is **403**. Scopes are `write:sandboxes` + `delete:sandboxes` only — missing `write:snapshots`. TrueForge `GET /api/v1/settings/sandbox-providers` is **404** (none configured). Spark hole. Skip the patch and say so. Do not fake a patch. |
| 3 | Pause on root `open_draft_pr` with Approve / Deny. Do not click yet. | Stop. Writes must wait for a human. |
| 4 | Refresh still paused. If a `patcher` subagent also paused on a write: **Deny** it. **Approve** the root `open_draft_pr` only. Never merge. Never prod-deploy. | If refresh loses the pause, session reconnect is broken. |

Patcher deny is an ops rule: writes are root-only. TrueForge cannot hide tools per subagent.

## Negative test

Start the warehouse adapter with `LOOP_DATASET=collapsed`. Same signal. LOOP must refuse a root cause. Do not patch. Do not open a PR.

## Prep

1. TrueForge at http://localhost:8790 (npx, SQLite, no login). Fixture MCP at `127.0.0.1:8788`. Agent `loop` imported.
2. Optional: LOOP rail on port 5173 for Doing / Waiting / Did.
3. Daytona Spark hole (not a vague auth failure):
   - Stored key authenticates (api-keys/current returns 200) but snapshot create is forbidden (403).
   - Scopes on that key: write:sandboxes and delete:sandboxes only. Missing write:snapshots.
   - TrueForge sandbox-providers settings endpoint returns 404: no provider configured.
   - Operator action: Daytona dashboard, mint a key with Sandboxes write plus Snapshots write (create). Paste only in TrueForge Settings, Sandbox providers. Until then step 2 is BLOCKED.
4. Watch Agent steps, not only the chat bubble.

PR #1 merged (f1651fa, Qodo Bugs (0)). PR #2 merged (e221fb05, Qodo Bugs (0)). PR #3 merged (36aa532). Living state: [status.md](status.md).

Qualify beats and a 3-minute recording outline, if needed, live in [hackathon.md](hackathon.md). They are not this runbook.
