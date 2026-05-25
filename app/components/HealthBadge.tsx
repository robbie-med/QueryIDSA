"use client";

import { useEffect, useState } from "react";

type Health = {
  checkedAt: string;
  total: number;
  okCount: number;
  failing: { slug: string; title: string }[];
};

export function HealthBadge() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = (await res.json()) as Health;
        if (!cancelled) setHealth(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Health check failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
        Checking IDSA links…
      </div>
    );
  }
  if (error || !health) {
    return (
      <div className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
        Monitor unavailable
      </div>
    );
  }
  const allOk = health.failing.length === 0;
  return (
    <details className="group">
      <summary
        className={`flex cursor-pointer list-none items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
          allOk ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${allOk ? "bg-emerald-500" : "bg-amber-500"}`}
          aria-hidden
        />
        {allOk
          ? `${health.okCount}/${health.total} IDSA links reachable`
          : `${health.failing.length} link(s) need attention`}
      </summary>
      {!allOk && (
        <ul className="mt-2 space-y-1 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
          {health.failing.map((f) => (
            <li key={f.slug}>• {f.title}</li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[11px] text-slate-500">
        Checked {new Date(health.checkedAt).toLocaleString()}
      </p>
    </details>
  );
}
