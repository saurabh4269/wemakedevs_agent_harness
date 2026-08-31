---
name: three-source-independence
description: Require analytics, logs, and deploy timeline as independent evidence before naming a root cause. Refuse when the three reports restate one query.
---

# Three-source independence

LOOP may name a root cause only after three **independent** sources agree they are talking about the same incident, not the same sentence.

## Spawn, don't self-investigate

The first action of an investigation is always to spawn three named one-level subagents: analytics, logs, deploys. The root must not call warehouse tools itself. Repeat: the root never calls `query_analytics`, `query_logs`, or `query_deploys` as direct tool calls. Spawn no other subagent — never a fourth, never a `patcher`. Subagents cannot ask the user. Subagents must not call loop-github tools.

Spawn one-level subagents with these exact questions:

1. **analytics** — Call `query_analytics` once. Return evidence_id, unique_facts, summary. Do not call `get_current_datetime`, `exec`, or any other tool.
2. **logs** — Call `query_logs` once. Return evidence_id, unique_facts, summary. Do not call `get_current_datetime`, `exec`, or any other tool.
3. **deploys** — Call `query_deploys` once. Return evidence_id, unique_facts, summary, still_true. Do not call `get_current_datetime`, `exec`, or any other tool.

Give each subagent a *different question*. "What broke checkout?" three times is one query. Extra tools on a subagent waste tokens and flake the free model.

Subagents cannot ask the user questions. They return evidence only.

## Independent vs collapsed

Independent evidence means each source adds facts the others do not:

| Source | Must contribute |
| --- | --- |
| analytics | metric, broken funnel step, affected segment |
| logs | error, code path, timestamp, count |
| deploys | service, release time, version/commit |

Collapsed means the three summaries could be swapped without losing information (same claim, same evidence id, high overlap). Example: "checkout is broken so conversion dropped" in all three.

If `deploys.still_true` is **false**, the brief is stale (SHA or plan catalog no longer matches). Refuse a root cause. Do not patch. Do not open a PR.

## If they collapse

Refuse a root cause. Say so plainly. Do not patch. Do not open a PR. Do not call `ask_user_question`. Stop.

## If they are independent

Synthesize. Name the causal chain (deploy → log signature → funnel step).

Then, on the **root** thread (still no direct `query_*`):

1. Emit TrueForge generative UI (OpenUI). `config.generative_ui.enabled` is already true. One fenced `openui` block with **one chart**, **one table**, and **one Type A/B card** from this independence check. Cite each `evidence_id` on the card. Example shape:

````
```openui
root = Stack([typeCard, chart, table])
typeCard = Card([TextContent("Type A — break", "large-heavy"), TextContent("Independent. Cite funnel-cta-desktop-chrome, invalid-plan-id-checkout-ts, catalog-v3-rollout.", "small")])
chart = BarChart(["before", "after"], [Series("checkout_conversion %", [4.2, 3.4])], "grouped", "Window", "Rate")
table = Table([Col("Source", ["analytics", "logs", "deploys"]), Col("Fact", ["metric + segment", "error + path", "service + version"]), Col("Evidence", ["funnel-cta-desktop-chrome", "invalid-plan-id-checkout-ts", "catalog-v3-rollout"])])
```
````

2. For aggregations (error rates, group-bys, deploy grouping), use **Code Mode** in the Daytona sandbox. Write Python that uses `mcp_client.call_tool` against `loop-warehouse` read-only tools, group in code, print a short table. Counts from code, not from the model. Do **not** put `open_draft_pr`, `flag_incident`, or `request_prod_deploy` in that script. Code Mode is not permission for the root to call `query_*` as direct tool calls.

Then follow type-a-vs-b on the **root** thread.
