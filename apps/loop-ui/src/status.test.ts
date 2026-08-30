import { describe, expect, it } from "vitest";
import { deriveLoopStatus, EMPTY_STATUS, STATUS_LABELS } from "./status";

describe("deriveLoopStatus", () => {
  it("keeps idle labels when there are no events", () => {
    expect(deriveLoopStatus([])).toEqual(EMPTY_STATUS);
    expect(STATUS_LABELS).toEqual(["Doing", "Waiting", "Did"]);
  });

  it("marks Doing when tool calls are streaming", () => {
    const status = deriveLoopStatus([
      { type: "turn.created" },
      {
        type: "model.message",
        toolCalls: [{ function: { name: "query_analytics" } }],
      },
    ]);
    expect(status.phase).toBe("doing");
    expect(status.doing).toContain("query_analytics");
  });

  it("marks Waiting on require_approval_for_tools", () => {
    const status = deriveLoopStatus([
      { type: "turn.created" },
      {
        type: "model.message",
        toolCalls: [{ function: { name: "open_draft_pr" } }],
      },
      { type: "tool.approval_required" },
      {
        type: "turn.done",
        state: {
          status: "done",
          requiredActions: [{ type: "tool.approval_required" }],
        },
      },
    ]);
    expect(status.phase).toBe("waiting");
    expect(status.waiting.toLowerCase()).toMatch(/approv|pause/);
  });

  it("marks Did after a completed patch or draft PR", () => {
    const status = deriveLoopStatus([
      { type: "tool.response", toolInfo: { name: "open_draft_pr" }, content: "draft PR opened" },
      {
        type: "turn.done",
        state: { status: "done", output: { content: "Lesson: alias still points at enterprise-annual." } },
      },
    ]);
    expect(status.phase).toBe("did");
    expect(status.did.toLowerCase()).toMatch(/open_draft_pr|lesson|patch/);
  });
});
