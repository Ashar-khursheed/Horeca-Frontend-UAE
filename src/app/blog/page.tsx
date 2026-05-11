"use client";

import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { BlogsCard } from "@/components/blog-card";
import BannerImg from "@/assets/banners/blog/Blog Banner 1920 x 500.webp";
import Image from "next/image";
export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

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
              <span className="text-[#186737] font-semibold">Blog</span>
            </li>
          </ol>
        </div>
      </nav>



      <main className="flex-1">
        <Image src={BannerImg} alt="Blog Banner" className="w-full h-auto object-cover" />
        {/* Page title */}
        {/* <div className="global-container pt-10 pb-2">
          <h1 className="text-3xl font-black text-gray-900">Blog & Resources</h1>
          <p className="text-gray-500 text-sm mt-1">
            Tips, buying guides, and industry insights for food service professionals.
          </p>
        </div> */}

        {/* All blog cards via shared component */}
        <BlogsCard showAll={true} />
      </main>
    </div>
  );
}
