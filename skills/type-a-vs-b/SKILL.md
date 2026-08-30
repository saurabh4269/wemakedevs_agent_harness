---
name: type-a-vs-b
description: After independent evidence, classify Type A (break → patch in sandbox) vs Type B (opportunity → proposal). Then measure and write a lesson.
---

# Type A vs Type B

Use this only after three-source independence passes.

## Type A — break

Something that used to work now fails. The **root** does this work. Do not spawn a `patcher` (or any fourth subagent) to patch or to call `loop-github`.

1. Point at the tenant file. In fixture mode that is `fixtures/tenant/src/checkout.ts` (plan alias still using a pre-v3 catalog id: `enterprise` → `enterprise-annual` after the `*-v3` catalog rename).
2. Patch **in the Daytona sandbox**, not in production. **sandbox.created means a sandbox exists.** The TrueForge Daytona snapshot does **not** include this git repo. A failed `cp fixtures/tenant` is not "no sandbox" — the cwd is empty until you seed it. If there is no sandbox (no `sandbox.created`, exec tools missing), skip the patch and say so.
3. Materialize the tenant the same way a real incident would: check out the **public** repo (no secrets, no host fixture path judges cannot see):

```bash
pwd; ls
test -f wemakedevs_agent_harness/fixtures/tenant/src/checkout.ts \
  || git clone --depth 1 https://github.com/saurabh4269/wemakedevs_agent_harness.git
test -f wemakedevs_agent_harness/fixtures/tenant/src/checkout.ts
```

Keep trying until that file exists. If clone fails, write the known tenant sources into `wemakedevs_agent_harness/fixtures/tenant/` via exec (public files only). Then patch **only** the enterprise alias in `wemakedevs_agent_harness/fixtures/tenant/src/checkout.ts`:

```ts
enterprise: "enterprise-annual-v3",
```

Do not rewrite starter/pro aliases that already point at `*-v3`. Do not treat a failed `cp` as a missing sandbox.

4. Re-run the tiny tenant check if the sandbox allows it (`npx --yes tsx src/checkout.ts` from `wemakedevs_agent_harness/fixtures/tenant`). Enterprise must succeed with `enterprise-annual-v3`.
5. Then the **root** calls `open_draft_pr` (license-to-write). That call **pauses**. Do not claim "no sandbox" and skip the pause after a failed `cp`.
6. Measure: what signal should recover (checkout conversion, InvalidPlanId count).
7. Lesson: one short paragraph — what we believed, what the three sources showed, what we changed.

Never merge. Never prod-deploy the tenant. Never spawn a fourth subagent.

## Type B — opportunity

The product is not on fire; there is a bet (copy, pricing, packaging). LOOP's job:

1. Write a proposal: audience, change, expected metric, how we would measure.
2. Do **not** patch production.
3. A draft PR is optional, still gated, and still root-only. Prefer a written proposal in chat.

## Do not mix them

A conversion drop with a new InvalidPlanId after a catalog rename is Type A. "What if we hid the enterprise CTA" without a break is Type B.
