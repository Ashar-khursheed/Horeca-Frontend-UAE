"use client";

import { Megaphone, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export type MarketingPromotion = {
  id: number;
  title: string;
  description: string;
  cta_button_text: string | null;
  link_type: "link" | "pdf" | string;
  link: string | null;
  pdf_url: string | null;
  image_url: string | null;
  is_active: boolean;
};

function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function promoTarget(promo: MarketingPromotion): {
  href: string;
  external: boolean;
} | null {
  if (promo.link_type === "pdf" && promo.pdf_url) {
    return { href: promo.pdf_url, external: true };
  }
  const url = promo.link?.trim();
  if (!url) return null;
  if (url.startsWith("/")) return { href: url, external: false };
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("horecastore")) {
      return {
        href: `${parsed.pathname}${parsed.search}${parsed.hash}` || "/",
        external: false,
      };
    }
    return { href: url, external: true };
  } catch {
    return { href: url, external: false };
  }
}

function PromoEmptyState() {
  return (
    <div className="relative w-full h-full rounded-[7px] border border-dashed border-[#c8e6d3] bg-[#edf7f1] flex flex-col items-center justify-center px-5 text-center">
      <div className="w-11 h-11 rounded-full bg-white border border-[#c8e6d3] flex items-center justify-center mb-3 shadow-sm">
        <Megaphone size={18} className="text-[#186737]" />
      </div>
      <p className="text-sm font-bold text-gray-800">No promotions found</p>
      <p className="text-[12px] text-gray-500 mt-1 max-w-[220px] leading-relaxed">
        There are no active marketing offers right now. Check back soon.
      </p>
    </div>
  );
}

function CtaButton({ label }: { label: string }) {
  return (
    <span className="mt-2 inline-flex w-fit items-center bg-[#186737] hover:bg-[#145c30] text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-[6px]">
      {label}
    </span>
  );
}

function PromoLink({
  target,
  className,
  children,
}: {
  target: { href: string; external: boolean } | null;
  className?: string;
  children: React.ReactNode;
}) {
  if (!target) return <div className={className}>{children}</div>;
  if (target.external) {
    return (
      <a
        href={target.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`block ${className ?? ""}`}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={target.href} className={`block ${className ?? ""}`}>
      {children}
    </Link>
  );
}

function PromoCard({
  promo,
  priority,
  target,
}: {
  promo: MarketingPromotion;
  priority: boolean;
  target: { href: string; external: boolean } | null;
}) {
  const cta = promo.cta_button_text?.trim();
  const desc = stripHtml(promo.description ?? "");
  const hasImage = !!promo.image_url?.startsWith("http");

  return (
    <div className="grid grid-cols-[70%_30%] h-full w-full bg-[#e2e8f033] rounded-[7px]">
      <div className="relative flex flex-col justify-center px-3 sm:px-4 pt-3 pb-8">
        <PromoLink target={target} className="outline-none">
          {promo.title && (
            <h3 className="text-[#186737] font-bold text-base sm:text-lg 2xl:text-xl leading-snug line-clamp-2">
              {promo.title}
            </h3>
          )}
          {desc && (
            <p className="text-[#666666] text-[13px] sm:text-sm 2xl:text-base my-2 font-medium line-clamp-2 leading-relaxed">
              {desc}
            </p>
          )}
        </PromoLink>
        <a
          href="tel:+971800467322"
          className="inline-flex w-fit items-center gap-1.5 text-[#186737] font-semibold text-sm sm:text-[15px] my-1"
        >
          <Phone size={16} strokeWidth={2.2} />
          800-467-322
        </a>
        {cta && (
          <PromoLink target={target} className="w-fit outline-none">
            <CtaButton label={cta} />
          </PromoLink>
        )}
      </div>
      <PromoLink target={target} className="relative h-full outline-none">
        {hasImage ? (
          <Image
            src={promo.image_url!}
            alt={promo.title || "Promotion"}
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 30vw, 12vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Megaphone size={28} className="text-[#186737]/30" />
          </div>
        )}
      </PromoLink>
    </div>
  );
}

export default function PromotionsSlider({
  promotions = [],
}: {
  promotions?: MarketingPromotion[];
}) {
  const items = promotions;

  if (items.length === 0) {
    return <PromoEmptyState />;
  }

  const canSlide = items.length > 1;

  return (
    <div className="relative w-full h-full">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={
          canSlide
            ? {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        pagination={canSlide ? { clickable: true } : false}
        rewind={canSlide}
        watchOverflow={false}
        observer
        observeParents
        className="promo-swiper swiper-pagination-dark w-full h-full"
      >
        {items.map((promo, index) => {
          const target = promoTarget(promo);
          const card = (
            <PromoCard promo={promo} priority={index === 0} target={target} />
          );

          return <SwiperSlide key={promo.id}>{card}</SwiperSlide>;
        })}
      </Swiper>
    </div>
  );
}
