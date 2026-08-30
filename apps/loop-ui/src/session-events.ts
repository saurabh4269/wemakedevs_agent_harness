import { TrueForge } from "@truefoundry/trueforge-sdk";
import { DEFAULT_TRUEFORGE_URL, trueForgeServer } from "./server";
import { deriveLoopStatus, EMPTY_STATUS, type LoopEvent, type LoopStatus } from "./status";

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

function isLoopAgent(agent: { name?: string }): boolean {
  return agent.name === "loop";
}

export async function loadLoopStatus(): Promise<LoopStatus> {
  try {
    const client = createClient();
    let sessionId: string | undefined;
    for await (const session of await client.sessions.list({ limit: 25 })) {
      if (isLoopAgent(session.agent as { name?: string })) {
        sessionId = session.id;
        break;
      }
    }
    if (!sessionId) {
      return EMPTY_STATUS;
    }
    const events: LoopEvent[] = [];
    for await (const item of await client.sessions.listEvents(sessionId)) {
      events.push(item.event as LoopEvent);
      if (events.length >= 200) {
        break;
      }
    }
    events.reverse();
    return deriveLoopStatus(events);
  } catch {
    return EMPTY_STATUS;
  }
}
