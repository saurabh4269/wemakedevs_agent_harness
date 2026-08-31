# Learnings and pitfalls

Read after [AGENTS.md](../AGENTS.md). Each item is a failure we already hit plus the fix. Do not rediscover these.

## Product / agent

1. **Empty Daytona cwd is normal.** The snapshot has no repo. `sandbox.created` means a sandbox exists; a failed `cp fixtures/tenant` is not "no sandbox". Clone `https://github.com/saurabh4269/wemakedevs_agent_harness.git` even when `wemakedevs_agent_harness/` is missing. If the dir exists without `checkout.ts`, `rm -rf` then clone. Clone at most twice. If still missing, skip and say clone failed — do not loop, do not write fabricated tenant sources. First hosted conversion-drop (`01m1advv5np7mqwse1xf2hdpyc`) failed here: it skipped the patch because cwd looked empty.

2. **Root MUST call `open_draft_pr` after a Type A patch.** A written next-steps list is not a substitute. Skipping the write because the cwd looked empty is forbidden. `merge: false`. Only the root. `require_approval_for_tools` `@write` / `@destructive`.

3. **Never spawn skill names as subagents.** `type-a-vs-b`, `three-source-independence`, `license-to-write` are skills, not agents. Loading a skill is not `create_sub_agent`. Local attempt 1 spawned `type-a-vs-b` as a fourth subagent and failed.

4. **Root must not call `query_*`.** Not as a direct tool, not wrapped in `call_tool`. First action is three named one-level subagents: `analytics`, `logs`, `deploys`. Distinct questions.

5. **Subagents share the root tool set.** TrueForge `DynamicSubAgentsConfig` has no per-subagent `enable_tools`. Do not invent one. A `patcher` subagent can still see `open_draft_pr`. Deny that pause; approve only the root. Fixture never talks to live GitHub.

6. **Independence is code, not only prompt.** `src/independence.ts` + skill `three-source-independence`. Collapsed fixture story (`LOOP_STORY=collapsed`) must refuse a root cause.

7. **Fixture MCP is labeled on purpose.** Warehouse answers are canned in `fixtures/mcp/stories.ts`, not Grafana. `open_draft_pr` returns `mode:fixture`, `live_github: false`, `html_url` `https://github.example.invalid/loop-tenant/pull/42`. Judges will see `mode:fixture` in Agent Steps. Say it out loud. Official page wants tools "connected, not mocked" — this is an honest Best Use risk. Do not hide it. Do not pretend fixtures are production.

8. **Tenant bug is real TypeScript.** `fixtures/tenant/src/checkout.ts` maps `enterprise` → `enterprise-annual` after a `*-v3` catalog rename; `startCheckout("enterprise")` throws. Patch alias to `enterprise-annual-v3`. Do not `sed /opt/tf/tenant`.

## Hosting / Render

9. **Do not Apply `render.yaml` on the existing workspace** (`tea-ctoktrjtq21c73cufog0`). It would duplicate `loop-postgres` / `loop-redis`. The live web service `loop-trueforge` (`srv-daaaa65g1s2s73cjsq0g`) already exists. Greenfield Apply is only for a new empty workspace.

10. **`main` auto-deploys.** Live service tracks branch `main`, `autoDeployTrigger: commit` (PATCHed 2026-08-31; previously `feat/render-host` + autoDeploy off). Env-only PUT does not restart a process. Merge to main deploys the **image**. Do not add a GitHub Action that stores `RENDER_API_KEY` in git.

11. **Image deploy does not re-import LOOP.** Hosted TrueForge persists the agent in Postgres. After `agents/loop.json` or skills change, run `npx tsx scripts/import-loop.ts` against `TRUEFORGE_BASE_URL=https://loop.heisenbug.in` with the Nemotron `:free` env (see [runbook.md](runbook.md)). Dockerfile-only changes do not need re-import.

12. **`import-loop.ts` defaults OpenRouter to `openai/gpt-4.1-mini`.** Hosted must pass `OPENROUTER_MODEL_ID=nvidia/nemotron-3-super-120b-a12b:free`, `OPENROUTER_MODEL_NAME=nemotron-3-super-120b-a12b-free`, `LOOP_MODEL_FQN=openrouter/nemotron-3-super-120b-a12b-free`. Without those it replaces the free provider. Last import also dropped `model.params.max_tokens: 8192` because `agents/loop.json` only has `temperature: 0.2`.

13. **Free instance sleeps.** Ping `GET /healthz` first (~25–30s white "Loading application…") before a judge or a demo.

14. **No-login means everyone is admin.** OIDC unset on purpose. Anyone who reaches https://loop.heisenbug.in can edit the agent, skills, connectors, or Approve a write. Demo tradeoff, not a bug. Do not "fix" it with auth before the video.

15. **DNS.** CNAME `loop` → `loop-trueforge.onrender.com` on Cloudflare zone `heisenbug.in`, grey cloud (DNS only). Never touch apex or `www` (Vercel). `thexplorers.xyz` is expired; do not use `loop.thexplorers.xyz`. Box DNS sometimes needs `--resolve loop.heisenbug.in:443:216.24.57.7`.

16. **Colocated fixture, not a private service.** Fixture MCP listens on `127.0.0.1:8788` inside the TrueForge image. Render private services have no free plan.

## Models / keys

17. **User OpenRouter is FREE ($0 credits).** Hosted model is Nemotron Super `:free`. Do not use `openai/gpt-5.6-luna`. Do not put paid `gpt-4.1-mini` on hosted. Local film agent may stay on 4.1-mini until that sitting pause is no longer the film source.

18. **Do not kill local TrueForge on `[::1]:8790`.** IPv6. `127.0.0.1:8790` may miss it. SQLite path `/home/box/.local/trueforge/db.sqlite`. Sitting pause `01m1a87xjewncn310ymqy3yz01` lives there.

19. **Never echo secrets.** Box file `/home/box/.secrets/loop-trueforge.env` mode 600. Render dashboard `sync: false`. A full-access Daytona key was pasted in chat — rotate if the transcript is shared. Do not commit `.env`. Do not print `RENDER_API_KEY` or connection strings.

## Sessions you must not touch

20. **Never Approve/Deny:**
    - `01m1a87xjewncn310ymqy3yz01` — local qualify PASS, film source.
    - `01m1advv5np7mqwse1xf2hdpyc` — hosted FAIL (empty-cwd skip).
    - `01m1ayqn9563da3mgerw6nwpq5` — hosted FAIL (asked the user about subagent overload; no pause).
    - Ignore empty session `01m1ayra0m7tdj5rphtnsqevyw`.

21. **Nemotron `:free` can flake subagents.** Hosted run `01m1ayqn9563da3mgerw6nwpq5` spawned `analytics` three times, then `logs`, then `deploys`, created a sandbox, ran one `exec`, then called `ask_user_question` ("Subagent creation is failing due to service overload"). Turn ended `done` with `output: null` and a required `ask_user_question`. Do not answer that question. Do not treat it as a pause-before-write. New session if you retry hosted.

## Process

22. **Qodo trail is required to qualify.** Direct push to `main` does not count. Highs must be 0 before merge. Leftover Mediums that are documented platform limits (shared subagent toolset) can stay. CodeRabbit is noise.

23. **TypeScript in this chat, not Cursor CloudAgent,** unless Saurabh asks.

24. **PR #4 is closed.** Stale Daytona-403. Do not reopen. Do not merge it.

25. **Clock deadline passed** (Sun 30 Aug 2026 8:00pm London). Live page still said Submissions are open as of 2026-08-31 morning IST. No official late policy. User said keep building. Do not invent a late-submit rule.

26. **Grok Bot Auto-review** (this box, not Qodo) blocked: PUT of hosted agent clone/write instructions; follow-up POST turn to `01m1advv5np7mqwse1xf2hdpyc`; a standing GitHub routine that would auto-merge + POST Render deploys. Do not retry those via a quieter reformulation. Safer path: merge to `main` (auto-deploy) + `import-loop.ts`. Long `python3 -c` and large runner scripts can fail with "executable content could not be bound". Workaround: explicit `curl` to the TrueForge API.

27. **`ask_user_question` is not a pause.** Hosted Nemotron called it after the three looks and stopped. That is not the qualify beat. `ask_user_questions.enabled` is **false**. Instructions: do not call it; retry a failed named subagent once; then continue. Do not turn it back on to "be helpful."

28. **Hosted import can clobber the free model.** `import-loop.ts` defaults OpenRouter to `gpt-4.1-mini`. Judge host must pass the Nemotron `:free` FQN. `hostedModelGuard` now throws if the base URL is `loop.heisenbug.in` / `loop-trueforge.onrender.com` and the FQN is anything else.

29. **Stale brief.** `deploys.still_true === false` means the SHA / plan catalog in the brief no longer matches. Refuse a root cause. Do not open a PR.

30. **How to talk to hosted TrueForge** (no login):
    - Base `https://loop.heisenbug.in/api/v1`
    - `POST /sessions` body `{"agent":{"name":"loop"}}`
    - `POST /sessions/{id}/turns` with `stream: false` and a `user.message`
    - `GET /sessions/{id}/events?limit=100` newest first
    - MAY allow non-github pauses (sandbox `exec`) so the run can reach the write
    - NEVER allow `open_draft_pr` / `flag_incident` / `request_prod_deploy` on film sessions

## Organizers (short)

Kunal: small fully working TrueForge agent, ~3 min, no login, MCP + sandbox + human pause before irreversible (not a prompt), agent steps visible. Sai: stock TrueForge UI is enough. Extra credit: generative UI, code mode, Daytona, parallel subagents, real-world use case. Qualify = judge **sees** those three. Hero card = Incident responder. Details: [organizers.md](organizers.md).
