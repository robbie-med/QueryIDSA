import { CATEGORIES, GUIDELINES } from "@/lib/guidelines";
import { TileGrid } from "./components/TileGrid";
import { HealthBadge } from "./components/HealthBadge";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            QueryIDSA
          </h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            Tap a diagnosis. Fetches the official IDSA guideline page live — nothing is stored.
          </p>
        </div>
        <HealthBadge />
      </header>

      <TileGrid guidelines={GUIDELINES} categories={CATEGORIES} />

      <footer className="mt-12 border-t border-slate-200 pt-6 text-xs text-slate-500">
        <p>
          Content is fetched on-demand from{" "}
          <a
            href="https://www.idsociety.org/practice-guidelines/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            idsociety.org
          </a>{" "}
          and rendered via reader extraction. Always verify with the original source before
          clinical decision-making.
        </p>
      </footer>
    </main>
  );
}
