# LOOP docs

Curated handoff for the next agent. Not a chat dump. If a fact moved, rewrite the file that owns it.

| File | Owns |
| --- | --- |
| [hackathon.md](hackathon.md) | Official rules, tracks, Qodo trail, qualify trio |
| [organizers.md](organizers.md) | Kickoff + harness explainer (Kunal, Sai) |
| [product.md](product.md) | LOOP decisions and honest limits |
| [handoff.md](handoff.md) | Team, secrets *path*, form URLs, priorities |
| [status.md](status.md) | **Living.** PRs, blockers, live TrueForge, demo URLs |
| [decisions.md](decisions.md) | Numbered ADRs |
| [form.md](form.md) | Submission form constraints (no essay paste) |

Agent OS is the root [AGENTS.md](../AGENTS.md). How to run is the root [README.md](../README.md).

## How to update this handoff

1. Change of PR / blocker / URL / live TrueForge → rewrite [status.md](status.md). Do not append a log.
2. Change of product shape or "what not to build" → [product.md](product.md) and root `AGENTS.md`.
3. Change of official rules → [hackathon.md](hackathon.md) (cite the page). Record contradictions; do not invent a late-submit policy.
4. Form field or URL change → [form.md](form.md).
5. A decision that should survive the week → add an ADR in [decisions.md](decisions.md).
6. Never commit secrets. Never paste `.env`. Point at `/home/box/.secrets/loop-trueforge.env` and stop.
