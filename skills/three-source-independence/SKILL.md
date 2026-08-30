---
name: three-source-independence
description: Require analytics, logs, and deploy timeline as independent evidence before naming a root cause. Refuse when the three reports restate one query.
---

# Three-source independence

LOOP may name a root cause only after three **independent** sources agree they are talking about the same incident, not the same sentence.

## Spawn, don't self-investigate

The first action of an investigation is always to spawn three named one-level subagents: analytics, logs, deploys. The root must not call warehouse tools itself. Spawn no other subagent — never a fourth, never a `patcher`. Subagents cannot ask the user. Subagents must not call loop-github tools.

Spawn one-level subagents:

1. **analytics** — funnel, segment, metric, when it moved. Use `query_analytics`.
2. **logs** — error class, file, route, first seen. Use `query_logs`.
3. **deploys** — service, time, version, commit. Use `query_deploys`.

Give each subagent a *different question*. "What broke checkout?" three times is one query.

Subagents cannot ask the user questions. They return evidence only.

## Independent vs collapsed

Independent evidence means each source adds facts the others do not:

| Source | Must contribute |
| --- | --- |
| analytics | metric, broken funnel step, affected segment |
| logs | error, code path, timestamp, count |
| deploys | service, release time, version/commit |

Collapsed means the three summaries could be swapped without losing information (same claim, same evidence id, high overlap). Example: "checkout is broken so conversion dropped" in all three.

## If they collapse

Refuse a root cause. Say so plainly. Do not patch. Do not open a PR. Ask for better source access or stop.

## If they are independent

Synthesize. Name the causal chain (deploy → log signature → funnel step). Then follow type-a-vs-b on the **root** thread.
