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
- UI shell: PR #2 **merged** (`e221fb05`). Qodo Bugs (0). Do not clobber `feat/loop-ui`.
- This docs handoff: own branch `docs/agent-handoff`.

## Priority

Product: conversion-drop with three named subagents + root pause is live; reconnect PASS. Remaining: Daytona Spark hole (key auth-200s, snapshot create 403, missing write:snapshots, no provider configured), deny extra patcher write / approve root. PR #1 and #2 merged with Qodo Bugs (0). Blog last. CodeRabbit is noise; Qodo is required. Remaining Qodo on PR #3: dismiss loop-github inheritance as a documented platform limit.
