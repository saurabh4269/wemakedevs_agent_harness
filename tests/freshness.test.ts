import { describe, expect, it } from "vitest";
import { briefStillTrue, freshnessFromUnknown, mayOpenDraftPr } from "../src/freshness.js";
import { deployFreshness, payloadFor } from "../fixtures/mcp/stories.js";

describe("deploy brief freshness", () => {
  it("lets the independent story write", () => {
    const fresh = deployFreshness("independent");
    expect(fresh.still_true).toBe(true);
    expect(briefStillTrue(freshnessFromUnknown(fresh))).toBe(true);
    expect(payloadFor("deploys", "independent").still_true).toBe(true);
    expect(mayOpenDraftPr({ storyFreshness: fresh }).ok).toBe(false);
    expect(mayOpenDraftPr({ storyFreshness: fresh, claimedStillTrue: true }).ok).toBe(true);
  });

  it("blocks a stale or missing brief", () => {
    expect(briefStillTrue(undefined)).toBe(false);
    expect(briefStillTrue({ stillTrue: false, currentCommit: "unknown" })).toBe(false);
    expect(payloadFor("deploys", "collapsed").still_true).toBe(false);
    expect(payloadFor("analytics", "independent").still_true).toBeUndefined();
    expect(mayOpenDraftPr({ storyFreshness: deployFreshness("collapsed"), claimedStillTrue: true }).ok).toBe(false);
    expect(mayOpenDraftPr({ storyFreshness: deployFreshness("independent"), claimedStillTrue: false }).ok).toBe(
      false,
    );
    expect(mayOpenDraftPr({ storyFreshness: deployFreshness("independent") }).ok).toBe(false);
  });
});
