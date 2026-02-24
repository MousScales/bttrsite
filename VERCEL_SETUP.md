# Vercel setup for bttrsite

## Environment variables

In **Vercel Dashboard → bttrsite project → Settings → Environment Variables**, add:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL (e.g. `https://xxxx.supabase.co`) – use same value as in Bttr Together app |
| `SUPABASE_ANON_KEY` | Supabase anonymous/public key – use same value as in Bttr Together app |

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
