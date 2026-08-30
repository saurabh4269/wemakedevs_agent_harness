# LOOP tenant fixture

Tiny TypeScript checkout the sandbox can patch.

The 2026-08-28 catalog rename moved plan ids to `*-v3`. `src/checkout.ts` still aliases `enterprise` to `enterprise-annual`, which is no longer in `src/plans.ts`. That is the Type A break.

```bash
npx tsx src/checkout.ts
```

Starter and pro succeed. Enterprise throws `InvalidPlanId`. The sandbox patch is one alias: `enterprise-annual` → `enterprise-annual-v3`.
