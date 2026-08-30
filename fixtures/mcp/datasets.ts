import type { SourceReport } from "../../src/independence.js";

/**
 * Local warehouse datasets for the fixture MCP (`mode:fixture`).
 *
 * This adapter is what you would swap for live analytics / logs / deploys
 * later. Conversion-drop is one seeded incident in that warehouse, like a
 * staging dataset — not a scripted scene.
 *
 * `independent` and `collapsed` are test data, not demo modes:
 * - independent: distinct evidence ids per source (the seeded ~19% drop)
 * - collapsed: three restatements of one query (LOOP must refuse a root cause)
 */
export type DatasetName = "independent" | "collapsed";

export const FIXTURE_MODE = "fixture" as const;

const independentAnalytics: SourceReport = {
  source: "analytics",
  evidenceId: "funnel-cta-desktop-chrome",
  uniqueFacts: [
    "metric checkout_conversion 4.2% -> 3.4% (-19%)",
    "broken step pricing_cta_click -> checkout_submit",
    "segment desktop Chrome >=128 on /pricing",
    "mobile_web and ios_app unchanged",
  ],
  summary:
    "Product analytics: desktop Chrome visitors on /pricing stopped converting at the Start trial CTA after 2026-08-28 14:00 UTC. Mobile funnels did not move.",
};

const independentLogs: SourceReport = {
  source: "logs",
  evidenceId: "invalid-plan-id-checkout-ts",
  uniqueFacts: [
    "error InvalidPlanId",
    "file fixtures/tenant/src/checkout.ts",
    "route POST /api/checkout",
    "message unknown plan id enterprise-annual; catalog now uses enterprise-annual-v3",
    "first_seen 2026-08-28T14:12:07Z count 1842",
  ],
  summary:
    "App logs: checkout started throwing InvalidPlanId for enterprise-annual from checkout.ts twelve minutes after the catalog rename, 1842 times.",
};

const independentDeploys: SourceReport = {
  source: "deploys",
  evidenceId: "catalog-v3-rollout",
  uniqueFacts: [
    "service web-checkout",
    "released_at 2026-08-28T14:08:22Z",
    "version web-checkout@2026.08.28-14",
    "commit 9f3c1a2 refresh plan catalog ids to *-v3",
  ],
  summary:
    "Deploy timeline: web-checkout rolled catalog ids to *-v3 at 14:08 UTC on 2026-08-28. Previous version web-checkout@2026.08.27-18 had no plan-id errors.",
};

const collapsedClaim = "Conversion dropped because checkout is broken.";

const collapsedAnalytics: SourceReport = {
  source: "analytics",
  evidenceId: "conversion-drop",
  uniqueFacts: ["conversion dropped", "checkout is broken"],
  summary: collapsedClaim,
};

const collapsedLogs: SourceReport = {
  source: "logs",
  evidenceId: "conversion-drop",
  uniqueFacts: ["checkout is broken", "conversion dropped"],
  summary: "Checkout is broken so conversion dropped.",
};

const collapsedDeploys: SourceReport = {
  source: "deploys",
  evidenceId: "conversion-drop",
  uniqueFacts: ["checkout is broken", "conversion dropped"],
  summary: "A deploy broke checkout and conversion dropped.",
};

export const DATASETS: Record<
  DatasetName,
  { analytics: SourceReport; logs: SourceReport; deploys: SourceReport }
> = {
  independent: {
    analytics: independentAnalytics,
    logs: independentLogs,
    deploys: independentDeploys,
  },
  collapsed: {
    analytics: collapsedAnalytics,
    logs: collapsedLogs,
    deploys: collapsedDeploys,
  },
};

export function isDatasetName(value: string): value is DatasetName {
  return value === "independent" || value === "collapsed";
}

export function datasetReports(name: DatasetName): SourceReport[] {
  const dataset = DATASETS[name];
  return [dataset.analytics, dataset.logs, dataset.deploys];
}

export function payloadFor(source: SourceReport["source"], name: DatasetName): Record<string, unknown> {
  const report = DATASETS[name][source];
  return {
    mode: FIXTURE_MODE,
    dataset: name,
    source: report.source,
    evidence_id: report.evidenceId,
    unique_facts: report.uniqueFacts,
    summary: report.summary,
    live_github: false,
  };
}
