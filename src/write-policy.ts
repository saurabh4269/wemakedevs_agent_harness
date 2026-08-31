export type ToolKind = "read" | "write" | "destructive";

export type ToolAnnotations = {
  readOnlyHint: boolean;
  destructiveHint: boolean;
};

export type CatalogTool = {
  server: "loop-warehouse" | "loop-github";
  name: string;
  kind: ToolKind;
  annotations: ToolAnnotations;
};

export const WRITE_SERVER = "loop-github";
export const READ_SERVER = "loop-warehouse";

export const NEVER_MERGE_ERROR = "LOOP never merges. Draft PRs only.";
export const NEVER_PROD_DEPLOY_ERROR = "LOOP never prod-deploys the tenant. Refused.";

export function refuseIfMergeRequested(
  merge: boolean | undefined,
): { refuse: true; error: string } | { refuse: false } {
  if (merge === true) {
    return { refuse: true, error: NEVER_MERGE_ERROR };
  }
  return { refuse: false };
}

export function refuseProdDeploy(input: { environment: string; version: string }): {
  mode: "fixture";
  live_github: false;
  deployed: false;
  environment: string;
  version: string;
  error: string;
} {
  return {
    mode: "fixture",
    live_github: false,
    deployed: false,
    environment: input.environment,
    version: input.version,
    error: NEVER_PROD_DEPLOY_ERROR,
  };
}

export function annotationsForKind(kind: ToolKind): ToolAnnotations {
  if (kind === "read") {
    return { readOnlyHint: true, destructiveHint: false };
  }
  if (kind === "destructive") {
    return { readOnlyHint: false, destructiveHint: true };
  }
  return { readOnlyHint: false, destructiveHint: false };
}

export function writeToolsOnlyOnWriteMcp(tools: CatalogTool[]): { ok: boolean; violations: string[] } {
  const violations: string[] = [];

  for (const tool of tools) {
    if (tool.server === READ_SERVER && tool.kind !== "read") {
      violations.push(`${tool.server}/${tool.name} is ${tool.kind} but warehouse must be read-only`);
    }
    if (tool.server === READ_SERVER && !tool.annotations.readOnlyHint) {
      violations.push(`${tool.server}/${tool.name} is missing readOnlyHint`);
    }
    if (tool.server === WRITE_SERVER && tool.kind === "read") {
      violations.push(`${tool.server}/${tool.name} is read-only on the write MCP`);
    }
    if (tool.kind === "write" && tool.server !== WRITE_SERVER) {
      violations.push(`write tool ${tool.name} must live on ${WRITE_SERVER}`);
    }
    if (tool.kind === "destructive" && tool.server !== WRITE_SERVER) {
      violations.push(`destructive tool ${tool.name} must live on ${WRITE_SERVER}`);
    }
    if (tool.kind !== "read" && tool.annotations.readOnlyHint) {
      violations.push(`${tool.name} is ${tool.kind} but annotated read-only`);
    }
    if (tool.kind === "destructive" && !tool.annotations.destructiveHint) {
      violations.push(`${tool.name} must be annotated destructive`);
    }
    if (tool.kind === "write" && tool.annotations.destructiveHint) {
      violations.push(`${tool.name} is a gated write, not a destructive prod action`);
    }
  }

  return { ok: violations.length === 0, violations };
}
