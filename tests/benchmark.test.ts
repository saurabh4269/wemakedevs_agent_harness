import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { storyReports } from "../fixtures/mcp/stories.js";
import {
  applyTypeAEnterprisePatch,
  baselineMayOpenDraftPr,
  baselineRequestProdDeploy,
  baselineTreatsAsIndependent,
  ENTERPRISE_BUG_ALIAS,
  ENTERPRISE_FIX_ALIAS,
  formatBenchmarkMarkdown,
  loadTenantSources,
  runLoopBenchmark,
  simulateStartCheckout,
} from "../src/benchmark.js";
import { assessThreeSourceIndependence } from "../src/independence.js";
import { mayOpenDraftPr } from "../src/freshness.js";
import { deployFreshness } from "../fixtures/mcp/stories.js";
import { refuseIfMergeRequested, refuseProdDeploy } from "../src/write-policy.js";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("LOOP vs chat baseline", () => {
  const result = runLoopBenchmark({ repoRoot });
  const byId = Object.fromEntries(result.rows.map((row) => [row.id, row]));

  it("prints a judge-readable table with an honesty line", () => {
    expect(result.rows).toHaveLength(8);
    expect(result.honesty).toMatch(/mode:fixture/);
    expect(result.honesty).not.toMatch(/19%/);
    const markdown = formatBenchmarkMarkdown(result);
    expect(markdown).toMatch(/Chat baseline/);
    expect(markdown).toMatch(/npm run benchmark/);
  });

  it("refuses a collapsed story that a chat agent would treat as investigated", () => {
    const collapsed = storyReports("collapsed");
    expect(baselineTreatsAsIndependent(collapsed)).toBe(true);
    expect(assessThreeSourceIndependence(collapsed).independent).toBe(false);
    expect(byId["collapsed-story"]?.baseline).toMatch(/would open a PR/i);
    expect(byId["collapsed-story"]?.loop).toMatch(/Refuse a root cause/i);
  });

  it("lets an independent fresh brief pause on a draft PR, which a chat agent would skip tools and still write", () => {
    const independent = storyReports("independent");
    expect(assessThreeSourceIndependence(independent).independent).toBe(true);
    expect(
      mayOpenDraftPr({
        storyFreshness: deployFreshness("independent"),
        claimedStillTrue: true,
        requestedStory: "independent",
        envStory: "independent",
      }).ok,
    ).toBe(true);
    expect(byId["independent-fresh"]?.loop).toMatch(/draft PR allowed/i);
    expect(byId["independent-fresh"]?.baseline).toMatch(/Skips warehouse tools/i);
  });

  it("blocks a stale or missing still_true that the baseline would write", () => {
    expect(baselineMayOpenDraftPr().ok).toBe(true);
    expect(byId["stale-brief"]?.loop).toMatch(/Refuse/i);
    expect(byId["missing-still-true"]?.loop).toMatch(/Refuse/i);
  });

  it("keeps the real tenant bug, then LOOP's Type A alias makes enterprise resolve", () => {
    const { checkout, plans } = loadTenantSources(repoRoot);
    expect(checkout).toContain(ENTERPRISE_BUG_ALIAS);
    expect(checkout).not.toContain(ENTERPRISE_FIX_ALIAS);
    expect(simulateStartCheckout("enterprise", checkout, plans).ok).toBe(false);
    expect(simulateStartCheckout("starter", checkout, plans).ok).toBe(true);
    expect(simulateStartCheckout("pro", checkout, plans).ok).toBe(true);

    const patched = applyTypeAEnterprisePatch(checkout);
    const after = simulateStartCheckout("enterprise", patched, plans);
    expect(after).toEqual({ ok: true, planId: "enterprise-annual-v3" });
    expect(byId["tenant-unpatched"]?.loop).toMatch(/InvalidPlanId/);
    expect(byId["tenant-patched"]?.baseline).toMatch(/Never patches/);
    expect(byId["tenant-patched"]?.loop).toMatch(/enterprise-annual-v3/);
  });

  it("never merges and never prod-deploys; the baseline might", () => {
    expect(baselineRequestProdDeploy().deployed).toBe(true);
    expect(refuseProdDeploy({ environment: "production", version: "x" }).deployed).toBe(false);
    expect(refuseIfMergeRequested(true).refuse).toBe(true);
    expect(refuseIfMergeRequested(false).refuse).toBe(false);
    expect(byId["merge-true"]?.loop).toMatch(/Refuse/);
    expect(byId["prod-deploy"]?.loop).toMatch(/Always refuse/);
  });

  it("keeps the README table in lockstep with the runnable benchmark", () => {
    const readme = readFileSync(join(repoRoot, "README.md"), "utf8");
    expect(readme).toMatch(/## Benchmark \(vs a chat baseline\)/);
    expect(readme).toMatch(/mode:fixture/);
    for (const row of result.rows) {
      expect(readme, row.id).toContain(row.scenario);
      expect(readme, row.id).toContain(row.baseline);
      expect(readme, row.id).toContain(row.loop);
    }
  });
});
