import { CATEGORIESMAIN, CATEGORIESNAVBAR } from "@/data";

type NavNode = {
  slug?: string;
  name?: string;
  image?: string;
  children?: NavNode[];
};

const slugMeta = new Map<string, { name: string; image: string }>();

function walk(nodes: NavNode[] | undefined) {
  if (!nodes) return;
  for (const node of nodes) {
    if (node.slug && node.image && !slugMeta.has(node.slug)) {
      slugMeta.set(node.slug, {
        name: node.name ?? node.slug,
        image: node.image,
      });
    }
    walk(node.children);
  }
}

walk(CATEGORIESNAVBAR as NavNode[]);

for (const category of CATEGORIESMAIN) {
  if (!category.slug || !category.image) continue;
  const existing = slugMeta.get(category.slug);
  if (!existing?.image) {
    slugMeta.set(category.slug, {
      name: category.name,
      image: category.image,
    });
  }
}

export function lookupCategoryMeta(slug: string) {
  if (!slug) return null;
  return slugMeta.get(slug) ?? null;
}
