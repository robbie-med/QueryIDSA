import { notFound } from "next/navigation";
import Link from "next/link";
import { getGuideline } from "@/lib/guidelines";
import { GuidelineView } from "@/app/components/GuidelineView";

export const dynamic = "force-dynamic";

export default async function GuidelinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getGuideline(slug);
  if (!entry) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
        >
          ← All diagnoses
        </Link>
      </div>
      <GuidelineView slug={entry.slug} />
    </main>
  );
}

export function generateStaticParams() {
  return [];
}
