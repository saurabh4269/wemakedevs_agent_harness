/**
 * Map PaaS env (Heroku DATABASE_URL / REDIS_TLS_URL) onto what TrueForge
 * 0.1.4 reads (POSTGRES_* + REDIS_URL). Never log the URL.
 */
export type PostgresParts = {
  host: string;
  port: string;
  user: string;
  password: string;
  database: string;
};

export function parsePostgresUrl(raw: string): PostgresParts {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("DATABASE_URL is not a valid URL");
  }
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error("DATABASE_URL must be a postgres URL");
  }
  const database = decodeURIComponent(url.pathname.replace(/^\//, "").split("/")[0] ?? "");
  if (!url.hostname || !database) {
    throw new Error("DATABASE_URL is missing host or database");
  }
  return {
    host: url.hostname,
    port: url.port || "5432",
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
  };
}

export function withSslMode(raw: string): string {
  if (/[?&]sslmode=/i.test(raw)) {
    return raw;
  }
  return raw.includes("?") ? `${raw}&sslmode=require` : `${raw}?sslmode=require`;
}

/**
 * Mutates `env` in place and returns it. Safe to call on Render (already has
 * POSTGRES_*) and Heroku (DATABASE_URL + REDIS_URL).
 */
export function applyHostedPlatformEnv(env: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  const databaseUrl = env.DATABASE_URL?.trim();
  if (databaseUrl) {
    env.DATABASE_URL = withSslMode(databaseUrl);
    if (!env.POSTGRES_HOST?.trim()) {
      const parts = parsePostgresUrl(databaseUrl);
      env.POSTGRES_HOST = parts.host;
      env.POSTGRES_PORT = parts.port;
      env.POSTGRES_USER = parts.user;
      env.POSTGRES_PASSWORD = parts.password;
      env.POSTGRES_DB = parts.database;
    }
    env.PGSSLMODE = env.PGSSLMODE?.trim() || "require";
  }

  if (!env.REDIS_URL?.trim() && env.REDIS_TLS_URL?.trim()) {
    env.REDIS_URL = env.REDIS_TLS_URL.trim();
  }

  env.HOST = env.HOST?.trim() || "0.0.0.0";
  env.STANDALONE = env.STANDALONE?.trim() || "false";
  env.LOOP_FIXTURE_PORT = env.LOOP_FIXTURE_PORT?.trim() || "8788";
  return env;
}
