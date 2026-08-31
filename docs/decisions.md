# Decisions

1. **TypeScript only.** TrueForge SDK and this repo are TS. No second language for product code.
2. **Write in Grok Bot, not Cursor CloudAgent**, unless Saurabh asks. CloudAgent is a hard no by default.
3. **Fixture GitHub, not live, for demo safety.** Warehouse + github MCP are `mode:fixture`. No token in git. Honest Best Use risk vs "connected not mocked."
4. **Never merge. Never prod-deploy.** Agents open PRs. `request_prod_deploy` refuses. Humans merge after Qodo.
5. **Four-track thinking.** Form selected all four. Judges give one judged-track prize. Build so Best Use (tool + sandbox + pause + session) and Best UI (doing/waiting/did + ask before write) are visible on the same demo. Qodo trail is the Code Quality evidence. Blog is last.
6. **TrueForge UI over custom campus.** Stock chat, or a themed `@truefoundry/trueforge-ui` embed. No dark SOC. No auth for judges.
7. **Independence as code, not only prompt.** `src/independence.ts` + tests. Skill restates it. Collapsed fixture story must refuse.

8. **Spark extras stay inside the same LOOP incident.** Generative UI after the three looks, then Code Mode aggregation in Daytona. No second agent, no new domain. Sai named those extras; Kunal wants fewer features working perfectly. See [organizers.md](organizers.md).
9. **Steal previous-winner *patterns*, not their product.** WeMakeDevs SigNoz winners and TrueForge example agents are inspiration. LOOP remains the incident responder. See [previous-winners.md](previous-winners.md).
10. **Production-shaped product.** A filmed run is a consequence, not the reason the system exists. Do not add demo-only theater.
11. **Hosted TrueForge on Heroku while Render free is exhausted.** Not Vercel, not a Cloudflare tunnel, not standalone SQLite. Topology is one container dyno (`heroku.yml`) with Heroku Postgres + Redis, `STANDALONE=false`. Fixture MCP is colocated on `127.0.0.1:8788`. OIDC unset for no-login judges. Keys stay in `heroku config`. Do not store `HEROKU_API_KEY` in git. Do not Apply `render.yaml` on workspace `tea-ctoktrjtq21c73cufog0`. Judge URL stays https://loop.heisenbug.in (CNAME `loop` only).

12. **Image deploy does not re-import LOOP.** Postgres holds the agent. After a new database (Heroku cutover) or `agents/loop.json` / skills change, run `import-loop.ts` against the judge URL with Luna env vars. Do not store `RENDER_API_KEY` or `HEROKU_API_KEY` in git.

13. **Hosted model is OpenAI GPT-5.6 Luna.** Cost-tier of the GPT-5.6 family (`openai/gpt-5-6-luna`, `parallel_tool_calls: true`, `max_tokens: 4096`, `iteration_limit: 40`). TrueForge 422'd `reasoning_effort` on this model — omit it. OpenRouter `:free` Nemotron 503'd and then hit the daily cap. Local film agent may stay on 4.1-mini. `import-loop.ts` must be passed the Luna env vars on the judge host.

14. **Fixture MCP is labeled on purpose.** Warehouse is a canned story. `open_draft_pr` returns `mode:fixture` and a fake `html_url`. Say that out loud. Do not hide it from Kunal/Sai. Qualify still uses real TrueForge MCP, Daytona, and the write-approval pause.

15. **Clock deadline passed; keep building.** Official close was Sun 30 Aug 2026 8:00pm London. Live page still said Submissions are open as of 2026-08-31 morning IST. No written late policy. Do not invent one.

16. **`ask_user_questions` stays off.** Hosted Nemotron used `ask_user_question` to bail after the three looks ("service overload") and never reached clone / `open_draft_pr`. Investigation is not a form. If a named subagent fails, retry that exact name once, then continue.

17. **Hosted import cannot replace Luna.** `hostedModelGuard` refuses a judge-host import unless `LOOP_MODEL_FQN` is `openai/gpt-5-6-luna` and the OpenAI provider id/name match.

18. **Stale brief does not write.** Deploys payload includes `still_true`. If it is false, refuse a root cause and do not open a PR. Pattern stolen from Lethe ("still true?"), implemented with LOOP warehouse fields, not a fifth agent.

19. **Benchmark is gates vs a chat baseline, not recovered conversion.** `npm run benchmark` / `src/benchmark.ts`. Collapsed story, stale `still_true`, merge, and prod-deploy are the comparison. Warehouse 19% stays fixture. Do not add a fake Grafana panel.
