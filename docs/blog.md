---
title: "LOOP: three looks, then a human on the write"
publishedAt: "2026-08-31"
updatedAt: "2026-08-31"
author: "Saurabh Gupta"
summary: "We spent the Agent Harness week building one incident responder on TrueForge. Three independent looks, a sandbox patch, and a pause before the draft PR. The warehouse is a fixture. The pause is not."
---

# LOOP: three looks, then a human on the write

I wanted a product a judge can run without making an account.

Checkout conversion drops about 19% on Friday afternoon, desktop Chrome. That is the only prompt. LOOP is one TrueForge agent. It is the **Incident responder** on the hackathon page. Chat is the UI.

This post is the field report. What we built this week, what broke, and what we left honest.

## The job

A conversion drop is not a chatbot question. It is three different kinds of evidence that have to stay independent:

- **analytics** — which metric, which funnel step, which segment
- **logs** — which error, which file, how many times
- **deploys** — which service, which commit, what time

If those three collapse into the same sentence, LOOP refuses a root cause. That check is TypeScript (`src/independence.ts`), not a polite prompt. The fixture warehouse ships two stories: `independent` and `collapsed`. The collapsed story must not patch and must not open a PR.

When the three look independent, LOOP treats it as a **Type A** break. The tenant catalog was renamed to `*-v3`. `fixtures/tenant/src/checkout.ts` still aliases `enterprise` to `enterprise-annual`, which is gone. Starter and pro work. Enterprise throws `InvalidPlanId`. The sandbox patch is that one alias.

Then the root calls `open_draft_pr` with `merge: false`. TrueForge pauses. A person has to Allow or Deny. LOOP never merges. LOOP never prod-deploys the tenant.

That is the whole product.

## What a judge has to see

The official page is blunt. If a judge cannot see TrueForge reach a **tool**, run code in a **sandbox**, and **stop for a person**, it does not qualify.

On LOOP those three beats are:

1. Root spawns `analytics`, `logs`, `deploys`. Those threads call `query_analytics`, `query_logs`, `query_deploys`. The root does not query the warehouse itself.
2. Daytona clones this public repo (the snapshot has no sources). The root patches `checkout.ts` so `enterprise` points at `enterprise-annual-v3`.
3. `open_draft_pr` sits on Approve / Deny.

We filmed the local pass. Session `01m1a87xjewncn310ymqy3yz01` on `[::1]:8790` with `gpt-4.1-mini`. Three named looks, clone, patch, pause on the root write. We have not clicked Approve. That sitting pause is the still.

The judge URL is https://loop.heisenbug.in. Same agent, hosted TrueForge, no login. Free Render sleeps — ping `/healthz` first.

## What is real, and what we say out loud

TrueForge is real. Daytona is real. The write-approval pause is real. Three named subagents are real. Session refresh keeping the pause is real. The tenant bug is real TypeScript.

The warehouse answers are not Grafana. They are a canned story in `fixtures/mcp/stories.ts`. The draft PR URL is `https://github.example.invalid/loop-tenant/pull/42`. Every write tool returns `mode:fixture` and `live_github: false`.

The official page wants tools **connected, not mocked**. That is an honest Best Use risk. We did not hide it. A judge needs no login and no tenant GitHub token. The harness still does the three things the page asks for.

Dynamic subagents share the root tool set. TrueForge has no per-subagent `enable_tools`. A `patcher` thread can still see `open_draft_pr`. Demo rule: deny that extra write, approve only the root.

## What broke this week

The first local run spawned `type-a-vs-b` as a fourth subagent. That is a skill, not an agent. We hardened the spec: never spawn skill names.

The first hosted conversion-drop saw `sandbox.created`, then skipped the patch because the Daytona cwd was empty. Empty is normal. The snapshot has no repo. We taught the root to clone even when `wemakedevs_agent_harness/` is missing, at most twice, and then it **must** call `open_draft_pr`. A written next-steps list is not a substitute.

The second hosted run actually got analytics, logs, and deploys. Then Nemotron Super `:free` called `ask_user_question` about "service overload" and stopped. No clone. No pause. We turned `ask_user_questions` off. If a named subagent fails, retry that exact name once, then continue. Never ask the user during an investigation.

Hosted import defaults to `gpt-4.1-mini` unless you pass the Nemotron env vars. Our OpenRouter account has no credits. `import-loop.ts` now refuses a judge-host import that would replace the free model.

## What we did not build

Not a 19-agent fleet. Not a dark SOC. Not a second product for generative UI. Sai said stock TrueForge UI is enough; `apps/loop-ui` is an optional Doing / Waiting / Did rail on the same incident. Kunal said fewer features, working.

We did not Apply the Render Blueprint on the live workspace. That would duplicate Postgres and Redis. Merge to `main` deploys the image. Image deploy does not re-import the agent.

We did not put keys in git.

## The lesson

Three independent looks. A sandbox patch on a real TypeScript alias. A human on the write.

That is a license to act. The model does not get the last word.
