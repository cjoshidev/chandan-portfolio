---
title: "Scaling a collaborative canvas to 100+ concurrent editors with Yjs"
date: "2026-05-20"
type: "postmortem"
description: "Building real-time multiplayer editing on a shared canvas — why I reached for CRDTs over operational transforms, and what broke as the editor count climbed."
tags: ["realtime", "crdt", "postmortem"]
---

> Draft — Chandan, this is scaffolded from the real project on your CV (a Yjs canvas at 100+ concurrent editors). Drop in the specific decisions and numbers you remember; that detail is what makes it yours.

Real-time collaboration looks like magic to the user and like a distributed-systems problem to the engineer. Two people drag the same object at the same time — whose change wins, and does everyone end up looking at the same canvas a moment later? We built a shared canvas that held up with **100+ concurrent editors**. Here's the shape of how.

## CRDTs over operational transforms

The classic approach is **Operational Transformation** — the technology behind early Google Docs. It works, but it pushes a lot of correctness onto a central server that has to transform every operation against every other.

We went with a **CRDT** (Conflict-free Replicated Data Type) via [Yjs](https://yjs.dev). The trade is appealing: concurrent edits *merge* deterministically without a central referee, so clients can apply changes locally and reconcile later. For a canvas — many small, independent objects being moved at once — that model fits the problem.

## The architecture

- A shared `Y.Doc` modelling the canvas state.
- A **WebSocket provider** syncing document updates between clients.
- Yjs **awareness** for ephemeral state — cursors, selections, who's online — kept *out* of the persisted document so presence churn didn't bloat history.

## What broke as the numbers climbed

Getting two editors in sync is a demo. Getting 100+ is where the real lessons showed up:

- **Document growth.** CRDTs retain metadata to merge safely. Without attention to that, the doc grows and every new client pays a bigger initial sync. [How you handled this — snapshots / GC — goes here.]
- **Render pressure.** A flood of remote updates can thrash the canvas. Batching updates per animation frame mattered more than any network tweak.
- **Presence noise.** Cursor and selection updates are high-frequency. Throttling awareness and separating it from document data kept the sync channel calm.

## Lessons

- **Pick the conflict model to fit the data.** Independent objects on a canvas suit CRDTs; tightly-ordered text might lean another way. The data shape should drive the choice.
- **Separate ephemeral from persistent.** Presence is not document state. Conflating them is the fastest way to a bloated, slow doc.
- **The hard part isn't the merge — it's everything around it.** Yjs handles convergence. Memory, rendering, and presence are where the engineering time actually went.

Collaboration features sell the product. The work that makes them *not fall over* is invisible — which is exactly why it's worth writing down.
