import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isResourceName } from "../src/resource-name.js";
import { LOOP_AGENT_NAME, LOOP_SKILL_NAMES, validateLoopAgent, type SavedAgent } from "../src/spec.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("LOOP agent spec shape", () => {
  const agent = JSON.parse(readFileSync(join(root, "agents/loop.json"), "utf8")) as SavedAgent;

  it("matches TrueForge ResourceName and required LOOP flags", () => {
    expect(isResourceName(LOOP_AGENT_NAME)).toBe(true);
    expect(isResourceName("loop-warehouse")).toBe(true);
    expect(isResourceName("loop-github")).toBe(true);
    for (const skill of LOOP_SKILL_NAMES) {
      expect(isResourceName(skill)).toBe(true);
    }
    expect(isResourceName("Loop")).toBe(false);
    expect(validateLoopAgent(agent)).toEqual([]);
  });

  it("enables sandbox, subagents, generative UI, and attaches skills", () => {
    expect(agent.name).toBe("loop");
    expect(agent.manifest.config?.sandbox?.enabled).toBe(true);
    expect(agent.manifest.config?.dynamic_sub_agents?.enabled).toBe(true);
    expect(agent.manifest.config?.generative_ui?.enabled).toBe(true);
    expect(agent.manifest.skills?.map((skill) => skill.name)).toEqual([...LOOP_SKILL_NAMES]);
    expect(agent.manifest.model.name).toContain("/");
  });

  it("does not embed connector credentials", () => {
    const raw = readFileSync(join(root, "agents/loop.json"), "utf8").toLowerCase();
    expect(raw).not.toMatch(/api[_-]?key/);
    expect(raw).not.toMatch(/sk-/);
    expect(raw).not.toMatch(/nvapi/);
    expect(agent.manifest.mcp_servers?.every((server) => Object.keys(server).includes("name"))).toBe(true);
  });
});
