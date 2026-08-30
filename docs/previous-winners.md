# Previous winners (steal onto LOOP only)

Kunal told builders to look at previous WeMakeDevs winners. User heard “V McDuff or something” — ASR of **WeMakeDevs**, not a person. He named no project. LOOP stays the incident responder. Steal **patterns**. Do not steal a domain. Do not replace LOOP.

## Kickoff Q&A (sourced)

Video: https://www.youtube.com/watch?v=KgcRgk8Xqgw (`KgcRgk8Xqgw`). Cue-level YouTube timestamps were **not recoverable** (unsigned timedtext empty). Passage is in the live Q&A after Sai’s answer to Jay, right after Sai says “Kunal, if you want to add something to it.” Quoted from the watch-page auto-transcript. Do not treat a clock time as a chapter.

> **Kunal:** So the theme is open-ended. You can build anything. but you have to use TrueForge as the tool, which is what it's all about, like learning about Agent Harnesses. we also look at the idea itself because we have to give credit where it's due. so any important interesting interesting idea that you can find my other recommendation would be **go to the website for previous winners. See what the kind of projects were winning. and we also highlight top 100 something projects out of the thousands that we get. So you can see what kind of ideas they were.** So like people just think outside the box and do something. One other thing is the idea doesn't have to be complex. Many times we have given given away prizes to the very simple ideas, but they were executed very nicely and it was just fun. but that's what I would recommend.

There is **no single /winners hub**. Pattern is per-event `/projects` galleries, e.g. https://www.wemakedevs.org/hackathons/signoz/projects. Index: https://www.wemakedevs.org/hackathons.

Same stream, nearby: this is the **3rd** DGX Spark; last event already gave two. “One person did this at the last event. We had Port as a sponsor and they built a different UI for Port.” Sai in the same stream: **don’t** spend the week on a custom UI.

Kickoff blog (Sachin, 24 Aug 2026) does **not** name previous winners. It points at TrueForge Example Agents (security, research, onboarding, CI, DB, triage, **incident investigation**). Example #1 is a DevOps / incident agent — that **is** LOOP. truefoundry/trueforge PR #390 `examples/incident-investigator` was **404 on `main`** 31 Aug 2026.

## Spark history (this is #3)

| Event | When | Prize | Winners (as of 2026-08-31) |
| --- | --- | --- | --- |
| **Zero Downtime** (Port + Bright Data + SigNoz, SF) | 22–23 Aug 2026 | Two Sparks | **Nitish Mane** — consumer app + Port drift-detect / auto-fix behind a gate. **Gracelyn N, Ben O’Connor, Hugh Hoford** — papers → runnable code. Repos **not public**. Recap: Port.io LinkedIn. WeMakeDevs page 404s. |
| **Into the Scrape-Verse** | 17–23 Aug 2026 | One Spark | **Not published.** Skip (scraping). |
| This week (TrueForge) | 24–30 Aug 2026 | One Spark | LOOP is the page’s Incident responder hero card. |

Honorables at Zero Downtime (DriftForge, ALWAYSUP, Daisy, VoC factory): skip. Kunal’s “custom UI for Port” is this event. Do not copy it.

## Named WeMakeDevs track winners (public)

Kunal pointed at the **gallery pattern**, not these names. Recorded so a later agent does not re-search.

### The Hangover Part AI (Jun–Jul 2026, Cognee)

| Project | Who | What | Steal? |
| --- | --- | --- | --- |
| **Lethe** (Track 1) | Vinayak Sonthalia | Incident-triage assistant; **cited** runbook answers; **verifiably forgets** decommissioned systems | **Pattern #2**. Hackathon repo 404 as of 31 Aug 2026. Do **not** take `yerramsettysuchita/lethe` (different product). Later ARGUS: https://github.com/vinayaksonthalia/argus |
| Classroom Memory (Track 2) | Rajdeep Kushwaha | Student memory | Skip |

### Pirates of the Coral-Bean (May 2026, Coral)

| Project | Who | What | Steal? |
| --- | --- | --- | --- |
| **Manthan** (Track 1) | Akash Mondal, Hitakshi Arora (Miny-Labs) | Parallel read specialists (Stripe + CRM + logs + support) → cited brief → **one-click approval**. LLM never holds write creds. | **Pattern #1**. https://github.com/akash-mondal/manthan · https://github.com/Miny-Labs/manthan |
| GSoC matchmaker (Track 2) | | | Skip |

### Agents of SigNoz (Jul 2026)

Gallery: https://www.wemakedevs.org/hackathons/signoz/projects

| Project | Who | What | Steal? |
| --- | --- | --- | --- |
| CrewAI OpenTelemetry | Srinjoy Roy | Native OTel for CrewAI into SigNoz | Skip (instrumentation). Public repo not found. |
| **DebugProof** | Dhruv Sachdev | CI gate: block a build that isn’t diagnosable | Adjacent idea only. Not LOOP’s incident loop. Repo not found. |
| **RootCause** | Shashwat Pratap Singh | Hydroponic farm observability | Skip (domain) |

Not track winners, SRE-shaped (do not cite as “Kunal named these”): [Agent K](https://github.com/100xRahul/agent-k-signoz), [Aro](https://github.com/Shivam-Katare/signoz-hackathon).

## Two patterns onto LOOP (stop there)

1. **Manthan shape.** Coordinator fans out **scoped parallel readers**; they write a **shared cited evidence set**; coordinator emits a **decision brief**; a **policy gate** sits in front of a **deterministic actor** that holds the write. The model never executes the irreversible step. LOOP already: analytics / logs / deploys → independence check → Type A Daytona patch → pause on root `open_draft_pr`. Steal **citation chips on the brief** (generative UI card), not a fifth agent, not Coral/Stripe/Clerk.
2. **Lethe “still true?”** Do not apply a runbook for a service or version that is gone. Before the pause: one MCP check that the deploy SHA / plan id in the brief still matches live. If stale, say so and **do not** open a PR. Implement with LOOP warehouse reads, not Cognee `forget()`.

## Skip

- Custom Port / sponsor UI (Kunal called it funny; Sai said don’t).
- Port “factory not an app.” LOOP is one incident, end to end.
- Scrape-Verse, CrewAI OTel, farm IoT, papers→code, Classroom Memory, chargebacks, Cognee APIs.
- DebugProof as a product. HMAC theater, five extra subagents, this week’s TrueSRE / AutoVault feature-max.
- Nested subagents. Auth walls. Replacing analytics / logs / deploys. Leaving TrueForge.

## This week’s competitors (not previous winners)

- TrueSRE (Vishal Rajput) — same incident domain, platform sprawl. Don’t copy.
- AutoVault (Parth Pinjarkar) — five parallel security subagents. LOOP already has three named looks + pause.

LOOP wins Spark by being the hero card **done**, not by matching their feature count. Simple ideas, executed cleanly — Kunal’s own words.
