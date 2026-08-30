import { isResourceName } from "./resource-name.js";
import { READ_SERVER, WRITE_SERVER } from "./write-policy.js";

export const LOOP_AGENT_NAME = "loop";
export const LOOP_SKILL_NAMES = [
  "three-source-independence",
  "type-a-vs-b",
  "license-to-write",
] as const;

export const WRITE_TOOLS = ["open_draft_pr", "flag_incident", "request_prod_deploy"] as const;

export type McpServerSpec = {
  name: string;
  enable_tools?: string[];
  disable_tools?: string[];
  require_approval_for_tools?: string[];
  preload?: boolean;
};

export type AgentSpec = {
  model: { name: string; params?: Record<string, unknown> };
  instructions?: string;
  mcp_servers?: McpServerSpec[];
  skills?: { name: string }[];
  config?: {
    sandbox?: { enabled: boolean; file_downloads?: boolean };
    generative_ui?: { enabled: boolean };
    ask_user_questions?: { enabled: boolean };
    dynamic_sub_agents?: { enabled: boolean };
    iteration_limit?: number;
  };
};

export type SavedAgent = {
  name: string;
  manifest: AgentSpec;
};

export type SpecIssue = { path: string; message: string };

export function validateLoopAgent(agent: SavedAgent): SpecIssue[] {
  const issues: SpecIssue[] = [];
  if (agent.name !== LOOP_AGENT_NAME) {
    issues.push({ path: "name", message: `expected ${LOOP_AGENT_NAME}` });
  }
  if (!isResourceName(agent.name)) {
    issues.push({ path: "name", message: "must match TrueForge ResourceName" });
  }

  const spec = agent.manifest;
  const modelParts = spec.model?.name?.split("/") ?? [];
  if (modelParts.length !== 2 || !modelParts.every((part) => isResourceName(part))) {
    issues.push({ path: "manifest.model.name", message: "model FQN must be provider/name" });
  }

  if (!spec.config?.sandbox?.enabled) {
    issues.push({ path: "manifest.config.sandbox.enabled", message: "sandbox must be on (skills need it)" });
  }
  if (!spec.config?.dynamic_sub_agents?.enabled) {
    issues.push({ path: "manifest.config.dynamic_sub_agents.enabled", message: "subagents must be on" });
  }
  if (!spec.config?.generative_ui?.enabled) {
    issues.push({ path: "manifest.config.generative_ui.enabled", message: "generative_ui must be on" });
  }

  const skillNames = (spec.skills ?? []).map((skill) => skill.name);
  for (const expected of LOOP_SKILL_NAMES) {
    if (!skillNames.includes(expected)) {
      issues.push({ path: "manifest.skills", message: `missing skill ${expected}` });
    }
  }

  const servers = spec.mcp_servers ?? [];
  const warehouse = servers.find((server) => server.name === READ_SERVER);
  const github = servers.find((server) => server.name === WRITE_SERVER);
  if (!warehouse) {
    issues.push({ path: "manifest.mcp_servers", message: `missing ${READ_SERVER}` });
  }
  if (!github) {
    issues.push({ path: "manifest.mcp_servers", message: `missing ${WRITE_SERVER}` });
  }

  const warehouseEnable = warehouse?.enable_tools ?? [];
  if (!warehouseEnable.includes("@read-only")) {
    issues.push({
      path: "manifest.mcp_servers[loop-warehouse].enable_tools",
      message: "warehouse must enable @read-only",
    });
  }

  const githubEnable = github?.enable_tools ?? [];
  for (const tool of WRITE_TOOLS) {
    if (!githubEnable.includes(tool) && !githubEnable.includes("@all")) {
      issues.push({
        path: "manifest.mcp_servers[loop-github].enable_tools",
        message: `write MCP must enable ${tool}`,
      });
    }
  }
  if (githubEnable.includes("@read-only") && githubEnable.length === 1) {
    issues.push({
      path: "manifest.mcp_servers[loop-github].enable_tools",
      message: "write MCP cannot be read-only only",
    });
  }

  const approval = github?.require_approval_for_tools ?? [];
  if (!approval.includes("@write")) {
    issues.push({
      path: "manifest.mcp_servers[loop-github].require_approval_for_tools",
      message: "writes must pause (@write)",
    });
  }

  const warehouseApproval = warehouse?.require_approval_for_tools ?? ["@write", "@destructive"];
  if (!warehouseApproval.includes("@write")) {
    issues.push({
      path: "manifest.mcp_servers[loop-warehouse].require_approval_for_tools",
      message: "keep default @write gating even on the warehouse",
    });
  }

  if ((spec.instructions ?? "").length < 80) {
    issues.push({ path: "manifest.instructions", message: "instructions are too thin for LOOP" });
  }

  return issues;
}
