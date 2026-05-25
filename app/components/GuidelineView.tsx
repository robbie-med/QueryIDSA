"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Extracted {
  title: string;
  byline: string | null;
  publishedTime: string | null;
  excerpt: string | null;
  contentHtml: string;
  textLength: number;
  fetchedAt: string;
  sourceUrl: string;
  finalUrl: string;
}

interface SuccessPayload {
  guideline: { title: string; shortLabel: string; source: string; notes?: string };
  extracted: Extracted;
}

interface ErrorPayload {
  error: string;
  detail?: string;
  guideline?: { title: string; shortLabel: string; source: string; notes?: string };
}

export function GuidelineView({ slug }: { slug: string }) {
  const [data, setData] = useState<SuccessPayload | null>(null);
  const [err, setErr] = useState<ErrorPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);
    setData(null);
    (async () => {
      try {
        const res = await fetch(`/api/guideline?slug=${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });
        const body = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setErr(body as ErrorPayload);
        } else {
          setData(body as SuccessPayload);
        }
      } catch (e) {
        if (!cancelled) {
          setErr({ error: e instanceof Error ? e.message : "Request failed" });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, tick]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-accent-500" />
        <p className="text-sm text-slate-600">Fetching live from idsociety.org…</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-red-200">
        <h2 className="text-lg font-semibold text-red-800">Could not load this guideline</h2>
        <p className="mt-1 text-sm text-red-700">{err.error}</p>
        {err.detail && (
          <p className="mt-1 break-words text-xs text-red-600">{err.detail}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setTick((t) => t + 1)}
            className="rounded-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
          >
            Try again
          </button>
          {err.guideline && (
            <a
              href={err.guideline.source}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Open on idsociety.org ↗
            </a>
          )}
          <Link
            href="/"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;
  const { extracted, guideline } = data;
  const fetched = new Date(extracted.fetchedAt);
  const published = extracted.publishedTime ? new Date(extracted.publishedTime) : null;

  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800">
            Live · not stored
          </span>
          {guideline.notes && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
              {guideline.notes}
            </span>
          )}
          {published && (
            <span>Source dated {published.toLocaleDateString()}</span>
          )}
          <span>· Fetched {fetched.toLocaleString()}</span>
        </div>
        <button
          onClick={() => setTick((t) => t + 1)}
          className="rounded-full border border-slate-300 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">{extracted.title}</h1>
      {extracted.byline && (
        <p className="mt-1 text-sm text-slate-600">{extracted.byline}</p>
      )}
      {extracted.excerpt && (
        <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
          {extracted.excerpt}
        </p>
      )}

      <div
        className="article-content mt-6"
        dangerouslySetInnerHTML={{ __html: extracted.contentHtml }}
      />

      <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-200 pt-4 text-sm">
        <a
          href={extracted.finalUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-accent-500 px-4 py-2 font-semibold text-white hover:bg-accent-600"
        >
          Open original on idsociety.org ↗
        </a>
        <Link
          href="/"
          className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
        >
          ← Back to diagnoses
        </Link>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Reader-extracted from the official IDSA page. Tables, footnotes, and figures may be
        condensed or omitted — verify with the original source before clinical use.
      </p>
    </article>
  );
}
