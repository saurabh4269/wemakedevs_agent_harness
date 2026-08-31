# Next

Ordered remaining work. Rewrite when the top item changes. Last rewrite: **2026-08-31 ~09:25 IST**.

Saurabh's order (do not reorder): living handoff + auto-deploy first, then hosted qualify, then film, then blog/form.

1. **Land this handoff PR** (`docs/living-handoff-autodeploy`). Qodo `/agentic_review`, Highs 0, merge to `main`. That merge should itself auto-deploy on Render (`autoDeployTrigger: commit` already live on `srv-daaaa65g1s2s73cjsq0g`). Confirm a new deploy appears after merge. Image-only — re-import LOOP only if `agents/loop.json` / skills changed (they should not in this PR).
2. **Hosted conversion-drop, new session.** Do **not** reuse `01m1advv5np7mqwse1xf2hdpyc` or `01m1ayqn9563da3mgerw6nwpq5` (both FAIL). Do not answer the `ask_user_question` on the latter. Seed the exact conversion-drop prompt. Leave Approve sitting if `open_draft_pr` pauses. If Nemotron `:free` flakes subagent creation again, film the **local** PASS (`01m1a87xjewncn310ymqy3yz01`) and say the judge URL is the same product on hosted TrueForge.
3. **YouTube ≤3 min** of the live user flow: prompt → three named looks → Daytona clone/patch → sitting Approve. Stock TrueForge UI. Say fixtures out loud (`mode:fixture`, fake PR URL). Cool voiceover. Form wants YouTube, not Vimeo. Do not click Approve until after the take (or never, if you keep that session as the still).
4. **Spark extras** if time: generative UI + Code Mode **inside the same LOOP incident**. Not a new product. Not qualify blockers. Kunal wants fewer features working perfectly; Sai named these as extras.
5. **Blog last.** https://saurabh4269.github.io/blog/trueforge-harness/ is 404.
6. **Form** only when repo + Qodo trail + video exist. Copy about **this week's TrueForge LOOP**. Team thExplorers. Omit prior control-plane work. Live URL https://loop.heisenbug.in.

Do not start a Cursor CloudAgent unless Saurabh asks. TypeScript only. Qodo on every substantive PR.
