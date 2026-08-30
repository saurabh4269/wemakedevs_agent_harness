# Previous winners (steal onto LOOP only)

Kunal told builders to look at previous WeMakeDevs winners. User heard "V McDuff or something" — treat that as **WeMakeDevs**, not a person. LOOP stays the incident responder. Steal **patterns**. Do not steal a domain. Do not replace LOOP.

## What is sourced vs not

| Claim | Source | Status |
| --- | --- | --- |
| Look at previous WeMakeDevs winners | User recollection of kickoff Q&A | Phonetic match WeMakeDevs. **No timestamped caption recovered** in this pass. Do not invent a quote. Replace this row if captions land. |
| TrueForge Example Agents as starting points | [Kickoff blog](https://www.wemakedevs.org/blogs/agent-harness-hackathon-kick-off) (Sachin Sharma, 24 Aug 2026) | Named: security auditing, research, codebase onboarding, CI fixes, database analysis, issue triage, **incident investigation**. |
| Blog example #1 is a DevOps / incident agent | Same blog | MCP + subagents + sandbox diagnostic + ask before sensitive action. That **is** LOOP. |
| This is the **3rd** WeMakeDevs DGX Spark | Kunal LinkedIn 26 Aug 2026 | Spark #2 = Into the Scrape-Verse (17–23 Aug 2026). Spark #1 winner **not found** in public posts searched 31 Aug 2026. Do not invent a name. |
| Scrape-Verse track winners | Event page https://www.wemakedevs.org/hackathons/scrape-verse | Page does not list project winners as of 31 Aug 2026. |
| Agents of SigNoz track winners | WeMakeDevs LinkedIn 5 Aug 2026 | Official names below. Closest prior WeMakeDevs hackathon with a published winner list. |

truefoundry/trueforge PR #390 adds an `examples/` tree (including `incident-investigator` on Sentry). That tree was **404 on `main`** when fetched 31 Aug 2026. Do not assume it is on the default branch.

## Agents of SigNoz (20–26 Jul 2026) — announced winners

Source: WeMakeDevs LinkedIn, 5 Aug 2026, "Agents of SigNoz: Track Winners Announcement".

| Track | Winner | What they built |
| --- | --- | --- |
| 1 AI & Agent Observability | Srinjoy Roy | Native OpenTelemetry instrumentation for CrewAI: agent / LLM / tool traces into SigNoz with dashboards and alerts. |
| 2 Signals & Dashboards | Dhruv Sachdev | **DebugProof** — release gate that uses SigNoz telemetry to check whether production failures remain diagnosable before deploy. |
| 3 Build Your Own | Shashwat Pratap Singh | **RootCause** — hydroponic farm observability on OTel + SigNoz, live dashboards, alerts, fault injection. |

GitHub URLs for those three were **not verified** here. Do not paste guessed repos.

Related SigNoz builds (not the track winners; useful as SRE shape, not as "Kunal named these"):

- [Agent K](https://github.com/100xRahul/agent-k-signoz) — on-call SRE through SigNoz, guarded remediation, hash-chained audit. README fetched.
- [Aro](https://github.com/Shivam-Katare/signoz-hackathon) — SRE copilot on self-hosted SigNoz. Swag, not a track prize.

Official SigNoz page example build: "SRE Sidekick with SigNoz MCP". LOOP is that shape on TrueForge, not SigNoz.

## Two patterns to steal (LOOP only)

1. **Sponsor product is the product.** CrewAI winner won by making SigNoz the spine (traces, dashboards, alerts), not a wrapper UI. For LOOP: stock TrueForge chat + Agent Steps is the demo. Generative UI and Code Mode are harness features, not a custom dashboard. Sai: do not spend the week on auth.
2. **Diagnosability gate before the irreversible write.** DebugProof refuses a release if the failure would be undiagnosable. Agent K remediates only behind a gate. LOOP already has this: three independent looks, refuse if collapsed, Type A patch in Daytona, pause on root `open_draft_pr`, never merge, never prod-deploy. Make that gate **visible** (independence card / gen UI) the way their dashboards made the gate visible.

## Skip

- Do not rebuild SigNoz, CrewAI instrumentation, a farm IoT stack, or a Bright Data scraper (Scrape-Verse).
- Do not add HMAC theater, five extra subagents, or a second agent because this week's **other** Agent Harness blogs did (TrueSRE, AutoVault). Those are this hackathon, not previous winners. Kunal/Sai: fewer features working perfectly.
- Do not nest subagents. TrueForge docs: one level.
- Do not treat "closed loop: agent is also observed" as a new product. Linger on Agent Steps instead.

## This week's competitors (not previous winners)

Public Agent Harness write-ups as of 31 Aug 2026, for contrast only:

- TrueSRE (Vishal Rajput) — multi-agent SRE, FastMCP, Daytona, HMAC HITL. Same incident domain as LOOP. Do not copy the platform sprawl.
- AutoVault (Parth Pinjarkar) — five parallel security subagents, pause before irreversible. Same harness extras. LOOP already has three named looks + pause.

LOOP wins Spark by being the hero card **done**, not by matching their feature count.
