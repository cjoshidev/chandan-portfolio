---
title: "Harness Engineering: The Missing Layer in Agentic Software"
date: "2026-06-28"
type: "opinion"
description: "Prompt engineering taught us how to talk to AI. Context engineering taught us what to give it. Harness engineering teaches us how to build the systems that make AI agents actually reliable."
tags: ["ai", "architecture", "agents", "opinion"]
---

There's a conversation happening in most engineering teams right now. It usually starts with someone asking why the AI agent worked brilliantly in the demo and then made a mess in production. The wrong answer — the one that wastes months — is to improve the prompt.

The right answer is to look at what surrounds the agent.

That's the shift I want to talk about. Not a new tool or a framework. A change in how engineers think about their job when AI agents start doing real work.

## How we got here

It helps to trace the progression, because each stage built on the one before.

**Prompt engineering** was the first discipline that emerged. The insight was simple: if you're more precise about what you ask, you get better answers. Structure your instructions. Give examples. Think about how the model reasons. This was genuinely valuable — it moved AI from a curiosity to a useful tool. But it operated entirely within a single conversation, and the gains had a ceiling.

**Context engineering** raised that ceiling. Rather than just crafting better questions, you started giving the model better material to work with before it reasoned. RAG pipelines to pull in relevant documents. Memory systems to persist information across sessions. MCP servers to surface live data from your systems. Repository context so an agent understood the codebase it was modifying. The model didn't get smarter — it got better information, which is usually more valuable anyway.

Both disciplines improved what comes out of the model. Neither addressed what happens when the model takes actions in the world over a long-running task.

That's where things break.

## The problem with agents isn't the model

When an AI agent fails — inconsistent output, security issue, architectural drift, broken tests — the instinct is to blame the model. Sometimes that's fair. More often, the failure is environmental.

The agent didn't have a clear picture of the codebase conventions. The test suite wasn't run until the end. No one defined what "done" looked like. Security checks weren't automated. A human wasn't looped in at the right moment.

These aren't model failures. They're system failures. And you can't prompt your way out of a system failure.

```
What engineers usually debug:
  ┌─────────────────────────────────┐
  │         The prompt              │
  │  "Be more careful. Follow our   │
  │   conventions. Don't break..."  │
  └─────────────────────────────────┘

What actually needs fixing:
  ┌─────────────────────────────────┐
  │    The environment around it    │
  │  ┌─────────┐  ┌──────────────┐  │
  │  │  Tools  │  │ Verification │  │
  │  └─────────┘  └──────────────┘  │
  │  ┌─────────┐  ┌──────────────┐  │
  │  │ Context │  │  Guardrails  │  │
  │  └─────────┘  └──────────────┘  │
  └─────────────────────────────────┘
```

This is the gap that **harness engineering** addresses.

## What a harness actually is

The term comes from testing — a test harness is the scaffolding that lets you run tests reliably: environment setup, fixtures, teardown, assertions. Same idea here, expanded to cover the full execution environment of an AI agent.

A harness is the complete system surrounding an agent: what it can see, what it can touch, how its work gets validated, where it stops for approval, and how you know what it did.

In practice, that means:

```
  ┌───────────────────────────────────────────────────────┐
  │                      THE HARNESS                      │
  │                                                       │
  │  ┌──────────────┐    ┌───────────────┐                │
  │  │  Repository  │    │     Tools     │                │
  │  │  knowledge   │    │  (what agent  │                │
  │  │  + standards │    │   can call)   │                │
  │  └──────┬───────┘    └───────┬───────┘                │
  │         │                   │                         │
  │         ▼                   ▼                         │
  │  ┌─────────────────────────────────────────────┐      │
  │  │               AI AGENT                      │      │
  │  └─────────────────────────────────────────────┘      │
  │         │                   │                         │
  │         ▼                   ▼                         │
  │  ┌──────────────┐    ┌───────────────┐                │
  │  │ Verification │    │  Observability│                │
  │  │ + Quality    │    │  + Audit log  │                │
  │  │   gates      │    │               │                │
  │  └──────┬───────┘    └───────┬───────┘                │
  │         │                   │                         │
  │         ▼                   ▼                         │
  │  ┌─────────────────────────────────────────────┐      │
  │  │        Human approval (when required)       │      │
  │  └─────────────────────────────────────────────┘      │
  └───────────────────────────────────────────────────────┘
```

Each component in the harness handles a concern that the model cannot reliably handle on its own:

**Repository knowledge** — not just "here's the codebase," but the architectural decisions, naming conventions, module boundaries, and patterns that define how your team builds. An agent that can look this up doesn't need to guess.

**Tool integrations** — the specific capabilities the agent can invoke, scoped carefully. Not "access to the internet," but "can call these three APIs, read from these paths, write to these paths."

**Verification pipelines** — automated checks that run after every significant action. Tests, linting, type checking, security scanning. These aren't optional. They're the mechanism by which the harness knows whether the agent's work is correct.

**Quality gates** — defined criteria that must pass before a task advances. The agent doesn't decide when it's done; the harness does.

**Observability** — a complete record of what the agent did, in what order, and why. Not logs for debugging failures (though that too), but structured traces you can review and learn from.

**Human approval workflows** — the deliberate decision about where humans stay in the loop. Not "always review everything" (defeats the purpose) and not "never review anything" (too risky). The right gates are defined by the risk profile of each action type.

## The engineering manager analogy

I keep coming back to this framing because it's the most useful one I've found.

When you onboard a new engineer, you don't hand them a ticket and walk away. You give them access to the systems they need. You explain the conventions. You set up CI so their code gets checked. You do code review. You have deployment procedures that apply regardless of who wrote the code.

None of that is distrust. It's structure. It's what makes a capable engineer consistently effective rather than occasionally brilliant.

An AI agent is in the same position. It can be highly capable and still produce unreliable output without structure around it. The harness is that structure.

The difference is that the structure needs to be more explicit, more automated, and more comprehensive — because an agent doesn't ask questions when it's uncertain, doesn't instinctively flag an architectural disagreement before proceeding, and doesn't slow down when something feels off.

## A concrete before and after

Take an AI agent assigned to implement a new API endpoint.

**Without a harness:**

```
Task given → Agent writes code → ???
```

The agent may use inconsistent naming. It may not know your error-handling conventions. It may write code that technically works but conflicts with how the rest of the system is structured. It might not write tests. If it introduces a security issue, nothing catches it until review — or later.

**With a harness:**

```
Task defined with clear scope
        │
        ▼
Repository standards loaded — naming, patterns, existing interfaces
        │
        ▼
Agent implements across multiple steps
        │
   (after each step)
        │
        ▼
  ┌─────────────────────────────────────────┐
  │ Tests run                               │
  │ Linter + type checker pass              │
  │ Security scan passes                    │
  │ No regressions in affected modules      │
  └──────────────┬──────────────────────────┘
                 │
                 ▼
Pull request opened with structured evidence:
what changed, why, what was tested
                 │
                 ▼
Human reviews decisions, not mechanics
```

The output quality doesn't come from a better prompt. It comes from the fact that a substandard output can't exit the pipeline — the verification layer catches it and the agent has to fix it.

## Why this matters now

For the past few years, "can the model generate code?" was the gating question. The models have answered it. The capability is real.

The question that matters now is different: can the system reliably guide, verify, and govern what the model does across a long-running task that touches production systems?

That's a systems engineering question. It's the kind engineers are already good at — we build systems with failure modes, feedback loops, and safety mechanisms all the time. We just haven't systematically applied that thinking to AI agents yet.

The teams that figure this out first won't just be using better models. They'll have built better machinery around them. That machinery compounds — every quality gate you add, every verification step you automate, every feedback loop you close makes every subsequent agent task more reliable.

## What this means for engineering work

Harness engineering doesn't replace the work of building software. It changes what the most valuable engineering work is.

Less time on the mechanical act of writing code. More time on:

- Defining what correct looks like, precisely enough that a verification system can check it
- Designing task decomposition so agents work on well-scoped problems
- Building feedback loops that catch failures close to where they occur
- Deciding which actions require human judgment and which can be automated
- Making architectural standards machine-readable, not just documented in a wiki

The transition is already happening. Engineers who wait for the tooling to mature before developing the systems thinking are going to find themselves behind it.

---

Prompt engineering taught us how to communicate with AI. Context engineering taught us how to give it the information it needs. Harness engineering teaches us how to build the environment in which AI agents can actually be trusted with real work.

The future isn't better prompts. It's better systems.
