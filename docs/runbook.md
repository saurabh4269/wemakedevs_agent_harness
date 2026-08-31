# Runbook

Full commands live in the root [README.md](../README.md) (local install, fixture MCP, import, demo prompt) and [AGENTS.md](../AGENTS.md) (hosted deploy + import caveats). Pitfalls: [learnings.md](learnings.md). Live IDs: [status.md](status.md).

## Where things are

- Local film host: TrueForge on `[::1]:8790`. Do not kill. Do not Approve session `01m1a87xjewncn310ymqy3yz01`.
- Judge host: https://loop.heisenbug.in (fallback https://loop-trueforge.onrender.com).
- Render service `loop-trueforge` (`srv-daaaa65g1s2s73cjsq0g`) tracks `main` with `autoDeployTrigger: commit`. Merge to main deploys the image. Do not Apply the Blueprint on workspace `tea-ctoktrjtq21c73cufog0`.
- Wake: `GET /healthz` → `OK!`. Cold start about 30s.
- Image deploy does not re-import LOOP. After `agents/loop.json` or skills change, import against the judge URL with the Nemotron `:free` model env vars listed in [learnings.md](learnings.md) item 12. `import-loop.ts` defaults to `gpt-4.1-mini` without them.
- Secrets: `/home/box/.secrets/loop-trueforge.env`. Never echo. Never commit.
- DNS: CNAME `loop` on `heisenbug.in` only. Never touch apex or `www`.
