import { TrueForge } from "@truefoundry/trueforge-sdk";
import { DEFAULT_TRUEFORGE_URL, trueForgeServer } from "./server";
import { deriveLoopStatus, EMPTY_STATUS, statusLoadError, type LoopEvent, type LoopStatus } from "./status";

function sdkBaseUrl(serverBaseUrl: string): string {
  if (serverBaseUrl === "/") {
    if (typeof window !== "undefined" && window.location?.origin) {
      return window.location.origin;
    }
    return DEFAULT_TRUEFORGE_URL;
  }
  return serverBaseUrl;
}

function createClient(): TrueForge {
  const server = trueForgeServer();
  return new TrueForge({
    baseUrl: sdkBaseUrl(server.baseUrl),
    token: server.token,
  });
}

export type LoopSessionRow = {
  id: string;
  updatedAt: string;
};

/**
 * Bind the rail to the session TrueForgeUI is showing.
 * Prefer an explicit SDK/UI session id (assistant-ui `threadListItem.remoteId`)
 * when the host passes one. Otherwise pick the most recently updated LOOP
 * session by `updatedAt`, not the first hit in an unfiltered 25-session page.
 */
export function pickActiveLoopSession(
  sessions: LoopSessionRow[],
  preferredSessionId?: string,
): LoopSessionRow | undefined {
  if (preferredSessionId) {
    const match = sessions.find((session) => session.id === preferredSessionId);
    if (match) {
      return match;
    }
  }
  let newest: LoopSessionRow | undefined;
  for (const session of sessions) {
    if (!newest || session.updatedAt > newest.updatedAt) {
      newest = session;
    }
  }
  return newest;
}

export function describeStatusError(error: unknown): string {
  if (error instanceof Error && error.message) {
    const message = error.message.toLowerCase();
    if (
      message.includes("401") ||
      message.includes("403") ||
      message.includes("unauthorized") ||
      message.includes("forbidden") ||
      message.includes("auth")
    ) {
      return `Authentication failed: ${error.message}`;
    }
    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("econnrefused") ||
      message.includes("failed to fetch")
    ) {
      return `Cannot reach TrueForge: ${error.message}`;
    }
    return `Status load failed: ${error.message}`;
  }
  return "Status load failed.";
}

async function listLoopSessions(client: TrueForge): Promise<LoopSessionRow[]> {
  const sessions: LoopSessionRow[] = [];
  for await (const session of await client.sessions.list({
    agentId: "loop",
    order: "desc",
    limit: 25,
  })) {
    sessions.push({ id: session.id, updatedAt: session.updatedAt });
    if (sessions.length >= 25) {
      break;
    }
  }
  return sessions;
}

async function eventsForSession(client: TrueForge, sessionId: string): Promise<LoopEvent[]> {
  const events: LoopEvent[] = [];
  for await (const item of await client.sessions.listEvents(sessionId)) {
    events.push(item.event as LoopEvent);
    if (events.length >= 200) {
      break;
    }
  }
  events.reverse();
  return events;
}

export async function loadLoopStatus(preferredSessionId?: string): Promise<LoopStatus> {
  try {
    const client = createClient();
    let sessionId = preferredSessionId;
    if (!sessionId) {
      sessionId = pickActiveLoopSession(await listLoopSessions(client))?.id;
    }
    if (!sessionId) {
      return EMPTY_STATUS;
    }
    return deriveLoopStatus(await eventsForSession(client, sessionId));
  } catch (error) {
    return statusLoadError(describeStatusError(error));
  }
}
