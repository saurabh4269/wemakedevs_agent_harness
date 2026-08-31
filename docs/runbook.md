# Runbook

Full commands live in the root [README.md](../README.md) (local install, fixture MCP, import, demo prompt) and [AGENTS.md](../AGENTS.md) (hosted deploy + import caveats). Pitfalls: [learnings.md](learnings.md). Live IDs: [status.md](status.md).

## Where things are

- Local film host: TrueForge on `[::1]:8790`. Do not kill. Do not Approve session `01m1a87xjewncn310ymqy3yz01`.
- Judge host: https://loop.heisenbug.in. **Heroku app `loop-trueforge`** is the live host. Stand-up: [heroku.md](heroku.md). Fallback while DNS catches up: https://loop-trueforge-17da5f0d6aa2.herokuapp.com.
- Render web `loop-trueforge` (`srv-daaaa65g1s2s73cjsq0g`) is suspended (billing). Do not Apply the Blueprint on workspace `tea-ctoktrjtq21c73cufog0`. Render Postgres was ported; keep it until you no longer need a re-dump.
- Wake: `GET /healthz` → `OK!` (confirmed on the herokuapp URL).
- Image deploy does not re-import LOOP. Postgres was ported ([heroku.md](heroku.md) §6); Redis skipped. After `agents/loop.json` or skills change, optional import against the judge URL with `LOOP_MODEL_FQN=openai/gpt-5-6-luna` and `OPENAI_MODEL_ID` / `OPENAI_MODEL_NAME`. `import-loop.ts` refuses a judge-host import that is not that FQN.
- Secrets: `/home/box/.secrets/loop-trueforge.env`. Never echo. Never commit. Heroku: `heroku config` only (`NODE_TLS_REJECT_UNAUTHORIZED=0` for Redis TLS).
- DNS: CNAME `loop` on `heisenbug.in` only → Heroku DNS target from `heroku domains` (currently `developmental-anteater-y5490gf0d9oxp62bi3yra5aa.herokudns.com`). Never touch apex or `www`.
