import { describe, expect, it } from "vitest";
import { colocatedFixtureEnv, fixtureListenBind } from "../fixtures/mcp/listen.js";

describe("fixture MCP listen bind", () => {
  it("defaults to loopback 8788 for local safety", () => {
    expect(fixtureListenBind({})).toEqual({ host: "127.0.0.1", port: 8788 });
  });

  it("prefers LOOP_FIXTURE_PORT over PORT", () => {
    expect(fixtureListenBind({ LOOP_FIXTURE_PORT: "9001", PORT: "10000" })).toEqual({
      host: "0.0.0.0",
      port: 9001,
    });
  });

  it("binds 0.0.0.0 when a host injects PORT and HOST is unset", () => {
    expect(fixtureListenBind({ PORT: "10000" })).toEqual({ host: "0.0.0.0", port: 10000 });
  });

  it("honors HOST over the PORT-hosted default", () => {
    expect(fixtureListenBind({ HOST: "127.0.0.1", PORT: "10000" })).toEqual({
      host: "127.0.0.1",
      port: 10000,
    });
  });

  it("rejects a non-integer port", () => {
    expect(() => fixtureListenBind({ LOOP_FIXTURE_PORT: "nope" })).toThrow(/Invalid fixture MCP port/);
  });

  it("rejects a numeric-prefix port", () => {
    expect(() => fixtureListenBind({ LOOP_FIXTURE_PORT: "8788abc" })).toThrow(/Invalid fixture MCP port/);
  });

  it("rejects a decimal port", () => {
    expect(() => fixtureListenBind({ LOOP_FIXTURE_PORT: "8788.5" })).toThrow(/Invalid fixture MCP port/);
  });

  it("keeps the colocated sidecar on loopback 8788 while TrueForge uses Render PORT", () => {
    const env = colocatedFixtureEnv({ HOST: "0.0.0.0", PORT: "10000", NODE_ENV: "production" });
    expect(env.PORT).toBeUndefined();
    expect(env.HOST).toBe("127.0.0.1");
    expect(env.LOOP_FIXTURE_PORT).toBe("8788");
    expect(fixtureListenBind(env)).toEqual({ host: "127.0.0.1", port: 8788 });
  });
});
