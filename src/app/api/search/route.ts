import { NextRequest, NextResponse } from "next/server";
import { runProductSearch } from "@/lib/search/run-product-search";
import { shouldUseMeilisearch } from "@/lib/search/config";

export const dynamic = "force-dynamic";

/** GET /api/search?query=medal&page=1&length=8 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const query = sp.get("query") ?? sp.get("q") ?? "";
  const page = Math.max(1, Number(sp.get("page") ?? "1"));
  const length = Math.min(50, Math.max(1, Number(sp.get("length") ?? "20")));
  const sort_by = sp.get("sort_by") ?? undefined;
  const sort_dir = sp.get("sort_dir") ?? undefined;
  const applied_filters = sp.get("applied_filters") ?? undefined;

  if (!query.trim()) {
    return NextResponse.json({ success: false, message: "query required" }, { status: 400 });
  }

  const result = await runProductSearch({
    query: query.trim(),
    page,
    length,
    sort_by,
    sort_dir,
    applied_filters,
  });

  if (!result) {
    return NextResponse.json({ success: false, message: "search failed" }, { status: 502 });
  }

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "private, max-age=0, must-revalidate",
      "X-Search-Provider": shouldUseMeilisearch() ? "meilisearch" : "nlp",
    },
  });
}
