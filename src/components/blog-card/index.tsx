"use client";

import {
    BookOpen,
    Calendar,
    ChevronRight,
    Clock,
    Eye,
    Heart,
    Share2,
    TrendingUp,
    User
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ApiBlog {
  id: number;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description: any;
  thumbnail: string;
  thumbnail_alt: string;
  mobile_banner: string;
  desktop_banner: string;
  blog_date: string;
  author_name: string;
  author_description: string;
  author_designation: string;
  author_image: string;
  views_count: number;
  likes_count: number;
  shares_count: number;
  is_featured: boolean | number;
  url: string;
  category: { id: number; name: string; slug: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const diffInDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseDescription = (raw: any): string => {
  if (!raw) return "";
  // already an array of {value} objects
  if (Array.isArray(raw)) {
    return raw.map((d: { value: string }) => d.value ?? "").join(" ");
  }
  if (typeof raw !== "string") return String(raw);
  // JSON string like '[{"value":"..."}]'
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((d: { value: string }) => d.value ?? "").join(" ");
    }
    if (typeof parsed === "string") return parsed;
  } catch {
    // plain string — use as-is
  }
  return raw;
};

const stripHtml = (html: string) =>
  html?.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() ?? "";

const estimateReadTime = (raw: string): number => {
  if (!raw) return 3;
  const words = stripHtml(parseDescription(raw)).split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 200) || 1;
};

const formatCount = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n ?? 0);

// ─── Single Blog Card ─────────────────────────────────────────────────────────
const BlogCard: React.FC<{ item: ApiBlog }> = ({ item }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes_count ?? 0);
  const [shareCount, setShareCount] = useState(item.shares_count ?? 0);
  const [viewCount, setViewCount] = useState(item.views_count ?? 0);
  const [shared, setShared] = useState(false);

  const imageUrl = item.thumbnail || item.mobile_banner;
  const imageAlt = item.thumbnail_alt || item.title;
  const blogHref = item.url?.startsWith("/") ? item.url : `/${item.url}`;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked((prev) => { setLikeCount((c) => (prev ? c - 1 : c + 1)); return !prev; });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShareCount((c) => c + 1);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <Link href={blogHref} className="group relative bg-white rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)" }}>
      {/* Hover glow border */}
      {/* <div
        className="absolute inset-0 rounded-3xl pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.04) 100%)",
          border: "1.5px solid rgba(16,185,129,0.35)",
        }}
      /> */}

      {/* ── Image ── */}
      <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: "16/10" }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }}
        />

        {!!item.is_featured && (
          <div
            className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg"
            style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)" }}
          >
            <TrendingUp className="w-3 h-3" />
            Trending
          </div>
        )}

        {item.category?.name && (
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-white text-xs font-semibold bg-emerald-600">
            {item.category.name}
          </div>
        )}

        <div
          className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-gray-800 backdrop-blur-md"
          style={{ background: "rgba(255,255,255,0.88)" }}
        >
          <Clock className="w-3 h-3 text-emerald-600" />
          {estimateReadTime(item.description)} min
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Author & Date */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
              <User className="w-3 h-3 text-emerald-600" />
            </div>
            <span className="font-semibold text-gray-700">{item.author_name}</span>
          </div>
          {item.blog_date && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3 text-emerald-500" />
                {formatDate(item.blog_date)}
              </div>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-gray-900 text-[17px] font-extrabold line-clamp-2 mb-2.5 leading-snug tracking-tight group-hover:text-emerald-700 transition-colors duration-300">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-grow">
          {stripHtml(parseDescription(item.description))}
        </p>

        {/* Divider */}
        <div
          className="h-px mb-4"
          style={{ background: "linear-gradient(to right, transparent, #e5e7eb, transparent)" }}
        />

        {/* Stats & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold">
              <Eye className="w-4 h-4" />
              {formatCount(viewCount)}
            </div>

            <button
              onClick={handleShare}
              className={`flex items-center gap-1.5 text-xs font-semibold transition-colors active:scale-90 ${
                shared ? "text-blue-500" : "text-gray-400 hover:text-blue-500"
              }`}
            >
              <Share2 className="w-4 h-4" />
              {formatCount(shareCount)}
            </button>
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 active:scale-110 ${
              liked ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50"
            }`}
          >
            <Heart className={`w-4 h-4 transition-all ${liked ? "fill-red-500 text-red-500" : ""}`} />
            {formatCount(likeCount)}
          </button>
        </div>

        {/* Read More CTA */}
        <div className="group/btn mt-4 w-full py-2.5 bg-linear-to-r from-green-600 to-green-700 text-white rounded-[7px] font-semibold flex items-center justify-center gap-2 shadow-md">
          <span>Read Article</span>
          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────
export const BlogsCard: React.FC<{ showAll?: boolean; blogs?: ApiBlog[] }> = ({ showAll = false, blogs = [] }) => {
  if (!blogs.length) return null;

  return (
    <section className="md:my-16 py-6 md:py-0 px-4 sm:px-6 lg:px-8 global-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <h2 className="text-gray-900 font-extrabold heading-font-size tracking-tight leading-none">
            Latest Blogs &amp; Insights
          </h2>
          <p className="text-gray-400 text-sm mt-1 font-medium">
            Tips, trends &amp; stories curated for you
          </p>
        </div>

        {!showAll && (
          <Link
            href="/blog"
            className="flex items-center gap-2 px-6 py-3 rounded-[7px] font-bold text-sm border-2 border-green-700 text-green-700 hover:bg-green-800 hover:text-white transition-all duration-300"
          >
            <BookOpen className="w-4 h-4" />
            View All Posts
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {blogs.map((item) => (
          <BlogCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default React.memo(BlogsCard);
