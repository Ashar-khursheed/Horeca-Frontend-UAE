"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Search, X, ArrowRight } from "lucide-react";
import Banner from "@/assets/banners/brands/BrandBanner.jpg";
import Image from "next/image";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface ApiBrand {
  id: number;
  name: { en: string; ar?: string };
  thumbnail: { en?: string; ar?: string | null } | null;
  logo: string;
  is_featured: boolean;
  slug: string | null;
}

interface Brand {
  id: number;
  name: string;
  image: string;
  slug: string;
  is_featured: boolean;
}

export default function BrandsPage() {
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    makeApiRequest<{ success: boolean; data: ApiBrand[] }>(apiUrls.BRANDS)
      .then((res) => {
        const list = (res?.data ?? [])
          .map((b) => ({
            id: b.id,
            name: b.name?.en ?? "",
            image: b.thumbnail?.en ?? b.logo ?? "",
            slug: b.slug ?? String(b.id),
            is_featured: b.is_featured,
          }))
          .filter((b) => b.name)
          .sort((a, b) => a.name.localeCompare(b.name));
        setBrands(list);
      })
      .finally(() => setLoading(false));
  }, []);

  const brandsByLetter: Record<string, Brand[]> = {};
  for (const brand of brands) {
    const letter = brand.name[0]?.toUpperCase() ?? "#";
    if (!brandsByLetter[letter]) brandsByLetter[letter] = [];
    brandsByLetter[letter].push(brand);
  }
  const activeLetters = new Set(Object.keys(brandsByLetter));

  const filtered = search.trim()
    ? brands.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))
    : null;

  useEffect(() => {
    if (search) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLetter(entry.target.getAttribute("data-letter") || "");
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [search, brands]);

  const scrollToLetter = (letter: string) => {
    const el = sectionRefs.current[letter];
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 130, behavior: "smooth" });
    setActiveLetter(letter);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100">
        <div className="global-container">
          <ol className="flex items-center h-10 gap-1 text-xs">
            <li>
              <Link href="/" className="text-gray-400 hover:text-[#186737] flex items-center gap-1 transition-colors">
                <Home size={11} /> Home
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight size={12} className="mx-1 text-gray-300" />
              <span className="text-[#186737] font-semibold">Brands</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Banner */}
      <div className="relative w-full overflow-hidden">
        {/* Skeleton — shown while image loads */}
        {!bannerLoaded && (
          <div className="w-full h-[120px] md:h-[220px] lg:h-[300px] bg-gray-800 animate-pulse relative">
            {/* shimmer sweep */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent" />
            {/* text placeholder lines */}
            <div className="absolute inset-0 flex items-center pl-8 md:pl-16">
              <div className="space-y-2 md:space-y-3">
                <div className="h-3 md:h-5 lg:h-7 w-40 md:w-64 lg:w-80 bg-gray-600 rounded" />
                <div className="h-3 md:h-5 lg:h-7 w-32 md:w-52 lg:w-64 bg-gray-600 rounded" />
                <div className="h-3 md:h-5 lg:h-7 w-24 md:w-44 lg:w-56 bg-gray-600 rounded" />
                <div className="h-5 md:h-7 lg:h-9 w-20 md:w-28 lg:w-32 bg-gray-700 rounded mt-1" />
              </div>
            </div>
          </div>
        )}

        {/* Actual image */}
        <Image
          src={Banner}
          alt="Brands"
          className={`w-full h-auto transition-opacity duration-500 ${bannerLoaded ? "opacity-100" : "opacity-0 absolute inset-0"}`}
          onLoad={() => setBannerLoaded(true)}
          priority
        />

        {/* Text overlay — only after image loads */}
        {bannerLoaded && (
          <div className="absolute inset-0 flex items-center pl-8 md:pl-16">
            <div className="max-w-md space-y-1 md:space-y-2 lg:space-y-2">
              <h1 className="text-[12px] md:text-2xl lg:text-[30px] font-bold text-yellow-400 leading-tight">
                Get to Know Why Leading<br />Brands Choose Us as Their<br />Trusted Dealer
              </h1>
              <h2 className="text-white text-[8px] md:text-[12px] lg:text-[16px] mt-1.25 md:mt-3 lg:mt-4">
                Everything you need in one B2B integrated platform.<br />It&apos;s easier with Horecastore.
              </h2>
              <button type="button" className="bg-white text-red-600 font-semibold px-2 pt-0.5 pb-0.5 md:px-2 md:py-3 md:text-[12px] lg:text-lg text-[8px] rounded hover:bg-gray-100 transition">
                Join Marketplace
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="global-container py-8 md:py-12 text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#186737] mb-2 leading-tight">
            Get to Know Why Leading Brands Choose Us<br className="hidden md:block" /> as Their Trusted Dealer
          </h1>
          <p className="text-base font-semibold text-gray-700 mb-3">Trusted Commercial Equipment Brands</p>
          <p className="text-sm text-gray-500 max-w-3xl mx-auto leading-relaxed">
            HorecaStore brings together a wide range of trusted commercial equipment brands designed for hotels, restaurants, and cafés. From kitchen essentials and food preparation equipment to refrigeration, storage, and service solutions, our brand selection helps hospitality professionals find reliable products in one place.
          </p>

          {/* Search */}
          <div className="mt-6 max-w-md mx-auto relative hidden">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brands..."
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#186737]/30 focus:border-[#186737] text-sm transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Alphabet Nav */}
        {!search && (
          <div ref={navRef} className="sticky top-0 z-30 bg-white border-t border-b border-gray-100 shadow-sm">
            <div className="global-container">
              <div className="flex items-center justify-center flex-wrap gap-0 py-1">
                {ALPHABET.map((letter) => {
                  const isActive = activeLetters.has(letter);
                  const isCurrent = activeLetter === letter;
                  return (
                    <button
                      key={letter}
                      onClick={() => isActive && scrollToLetter(letter)}
                      disabled={!isActive}
                      className={`w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm font-bold rounded transition-all ${
                        isCurrent
                          ? "bg-[#186737] text-white"
                          : isActive
                          ? "text-gray-700 hover:bg-green-50 hover:text-[#186737]"
                          : "text-gray-300 cursor-default"
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="global-container py-8 lg:py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-4/3 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-8 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered ? (
          <div>
            <p className="text-sm text-gray-500 mb-6">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
            </p>
            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <Search size={40} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No brands found</h3>
                <p className="text-sm text-gray-400">Try a different keyword</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {filtered.map((brand) => <BrandCard key={brand.id} brand={brand} />)}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {ALPHABET.filter((l) => activeLetters.has(l)).map((letter) => (
              <section
                key={letter}
                ref={(el) => { sectionRefs.current[letter] = el; }}
                data-letter={letter}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 bg-[#186737] text-white rounded-xl flex items-center justify-center text-xl font-extrabold shadow-md shrink-0">
                    {letter}
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {brandsByLetter[letter].map((brand) => <BrandCard key={brand.id} brand={brand} />)}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Brand Card ───────────────────────────────────────────────────────────────
function BrandCard({ brand }: { brand: Brand }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/brands/${brand.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
          {imgError ? (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100">
              <span className="text-2xl font-black text-[#186737] opacity-40">{brand.name[0]}</span>
            </div>
          ) : (
            <img
              src={brand.image}
              alt={brand.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          {brand.is_featured && (
            <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#186737] border border-green-100 backdrop-blur-sm">
              Featured
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-[#186737] transition-colors mb-3 line-clamp-1">
            {brand.name}
          </h3>
          <div className="flex items-center justify-between gap-2 border border-[#186737] rounded-lg px-3 py-1.5 group-hover:bg-[#186737] transition-colors">
            <span className="text-xs font-semibold text-[#186737] group-hover:text-white transition-colors">
              Shop {brand.name}
            </span>
            <ArrowRight size={12} className="text-[#186737] group-hover:text-white transition-colors shrink-0" />
          </div>
        </div>
      </div>
    </Link>
  );
}
