import { describe, expect, it } from "vitest";
import { trueForgeServer } from "./server";

describe("trueForgeServer", () => {
  it("returns only type and baseUrl for an unauthenticated client", () => {
    const server = trueForgeServer();
    expect(Object.keys(server).sort()).toEqual(["baseUrl", "type"]);
    expect(server.type).toBe("trueforge");
    expect(typeof server.baseUrl).toBe("string");
    expect(server.baseUrl.length).toBeGreaterThan(0);
    expect(server).not.toHaveProperty("token");
  });
});
