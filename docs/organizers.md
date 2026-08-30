# Organizers

What Kunal and Sai actually said, plus who else sits around the prize. Cite the source. Do not invent quotes. Prior-winner mapping lives in [previous-winners.md](previous-winners.md).

## People

| Person | Role | Source |
| --- | --- | --- |
| **Kunal Kushwaha** | Founder, WeMakeDevs. Host of both spec videos. | Kickoff `KgcRgk8Xqgw`, harness `bqgz6gOK5OA` |
| **Sai Krishna** | FDE & DevRel @ TrueFoundry (`mnvsk97`). Kickoff intro ASR said "LFT"; listings say FDE. | Kickoff, Luma SF judges, LinkedIn |
| **Sachin Sharma** | Manager @ WeMakeDevs. Wrote the Getting Started blog. | [Kickoff blog](https://www.wemakedevs.org/blogs/agent-harness-hackathon-kick-off) 24 Aug 2026 |
| **Abhishek Choudhary** | Co-founder/CTO TrueFoundry. Kunal: interviews are with the founders, confirmed with Abhishek. | Kickoff transcript; truefoundry.com |
| **Nikunj Bajaj** | CEO, TrueFoundry | Company site. Not on the two videos. |
| **Anuraag Gutgutia** | COO, TrueFoundry | Company site. Not on the two videos. |

No NVIDIA or Daytona employee is named on the official page, in either spec video, or on the Luma SF page. SF-day extra judges on Luma (not the online page): Adam Eliezerov (Arbium), David Perry (Qodo).

## Kickoff — Kunal + Sai

https://www.youtube.com/watch?v=KgcRgk8Xqgw (oEmbed title: "The Agent Harness Hackathon: Building with TrueForge")

Kunal: the only URL is [wemakedevs.org/hackathons/trueforge](https://www.wemakedevs.org/hackathons/trueforge). Harness = **license to act**. Install Qodo before you merge. Tracks on stream: Best Use / DGX Spark, Best Code Quality / Mac Mini, Best UI / iPad to every member, Best Blog / Keychron, top-10 social swag, interviews at TrueFoundry. Deadline Sunday ~8pm London. He also said they open late submissions for other timezones — **not written on the page**; see [hackathon.md](hackathon.md).

Pick one small job. Ship V1, save it, then add. Small fully working > big half-done. Do not spend the week on auth. Deploy is not mandatory. Beginners OK.

Sai: TrueForge is the open-source harness. `npx @truefoundry/trueforge` local chat UI. Settings: models, connectors (MCP), skills, Daytona sandbox. Use **stock TrueForge UI** unless the product needs another. Want a **real-world** job, not a toy. Demo ~2.5–3 min.

User heard Kunal say look at previous winners "on V McDuff or something." ASR of **WeMakeDevs**. Quote recovered in the kickoff Q&A (no cue timestamp). He names no project: go to the website, simple ideas executed well. See [previous-winners.md](previous-winners.md).

### Quotes (watch-page auto-transcript)

Kunal:

> "the harness actually gives the model like a license to act."

> "Less number of features that are working perfectly." / "just pick something very very small, build it end to end"

Sai, self-intro (ASR; listings say FDE not LFT):

> "I'm Sai. I'm a DevRel and an LFT at True Foundry. True Foundry is the AI gateway company."

Sai, on Best Use (Jay's question):

> "Think of building a project that is close to a like a real real problem. And like they just show us how you're using TrueForce to get there."

> "I'm also interested we're also interested in how you will use the generative UI part of it. [...] And there's code mode like some interesting use cases there as well. [...] And sandboxes, there are tons of things you can you can do with sandboxes, right? Parallel stuff, how many sub agents are you spinning up [...] Fundamentally, it should be a use case that is close to a real world problem."

Sai, stock UI is enough:

> "And if you just run TrueForge like NPX TrueFoundry/TrueForge, you already have a UI. So, do not spend a lot of time unless your project has a completely different UI. [...] Focus on the core problem you're trying to solve."

## Harness explainer — Kunal

https://youtu.be/bqgz6gOK5OA (oEmbed title: "AI agent harnesses, explained (with a live demo)")

Opens with Jason Lemkin / Replit: agent ignored "stop" and deleted a production DB. Missing layer = harness. Model = engine. Harness = car.

> "I am the gate, not the model. Right? And I'm not like prompt telling it to please be careful or whatever."

Default pause on destructive MCP. Reckless agent is not the default — empty `require_approval_for_tools` via the API on purpose. **Agent steps** records thinking, tool call + args, approval, result. Linger on that panel in the demo.

Sandbox-as-a-tool: spin up only when the agent needs to run code; secrets stay in the harness.

## What they mark (Spark)

Qualify trio from the live page: MCP tool, Daytona sandbox exec, pause before irreversible. LOOP already is the page's **Incident responder** hero card. Do not rebrand.

Extras Sai named, in order, **inside the same conversion-drop run** (ADR 8):

1. Generative UI after the three looks (chart + table + Type A/B card). `config.generative_ui.enabled` is already true.
2. Code Mode in Daytona: Python + `mcp_client` aggregates counts; print a table; do **not** put `open_draft_pr` in the script.
3. Parallel named subagents (already the product — film them).
4. Session refresh (already proven — optional on tape).
5. Linger on Agent Steps at the pause (zero code).

## Skip

Custom UI/auth, second agent, nested/19 subagents, merge/prod-deploy, TrueFoundry gateway traces, new domains (land maps, DPDP, eBPF, Product OS), clarifying-questions as a second form, Qodo as a Spark extra (it is Mac Mini), Bright Data / NVIDIA NIM as the product.

## Official written examples

Sachin's kickoff blog, example #1, is a developer-operations / incident agent: MCP inspect, subagents, sandbox diagnostic, suggested fix, ask before a sensitive action. That is LOOP. Do not swap the idea.
