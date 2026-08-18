import type { VariantItem } from "./types";

export function formatMoney(n: number) {
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function variantPrice(v: VariantItem) {
  const sale = Number(v.sale_price);
  const base = Number(v.price);
  if (Number.isFinite(sale) && sale > 0 && sale < base) return sale;
  return Number.isFinite(base) ? base : 0;
}

export function unitFromLabel(label: string) {
  const match = label.match(/\(([^)]+)\)/);
  if (!match?.[1]) return "";
  const unit = match[1].trim();
  if (/^qt\.?$/i.test(unit)) return "Qt.";
  return unit;
}

/** Split "12 Pans" / "29" + "in" into a large value and a small unit line. */
export function splitChipLabel(value: string, fallbackUnit: string) {
  const trimmed = value.trim();
  const numbered = trimmed.match(
    /^(\d+(?:\.\d+)?(?:\s*\/\s*\d+)?)\s+(.+)$/,
  );
  if (numbered) {
    return {
      primary: numbered[1].replace(/\s+/g, ""),
      secondary: numbered[2].trim(),
    };
  }
  const unit = fallbackUnit.trim();
  if (
    unit &&
    !trimmed.toLowerCase().includes(unit.toLowerCase().replace(/\.$/, ""))
  ) {
    return { primary: trimmed, secondary: unit };
  }
  return { primary: trimmed, secondary: "" };
}

export function chooseHeading(label: string) {
  if (/capacity/i.test(label)) return "Choose Bowl Capacity";
  const clean = label.replace(/\s*\([^)]*\)\s*$/, "").trim();
  return clean ? `Choose ${clean}` : "Choose option";
}

export function isCapacityGroup(label: string) {
  return /capacity/i.test(label);
}

export function sortVariants(variants: VariantItem[]) {
  return [...variants].sort((a, b) => {
    const na = Number.parseFloat(a.attribute_value);
    const nb = Number.parseFloat(b.attribute_value);
    if (Number.isFinite(na) && Number.isFinite(nb) && na !== nb) return na - nb;
    return a.attribute_value.localeCompare(b.attribute_value, undefined, {
      numeric: true,
    });
  });
}

export function variantHref(url: string) {
  if (!url) return "";
  try {
    if (url.startsWith("http")) {
      const path = new URL(url).pathname.replace(/^\/+/, "");
      return path ? `/${path}` : "";
    }
  } catch {
    /* ignore */
  }
  const path = url.replace(/^\/+/, "");
  return path ? `/${path}` : "";
}

export function variantSlug(url: string) {
  const href = variantHref(url);
  const parts = href.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

export function localizeAttr(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    const record = value as { en?: string; ar?: string };
    return record.en ?? record.ar ?? "";
  }
  return "";
}

type LooseAttribute = {
  attribute_name?: unknown;
  attribute_value?: unknown;
  measurement_unit?: unknown;
};

export function specValue(
  attributes: LooseAttribute[],
  names: string[],
  mode: "includes" | "exact" = "includes",
) {
  const lower = names.map((n) => n.toLowerCase());
  const hit = attributes.find((a) => {
    const name = localizeAttr(a.attribute_name).toLowerCase().trim();
    return lower.some((needle) =>
      mode === "exact" ? name === needle : name.includes(needle),
    );
  });
  const value = localizeAttr(hit?.attribute_value);
  if (!value) return "—";
  const unit = localizeAttr(hit?.measurement_unit);
  return unit ? `${value} ${unit}` : value;
}

function dimNumber(raw: string) {
  return raw.replace(/\s*(inch(?:es)?|in\.?|")$/i, "").trim();
}

/** Product/shipping size only — never cutting board, interior, shelf, etc. */
function primaryDimValue(attributes: LooseAttribute[], axis: string) {
  const hit = attributes.find((a) => {
    const name = localizeAttr(a.attribute_name).toLowerCase().trim();
    if (
      /cutting board|interior|shelf|door|pan|caster|cord|worksurface|work surface/.test(
        name,
      )
    ) {
      return false;
    }
    return (
      name === axis ||
      name === `product ${axis}` ||
      name === `shipping ${axis}`
    );
  });
  const value = localizeAttr(hit?.attribute_value);
  if (!value) return "";
  const unit = localizeAttr(hit?.measurement_unit);
  return unit ? `${value} ${unit}` : value;
}

export function specDimensions(attributes: LooseAttribute[]) {
  const w = primaryDimValue(attributes, "width");
  const l =
    primaryDimValue(attributes, "depth") ||
    primaryDimValue(attributes, "length");
  const h = primaryDimValue(attributes, "height");
  if (w && l && h) {
    return `${dimNumber(w)} (W) × ${dimNumber(l)} (L) × ${dimNumber(h)} (D)`;
  }
  const parts = [w, l, h].filter(Boolean);
  if (parts.length >= 2) {
    const labels = ["W", "L", "D"];
    return parts
      .map((part, i) => `${dimNumber(part)} (${labels[i]})`)
      .join(" × ");
  }
  const fallback = specValue(attributes, ["dimension", "overall size"]);
  return fallback === "—" ? "—" : fallback;
}

export function attributesToMap(attributes: LooseAttribute[]) {
  const map: Record<string, string> = {};
  for (const attribute of attributes) {
    const name = localizeAttr(attribute.attribute_name).trim();
    const value = localizeAttr(attribute.attribute_value).trim();
    if (!name || !value) continue;
    const unit = localizeAttr(attribute.measurement_unit).trim();
    map[name] = unit ? `${value} ${unit}` : value;
  }
  const dimensions = specDimensions(attributes);
  if (dimensions && dimensions !== "—") map.Dimensions = dimensions;
  return map;
}

const SKIP_COMPARE =
  /^(manufacturer|brand|country of origin|selling unit|warranty|features|sku|model|model number|description|notes|alt text|certification|compliance|made in|product type|type|color|style|lift type|power type|speeds|rpm|hertz|plug type|installation type|insulation material|interior material|shelf material|caster type|number of casters|casters|shipping weight|product weight|weight)$/i;

const SIZE_PART = /width|depth|height|length/i;

/** Always show these even when values match — they are buying criteria. */
const ALWAYS_COMPARE = /\bpans?\b|^dimensions$/i;

function normalizeKey(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeValue(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function columnRank(name: string) {
  const key = normalizeKey(name);
  if (key.includes("pan")) return 12;
  if (key === "dimensions") return 11;
  if (/(number of )?doors?$/.test(key) || key.includes("door")) return 10;
  if (key.includes("weight")) return 0;
  if (key.includes("horsepower") || key === "hp") return 6;
  if (key.includes("volt") || key.includes("amp")) return 5;
  if (key.includes("capacity") || key.includes("cubic")) return 4;
  return 1;
}

/**
 * Specs that change between options, plus a few always-useful ones (e.g. pans).
 */
export function pickCompareColumns(
  maps: Record<string, string>[],
  limit = 6,
) {
  const loaded = maps.filter((map) => Object.keys(map).length > 0);
  if (!loaded.length) return [];

  const grouped = new Map<string, { display: string; values: string[] }>();
  for (const map of loaded) {
    for (const [name, raw] of Object.entries(map)) {
      const key = normalizeKey(name);
      if (!grouped.has(key)) grouped.set(key, { display: name, values: [] });
      grouped.get(key)!.values.push(normalizeValue(raw));
    }
  }

  const hasDimensions = grouped.has("dimensions");
  const canDiff = loaded.length >= 2;

  return [...grouped.entries()]
    .filter(([, item]) => {
      if (SKIP_COMPARE.test(item.display)) return false;
      if (normalizeKey(item.display).includes("weight")) return false;
      if (hasDimensions && SIZE_PART.test(item.display)) return false;
      const filled = item.values.filter(Boolean);
      if (!filled.length) return false;
      if (filled.some((value) => value.length > 70)) return false;
      const always = ALWAYS_COMPARE.test(item.display);
      if (always) return true;
      if (!canDiff) return false;
      if (filled.length < 2) return false;
      return new Set(filled).size > 1;
    })
    .sort(
      (a, b) =>
        columnRank(b[1].display) - columnRank(a[1].display) ||
        a[1].display.localeCompare(b[1].display),
    )
    .slice(0, limit)
    .map(([, item]) => item.display);
}

export function lookupSpec(
  row: Record<string, string> | undefined,
  column: string,
) {
  if (!row) return "";
  if (row[column]) return row[column];
  const key = normalizeKey(column);
  const hit = Object.entries(row).find(
    ([name]) => normalizeKey(name) === key,
  );
  return hit?.[1] ?? "";
}
