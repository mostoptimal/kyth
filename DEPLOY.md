# Deployment Guide

## Prerequisites

- Node.js installed
- Cloudflare account with Workers enabled
- `wrangler` CLI (`npx wrangler` works without global install)

---

## Step 1: Deploy the AI Worker

```bash
cd /home/mo/MEGA/KnowledgeBase/kyth
npx wrangler deploy
```

Note the deployed URL — it will look like:
```
https://kyth-ai-worker.<your-subdomain>.workers.dev
```

---

## Step 2: Update the Worker URL in kyth.html

Open `kyth.html` and edit line 2244:

```js
// Replace with your Cloudflare Worker URL
const AI_ENDPOINT = "https://kyth-ai-worker.<your-subdomain>.workers.dev";
```

Also ensure the CSP allows your worker domain in line 6:
```html
connect-src 'self' https://*.workers.dev https://*.workers.dev/* https://kyth-ai-worker.<your-subdomain>.workers.dev;
```

---

## Step 3: Deploy kyth.html to Cloudflare Pages

**Option A — CLI:**
```bash
npx wrangler pages deploy kyth.html
```

**Option B — Dashboard:**
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Create a new Pages project
3. Drop `kyth.html` directly into the upload area (no build step needed)

---

## Architecture

- **`kyth.html`** — Static single-page app deployed to Cloudflare Pages
- **`ai-worker.js`** — Worker proxy that calls Cloudflare Workers AI (Llama 3 8B)

The HTML calls the Worker via `fetch()` to avoid CORS issues and keep the AI logic server-side.

---

## Troubleshooting

**AI not working after deploy:**
- Verify `AI_ENDPOINT` in `kyth.html` matches your deployed Worker URL
- Check the Worker is returning valid JSON: `curl -X POST https://your-worker.workers.dev -d '{"prompt":"test"}'`

**CORS errors:**
- The Worker sends `Access-Control-Allow-Origin: *` headers
- Make sure the Worker is deployed and responding

**Build/deploy errors:**
- Use `wrangler pages deploy` (not `wrangler deploy`) for static files
- The Worker uses `wrangler deploy` with the `wrangler.toml` in this directory
