# Vercel setup for bttrsite

## Environment variables

In **Vercel Dashboard → bttrsite project → Settings → Environment Variables**, add:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL (e.g. `https://xxxx.supabase.co`) |
| `SUPABASE_SERVICE_KEY` | **Recommended.** Service role key so the join page can read `goal_lists.name` even if RLS restricts anon. From Supabase → Project Settings → API. |
| `SUPABASE_ANON_KEY` | Alternative if you don’t use service key; then `goal_lists` must allow public/anon SELECT on `name` (or RLS will block and the title stays “Join a challenge”). |

This site’s `/join/:id` API only needs Supabase; Stripe and `PORT` are for the app/backend, not bttrsite.

Redeploy after adding or changing these so the `/join/:id` serverless function can read them.

## Preview image (OG)

- The join page uses `https://bttrsite.vercel.app/fsf.png` for Open Graph / Twitter cards.
- A 1×1 placeholder PNG is included so the link works out of the box.
- **Replace** `fsf.png` in the repo root with your app icon (e.g. copy `assets/fsf.png` from the Bttr Together mobile app) for proper rich previews in iMessage etc.

## Test

After deploy, open:

`https://bttrsite.vercel.app/join/<valid-goal-list-uuid>`

You should see the join page and HTML with `<meta property="og:title" content="Join &quot;...&quot;" />` using the challenge name from Supabase `goal_lists.name`.
