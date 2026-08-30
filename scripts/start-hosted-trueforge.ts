import { spawn, type ChildProcess } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { colocatedFixtureEnv } from "../fixtures/mcp/listen.js";

const here = dirname(fileURLToPath(import.meta.url));
const compiled = here.endsWith("/dist/scripts") || here.endsWith("\\dist\\scripts");
const root = compiled ? join(here, "..", "..") : join(here, "..");
const fixtureEntry = compiled
  ? join(root, "dist/fixtures/mcp/server.js")
  : join(root, "fixtures/mcp/server.ts");

const fixturePort = process.env.LOOP_FIXTURE_PORT || "8788";
const healthUrl = `http://127.0.0.1:${fixturePort}/health`;

function spawnFixture(): ChildProcess {
  const env = colocatedFixtureEnv(process.env);
  if (compiled) {
    return spawn(process.execPath, [fixtureEntry], { env, stdio: "inherit" });
  }
  return spawn("npx", ["tsx", fixtureEntry], { env, stdio: "inherit", cwd: root });
}

async function waitForHealth(url: string, attempts = 40): Promise<void> {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // sidecar not listening yet
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Fixture MCP did not become healthy at ${url}`);
}

const fixture = spawnFixture();
fixture.on("exit", (code, signal) => {
  if (signal) {
    process.stderr.write(`Fixture MCP exited on ${signal}\n`);
  } else if (code !== 0 && code !== null) {
    process.stderr.write(`Fixture MCP exited ${code}\n`);
    process.exit(code);
  }
});

await waitForHealth(healthUrl);

const trueforge = spawn("trueforge", [], { stdio: "inherit", env: process.env });

function forward(signal: NodeJS.Signals): void {
  fixture.kill(signal);
  trueforge.kill(signal);
}

process.on("SIGTERM", () => forward("SIGTERM"));
process.on("SIGINT", () => forward("SIGINT"));

trueforge.on("exit", (code) => {
  fixture.kill("SIGTERM");
  process.exit(code ?? 1);
});
