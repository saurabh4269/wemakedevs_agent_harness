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

  it("leaves Waiting when turn.done has no required actions", () => {
    const status = deriveLoopStatus([
      { type: "turn.created" },
      { type: "tool.approval_required" },
      { type: "turn.done", state: { status: "done" } },
    ]);
    expect(status.phase).not.toBe("waiting");
    expect(status.phase).not.toBe("doing");
    expect(status.phase).toBe("idle");
    expect(status.doing).toBe("Turn finished");
    expect(status.waiting).toBe("Write was not approved");
  });

  it("does not keep Waiting after a denied approval", () => {
    const status = deriveLoopStatus([
      { type: "turn.created" },
      {
        type: "model.message",
        toolCalls: [{ function: { name: "open_draft_pr" } }],
      },
      { type: "tool.approval_required" },
      {
        type: "turn.done",
        state: { status: "done", requiredActions: [] },
      },
    ]);
    expect(status.phase).not.toBe("waiting");
    expect(status.phase).not.toBe("doing");
    expect(status.phase).toBe("idle");
    expect(status.waiting).toBe("Write was not approved");
    expect(status.doing).toBe("Turn finished");
  });

  it("does not highlight Doing after turn.done with no required_actions", () => {
    const status = deriveLoopStatus([
      { type: "turn.created" },
      {
        type: "model.message",
        toolCalls: [{ function: { name: "query_analytics" } }],
      },
      { type: "turn.done", state: { status: "done" } },
    ]);
    expect(status.phase).not.toBe("doing");
    expect(status.phase).toBe("idle");
    expect(status.doing).toBe("Turn finished");
  });

  it("shows a later denied approval instead of a historical Did", () => {
    const status = deriveLoopStatus([
      { type: "turn.created" },
      { type: "tool.response", toolInfo: { name: "open_draft_pr" }, content: "draft PR opened" },
      {
        type: "turn.done",
        state: { status: "done", output: { content: "Lesson: alias still points at enterprise-annual." } },
      },
      { type: "turn.created" },
      {
        type: "model.message",
        toolCalls: [{ function: { name: "open_draft_pr" } }],
      },
      { type: "tool.approval_required" },
      {
        type: "turn.done",
        state: { status: "done", requiredActions: [] },
      },
    ]);
    expect(status.phase).not.toBe("did");
    expect(status.phase).not.toBe("doing");
    expect(status.phase).toBe("idle");
    expect(status.waiting).toBe("Write was not approved");
    expect(status.did).toBe("Completed open_draft_pr");
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

  it("does not mutate EMPTY_STATUS when deriving a live phase", () => {
    const snapshot = {
      phase: EMPTY_STATUS.phase,
      doing: EMPTY_STATUS.doing,
      waiting: EMPTY_STATUS.waiting,
      did: EMPTY_STATUS.did,
      error: EMPTY_STATUS.error,
    };
    const status = deriveLoopStatus([{ type: "turn.created" }]);
    expect(status.phase).toBe("doing");
    status.phase = "error";
    status.doing = "mutated";
    expect(EMPTY_STATUS).toEqual(snapshot);
  });
});
