import { Readability } from "@mozilla/readability";
import { JSDOM, VirtualConsole } from "jsdom";

const USER_AGENT =
  "QueryIDSA/0.1 (live-proxy for clinician lookup; no caching; contact via repository)";

const FETCH_TIMEOUT_MS = 12_000;
const MAX_BYTES = 4_000_000;

export interface ExtractedGuideline {
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

export class GuidelineFetchError extends Error {
  status: number;
  detail?: string;
  constructor(message: string, status: number, detail?: string) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

function assertIdsaUrl(url: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new GuidelineFetchError("Invalid URL", 400);
  }
  if (parsed.protocol !== "https:") {
    throw new GuidelineFetchError("Only https URLs are allowed", 400);
  }
  if (!/(^|\.)idsociety\.org$/i.test(parsed.hostname)) {
    throw new GuidelineFetchError("URL must be on idsociety.org", 400);
  }
  return parsed;
}

async function fetchBounded(url: string): Promise<{ html: string; finalUrl: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (err) {
    clearTimeout(timer);
    const msg = err instanceof Error ? err.message : String(err);
    throw new GuidelineFetchError("Network error reaching IDSA", 502, msg);
  }
  clearTimeout(timer);

  if (!res.ok) {
    throw new GuidelineFetchError(`IDSA responded ${res.status}`, 502, await safeText(res));
  }
  const ctype = res.headers.get("content-type") ?? "";
  if (!ctype.toLowerCase().includes("text/html")) {
    throw new GuidelineFetchError(
      "IDSA returned non-HTML content (likely a PDF). Use the source link.",
      415,
      ctype,
    );
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new GuidelineFetchError("No response body", 502);
  }
  const decoder = new TextDecoder("utf-8");
  let received = 0;
  let html = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_BYTES) {
      try {
        await reader.cancel();
      } catch {
        /* ignore */
      }
      throw new GuidelineFetchError("Response exceeded size limit", 413);
    }
    html += decoder.decode(value, { stream: true });
  }
  html += decoder.decode();

  return { html, finalUrl: res.url || url };
}

async function safeText(res: Response): Promise<string | undefined> {
  try {
    const t = await res.text();
    return t.slice(0, 200);
  } catch {
    return undefined;
  }
}

export async function fetchAndExtract(sourceUrl: string): Promise<ExtractedGuideline> {
  const parsed = assertIdsaUrl(sourceUrl);
  const { html, finalUrl } = await fetchBounded(parsed.toString());

  const virtualConsole = new VirtualConsole();
  virtualConsole.on("error", () => {});
  virtualConsole.on("warn", () => {});
  virtualConsole.on("jsdomError", () => {});

  const dom = new JSDOM(html, { url: finalUrl, virtualConsole });
  const doc = dom.window.document;

  const reader = new Readability(doc, {
    charThreshold: 200,
  });
  const article = reader.parse();
  if (!article || !article.content) {
    throw new GuidelineFetchError(
      "Could not extract readable content from the IDSA page",
      422,
    );
  }

  return {
    title: article.title?.trim() || doc.title?.trim() || "IDSA guideline",
    byline: article.byline?.trim() || null,
    publishedTime: article.publishedTime ?? null,
    excerpt: article.excerpt?.trim() || null,
    contentHtml: article.content,
    textLength: article.length ?? 0,
    fetchedAt: new Date().toISOString(),
    sourceUrl,
    finalUrl,
  };
}

export async function probe(sourceUrl: string): Promise<{ ok: boolean; status: number; detail?: string }> {
  try {
    assertIdsaUrl(sourceUrl);
  } catch (err) {
    if (err instanceof GuidelineFetchError) {
      return { ok: false, status: err.status, detail: err.message };
    }
    return { ok: false, status: 400, detail: "Invalid URL" };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(sourceUrl, {
      method: "GET",
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    const ctype = res.headers.get("content-type") ?? "";
    if (!res.ok) return { ok: false, status: res.status, detail: `HTTP ${res.status}` };
    if (!ctype.toLowerCase().includes("text/html")) {
      return { ok: false, status: 415, detail: `Non-HTML (${ctype})` };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    clearTimeout(timer);
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, status: 0, detail: msg };
  }
}
