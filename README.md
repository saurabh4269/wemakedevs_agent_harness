# LOOP

One TrueForge product-investigation agent for the WeMakeDevs Agent Harness Hackathon.

The first action of an investigation is always to spawn three named one-level subagents (analytics, logs, deploys). The root does not call warehouse tools itself. Never spawn a fourth or write-capable subagent (`patcher`). LOOP refuses a root cause if those three are restatements of one query.
Type A is a break (the root patches in the Daytona sandbox, or skips if there is no sandbox). Type B is an opportunity (proposal only). Only the root may call `open_draft_pr` / `flag_incident` after the independence check; those pause for a human. `request_prod_deploy` remains refuse. LOOP never merges and never prod-deploys the tenant.

TrueForge chat is the UI. This repo is TypeScript only.

## What you need

- Node 22.14+ for TrueForge and import-loop. Tests can still run on Node 20.
- Prefer OpenRouter as a custom OpenAI-compatible provider. NVIDIA NIM is the backup.
- Daytona sandbox with snapshot write permission in Settings. Skills need sandbox enabled.
- Register skills from this GitHub repo.

Copy .env.example to .env locally. Do not commit secrets.

## 8790 vs 8791

| How you run TrueForge | Port | Storage |
| --- | --- | --- |
| Local npx trueforge | 8790 | SQLite |
| Docker Compose hosted topology | 8791 | Postgres + Redis |
| Later public host loop.thexplorers.xyz | 443 | Compose or Helm |

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

You should see three subagent threads first (analytics, logs, deploys) — the root must not query warehouse tools itself or spawn a fourth / patcher subagent. Then the root does a Type A patch against fixtures/tenant/src/checkout.ts in the Daytona sandbox (enterprise alias still points at enterprise-annual after the *-v3 catalog rename), or skips the patch if there is no sandbox. Then the root pauses on open_draft_pr because that tool is MCP-annotated write and require_approval_for_tools includes @write.

Allow or deny in the UI. Fixture mode returns a fake PR URL and merged: false. request_prod_deploy always refuses. Subagents must not call loop-github.

## Subagents share tools (honest split)

TrueForge dynamic subagents get the same MCP tools as the root agent. AgentSpec.mcp_servers and DynamicSubAgentsConfig have no per-subagent enable_tools / disable_tools.

LOOP still splits servers on the root spec:

- loop-warehouse -> enable_tools @read-only
- loop-github -> named write tools plus require_approval_for_tools @write and @destructive

That is not isolation. A subagent could see open_draft_pr. We enforce the split with instructions + skill license-to-write + the approval pause: spawn only analytics, logs, deploys; never a fourth write-capable subagent; Type A patch stays on the root in the Daytona sandbox (skip if no sandbox); only the root may call open_draft_pr / flag_incident after the independence check; request_prod_deploy remains refuse. If a subagent still calls loop-github, deny the pause. The fixture never talks to live GitHub and never merges.

## Tenant fixture

fixtures/tenant is a tiny TypeScript checkout the sandbox can patch. From that folder, starter and pro succeed; enterprise throws InvalidPlanId.

## Hosting (Compose)

For a shared TrueForge, use the upstream Compose topology (Postgres + Redis), not local npx.

```bash
git clone https://github.com/truefoundry/trueforge && cd trueforge
cp packages/trueforge/.env.example packages/trueforge/.env
docker compose up --build
```

Open http://localhost:8791. Set TRUEFORGE_BASE_URL=http://localhost:8791 before import-loop.

PUBLIC_BASE_URL is the origin TrueForge hands to MCP OAuth callbacks. Localhost is fine on your machine. For the later public host:

```bash
PUBLIC_BASE_URL=https://loop.thexplorers.xyz
```

Put that in packages/trueforge/.env (Compose) or server.publicBaseUrl (Helm). Do not put model or Daytona credentials in this repo.

## Qodo Code Review Evidence

**This pull request is the evidence PR:** https://github.com/saurabh4269/wemakedevs_agent_harness/pull/1

The PR is still open (not merged). Qodo-code-review is installed on the account. `/agentic_review` on this PR produced the review thread.

Qodo findings and status:

| Finding | Severity | Status |
| --- | --- | --- |
| URL logging of MCP connector URLs in `registerMcp` | High | Fixed (redacted URL; unparseable URLs print `[unparseable-url]`) |
| Node engines below TrueForge SDK (`>=20.19` vs SDK `>=22`) | Medium | Fixed (`package.json` `engines.node` is `>=22.14.0`) |
| Uncaught MCP `attach()` rejections on fixture POST routes | Medium | Fixed (catch and 500 if headers not sent) |
| Loose model FQN check (any string with `/`) | Medium | Fixed (exactly `provider/name`, two non-empty ResourceName segments) |
| Lockfile retains old engine (`package-lock.json` still `>=20.19.0`) | Medium | Fixed in this commit (root lockfile metadata now `>=22.14.0`) |

To re-run the review, comment:

```text
/agentic_review
```

The `/agentic_review` comments plus the review thread on PR #1 are the hackathon evidence.

## Layout

```text
agents/loop.json          TrueForge agent { name, manifest }
scripts/import-loop.ts    SDK import
skills/*/SKILL.md         git-backed skills
fixtures/mcp/             mode:fixture warehouse + github MCP
fixtures/tenant/          patchable checkout
src/                      independence, write policy, spec checks
tests/
```
