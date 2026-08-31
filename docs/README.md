# LOOP docs

Curated handoff for the next agent. Not a chat dump. If a fact moved, rewrite the file that owns it.

Start here: root [AGENTS.md](../AGENTS.md), then this index, then [learnings.md](learnings.md), [status.md](status.md), [next.md](next.md).

| File | Owns |
| --- | --- |
| [learnings.md](learnings.md) | Pitfalls and the fix for each. Read after AGENTS.md. |
| [runbook.md](runbook.md) | How to run locally, deploy, import, wake, DNS. Commands. No secrets. |
| [status.md](status.md) | **Living.** PRs, live host, sessions, blockers. Rewrite, do not append. |
| [next.md](next.md) | Ordered remaining work. |
| [hackathon.md](hackathon.md) | Official rules, tracks, Qodo trail, qualify trio |
| [organizers.md](organizers.md) | Kickoff + harness explainer (Kunal, Sai). What they mark. |
| [previous-winners.md](previous-winners.md) | WeMakeDevs prior winners + TrueForge examples. Steal onto LOOP only. |
| [product.md](product.md) | LOOP decisions and honest limits |
| [handoff.md](handoff.md) | Team, secrets *path*, form URLs |
| [decisions.md](decisions.md) | Numbered ADRs |
| [demo.md](demo.md) | Judge-facing 3-min shot list + Remotion take |
| [audit.md](audit.md) | Real vs fixture; qualify beats; how a judge should audit |
| [form.md](form.md) | Submission form constraints + human draft answers |
| [blog.md](blog.md) | Field report (publish to github.io `/blog/trueforge-harness/`) |

How to run is also the root [README.md](../README.md).

## How to update this handoff

1. Change of PR / blocker / URL / live TrueForge / session → rewrite [status.md](status.md). Do not append a log.
2. New failure mode → add a numbered pitfall in [learnings.md](learnings.md).
3. Change of product shape or "what not to build" → [product.md](product.md) and root `AGENTS.md`.
4. Change of official rules → [hackathon.md](hackathon.md) (cite the page). Record contradictions; do not invent a late-submit policy.
5. Form field or URL change → [form.md](form.md).
6. A decision that should survive the week → add an ADR in [decisions.md](decisions.md).
7. Remaining work order → [next.md](next.md).
8. Organizer quotes, extras they named, skip-list → [organizers.md](organizers.md).
9. Prior WeMakeDevs winners / TrueForge example agents → [previous-winners.md](previous-winners.md). Curate. No transcript dumps.
10. Never commit secrets. Never paste `.env`. Point at `/home/box/.secrets/loop-trueforge.env` and stop.
