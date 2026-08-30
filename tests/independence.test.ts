import { describe, expect, it } from "vitest";
import { assessThreeSourceIndependence, type SourceReport } from "../src/independence.js";
import { storyReports } from "../fixtures/mcp/stories.js";

describe("three-source independence", () => {
  it("accepts the independent conversion-drop fixture", () => {
    const result = assessThreeSourceIndependence(storyReports("independent"));
    expect(result.independent).toBe(true);
    expect(result.uniqueEvidenceIds).toEqual([
      "funnel-cta-desktop-chrome",
      "invalid-plan-id-checkout-ts",
      "catalog-v3-rollout",
    ]);
  });

  it("refuses the collapsed fixture where all three restate one query", () => {
    const result = assessThreeSourceIndependence(storyReports("collapsed"));
    expect(result.independent).toBe(false);
    expect(result.reason.toLowerCase()).toMatch(/refuse/);
  });

  it("refuses a single query copied into three labels", () => {
    const copy: SourceReport[] = [
      {
        source: "analytics",
        evidenceId: "one",
        uniqueFacts: ["checkout is broken"],
        summary: "Checkout is broken so conversion dropped.",
      },
      {
        source: "logs",
        evidenceId: "one",
        uniqueFacts: ["checkout is broken"],
        summary: "Checkout is broken so conversion dropped.",
      },
      {
        source: "deploys",
        evidenceId: "one",
        uniqueFacts: ["checkout is broken"],
        summary: "Checkout is broken so conversion dropped.",
      },
    ];
    expect(assessThreeSourceIndependence(copy).independent).toBe(false);
  });

  it("refuses when a source is missing", () => {
    const two = storyReports("independent").slice(0, 2);
    expect(assessThreeSourceIndependence(two).independent).toBe(false);
  });
});
