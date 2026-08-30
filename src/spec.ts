import { isResourceName } from "./resource-name.js";
import { READ_SERVER, WRITE_SERVER } from "./write-policy.js";

export const LOOP_AGENT_NAME = "loop";
export const LOOP_SKILL_NAMES = [
  "three-source-independence",
  "type-a-vs-b",
  "license-to-write",
] as const;

export const WRITE_TOOLS = ["open_draft_pr", "flag_incident", "request_prod_deploy"] as const;
export const ROOT_WRITE_TOOLS = ["open_draft_pr", "flag_incident"] as const;
export const REFUSED_WRITE_TOOL = "request_prod_deploy";
export const REQUIRED_SUBAGENTS = ["analytics", "logs", "deploys"] as const;

/** TrueForge AgentSpec has no per-subagent MCP enable/disable. DynamicSubAgentsConfig is only `{ enabled }`. */
export const TRUEFORGE_HAS_PER_SUBAGENT_TOOLS = false;

export const LOOP_INSTRUCTION_RULES: ReadonlyArray<{ id: string; re: RegExp; message: string }> = [
  {
    id: "first-action-three",
    re: /FIRST ACTION[\s\S]*analytics, logs, deploys/,
    message: "first action must spawn analytics, logs, deploys",
  },
  {
    id: "no-warehouse-on-root",
    re: /must not call loop-warehouse/,
    message: "root must not call loop-warehouse",
  },
  {
    id: "subagents-no-questions",
    re: /must not ask the user/,
    message: "subagents must not ask the user",
  },
  {
    id: "subagents-no-github",
    re: /Subagents must not call loop-github/,
    message: "subagents must not call loop-github",
  },
  {
    id: "no-fourth-subagent",
    re: /Never spawn a fourth subagent/,
    message: "must forbid a fourth / write-capable subagent",
  },
  {
    id: "no-patcher",
    re: /Never spawn patcher/,
    message: "must name patcher as a forbidden subagent",
  },
  {
    id: "root-only-writes",
    re: /Only the root may call open_draft_pr or flag_incident/,
    message: "only root may call open_draft_pr / flag_incident",
  },
  {
    id: "after-independence",
    re: /only after the independence check/,
    message: "root writes only after the independence check",
  },
  {
    id: "prod-deploy-refuse",
    re: /request_prod_deploy remains refuse/,
    message: "request_prod_deploy must remain refuse",
  },
  {
    id: "sandbox-or-skip",
    re: /If there is no sandbox, skip the patch/,
    message: "Type A patch stays in sandbox or skip",
  },
  {
    id: "materialize-tenant",
    re: /git clone[\s\S]*wemakedevs_agent_harness/,
    message: "Type A must clone the public tenant repo into the sandbox",
  },
  {
    id: "sandbox-created-exists",
    re: /sandbox\.created means a sandbox exists/,
    message: "sandbox.created is not no sandbox",
  },
  {
    id: "failed-cp-not-missing",
    re: /failed cp of fixtures\/tenant is not "no sandbox"/,
    message: "failed cp is not no sandbox",
  },
  {
    id: "openui-after-three",
    re: /generative UI \(OpenUI\)/,
    message: "after three return, emit OpenUI",
  },
  {
    id: "code-mode-aggregations",
    re: /Code Mode[\s\S]*mcp_client/,
    message: "aggregations use Code Mode mcp_client",
  },
  {
    id: "code-mode-no-draft-pr",
    re: /Do not put open_draft_pr[\s\S]*inside that script/,
    message: "Code Mode script must not call open_draft_pr",
  },
  {
    id: "no-direct-query-star",
    re: /never call query_analytics, query_logs, or query_deploys from the root/,
    message: "root must not call query_* as direct tools",
  },
];

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
  if (!approval.includes("@destructive")) {
    issues.push({
      path: "manifest.mcp_servers[loop-github].require_approval_for_tools",
      message: "destructive tools must pause (@destructive)",
    });
  }

  const warehouseApproval = warehouse?.require_approval_for_tools ?? ["@write", "@destructive"];
  if (!warehouseApproval.includes("@write")) {
    issues.push({
      path: "manifest.mcp_servers[loop-warehouse].require_approval_for_tools",
      message: "keep default @write gating even on the warehouse",
    });
  }

  const instructions = spec.instructions ?? "";
  if (instructions.length < 80) {
    issues.push({ path: "manifest.instructions", message: "instructions are too thin for LOOP" });
  }
  for (const rule of LOOP_INSTRUCTION_RULES) {
    if (!rule.re.test(instructions)) {
      issues.push({ path: "manifest.instructions", message: rule.message });
    }
  }

  return issues;
}
