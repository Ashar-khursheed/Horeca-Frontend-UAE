"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { BlogCard } from "@/components/blog-card";
import BannerImg from "@/assets/banners/blog/Blog Banner 1920 x 500.webp";
import type { BlogCategory } from "./page";

// ─── Horizontal slider per category ──────────────────────────────────────────
function CategoryRow({ category }: { category: BlogCategory }) {
  console.log("dsadasdasdasd",category)
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category.blogs]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>("[data-card]")?.offsetWidth ?? 300;
    el.scrollBy({ left: dir === "left" ? -(cardWidth + 24) * 2 : (cardWidth + 24) * 2, behavior: "smooth" });
  };

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 px-4 sm:px-6 lg:px-8 global-container">
        <h2 className="flex items-center gap-2.5 text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          <span className="w-8 h-8 rounded-lg bg-[#186737] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </span>
          {category.name}
        </h2>
        {(category?.blogs?.length ?? 0) > 5 && <Link
          href={`/blog/category/${category.url?.url ?? ""}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#186737] text-[#186737] text-sm font-semibold hover:bg-[#186737] hover:text-white transition-all"
        >
          Browse Category <ChevronRight size={14} />
        </Link>}
        
      </div>

      {/* Slider */}
      <div className="relative">
        {canLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-[40px] top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#186737] hover:border-[#186737] transition-all"
          >
            <ChevronLeft size={18} />
          </button>
        )}

       <div className="global-container">
         <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto  pb-3 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {category.blogs.map((blog) => (
            <div key={blog.id} data-card className="flex-shrink-0 w-[280px] sm:w-[300px] xl:w-[320px]">
              <BlogCard item={blog} />
            </div>
          ))}
        </div>
       </div>

        {canRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-[30px] top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#186737] hover:border-[#186737] transition-all"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
interface Props {
  categories: BlogCategory[];
}

export default function BlogListClient({ categories }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100">
        <div className="global-container px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center h-10 gap-1 text-xs">
            <li>
              <Link href="/" className="text-gray-400 hover:text-[#186737] flex items-center gap-1 transition-colors">
                <Home size={11} /> Home
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight size={12} className="mx-1 text-gray-300" />
              <span className="text-[#186737] font-semibold">Blog</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Banner */}
      <Image src={BannerImg} alt="Blog Banner" className="w-full h-auto object-cover" />

      {/* Categories */}
      <main className="flex-1 py-10">
        {categories.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No categories found.</p>
        ) : (
          categories.map((cat) =>
            cat.blogs?.length ? <CategoryRow key={cat.id} category={cat} /> : null
          )
        )}
      </main>
    </div>
  );
}
