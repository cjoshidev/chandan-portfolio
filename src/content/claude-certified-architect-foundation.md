---
title: "I passed the Claude Certified Architect — Foundation today"
date: "2026-06-12"
type: "note"
description: "A short note on earning Anthropic's Claude Certified Architect (Foundation) and where building with LLMs fits a full-stack engineer who also lives in the infra."
tags: ["ai", "certification", "note"]
---

> Draft — Chandan, this is a starting point. Swap in what *you* actually found hard or surprising about the exam; a real, specific reaction beats a generic "I passed" post every time.

Earned the **Claude Certified Architect — Foundation** today. Short note, because the interesting part isn't the badge — it's where this fits.

I spend my time across the stack: frontend, backend, and the infrastructure underneath. Designing with LLMs increasingly sits in that same picture — it's another system with failure modes, costs, and latency budgets to reason about, not a magic box you bolt on at the end.

A few things the foundation material reinforced for me:

- **Context is the architecture.** What you put in front of the model — and what you leave out — does more work than clever wording. [Add the specific idea that landed for you.]
- **Tools turn a chatbot into a system.** The jump from "answers questions" to "does things" is tool use, and it comes with the same reliability questions as any integration.
- **Treat prompts and agents like code.** Versioned, tested, observable. The instinct I already have from infra transfers directly.

What's next: [your plan — the advanced cert, a project you want to build, etc.].

If you're a full-stack engineer wondering whether this is worth the time — it was, mostly because it forced me to think about LLM systems the way I think about everything else I ship: what happens when it's slow, wrong, or expensive.
