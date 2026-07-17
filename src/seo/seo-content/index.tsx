"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LocaleStr {
  en?: string | null;
  ar?: string | null;
}

interface PopularTagDetail {
  popularTags: string;
  popularSlug: string;
}

export interface SeoApiData {
  id?: number;
  url?: string;
  banner_slug?: string | null;
  banner_image_url?: LocaleStr | null;
  banner_image_alt_text?: LocaleStr | null;
  paragraph_1?: LocaleStr | null;
  paragraph_2?: LocaleStr | null;
  paragraph_3?: LocaleStr | null;
  paragraph_4?: LocaleStr | null;
  popular_tag_details?: {
    en?: PopularTagDetail[] | null;
    ar?: PopularTagDetail[] | null;
  } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLocaleStr(
  obj: LocaleStr | string | null | undefined,
  locale: string,
): string | null {
  if (!obj) return null;
  if (typeof obj === "string") return obj || null;
  const val = locale === "ar" ? obj.ar : obj.en;
  return val ?? obj.en ?? obj.ar ?? null;
}

// ─── Popular Searches Component ───────────────────────────────────────────────

function PopularSearches({
  keywords,
  basePath,
}: {
  keywords: PopularTagDetail[];
  basePath: string;
}) {
  const filtered = keywords.filter((k) => k?.popularTags?.trim() !== "");
  if (!filtered.length) return null;

  return (
    <div className="bg-gray-50 border-t border-gray-100 py-6 mt-6">
      <div className="global-container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Popular Searches
        </p>
        <div className="flex flex-wrap gap-2">
          {filtered.map((item, index) => (
            <Link
              key={index}
            href={
                item.popularSlug?.includes("/blog")
                  ? `${item.popularSlug}`
                  : `/${item.popularSlug}`
              }
              className="inline-block text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:border-[#186737] hover:text-[#186737] hover:bg-green-50 px-3 py-1.5 rounded-full transition-all duration-200"
            >
              {item.popularTags}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Paragraph Component ──────────────────────────────────────────────────────

const Paragraph = memo(({ content }: { content: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      setShowButton(scrollHeight > clientHeight + 10);
    }
  }, [content]);

  return (
    <div className="mb-5">
      <div
        ref={contentRef}
        className={`text-[14px] leading-6 text-gray-500 font-normal text-left transition-all duration-300 ease-in-out seo-content ${
          isExpanded ? "" : "line-clamp-4"
        }`}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {showButton && (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-2 text-[13px] font-semibold text-[#186737] hover:text-primary-hover underline underline-offset-2 transition-colors duration-200"
        >
          {isExpanded ? "Read Less ↑" : "Read More ↓"}
        </button>
      )}
    </div>
  );
});

Paragraph.displayName = "Paragraph";

// ─── Main SeoContent Component ────────────────────────────────────────────────

export default function SeoContent({
  dataAPI,
  basePath = "",
}: {
  dataAPI?: any | null;
  basePath?: string;
}) {
  const locale = useLocale();
  if (!dataAPI) return null;;
console.log("dataAPI", dataAPI);
  const bannerUrl = getLocaleStr(dataAPI.banner_image_url, locale);
  const bannerAlt = getLocaleStr(dataAPI.banner_image_alt_text, locale);
  const para1 = getLocaleStr(dataAPI.paragraph_1, locale);
  const para2 = getLocaleStr(dataAPI.paragraph_2, locale);
  const para3 = getLocaleStr(dataAPI.paragraph_3, locale);
  const para4 = getLocaleStr(dataAPI.paragraph_4, locale);

  const popularTagsObj = dataAPI.popular_tag_details;
  const popularTags: PopularTagDetail[] = Array.isArray(popularTagsObj)
    ? popularTagsObj
    : ((locale === "ar" ? popularTagsObj?.ar : popularTagsObj?.en) ??
      popularTagsObj?.en ??
      []);
  const hasPopularTags = popularTags.some((k) => k?.popularTags?.trim());

  if (!para1 && !para2 && !para3 && !para4 && !bannerUrl && !hasPopularTags) return null;

  return (
    <>
      <style>{`
        .seo-content h1 { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 8px; margin-top: 12px; }
        .seo-content h2 { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 8px; margin-top: 12px; }
        .seo-content h3 { font-size: 15px; font-weight: 600; color: #1f2937; margin-bottom: 6px; margin-top: 10px; }
        .seo-content ul { list-style: disc; padding-left: 20px; margin-bottom: 8px; }
        .seo-content li { margin-bottom: 4px; }
        .seo-content p { margin-bottom: 8px; }
        .seo-content a { color: #186737; text-decoration: underline; }
        .seo-content strong { color: #374151; }
      `}</style>

      <section className="global-container px-4 sm:px-6 lg:px-8">
        {bannerUrl && (
          <div className="mt-8">
            <Link
              href={dataAPI.banner_slug || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={bannerUrl}
                alt={bannerAlt || "SEO Banner"}
                className="w-full rounded-[7px] object-cover"
                loading="lazy"
              />
            </Link>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-2">
          {para1 && <Paragraph content={para1} />}
          {para2 && <Paragraph content={para2} />}
          {para3 && <Paragraph content={para3} />}
          {para4 && <Paragraph content={para4} />}
        </div>
      </section>

      {popularTags.length > 0 && (
        <PopularSearches keywords={popularTags} basePath={basePath} />
      )}
    </>
  );
}
