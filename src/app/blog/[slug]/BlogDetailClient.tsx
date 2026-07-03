"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Send,
  User,
  Lock,
  Clock,
  Calendar,
  ChevronRight,
  Bookmark,
  MessageCircle,
  Share2,
  Home,
  ArrowRight,
} from "lucide-react";
import { BlogsCard } from "@/components/blog-card";
import { ShareModal } from "@/components/share-modal";
import BlogComments, { Comment as BlogComment } from "@/components/blog-comments";
import Breadcrumb from "@/components/breadcum";
import SeoContent from "@/seo/seo-content";
import BlogSidebarForm from "@/components/blog-sidebar-form";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ApiBlogSeo {
  url: string;
  primary_keyword: string | null;
  title_tag: string | null;
  meta_title: string | null;
  meta_description: string | null;
  indexing: boolean;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  schema: string | null;
}

export interface CustomCard {
  tab2_title: string;
  tab2_content: string;
  tab2_image: string;
  button_name: string;
  button_link: string;
}

export interface ApiBlogDetail {
  id: number;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description: any;
  desktop_banner: string;
  desktop_banner_alt: string;
  mobile_banner: string;
  thumbnail: string;
  blog_date: string;
  author_name: string;
  author_description: string;
  author_designation: string | null;
  author_image: string;
  views_count: number;
  likes_count: number;
  shares_count: number;
  url: string;
  category: { id: number; name: string; slug: string | null };
  seo: ApiBlogSeo | null;
  custom_card: CustomCard | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseDescriptionBlocks = (raw: any): { id: string; value: string }[] => {
  if (!raw) return [];
  try {
    const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (Array.isArray(arr)) {
      return arr.map((item, i) => ({ id: `block-${i}`, value: item?.value ?? "" }));
    }
  } catch {
    return [{ id: "block-0", value: typeof raw === "string" ? raw : "" }];
  }
  return [];
};

const extractToc = (blocks: { value: string }[]): { id: string; text: string }[] => {
  const toc: { id: string; text: string }[] = [];
  const seen = new Set<string>();
  const headingRe = /<h[23][^>]*>(.*?)<\/h[23]>/gi;
  blocks.forEach((block) => {
    let match;
    while ((match = headingRe.exec(block.value)) !== null) {
      const rawText = match[1]
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (!rawText) continue;
      const id = rawText
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 60);
      const uniqueId = seen.has(id) ? `${id}-${seen.size}` : id;
      seen.add(uniqueId);
      toc.push({ id: uniqueId, text: rawText });
    }
  });
  return toc;
};

const estimateReadTime = (blocks: { value: string }[]): number => {
  const totalText = blocks.map((b) => b.value.replace(/<[^>]+>/g, " ")).join(" ");
  const words = totalText.split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 200) || 1;
};

// Inject IDs into headings so scroll-to works
const injectHeadingIds = (html: string): string => {
  let result = html.replace(/<(h[23])([^>]*)>(.*?)<\/h[23]>/gi, (_, tag, attrs, inner) => {
    const rawText = inner.replace(/<[^>]+>/g, "").trim();
    const id = rawText
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });
  // strip blank &nbsp; paragraphs
  result = result.replace(/<p[^>]*>(\s|&nbsp;)*<\/p>/gi, "");
  return result;
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function BlogDetailClient({
  blog,
  initialComments,
}: {
  blog: ApiBlogDetail;
  initialComments: BlogComment[];
}) {
  const router = useRouter();
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const blocks = parseDescriptionBlocks(blog.description);
  const toc = extractToc(blocks);
  const readTime = estimateReadTime(blocks);

  useEffect(() => {
    const handleScroll = () => {
      const total =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setReadingProgress(total > 0 ? (window.scrollY / total) * 100 : 0);

      if (toc.length === 0) return;
      const scrollPos = window.scrollY + 150;
      let current = "";
      toc.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && scrollPos >= el.offsetTop) current = id;
      });
      setActiveSection(current);
    };

    let ticking = false;
    const listener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => { handleScroll(); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener("scroll", listener);
    handleScroll();
    return () => window.removeEventListener("scroll", listener);
  }, [toc]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
    setActiveSection(id);
  };

  const bannerSrc = blog.desktop_banner || blog.mobile_banner || blog.thumbnail;
  const authorImg = blog.author_image;

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: blog.title, href: null },
  ];

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-0.75 bg-gray-200 z-[9999]">
        <div
          className="h-full bg-linear-to-r from-[#186737] to-emerald-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Breadcrumb */}
      {/* <nav className="bg-white border-b border-gray-100">
        <div className="global-container px-4 lg:px-6">
          <ol className="flex items-center h-10 gap-1 text-xs flex-wrap">
            <li>
              <Link href="/" className="text-gray-400 hover:text-[#186737] flex items-center gap-1 transition-colors">
                <Home size={11} /> Home
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight size={12} className="mx-1 text-gray-300" />
              <Link href="/blog" className="text-gray-400 hover:text-[#186737] transition-colors">Blog</Link>
            </li>
            <li className="flex items-center min-w-0">
              <ChevronRight size={12} className="mx-1 text-gray-300 shrink-0" />
              <span className="text-[#186737] font-semibold truncate">{blog.title}</span>
            </li>
          </ol>
        </div>
      </nav> */}

      <Breadcrumb crumbs={crumbs} />

      <div className="bg-gray-50 min-h-screen">
        <div className="global-container px-4 lg:px-6 py-6 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── Main Content ── */}
            <article className="lg:col-span-8 min-w-0">

              {/* Title */}
              <h1 className="text-2xl md:text-3xl xl:text-4xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
                {blog.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-5 pb-5 border-b border-gray-200">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#186737]/10 flex items-center justify-center shrink-0">
                    <User size={12} className="text-[#186737]" />
                  </div>
                  <span className="font-semibold text-gray-700">{blog.author_name}</span>
                </div>
                {blog.blog_date && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#186737]" />
                      <span>{formatDate(blog.blog_date)}</span>
                    </div>
                  </>
                )}
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-[#186737]" />
                  <span>{readTime} min read</span>
                </div>
                <button
                  onClick={() => setShareOpen(true)}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-[#186737]/10 hover:bg-[#186737] hover:text-white text-[#186737] rounded-full text-xs font-semibold transition-all"
                >
                  <Share2 size={13} /> Share
                </button>
              </div>

              {/* Banner */}
              {bannerSrc && (
                <div className="rounded-xl overflow-hidden shadow-md mb-8">
                  <img
                    src={bannerSrc}
                    alt={blog.desktop_banner_alt || blog.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* TOC — mobile only */}
              {/* {toc.length > 0 && (
                <div className="lg:hidden mb-8 bg-white rounded-[7px] border border-gray-200 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                    <Bookmark size={16} className="text-[#186737]" />
                    <h2 className="text-sm font-bold text-gray-900">Table of Contents</h2>
                  </div>
                  <nav className="p-3 space-y-0.5">
                    {toc.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-[7px] flex items-start gap-2 transition-all ${
                          activeSection === item.id
                            ? "bg-[#186737]/10 text-[#186737] font-semibold"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <ChevronRight size={14} className="shrink-0 mt-0.5" />
                        <span className="text-left">{item.text}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              )} */}

              {/* Blog Content */}
              <div className="blog-content bg-white rounded-[7px] border border-gray-200 shadow-sm p-6 sm:p-8 mb-8">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    dangerouslySetInnerHTML={{ __html: injectHeadingIds(block.value) }}
                  />
                ))}
              </div>

              {/* Author Bio */}
              <div className="bg-white rounded-[7px] border border-gray-200 shadow-sm p-6 sm:p-8 mb-8">
                <div className="flex items-start gap-4 sm:gap-5">
                  {authorImg ? (
                    <img
                      src={authorImg}
                      alt={blog.author_name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-[#186737]/20 shadow-md shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#186737]/10 flex items-center justify-center shrink-0">
                      <User size={28} className="text-[#186737]" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[#186737] uppercase tracking-widest mb-1">Author</p>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5">{blog.author_name}</h3>
                    {blog.author_designation && (
                      <p className="text-[#186737] text-sm font-medium mb-3">{blog.author_designation}</p>
                    )}
                    {blog.author_description && (
                      <p className="text-gray-600 leading-relaxed text-sm">{blog.author_description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments */}
              <BlogComments blogId={blog.id} initialComments={initialComments} />
            </article>

            {/* ── Sidebar ── */}
            <aside className="lg:col-span-4 min-w-0 lg:flex lg:flex-col lg:h-full">
              <div className="space-y-5 lg:flex-1">

                {/* TOC — desktop */}
                {toc.length > 0 && (
                  <div className="hidden lg:block bg-white rounded-[7px] border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                      <Bookmark size={15} className="text-[#186737]" />
                      <h3 className="text-sm font-bold text-gray-900">Table of Contents</h3>
                    </div>
                    <nav className="p-3 space-y-0.5 max-h-[60vh] overflow-y-auto">
                      {toc.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-[7px] flex items-start gap-2 transition-all ${activeSection === item.id
                              ? "bg-[#186737]/10 text-[#186737] font-semibold"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                          <ChevronRight size={13} className="shrink-0 mt-0.5" />
                          <span className="text-left leading-snug">{item.text}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                )}

                {/* Custom Card — tab2 only */}
                {blog.custom_card && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex items-center gap-4">
                      {/* Left: text + button */}
                      <div className="flex-1 min-w-0">
                        {blog.custom_card.tab2_title && (
                          <h3 className="text-[20px] font-extrabold text-[#186737] mb-2 leading-snug">
                            {blog.custom_card.tab2_title}
                          </h3>
                        )}
                        {blog.custom_card.tab2_content && (
                          <p className="text-[13px] text-gray-700 leading-relaxed mb-3">
                            {blog.custom_card.tab2_content}
                          </p>
                        )}
                        {blog.custom_card.button_name && blog.custom_card.button_link && (
                          <Link
                            href={blog.custom_card.button_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-[#186737] hover:text-[#fff] bg-[#186737] text-white text-[13px] font-semibold  rounded-[6px] transition-all duration-200 px-7 py-2"
                          >
                            {blog.custom_card.button_name}
                            <ArrowRight size={11} />
                          </Link>
                        )}
                      </div>

                      {/* Right: image */}
                      {blog.custom_card.tab2_image && (
                        <div className="w-[200px] h-[200px] shrink-0 rounded-2xl overflow-hidden shadow-sm">
                          <img
                            src={blog.custom_card.tab2_image}
                            alt={blog.custom_card.tab2_title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sticky Form & CTA Container */}
                <div className="lg:sticky lg:top-[20px] xl:top-[10px] space-y-3 lg:space-y-2 xl:space-y-5 h-fit">
                  {/* Consultation Inquiry Form */}
                  <BlogSidebarForm type="Blog Page Sidebar Inquiry" />

                  {/* Register CTA Card */}
                  <div className="bg-gradient-to-br from-[#186737] to-[#22a34e] rounded-2xl p-5 lg:p-3 xl:p-5 text-white overflow-hidden relative">
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />
                    <div className="relative">
                      {/* <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                        <User size={18} className="text-white" />
                      </div> */}
                      <h3 className="text-base lg:text-sm xl:text-base font-extrabold mb-1 leading-snug">
                        Join HorecaStore Today
                      </h3>
                      <p className="text-white/75 text-xs lg:hidden xl:block leading-relaxed mb-4 xl:mb-4">
                        Get exclusive deals, track orders, and access premium commercial kitchen equipment.
                      </p>
                      <Link
                        href="/register"
                        className="flex items-center justify-center gap-2 w-full bg-white text-[#186737] text-sm lg:text-xs xl:text-sm font-bold py-2.5 lg:py-1.5 xl:py-2.5 rounded-xl hover:bg-white/90 transition-all duration-200 group"
                      >
                        Create Free Account
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      </Link>
                      <Link
                        href="/login"
                        className="flex items-center justify-center mt-2 lg:mt-1.5 xl:mt-2 w-full text-white/70 hover:text-white text-xs lg:text-[10px] xl:text-xs font-medium transition-colors"
                      >
                        Already have an account? Sign in
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </aside>
          </div>

          {/* Related Articles */}
          {/* <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-1 h-7 bg-[#186737] rounded-full" />
              Related Articles
            </h2>
            <BlogsCard />
          </div> */}
        </div>
      </div>
      <div className="bg-white md:py-10 py-3 pb-0">
        <SeoContent dataAPI={blog?.seo} />
      </div>
      <style jsx global>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4 {
          color: #111827;
          scroll-margin-top: 120px;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 0.875rem;
          line-height: 1.3;
        }
        .blog-content h1 { font-size: 1.6rem; }
        .blog-content h2 { font-size: 1.375rem; }
        .blog-content h3 { font-size: 1.15rem; color: #1f2937; }
        .blog-content p {
          line-height: 1.85;
          color: #374151;
          margin-bottom: 1.125rem;
          font-size: 0.9375rem;
        }
        .blog-content img {
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          max-width: 100%;
          width: 100%;
          height: auto;
          display: block;
        }
        .blog-content a { color: #186737; text-decoration: underline; font-weight: 500; }
        .blog-content ul,
        .blog-content ol {
          padding-left: 1.5rem;
          margin: 1.25rem 0;
          list-style-type: disc;
        }
        .blog-content ol { list-style-type: decimal; }
        .blog-content li {
          line-height: 1.75;
          margin-bottom: 0.625rem;
          color: #374151;
          font-size: 0.9375rem;
        }
        .blog-content strong { color: #111827; font-weight: 700; }
        .blog-content figure.table {
          margin: 1.25rem 0;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          display: block;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }
        .blog-content figure { margin: 1.25rem 0; }
        .blog-content table {
          width: 100%;
          min-width: 480px;
          border-collapse: collapse;
          font-size: 0.8125rem;
        }
        .blog-content td,
        .blog-content th {
          border: 1px solid #e5e7eb;
          padding: 0.5rem 0.75rem;
          vertical-align: top;
          line-height: 1.5;
        }
        .blog-content tr:first-child td,
        .blog-content th {
          background: #f3f4f6;
          font-weight: 600;
          color: #111827;
        }
        .blog-content tr:nth-child(even) td { background: #f9fafb; }
        .blog-content figure.table table { border: none; }
        .blog-content > div:first-child h2,
        .blog-content > div:first-child h3 { margin-top: 0.5rem; }
      `}</style>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        url={typeof window !== "undefined" ? window.location.href : `${process.env.NEXT_SITE_URL}${blog.url?.startsWith("/") ? blog.url : `/${blog.url}`}`}
        title={blog.title}
      />
    </>
  );
}
