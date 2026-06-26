import type { Metadata } from "next";

/** Respect PIM indexing flag; default to indexable when unset. */
export function robotsFromIndexing(
  indexing?: boolean | null,
): NonNullable<Metadata["robots"]> {
  return { index: indexing ?? true, follow: true };
}
