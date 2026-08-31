import { spawn, type ChildProcess } from "node:child_process";
import net from "node:net";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { colocatedFixtureEnv, fixtureListenBind } from "../fixtures/mcp/listen.js";
import { applyHostedPlatformEnv, usesColocatedRedis } from "../src/hosted-env.js";

applyHostedPlatformEnv(process.env);

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

function spawnColocatedRedis(): ChildProcess {
  // Ephemeral peering only — no RDB/AOF on the dyno filesystem.
  return spawn(
    "redis-server",
    ["--bind", "127.0.0.1", "--port", "6379", "--save", "", "--appendonly", "no", "--protected-mode", "yes"],
    { stdio: "inherit" },
  );
}

async function waitForTcp(host: string, port: number, attempts = 40): Promise<void> {
  for (let i = 0; i < attempts; i += 1) {
    const ok = await new Promise<boolean>((resolve) => {
      const socket = net.connect({ host, port }, () => {
        socket.end();
        resolve(true);
      });
      socket.on("error", () => resolve(false));
    });
    if (ok) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Colocated Redis did not accept connections on ${host}:${port}`);
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

const children: ChildProcess[] = [];
let redis: ChildProcess | undefined;
if (usesColocatedRedis(process.env)) {
  redis = spawnColocatedRedis();
  children.push(redis);
  await waitForTcp("127.0.0.1", 6379);
}

const fixture = spawnFixture();
children.push(fixture);
let trueforge: ChildProcess | undefined;
let shuttingDown = false;

function killChildren(signal: NodeJS.Signals = "SIGTERM"): void {
  for (const child of children) {
    child.kill(signal);
  }
  trueforge?.kill(signal);
}

function shutdown(exitCode = 1): void {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  killChildren("SIGTERM");
  process.exit(exitCode);
}

for (const child of children) {
  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      return;
    }
    process.stderr.write(`Sidecar exited unexpectedly code=${code} signal=${signal}\n`);
    shutdown(code && code > 0 ? code : 1);
  });
}

await waitForHealth(healthUrl);

trueforge = spawn("trueforge", [], { stdio: "inherit", env: process.env });

function forward(signal: NodeJS.Signals): void {
  shuttingDown = true;
  killChildren(signal);
}

process.on("SIGTERM", () => forward("SIGTERM"));
process.on("SIGINT", () => forward("SIGINT"));

trueforge.on("exit", (code) => {
  if (shuttingDown) {
    process.exit(code ?? 1);
    return;
  }
  shuttingDown = true;
  killChildren("SIGTERM");
  process.exit(code ?? 1);
});
