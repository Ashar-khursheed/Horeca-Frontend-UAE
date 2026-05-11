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

// ─── Dummy Blog Data (keyed by slug) ─────────────────────────────────────────
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
      {
        id: "section-1-0",
        text: "Pre-Purchase Guide: Understanding Modern Wine Storage",
      },
      {
        id: "section-1-1",
        text: "Thermoelectric vs Compressor Cooling Systems",
      },
      {
        id: "section-1-2",
        text: "Freestanding vs Integrated Wine Fridge Models",
      },
      {
        id: "section-2-0",
        text: "What Is the Ideal Humidity for Wine Storage?",
      },
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
        question:
          "What is the difference between a wine cooler and a wine fridge?",
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

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const blog = BLOGS[slug];

  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Reading progress + active TOC section
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
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
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
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 120,
      behavior: "smooth",
    });
    setActiveSection(id);
  };

  // 404 fallback for unknown slugs
  if (!blog) {
    return (
      <div className="global-container py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Blog not found
        </h1>
        <p className="text-gray-500 mb-6">
          No article found for <strong>{slug}</strong>.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <ChevronRight size={16} className="rotate-180" />
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100">
        <div className="global-container">
          <ol className="flex items-center h-10 gap-1 text-xs flex-wrap">
            <li>
              <Link
                href="/"
                className="text-gray-400 hover:text-[#186737] transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight size={12} className="mx-1 text-gray-300" />
              <Link
                href="/blog"
                className="text-gray-400 hover:text-[#186737] transition-colors"
              >
                Blog
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight size={12} className="mx-1 text-gray-300" />
              <span className="text-[#186737] font-semibold line-clamp-1">
                {blog.name}
              </span>
            </li>
          </ol>
        </div>
      </nav>

      <div className="global-container py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* ── Main Content ── */}
          <article className="lg:col-span-8">
            {/* Hero */}
            <div className="mb-6 lg:mb-8">
              <h1 className="text-xl md:text-3xl 2xl:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {blog.name}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-green-600" />
                  <span className="font-medium">{blog.written_by}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-green-600" />
                  <span>{formatDate(blog.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-green-600" />
                  <span>{blog.read_time} min read</span>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors ml-auto">
                  <Share2 size={16} />
                  <span className="font-medium">Share</span>
                </button>
              </div>

              {/* Banner – desktop */}
              <div className="relative rounded-xl overflow-hidden shadow-lg mb-6 hidden md:block">
                <img
                  src={blog.desktop_banner}
                  alt={blog.desktop_banner_alt}
                  className="w-full object-cover"
                />
              </div>
              {/* Banner – mobile */}
              <div className="relative rounded-xl overflow-hidden shadow-lg mb-6 md:hidden">
                <img
                  src={blog.mobile_banner}
                  alt={blog.desktop_banner_alt}
                  className="w-full"
                />
              </div>
            </div>

            {/* TOC – mobile */}
            {blog.toc.length > 0 && (
              <div className="lg:hidden mb-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-4">
                  <Bookmark className="text-green-600" size={20} />
                  <h2 className="text-lg font-bold text-gray-900">
                    Table of Contents
                  </h2>
                </div>
                <nav className="space-y-1">
                  {blog.toc.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition-all ${
                        activeSection === item.id
                          ? "bg-green-100 border-l-4 border-green-600 text-green-800 font-semibold"
                          : "hover:bg-white text-gray-700"
                      }`}
                    >
                      <ChevronRight size={14} className="flex-shrink-0" />
                      <span className="line-clamp-2">{item.text}</span>
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Blog Content */}
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8 lg:mb-12">
              {blog.description.map((item) => (
                <div
                  key={item.id}
                  dangerouslySetInnerHTML={{ __html: item.value }}
                  className="blogContent leading-relaxed mb-4 sm:mb-6"
                />
              ))}
            </div>

            {/* Author Bio */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 lg:p-8 mb-8 lg:mb-12 border border-green-100">
              <div className="flex items-start gap-4 sm:gap-6">
                <img
                  src={blog.image}
                  alt={blog.written_by}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    About {blog.written_by}
                  </h3>
                  <p className="text-green-700 font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                    {blog.author_designation}
                  </p>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {blog.author_desc}
                  </p>
                </div>
              </div>
            </div>

            {/* FAQs */}
            {blog.faqs.length > 0 && (
              <div className="mb-8 lg:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full" />
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {blog.faqs.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() =>
                          setActiveIndex((prev) =>
                            prev === index ? null : index
                          )
                        }
                        className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                          {item.question}
                        </span>
                        <div
                          className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                            activeIndex === index
                              ? "bg-green-600 text-white rotate-45"
                              : "bg-gray-200 text-black"
                          }`}
                        >
                          <span className="text-xl font-bold">+</span>
                        </div>
                      </button>
                      <div
                        ref={(el) => {
                          contentRefs.current[index] = el;
                        }}
                        className="overflow-hidden transition-all duration-300"
                        style={{
                          maxHeight:
                            activeIndex === index
                              ? `${contentRefs.current[index]?.scrollHeight ?? 300}px`
                              : "0px",
                        }}
                      >
                        <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-2">
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed border-l-4 border-green-500 pl-4">
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
            <div className="mb-8 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <MessageCircle className="text-green-600" size={24} />
                Comments
              </h2>
              <p className="text-gray-500 mb-6 text-sm sm:text-base">
                0 comments
              </p>

              {/* Login to comment */}
              <div className="mb-6 sm:mb-8 text-center p-6 sm:p-8 bg-white rounded-xl border-2 border-dashed border-gray-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="text-green-600" size={24} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Login to Comment
                </h3>
                <p className="text-gray-500 mb-4 text-sm sm:text-base">
                  Join the conversation! Please log in to share your thoughts.
                </p>
                <button
                  onClick={() => router.push("/login")}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all inline-flex items-center gap-2 text-sm sm:text-base"
                >
                  <User size={18} />
                  Login Now
                </button>
              </div>

              {/* Empty state */}
              <div className="text-center py-10 sm:py-12 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="text-gray-400" size={28} />
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  No comments yet
                </h4>
                <p className="text-gray-500 text-sm sm:text-base">
                  Be the first to share your thoughts!
                </p>
              </div>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-4 space-y-4 lg:space-y-6">
              {blog.toc.length > 0 && (
                <div className="hidden lg:block bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Bookmark className="text-green-600" size={20} />
                    <h3 className="text-lg font-bold text-gray-900">
                      Table of Contents
                    </h3>
                  </div>
                  <nav className="space-y-1">
                    {blog.toc.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-all ${
                          activeSection === item.id
                            ? "bg-green-100 border-l-4 border-green-600 text-green-800 font-semibold"
                            : "hover:bg-white text-gray-700"
                        }`}
                      >
                        <ChevronRight size={14} className="flex-shrink-0" />
                        <span className="line-clamp-2">{item.text}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        <div className="mt-8 lg:mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 lg:mb-8 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full" />
            Related Articles
          </h2>
          <BlogsCard />
        </div>
      </div>

      {/* Blog content styles */}
      <style jsx>{`
        .blogContent h2,
        .blogContent h3,
        .blogContent h4 {
          color: #1a1a1a;
          scroll-margin-top: 120px;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .blogContent h2 {
          font-size: 1.5rem;
        }
        .blogContent h3 {
          font-size: 1.2rem;
        }
        .blogContent p {
          line-height: 1.8;
          color: #374151;
          margin-bottom: 1rem;
        }
        .blogContent img {
          border-radius: 0.75rem;
          margin: 1.25rem 0;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          max-width: 100%;
          height: auto;
        }
        .blogContent a {
          color: #2563eb !important;
          text-decoration: underline;
          font-weight: 500;
        }
        .blogContent ul,
        .blogContent ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
          list-style-type: disc;
        }
        .blogContent li {
          line-height: 1.7;
          margin-bottom: 0.5rem;
          color: #374151;
        }
        .blogContent strong {
          color: #111827;
        }
      `}</style>
    </>
  );
}
