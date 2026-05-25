import { NextRequest, NextResponse } from "next/server";
import { fetchAndExtract, GuidelineFetchError } from "@/lib/fetch-guideline";
import { getGuideline } from "@/lib/guidelines";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
  const entry = getGuideline(slug);
  if (!entry) {
    return NextResponse.json(
      { error: "Unknown guideline" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const extracted = await fetchAndExtract(entry.source);
    return NextResponse.json(
      { guideline: entry, extracted },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    const status = err instanceof GuidelineFetchError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Unknown error";
    const detail = err instanceof GuidelineFetchError ? err.detail : undefined;
    return NextResponse.json(
      { error: message, detail, guideline: entry },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
