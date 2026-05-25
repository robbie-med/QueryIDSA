"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Guideline, Category } from "@/lib/guidelines";

interface Props {
  guidelines: Guideline[];
  categories: Category[];
}

export function TileGrid({ guidelines, categories }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return guidelines;
    return guidelines.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.shortLabel.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        (g.notes ?? "").toLowerCase().includes(q),
    );
  }, [guidelines, query]);

  const grouped = useMemo(() => {
    const map = new Map<Category, Guideline[]>();
    for (const cat of categories) map.set(cat, []);
    for (const g of filtered) map.get(g.category)?.push(g);
    return map;
  }, [filtered, categories]);

  return (
    <div>
      <div className="mb-6">
        <label htmlFor="search" className="sr-only">
          Search diagnoses
        </label>
        <input
          id="search"
          type="search"
          inputMode="search"
          placeholder="Search — e.g. pneumonia, UTI, MRSA"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg shadow-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
          autoComplete="off"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-center text-slate-600 shadow-sm">
          No matches. Try a different term.
        </p>
      ) : (
        categories.map((cat) => {
          const items = grouped.get(cat) ?? [];
          if (items.length === 0) return null;
          return (
            <section key={cat} className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                {cat}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {items.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guideline/${g.slug}`}
                    className="group flex min-h-[7.5rem] flex-col justify-between rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition active:scale-[0.98] hover:ring-accent-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 sm:min-h-[8.5rem] sm:p-5"
                  >
                    <div>
                      <div className="text-base font-semibold leading-tight text-ink-900 sm:text-lg">
                        {g.shortLabel}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 sm:text-sm">{g.title}</div>
                    </div>
                    {g.notes && (
                      <div className="mt-3 text-[11px] font-medium uppercase tracking-wider text-accent-600">
                        {g.notes}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
