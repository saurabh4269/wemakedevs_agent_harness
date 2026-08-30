# Organizers (from the videos)

## Kickoff — Kunal + Sai

https://www.youtube.com/live/KgcRgk8Xqgw

Kunal: the only URL is [wemakedevs.org/hackathons/trueforge](https://www.wemakedevs.org/hackathons/trueforge). Harness = **license to act** (model is the engine; you do not ship an engine). Install Qodo before you merge. Tracks he named on stream: Best Use / DGX, Best Code Quality / Mac Mini, Best UI / iPad to every member, Best Blog / Keychron, top-10 social swag, interviews at TrueFoundry. Deadline Sunday ~8pm London; "you have all of Sunday." He also said they open late submissions for other timezones — **not written on the page**; see [hackathon.md](hackathon.md).

Pick one small job. Ship V1, save it, then add. Five days is enough (even starting Wednesday). Small fully working > big half-done. Do not spend the week on auth — judges should see the demo without creating an account. Deploy is not mandatory; he still told people to deploy because it is easy. Beginners OK; AI coding tools OK.

Sai: TrueForge is the open-source harness (loop, tools, skills, sandbox, approvals, UI). `npx @truefoundry/trueforge` local chat UI. Settings: models (any OpenAI-compatible), connectors (MCP), skills (GitHub import), Daytona sandbox. Capabilities: generative UI, dynamic subagents, clarifying questions. Use **stock TrueForge UI** unless the product needs another. Generative UI, code mode, sandbox, subagents are extra credit. Want a **real-world** job, not a toy. Demo ~2.5–3 min, end to end.

## Harness explainer — Kunal

https://youtu.be/bqgz6gOK5OA

Opens with Jason Lemkin / Replit: agent ignored "stop" and deleted a production DB. Missing layer = harness.

Model = engine. Harness = car (loop / transmission, tools / steering, pause / brakes, sandbox + agent-steps log / seatbelts and dashboard). TrueForge default: **pause on destructive MCP tools**. Reckless agent is not the default — you have to empty `require_approval_for_tools` via the API on purpose. **Agent steps** panel records thinking, tool call + args, approval, result.

Sandbox-as-a-tool: spin up only when the agent needs to run code; secrets stay in the harness.
