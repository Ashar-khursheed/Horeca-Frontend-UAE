"use client";

import { AnimatePresence, motion } from "framer-motion";
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
interface Blog {
  id: number;
  slug: string;
  name: string;
  author: string;
  written_by: string;
  mobile_banner: string;
  mobile_banner_alt: string;
  description: { value: string }[];
  created_at: string;
  total_views: number;
  total_likes: number;
  total_shares: number;
  is_featured: boolean;
  tags: string[];
  category: string;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const DUMMY_BLOGS: Blog[] = [
  {
    id: 1,
    slug: "top-10-fashion-trends-2025",
    name: "Top 10 Fashion Trends Dominating 2025",
    author: "Aisha Khan",
    written_by: "Aisha Khan",
    mobile_banner:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80",
    mobile_banner_alt: "Fashion Trends 2025",
    description: [
      {
        value:
          "Discover the most captivating fashion trends that are reshaping wardrobes around the world this year. From quiet luxury to bold maximalism, we cover it all.",
      },
    ],
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    total_views: 4821,
    total_likes: 312,
    total_shares: 89,
    is_featured: true,
    tags: ["Fashion", "Trends", "Style"],
    category: "Fashion",
  },
  {
    id: 2,
    slug: "how-to-style-linen-in-summer",
    name: "How to Style Linen for a Perfect Summer Look",
    author: "Sara Mirza",
    written_by: "Sara Mirza",
    mobile_banner:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
    mobile_banner_alt: "Linen Summer Style",
    description: [
      {
        value:
          "Linen is the ultimate summer fabric. Learn how to pair it with the right accessories and footwear for an effortlessly chic warm-weather wardrobe.",
      },
    ],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    total_views: 3105,
    total_likes: 198,
    total_shares: 54,
    is_featured: false,
    tags: ["Summer", "Linen", "Styling"],
    category: "Style Guide",
  },
  {
    id: 3,
    slug: "sustainable-fashion-guide",
    name: "The Complete Guide to Sustainable Fashion Shopping",
    author: "Zara Ahmed",
    written_by: "Zara Ahmed",
    mobile_banner:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80",
    mobile_banner_alt: "Sustainable Fashion",
    description: [
      {
        value:
          "Make conscious choices without compromising on style. Our guide walks you through ethical brands, eco-friendly fabrics, and smart shopping habits.",
      },
    ],
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    total_views: 6234,
    total_likes: 445,
    total_shares: 137,
    is_featured: true,
    tags: ["Sustainable", "Eco", "Conscious"],
    category: "Lifestyle",
  },
  {
    id: 4,
    slug: "capsule-wardrobe-essentials",
    name: "Building the Perfect Capsule Wardrobe: 20 Essentials",
    author: "Nida Hussain",
    written_by: "Nida Hussain",
    mobile_banner:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    mobile_banner_alt: "Capsule Wardrobe",
    description: [
      {
        value:
          "A capsule wardrobe isn't about having fewer clothes — it's about having the right ones. We break down 20 timeless pieces every modern closet needs.",
      },
    ],
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    total_views: 8910,
    total_likes: 621,
    total_shares: 203,
    is_featured: false,
    tags: ["Capsule", "Minimalism", "Wardrobe"],
    category: "Style Guide",
  },
  {
    id: 5,
    slug: "accessorize-like-a-pro",
    name: "Accessorize Like a Pro: The Art of Finishing an Outfit",
    author: "Hina Baig",
    written_by: "Hina Baig",
    mobile_banner:
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80",
    mobile_banner_alt: "Accessories Guide",
    description: [
      {
        value:
          "The right accessories can transform any outfit from ordinary to extraordinary. Learn the golden rules of accessorizing from our style experts.",
      },
    ],
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    total_views: 2750,
    total_likes: 187,
    total_shares: 61,
    is_featured: false,
    tags: ["Accessories", "Styling", "Tips"],
    category: "Fashion",
  },
  {
    id: 6,
    slug: "color-theory-for-fashion",
    name: "Color Theory for Fashion: Dress to Impress Every Time",
    author: "Aisha Khan",
    written_by: "Aisha Khan",
    mobile_banner:
      "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=600&q=80",
    mobile_banner_alt: "Color Theory Fashion",
    description: [
      {
        value:
          "Understanding color combinations can be the game changer your wardrobe needs. Dive into color theory and how to apply it to everyday dressing.",
      },
    ],
    created_at: new Date(Date.now() - 21 * 86400000).toISOString(),
    total_views: 5430,
    total_likes: 378,
    total_shares: 112,
    is_featured: true,
    tags: ["Color", "Theory", "Style"],
    category: "Style Guide",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const diffInDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const estimateReadTime = (description: { value: string }[]): number => {
  if (!description?.length) return 3;
  const words = description
    .map((d) => d.value)
    .join(" ")
    .replace(/<[^>]*>/g, "")
    .split(/\s+/).length;
  return Math.ceil(words / 200);
};

const formatCount = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

// ─── Animation Variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.42, 0, 0.58, 1] as [number, number, number, number] },
  },
};

const headerVariants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] as [number, number, number, number] } },
};

const CATEGORY_COLORS: Record<string, string> = {
  Fashion: "from-rose-500 to-pink-600",
  "Style Guide": "from-violet-500 to-purple-600",
  Lifestyle: "from-emerald-500 to-teal-600",
};

// ─── Single Blog Card ─────────────────────────────────────────────────────────
const BlogCard: React.FC<{ item: Blog; index: number }> = ({ item, index }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.total_likes);
  const [shareCount, setShareCount] = useState(item.total_shares);
  const [viewCount, setViewCount] = useState(item.total_views);
  const [heartBeat, setHeartBeat] = useState(false);
  const [shared, setShared] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
    setHeartBeat(true);
    setTimeout(() => setHeartBeat(false), 600);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareCount((c) => c + 1);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewCount((c) => c + 1);
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      className="group relative bg-white rounded-3xl overflow-hidden flex flex-col"
      style={{
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)",
      }}
      
    >
      {/* Hover glow border */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none z-10"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          background:
            "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.04) 100%)",
          border: "1.5px solid rgba(16,185,129,0.35)",
        }}
      />

      {/* ── Image ── */}
      <div
        className="relative overflow-hidden bg-gray-100"
        style={{ aspectRatio: "16/10" }}
      >
        <motion.img
          src={item.mobile_banner}
          alt={item.mobile_banner_alt || item.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          loading="lazy"
        />

        {/* Dark gradient on hover */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
          }}
        />

        {/* Trending Badge */}
        {item.is_featured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg"
            style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)" }}
          >
            <TrendingUp className="w-3 h-3" />
            Trending
          </motion.div>
        )}

        {/* Category Badge */}
        <div
          className={`absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${
            CATEGORY_COLORS[item.category] ?? "from-gray-600 to-gray-700"
          }`}
        >
          {item.category}
        </div>

        {/* Read-time pill */}
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
            <span className="font-semibold text-gray-700">{item.written_by}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3 text-emerald-500" />
            {formatDate(item.created_at)}
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-100"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-gray-900 text-[17px] font-extrabold line-clamp-2 mb-2.5 leading-snug tracking-tight group-hover:text-emerald-700 transition-colors duration-300 cursor-pointer">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-grow">
          {item.description[0]?.value?.replace(/<[^>]*>/g, "").trim()}
        </p>

        {/* Divider */}
        <div
          className="h-px mb-4"
          style={{
            background:
              "linear-gradient(to right, transparent, #e5e7eb, transparent)",
          }}
        />

        {/* Stats & Actions */}
        <div className="flex items-center justify-between">
          {/* Views + Share */}
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleView}
              className="flex items-center gap-1.5 text-gray-400 hover:text-emerald-600 transition-colors text-xs font-semibold"
            >
              <Eye className="w-4 h-4" />
              {formatCount(viewCount)}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                shared
                  ? "text-blue-500"
                  : "text-gray-400 hover:text-blue-500"
              }`}
            >
              <Share2 className="w-4 h-4" />
              {formatCount(shareCount)}
            </motion.button>
          </div>

          {/* Like */}
          <motion.button
            whileTap={{ scale: 1.25 }}
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
              liked
                ? "bg-red-50 text-red-500"
                : "bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50"
            }`}
          >
            <motion.div
              animate={
                heartBeat ? { scale: [1, 1.5, 1], rotate: [0, -15, 0] } : {}
              }
              transition={{ duration: 0.4 }}
            >
              <Heart
                className={`w-4 h-4 transition-all ${
                  liked ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </motion.div>
            {formatCount(likeCount)}
          </motion.button>
        </div>

        {/* Read More CTA */}
        <Link href={`/blog/${item.slug}`}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 w-full py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-lg"
            // style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
          >
            <span className="relative z-10">Read Article</span>
            <motion.div
              className="relative z-10"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────
export const BlogsCard: React.FC<{ showAll?: boolean }> = ({
  showAll = false,
}) => {
  const blogs = showAll ? DUMMY_BLOGS : DUMMY_BLOGS.slice(0, 6);

  return (
    <section className="my-16 px-4 sm:px-6 lg:px-8 global-container hidden md:block">
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="flex items-center justify-between mb-10 flex-wrap gap-4"
      >
        <div className="flex items-center gap-4">
          {/* <motion.div
            animate={{ rotate: [0, 15, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="p-3 rounded-2xl shadow-lg"
            style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div> */}
          <div>
            <h2 className="text-gray-900 font-extrabold heading-font-size tracking-tight leading-none">
              Latest Blogs & Insights
            </h2>
            <p className="text-gray-400 text-sm mt-1 font-medium">
              Style tips, trends &amp; fashion stories curated for you
            </p>
          </div>
        </div>

        {!showAll && (
          <Link href="/blog">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3 rounded-md font-bold text-sm cursor-pointer border-2 border-green-700 text-green-700 hover:bg-green-800 hover:text-white transition-all duration-300"
            >
              <BookOpen className="w-4 h-4" />
              View All Posts
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </Link>
        )}
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 gap-6"
      >
        <AnimatePresence>
          {blogs.map((item, index) => (
            <BlogCard key={item.id} item={item} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default React.memo(BlogsCard);