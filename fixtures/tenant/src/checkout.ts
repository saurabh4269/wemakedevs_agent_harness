import { PLAN_CATALOG, type PlanId } from "./plans.js";

/** Marketing names the pricing CTA still sends. */
const PLAN_ALIASES: Record<string, string> = {
  starter: "starter-monthly-v3",
  pro: "pro-monthly-v3",
  // BUG: catalog rename left the enterprise alias on the pre-v3 id.
  enterprise: "enterprise-annual",
};

export function resolvePlan(requestedId: string): { priceUsd: number; planId: PlanId } {
  const planId = PLAN_ALIASES[requestedId] ?? requestedId;
  const plan = PLAN_CATALOG[planId as PlanId];
  if (!plan) {
    throw new Error(
      `InvalidPlanId: unknown plan id ${planId}; catalog now uses *-v3 keys`,
    );
  }
  return { planId: planId as PlanId, priceUsd: plan.priceUsd };
}

export function startCheckout(requestedPlan: string): { ok: true; amount: number; planId: PlanId } {
  const plan = resolvePlan(requestedPlan);
  return { ok: true, amount: plan.priceUsd, planId: plan.planId };
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  for (const name of ["starter", "pro", "enterprise"] as const) {
    try {
      const result = startCheckout(name);
      process.stdout.write(`${name}: ok ${result.planId} ${result.amount}\n`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stdout.write(`${name}: ${message}\n`);
      if (name === "enterprise") {
        process.exitCode = 1;
      }
    }
  }
}
