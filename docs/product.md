# Product

LOOP is one TrueForge investigation agent for a conversion-drop (or similar) signal. Not a campus. Not a 19-agent fleet. Not prior internal control-plane work. Do not name prior art in README, form, or judge-facing copy.

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
| Public | https://loop.heisenbug.in | Render Postgres + Redis, `PUBLIC_BASE_URL` | none (OIDC unset) |

Judges should run without creating an account if possible.

## UI

TrueForge chat is the product UI. Demo is stock TrueForge at :8790 (no login). Optional themed `@truefoundry/trueforge-ui` embed: `apps/loop-ui` (PR #2 **merged**). Not a dark SOC. Light Apple-like. Doing / waiting / did. Ask **before** write. LOOP rail at :5173 is extra.

## Honest limits

- Subagents share the root tool set. `DynamicSubAgentsConfig` is `{ enabled }` only — no per-subagent `enable_tools`. Writes pause via `require_approval_for_tools`. Demo: deny extra patcher write; approve root. Never merge / prod-deploy.
- Fixture MCP is fixture. Official "connected not mocked" is a Best Use risk — say it.
- Skills need sandbox. Daytona provider is **ready** as of 2026-08-31 ~02:22 IST (exec proven). Remaining Type A hole is **tenant sources in the sandbox cwd**, not provider config. See [status.md](status.md).
- Spark extras (ADR 8): generative UI + Code Mode inside this incident. Do not add a second product.
- `ask_user_questions` is **off** (ADR 16). Hosted Nemotron used it to bail. Investigation is not a form.
- Deploys payload includes `still_true` (ADR 18). Stale brief → no PR.
