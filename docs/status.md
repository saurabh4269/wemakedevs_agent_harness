# Status

Rewrite this file when PRs, blockers, or URLs change. Do not append a log. Last rewrite: **2026-08-31 ~01:20 IST**.

## PRs

| PR | Branch | What | State |
| --- | --- | --- | --- |
| [#1](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/1) | `feat/loop-trueforge-agent` | Agent spec, fixture MCP, skills, import, tests | Open. `/agentic_review` posted. Qodo summary + **4 Highs** in. Waiting: fix or dismiss Highs, then follow-up review. **Do not merge.** |
| [#2](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/2) | `feat/loop-ui` | LOOP TrueForgeUI shell for the write-pause demo | Open. Do not clobber. |
| this docs PR | `docs/agent-handoff` | AGENTS.md rewrite + `docs/` | Open against `feat/loop-trueforge-agent` |

Qodo Highs on #1 (must handle before merge): MCP URL logged in `import-loop`; package `engines` Node `>=20.19` vs SDK 22; detached MCP `attach()` promises; model FQN check is "contains `/`" not `provider/name`. CodeRabbit comments exist; ignore for evidence.

## Live TrueForge

- **v0.1.4** at http://localhost:8790 (local npx, SQLite, no login).
- Agent `loop` **did** run the conversion-drop prompt.
- Write-gate **worked**: paused on `open_draft_pr` with Approve/Deny in **Agent steps**.
- **Blockers (fix these, do not demo around them):**
  - Daytona **401**. `sandbox.enabled=false`. Skills are **not** on the agent.
  - Root used the **three warehouse tools itself** instead of spawning analytics / logs / deploys subagents.
- Intended public host https://loop.thexplorers.xyz is not this local process. Compose path is :8791.

## Form / demo URLs (draft)

- Repo: https://github.com/saurabh4269/wemakedevs_agent_harness
- Deployed (optional on the form): https://loop.thexplorers.xyz/
- Video field is **YouTube**, ≤3 min. Current placeholder https://vimeo.com/1222508816 (4s, Shiwani) is the **wrong host** — replace.
- Blog https://saurabh4269.github.io/blog/trueforge-harness/ — 404, do last.

## Box

Node on the box was 20.19.2. TrueForge wants 22.14+.
