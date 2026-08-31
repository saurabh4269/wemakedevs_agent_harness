import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isResourceName } from "../src/resource-name.js";
import {
  HOSTED_FREE_MODEL_FQN,
  LOOP_AGENT_NAME,
  LOOP_INSTRUCTION_RULES,
  LOOP_SKILL_NAMES,
  REQUIRED_SUBAGENTS,
  TRUEFORGE_HAS_PER_SUBAGENT_TOOLS,
  hostedModelGuard,
  shouldRegisterBackupProviders,
  validateLoopAgent,
  type SavedAgent,
} from "../src/spec.js";

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
    expect(agent.manifest.config?.ask_user_questions?.enabled).toBe(false);
    expect(agent.manifest.model.params?.max_tokens).toBe(4096);
    expect(agent.manifest.model.params?.parallel_tool_calls).toBe(true);
    expect(agent.manifest.config?.iteration_limit).toBe(40);
    expect(agent.manifest.skills?.map((skill) => skill.name)).toEqual([...LOOP_SKILL_NAMES]);
    const parts = agent.manifest.model.name.split("/");
    expect(parts).toHaveLength(2);
    expect(parts[0] !== undefined && isResourceName(parts[0])).toBe(true);
    expect(parts[1] !== undefined && isResourceName(parts[1])).toBe(true);
  });

  it("rejects model FQNs that are not exactly provider/name", () => {
    const clone = structuredClone(agent);
    for (const bad of ["", "openrouter", "/model", "provider/", "a/b/c", "OpenRouter/gpt-4.1-mini"]) {
      clone.manifest.model.name = bad;
      expect(validateLoopAgent(clone).some((issue) => issue.path === "manifest.model.name")).toBe(true);
    }
    clone.manifest.model.name = "openrouter/gpt-4.1-mini";
    expect(validateLoopAgent(clone).filter((issue) => issue.path === "manifest.model.name")).toEqual([]);
  });

  it("requires first action to spawn analytics, logs, deploys and forbids a write-capable fourth", () => {
    expect(TRUEFORGE_HAS_PER_SUBAGENT_TOOLS).toBe(false);
    expect([...REQUIRED_SUBAGENTS]).toEqual(["analytics", "logs", "deploys"]);
    const instructions = agent.manifest.instructions ?? "";
    for (const rule of LOOP_INSTRUCTION_RULES) {
      expect(instructions, rule.id).toMatch(rule.re);
    }
    expect(instructions).not.toMatch(/until those three reports exist/);
    expect(instructions).toMatch(/Do not call ask_user_question/);
    expect(instructions).toMatch(/retry that exact name once/);
    expect(instructions).toMatch(/still_true is false/);
    expect(instructions).toMatch(/Do not call get_current_datetime, exec, or any other tool/);
    expect(instructions).toMatch(/Never wrap query_analytics, query_logs, query_deploys, or open_draft_pr in call_tool/);
    expect(instructions).toMatch(/Pass still_true: true as a tool argument/);
    expect(instructions).toMatch(/Do not call list_tools or get_tool_info/);
  });

  it("refuses a hosted import that is not OpenAI GPT-5.6 Luna", () => {
    const luna = {
      modelId: "gpt-5.6-luna",
      modelName: "gpt-5-6-luna",
    };
    expect(hostedModelGuard("https://loop.heisenbug.in", HOSTED_FREE_MODEL_FQN, luna)).toBeUndefined();
    expect(hostedModelGuard("https://loop.heisenbug.in.", HOSTED_FREE_MODEL_FQN, luna)).toBeUndefined();
    expect(hostedModelGuard("https://loop-trueforge.onrender.com", HOSTED_FREE_MODEL_FQN, luna)).toBeUndefined();
    expect(hostedModelGuard("https://loop.heisenbug.in", "openrouter/gpt-4.1-mini", luna)).toMatch(
      /gpt-5-6-luna/,
    );
    expect(
      hostedModelGuard("https://loop.heisenbug.in", HOSTED_FREE_MODEL_FQN, {
        modelId: "openai/gpt-4.1-mini",
        modelName: "gpt-4.1-mini",
      }),
    ).toMatch(/OpenAI/);
    expect(hostedModelGuard("http://localhost:8790", "openrouter/gpt-4.1-mini")).toBeUndefined();
    expect(shouldRegisterBackupProviders("https://loop.heisenbug.in")).toBe(false);
    expect(shouldRegisterBackupProviders("https://loop-trueforge.onrender.com")).toBe(false);
    expect(shouldRegisterBackupProviders("http://localhost:8790")).toBe(true);
  });

  it("rejects a spec that turns ask_user_questions back on", () => {
    const clone = structuredClone(agent);
    clone.manifest.config = { ...clone.manifest.config, ask_user_questions: { enabled: true } };
    expect(
      validateLoopAgent(clone).some((issue) => issue.path === "manifest.config.ask_user_questions.enabled"),
    ).toBe(true);
  });

  it("teaches the root to clone the public tenant, keep the sandbox, emit OpenUI, and use Code Mode", () => {
    const instructions = agent.manifest.instructions ?? "";
    expect(instructions).toMatch(/git clone[\s\S]*wemakedevs_agent_harness/);
    expect(instructions).toMatch(/sandbox\.created means a sandbox exists/);
    expect(instructions).toMatch(/failed cp of fixtures\/tenant is not "no sandbox"/);
    expect(instructions).toMatch(/generative UI \(OpenUI\)/);
    expect(instructions).toMatch(/Code Mode[\s\S]*mcp_client/);
    expect(instructions).toMatch(/Do not put open_draft_pr[\s\S]*inside that script/);
    expect(instructions).toMatch(/rm -rf/);
    expect(instructions).toMatch(/at most twice/);
    expect(instructions).toMatch(/say clone failed/);
    expect(instructions).toMatch(/do not write fabricated tenant sources/);
    expect(instructions).not.toMatch(/Keep trying until that file exists/);
    expect(instructions).toMatch(/empty cwd with no wemakedevs_agent_harness/);
    expect(instructions).toMatch(/MUST be the MCP tool open_draft_pr with merge false and still_true true/);
    expect(instructions).toMatch(/Do not run npx, node, or a tenant check/);
    const typeA = readFileSync(join(root, "skills/type-a-vs-b/SKILL.md"), "utf8");
    expect(typeA).toMatch(/git clone --depth 1 https:\/\/github.com\/saurabh4269\/wemakedevs_agent_harness\.git/);
    expect(typeA).toMatch(/sandbox\.created means a sandbox exists/);
    expect(typeA).toMatch(/enterprise-annual-v3/);
    expect(typeA).toMatch(/test -f/);
    expect(typeA).toMatch(/rm -rf/);
    expect(typeA).toMatch(/At most two clone attempts/);
    expect(typeA).toMatch(/fabricated tenant sources/);
    expect(typeA).toMatch(/Do not wrap it in `call_tool`/);
    expect(typeA).toMatch(/still_true: true` as a tool argument/);
    expect(typeA).not.toMatch(/Keep trying until that file exists/);
    expect(typeA).not.toMatch(/write the known tenant sources/);
  });

  it("does not embed connector credentials", () => {
    const raw = readFileSync(join(root, "agents/loop.json"), "utf8").toLowerCase();
    expect(raw).not.toMatch(/api[_-]?key/);
    expect(raw).not.toMatch(/sk-/);
    expect(raw).not.toMatch(/nvapi/);
    expect(agent.manifest.mcp_servers?.every((server) => Object.keys(server).includes("name"))).toBe(true);
  });
});
