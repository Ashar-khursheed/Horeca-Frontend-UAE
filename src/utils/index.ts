export const slugToTitle = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export const revalidate = 3600;
export const productDetailRevalidate = 3600;
