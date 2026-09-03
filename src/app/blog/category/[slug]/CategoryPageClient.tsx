"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronRight, Home, LayoutGrid } from "lucide-react";
import { BlogsCard } from "@/components/blog-card";
import Pagination from "@/components/pagination";
import type { ApiBlog } from "@/components/blog-card";
import type { CategoryInfo } from "./page";

interface Props {
  category: CategoryInfo;
  blogs: ApiBlog[];
  totalPages: number;
  currentPage: number;
}

export default function CategoryPageClient({ category, blogs, totalPages, currentPage }: Props) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    const slug = category.url?.url ?? "";
    router.push(page > 1 ? `/blog/category/${slug}?page=${page}` : `/blog/category/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── Breadcrumb ── */}
      <nav className="bg-white border-b border-gray-100">
        <div className="global-container px-4 lg:px-6">
          <ol className="flex items-center h-10 gap-1 text-xs flex-wrap">
            <li>
              <Link
                href="/"
                className="text-gray-400 hover:text-[#186737] flex items-center gap-1 transition-colors"
              >
                <Home size={11} /> Home
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight size={12} className="mx-1 text-gray-300" />
              <Link href="/blog" className="text-gray-400 hover:text-[#186737] transition-colors">
                Blog
              </Link>
            </li>
            <li className="flex items-center min-w-0">
              <ChevronRight size={12} className="mx-1 text-gray-300 shrink-0" />
              <span className="text-[#186737] font-semibold truncate">{category.name}</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* ── Category Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="global-container px-4 lg:px-6 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#186737]/10 flex items-center justify-center shrink-0">
              <LayoutGrid size={18} className="text-[#186737]" />
            </div>
            <span className="text-xs font-bold text-[#186737] uppercase tracking-widest">Category</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            {category.name}
          </h1>
          {category.description && (
            <p
              className="text-gray-500 text-base max-w-2xl"
              dangerouslySetInnerHTML={{ __html: category.description }}
            />
          )}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <BookOpen size={15} className="text-[#186737]" />
            <span>
              <strong className="text-gray-700">{blogs.length}</strong> articles on this page
            </span>
          </div>
        </div>
      </div>

      {/* ── Blog Grid ── */}
      <div className="py-10">
        {blogs.length ? (
          <>
            <BlogsCard blogs={blogs} showAll />
            {totalPages > 1 && (
              <div className="global-container px-4 sm:px-6 lg:px-8 pb-12 mt-6">
                <Pagination
                  totalPages={totalPages}
                  initialPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="global-container px-4 py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles yet</h3>
            <p className="text-gray-400 text-sm mb-6">No blog posts found in this category.</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#186737] text-white rounded-[7px] hover:bg-[#145c2e] transition-colors text-sm font-semibold"
            >
              ← Browse all articles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
