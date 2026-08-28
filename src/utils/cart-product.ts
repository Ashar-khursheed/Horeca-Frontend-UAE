/** Cart API product may use `name`/`images` or newer `title`/`image_urls`. */

type LocaleStr = { en?: string; ar?: string } | string | null | undefined;

export function resolveCartLocale(v: LocaleStr): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  return v.en ?? v.ar ?? "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cartProductName(product: any): string {
  return resolveCartLocale(product?.title) || resolveCartLocale(product?.name);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cartProductImage(product: any): string {
  const urls = product?.image_urls ?? product?.images;
  if (!urls) return "";
  if (typeof urls === "string") return urls;
  if (Array.isArray(urls)) return (urls[0] as string) ?? "";
  const en = urls.en;
  const ar = urls.ar;
  if (Array.isArray(en) && en[0]) return en[0];
  if (Array.isArray(ar) && ar[0]) return ar[0];
  if (typeof en === "string") return en;
  if (typeof ar === "string") return ar;
  return "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cartProductSupplier(product: any): any {
  return product?.suppliers?.[0] ?? product?.product_suppliers?.[0] ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cartProductUnit(product: any): string {
  const st = product?.selling_type;
  return (
    resolveCartLocale(st?.attribute_value_unit) ||
    st?.en?.attribute_value_unit ||
    st?.ar?.attribute_value_unit ||
    "Each"
  );
}
