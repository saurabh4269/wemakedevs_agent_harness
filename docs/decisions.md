# Decisions

1. **TypeScript only.** TrueForge SDK and this repo are TS. No second language for product code.
2. **Write in Grok Bot, not Cursor CloudAgent**, unless Saurabh asks. CloudAgent is a hard no by default.
3. **Fixture GitHub, not live.** Warehouse + github MCP are `mode:fixture` — a local adapter you would swap later. No token in git. Do not claim fixtures are production Grafana or live GitHub.
4. **Never merge. Never prod-deploy.** Agents open PRs. `request_prod_deploy` refuses. Humans merge after Qodo.
5. **One investigation agent.** Three one-level subagents. Thin LOOP rail. Qodo trail on PRs. Do not expand into a 19-agent platform.
6. **TrueForge UI over a custom dashboard.** Stock chat, or a themed `@truefoundry/trueforge-ui` embed. No dark SOC. Login only if live GitHub writes require it.
7. **Independence as code, not only prompt.** `src/independence.ts` + tests. Skill restates it. Collapsed warehouse dataset must refuse.
