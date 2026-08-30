# Decisions

1. **TypeScript only.** TrueForge SDK and this repo are TS. No second language for product code.
2. **Write in Grok Bot, not Cursor CloudAgent**, unless Saurabh asks. CloudAgent is a hard no by default.
3. **Fixture GitHub, not live, for demo safety.** Warehouse + github MCP are `mode:fixture`. No token in git. Honest Best Use risk vs "connected not mocked."
4. **Never merge. Never prod-deploy.** Agents open PRs. `request_prod_deploy` refuses. Humans merge after Qodo.
5. **Four-track thinking.** Form selected all four. Judges give one judged-track prize. Build so Best Use (tool + sandbox + pause + session) and Best UI (doing/waiting/did + ask before write) are visible on the same demo. Qodo trail is the Code Quality evidence. Blog is last.
6. **TrueForge UI over custom campus.** Stock chat, or a themed `@truefoundry/trueforge-ui` embed. No dark SOC. No auth for judges.
7. **Independence as code, not only prompt.** `src/independence.ts` + tests. Skill restates it. Collapsed fixture story must refuse.
