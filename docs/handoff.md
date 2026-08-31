# Handoff (stable)

Living PR/blocker/URL state: **[status.md](status.md)**. Pitfalls: **[learnings.md](learnings.md)**. Run/deploy: **[runbook.md](runbook.md)**. Remaining work: **[next.md](next.md)**. Rewrite those. Do not append here.

## Team

- Repo: https://github.com/saurabh4269/wemakedevs_agent_harness (public)
- Team: **thExplorers**
- Saurabh Gupta `saurabh4269` (`saurabhgupta0342@gmail.com`), Asia/Kolkata
- Collaborator: `shiwani42`
- `gh` is authed as `saurabh4269`

## Secrets

**Never in git.** Box path: `/home/box/.secrets/loop-trueforge.env`. Hosted uses OpenAI GPT-5.6 Luna (`OPENAI_API_KEY` in gitignored `.env` / Render `sync: false`). `.env.example` empty slots only. Do not echo secrets. Do not commit `.env`. Keys pasted in chat (OpenAI, Daytona) — rotate if that transcript is shared.

Hosted model is Luna. Local film may stay OpenRouter 4.1-mini. Daytona required for skills/sandbox.

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

See [next.md](next.md). Short: land PR #9 after Qodo Highs 0, human-merge, re-import Luna with `LOOP_SKILL_REF=main`, film the hosted pause, publish the Field Report, then form. CodeRabbit is noise.
