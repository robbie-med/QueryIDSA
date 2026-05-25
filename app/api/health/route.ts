import { NextResponse } from "next/server";
import { GUIDELINES } from "@/lib/guidelines";
import { probe } from "@/lib/fetch-guideline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const checkedAt = new Date().toISOString();
  const results = await Promise.all(
    GUIDELINES.map(async (g) => {
      const r = await probe(g.source);
      return { slug: g.slug, title: g.title, source: g.source, ...r };
    }),
  );
  const failing = results.filter((r) => !r.ok);
  return NextResponse.json(
    {
      checkedAt,
      total: results.length,
      okCount: results.length - failing.length,
      failing,
      results,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
