import {
  annotationsForKind,
  READ_SERVER,
  WRITE_SERVER,
  type CatalogTool,
  type ToolKind,
} from "../../src/write-policy.js";

function tool(
  server: CatalogTool["server"],
  name: string,
  kind: ToolKind,
  description: string,
): CatalogTool & { description: string } {
  return { server, name, kind, description, annotations: annotationsForKind(kind) };
}

export const WAREHOUSE_TOOLS = [
  tool(READ_SERVER, "query_analytics", "read", "Product analytics for the LOOP fixture tenant."),
  tool(READ_SERVER, "query_logs", "read", "Application logs for the LOOP fixture tenant."),
  tool(READ_SERVER, "query_deploys", "read", "Deploy timeline for the LOOP fixture tenant."),
  tool(READ_SERVER, "get_fixture_meta", "read", "Fixture mode label. Always mode:fixture; never live GitHub."),
] as const;

export const GITHUB_TOOLS = [
  tool(WRITE_SERVER, "open_draft_pr", "write", "Open a draft PR against the tenant. Fixture: no live GitHub, never merges."),
  tool(WRITE_SERVER, "flag_incident", "write", "Flag an incident. Fixture only; does not page prod."),
  tool(
    WRITE_SERVER,
    "request_prod_deploy",
    "destructive",
    "Request a production deploy. LOOP never prod-deploys the tenant; this always refuses.",
  ),
] as const;

export const ALL_FIXTURE_TOOLS: CatalogTool[] = [...WAREHOUSE_TOOLS, ...GITHUB_TOOLS];
