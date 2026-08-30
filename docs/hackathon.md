# Hackathon rules

Sources: [trueforge](https://www.wemakedevs.org/hackathons/trueforge), [rules](https://www.wemakedevs.org/hackathons/trueforge/rules), [resources](https://www.wemakedevs.org/hackathons/trueforge/resources), [kickoff guide](https://www.wemakedevs.org/blogs/agent-harness-hackathon-kick-off). Team **thExplorers**.

## Qualify

A judge has to see TrueForge:

1. reach a **tool**
2. run code in the **sandbox**
3. **pause** for a person

Chat-around-a-model fails. If it would work as a chatbot, change the project.

Also required:

- Public repo, README a stranger can run.
- Built during the week (Mon 24 Aug 8:00 London → Sun 30 Aug 8:00pm London). Pre-week notes/diagrams OK. A pre-existing project as the submission is **not** OK.
- Qodo trail on substantive PRs (see below). Direct `main` pushes do not count.
- Keys and personal data out of the repo **and** the video.
- AI coding assistants allowed; **must be disclosed**. Participants must understand the code.

Official page: tools should be **connected, not mocked**. LOOP's warehouse MCP is `mode:fixture` for the conversion-drop story — honest Best Use risk. Live GitHub write can stay gated. Do not claim fixtures are production.

## Six equal criteria

Demo is scored as hard as the code.

1. Potential impact
2. Creativity and originality
3. Technical excellence
4. Use of sponsor tools (TrueForge central, not a wrapper; Qodo reviewed the PRs)
5. Control and safety (sandbox + human pause)
6. Presentation

Small fully working beats big half-done. ~3 min demo. No login on demo if possible.

## Tracks

Team selected **all four** on the form. Judges still award **one judged-track prize per team**.

| Track | Prize | Notes |
| --- | --- | --- |
| Best Use of TrueForge (Double-O) | NVIDIA DGX Spark, team | MCP tools, sandbox, pause, subagents, **session that survives refresh/reconnect/restart** |
| Best Code Quality (Q Branch) | Mac Mini, team | Qodo trail. Clone, understand, extend. |
| Best UI (Savile Row) | iPad **per member** | Doing / waiting / did. Ask **before** write. Judged on **demo + running project**, not a screenshot. |
| Best Blog (Field report) | Keychron, one writer | Separate prize, not one of the three judged tracks |

Hero card on the site: **Incident responder**. Cookbook (TrueForge examples, not on `main`): CI fixer, database analyst, security auditor, incident-investigator, six more. See contradictions.

## Qodo

Required of every submission, not only Best Code Quality.

1. Branch
2. PR
3. `/agentic_review` (if the app did not auto-start)
4. Fix every valid **High**, or dismiss in the Qodo thread **with a reason**
5. Push; follow-up review against the final code
6. **Human** merge

README needs `## Qodo Code Review Evidence`: link to at least one **merged** PR with meaningful hackathon code, 1–2 sentences on what Qodo surfaced and what you changed or dismissed, and PR history showing review + decisions + follow-up. **Screenshots ≠ proof.** Public PR link is the evidence. CodeRabbit comments are not evidence.

If Qodo stalls: confirm the GitHub app can reach the repo **and** the repo is selected in the Qodo portal, then `/agentic_review`.

## Deadline vs live page

Clock deadline: **Sunday 30 Aug 2026 8:00pm London**.

As of **Monday 31 Aug 2026 morning IST** the live site still showed submissions/registration open. **No official late-submit policy is written on the page.** Kunal said on the kickoff stream they open late submissions for other timezones — that is spoken, not a page rule. Do not invent a policy. Submit if the form still takes it.

## Contradictions (do not paper over)

- Kickoff **blog** omits Best UI / iPad; lists Logitech MX Master for starring TrueForge. Main page does not list that mouse prize; main page **does** list Best UI / iPad.
- Radio tags: main page says WeMakeDevs + TrueFoundry + **Qodo**. Rules page and kickoff blog omit Qodo.
- Cookbook: ten example agents live on TrueForge `examples` / `examples/agent-cookbook` ([PR #390](https://github.com/truefoundry/trueforge/pull/390), draft), **not** on `main`.
- Node: TrueForge quickstart **22.14+**. Kickoff blog "Node.js 22 or newer".
- Qodo skills install: resources + kickoff blog `npx skills add qodo-ai/qodo-skills/skills`. Qodo docs: `npx skills add qodo-ai/qodo-skills` (no `/skills`). Repo README shows both.

## Skills / sandbox

Skills require a sandbox. Daytona is the provider. Key needs **Sandboxes** access and **Snapshots write** (create). Missing snapshot permission fails provider setup even if the key otherwise looks valid.
