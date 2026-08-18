import { NextRequest, NextResponse } from "next/server";
import { getMeilisearchClient, getIndexUid } from "@/lib/search/meilisearch-client";
import { MEILISEARCH_INDEX_SETTINGS } from "@/lib/search/meilisearch-index-settings";
import { isMeilisearchConfigured } from "@/lib/search/config";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * POST /api/search/sync — apply Meilisearch index settings.
 * Full product upload: npm run search:sync
 */
export async function POST(request: NextRequest) {
  const secret =
    request.headers.get("x-search-sync-secret") ??
    request.nextUrl.searchParams.get("secret");
  const expected =
    process.env.SEARCH_SYNC_SECRET ?? process.env.REVALIDATION_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!isMeilisearchConfigured()) {
    return NextResponse.json(
      { message: "Meilisearch is not configured (set MEILISEARCH_HOST)" },
      { status: 503 },
    );
  }

  try {
    const client = getMeilisearchClient();
    const task = await client.index(getIndexUid()).updateSettings(
      MEILISEARCH_INDEX_SETTINGS,
    );
    await client.tasks.waitForTask(task.taskUid);

    return NextResponse.json({
      ok: true,
      index: getIndexUid(),
      message: "Index settings applied. Run npm run search:sync to upload products.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "sync failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
