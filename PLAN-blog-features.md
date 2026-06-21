# Plan: Share, Clap, and Subscribe features for blog posts

## Context

The portfolio blog is a 100% static React/Vite SPA with no backend. Adding claps (persistent counts) and email subscriptions requires a data store and email service. Confirmed stack: **Supabase** (free tier) for persistence, **Resend** for email delivery, **Vercel** for hosting and serverless functions.

---

## Architecture

```
Browser                     Vercel (api/)              External
──────────────────────────  ─────────────────────────  ──────────
ShareButton (client-only)
ClapButton ─────────────→   api/clap.js ──────────────→ Turso (SQLite)
SubscribeForm ──────────→   api/subscribe.js ─────────→ Supabase DB
                                                    └──→ Resend (welcome email)

GitHub Action (on push to main, new .md files only):
  → fetch subscribers from Supabase → Resend batch send
```

---

## Claps: SQLite via Turso (not Supabase)

> **Why not a raw `.sqlite` file?** Vercel's serverless filesystem is ephemeral — the file is wiped between function invocations. A plain file cannot persist.

**Turso** is cloud-hosted SQLite (libSQL) accessible over HTTP. Free tier: 500 databases, 1 billion row reads/month. Same SQL, no infrastructure to manage.

### Turso setup
1. Install CLI: `npm i -g @turso/cli` → `turso auth login`
2. Create DB: `turso db create portfolio-claps`
3. Get URL: `turso db show portfolio-claps --url` → `TURSO_DATABASE_URL`
4. Get token: `turso db tokens create portfolio-claps` → `TURSO_AUTH_TOKEN`
5. Run schema via CLI or the Turso dashboard:
   ```sql
   create table if not exists claps (
     slug text primary key,
     count integer not null default 0
   );
   ```

### `api/clap.js` (new Vercel serverless function)
Replaces the direct Supabase RPC call. The browser calls this route instead.

```js
import { createClient } from '@libsql/client/http';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(req, res) {
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'slug required' });

  if (req.method === 'GET') {
    const { rows } = await db.execute({
      sql: 'select count from claps where slug = ?',
      args: [slug],
    });
    return res.status(200).json({ count: rows[0]?.count ?? 0 });
  }

  if (req.method === 'POST') {
    const { rows } = await db.execute({
      sql: `insert into claps (slug, count) values (?, 1)
            on conflict (slug) do update set count = count + 1
            returning count`,
      args: [slug],
    });
    return res.status(200).json({ count: rows[0].count });
  }

  return res.status(405).json({ error: 'method not allowed' });
}
```

Install: `npm install @libsql/client`

### `ClapButton.jsx` changes
Replace the Supabase client calls with fetch calls to `/api/clap?slug={slug}`:
- On mount: `fetch('/api/clap?slug=' + slug)` → GET → read count
- On clap: `fetch('/api/clap?slug=' + slug, { method: 'POST' })` → returns updated count

No `src/lib/supabase.js` needed for claps. The subscribe feature still uses Supabase for subscribers.

### Additional env vars
| Variable | Where |
|---|---|
| `TURSO_DATABASE_URL` | Vercel + local `.env.local` |
| `TURSO_AUTH_TOKEN` | Vercel + local `.env.local` (server-side only) |

---

## Supabase Schema — subscribers only (run once in SQL Editor)

```sql
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamptz default now()
);
alter table subscribers enable row level security;
-- No public policies — only service role key (server-side) can access
```

---

## Environment Variables

| Variable | Where used |
|---|---|
| `TURSO_DATABASE_URL` | `api/clap.js` only (server-side) |
| `TURSO_AUTH_TOKEN` | `api/clap.js` only (server-side) |
| `VITE_SUPABASE_URL` | `api/subscribe.js` + GitHub Action |
| `SUPABASE_SERVICE_ROLE_KEY` | `api/subscribe.js` + GitHub Action only |
| `RESEND_API_KEY` | `api/subscribe.js` + GitHub Action |
| `VITE_SITE_URL` | Frontend (share URL) |

Set all in Vercel dashboard. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `SITE_URL` also as GitHub Actions secrets.

---

## Files to Create

### `src/components/ShareButton.jsx`
- Icon button (share SVG) placed at the right end of the BlogPost header metadata row
- `navigator.share()` on mobile → clipboard fallback on desktop
- "copied!" label shown for 2s on success
- Uses `VITE_SITE_URL || window.location.origin` for the URL

### `src/components/ClapButton.jsx`
- Centered 👏 button with count below it, placed in a `<footer>` at the bottom of BlogPost
- On mount: GET `/api/clap?slug={slug}` → load count; check `localStorage` key `clapped-{slug}`
- On click: optimistic update → POST `/api/clap?slug={slug}` → sync to returned count; rollback on error
- Disabled + accent border after clapping
- No Supabase dependency — uses fetch to the Vercel API route

### `api/clap.js` — see full implementation in the Turso section above

### `src/components/SubscribeForm.jsx`
- Email input + "subscribe" button, placed below ClapButton in the same `<footer>`
- `POST /api/subscribe` with `{ email }`
- Success: replaces form with "subscribed. new posts will land in your inbox."
- Error: shows API error message inline
- Duplicate email silently returns success (anti-enumeration)

### `api/subscribe.js` (Vercel serverless function)
- Validates email with regex
- Inserts to `subscribers` via Supabase service role client
- Ignores `23505` (unique violation) → returns 200
- Sends welcome email via Resend on success
- From address: `Chandan Joshi <hello@chandanjoshi.dev>` (update to verified sender domain)

### `.github/workflows/notify-subscribers.yml`
- Trigger: `push` to `main`, path filter `src/content/*.md`
- `fetch-depth: 2` to enable `HEAD~1` diff
- Detect new posts: `git diff --name-only --diff-filter=A HEAD~1 HEAD -- 'src/content/*.md'`
- If new posts found: fetch all subscribers via Supabase service role, send notification email per subscriber via Resend
- Skips silently if no new `.md` files added (only modified/deleted)

### `.env.example`
Document all 6 variables with placeholder values.

---

## Files to Modify

### `src/pages/BlogPost.jsx`
1. Add 3 imports at top
2. Add `alignItems: 'center'` to the metadata `<div>`, append `<ShareButton title={meta.title} slug={slug} />` at its end
3. Add `<footer style={{ marginTop: 'var(--spacing-xl)' }}>` after `</div>` (markdown-content), containing `<ClapButton slug={slug} />` and `<SubscribeForm />`

### `package.json`
Add `@libsql/client`, `@supabase/supabase-js`, and `resend` to dependencies. Run `npm install`.

---

## Setup Checklist (before first deploy)

- [ ] Set up Turso: create DB → run claps schema → collect `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`
- [ ] Create Supabase project → run subscribers schema SQL → collect URL + service role key
- [ ] Create Resend account → verify sending domain → generate API key → update `from` address in `api/subscribe.js` and GitHub Action
- [ ] Copy `.env.example` → `.env.local`, fill in all 6 values
- [ ] `npm install`
- [ ] `vercel dev` (not `npm run dev`) to test both API routes locally
- [ ] Add all 6 env vars in Vercel dashboard
- [ ] Add 4 secrets in GitHub repo Settings → Secrets

---

## Verification

| Scenario | Expected |
|---|---|
| Click Share (desktop) | URL copied to clipboard, "copied!" label shown |
| Click Share (mobile Safari) | Native share sheet opens |
| First clap | Count increments, button border turns accent, localStorage key set |
| Reload after clap | Button still shown as clapped, count unchanged |
| Subscribe valid email | Success message, row in Supabase `subscribers` table, welcome email received |
| Subscribe same email again | Success message shown (no error leak) |
| Push new `.md` to main | GitHub Action runs, subscribers receive notification email |
| Push edit to existing `.md` | GitHub Action runs, no email sent (diff-filter=A) |
