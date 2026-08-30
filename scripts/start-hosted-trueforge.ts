import { spawn, type ChildProcess } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { colocatedFixtureEnv, fixtureListenBind } from "../fixtures/mcp/listen.js";

const here = dirname(fileURLToPath(import.meta.url));
const compiled = here.endsWith("/dist/scripts") || here.endsWith("\\dist\\scripts");
const root = compiled ? join(here, "..", "..") : join(here, "..");
const fixtureEntry = compiled
  ? join(root, "dist/fixtures/mcp/server.js")
  : join(root, "fixtures/mcp/server.ts");

const fixtureEnv = colocatedFixtureEnv(process.env);
const bind = fixtureListenBind(fixtureEnv);
const healthUrl = `http://${bind.host}:${bind.port}/health`;

function spawnFixture(): ChildProcess {
  if (compiled) {
    return spawn(process.execPath, [fixtureEntry], { env: fixtureEnv, stdio: "inherit" });
  }
  return spawn("npx", ["tsx", fixtureEntry], { env: fixtureEnv, stdio: "inherit", cwd: root });
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
let trueforge: ChildProcess | undefined;
let shuttingDown = false;

function shutdown(exitCode = 1): void {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  fixture.kill("SIGTERM");
  trueforge?.kill("SIGTERM");
  process.exit(exitCode);
}

fixture.on("exit", (code, signal) => {
  if (shuttingDown) {
    return;
  }
  process.stderr.write(`Fixture MCP exited unexpectedly code=${code} signal=${signal}\n`);
  shutdown(code && code > 0 ? code : 1);
});

await waitForHealth(healthUrl);

trueforge = spawn("trueforge", [], { stdio: "inherit", env: process.env });

function forward(signal: NodeJS.Signals): void {
  shuttingDown = true;
  fixture.kill(signal);
  trueforge?.kill(signal);
}

process.on("SIGTERM", () => forward("SIGTERM"));
process.on("SIGINT", () => forward("SIGINT"));

trueforge.on("exit", (code) => {
  if (shuttingDown) {
    process.exit(code ?? 1);
    return;
  }
  shuttingDown = true;
  fixture.kill("SIGTERM");
  process.exit(code ?? 1);
});
