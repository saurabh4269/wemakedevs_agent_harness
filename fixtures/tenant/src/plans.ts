export const PLAN_CATALOG = {
  "starter-monthly-v3": { priceUsd: 12 },
  "pro-monthly-v3": { priceUsd: 49 },
  "enterprise-annual-v3": { priceUsd: 999 },
} as const;

export type PlanId = keyof typeof PLAN_CATALOG;
