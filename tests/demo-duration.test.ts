import { describe, expect, it } from "vitest";
import { compositionSeconds } from "../apps/loop-demo/src/beats.ts";

describe("LOOP judge demo timing", () => {
  it("stays under the 3 minute YouTube cap", () => {
    expect(compositionSeconds()).toBeLessThanOrEqual(180);
    expect(compositionSeconds()).toBeGreaterThan(60);
  });
});
