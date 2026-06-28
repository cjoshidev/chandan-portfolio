---
title: "Cutting our build from 2 minutes to 20 seconds"
date: "2026-06-05"
type: "postmortem"
description: "How introducing Vite and Nx took our front-end build from a 2-minute wait to a 20-second feedback loop — and why the dev-loop time mattered more than the CI number."
tags: ["tooling", "performance", "postmortem"]
---

A two-minute build doesn't sound like much. But you don't pay it once — you pay it every time you change a line and wait to see the result. Multiply that across a team, across a day, and the slow loop quietly becomes the most expensive thing in the codebase.

We had a React/TypeScript monorepo running on Webpack. It was typical of what happens when a codebase grows organically — dependencies accumulate, the bundle gets fatter, and nobody has a mandate to fix the tooling because it *works*. It just works slowly.

Here's how we took it from roughly **2 minutes to about 20 seconds** — a ~6x improvement — and what actually moved the needle.

## The before state

Our setup looked like this:

```
Developer saves a file
        │
        ▼
  Webpack dev server
  (full module graph)
        │
        ├── Resolves all imports
        ├── Transpiles everything in scope
        ├── Bundles into one or more chunks
        └── Pushes full HMR update
        │
        ▼
  Browser reloads / patches
  (5–15 seconds per change)
```

CI was worse. Every push triggered a full build of every package, even if nothing in that package changed. A one-line fix to a utility function kicked off the same pipeline as a major feature.

Two things hurt:

- **Cold dev server start and HMR** rebuilt far more than the file you touched. Webpack's HMR works at the bundle level — a change in one module can invalidate the entire chunk.
- **CI builds** re-did work that hadn't changed between commits. No caching, no dependency awareness, just brute force every time.

The instinct is to optimise the existing pipeline — tune Webpack configs, tweak chunk splitting, add `thread-loader`. We tried some of that. It helped at the margins. The bigger win was changing the tools underneath it.

## What we changed

### Vite for the dev loop

The core insight behind Vite is simple: in development, you don't need to bundle at all. Modern browsers understand ES modules natively. Vite leans into this.

```
Developer saves a file
        │
        ▼
   Vite dev server
   (no upfront bundle)
        │
        ├── Browser requests only the changed module
        ├── Vite transforms that single file
        └── HMR update scoped to the module boundary
        │
        ▼
  Browser patches exactly what changed
  (< 1 second per change)
```

The dev server starts almost instantly because there's nothing to bundle — it serves modules on demand. HMR is scoped to the module that changed rather than the chunk it lives in. For a component change, you see it updated before your hand leaves the keyboard.

Production builds still use Rollup under the hood, so the output is properly optimised. The dev experience and the production output are separate concerns, each handled by the right tool.

### Nx for the build graph

Vite solved the *inner* loop. Nx solved the *outer* one — CI and cross-package builds.

Nx builds a dependency graph of your workspace:

```
         packages/
        ┌───────────────────────────────────┐
        │                                   │
     [ui-kit]      [utils]             [api-client]
        │             │                     │
        └──────┬──────┘                     │
               │                            │
           [feature-A]                [feature-B]
               │                            │
               └──────────────┬─────────────┘
                               │
                           [app-shell]
```

When you change `utils`, Nx knows that `feature-A`, `feature-B`, and `app-shell` are affected. It rebuilds and retests only those. `ui-kit` and `api-client` are untouched — their cached outputs are reused.

The cache is the other half. Task outputs (build artefacts, test results) are hashed against inputs. If nothing relevant changed, Nx replays the cached result instantly instead of running the task again. This applies locally *and* on CI — a PR that only touches one feature package rebuilds only that slice of the graph.

## The numbers

| Scenario | Before | After |
|---|---|---|
| Dev server cold start | ~45s | ~3s |
| HMR on component change | 8–15s | <1s |
| Full local build | ~2m | ~20s |
| CI on a scoped change | ~2m | ~25s (affected only) |
| CI on unrelated change | ~2m | ~5s (cache hit) |

The CI numbers are where the compounding really shows. On a busy branch with lots of small commits, cache hit rates sit above 60–70%. Most pushes don't rebuild most of the graph.

## Gotchas worth knowing

**Vite and CommonJS.** Vite's dev server is ESM-first. If you have dependencies that only ship CommonJS, they get pre-bundled on cold start via esbuild. Usually transparent, but occasionally surfaces as a `require is not defined` in a module that assumes a CommonJS environment. The fix is usually `optimizeDeps.include` in the Vite config.

**Nx affected is only as good as the graph.** "Affected" works by tracing the dependency graph. If your imports are loose — importing from `../../packages/utils` instead of the package name — Nx can't see the edge and will miss the dependency. Tightening imports to package names is a prerequisite, not an optional cleanup.

**Cache invalidation on env changes.** Nx caches against source inputs, not environment variables or external API responses. If your build output depends on something Nx can't see, you'll get stale cache hits. The fix is to declare those inputs explicitly in `nx.json`, or avoid putting environment-dependent logic in tasks that need caching.

## What I'd tell my past self

**Optimise the loop you pay most often.** The dev-server feedback loop runs hundreds of times a day; the production build runs far less. The inner loop is where developer time actually goes. Fix that first.

**Module boundaries are a prerequisite, not a detail.** Clean package boundaries in a monorepo aren't just good architecture — they're what makes affected-build tools actually work. If everything imports everything, everything is always affected.

**Measure the wait, not just the build.** The metric that mattered was "how long until I see my change," not the number CI prints at the end. Those are different things. Instrument the right one.

Fast builds aren't a vanity metric. They're the difference between staying in flow and losing the thread ten times a day. The productivity gain from a tight feedback loop is real and it compounds.
