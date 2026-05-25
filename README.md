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

Push to Vercel — no env vars required. The API routes run on the Node runtime
(needed for `jsdom`); no Edge config necessary.

## Caveats

- **Not a clinical decision tool.** Reader extraction can drop tables,
  footnotes, and figures. Every detail view links to the original IDSA page;
  verify there before acting.
- The catalog URLs are best-effort. IDSA reorganizes their guideline pages
  periodically — the health monitor surfaces breakage but doesn't auto-heal.
- IDSA's full guideline documents are typically PDFs hosted off-site (often
  *Clinical Infectious Diseases*). The proxy explicitly refuses non-HTML
  responses and shows a "use the source link" message in that case.
