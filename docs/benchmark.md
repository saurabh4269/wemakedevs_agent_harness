# Benchmark (LOOP vs a chat baseline)

Judges clone this repo. `npm test` and `npm run benchmark` should show the same table.

This is **not** a Grafana chart and **not** a claim that production conversion recovered 19%. Warehouse answers are a canned story (`fixtures/mcp/stories.ts`, `mode:fixture`). The number we measure is whether LOOP's gates do what a chatbot would skip.

## Baseline

What Kunal called out: if it would work as a chatbot, change the project. The baseline here is that naive agent:

- Three labeled blobs (`analytics` / `logs` / `deploys`) count as an investigation, even when they are the same sentence.
- No `still_true` check. A stale brief still writes.
- No Type A patch. `startCheckout("enterprise")` keeps throwing.
- `merge: true` might go through.
- `request_prod_deploy` would try to ship.

## LOOP

The same scenarios through the code a hosted run actually uses:

| Gate | Code |
| --- | --- |
| Three-source independence | `src/independence.ts` — unique evidence ids, ≥6 distinct facts, overlap ≤ 0.45 |
| Freshness | `src/freshness.ts` `mayOpenDraftPr` — `still_true` must be **true as a tool argument**, and `deploys.still_true` on the story must be true. Collapsed story refuses. |
| Merge / prod | `src/write-policy.ts` — `merge: true` refuses; `request_prod_deploy` always refuses |
| Tenant bug | `fixtures/tenant/src/checkout.ts` still aliases `enterprise` → `enterprise-annual`. Type A is that one string → `enterprise-annual-v3`. |

The collapsed fixture (`LOOP_STORY=collapsed`) is the copy-three-times case. The independent fixture is the conversion-drop with distinct evidence ids (`funnel-cta-desktop-chrome`, `invalid-plan-id-checkout-ts`, `catalog-v3-rollout`).

## Run

```bash
npm test
npm run benchmark
```

`tests/benchmark.test.ts` asserts the table. If someone weakens a gate, the benchmark fails.

## What this does not prove

- Live analytics. The 19% figure is in the fixture story, not a warehouse we do not own.
- A merged tenant PR. Fixture `html_url` is `https://github.example.invalid/loop-tenant/pull/42`.
- Isolation of subagent tools. TrueForge dynamic subagents share the root MCP set. The pause is the control.

Official page: tools should be **connected, not mocked**. This benchmark is honest about the fixture. Qualify still uses real TrueForge MCP, Daytona, and the write-approval pause. How a judge should audit: [audit.md](audit.md).
