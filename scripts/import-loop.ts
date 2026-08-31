import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TrueForge } from "@truefoundry/trueforge-sdk";
import type { SavedAgent } from "../src/spec.js";
import { hostedModelGuard, validateLoopAgent } from "../src/spec.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadDotEnv(path: string): void {
  if (!existsSync(path)) {
    return;
  }
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq <= 0) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadDotEnv(join(root, ".env"));

function requiredHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "content-type": "application/json" };
  const token = process.env.TRUEFORGE_TOKEN;
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  return headers;
}

async function putSettings(baseUrl: string, path: string, body: unknown): Promise<unknown> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "PUT",
    headers: requiredHeaders(),
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${path} ${response.status}: ${text.slice(0, 500)}`);
  }
  return text ? JSON.parse(text) : {};
}

function redacted(ok: boolean): string {
  return ok ? "present (not printed)" : "missing";
}

async function registerOpenAI(baseUrl: string): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    process.stdout.write("OpenAI provider: skipped (OPENAI_API_KEY unset)\n");
    return;
  }
  const modelId = process.env.OPENAI_MODEL_ID ?? "gpt-5.6-luna";
  const modelName = process.env.OPENAI_MODEL_NAME ?? "gpt-5-6-luna";
  await putSettings(baseUrl, "/api/v1/settings/model-providers", {
    manifest: {
      type: "openai",
      auth: { api_key: apiKey },
      models: [
        {
          model_id: modelId,
          name: modelName,
          properties: { context_length: 400000, max_output_tokens: 16384 },
        },
      ],
    },
  });
  process.stdout.write(`OpenAI provider: upserted as openai/${modelName} (key ${redacted(true)})\n`);
}

async function registerOpenRouter(baseUrl: string): Promise<void> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    process.stdout.write("OpenRouter provider: skipped (OPENROUTER_API_KEY unset)\n");
    return;
  }
  const modelId = process.env.OPENROUTER_MODEL_ID ?? "openai/gpt-4.1-mini";
  const modelName = process.env.OPENROUTER_MODEL_NAME ?? "gpt-4.1-mini";
  await putSettings(baseUrl, "/api/v1/settings/model-providers", {
    manifest: {
      type: "custom",
      name: "openrouter",
      base_url: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
      auth: { api_key: apiKey },
      models: [
        {
          model_id: modelId,
          name: modelName,
          properties: { context_length: 128000, max_output_tokens: 16384 },
        },
      ],
    },
  });
  process.stdout.write(`OpenRouter provider: upserted as openrouter/${modelName} (key ${redacted(true)})\n`);
}

async function registerNvidia(baseUrl: string): Promise<void> {
  const apiKey = process.env.NVIDIA_API_KEY;
  const modelId = process.env.NVIDIA_MODEL_ID;
  const modelName = process.env.NVIDIA_MODEL_NAME;
  if (!apiKey || !modelId || !modelName) {
    process.stdout.write("NVIDIA NIM provider: skipped (set NVIDIA_API_KEY, NVIDIA_MODEL_ID, NVIDIA_MODEL_NAME to use)\n");
    return;
  }
  await putSettings(baseUrl, "/api/v1/settings/model-providers", {
    manifest: {
      type: "custom",
      name: "nvidia-nim",
      base_url: process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1",
      auth: { api_key: apiKey },
      models: [{ model_id: modelId, name: modelName, properties: {} }],
    },
  });
  process.stdout.write(`NVIDIA NIM provider: upserted as nvidia-nim/${modelName} (key ${redacted(true)})\n`);
}


async function registerDaytona(baseUrl: string): Promise<void> {
  const apiKey = process.env.DAYTONA_API_KEY;
  if (!apiKey) {
    process.stdout.write("Daytona sandbox: skipped (DAYTONA_API_KEY unset — set it in Settings → Sandbox)\n");
    return;
  }
  try {
    await putSettings(baseUrl, "/api/v1/settings/sandbox-providers", {
      manifest: {
        type: "daytona",
        auth: { api_key: apiKey },
        exec_timeout_ms: 120000,
        auto_stop_interval_in_minutes: 15,
        auto_archive_interval_in_minutes: 60,
        auto_delete_interval_in_minutes: 1440,
      },
    });
    process.stdout.write(`Daytona sandbox: upserted (key ${redacted(true)})\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Daytona sandbox: failed (key not printed): ${message}\n`);
    process.stderr.write("Continue in Settings → Sandbox. Key needs snapshot write permission.\n");
  }
}

/** Log-safe URL: drop userinfo and query so connector credentials never hit stdout. */
function redactUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.username = "";
    parsed.password = "";
    parsed.search = "";
    return parsed.toString();
  } catch {
    return "[unparseable-url]";
  }
}

async function registerMcp(baseUrl: string, name: string, url: string, description: string): Promise<void> {
  await putSettings(baseUrl, "/api/v1/settings/mcp-servers", {
    manifest: { type: "remote", name, url, description },
  });
  process.stdout.write(`MCP ${name}: ${redactUrl(url)}\n`);
}

async function registerSkill(
  baseUrl: string,
  name: string,
  path: string,
  description: string,
): Promise<void> {
  await putSettings(baseUrl, "/api/v1/settings/skills", {
    manifest: {
      type: "git",
      name,
      url: process.env.LOOP_SKILL_REPO ?? "https://github.com/saurabh4269/wemakedevs_agent_harness",
      ref: process.env.LOOP_SKILL_REF ?? "main",
      path,
      description,
    },
  });
  process.stdout.write(`Skill ${name}: ${path} @ ${process.env.LOOP_SKILL_REF ?? "main"}\n`);
}

async function findAgentId(client: TrueForge, name: string): Promise<string | undefined> {
  const listed = await client.agents.list();
  const maybeData = listed as { data?: Array<{ id: string; name: string }> };
  if (Array.isArray(maybeData.data)) {
    return maybeData.data.find((row) => row.name === name)?.id;
  }
  if (listed && typeof listed === "object" && Symbol.asyncIterator in listed) {
    for await (const row of listed as AsyncIterable<{ id: string; name: string }>) {
      if (row.name === name) {
        return row.id;
      }
    }
  }
  return undefined;
}

async function main(): Promise<void> {
  const baseUrl = (process.env.TRUEFORGE_BASE_URL ?? "http://localhost:8790").replace(/\/$/, "");
  const raw = JSON.parse(readFileSync(join(root, "agents/loop.json"), "utf8")) as SavedAgent;
  const modelFqn = process.env.LOOP_MODEL_FQN;
  if (modelFqn) {
    raw.manifest.model.name = modelFqn;
  }

  const hostedGuard = hostedModelGuard(baseUrl, raw.manifest.model.name, {
    modelId: process.env.OPENAI_MODEL_ID,
    modelName: process.env.OPENAI_MODEL_NAME,
  });
  if (hostedGuard) {
    throw new Error(hostedGuard);
  }

  const issues = validateLoopAgent(raw);
  if (issues.length > 0) {
    throw new Error(`loop spec invalid:\n${issues.map((issue) => `- ${issue.path}: ${issue.message}`).join("\n")}`);
  }

  const client = new TrueForge({
    baseUrl,
    timeoutInSeconds: 60,
    ...(process.env.TRUEFORGE_TOKEN ? { token: process.env.TRUEFORGE_TOKEN } : {}),
  });

  process.stdout.write(`TrueForge: ${baseUrl}\n`);
  await registerOpenAI(baseUrl);
  await registerOpenRouter(baseUrl);
  await registerNvidia(baseUrl);
  await registerDaytona(baseUrl);

  const warehouseUrl = process.env.LOOP_WAREHOUSE_URL ?? "http://127.0.0.1:8788/warehouse";
  const githubUrl = process.env.LOOP_GITHUB_URL ?? "http://127.0.0.1:8788/github";
  await registerMcp(
    baseUrl,
    "loop-warehouse",
    warehouseUrl,
    "LOOP fixture warehouse: analytics, logs, deploys (mode:fixture, read-only)",
  );
  await registerMcp(
    baseUrl,
    "loop-github",
    githubUrl,
    "LOOP fixture GitHub writes (mode:fixture). @write/@destructive pause. Never merge. Never prod-deploy.",
  );

  await registerSkill(
    baseUrl,
    "three-source-independence",
    "skills/three-source-independence",
    "Refuse a root cause unless analytics, logs, and deploys are independent.",
  );
  await registerSkill(
    baseUrl,
    "type-a-vs-b",
    "skills/type-a-vs-b",
    "Type A break → sandbox patch. Type B opportunity → proposal. Then measure and lesson.",
  );
  await registerSkill(
    baseUrl,
    "license-to-write",
    "skills/license-to-write",
    "GitHub write / flag / prod deploy pause for a human. Never merge. Never prod-deploy the tenant.",
  );

  const existingId = await findAgentId(client, raw.name);
  if (existingId) {
    await client.agents.update(existingId, { manifest: raw.manifest });
    process.stdout.write(`Agent loop updated (${existingId})\n`);
  } else {
    try {
      const created = await client.agents.create({ name: raw.name, manifest: raw.manifest });
      const id = (created as { data?: { id?: string } }).data?.id ?? "created";
      process.stdout.write(`Agent loop created (${id})\n`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("409") && !message.toLowerCase().includes("already")) {
        throw error;
      }
      const retryId = await findAgentId(client, raw.name);
      if (!retryId) {
        throw error;
      }
      await client.agents.update(retryId, { manifest: raw.manifest });
      process.stdout.write(`Agent loop updated after create conflict (${retryId})\n`);
    }
  }

  process.stdout.write(
    "Next: open TrueForge chat, pick agent loop, send the conversion-drop prompt in the README.\n",
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
