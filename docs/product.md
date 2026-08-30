# Product

LOOP is one TrueForge investigation agent for a conversion-drop (or similar) signal. Not a campus. Not a 19-agent fleet. Not a Product OS / ADK port (do not mention those in README, form, or judge-facing copy).

## Loop

Signal → three independent sources (analytics, logs, deploys) → refuse if collapsed → Type A sandbox patch vs Type B proposal → human write-gate → measure → lesson.

Independence is **code** (`src/independence.ts`) plus skill, not prompt-only. Fixture warehouse ships two stories: `independent` (conversion-drop with distinct evidence ids) and `collapsed` (same claim three times). Root must spawn subagents; it must not self-query all three warehouse tools.

## Tenant bug (Type A)

`fixtures/tenant`: catalog rename to `*-v3`. `src/checkout.ts` still aliases `enterprise` → `enterprise-annual`, which is gone from `src/plans.ts`. Starter and pro succeed; enterprise throws `InvalidPlanId`. Sandbox patch is that one alias → `enterprise-annual-v3`.

## Hosting

| How | Port | Storage | Login |
| --- | --- | --- | --- |
| Local `npx` | 8790 | SQLite | none |
| Compose | 8791 | Postgres + Redis | optional OIDC |
| Intended public | https://loop.thexplorers.xyz | Compose/Helm, `PUBLIC_BASE_URL` | ON only if live GitHub writes |

Judges should run without creating an account if possible.

## UI

TrueForge chat is the product UI. Demo is stock TrueForge at :8790 (no login). Optional themed `@truefoundry/trueforge-ui` embed: `apps/loop-ui` (PR #2 **merged**). Not a dark SOC. Light Apple-like. Doing / waiting / did. Ask **before** write. LOOP rail at :5173 is extra.

## Honest limits

- Subagents share the root tool set. `DynamicSubAgentsConfig` is `{ enabled }` only — no per-subagent `enable_tools`. Writes pause via `require_approval_for_tools`. Demo: deny extra patcher write; approve root. Never merge / prod-deploy.
- Fixture MCP is fixture. Official "connected not mocked" is a Best Use risk — say it.
- Skills need sandbox. If Daytona 401s and `sandbox.enabled` is false, skills will not be on the agent and the three-subagent path will not run. That is a blocker, not a feature.
