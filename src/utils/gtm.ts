const GTM_ID = "GTM-KZNMLW32";

type GtmParams = Record<string, unknown>;

export function ensureGtmLoaded(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const w = window as Window & {
    gtagLoaded?: boolean;
    __gtmLoading?: Promise<void>;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };

  if (w.gtagLoaded) return Promise.resolve();
  if (w.__gtmLoading) return w.__gtmLoading;

  w.__gtmLoading = new Promise<void>((resolve) => {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`;
    script.async = true;
    script.onload = () => {
      w.dataLayer = w.dataLayer || [];
      w.gtag = (...args: unknown[]) => {
        w.dataLayer?.push(args);
      };
      w.gtag("js", new Date());
      w.gtag("config", GTM_ID, { debug_mode: true });
      w.gtagLoaded = true;
      resolve();
    };
    document.head.appendChild(script);
  });

  return w.__gtmLoading;
}

export async function trackGtmEvent(
  event: string,
  params: GtmParams,
): Promise<void> {
  await ensureGtmLoaded();
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", event, params);
}
