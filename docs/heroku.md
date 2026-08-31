# Host LOOP on Heroku

Render free is exhausted for this month. Judge URL stays **https://loop.heisenbug.in**. Only change the Cloudflare CNAME `loop`. **Never touch** `heisenbug.in` apex or `www` (Vercel).

Secrets stay in `heroku config`. Never commit `.env`. Do not paste keys into the repo.

Image deploy does **not** re-import the agent by itself. Prefer **porting Render Postgres** (section 6) so the LOOP agent, connectors, Daytona, and sessions come with you. Skip Redis. Fallback if the dump fails: empty Heroku Postgres + `import-loop.ts`.

## What you are standing up

Same topology as Render: one web process, Postgres, Redis, fixture MCP colocated on `127.0.0.1:8788`.

| Piece | Heroku |
| --- | --- |
| Web | container dyno from `deploy/trueforge.Dockerfile` (`heroku.yml`) |
| Postgres | `heroku-postgresql:essential-0` → `DATABASE_URL` (mapped to `POSTGRES_*` at boot) |
| Redis | `heroku-redis:mini` → `REDIS_URL` |
| Public origin | `PUBLIC_BASE_URL=https://loop.heisenbug.in` |
| Fallback host | `https://<app>.herokuapp.com` |

Use **Basic** (or Standard-1X), not Eco. Eco sleeps like Render free. Credits cover Basic.

## 1. CLI (once)

You need **both** CLIs if you are porting Render Postgres: Heroku for the new host, Render for the external DB URL.

```bash
# macOS
brew tap heroku/brew && brew install heroku
# Render CLI: https://render.com/docs/cli (already installed is fine)

heroku login
heroku container:login
render login   # if not already
```

## 2. App + addons

Pick an app name that contains `loop` (import treats `*.herokuapp.com` hosts with `loop` in the name as the judge host). If `loop-trueforge` is taken, use `loop-trueforge-thexplorers`.

```bash
APP=loop-trueforge   # or loop-trueforge-thexplorers
heroku create "$APP" --region us
heroku stack:set container -a "$APP"
heroku dyno:resize web=basic -a "$APP"

heroku addons:create heroku-postgresql:essential-0 --version 17 -a "$APP"
heroku addons:create heroku-redis:mini -a "$APP"
```

Essential-0 / mini are the cheap credit-friendly plans. Do not attach a production-tier database for this demo. **`--version 17`** matches Render (`render.yaml` `postgresMajorVersion: "17"`). A 17→16 restore often fails.

## 3. Config (no secrets in git)

Copy keys from the Render dashboard (`sync: false`) into Heroku. Do not print them in chat.

```bash
heroku config:set -a "$APP" \
  STANDALONE=false \
  HOST=0.0.0.0 \
  NODE_ENV=production \
  LOOP_FIXTURE_PORT=8788 \
  PUBLIC_BASE_URL=https://loop.heisenbug.in \
  PGSSLMODE=require \
  OPENROUTER_BASE_URL=https://openrouter.ai/api/v1 \
  NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1

heroku config:set -a "$APP" OPENAI_API_KEY=...     # from Render / box secrets
heroku config:set -a "$APP" DAYTONA_API_KEY=...
heroku config:set -a "$APP" DAYTONA_API_URL=https://app.daytona.io/api
```

`DATABASE_URL` and `REDIS_URL` are set by the addons. Boot maps `DATABASE_URL` → `POSTGRES_*` and `REDIS_TLS_URL` → `REDIS_URL` if needed (`src/hosted-env.ts`).

OIDC stays unset (no-login judges). Anyone who can reach the host is admin — same tradeoff as Render.

## 4. Deploy this repo

`heroku.yml` builds `Dockerfile` at the **repo root** (Heroku sets the Docker build context to the Dockerfile’s directory). Keep root `Dockerfile` identical to `deploy/trueforge.Dockerfile` (Render still uses the `deploy/` path). The image installs `ca-certificates` for Postgres TLS.

Heroku Redis mini TLS still fails Node’s default verify. Set once:

```bash
heroku config:set NODE_TLS_REJECT_UNAUTHORIZED=0 -a "$APP"
```

From a clone of `main` (Docker Desktop / buildx often rejects plain `docker push` to `registry.heroku.com` with `unsupported` — use Docker media types):

```bash
heroku container:login
docker buildx build \
  --platform linux/amd64 \
  --provenance=false --sbom=false \
  --output "type=image,name=registry.heroku.com/$APP/web:latest,push=true,oci-mediatypes=false,compression=gzip,force-compression=true" \
  -f Dockerfile .
heroku container:release web -a "$APP"
heroku ps:scale web=1 -a "$APP"
heroku dyno:resize web=basic -a "$APP"
```

`git push heroku main` also works once root `Dockerfile` is on `main`. Or dashboard: Deploy → GitHub → `saurabh4269/wemakedevs_agent_harness` → auto-deploy `main`.

Wake check (Heroku injects `PORT`; use the Web URL from `heroku apps:info` if the short `*.herokuapp.com` name does not resolve):

```bash
curl -sS "https://$APP.herokuapp.com/healthz"
# expect: OK!
```

## 5. Point `loop.heisenbug.in` at Heroku

```bash
heroku domains:add loop.heisenbug.in -a "$APP"
heroku domains -a "$APP"
heroku certs:auto:enable -a "$APP"   # ACM; often already on
```

In **Cloudflare** (zone `heisenbug.in` only):

1. Edit the existing CNAME **`loop`**.
2. Target: the `herokudns.com` (or `herokuapp.com`) hostname `heroku domains` printed. Not apex.
3. Proxy: **DNS only** (grey cloud), same as today.
4. Do **not** edit `@` or `www`.

Wait until TLS is ready (`heroku certs -a "$APP"`). Then:

```bash
curl -sS https://loop.heisenbug.in/healthz
```

Leave the old Render `onrender.com` hostname alone until this curl is 200. Then you can stop the Render **web** service so it stops burning a dead free quota. Keep Render **Postgres** until you have verified the Heroku restore. Do not Apply `render.yaml`.

## 6. Port Render Postgres (do this; skip Redis)

TrueForge keeps the product in **Postgres**: agent `loop`, model providers (API keys), MCP connectors, skills, Daytona sandbox providers, sessions. **Redis is only executor peering** — leave it empty on Heroku.

The dump **contains secrets**. Put it in `/tmp`, mode 600. Never `git add` it. Never upload it to a public S3 URL. Never paste connection strings into the repo or chat.

Dump **first**, while Render Postgres is still up (the free **web** quota can be exhausted and the database still accepts external connections).

### 6a. Connection strings (assign, do not echo)

Use Render’s **external** URL. The internal URL (`*.internal`) is unreachable from a laptop. Database name is `trueforge`. Append `sslmode=require` if missing.

Dashboard: Postgres **`loop-postgres`** (`dpg-daaa7k4s728c73fr0feg-a`) → Connect → **External Database URL**.

CLI (do not paste the output into chat or git):

```bash
# Assign, do not echo. Prefer the externalConnectionString field.
render pg get dpg-daaa7k4s728c73fr0feg-a --include-sensitive-connection-info
```

```bash
# Do not print these.
export RENDER_DATABASE_URL='postgresql://USER:PASS@HOST:PORT/trueforge?sslmode=require'
export APP=loop-trueforge   # your Heroku app
export HEROKU_DATABASE_URL="$(heroku config:get DATABASE_URL -a "$APP")"
```

Match **Postgres major version**. Render is 17. Heroku addon create in section 2 already passes `--version 17`.

### 6b. Preferred: `heroku pg:push` (no dump file)

Destroys whatever is already on Heroku Postgres (empty is fine). Laptop must reach Render's **external** URL.

```bash
heroku pg:push "$RENDER_DATABASE_URL" DATABASE_URL -a "$APP"
```

### 6c. Fallback: local custom dump → `pg_restore`

Do **not** use `-n public` only. Dump the whole database (TrueForge may use more than `public`).

```bash
DUMP=/tmp/loop-trueforge.dump
rm -f "$DUMP"
pg_dump --format=custom --no-owner --no-acl --dbname="$RENDER_DATABASE_URL" -f "$DUMP"
chmod 600 "$DUMP"

pg_restore --verbose --no-owner --no-acl --clean --if-exists \
  --dbname="$HEROKU_DATABASE_URL" \
  "$DUMP"

shred -u "$DUMP" 2>/dev/null || rm -f "$DUMP"
```

Do **not** `heroku pg:backups:restore` from a public HTTP URL. That dump has provider keys.

### 6d. After restore

1. Boot / restart the web dyno so TrueForge can `migrateToLatest` on the copied schema.
2. Optional: run `import-loop.ts` against https://loop.heisenbug.in with Luna env vars. That **upserts** agent `loop` and skills from git (good). It does not replace the whole database.
3. In Settings: Daytona still **ready**; warehouse/github still `http://127.0.0.1:8788/warehouse` and `.../github`.
4. Hosted session IDs (including Luna PASS `01m1b50dbbh3vgy6brbaw5vsaz`) can survive **if** this restore worked and DNS still points at a host with that Postgres. Do not Approve/Deny listed film sessions.

If `pg_dump` cannot reach Render (DB suspended with the free web), fall back to empty Heroku Postgres + section 7.

## 7. Fallback only — empty Postgres + re-import

```bash
export TRUEFORGE_BASE_URL=https://loop.heisenbug.in
export LOOP_MODEL_FQN=openai/gpt-5-6-luna
export OPENAI_MODEL_ID=gpt-5.6-luna
export OPENAI_MODEL_NAME=gpt-5-6-luna
export LOOP_SKILL_REF=main
export LOOP_WAREHOUSE_URL=http://127.0.0.1:8788/warehouse
export LOOP_GITHUB_URL=http://127.0.0.1:8788/github
npx tsx scripts/import-loop.ts
```

`OPENAI_API_KEY` and `DAYTONA_API_KEY` must be in the environment for that import (judge-host guard). The script never prints them.

Then in TrueForge Settings, confirm Daytona is **ready** and MCP warehouse/github point at in-container `127.0.0.1:8788`.

## 8. Qualifying after the move

If section 6 restore worked, hosted session IDs can still exist on the new Postgres. Do not Approve/Deny listed film sessions. If restore failed and you used empty import, film/qualify again on Heroku.

## Do not

- Put `HEROKU_API_KEY` in git or a GitHub Action.
- Apply `render.yaml` on workspace `tea-ctoktrjtq21c73cufog0`.
- Touch Cloudflare `@` / `www`.
- Use Eco dynos if you can avoid sleep before a judge demo.
- Echo `/home/box/.secrets/loop-trueforge.env`.
- Commit `/tmp/loop-trueforge.dump` or any `*.dump`.
- Restore via a public HTTP URL (`heroku pg:backups:restore` from S3).
