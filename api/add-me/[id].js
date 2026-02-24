// Load .env when present (e.g. local dev); Vercel injects env vars so this is a no-op in production
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.BTTRSITE_BASE_URL || 'https://bttrsite.vercel.app';
const IMAGE_URL = `${BASE_URL}/fsf.png`;

function escapeHtml(s) {
  if (!s || typeof s !== 'string') return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getAddMePageHtml(id, userName, requestUrl) {
  const title = userName ? `Add ${escapeHtml(userName)} on Bttr Together` : 'Add on Bttr Together';
  const pageUrl = requestUrl || `${BASE_URL}/add-me/${id}`;
  return `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <link rel="icon" href="${IMAGE_URL}" type="image/png" />
  <link rel="apple-touch-icon" href="${IMAGE_URL}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="Add them as a friend in the Bttr Together app." />
  <meta property="og:image" content="${IMAGE_URL}" />
  <meta property="og:image:url" content="${IMAGE_URL}" />
  <meta property="og:image:width" content="512" />
  <meta property="og:image:height" content="512" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:url" content="${pageUrl}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="Add them as a friend in the Bttr Together app." />
  <meta name="twitter:image" content="${IMAGE_URL}" />
  <meta name="twitter:image:alt" content="Bttr Together" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: #0a0a0a;
      color: #e0e0e0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
    }
    img { width: 80px; height: 80px; margin-bottom: 24px; }
    h1 { font-size: 22px; font-weight: 500; margin: 0 0 8px; }
    p { font-size: 15px; color: #888; margin: 0 0 32px; }
    a {
      display: inline-block;
      padding: 14px 32px;
      font-size: 17px;
      font-weight: 600;
      color: #fff;
      text-decoration: none;
      text-shadow: 0 0 12px rgba(255,255,255,0.8);
    }
    a:active { opacity: 0.9; }
  </style>
</head>
<body>
  <img src="/fsf.png" alt="Bttr Together" />
  <h1>${escapeHtml(title)}</h1>
  <p>Tap below to open in the app and add them as a friend.</p>
  <a href="bttrtogether://add-me/${escapeHtml(id)}" id="open-app">Open in app</a>
</body>
</html>`;
}

module.exports = async (req, res) => {
  // id can come from query (rewrite) or path
  const pathMatch = (req.url || req.originalUrl || '').match(/\/add-me\/([^/?]+)/);
  const id = (req.query && req.query.id) || (pathMatch && pathMatch[1]) || '';
  if (!id) {
    res.status(404).setHeader('Content-Type', 'text/html').end(
      getAddMePageHtml('', null, `${BASE_URL}/add-me`)
    );
    return;
  }

  let userName = null;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('profiles')
        .select('name, username')
        .eq('id', id)
        .maybeSingle();
      if (!error && data) {
        const n = data.name && typeof data.name === 'string' ? data.name.trim() : '';
        const u = data.username && typeof data.username === 'string' ? data.username.trim() : '';
        userName = n || u || null;
      }
    } catch (_) {
      // keep userName null
    }
  }

  const requestUrl = `${BASE_URL}/add-me/${id}`;
  const html = getAddMePageHtml(id, userName, requestUrl);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).end(html);
};
