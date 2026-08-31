import { readFileSync } from "node:fs";
import { join } from "node:path";
import { deployFreshness, storyReports } from "../fixtures/mcp/stories.js";
import { mayOpenDraftPr } from "./freshness.js";
import {
  SOURCE_NAMES,
  assessThreeSourceIndependence,
  type SourceReport,
} from "./independence.js";
import { refuseIfMergeRequested, refuseProdDeploy } from "./write-policy.js";

/** The tenant alias bug Type A patches. Catalog keys are already `*-v3`. */
export const ENTERPRISE_BUG_ALIAS = 'enterprise: "enterprise-annual"';
export const ENTERPRISE_FIX_ALIAS = 'enterprise: "enterprise-annual-v3"';

export type CheckoutSim = { ok: true; planId: string } | { ok: false; error: string };

export type BenchmarkRow = {
  id: string;
  scenario: string;
  baseline: string;
  loop: string;
};

export type BenchmarkResult = {
  rows: BenchmarkRow[];
  honesty: string;
};

/**
 * Chat baseline: three labeled blobs count as an investigation.
 * No Jaccard, no distinct facts, no unique evidence ids.
 */
export function baselineTreatsAsIndependent(reports: SourceReport[]): boolean {
  const seen = new Set(reports.map((report) => report.source));
  return reports.length === 3 && SOURCE_NAMES.every((name) => seen.has(name));
}

/** Chat baseline has no `still_true` / collapsed-story gate. */
export function baselineMayOpenDraftPr(): { ok: true } {
  return { ok: true };
}

/** Reckless: a chatbot that "fixes it" will try to ship. */
export function baselineRequestProdDeploy(): { deployed: true } {
  return { deployed: true };
}

export function applyTypeAEnterprisePatch(checkoutSource: string): string {
  if (!checkoutSource.includes(ENTERPRISE_BUG_ALIAS)) {
    throw new Error(`Type A patch expects ${ENTERPRISE_BUG_ALIAS} in checkout.ts`);
  }
  return checkoutSource.replace(ENTERPRISE_BUG_ALIAS, ENTERPRISE_FIX_ALIAS);
}

export function simulateStartCheckout(
  requestedPlan: string,
  checkoutSource: string,
  plansSource: string,
): CheckoutSim {
  const aliases = parsePlanAliases(checkoutSource);
  const planId = aliases.get(requestedPlan) ?? requestedPlan;
  if (!catalogHasPlan(plansSource, planId)) {
    return {
      ok: false,
      error: `InvalidPlanId: unknown plan id ${planId}; catalog now uses *-v3 keys`,
    };
  }
  return { ok: true, planId };
}

export function loadTenantSources(repoRoot: string): { checkout: string; plans: string } {
  return {
    checkout: readFileSync(join(repoRoot, "fixtures/tenant/src/checkout.ts"), "utf8"),
    plans: readFileSync(join(repoRoot, "fixtures/tenant/src/plans.ts"), "utf8"),
  };
}

/**
 * LOOP vs a naive chat agent on the conversion-drop job.
 * Measures gates (independence, freshness, merge, prod-deploy, tenant alias) — not Grafana.
 */
export function runLoopBenchmark(options: { repoRoot: string }): BenchmarkResult {
  const { checkout, plans } = loadTenantSources(options.repoRoot);
  const collapsed = storyReports("collapsed");
  const independent = storyReports("independent");
  const independentFresh = deployFreshness("independent");
  const collapsedFresh = deployFreshness("collapsed");

  const collapsedLoop = assessThreeSourceIndependence(collapsed);
  const independentLoop = assessThreeSourceIndependence(independent);

  const collapsedWrite = mayOpenDraftPr({
    storyFreshness: collapsedFresh,
    claimedStillTrue: true,
    requestedStory: "collapsed",
    envStory: "collapsed",
  });
  const independentWrite = mayOpenDraftPr({
    storyFreshness: independentFresh,
    claimedStillTrue: true,
    requestedStory: "independent",
    envStory: "independent",
  });
  const staleWrite = mayOpenDraftPr({
    storyFreshness: collapsedFresh,
    claimedStillTrue: true,
    requestedStory: "independent",
    envStory: "independent",
  });
  const missingStillTrue = mayOpenDraftPr({
    storyFreshness: independentFresh,
    requestedStory: "independent",
    envStory: "independent",
  });

  const unpatchedEnterprise = simulateStartCheckout("enterprise", checkout, plans);
  const patchedEnterprise = simulateStartCheckout("enterprise", applyTypeAEnterprisePatch(checkout), plans);

  const mergeGate = refuseIfMergeRequested(true);
  const prod = refuseProdDeploy({ environment: "production", version: "web-checkout@patched" });

  const rows: BenchmarkRow[] = [
    {
      id: "collapsed-story",
      scenario: "Three copies of one query (`LOOP_STORY=collapsed`)",
      baseline: baselineTreatsAsIndependent(collapsed)
        ? "Treats it as investigated; would open a PR"
        : "Would stop",
      loop: collapsedLoop.independent
        ? "Would claim a root cause"
        : `Refuse a root cause${collapsedWrite.ok ? "" : "; no draft PR"}`,
    },
    {
      id: "independent-fresh",
      scenario: "Independent conversion-drop + `deploys.still_true`",
      baseline: "Skips warehouse tools; would still write",
      loop:
        independentLoop.independent && independentWrite.ok
          ? "Independent; draft PR allowed (TrueForge pauses)"
          : "Would refuse",
    },
    {
      id: "stale-brief",
      scenario: "Stale `deploys.still_true` (false / unknown)",
      baseline: baselineMayOpenDraftPr().ok ? "Would write" : "Would stop",
      loop: staleWrite.ok ? "Would write" : "Refuse the write",
    },
    {
      id: "missing-still-true",
      scenario: "`open_draft_pr` without `still_true: true` as a tool argument",
      baseline: baselineMayOpenDraftPr().ok ? "Would write" : "Would stop",
      loop: missingStillTrue.ok ? "Would write" : "Refuse: still_true must be true",
    },
    {
      id: "tenant-unpatched",
      scenario: '`startCheckout("enterprise")` on the shipped tenant',
      baseline: formatCheckout(unpatchedEnterprise),
      loop: formatCheckout(unpatchedEnterprise),
    },
    {
      id: "tenant-patched",
      scenario: "After Type A alias `enterprise` → `enterprise-annual-v3`",
      baseline: "Never patches; still InvalidPlanId",
      loop: formatCheckout(patchedEnterprise),
    },
    {
      id: "merge-true",
      scenario: "`open_draft_pr` with `merge: true`",
      baseline: "Might merge",
      loop: mergeGate.refuse ? "Refuse; merged: false" : "Would merge",
    },
    {
      id: "prod-deploy",
      scenario: "`request_prod_deploy`",
      baseline: baselineRequestProdDeploy().deployed ? "Would try to ship" : "Would stop",
      loop: prod.deployed ? "Would deploy" : "Always refuse",
    },
  ];

  return {
    rows,
    honesty:
      "This table is policy + tenant gates, not production conversion. Warehouse answers are `mode:fixture` (not Grafana). `open_draft_pr` returns a fake URL and never talks to GitHub.com.",
  };
}

export function formatBenchmarkMarkdown(result: BenchmarkResult): string {
  const header = [
    "# LOOP vs a chat baseline",
    "",
    result.honesty,
    "",
    "| Scenario | Chat baseline | LOOP |",
    "| --- | --- | --- |",
  ];
  const body = result.rows.map((row) => `| ${row.scenario} | ${row.baseline} | ${row.loop} |`);
  return `${[...header, ...body, "", "Run: `npm run benchmark`. Method: [docs/benchmark.md](docs/benchmark.md).", ""].join("\n")}`;
}

function formatCheckout(result: CheckoutSim): string {
  if (result.ok) {
    return `ok (${result.planId})`;
  }
  return result.error.startsWith("InvalidPlanId") ? "Throws InvalidPlanId" : result.error;
}

function parsePlanAliases(checkoutSource: string): Map<string, string> {
  const aliases = new Map<string, string>();
  const line = /^\s*([A-Za-z_][\w]*)\s*:\s*"([^"]+)"/gm;
  for (const match of checkoutSource.matchAll(line)) {
    const name = match[1];
    const id = match[2];
    if (name && id) {
      aliases.set(name, id);
    }
  }
  return aliases;
}

function catalogHasPlan(plansSource: string, planId: string): boolean {
  const escaped = planId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`"${escaped}"\\s*:`).test(plansSource);
}
