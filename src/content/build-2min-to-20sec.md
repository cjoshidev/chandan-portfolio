---
title: "Cutting our build from 2 minutes to 20 seconds"
date: "2026-06-05"
type: "postmortem"
description: "How introducing Vite and Nx took our front-end build from a 2-minute wait to a 20-second feedback loop — and why the dev-loop time mattered more than the CI number."
tags: ["tooling", "performance", "postmortem"]
---

> Draft — Chandan, this is built from the real numbers on your CV. Verify the specifics in brackets and make the war stories your own before publishing.

A two-minute build doesn't sound like much. But you don't pay it once — you pay it every time you change a line and wait to see the result. Multiply that across a team, across a day, and the slow loop quietly becomes the most expensive thing in the codebase.

Here's how we took ours from roughly **2 minutes to about 20 seconds** — a ~6x improvement — and what actually moved the needle.

## Where the time was going

Our front end was a [large React/TypeScript codebase] bundled with [the original toolchain — Webpack/CRA]. Two things hurt:

- **Cold dev server start and HMR** rebuilt far more than the file you touched.
- **CI builds** re-did work that hadn't changed between commits.

The instinct is to optimise the existing pipeline. The bigger win was changing the tools underneath it.

## What we changed

**Vite for the dev loop.** Native ES modules in development mean the dev server doesn't bundle the whole app up front — it serves modules on demand and does HMR per-module. The cold start and the change-to-refresh time dropped immediately. This is the change developers *felt* every minute.

**Nx for the build graph.** Nx gave us a dependency graph of the workspace, so we could:

- build and test only the **affected** projects on a change, and
- **cache** task outputs, so unchanged work was never repeated.

The combination is the point: Vite fixed the inner loop, Nx fixed the outer one.

## The results

- Local feedback loop: **~2m → ~20s**.
- CI: only affected projects rebuilt, with cache hits on the rest [add your CI number].
- The less measurable win: people stopped context-switching during builds.

## What I'd tell my past self

- **Optimise the loop you pay most often.** The dev-server feedback loop runs hundreds of times a day; the production build runs far less. We got the order right by accident — fix the inner loop first.
- **Module boundaries are a prerequisite, not a detail.** "Affected" only works if the graph is honest. Tangled imports make everything look affected.
- **Measure the wait, not just the build.** The number that mattered was "how long until I see my change," not the line CI prints at the end.

Fast builds aren't a vanity metric. They're the difference between staying in flow and losing the thread ten times a day.
