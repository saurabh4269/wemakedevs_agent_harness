# Handoff (stable)

Living PR/blocker/URL state: **[status.md](status.md)**. Rewrite that file. Do not append here.

## Team

- Repo: https://github.com/saurabh4269/wemakedevs_agent_harness (public)
- Team: **thExplorers**
- Saurabh Gupta `saurabh4269`
- Collaborator: `shiwani42`
- `gh` is authed as `saurabh4269`

## Secrets

**Never in git.** Box path: `/home/box/.secrets/loop-trueforge.env` (OpenRouter, NVIDIA backup, Daytona). `.env.example` empty slots only. Do not echo secrets. Do not commit `.env`.

Prefer OpenRouter. NVIDIA backup. Daytona required for skills/sandbox.

## Form (draft, not submitted)

Constraints and URLs: [form.md](form.md). Copy must sound human, about **this week's TrueForge LOOP**. Omit Product OS / ADK.

## Work split

- Agent spec / fixtures / skills / tests: PR #1 **merged** (`f1651fa`). Qodo follow-up on `9b8b17ed`: Bugs (0); all five findings resolved.
- UI shell: PR #2 `feat/loop-ui`. Do not clobber that worktree or branch.
- This docs handoff: own branch `docs/agent-handoff`.

## Priority

Product: conversion-drop with three named subagents + root pause is live; reconnect PASS. Remaining: fresh Daytona key in Settings → Sandbox (Spark hole), deny extra patcher write / approve root, PR #2 `8c96416` (workspaces + no client token) with Qodo follow-up in flight. Blog last. CodeRabbit is noise; Qodo is required.
