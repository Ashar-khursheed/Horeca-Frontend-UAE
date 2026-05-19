"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
} from "lucide-react";
import { BlogsCard } from "@/components/blog-card";

// ─── Types ────────────────────────────────────────────────────────────────────
interface BlogData {
  name: string;
  written_by: string;
  author_designation: string;
  author_desc: string;
  created_at: string;
  desktop_banner: string;
  mobile_banner: string;
  desktop_banner_alt: string;
  image: string;
  read_time: number;
  description: { id: string; value: string }[];
  faqs: { question: string; answer: string }[];
  toc: { id: string; text: string }[];
}

// ─── Dummy Blog Data ──────────────────────────────────────────────────────────
const BLOGS: Record<string, BlogData> = {
  "the-5-best-wine-coolers-and-fridges-of-2026": {
    name: "The 5 Best Wine Coolers and Fridges of 2026",
    written_by: "Mike Anderson",
    author_designation: "Commercial Refrigeration & Hospitality Expert",
    author_desc:
      "The author is a seasoned specialist in commercial refrigeration systems, sharing practical insights to help hospitality businesses select the right equipment for efficiency, food safety, and long-term cost savings. With over 15 years of industry experience, he stays updated on global trends in energy-efficient and sustainable cooling solutions.",
    created_at: "2026-05-07T00:00:00Z",
    desktop_banner:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80",
    mobile_banner:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
    desktop_banner_alt: "Top 5 Wine Coolers and Fridges 2026",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    read_time: 8,
    toc: [
      { id: "section-1-0", text: "Pre-Purchase Guide: Understanding Modern Wine Storage" },
      { id: "section-1-1", text: "Thermoelectric vs Compressor Cooling Systems" },
      { id: "section-1-2", text: "Freestanding vs Integrated Wine Fridge Models" },
      { id: "section-2-0", text: "What Is the Ideal Humidity for Wine Storage?" },
      { id: "section-3-0", text: "The Final Pour: Making Your Choice" },
    ],
    description: [
      {
        id: "block-0",
        value: `
          <p>Whether you are a casual enthusiast with home dinner parties or a seasoned sommelier with a growing vintage collection, investing in the right wine storage is non-negotiable. Storing wine at even a few degrees too hot or in a standard kitchen fridge can damage the flavor profiles and aromas of even the simplest bottles, leaving your investment overwhelming.</p>
          <p>To help you protect your investments, we have crafted a comprehensive guide to The 5 Best Wine Coolers and Fridges of 2026. This year's models bring unprecedented innovations, from AI-driven temperature monitoring to whisper-quiet compressors.</p>
          <p>In this detailed breakdown, we will explore the top-performing units on the market, explain the essential technologies that power them, and answer your most pressing questions about home wine cellaring.</p>
        `,
      },
      {
        id: "block-1",
        value: `
          <img src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=900&q=80" alt="Modern wine storage setup" />
          <h2 id="section-1-0">Pre-Purchase Guide: Understanding Modern Wine Storage</h2>
          <p>Before diving into our top picks, it is essential to understand the technology and design principles available today. Not all wine fridges are created equal, and selecting the right one depends on your long-term goals, the size of your collection, and your specific drinking habits.</p>
          <h3 id="section-1-1">Thermoelectric vs Compressor Cooling Systems</h3>
          <p>One of the first decisions you will make is choosing the cooling mechanism. When comparing thermoelectric vs compressor cooling systems, both have distinct advantages:</p>
          <ul>
            <li><strong>Thermoelectric Coolers:</strong> These units use an electric current to transfer heat, making them very quiet and vibration-free. Because they have no moving parts, they are exceptionally quiet and energy-efficient. However, they may struggle in warmer environments.</li>
            <li><strong>Compressor Cooling:</strong> Operating much like a standard kitchen refrigerator, compressor coolers use a gas-filled system compressed and expanded to generate cooling. They are more powerful, capable of maintaining consistent temperatures regardless of the ambient temperature.</li>
          </ul>
          <h3 id="section-1-2">Freestanding vs Integrated Wine Fridge Models</h3>
          <p>The installation type dramatically affects the wine fridge models you should consider. Freestanding units allow the most flexibility in placement, meaning they can be enclosed in cabinetry or left as-is. Conversely, Integrated fridges are designed for built-in installation, offering a seamless look that integrates beautifully into modern kitchen islands and wet bars.</p>
        `,
      },
      {
        id: "block-2",
        value: `
          <h2 id="section-2-0">What Is the Ideal Humidity for Wine Storage?</h2>
          <p>Humidity is only half the battle; humidity is the unsung hero of wine preservation. But what is the ideal humidity for wine storage? Experts agree that maintaining a relative humidity between 50% and 70% is critical for both red and white wine storage, allowing corks to stay moist and fresh, allowing oxygen to creep in and oxidize the bottle. The best wine coolers of 2026 include advanced humidity management systems to keep things right in this sweet spot automatically.</p>
        `,
      },
      {
        id: "block-3",
        value: `
          <h2 id="section-3-0">The Final Pour: Making Your Choice</h2>
          <p>The landscape of home wine preservation in 2026 offers something for everyone. Whether you need a slim wine fridge for small apartments or require samples read over temperature control for red and white wines in a resource-assisted modern lifestyle, today's appliances are smarter, more efficient, and more reliable than ever before.</p>
          <p>When making your final decision, prioritize the features that align with your wine collecting habits. Invest in one with advanced smart monitoring to let your wine age gracefully. Lock in one with the right UV-protection glass doors for wine-collecting and adhere to one with adjustable temperature zones for temperature control, and look for adjustable temperature zones for wine to allow maximum organization for your fridge to grow alongside your collection.</p>
          <p>By following one of these top-reviewed models and adhering to our wine under-maintenance and storing guide, you guarantee that every time you pour a sip, you are experiencing the wine exactly as the winemaker intended. Cheers to finding the perfect home for your collection!</p>
        `,
      },
    ],
    faqs: [
      {
        question: "What is the best wine cooler in 2026?",
        answer:
          "The best wine cooler in 2026 depends on your needs. For small collections (up to 18 bottles), the EuroCave Comfort S is highly rated. For larger collections, the Liebherr WKes 4552 Grand Cru offers superior dual-zone control, UV-protection glass, and whisper-quiet compressor technology.",
      },
      {
        question: "What is the difference between a wine cooler and a wine fridge?",
        answer:
          'The terms are often used interchangeably, but technically a "wine cooler" typically refers to smaller, single-zone units designed for short-term storage, while a "wine fridge" or "wine cellar" refers to larger, multi-zone units engineered for long-term aging with precise humidity and temperature control.',
      },
      {
        question: "What temperature should a wine fridge be set to?",
        answer:
          "For long-term storage of all wine types, a consistent 55°F (13°C) is considered ideal. For serving temperatures, whites and rosés are best at 45–55°F (7–13°C), while reds are typically served between 60–68°F (16–20°C).",
      },
      {
        question: "Are dual-zone wine coolers worth it?",
        answer:
          "Absolutely. Dual-zone wine coolers allow you to store both red and white wines simultaneously at their optimal temperatures. This eliminates the need for two separate units and is especially valuable for collectors who regularly entertain guests.",
      },
      {
        question: "What size wine cooler should I buy?",
        answer:
          "Start by estimating your current collection and projecting 2–3 years of growth. A 20–30 bottle cooler suits casual drinkers, 50–100 bottles suits enthusiasts, and 150+ bottle units are ideal for serious collectors or hospitality businesses.",
      },
    ],
  },
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const blog = BLOGS[slug];

  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const total =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setReadingProgress((window.scrollY / total) * 100);
      if (!blog) return;
      const scrollPos = window.scrollY + 150;
      let current = "";
      blog.toc.forEach(({ id }) => {
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
  }, [blog]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
    setActiveSection(id);
  };

  if (!blog) {
    return (
      <div className="global-container py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog not found</h1>
        <p className="text-gray-500 mb-6">No article found for <strong>{slug}</strong>.</p>
        <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-[#186737] text-white rounded-[7px] hover:bg-[#145c2e] transition-colors">
          <ChevronRight size={16} className="rotate-180" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-0.75 bg-gray-200 z-9999">
        <div
          className="h-full bg-linear-to-r from-[#186737] to-emerald-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100">
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
              <span className="text-[#186737] font-semibold truncate">{blog.name}</span>
            </li>
          </ol>
        </div>
      </nav>

      <div className="bg-gray-50 min-h-screen">
        <div className="global-container px-4 lg:px-6 py-6 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── Main Content ── */}
            {/* min-w-0 is critical — prevents grid item from overflowing its column */}
            <article className="lg:col-span-8 min-w-0">

              {/* Title */}
              <h1 className="text-2xl md:text-3xl xl:text-4xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
                {blog.name}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-5 pb-5 border-b border-gray-200">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#186737]/10 flex items-center justify-center shrink-0">
                    <User size={12} className="text-[#186737]" />
                  </div>
                  <span className="font-semibold text-gray-700">{blog.written_by}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#186737]" />
                  <span>{formatDate(blog.created_at)}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-[#186737]" />
                  <span>{blog.read_time} min read</span>
                </div>
                <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-[#186737]/10 hover:bg-[#186737] hover:text-white text-[#186737] rounded-full text-xs font-semibold transition-all">
                  <Share2 size={13} /> Share
                </button>
              </div>

              {/* Banner */}
              <div className="rounded-xl overflow-hidden shadow-md mb-8">
                <img
                  src={blog.desktop_banner}
                  alt={blog.desktop_banner_alt}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* TOC — mobile only */}
              {blog.toc.length > 0 && (
                <div className="lg:hidden mb-8 bg-white rounded-[7px] border border-gray-200 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                    <Bookmark size={16} className="text-[#186737]" />
                    <h2 className="text-sm font-bold text-gray-900">Table of Contents</h2>
                  </div>
                  <nav className="p-3 space-y-0.5">
                    {blog.toc.map((item) => (
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
              )}

              {/* Blog Content */}
              <div className="blog-content bg-white rounded-[7px] border border-gray-200 shadow-sm p-6 sm:p-8 mb-8">
                {blog.description.map((item) => (
                  <div
                    key={item.id}
                    dangerouslySetInnerHTML={{ __html: item.value }}
                  />
                ))}
              </div>

              {/* Author Bio */}
              <div className="bg-white rounded-[7px] border border-gray-200 shadow-sm p-6 sm:p-8 mb-8">
                <div className="flex items-start gap-4 sm:gap-5">
                  <img
                    src={blog.image}
                    alt={blog.written_by}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-[#186737]/20 shadow-md shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[#186737] uppercase tracking-widest mb-1">Author</p>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5">{blog.written_by}</h3>
                    <p className="text-[#186737] text-sm font-medium mb-3">{blog.author_designation}</p>
                    <p className="text-gray-600 leading-relaxed text-sm">{blog.author_desc}</p>
                  </div>
                </div>
              </div>

              {/* FAQs */}
              {blog.faqs.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                    <span className="w-1 h-7 bg-[#186737] rounded-full" />
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-3">
                    {blog.faqs.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-[7px] border border-gray-200 shadow-sm overflow-hidden"
                      >
                        <button
                          onClick={() => setActiveIndex((prev) => (prev === index ? null : index))}
                          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors gap-4"
                        >
                          <span className="text-sm sm:text-base font-semibold text-gray-900">{item.question}</span>
                          <div
                            className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all text-lg font-bold ${
                              activeIndex === index
                                ? "bg-[#186737] text-white rotate-45"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            +
                          </div>
                        </button>
                        <div
                          ref={(el) => { contentRefs.current[index] = el; }}
                          className="overflow-hidden transition-all duration-300"
                          style={{ maxHeight: activeIndex === index ? `${contentRefs.current[index]?.scrollHeight ?? 300}px` : "0px" }}
                        >
                          <div className="px-5 pb-5 pt-1">
                            <p className="text-sm text-gray-600 leading-relaxed border-l-2 border-[#186737]/40 pl-4">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                  <MessageCircle size={22} className="text-[#186737]" />
                  Comments
                  <span className="text-sm font-normal text-gray-400">(0)</span>
                </h2>

                {/* Login to comment */}
                <div className="mb-4 text-center p-8 bg-white rounded-[7px] border-2 border-dashed border-gray-200">
                  <div className="w-12 h-12 bg-[#186737]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock size={20} className="text-[#186737]" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">Login to Comment</h3>
                  <p className="text-gray-500 mb-4 text-sm">Join the conversation! Please log in to share your thoughts.</p>
                  <button
                    onClick={() => router.push("/login")}
                    className="px-5 py-2.5 bg-[#186737] text-white rounded-[7px] hover:bg-[#145c2e] transition-colors inline-flex items-center gap-2 text-sm font-semibold"
                  >
                    <User size={15} /> Login Now
                  </button>
                </div>

                {/* Empty state */}
                <div className="text-center py-10 bg-white rounded-[7px] border border-gray-200">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Send size={22} className="text-gray-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">No comments yet</h4>
                  <p className="text-gray-400 text-sm">Be the first to share your thoughts!</p>
                </div>
              </div>
            </article>

            {/* ── Sidebar ── */}
            <aside className="lg:col-span-4 min-w-0">
              <div className="lg:sticky lg:top-24 space-y-5">
                {/* TOC — desktop */}
                {blog.toc.length > 0 && (
                  <div className="hidden lg:block bg-white rounded-[7px] border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                      <Bookmark size={15} className="text-[#186737]" />
                      <h3 className="text-sm font-bold text-gray-900">Table of Contents</h3>
                    </div>
                    <nav className="p-3 space-y-0.5">
                      {blog.toc.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-[7px] flex items-start gap-2 transition-all ${
                            activeSection === item.id
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

                {/* Quick Info card */}
                <div className="hidden lg:block bg-white rounded-[7px] border border-gray-200 shadow-sm p-5">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">About this article</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#186737]/10 rounded-full flex items-center justify-center shrink-0">
                        <User size={14} className="text-[#186737]" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Written by</p>
                        <p className="text-sm font-semibold text-gray-800">{blog.written_by}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#186737]/10 rounded-full flex items-center justify-center shrink-0">
                        <Calendar size={14} className="text-[#186737]" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Published</p>
                        <p className="text-sm font-semibold text-gray-800">{formatDate(blog.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#186737]/10 rounded-full flex items-center justify-center shrink-0">
                        <Clock size={14} className="text-[#186737]" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Read time</p>
                        <p className="text-sm font-semibold text-gray-800">{blog.read_time} minutes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Related Articles */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-1 h-7 bg-[#186737] rounded-full" />
              Related Articles
            </h2>
            <BlogsCard />
          </div>
        </div>
      </div>

      <style jsx global>{`
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
        .blog-content > div:first-child h2,
        .blog-content > div:first-child h3 { margin-top: 0.5rem; }
      `}</style>
    </>
  );
}
