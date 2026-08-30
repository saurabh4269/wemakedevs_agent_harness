---
name: license-to-write
description: GitHub writes, incident flags, and prod-deploy requests pause for a human. Never merge. Never prod-deploy the tenant. Fixture mode never calls live GitHub.
---

# License to write

Warehouse tools on `loop-warehouse` are read-only. They must never write.

Write and destructive tools live only on `loop-github`:

| Tool | What it is | Rule |
| --- | --- | --- |
| `open_draft_pr` | @write | Draft only. Never merge. Fixture returns a fake URL. |
| `flag_incident` | @write | Records a flag. Does not page prod. |
| `request_prod_deploy` | @destructive | Always refuse. LOOP never prod-deploys the tenant. |

TrueForge pauses on `@write` / `@destructive` (`require_approval_for_tools`). Wait for Allow or Deny. Do not pretend the call succeeded before the pause.

## Subagents

TrueForge subagents share the root agent's tools. They must still **not** call `loop-github`. If a subagent tries, the pause is the backstop — deny it.

## Fixture mode

Every `loop-github` response is `mode: fixture` with `live_github: false`. There is no GitHub token in this repo. Do not invent a real merge.
