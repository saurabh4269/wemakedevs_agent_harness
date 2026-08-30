export const STATUS_LABELS = ["Doing", "Waiting", "Did"] as const;

export type StatusPhase = "idle" | "doing" | "waiting" | "did" | "error";

export type LoopEvent = {
  type: string;
  content?: unknown;
  toolCalls?: Array<{
    function?: { name?: string };
    toolInfo?: { name?: string };
  }>;
  state?: {
    status?: string;
    requiredActions?: Array<{ type?: string }>;
    output?: { content?: unknown };
  };
  title?: string;
  toolInfo?: { name?: string };
};

export type LoopStatus = {
  phase: StatusPhase;
  doing: string;
  waiting: string;
  did: string;
  error: string;
};

export const EMPTY_STATUS: LoopStatus = {
  phase: "idle",
  doing: "No tool calls yet",
  waiting: "No write pause yet",
  did: "No patch, proposal, or lesson yet",
  error: "",
};

export function statusLoadError(reason: string): LoopStatus {
  return {
    phase: "error",
    doing: "Status unavailable",
    waiting: "Status unavailable",
    did: "Status unavailable",
    error: reason,
  };
}

const WRITE_TOOLS = new Set(["open_draft_pr", "flag_incident", "request_prod_deploy"]);
const DID_RE = /\b(patch|proposal|lesson|draft pr|root cause)\b/i;

function toolName(call: { function?: { name?: string }; toolInfo?: { name?: string } }): string {
  return call.toolInfo?.name || call.function?.name || "tool";
}

function textOf(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text?: string }).text ?? "");
        }
        return "";
      })
      .join(" ");
  }
  return "";
}

function hasPendingApproval(event: LoopEvent): boolean {
  if (event.type === "tool.approval_required") {
    return true;
  }
  const actions = event.state?.requiredActions ?? [];
  return actions.some((action) => action.type === "tool.approval_required");
}

export function deriveLoopStatus(events: LoopEvent[]): LoopStatus {
  const status: LoopStatus = {
    phase: EMPTY_STATUS.phase,
    doing: EMPTY_STATUS.doing,
    waiting: EMPTY_STATUS.waiting,
    did: EMPTY_STATUS.did,
    error: EMPTY_STATUS.error,
  };
  if (events.length === 0) {
    return status;
  }

  // Phase comes from the latest turn, not a sticky cumulative Did.
  let turnCompletedWrite = false;
  let turnSawApproval = false;

  const beginTurn = () => {
    turnCompletedWrite = false;
    turnSawApproval = false;
  };

  for (const event of events) {
    if (event.type === "turn.created" || event.type === "model.message.delta") {
      if (event.type === "turn.created") {
        beginTurn();
      }
      status.phase = "doing";
      status.doing = "Streaming a turn";
    }
    if (event.type === "thread.created") {
      status.phase = "doing";
      status.doing = event.title ? `Subagent: ${event.title}` : "Subagents running";
    }
    if (event.type === "model.message" && event.toolCalls && event.toolCalls.length > 0) {
      status.phase = "doing";
      status.doing = event.toolCalls.map(toolName).join(", ");
    }
    if (event.type === "tool.response") {
      const name = event.toolInfo?.name ?? "tool";
      status.doing = `Ran ${name}`;
      if (WRITE_TOOLS.has(name) || DID_RE.test(textOf(event.content))) {
        status.did = `Completed ${name}`;
        status.phase = "did";
        turnCompletedWrite = true;
      }
    }
    if (hasPendingApproval(event)) {
      status.phase = "waiting";
      status.waiting = "Approve the write before it runs";
      turnSawApproval = true;
    }
    if (event.type === "turn.done") {
      if (hasPendingApproval(event)) {
        status.phase = "waiting";
        status.waiting = "Paused on require_approval_for_tools";
      } else {
        const output = textOf(event.state?.output?.content ?? event.content);
        if (DID_RE.test(output) || turnCompletedWrite) {
          status.phase = "did";
          if (status.did === EMPTY_STATUS.did) {
            status.did = "Patch, proposal, or lesson is in the thread";
          }
        } else {
          // Completed turn with no pending write: idle, not Doing.
          // A denied approval in this turn must surface even after an earlier write.
          status.phase = "idle";
          status.doing = "Turn finished";
          if (turnSawApproval) {
            status.waiting = "Write was not approved";
          }
        }
      }
      beginTurn();
    }
  }

  return status;
}
