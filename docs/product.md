# Product

LOOP is one TrueForge investigation agent. Signal in. Three independent looks. Sandbox patch or proposal. Stop before a write. Not a 19-agent fleet.

## Loop

Signal → three independent sources (analytics, logs, deploys) → refuse if collapsed → Type A sandbox patch vs Type B proposal → human write-gate → measure → lesson.

Independence is **code** (`src/independence.ts`) plus skill, not prompt-only. Fixture warehouse ships two datasets: `independent` (conversion-drop with distinct evidence ids) and `collapsed` (same claim three times). These are warehouse test data, not demo modes. Root must spawn subagents; it must not self-query all three warehouse tools.

## Tenant bug (Type A)

`fixtures/tenant`: catalog rename to `*-v3`. `src/checkout.ts` still aliases `enterprise` → `enterprise-annual`, which is gone from `src/plans.ts`. Starter and pro succeed; enterprise throws `InvalidPlanId`. Sandbox patch is that one alias → `enterprise-annual-v3`.

## Hosting

| How | Port | Storage | Login |
| --- | --- | --- | --- |
| Local `npx` | 8790 | SQLite | none |
| Compose | 8791 | Postgres + Redis | optional OIDC |
| Intended public | https://loop.thexplorers.xyz | Compose/Helm, `PUBLIC_BASE_URL` | ON only if live GitHub writes |

Local npx needs no account.

## UI

TrueForge chat is the product UI. Stock TrueForge at :8790 (no login). Optional themed `@truefoundry/trueforge-ui` embed: `apps/loop-ui` (PR #2 **merged**). Not a dark SOC. Light Apple-like. Doing / waiting / did. Ask **before** write. LOOP rail at :5173 is extra. Do not add more chrome.

## Honest limits

- Subagents share the root tool set. `DynamicSubAgentsConfig` is `{ enabled }` only — no per-subagent `enable_tools`. Writes pause via `require_approval_for_tools`. If a subagent still calls `loop-github`, deny that write; approve the root. Never merge / prod-deploy.
- Fixture MCP is a local warehouse adapter (`mode:fixture`). Swap it for live analytics, logs, and deploys later. Do not pretend the fixture is production Grafana or live GitHub.
- Skills need sandbox. Daytona snapshot create is 403 and no provider is configured — that is a blocker, not a feature. Skip the patch and say so. Do not fake Daytona.
