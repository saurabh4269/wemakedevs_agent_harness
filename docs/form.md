# Submission form

Submit: https://forms.gle/PxGLsWW1HPyroQ5u9
Register: https://forms.gle/dNHFh7wH8uJj4bZH8
Rules: https://www.wemakedevs.org/hackathons/trueforge/rules

Copy below is the human draft for **this week's** TrueForge LOOP. Do not paste prior-product essays. Disclose AI assistants. Team **thExplorers**.

## Fields we know

- Public GitHub repo.
- **Video is YouTube**, not more than 3 minutes. Shot list: [demo.md](demo.md). Shape: problem / three looks / sandbox patch / pause / reconnect / one-line lesson. Vimeo is the wrong host for this field.
- Deployed link is optional.
- Short write-up: what the agent does and how it uses TrueForge.
- Blog link if entering that prize.
- Team selected all four tracks; judges still award one judged-track prize.

## Draft answers (human)

**Repo**
https://github.com/saurabh4269/wemakedevs_agent_harness

**Deployed (optional)**
https://loop.heisenbug.in
Fallback: https://loop-trueforge.onrender.com
Do not put `loop.thexplorers.xyz`.

**Video**
YouTube, ≤3 min. Record from the shot list in [demo.md](demo.md). Replace the 4s Vimeo placeholder. Film stock TrueForge. Say fixtures out loud. Do not click Approve until after the take.

**Blog**
https://saurabh4269.github.io/blog/trueforge-harness/
Source in-repo: [blog.md](blog.md). Publish the MDX to `saurabh4269.github.io` `content/trueforge-harness.mdx` if that URL is still 404.

**What the agent does / how it uses TrueForge**

LOOP is one incident responder. You paste a conversion-drop signal. The root does not investigate itself. It spawns three named one-level subagents — analytics, logs, deploys — and those threads hit real MCP tools. Independence is code, not a vibe check. If the three reports are the same sentence, LOOP refuses a root cause.

If they are independent, it is a Type A break. The Daytona sandbox clones this public repo (the snapshot is empty), patches the enterprise plan alias in `fixtures/tenant/src/checkout.ts`, and the root calls `open_draft_pr` with merge off. TrueForge pauses. A person has to Allow or Deny. LOOP never merges and never deploys prod.

Warehouse answers and the PR URL are labeled fixtures. The pause, the sandbox, and the three looks are not. We say that in the video.

AI assistants used this week: Cursor (Grok / Cloud Agent) for implementation and docs. We read every change. Qodo reviewed the PRs.

**Tracks**
Best Use of TrueForge, Best Code Quality, Best UI, Best Blog. One judged-track prize.

## Copy constraints

Spoken. This week. TrueForge pause (and tool + sandbox). Not prior internal work. Not a prior campus product. Human voice. Disclose AI assistants.
