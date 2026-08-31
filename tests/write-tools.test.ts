import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_FIXTURE_TOOLS, GITHUB_TOOLS, WAREHOUSE_TOOLS } from "../fixtures/mcp/catalog.js";
import { READ_SERVER, WRITE_SERVER, refuseIfMergeRequested, refuseProdDeploy, writeToolsOnlyOnWriteMcp } from "../src/write-policy.js";
import { WRITE_TOOLS, type SavedAgent } from "../src/spec.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("write tools only on the write MCP", () => {
  it("keeps warehouse tools read-only and github tools gated writes", () => {
    const result = writeToolsOnlyOnWriteMcp(ALL_FIXTURE_TOOLS);
    expect(result.violations).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("refuses merge and always refuses prod deploy from one write-policy module", () => {
    expect(refuseIfMergeRequested(true)).toEqual({
      refuse: true,
      error: "LOOP never merges. Draft PRs only.",
    });
    expect(refuseProdDeploy({ environment: "production", version: "web-checkout@patched" })).toMatchObject({
      deployed: false,
      live_github: false,
      error: "LOOP never prod-deploys the tenant. Refused.",
    });
  });

  it("annotates warehouse tools as readOnlyHint", () => {
    for (const tool of WAREHOUSE_TOOLS) {
      expect(tool.server).toBe(READ_SERVER);
      expect(tool.kind).toBe("read");
      expect(tool.annotations.readOnlyHint).toBe(true);
      expect(tool.annotations.destructiveHint).toBe(false);
    }
  });

  it("annotates github tools so TrueForge @write / @destructive will pause", () => {
    const byName = Object.fromEntries(GITHUB_TOOLS.map((tool) => [tool.name, tool]));
    expect(byName.open_draft_pr?.annotations.readOnlyHint).toBe(false);
    expect(byName.flag_incident?.annotations.readOnlyHint).toBe(false);
    expect(byName.request_prod_deploy?.annotations.destructiveHint).toBe(true);
    expect(byName.request_prod_deploy?.annotations.readOnlyHint).toBe(false);
  });

  it("does not list write tools on loop-warehouse in the agent spec", () => {
    const agent = JSON.parse(readFileSync(join(root, "agents/loop.json"), "utf8")) as SavedAgent;
    const warehouse = agent.manifest.mcp_servers?.find((server) => server.name === READ_SERVER);
    const github = agent.manifest.mcp_servers?.find((server) => server.name === WRITE_SERVER);
    expect(warehouse?.enable_tools).toEqual(["@read-only"]);
    for (const tool of WRITE_TOOLS) {
      expect(warehouse?.enable_tools).not.toContain(tool);
      expect(github?.enable_tools).toContain(tool);
    }
    expect(github?.require_approval_for_tools).toContain("@write");
  });

  it("keeps GitHub writes on the root: pause, no fourth subagent, prod-deploy refuse", () => {
    const agent = JSON.parse(readFileSync(join(root, "agents/loop.json"), "utf8")) as SavedAgent;
    const github = agent.manifest.mcp_servers?.find((server) => server.name === WRITE_SERVER);
    expect(github?.require_approval_for_tools).toEqual(expect.arrayContaining(["@write", "@destructive"]));
    const instructions = agent.manifest.instructions ?? "";
    expect(instructions).toMatch(/Only the root may call open_draft_pr or flag_incident/);
    expect(instructions).toMatch(/Never spawn a fourth subagent/);
    expect(instructions).toMatch(/request_prod_deploy remains refuse/);
    expect(instructions).toMatch(/Subagents must not call loop-github/);
  });
});
