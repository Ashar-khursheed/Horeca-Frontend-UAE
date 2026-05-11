"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Search, X, ArrowRight } from "lucide-react";
import { ALPHABET, BRANDS, getBrandsByLetter, getActiveLette } from "./data";
import Banner from "@/assets/banners/brands/BrandBanner.jpg"
import Image from "next/image";
export default function BrandsPage() {
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const navRef = useRef<HTMLDivElement>(null);

  const brandsByLetter = getBrandsByLetter();
  const activeLetters = getActiveLette();

  const filtered = search.trim()
    ? BRANDS.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  // Active letter on scroll
  useEffect(() => {
    if (search) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLetter(entry.target.getAttribute("data-letter") || "");
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [search]);

  const scrollToLetter = (letter: string) => {
    const el = sectionRefs.current[letter];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 130;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveLetter(letter);
  };

  const clearSearch = () => setSearch("");

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

      {/* <section>
        <Image src={Banner} alt="Brands" className="w-full h-auto" />
      </section> */}
<div className="relative w-full">
  {/* <img
    className="w-full h-auto object-cover"
    src="/images/BrandBanner.jpg"
    alt="Banner"
  /> */}

   <Image src={Banner} alt="Brands" className="w-full h-auto" />

  <div className="absolute inset-0 flex items-center pl-8 md:pl-16">
    <div className="max-w-md space-y-1 md:space-y-2 lg:space-y-2">
      <h1 className="text-[12px] md:text-2xl lg:text-[30px] font-bold text-yellow-400 leading-tight">
        Get to Know Why Leading
        <br />
        Brands Choose Us as Their
        <br />
        Trusted Dealer
      </h1>

      <h2 className="text-white text-[8px] md:text-[12px] lg:text-[16px] mt-[5px] md:mt-[12px] lg:mt-[16px]">
        Everything you need in one B2B integrated platform.
        <br />
        It’s easier with Horecastore.
      </h2>

      <button
        type="button"
        className="bg-white text-red-600 font-semibold px-2 pt-[2px] pb-[2px] md:px-2 md:py-3 md:text-[12px] lg:text-lg text-[8px] rounded hover:bg-gray-100 transition"
      >
        Join Marketplace
      </button>
    </div>
  </div>
</div>

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="global-container py-8 md:py-12 text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#186737] mb-2 leading-tight">
            Get to Know Why Leading Brands Choose Us<br className="hidden md:block" /> as Their Trusted Dealer
          </h1>
          <p className="text-base font-semibold text-gray-700 mb-3">
            Trusted Commercial Equipment Brands
          </p>
          <p className="text-sm text-gray-500 max-w-3xl mx-auto leading-relaxed">
            HorecaStore brings together a wide range of trusted commercial equipment brands designed for hotels, restaurants, and cafés. From kitchen essentials and food preparation equipment to refrigeration, storage, and service solutions, our brand selection helps hospitality professionals find reliable products in one place. Each brand is chosen for quality, durability, and industry performance, making it easier to compare options and shop with confidence.
          </p>

          {/* Search */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brands..."
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#186737]/30 focus:border-[#186737] text-sm transition-all"
            />
            {search && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Alphabet Nav */}
        {!search && (
          <div
            ref={navRef}
            className="sticky top-0 z-30 bg-white border-t border-b border-gray-100 shadow-sm"
          >
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
        {/* Search Results */}
        {filtered ? (
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
                {filtered.map((brand) => (
                  <BrandCard key={brand.slug} brand={brand} />
                ))}
              </div>
            )}
          </div>
        ) : (
          // Grouped by letter
          <div className="space-y-12">
            {ALPHABET.filter((l) => activeLetters.has(l)).map((letter) => (
              <section
                key={letter}
                ref={(el) => { sectionRefs.current[letter] = el; }}
                data-letter={letter}
              >
                {/* Letter heading */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 bg-[#186737] text-white rounded-xl flex items-center justify-center text-xl font-extrabold shadow-md flex-shrink-0">
                    {letter}
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Brand grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {brandsByLetter[letter].map((brand) => (
                    <BrandCard key={brand.slug} brand={brand} />
                  ))}
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
function BrandCard({ brand }: { brand: (typeof BRANDS)[number] }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/brands/${brand.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {imgError ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
              <span className="text-2xl font-black text-[#186737] opacity-40">
                {brand.name[0]}
              </span>
            </div>
          ) : (
            <img
              src={brand.image}
              alt={brand.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          {/* Category pill */}
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#186737] border border-green-100 backdrop-blur-sm">
            {brand.category}
          </span>
        </div>

        {/* Body */}
        <div className="p-3">
          <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-[#186737] transition-colors mb-1 line-clamp-1">
            {brand.name}
          </h3>
          <p className="text-[11px] text-gray-400 line-clamp-1 mb-3">
            {brand.tagline}
          </p>

          {/* Shop button */}
          <div className="flex items-center justify-between gap-2 border border-[#186737] rounded-lg px-3 py-1.5 group-hover:bg-[#186737] transition-colors">
            <span className="text-xs font-semibold text-[#186737] group-hover:text-white transition-colors">
              Shop {brand.name}
            </span>
            <ArrowRight size={12} className="text-[#186737] group-hover:text-white transition-colors flex-shrink-0" />
          </div>
        </div>
      </div>
    </Link>
  );
}
