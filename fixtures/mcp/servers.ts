import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GITHUB_TOOLS, WAREHOUSE_TOOLS } from "./catalog.js";
import { mayOpenDraftPr } from "../../src/freshness.js";
import {
  FIXTURE_MODE,
  deployFreshness,
  isStoryName,
  payloadFor,
  type StoryName,
} from "./stories.js";

export function defaultStory(): StoryName {
  const raw = process.env.LOOP_STORY ?? "independent";
  return isStoryName(raw) ? raw : "independent";
}

function jsonResult(payload: unknown, isError = false) {
  return {
    isError,
    content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
  };
}

function resolveStory(scenario: string | undefined): StoryName {
  if (scenario && isStoryName(scenario)) {
    return scenario;
  }
  return defaultStory();
}

export function createWarehouseServer(): McpServer {
  const server = new McpServer({ name: "loop-warehouse", version: "0.1.0" });

  for (const tool of WAREHOUSE_TOOLS) {
    if (tool.name === "get_fixture_meta") {
      server.registerTool(
        tool.name,
        {
          description: tool.description,
          annotations: tool.annotations,
        },
        async () =>
          jsonResult({
            mode: FIXTURE_MODE,
            live_github: false,
            default_story: defaultStory(),
            stories: ["independent", "collapsed"],
            tenant: "fixtures/tenant",
            note: "Sources must stay independent. Collapsed story should refuse a root cause. deploys.still_true false means the brief is stale — do not open a PR.",
          }),
      );
      continue;
    }

    const source =
      tool.name === "query_analytics" ? "analytics" : tool.name === "query_logs" ? "logs" : "deploys";

    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: {
          scenario: z
            .enum(["independent", "collapsed"])
            .optional()
            .describe("independent = distinct evidence. collapsed = three restatements; LOOP should refuse."),
        },
        annotations: tool.annotations,
      },
      async ({ scenario }) => jsonResult(payloadFor(source, resolveStory(scenario))),
    );
  }

  return server;
}

export function createGithubServer(): McpServer {
  const server = new McpServer({ name: "loop-github", version: "0.1.0" });

  server.registerTool(
    "open_draft_pr",
    {
      description: GITHUB_TOOLS[0].description,
      inputSchema: {
        title: z.string().min(1),
        body: z.string().min(1),
        branch: z.string().min(1).default("fix/plan-id-alias"),
        merge: z.boolean().optional().describe("Must stay false. LOOP never merges."),
        still_true: z
          .boolean()
          .optional()
          .describe("Must be true. Stale deploys.still_true refuses a write."),
      },
      annotations: GITHUB_TOOLS[0].annotations,
    },
    async ({ title, body, branch, merge, still_true }) => {
      if (merge) {
        return jsonResult(
          {
            mode: FIXTURE_MODE,
            live_github: false,
            merged: false,
            error: "LOOP never merges. Draft PRs only.",
          },
          true,
        );
      }
      const freshnessGate = mayOpenDraftPr({
        storyFreshness: deployFreshness(defaultStory()),
        claimedStillTrue: still_true,
      });
      if (!freshnessGate.ok) {
        return jsonResult(
          {
            mode: FIXTURE_MODE,
            live_github: false,
            merged: false,
            error: freshnessGate.error,
          },
          true,
        );
      }
      return jsonResult({
        mode: FIXTURE_MODE,
        live_github: false,
        merged: false,
        draft: true,
        branch,
        title,
        body,
        html_url: "https://github.example.invalid/loop-tenant/pull/42",
        note: "Fixture PR. No live GitHub. TrueForge should have paused on this @write tool.",
      });
    },
  );

  server.registerTool(
    "flag_incident",
    {
      description: GITHUB_TOOLS[1].description,
      inputSchema: {
        title: z.string().min(1),
        severity: z.enum(["sev1", "sev2", "sev3"]),
        summary: z.string().min(1),
      },
      annotations: GITHUB_TOOLS[1].annotations,
    },
    async ({ title, severity, summary }) =>
      jsonResult({
        mode: FIXTURE_MODE,
        live_github: false,
        flagged: true,
        paged_prod: false,
        title,
        severity,
        summary,
      }),
  );

  server.registerTool(
    "request_prod_deploy",
    {
      description: GITHUB_TOOLS[2].description,
      inputSchema: {
        environment: z.string().min(1),
        version: z.string().min(1),
      },
      annotations: GITHUB_TOOLS[2].annotations,
    },
    async ({ environment, version }) =>
      jsonResult(
        {
          mode: FIXTURE_MODE,
          live_github: false,
          deployed: false,
          environment,
          version,
          error: "LOOP never prod-deploys the tenant. Refused.",
        },
        true,
      ),
  );

  return server;
}
