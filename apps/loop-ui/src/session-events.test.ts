import { describe, expect, it } from "vitest";
import { describeStatusError, pickActiveLoopSession } from "./session-events";

describe("pickActiveLoopSession", () => {
  it("prefers the UI session id over list order", () => {
    const picked = pickActiveLoopSession(
      [
        { id: "older-open", updatedAt: "2026-08-31T12:00:00.000Z" },
        { id: "newer-other", updatedAt: "2026-08-31T13:00:00.000Z" },
      ],
      "older-open",
    );
    expect(picked?.id).toBe("older-open");
  });

  it("picks the most recently updated session, not the first list hit", () => {
    const picked = pickActiveLoopSession([
      { id: "first", updatedAt: "2026-08-31T09:00:00.000Z" },
      { id: "latest", updatedAt: "2026-08-31T11:00:00.000Z" },
      { id: "mid", updatedAt: "2026-08-31T10:00:00.000Z" },
    ]);
    expect(picked?.id).toBe("latest");
  });

  it("falls back to most recently updated when the preferred id is missing", () => {
    const picked = pickActiveLoopSession(
      [
        { id: "first", updatedAt: "2026-08-31T09:00:00.000Z" },
        { id: "latest", updatedAt: "2026-08-31T11:00:00.000Z" },
      ],
      "not-in-page",
    );
    expect(picked?.id).toBe("latest");
  });
});

describe("describeStatusError", () => {
  it("labels authentication failures", () => {
    expect(describeStatusError(new Error("401 Unauthorized"))).toMatch(/Authentication failed/);
  });

  it("labels connectivity failures", () => {
    expect(describeStatusError(new Error("Failed to fetch"))).toMatch(/Cannot reach TrueForge/);
  });

  it("labels other SDK failures without calling them idle", () => {
    expect(describeStatusError(new Error("SDK exploded"))).toBe("Status load failed: SDK exploded");
  });
});
