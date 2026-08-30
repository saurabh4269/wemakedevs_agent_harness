---
name: type-a-vs-b
description: After independent evidence, classify Type A (break → patch in sandbox) vs Type B (opportunity → proposal). Then measure and write a lesson.
---

# Type A vs Type B

Use this only after three-source independence passes.

## Type A — break

Something that used to work now fails. The **root** does this work. Do not spawn a `patcher` (or any fourth subagent) to patch or to call `loop-github`.

1. Point at the tenant file. In fixture mode that is `fixtures/tenant/src/checkout.ts` (plan alias still using a pre-v3 catalog id).
2. Patch **in the Daytona sandbox**, not in production. If there is no sandbox, skip the patch and say so.
3. Re-run the tiny tenant check if the sandbox allows it (`npx tsx src/checkout.ts` from `fixtures/tenant`).
4. Measure: what signal should recover (checkout conversion, InvalidPlanId count).
5. Lesson: one short paragraph — what we believed, what the three sources showed, what we changed.

Then, if a human wants a GitHub draft, the **root** follows license-to-write. Never merge. Never prod-deploy the tenant.

## Type B — opportunity

The product is not on fire; there is a bet (copy, pricing, packaging). LOOP's job:

1. Write a proposal: audience, change, expected metric, how we would measure.
2. Do **not** patch production.
3. A draft PR is optional, still gated, and still root-only. Prefer a written proposal in chat.

## Do not mix them

A conversion drop with a new InvalidPlanId after a catalog rename is Type A. "What if we hid the enterprise CTA" without a break is Type B.
