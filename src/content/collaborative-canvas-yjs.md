---
title: "Scaling a collaborative canvas to 100+ concurrent editors with Yjs"
date: "2026-05-20"
type: "postmortem"
description: "Building real-time multiplayer editing on a shared canvas — why I reached for CRDTs over operational transforms, and what broke as the editor count climbed."
tags: ["realtime", "crdt", "postmortem"]
---

Real-time collaboration looks like magic to the user and like a distributed-systems problem to the engineer. Two people drag the same object at the same time — whose change wins, and does everyone end up looking at the same canvas a moment later?

We built a shared canvas used by teams designing flows together, and it needed to hold up under real load — not a demo with two tabs open, but **100+ concurrent editors** on the same document. Here's what the architecture looked like, where it broke, and what we did about it.

## Why CRDTs, not Operational Transforms

The classic approach to collaborative editing is **Operational Transformation** — the technology behind early Google Docs. The idea is that every operation (insert, delete, move) gets transformed against concurrent operations so the result converges. It works, but it leans heavily on a central server to sequence and transform operations. Every client change routes through the server before anyone sees it.

We went with a **CRDT** (Conflict-free Replicated Data Type) via [Yjs](https://yjs.dev). The trade-off is different:

- CRDTs are designed to merge without coordination. Two clients can apply changes independently and reconcile later without a referee.
- The merge is mathematically guaranteed to converge to the same state regardless of the order operations arrive.
- For a canvas — lots of independent objects being moved around simultaneously — this fits the problem well. There's rarely a "right" winner when two people move different shapes; the correct answer is usually "both changes happened."

The cost is that CRDTs carry metadata to make merging possible. That metadata accumulates. This becomes relevant later.

## The architecture

```
  Client A                  Server                  Client B
     │                         │                        │
     │   Y.Doc (local copy)    │   Y.Doc (local copy)   │
     │                         │                        │
     │──── WebSocket update ──▶│──── WebSocket update ─▶│
     │                         │                        │
     │◀─── broadcast ──────────│◀──── broadcast ────────│
     │                         │                        │
  Renders immediately       Persists               Renders immediately
  (optimistic local update)  to DB               (merge on arrival)
```

Three layers:

**Y.Doc** — the shared document model. The canvas state lives here as a `Y.Map` of shape objects. Each shape is itself a `Y.Map` so properties can be updated independently. Moving a shape and changing its colour are two separate operations that can happen concurrently without conflicting.

**WebSocket provider** — syncs document updates between clients via a server relay. When a client modifies the doc, Yjs encodes the delta as a compact binary update and broadcasts it. Clients apply it to their local doc and re-render. The server keeps a copy for new clients joining mid-session.

**Awareness** — Yjs ships a lightweight protocol for ephemeral state: who's online, where their cursor is, what they have selected. Critically, awareness state is *not* part of the persisted document. It's transient, keyed to the connection, and discarded when a client disconnects. This keeps the document clean — presence churn doesn't write to the doc history.

## What broke as the numbers climbed

Getting two editors in sync is a demo. Getting 100+ is where the real lessons showed up.

### Document growth

CRDTs retain tombstone metadata for deleted or overwritten entries — the merge algorithm needs it to reason about concurrent edits. Without management, the document grows monotonically. A canvas with a lot of create/delete activity balloons in size, and every new client joining has to sync the full history.

We handled this in two ways:

1. **Periodic snapshots.** Rather than replaying the full update log, new clients load a recent snapshot and only sync the delta since that point. The server creates a snapshot at regular intervals and whenever the doc crosses a size threshold.

2. **Yjs garbage collection.** Yjs can GC tombstoned entries that are no longer reachable by any active branch of the history. We enabled this on the server-side copy. It doesn't eliminate all metadata overhead, but it keeps growth linear rather than unbounded.

```
Without GC:                    With snapshots + GC:

Doc size                        Doc size
   │  /                            │ ╲  /╲  /╲
   │ /                             │  ╲/  ╲/  ╲
   │/                              │
   └──────── time                  └──────── time
   (grows forever)                 (periodic reset via snapshots)
```

### Render pressure

At 100+ editors, the WebSocket channel sees a high-frequency stream of updates — cursor moves, shape drags, selection changes. Naively re-rendering the canvas on every incoming update causes frame drops.

The fix was to decouple network arrival from render. Incoming updates are queued, and the canvas reads the queue at most once per animation frame via `requestAnimationFrame`. This keeps the render loop at 60fps regardless of update frequency. The downside is a maximum of ~16ms of additional latency between receiving an update and showing it — imperceptible in practice.

```javascript
let pending = false;

function onRemoteUpdate() {
  if (!pending) {
    pending = true;
    requestAnimationFrame(() => {
      applyQueuedUpdates();
      pending = false;
    });
  }
}
```

### Presence noise

Cursor positions update on every `mousemove`. At 100 users that's potentially thousands of awareness updates per second across the channel. We applied two limits:

- **Throttle awareness updates** to 50ms on the client side. Users see cursors move smoothly; the network doesn't see every pixel.
- **Separate awareness from document sync.** Awareness updates go through their own lightweight path and never touch the persisted document. Cursor churn doesn't create doc history entries.

### Offline and reconnect

Yjs handles the merge semantics, but reconnect UX requires thought. When a client reconnects after being offline, it sends its pending updates and receives updates it missed. The merge is automatic — but if the client was offline long enough, the initial sync can be large.

We added a staleness check on reconnect: if a client's last known server clock is more than N seconds behind, we show a "reconnecting and syncing" indicator rather than silently blocking the UI. Users know something is happening rather than wondering why the canvas is frozen.

## What the numbers looked like

Before the render batching and awareness throttling, performance degraded visibly above ~30 concurrent editors. Frame rate dropped, cursor updates lagged, and the WebSocket backpressure started building up.

After the fixes:

- Consistent 60fps canvas rendering at 100+ concurrent editors in load tests
- Awareness update volume reduced by ~80% with 50ms throttling
- Document size growth reduced significantly with GC and snapshots enabled — a doc with 6 months of activity stabilised at a fraction of what it would have been

## Lessons

**Pick the conflict model to fit the data.** Independent objects on a canvas suit CRDTs well — there's rarely a meaningful "merge conflict" when two people move different shapes. Tightly-ordered data like a rich-text document might make different trade-offs. The data shape should drive the choice, not hype around the algorithm.

**Separate ephemeral from persistent.** Presence is not document state. Conflating them — storing cursors in the doc, writing selection to history — is the fastest way to a bloated, slow document that new clients can barely load. Keep the boundary explicit.

**The hard part isn't the merge — it's everything around it.** Yjs handles convergence. Memory, rendering, presence, reconnect UX, and GC strategy are where the engineering time actually went. The CRDT is the foundation, not the building.

**Optimistic local updates are the right default.** Show the user their own change immediately. Don't wait for the server to echo it back. The user's own actions should feel instant; remote updates can arrive asynchronously. This is the interaction model users expect from any modern collaborative tool.

Collaboration features sell the product. The work that makes them *not fall over* at scale is invisible — which is exactly why it's worth writing down.
