/** Sanitize a value so it is safe inside a downloaded filename. */
function sanitizeFilenamePart(value: string | null | undefined): string {
  return (value ?? "")
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 60);
}

function formatQuoteNumber(
  quoteNumber: string | number | null | undefined,
  fallbackId?: number,
): string {
  const raw = String(quoteNumber ?? "").trim();
  if (raw) {
    return /^qt/i.test(raw) ? raw : `QT${raw}`;
  }
  if (fallbackId != null) return `QT${fallbackId}`;
  return "";
}

/**
 * HorecaStore_Quote_[Quote_Name]_[Business_Name]_QT1234.pdf
 */
export function buildQuotePdfFilename(opts: {
  quoteName?: string | null;
  businessName?: string | null;
  quoteNumber?: string | number | null;
  quoteId?: number;
}): string {
  const parts = [
    "HorecaStore_Quote",
    sanitizeFilenamePart(opts.quoteName),
    sanitizeFilenamePart(opts.businessName),
    formatQuoteNumber(opts.quoteNumber, opts.quoteId),
  ].filter(Boolean);

  return `${parts.join("_")}.pdf`;
}
