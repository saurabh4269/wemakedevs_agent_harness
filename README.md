# LOOP

One TrueForge **incident responder** for the WeMakeDevs Agent Harness Hackathon. Chat is the UI. TypeScript only.

Paste a conversion-drop. The root does not investigate itself. The first action is always to spawn three named one-level subagents — **analytics**, **logs**, **deploys**. The root does not call warehouse tools itself. Never spawn a fourth or write-capable subagent (`patcher`). LOOP refuses a root cause if those three are restatements of one query. Type A is a break (the root patches in the Daytona sandbox, or skips if there is no sandbox). Type B is an opportunity (proposal only). Only the root may call `open_draft_pr` / `flag_incident` after the independence check; those pause for a human. `request_prod_deploy` remains refuse. LOOP never merges and never prod-deploys the tenant.

- **Handoff** — next agent: [docs/README.md](docs/README.md)
- **How a judge should audit** — [docs/audit.md](docs/audit.md)
- **Benchmark method** — [docs/benchmark.md](docs/benchmark.md)

## Qualify (what a judge has to see)

If it would work as a chatbot, it does not qualify. A judge has to see TrueForge:

1. **MCP** — three named subagents hit `query_analytics` / `query_logs` / `query_deploys`. The root does not call `query_*`.
2. **Sandbox** — Type A clones this public repo (the Daytona snapshot is empty) and patches `fixtures/tenant/src/checkout.ts` so `enterprise` aliases `enterprise-annual-v3`.
3. **Pause** — root `open_draft_pr` (`merge: false`) sits on Allow/Deny.

**Judge URL:** https://loop.heisenbug.in — no login. Stock TrueForge chat is enough. `apps/loop-ui` is an optional Doing / Waiting / Did rail on the same incident. Live host is **Heroku** (`loop-trueforge`): [docs/heroku.md](docs/heroku.md).

Warehouse answers and the draft PR URL are **fixtures** (`mode:fixture`, not Grafana, not GitHub.com). The pause, the sandbox, and the three looks are real TrueForge. Official page wants tools connected, not mocked — that is an honest Best Use risk. We say it in the video.

## Prompt

In TrueForge chat, pick agent `loop` and send:

> Checkout conversion dropped about 19% since Friday afternoon on desktop Chrome. Find the root cause. If it is a break, patch the tenant in the sandbox and open a draft PR. Do not merge. Do not deploy prod.

## Benchmark (vs a chat baseline)

A chatbot that restates one query three times would still open a PR. LOOP's gates are TypeScript (`src/independence.ts`, `src/freshness.ts`, `src/write-policy.ts`). This table is policy + tenant gates, not production conversion. Warehouse answers are `mode:fixture` (not Grafana). `open_draft_pr` returns a fake URL and never talks to GitHub.com.

```bash
npm test
npm run benchmark
```

| Scenario | Chat baseline | LOOP |
| --- | --- | --- |
| Three copies of one query (`LOOP_STORY=collapsed`) | Treats it as investigated; would open a PR | Refuse a root cause; no draft PR |
| Independent conversion-drop + `deploys.still_true` | Skips warehouse tools; would still write | Independent; draft PR allowed (TrueForge pauses) |
| Stale `deploys.still_true` (false / unknown) | Would write | Refuse the write |
| `open_draft_pr` without `still_true: true` as a tool argument | Would write | Refuse: still_true must be true |
| `startCheckout("enterprise")` on the shipped tenant | Throws InvalidPlanId | Throws InvalidPlanId |
| After Type A alias `enterprise` → `enterprise-annual-v3` | Never patches; still InvalidPlanId | ok (enterprise-annual-v3) |
| `open_draft_pr` with `merge: true` | Might merge | Refuse; merged: false |
| `request_prod_deploy` | Would try to ship | Always refuse |

Method: [docs/benchmark.md](docs/benchmark.md).

## What you need

- Node 22.14+ for TrueForge, tests, builds, and the LOOP UI. The TrueForge SDK and UI packages require Node 22.
- Prefer OpenRouter as a custom OpenAI-compatible provider. NVIDIA NIM is the backup.
- Daytona sandbox with snapshot write permission in Settings. Skills need sandbox enabled.
- Register skills from this GitHub repo.

Copy .env.example to .env locally. Do not commit secrets.

## 8790 vs 8791

| How you run TrueForge | Port | Storage |
| --- | --- | --- |
| Local npx trueforge | 8790 | SQLite |
| Docker Compose hosted topology | 8791 | Postgres + Redis |
| Public host loop.heisenbug.in | 443 | Heroku Postgres + Redis (Render free exhausted) |

Local npx is the path below. Compose notes are at the bottom.

## Run it

### 1. Install this repo

```bash
git clone https://github.com/saurabh4269/wemakedevs_agent_harness
cd wemakedevs_agent_harness
npm install
npm test
npm run build
```

### 2. Start TrueForge locally

```bash
npx @truefoundry/trueforge@latest
```

Open http://localhost:8790 and leave it running.

### 3. Model in Settings

Settings, Models: add a custom OpenAI-compatible provider named openrouter.
- Base URL: https://openrouter.ai/api/v1
- Upstream model id: openai/gpt-4.1-mini
- TrueForge model name: gpt-4.1-mini

The agent spec placeholder FQN is openrouter/gpt-4.1-mini. Override with LOOP_MODEL_FQN if needed.

NVIDIA NIM backup: another custom provider at https://integrate.api.nvidia.com/v1, then LOOP_MODEL_FQN=nvidia-nim/<name>.

### 4. Daytona in Settings

Settings, Sandbox providers, Daytona. Paste the credential there. Snapshot write permission is required. LOOP sets sandbox.enabled true because skills need it.

### 5. Register skills from this GitHub URL

Settings, Skills, import from GitHub, or run import-loop.

| Skill | Path |
| --- | --- |
| three-source-independence | skills/three-source-independence |
| type-a-vs-b | skills/type-a-vs-b |
| license-to-write | skills/license-to-write |

Repo https://github.com/saurabh4269/wemakedevs_agent_harness. Pin LOOP_SKILL_REF to this branch until it is on main.

### 6. Run the fixture MCP

```bash
npm run fixture:mcp
```

Listens on 127.0.0.1:8788 labeled mode:fixture. There is no live GitHub in this mode.

- Warehouse (read-only): http://127.0.0.1:8788/warehouse tools query_analytics, query_logs, query_deploys
- Write connector: http://127.0.0.1:8788/github tools open_draft_pr, flag_incident, request_prod_deploy

Default story is independent conversion-drop. To collapse the three sources:

```bash
LOOP_STORY=collapsed npm run fixture:mcp
```

Or pass scenario=collapsed on warehouse tools. LOOP should refuse a root cause.

In Settings, Connectors, add two remote MCP servers (import-loop can also do this):

- loop-warehouse -> http://127.0.0.1:8788/warehouse
- loop-github -> http://127.0.0.1:8788/github

If TrueForge is inside Compose, 127.0.0.1 is the container. Use host.docker.internal instead.

### 7. Import agent loop

```bash
cp .env.example .env
npx tsx scripts/import-loop.ts
```

Fill OpenRouter (and Daytona if you want the script to register it) in .env. The script uses the TrueForge TypeScript SDK to create or update agent loop. It never prints secrets. Credentials stay on connectors, not in agents/loop.json.

### 8. One prompt, then the pause

In TrueForge chat, pick agent loop and send:

> Checkout conversion dropped about 19% since Friday afternoon on desktop Chrome. Find the root cause. If it is a break, patch the tenant in the sandbox and open a draft PR. Do not merge. Do not deploy prod.

You should see three subagent threads first (analytics, logs, deploys) — the root must not query warehouse tools itself (`query_*` as direct calls) or spawn a fourth / patcher subagent. The root does not call `ask_user_question`. After those three return, the root emits TrueForge generative UI (one OpenUI chart, one table, one Type A/B card with evidence ids) and may use Code Mode (`mcp_client` in the Daytona sandbox) to group error rates / deploys in Python; counts come from code. Do not put `open_draft_pr` in that script. If `deploys.still_true` is false, LOOP refuses a write.

The Daytona snapshot does not include this git repo. `sandbox.created` means a sandbox exists; a failed `cp fixtures/tenant` is not "no sandbox". The root clones the public tenant, then patches:

```bash
git clone --depth 1 https://github.com/saurabh4269/wemakedevs_agent_harness.git
# then edit wemakedevs_agent_harness/fixtures/tenant/src/checkout.ts
# enterprise alias: "enterprise-annual" → "enterprise-annual-v3"
```

Empty cwd is the normal Daytona case: clone even when `wemakedevs_agent_harness/` does not exist. If that directory exists without `checkout.ts`, `rm -rf` it first. Clone at most twice. If still missing, skip the patch and say clone failed (do not loop, do not write fabricated tenant sources). If the file exists, patch it, then the root MUST call `open_draft_pr` with `merge: false` (`require_approval_for_tools` includes `@write`). A written next-steps list is not a substitute. Skip the patch only if `sandbox.created` never fired.

Allow or deny in the UI. Fixture mode returns a fake PR URL and merged: false. request_prod_deploy always refuses. Demo: deny an extra patcher write; approve the root.

## LOOP UI

Stock TrueForge chat is the product UI. `apps/loop-ui` is a thin Vite + React embed of `@truefoundry/trueforge-ui`, locked to agent `loop` (no composer home), light Apple-like theme (bg #f5f5f7, ink #1d1d1f, accent #0071e3, Inter). A status rail next to the chat shows **Doing** (tool calls streaming), **Waiting** (`require_approval_for_tools` pause — this is the prize moment), and **Did** (completed patch, proposal, or lesson). Approval happens in the TrueForge chat before the write.

Do not vendor the TrueForge server. Point the UI at a running harness.

### How to run the UI

TrueForge must already be running (step 2 above, http://localhost:8790). Then:


```bash
npm install
npm run ui
```

apps/loop-ui is a workspace of this repo, so installing at the root also installs UI dependencies. The chat embed is unauthenticated and receives only the server URL.

Open http://localhost:5173. In dev the Vite app same-origin-proxies `/api` to `VITE_TRUEFORGE_URL` (default http://localhost:8790). Hosted origin is https://loop.heisenbug.in.

Send the conversion-drop prompt from step 8. **Judges should watch Waiting** — that is the pause on `open_draft_pr` before any write. Allow or deny in the chat. The rail will move to Did after a patch, proposal, or lesson lands.


## Subagents share tools (honest split)

TrueForge dynamic subagents get the same MCP tools as the root agent. AgentSpec.mcp_servers and DynamicSubAgentsConfig have no per-subagent enable_tools / disable_tools.

LOOP still splits servers on the root spec:

- loop-warehouse -> enable_tools @read-only
- loop-github -> named write tools plus require_approval_for_tools @write and @destructive

That is not isolation. A subagent could see open_draft_pr. We enforce the split with instructions + skill license-to-write + the approval pause: spawn only analytics, logs, deploys; never a fourth write-capable subagent; Type A patch stays on the root in the Daytona sandbox (skip if no sandbox); only the root may call open_draft_pr / flag_incident after the independence check; request_prod_deploy remains refuse. If a subagent still calls loop-github, deny the pause. The fixture never talks to live GitHub and never merges.

## Tenant fixture

fixtures/tenant is a tiny TypeScript checkout the sandbox can patch. From that folder, starter and pro succeed; enterprise throws InvalidPlanId.

TrueForge Daytona sandboxes start from a snapshot **without** this git repo. LOOP materializes the tenant inside the sandbox by cloning the public repo (no secrets), then patches `fixtures/tenant/src/checkout.ts`. Do not `cp fixtures/tenant` from a host path that is not in the sandbox cwd.

## Hosting (Heroku — Render free exhausted)

Public judges should use https://loop.heisenbug.in. Hosted TrueForge is **not** local npx SQLite. One Heroku container dyno runs `STANDALONE=false` against Heroku Postgres + Redis. The fixture MCP is **colocated** in that image on `127.0.0.1:8788`. OIDC is unset on purpose so anyone who can reach the host is admin (no-login judges). Use a **Basic** dyno (Eco sleeps). Commands: [docs/heroku.md](docs/heroku.md).

Leave local `npx` TrueForge on :8790 running. Sitting pause session `01m1a87xjewncn310ymqy3yz01` is local-only. Do not Approve/Deny it.

Custom domain is Cloudflare CNAME `loop` on `heisenbug.in` only — never touch apex or `www` (Vercel). After Heroku ACM, that CNAME target is the hostname from `heroku domains`. `thexplorers.xyz` is expired; do not use it.

### Hosted import

Point LOOP MCP warehouse / github at the **in-container** fixture:

- `http://127.0.0.1:8788/warehouse`
- `http://127.0.0.1:8788/github`

Hosted model is OpenAI GPT-5.6 Luna (FQN `openai/gpt-5-6-luna`). After a new Postgres, re-run `import-loop.ts` against https://loop.heisenbug.in with the Luna env vars in the runbook. Local film agent may stay on 4.1-mini. Do not put keys in git.

### Render (previous host — do not Apply)

Workspace `tea-ctoktrjtq21c73cufog0` already has `loop-postgres` / `loop-redis` / `loop-trueforge`. **Do not Apply the Blueprint** — it would duplicate those datastores. Stop the Render web service once Heroku `/healthz` is 200 so it stops burning a dead free quota.

### Local Compose (optional)

For a shared TrueForge on your machine, upstream Compose is still Postgres + Redis, not local npx.

```bash
git clone https://github.com/truefoundry/trueforge && cd trueforge
cp packages/trueforge/.env.example packages/trueforge/.env
docker compose up --build
```

Open http://localhost:8791. Set TRUEFORGE_BASE_URL=http://localhost:8791 before import-loop. `PUBLIC_BASE_URL=https://loop.heisenbug.in` on the public host.

## Qodo Code Review Evidence

Trail on every substantive PR: branch → PR → `/agentic_review` → fix Highs (or dismiss **in the Qodo thread** with a reason) → follow-up → human merge. Direct pushes to `main` do not count. **Screenshots ≠ proof.** Public PR links are the evidence. CodeRabbit comments are not.

Qodo-code-review is installed. Comment `/agentic_review` to re-run.

| PR | Merged | What | Qodo |
| --- | --- | --- | --- |
| [#1](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/1) | `f1651fa` | Agent spec, fixture MCP, skills, import | Highs fixed (URL logging redacted; engines `>=22.14.0`; MCP `attach()` 500; FQN exactly `provider/name`). Follow-up **Bugs (0)**. |
| [#2](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/2) | `e221fb05` | LOOP TrueForgeUI shell | Highs fixed (workspaces install `loop-ui`; unauthenticated client, URL only). Follow-up **Bugs (0)**. |
| [#5](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/5) | `42734a2` | Empty-cwd clone + MUST `open_draft_pr` | `/agentic_review`. Rules noted; product kept three named subagents. |
| [#6](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/6) | `8b6b043` | Organizer extras + previous-winners | `/agentic_review` (docs). |
| [#7](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/7) | `25fd7a0` | Hosted TrueForge on Render | `/agentic_review`. |
| [#8](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/8) | `93882ac` | Living handoff + auto-deploy on `main` | `/agentic_review` (docs). |
| [#9](https://github.com/saurabh4269/wemakedevs_agent_harness/pull/9) | `a9200b2` | Hosted Luna + Type A harden + `still_true` | First pass **Bugs (6)**. Fixed: missing look fails closed; no duplicate named child; judge-host import errors without `OPENAI_API_KEY`. Dismissed in-thread: “autonomous subagents” (that is the product — three one-level looks) and “forbidden Luna” (stale Nemotron `:free` rule; OpenRouter free models 503’d then hit the daily cap). |

**PR #1 detail** (first meaningful hackathon code): https://github.com/saurabh4269/wemakedevs_agent_harness/pull/1

| Finding | Severity | Status |
| --- | --- | --- |
| URL logging of MCP connector URLs in `registerMcp` | High | Fixed (redacted URL; unparseable URLs print `[unparseable-url]`) |
| Node engines below TrueForge SDK (`>=20.19` vs SDK `>=22`) | Medium | Fixed (`package.json` `engines.node` is `>=22.14.0`) |
| Uncaught MCP `attach()` rejections on fixture POST routes | Medium | Fixed (catch and 500 if headers not sent) |
| Loose model FQN check (any string with `/`) | Medium | Fixed (exactly `provider/name`, two non-empty ResourceName segments) |
| Lockfile retains old engine (`package-lock.json` still `>=20.19.0`) | Medium | Fixed (root lockfile metadata now `>=22.14.0`) |

**PR #2 detail:** https://github.com/saurabh4269/wemakedevs_agent_harness/pull/2 — follow-up on `8c96416` **Bugs (0)**.

| Finding | Severity | Status |
| --- | --- | --- |
| Clean install breaks tests (root install skipped loop-ui deps) | High | Fixed (root workspaces include `apps/loop-ui`; engines remain `>=22.14.0`) |
| Client bundle exposes a browser credential | High | Fixed (unauthenticated client; URL only) |
| `trueForgeServer` merges config (object spread) | Rule | Fixed (explicit `{ type, baseUrl }` object) |
| `deriveLoopStatus` spreads state | Rule | Fixed (explicit field copy from `EMPTY_STATUS`) |

## Layout

```text
agents/loop.json          TrueForge agent { name, manifest }
scripts/import-loop.ts    SDK import
scripts/benchmark.ts      LOOP vs chat baseline table
skills/*/SKILL.md         git-backed skills
fixtures/mcp/             mode:fixture warehouse + github MCP
fixtures/tenant/          patchable checkout
src/                      independence, freshness, write policy, benchmark, spec, hosted-env
heroku.yml                Heroku container stack
tests/
docs/                     agent handoff (start at docs/README.md)
apps/loop-ui/             Vite TrueForgeUI embed (agent loop)
```
