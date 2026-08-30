import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("loop-ui install and client config", () => {
  it("includes apps/loop-ui in root workspaces and keeps Node 22.14+", () => {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
      workspaces?: string[];
      engines?: { node?: string };
    };
    expect(pkg.workspaces).toEqual(["apps/loop-ui"]);
    expect(pkg.engines?.node).toBe(">=22.14.0");
    expect(existsSync(join(root, "apps/loop-ui/package.json"))).toBe(true);
  });

  it("does not ship a Vite-bundled TrueForge credential", () => {
    const viteTok = ["VITE", "TRUEFORGE", "TOKEN"].join("_");
    const envExample = readFileSync(join(root, ".env.example"), "utf8");
    expect(envExample).toMatch(/VITE_TRUEFORGE_URL=/);
    expect(envExample.includes(viteTok)).toBe(false);
    const serverSrc = readFileSync(join(root, "apps/loop-ui/src/server.ts"), "utf8");
    expect(serverSrc.includes(viteTok)).toBe(false);
    expect(serverSrc.includes("...")).toBe(false);
    expect(serverSrc).toMatch(/baseUrl: resolveTrueForgeBaseUrl\(\)/);
    const sessionSrc = readFileSync(join(root, "apps/loop-ui/src/session-events.ts"), "utf8");
    expect(sessionSrc.includes("server.token")).toBe(false);
    const envTypes = readFileSync(join(root, "apps/loop-ui/src/vite-env.d.ts"), "utf8");
    expect(envTypes.includes(viteTok)).toBe(false);
  });
});
