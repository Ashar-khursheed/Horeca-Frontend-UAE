/**
 * Clean-up for the Product JSON-LD that the API returns in `seo.seo_schema`.
 *
 * - `offers.url` is set to the page's canonical URL (the API sometimes points
 *   it at a different category path).
 * - `priceValidUntil` is dropped when it is already in the past: an expired
 *   date tells Google the price is no longer valid.
 *
 * Prices themselves are fixed upstream: the page fetches the schema for
 * STORE_COUNTRY_CODE so the amount always matches `priceCurrency`.
 */

type Json = Record<string, unknown>;

function isObject(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasType(node: Json, type: string): boolean {
  const t = node["@type"];
  return t === type || (Array.isArray(t) && t.includes(type));
}

function cleanOffer(offer: unknown, canonicalUrl: string, today: string): void {
  if (!isObject(offer)) return;
  offer.url = canonicalUrl;
  const validUntil = offer.priceValidUntil;
  if (typeof validUntil === "string" && validUntil.slice(0, 10) < today) {
    delete offer.priceValidUntil;
  }
}

function cleanProduct(node: Json, canonicalUrl: string, today: string): void {
  const offers = node.offers;
  const list = Array.isArray(offers) ? offers : [offers];
  for (const offer of list) {
    cleanOffer(offer, canonicalUrl, today);
    // AggregateOffer nests its offers one level deeper.
    if (isObject(offer) && offer.offers) {
      const nested = Array.isArray(offer.offers)
        ? offer.offers
        : [offer.offers];
      for (const n of nested) cleanOffer(n, canonicalUrl, today);
    }
  }
}

export function normalizeProductSchema(
  schema: unknown,
  canonicalUrl: string,
): unknown {
  if (!schema) return schema;

  let parsed: unknown = schema;
  if (typeof schema === "string") {
    try {
      parsed = JSON.parse(schema);
    } catch {
      return schema; // leave unparseable input untouched
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const roots = Array.isArray(parsed) ? parsed : [parsed];
  for (const root of roots) {
    if (!isObject(root)) continue;
    const nodes = Array.isArray(root["@graph"]) ? root["@graph"] : [root];
    for (const node of nodes) {
      if (isObject(node) && hasType(node, "Product")) {
        cleanProduct(node, canonicalUrl, today);
      }
    }
  }
  return parsed;
}
