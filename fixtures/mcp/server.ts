import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createGithubServer, createWarehouseServer, defaultDataset } from "./servers.js";
import { FIXTURE_MODE } from "./datasets.js";

const port = Number.parseInt(process.env.LOOP_FIXTURE_PORT ?? "8788", 10);

async function attach(create: () => McpServer, req: express.Request, res: express.Response): Promise<void> {
  const server = create();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => {
    void transport.close();
    void server.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    mode: FIXTURE_MODE,
    live_github: false,
    dataset: defaultDataset(),
    warehouse: "/warehouse",
    github: "/github",
  });
});

function handleMcp(create: () => McpServer, req: express.Request, res: express.Response): void {
  void attach(create, req, res).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`MCP attach failed: ${message}\n`);
    if (!res.headersSent) {
      res.status(500).json({ error: "MCP request failed" });
    }
  });
}

app.post("/warehouse", (req, res) => {
  handleMcp(createWarehouseServer, req, res);
});
app.post("/github", (req, res) => {
  handleMcp(createGithubServer, req, res);
});

app.all("/warehouse", (_req, res) => {
  res.status(405).json({ error: "Use POST for MCP Streamable HTTP" });
});
app.all("/github", (_req, res) => {
  res.status(405).json({ error: "Use POST for MCP Streamable HTTP" });
});

app.listen(port, "127.0.0.1", () => {
  process.stdout.write(
    `LOOP fixture MCP (mode:${FIXTURE_MODE}) on 127.0.0.1:${port} dataset=${defaultDataset()}\n` +
      `  warehouse: http://127.0.0.1:${port}/warehouse\n` +
      `  github:    http://127.0.0.1:${port}/github\n`,
  );
});
