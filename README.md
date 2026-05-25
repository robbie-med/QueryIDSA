# QueryIDSA

Tap-friendly index of common infectious-disease diagnoses that **fetches the
official IDSA guideline page live** from `idsociety.org` and renders it with
reader-style extraction. Nothing is stored on the server.

## What it does

- Big-button tile grid grouped by body system (Respiratory, Urinary, SSTI, GI,
  CNS, etc.) with type-ahead search.
- Tap a tile → server fetches the IDSA page on demand → Mozilla Readability
  extracts the main content → rendered as a clean article with a prominent
  "Open original" link.
- All responses set `Cache-Control: no-store`. No DB, no Redis, no on-disk
  cache, no static prerender of guideline content.
- A health monitor (`/api/health`) probes every catalog URL. The home page
  shows a green/amber chip; amber expands to list which links failed so a
  drifted IDSA URL is visible without anyone clicking through.

## Stack

- Next.js 15 (App Router) + React 19, deployed to Vercel.
- `@mozilla/readability` + `jsdom` (Node runtime) for content extraction.
- Tailwind CSS for the UI. No client-side state library — just React hooks.

## Project layout

```
app/
  page.tsx                   # tile grid home
  guideline/[slug]/page.tsx  # detail view, fetches /api/guideline live
  api/guideline/route.ts     # server proxy + extraction
  api/health/route.ts        # link-health monitor
  components/                # TileGrid, GuidelineView, HealthBadge
lib/
  guidelines.ts              # curated catalog (slug, title, source URL)
  fetch-guideline.ts         # fetch + Readability + safety guards
```

## Updating the catalog

Edit `lib/guidelines.ts`. Each entry needs `slug`, `title`, `shortLabel`,
`category`, and an `idsociety.org` `source` URL. The fetcher refuses anything
that isn't `https://*.idsociety.org`.

If a URL goes stale, the health badge on the home page will flip to amber and
list the failing entries.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run typecheck
```

## Deploy

**Vercel (recommended).** The app uses Next.js API routes with the Node
runtime (jsdom needs it), so any host that supports Next.js server functions
works. Vercel is the path of least resistance:

1. Sign in at [vercel.com](https://vercel.com) with the GitHub account that
   owns this repo.
2. **Add New → Project** → import `robbie-med/QueryIDSA`.
3. Framework preset auto-detects as **Next.js**. No environment variables are
   needed. Leave build/output settings at defaults.
4. **Deploy.** First build takes ~1 minute. You'll get a
   `queryidsa-<hash>.vercel.app` URL immediately; you can attach a custom
   domain afterward under Project Settings → Domains.
5. Future pushes to `main` auto-deploy. PRs get preview URLs.

**Why not GitHub Pages?** Pages is static-only. The `/api/guideline` route
runs server-side to fetch IDSA pages and extract content — moving that to
the browser fails because `idsociety.org` doesn't return CORS headers for
cross-origin requests.

**Health checks in production.** Once deployed, hit
`https://<your-domain>/api/health` periodically (or wire it into a cron / uptime
monitor) to be notified when IDSA reorganizes a guideline URL.

## Caveats

- **Not a clinical decision tool.** Reader extraction can drop tables,
  footnotes, and figures. Every detail view links to the original IDSA page;
  verify there before acting.
- The catalog URLs are best-effort. IDSA reorganizes their guideline pages
  periodically — the health monitor surfaces breakage but doesn't auto-heal.
- IDSA's full guideline documents are typically PDFs hosted off-site (often
  *Clinical Infectious Diseases*). The proxy explicitly refuses non-HTML
  responses and shows a "use the source link" message in that case.
