import { describe, expect, it } from "vitest";
import { applyHostedPlatformEnv, parsePostgresUrl, withSslMode } from "../src/hosted-env.js";

describe("hosted platform env", () => {
  it("parses a Heroku-style DATABASE_URL without logging it", () => {
    const parts = parsePostgresUrl("postgres://tf_user:p%40ss@ec2-1-2-3-4.compute.amazonaws.com:5432/d123");
    expect(parts).toEqual({
      host: "ec2-1-2-3-4.compute.amazonaws.com",
      port: "5432",
      user: "tf_user",
      password: "p@ss",
      database: "d123",
    });
  });

  it("rejects a non-postgres URL", () => {
    expect(() => parsePostgresUrl("redis://localhost:6379")).toThrow(/postgres URL/);
  });

  it("appends sslmode=require once", () => {
    expect(withSslMode("postgres://u:p@h:5432/db")).toBe("postgres://u:p@h:5432/db?sslmode=require");
    expect(withSslMode("postgres://u:p@h:5432/db?sslmode=require")).toBe(
      "postgres://u:p@h:5432/db?sslmode=require",
    );
  });

  it("fills POSTGRES_* from DATABASE_URL and keeps the fixture on 8788", () => {
    const env: NodeJS.ProcessEnv = {
      DATABASE_URL: "postgres://tf:secret@db.example:6543/trueforge",
      REDIS_TLS_URL: "rediss://:redis-pass@redis.example:6380",
    };
    applyHostedPlatformEnv(env);
    expect(env.POSTGRES_HOST).toBe("db.example");
    expect(env.POSTGRES_PORT).toBe("6543");
    expect(env.POSTGRES_USER).toBe("tf");
    expect(env.POSTGRES_PASSWORD).toBe("secret");
    expect(env.POSTGRES_DB).toBe("trueforge");
    expect(env.REDIS_URL).toBe("rediss://:redis-pass@redis.example:6380");
    expect(env.PGSSLMODE).toBe("require");
    expect(env.HOST).toBe("0.0.0.0");
    expect(env.STANDALONE).toBe("false");
    expect(env.LOOP_FIXTURE_PORT).toBe("8788");
    expect(env.DATABASE_URL).toMatch(/sslmode=require/);
  });

  it("does not clobber Render POSTGRES_HOST when both are set", () => {
    const env: NodeJS.ProcessEnv = {
      DATABASE_URL: "postgres://ignored:x@other:5432/other",
      POSTGRES_HOST: "loop-postgres",
      POSTGRES_PORT: "5432",
      POSTGRES_USER: "trueforge",
      POSTGRES_PASSWORD: "from-render",
      POSTGRES_DB: "trueforge",
    };
    applyHostedPlatformEnv(env);
    expect(env.POSTGRES_HOST).toBe("loop-postgres");
    expect(env.POSTGRES_PASSWORD).toBe("from-render");
  });
});
