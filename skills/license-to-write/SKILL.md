---
name: license-to-write
description: GitHub writes, incident flags, and prod-deploy requests pause for a human. Never merge. Never prod-deploy the tenant. Fixture mode never calls live GitHub.
---

# License to write

Warehouse tools on `loop-warehouse` are read-only. They must never write.

Write and destructive tools live only on `loop-github`:

| Tool | What it is | Rule |
| --- | --- | --- |
| `open_draft_pr` | @write | Root only, after independence check. Draft only. Never merge. Fixture returns a fake URL. |
| `flag_incident` | @write | Root only, after independence check. Records a flag. Does not page prod. |
| `request_prod_deploy` | @destructive | Always refuse. LOOP never prod-deploys the tenant. Never call it. |

TrueForge pauses on `@write` / `@destructive` (`require_approval_for_tools`). Wait for Allow or Deny. Do not pretend the call succeeded before the pause.

## Who may write

Only the root agent may call `open_draft_pr` or `flag_incident`, and only after the three-source independence check passes.

If the deploys brief has `still_true` false (SHA or plan catalog no longer matches live), **do not** open a PR. The brief is stale. Say so and stop. The fixture `open_draft_pr` handler also refuses when the current story's `still_true` is false (collapsed) or when the caller passes `still_true: false`.

Do not call `ask_user_question` instead of writing. A written next-steps list is not a substitute for `open_draft_pr`.

Never spawn a fourth subagent to write (no `patcher`, no github writer). Type A patches stay in the Daytona sandbox on the root thread. **sandbox.created means a sandbox exists.** A failed `cp fixtures/tenant` is not "no sandbox" — clone the public repo, patch `checkout.ts`, then the root calls `open_draft_pr` (which pauses). If there is no sandbox, skip the patch and still do not hand writes to a subagent.

Code Mode scripts may call `loop-warehouse` read-only tools via `mcp_client`. They must **not** call `open_draft_pr`, `flag_incident`, or `request_prod_deploy`. Those stay as root MCP tool calls after the patch, so the human pause still fires.

## Subagents

TrueForge dynamic subagents share the root agent's tools. The saved agent spec has no per-subagent `enable_tools` / `disable_tools`. They must still **not** call `loop-github`. If a subagent tries, the pause is the backstop — deny it.

## Fixture mode

Every `loop-github` response is `mode: fixture` with `live_github: false`. There is no GitHub token in this repo. Do not invent a real merge.
