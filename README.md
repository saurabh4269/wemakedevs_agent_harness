# LOOP

One TrueForge product-investigation agent for the WeMakeDevs Agent Harness Hackathon.

The first action of an investigation is always to spawn three named one-level subagents (analytics, logs, deploys). The root does not call warehouse tools itself and does not skip to a patch until those three reports exist. LOOP refuses a root cause if those three are restatements of one query.
Type A is a break (patch in the sandbox). Type B is an opportunity (proposal only). Writes pause for a human. LOOP never merges and never prod-deploys the tenant.

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

You should see three subagent threads first (analytics, logs, deploys) — the root must not query warehouse tools itself or jump to a patch subagent. Then a Type A patch against fixtures/tenant/src/checkout.ts (enterprise alias still points at enterprise-annual after the *-v3 catalog rename), then a pause on open_draft_pr because that tool is MCP-annotated write and require_approval_for_tools includes @write.

Allow or deny in the UI. Fixture mode returns a fake PR URL and merged: false. request_prod_deploy always refuses.

## Subagents share tools (honest split)

TrueForge dynamic subagents get the same MCP tools as the root agent. There is no per-subagent connector list.

LOOP still splits servers on the root spec:

- loop-warehouse -> enable_tools @read-only
- loop-github -> named write tools plus require_approval_for_tools @write and @destructive

That is not isolation. A subagent could see open_draft_pr. We enforce the split with enable lists, the approval pause, and skill/instructions: subagents only query warehouse tools; only the root may call loop-github after the human pause. The fixture never talks to live GitHub and never merges.

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

**This pull request is the evidence PR.**

Qodo is installed on the account as the Qodo-code-review GitHub App. To run the review on this PR:

1. Open the pull request on GitHub.
2. Comment:

```text
/agentic_review
```

3. Qodo reacts and posts the review on the PR.

That comment plus the review thread is the hackathon evidence. If the app is not on this repository yet, install Qodo-code-review for saurabh4269/wemakedevs_agent_harness and re-comment.

The first `/agentic_review` on this PR found URL logging of MCP connectors, Node engines below the TrueForge SDK, uncaught MCP attach rejections, and a loose model FQN check.

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
