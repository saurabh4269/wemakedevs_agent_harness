import type { ListenOptions } from "node:net";

export type FixtureListenBind = {
  host: NonNullable<ListenOptions["host"]>;
  port: number;
};

/**
 * Bind the fixture MCP for local safety or a hosted PORT (Render).
 * Port: LOOP_FIXTURE_PORT, else PORT, else 8788.
 * Host: HOST, else 0.0.0.0 when a platform set PORT, else 127.0.0.1.
 */
export function fixtureListenBind(env: NodeJS.Dict<string> = process.env): FixtureListenBind {
  const portRaw = (env.LOOP_FIXTURE_PORT || env.PORT || "8788").trim();
  if (!/^[0-9]+$/.test(portRaw)) {
    throw new Error(`Invalid fixture MCP port "${portRaw}"`);
  }
  const port = Number.parseInt(portRaw, 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid fixture MCP port "${portRaw}"`);
  }
  const hostExplicit = env.HOST?.trim();
  const hosted = Boolean(env.PORT && env.PORT.length > 0);
  const host = hostExplicit || (hosted ? "0.0.0.0" : "127.0.0.1");
  return { host, port };
}

/**
 * Env for the colocated sidecar inside the TrueForge image.
 * TrueForge keeps platform PORT / HOST=0.0.0.0; the fixture must stay on loopback 8788.
 */
export function colocatedFixtureEnv(env: NodeJS.Dict<string> = process.env): NodeJS.ProcessEnv {
  const next: NodeJS.ProcessEnv = {};
  for (const [key, value] of Object.entries(env)) {
    if (key === "PORT" || value === undefined) {
      continue;
    }
    next[key] = value;
  }
  next.HOST = "127.0.0.1";
  next.LOOP_FIXTURE_PORT = env.LOOP_FIXTURE_PORT || "8788";
  return next;
}
