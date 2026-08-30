# Handoff (stable)

Living PR/blocker/URL state: **[status.md](status.md)**. Rewrite that file. Do not append here.

## Team

- Repo: https://github.com/saurabh4269/wemakedevs_agent_harness (public)
- Team: **thExplorers**
- Saurabh Gupta `saurabh4269` — saurabhgupta0342@gmail.com
- Collaborator: `shiwani42`
- `gh` is authed as `saurabh4269`

## Secrets

**Never in git.** Box path: `/home/box/.secrets/loop-trueforge.env` (OpenRouter, NVIDIA backup, Daytona). `.env.example` empty slots only. Do not echo secrets. Do not commit `.env`.

Prefer OpenRouter. NVIDIA backup. Daytona required for skills/sandbox.

## Form (draft, not submitted)

Constraints and URLs: [form.md](form.md). Copy must sound human, about **this week's TrueForge LOOP**. Omit Product OS / ADK.

## Work split

- Agent spec / fixtures / skills / tests: PR #1 `feat/loop-trueforge-agent`. Do not merge until Qodo Highs are fixed or dismissed + follow-up review.
- UI shell: PR #2 `feat/loop-ui`. Do not clobber that worktree or branch.
- This docs handoff: own branch `docs/agent-handoff`.

## Priority

Product first: live conversion-drop → three **subagent** looks → sandbox patch → pause. Blog last. CodeRabbit is noise; Qodo is required.
