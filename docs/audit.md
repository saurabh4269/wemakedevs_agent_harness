# What LOOP is, and how a judge should audit it

LOOP is **not a new harness**. TrueForge still runs the loop, MCP client, Daytona sandbox, Approve/Deny, subagents, and session persist. This repo is agent policy + a job + a colocated fixture MCP.

Judge live URL: https://loop.heisenbug.in (fallback https://loop-trueforge.onrender.com). Stock TrueForge UI. No login.

## Qualify beats (must be visible in Agent Steps)

1. **MCP** — root spawns three named one-level subagents: `analytics`, `logs`, `deploys`. Those threads call `query_analytics` / `query_logs` / `query_deploys`. Root must not call `query_*`.
2. **Sandbox** — Type A: Daytona clone of this public repo, then patch `fixtures/tenant/src/checkout.ts` so `enterprise` aliases `enterprise-annual-v3`.
3. **Pause** — root `open_draft_pr` sits on Approve/Deny. Fixture returns `mode:fixture`, `live_github: false`. Never merge. Never prod-deploy.

Prompt:

> Checkout conversion dropped about 19% since Friday afternoon on desktop Chrome. Find the root cause. If it is a break, patch the tenant in the sandbox and open a draft PR. Do not merge. Do not deploy prod.

## Real vs fixture (say this out loud)

| Piece | Real or fixture |
| --- | --- |
| TrueForge runtime, MCP protocol, Daytona provider, write-approval pause, three named subagents, session reconnect | **Real** |
| Tenant file `fixtures/tenant/src/checkout.ts` (`enterprise` still maps to `enterprise-annual` after `*-v3`) | **Real TypeScript bug** |
| Warehouse answers (`query_analytics` / `query_logs` / `query_deploys`) | **Fixture** — canned story in `fixtures/mcp/stories.ts`, not Grafana |
| `open_draft_pr` | **Fixture** — `mode:fixture`, `live_github: false`, `html_url` is `https://github.example.invalid/loop-tenant/pull/42`. Never talks to GitHub.com |
| Hosted Postgres + Redis, Render image, custom domain TLS | **Real** |
| Qodo trail on merged PRs #1–#3 and #5–#7 | **Real** |

Official page wants tools “connected, not mocked.” Judges will see `mode:fixture` in Agent Steps. Do not hide that. Pitch: a real-shaped incident on a real harness, with tools we own so a judge needs no login.

## Honest TrueForge limit

Dynamic subagents share the root tool set. There is no per-subagent `enable_tools`. Split is instructions + skills + the approval pause. A `patcher` subagent may still try `open_draft_pr`. Deny that write; approve only the root.

## Hosted vs local

- **Judges:** https://loop.heisenbug.in — LOOP agent `01m1aaemb86czjax2v232nxygf`, OpenAI GPT-5.6 Luna (`openai/gpt-5-6-luna`).
- **Film source (do not click):** local session `01m1a87xjewncn310ymqy3yz01` on `[::1]:8790` (4.1-mini). Qualify PASS. Never Approve/Deny that session.


- **Hosted FAIL, do not retry:** `01m1advv5np7mqwse1xf2hdpyc` (empty-cwd skip, no `open_draft_pr`); `01m1ayqn9563da3mgerw6nwpq5` (asked the user about subagent overload; no clone, no pause). Ignore empty `01m1ayra0m7tdj5rphtnsqevyw`. `ask_user_questions` is now off so a new hosted session cannot bail that way.

Free OpenRouter: do not use Luna or paid 4.1-mini on the hosted agent.
