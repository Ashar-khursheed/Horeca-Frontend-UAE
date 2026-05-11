"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Home,
  ChevronRight,
  MapPin,
  Calendar,
  Tag,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { BRANDS } from "../data";

export default function BrandDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const brand = BRANDS.find((b) => b.slug === slug);

  if (!brand) {
    return (
      <div className="global-container py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Brand not found</h1>
        <p className="text-gray-500 mb-6">
          No brand found for <strong>{slug}</strong>.
        </p>
        <Link
          href="/brands"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#186737] text-white rounded-xl hover:bg-green-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Brands
        </Link>
      </div>
    );
  }

  // Related brands (same category, different slug)
  const related = BRANDS.filter(
    (b) => b.category === brand.category && b.slug !== brand.slug
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100">
        <div className="global-container">
          <ol className="flex items-center h-10 gap-1 text-xs flex-wrap">
            <li>
              <Link href="/" className="text-gray-400 hover:text-[#186737] flex items-center gap-1 transition-colors">
                <Home size={11} /> Home
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight size={12} className="mx-1 text-gray-300" />
              <Link href="/brands" className="text-gray-400 hover:text-[#186737] transition-colors">
                Brands
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight size={12} className="mx-1 text-gray-300" />
              <span className="text-[#186737] font-semibold">{brand.name}</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="relative h-48 sm:h-64 md:h-72 overflow-hidden">
        <img
          src={brand.image}
          alt={brand.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 global-container pb-6">
          <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm mb-2">
            {brand.category}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
            {brand.name}
          </h1>
          <p className="text-green-300 text-sm font-medium mt-1">{brand.tagline}</p>
        </div>
      </div>

      <div className="global-container py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#186737] rounded-full" />
                About {brand.name}
              </h2>
              <p className="text-gray-600 leading-relaxed">{brand.description}</p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-[#186737]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Country</p>
                  <p className="text-sm font-bold text-gray-800">{brand.country}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Calendar size={18} className="text-[#186737]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Founded</p>
                  <p className="text-sm font-bold text-gray-800">{brand.founded}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Tag size={18} className="text-[#186737]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Category</p>
                  <p className="text-sm font-bold text-gray-800">{brand.category}</p>
                </div>
              </div>
            </div>

            {/* Products placeholder */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#186737] rounded-full" />
                {brand.name} Products
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={`${brand.image}&sig=${i}`}
                        alt={`${brand.name} product ${i}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-gray-700 line-clamp-1">
                        {brand.name} Equipment {i}
                      </p>
                      <p className="text-xs text-[#186737] font-bold mt-0.5">
                        View Details
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* CTA */}
            <div className="bg-gradient-to-br from-[#186737] to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-2">Shop {brand.name}</h3>
              <p className="text-green-100 text-sm mb-5 leading-relaxed">
                Browse our complete selection of {brand.name} commercial equipment.
              </p>
              <button className="w-full bg-white text-[#186737] font-bold py-3 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2 text-sm">
                <ExternalLink size={15} />
                Browse All Products
              </button>
            </div>

            {/* Related brands */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-4">
                  Similar Brands
                </h3>
                <div className="space-y-3">
                  {related.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/brands/${b.slug}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-green-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                        <img
                          src={b.image}
                          alt={b.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-[#186737] transition-colors line-clamp-1">
                          {b.name}
                        </p>
                        <p className="text-xs text-gray-400 line-clamp-1">
                          {b.tagline}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
                <Link
                  href="/brands"
                  className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#186737] hover:underline"
                >
                  View all brands <ChevronRight size={12} />
                </Link>
              </div>
            )}

            {/* Back */}
            <Link
              href="/brands"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-[#186737] hover:text-[#186737] transition-colors"
            >
              <ArrowLeft size={15} />
              All Brands
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
