# Runbook

Full commands live in the root [README.md](../README.md) (local install, fixture MCP, import, demo prompt) and [AGENTS.md](../AGENTS.md) (hosted deploy + import caveats). Pitfalls: [learnings.md](learnings.md). Live IDs: [status.md](status.md).

## Where things are

- Local film host: TrueForge on `[::1]:8790`. Do not kill. Do not Approve session `01m1a87xjewncn310ymqy3yz01`.
- Judge host: https://loop.heisenbug.in. **Heroku** is the live host while Render free is exhausted. Stand-up: [heroku.md](heroku.md).
- Render service `loop-trueforge` (`srv-daaaa65g1s2s73cjsq0g`) is the previous host. Do not Apply the Blueprint on workspace `tea-ctoktrjtq21c73cufog0`.
- Wake: `GET /healthz` → `OK!`.
- Image deploy does not re-import LOOP. After `agents/loop.json` or skills change, import against the judge URL with `LOOP_MODEL_FQN=openai/gpt-5-6-luna` and `OPENAI_MODEL_ID` / `OPENAI_MODEL_NAME`. `import-loop.ts` refuses a judge-host import that is not that FQN.
- Secrets: `/home/box/.secrets/loop-trueforge.env`. Never echo. Never commit. Heroku: `heroku config` only.
- DNS: CNAME `loop` on `heisenbug.in` only. Never touch apex or `www`. After Heroku ACM, that CNAME target is the hostname from `heroku domains`, not Render.
