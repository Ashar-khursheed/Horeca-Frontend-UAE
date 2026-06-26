import type { Metadata } from "next";

/** Category/brand pages: index unless PIM explicitly disables it. */
export function robotsFromIndexing(
  indexing?: boolean | null,
): NonNullable<Metadata["robots"]> {
  return { index: indexing ?? true, follow: true };
}

/**
 * Product pages: always allow indexing.
 * PIM currently returns indexing=false on all products (bulk import default),
 * which blocks Google from ranking the entire catalog.
 */
export const PRODUCT_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
};
