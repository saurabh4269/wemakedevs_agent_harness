# Host LOOP on Heroku

Render free is exhausted for this month. Judge URL stays **https://loop.heisenbug.in**. Only change the Cloudflare CNAME `loop`. **Never touch** `heisenbug.in` apex or `www` (Vercel).

Secrets stay in `heroku config`. Never commit `.env`. Do not paste keys into the repo.

Image deploy does **not** re-import the agent. After the dyno is up, run `import-loop.ts` against the judge URL with Luna env vars (same as Render).

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

```bash
# macOS
brew tap heroku/brew && brew install heroku

heroku login
heroku container:login
```

## 2. App + addons

Pick an app name that contains `loop` (import treats `*.herokuapp.com` hosts with `loop` in the name as the judge host). If `loop-trueforge` is taken, use `loop-trueforge-thexplorers`.

```bash
APP=loop-trueforge   # or loop-trueforge-thexplorers
heroku create "$APP" --region us
heroku stack:set container -a "$APP"
heroku dyno:resize web=basic -a "$APP"

heroku addons:create heroku-postgresql:essential-0 -a "$APP"
heroku addons:create heroku-redis:mini -a "$APP"
```

Essential-0 / mini are the cheap credit-friendly plans. Do not attach a production-tier database for this demo.

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

From a clone of `main` (or this branch until it merges):

```bash
heroku git:remote -a "$APP"
heroku container:push web -a "$APP"
heroku container:release web -a "$APP"
heroku ps:scale web=1 -a "$APP"
heroku logs --tail -a "$APP"
```

Or in the Heroku dashboard: Deploy → GitHub → `saurabh4269/wemakedevs_agent_harness` → enable automatic deploys from `main`. Container stack reads `heroku.yml`.

Wake check (Heroku injects `PORT`):

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

Leave the old Render `onrender.com` hostname alone until this curl is 200. Then you can stop the Render web service so it stops burning a dead free quota. Do not Apply `render.yaml`.

## 6. Re-import LOOP

Postgres is empty. The Render agent does not copy over. From the box, with secrets **sourced not echoed**:

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

## 7. Qualifying after the move

Old Render session URLs die with the old Postgres. Film/qualify again on the new host if you need a sitting pause. Do not Approve/Deny the listed local film session.

## Do not

- Put `HEROKU_API_KEY` in git or a GitHub Action.
- Apply `render.yaml` on workspace `tea-ctoktrjtq21c73cufog0`.
- Touch Cloudflare `@` / `www`.
- Use Eco dynos if you can avoid sleep before a judge demo.
- Echo `/home/box/.secrets/loop-trueforge.env`.
