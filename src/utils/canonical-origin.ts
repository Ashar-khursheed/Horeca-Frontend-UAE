/**
 * Keep www / non-www and http / https on a single origin.
 *
 * localStorage cannot be shared across hosts, so
 * www.staging-uae.horecastore.ae and staging-uae.horecastore.ae
 * must redirect to one hostname. Cookies use the parent host so
 * they survive the hop.
 */

export function isLocalHost(hostname: string): boolean {
  const host = hostname.replace(/:\d+$/, "").toLowerCase();
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host === "[::1]"
  );
}

export function getBareHostname(hostname: string): string {
  return hostname.replace(/:\d+$/, "").toLowerCase().replace(/^www\./, "");
}

function getConfiguredCanonicalHost(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_SITE_URL || "";
  if (!raw) return null;
  try {
    const value = raw.includes("://") ? raw : `https://${raw}`;
    const host = new URL(value).hostname.toLowerCase();
    return host || null;
  } catch {
    return null;
  }
}

/** Single hostname for this site (www stripped unless NEXT_SITE_URL says otherwise). */
export function getCanonicalHostname(hostname: string): string {
  const host = hostname.replace(/:\d+$/, "").toLowerCase();
  if (isLocalHost(host)) return host;

  const bare = getBareHostname(host);

  // www.staging-uae.horecastore.ae is a subdomain typo of staging-uae...,
  // not a real apex-www pair. Always drop that extra www.
  if (host.startsWith("www.") && host.split(".").length >= 4) {
    return bare;
  }

  const configured = getConfiguredCanonicalHost();
  if (configured && getBareHostname(configured) === bare) {
    return configured;
  }

  return bare;
}

/** Domain attribute so cookies work on both www and non-www of this host. */
export function getAuthCookieDomain(hostname: string): string | undefined {
  if (isLocalHost(hostname)) return undefined;
  return getBareHostname(hostname);
}

export function getRequestHostname(headers: {
  get(name: string): string | null;
}, fallbackHostname: string): string {
  const raw =
    headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    headers.get("host")?.split(",")[0]?.trim() ||
    fallbackHostname;
  return raw.replace(/:\d+$/, "").toLowerCase();
}

export function getRequestProtocol(headers: {
  get(name: string): string | null;
}, fallbackProtocol: string): string {
  const forwarded = headers.get("x-forwarded-proto");
  const proto = (forwarded ?? fallbackProtocol.replace(":", ""))
    .split(",")[0]
    ?.trim()
    .toLowerCase();
  return proto || "https";
}

export function buildCanonicalUrl(input: {
  href: string;
  hostname: string;
  protocol: string;
}): URL | null {
  const { hostname, protocol } = input;
  if (isLocalHost(hostname)) return null;

  const canonicalHost = getCanonicalHostname(hostname);
  const needsHttps = protocol !== "https";
  const needsHost = canonicalHost !== hostname;
  if (!needsHttps && !needsHost) return null;

  const url = new URL(input.href);
  url.protocol = "https:";
  url.hostname = canonicalHost;
  url.port = "";
  return url;
}
