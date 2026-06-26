import type { Metadata } from "next";

/** Category/brand pages: index unless PIM explicitly disables it. */
export function robotsFromIndexing(
  indexing?: boolean | null,
): NonNullable<Metadata["robots"]> {
  return { index: indexing ?? true, follow: true };
}

/**
 * Product detail pages only render when the public frontend API returns data.
 * Unapproved Flow drafts are not returned by that API (page → notFound).
 * QA approval is enforced by the API, not the seo.indexing flag (legacy bulk false values).
 */
export function liveProductRobots(): NonNullable<Metadata["robots"]> {
  return { index: true, follow: true };
}

export const UNAVAILABLE_PAGE_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
};
