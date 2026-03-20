# Kyth

A self-discovery tool that guides you through 11 psychological sections to generate an AI-powered life analysis.

![Theme](https://img.shields.io/badge/Theme-Dark%2FLight-1a1a24?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Cloudflare%20Pages-F38020?style=flat-square)
![AI](https://img.shields.io/badge/AI-Cloudflare%20Workers%20AI-FA733A?style=flat-square)

---

## What is this?

Kyth is a single-file web app (~3000 lines of vanilla HTML/CSS/JS) that asks you structured questions across 11 life dimensions:

1. Current Life Situation
2. Energy & Focus Patterns
3. Skills & Abilities
4. Interests & Curiosities
5. Values & Priorities
6. Life Vision
7. Identity & Self-Perception
8. Obstacles & Fears
9. Decision History
10. Resources & Environment
11. Risk Tolerance & Experiments

Your answers are compiled into a detailed prompt and sent to **Cloudflare Workers AI** for analysis. The result is a structured, psychologically-informed life direction report covering personality, strengths, weaknesses, career paths, discipline strategies, and long-term architecture.

---

## Features

- **11-section introspection framework** — 50+ questions across psychology, career, and behavioral science
- **Real-time progress tracking** — radar chart, completion %, focus score, procrastination risk
- **Dark/light theme** — toggle in the top bar
- **Auto-save** — all answers persist in `localStorage`
- **Export** — JSON (backup), formatted text, plain text, PDF via browser print
- **Streaming AI responses** — analysis streams in live
- **Keyboard shortcuts** — `Ctrl+S` save, `Ctrl+A` analyze, `Ctrl+D` download, `Ctrl+I` import
- **Fully self-contained** — one HTML file, zero build step, zero dependencies

---

## Setup

### 1. Deploy the Cloudflare Worker

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the Worker
cd /path/to/kyth
wrangler deploy ai-worker.js
```

When prompted, bind Workers AI to the Worker:
- **Name:** `AI`
- **Type:** `Workers AI`
- **Model:** `@cf/meta/llama-3-8b-instruct`

Copy the Worker URL — it will look like:
```
https://kyth-ai.your-subdomain.workers.dev/ai
```

### 2. Update the HTML

Open `kyth.html` and set your Worker URL:

```js
// Line ~2328
const AI_ENDPOINT = "https://kyth-ai.your-subdomain.workers.dev/ai";
```

### 3. Deploy to Cloudflare Pages

**Option A — Drag and drop:**
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create a project
2. Upload the `kyth.html` file directly
3. Deploy

**Option B — Git:**
```bash
npx wrangler pages deploy kyth.html --project-name=kyth
```

---

## File Structure

```
kyth/
├── kyth.html          # The app (single file)
├── ai-worker.js       # Cloudflare Worker proxy
├── Report.md          # Project assessment & roadmap
└── README.md          # This file
```

---

## CSP Configuration

The HTML includes a Content Security Policy meta tag. If you deploy to a custom domain, update the `connect-src` directive to include your Worker URL:

```
connect-src 'self' https://your-worker.workers.dev https://your-worker.workers.dev/*;
```

---

## Cost

- **Cloudflare Pages:** Free
- **Cloudflare Workers AI:** ~4,000 free requests/month on the base tier
- **Total cost at low scale:** $0

---

## Privacy

- All answers are stored in the browser's `localStorage` — nothing is sent to any server except the AI Worker
- The AI Worker only receives the compiled prompt — no user identity is tracked
- Consider adding localStorage encryption for sensitive use cases

---

## Roadmap

See [Report.md](./Report.md) for the full diagnostic analysis and phased roadmap.

---

## License

Personal project. Use freely.
