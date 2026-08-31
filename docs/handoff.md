# Handoff (stable)

Living PR/blocker/URL state: **[status.md](status.md)**. Pitfalls: **[learnings.md](learnings.md)**. Run/deploy: **[runbook.md](runbook.md)**. Remaining work: **[next.md](next.md)**. Rewrite those. Do not append here.

## Team

- Repo: https://github.com/saurabh4269/wemakedevs_agent_harness (public)
- Team: **thExplorers**
- Saurabh Gupta `saurabh4269` (`saurabhgupta0342@gmail.com`), Asia/Kolkata
- Collaborator: `shiwani42`
- `gh` is authed as `saurabh4269`

## Secrets

**Never in git.** Box path: `/home/box/.secrets/loop-trueforge.env` (OpenRouter, NVIDIA backup, Daytona). `.env.example` empty slots only. Render dashboard `sync: false`. Do not echo secrets. Do not commit `.env`. A Daytona key was pasted in chat — rotate if that transcript is shared.

Prefer OpenRouter `:free` on hosted. NVIDIA backup. Daytona required for skills/sandbox. User OpenRouter account has **$0 credits**.

## Form (draft, not submitted)

Constraints and URLs: [form.md](form.md). Copy must sound human, about **this week's TrueForge LOOP**. Omit prior control-plane work / ADK. Live URL https://loop.heisenbug.in. Video must be YouTube ≤3 min (current Vimeo placeholder is wrong).

## Work split

- Agent spec / fixtures / skills / tests: PR #1 **merged**.
- UI shell: PR #2 **merged**. Do not clobber `feat/loop-ui`.
- Docs v1: PR #3 **merged**. This living rewrite is `docs/living-handoff-autodeploy`.
- Sandbox clone harden: PR #5 **merged**.
- Organizer research: PR #6 **merged**.
- Render host: PR #7 **merged**.
- PR #4 **closed**. Do not reopen.

## Priority

See [next.md](next.md). Short: land the hosted-qualify harden PR, re-import Nemotron, new hosted conversion-drop (or film the local PASS), then YouTube, publish the Field Report, then form. Qodo Highs 0 before every merge. CodeRabbit is noise.
