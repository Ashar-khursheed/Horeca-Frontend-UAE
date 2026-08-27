"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import Link from "next/link";

// ── Data ──────────────────────────────────────────────────────────────────────

const FAQ_DATA: Record<string, { question: string; answer: string }[]> = {
  "Equipment Selection & Buying Guide": [
    {
      question: "How do I choose the right kitchen equipment for my restaurant?",
      answer:
        "Begin by identifying your menu, cuisine type, and service format, as these determine the equipment you truly need. Assess your kitchen layout and space to maintain smooth workflow and staff efficiency. Always choose commercial-grade, energy-efficient equipment built for heavy daily use. Opt for multi-functional machines to save space and control costs, especially in compact kitchens. Also consider ease of cleaning, maintenance, and warranty support. For a complete range of reliable, professional kitchen equipment with expert guidance, HorecaStore helps you choose the right solutions for your restaurant needs.",
    },
    {
      question: "How do I choose the right restaurant equipment for my new restaurant?",
      answer:
        "Start by clearly defining your concept, menu, and expected customer volume, as these determine the type and capacity of equipment required. Prioritize essential commercial equipment such as cooking, refrigeration, food prep, and warewashing before investing in add-ons. Make sure the equipment fits your kitchen layout, utility connections, and local safety regulations. Choose durable, energy-efficient machines that can handle daily operations and reduce long-term costs. It's also smart to plan for future scalability and easy maintenance. To simplify the process, HorecaStore offers end-to-end restaurant equipment solutions, expert guidance, and reliable after-sales support for new restaurant owners.",
    },
    {
      question: "What should I consider when buying restaurant equipment for a new restaurant?",
      answer:
        "Start with your concept, menu, and expected customer volume, as these define your core equipment needs. Assess your kitchen layout, space, and utility connections (gas, electrical, water) to ensure proper fit and workflow. Choose commercial-grade, durable, and energy-efficient equipment that can withstand daily use. Factor in after-sales support, warranty, and maintenance availability to avoid downtime. For a curated range of quality equipment and expert guidance, HorecaStore helps you make smart, budget-friendly choices for your new restaurant.",
    },
    {
      question: "Can you recommend budget-friendly equipment for starting a restaurant?",
      answer:
        "For a new restaurant, focus on essential commercial-grade equipment for cooking, refrigeration, prep, and dishwashing. Choose multi-functional, energy-efficient, and durable tools to save costs and space. HorecaStore offers a curated range of budget-friendly equipment from trusted brands, along with easy financing options to help you set up your kitchen efficiently without straining your budget.",
    },
  ],
  "Specific Equipment": [
    {
      question: "How do I choose the right pizza pans for my restaurant?",
      answer:
        "Choose pizza pans based on the size and style of pizzas you serve (e.g., thin crust, deep dish). Look for commercial-grade materials like carbon steel or aluminum for even heat distribution and durability. Consider edge style – perforated pans help with crispier crusts, while solid pans retain more moisture. Match the pan size to your oven capacity to ensure efficient cooking. For a wide range of professional pizza pans and expert recommendations, HorecaStore has options to suit every kitchen need.",
    },
    {
      question: "How do I choose the right refrigeration units for my restaurant?",
      answer:
        "Choosing the right refrigeration depends on your menu type, storage volume, and kitchen workflow. Decide between reach-in, undercounter, walk-in, or display units based on how frequently items are accessed. Look for stable temperature control, energy efficiency, and commercial-grade insulation to maintain food safety. Proper sizing, easy maintenance, and reliable service support are key factors. HorecaStore's refrigeration range is curated with these exact operational needs in mind.",
    },
    {
      question: "What are the essential pieces of equipment needed to start a pizza restaurant?",
      answer:
        "To start a pizza restaurant, you'll need commercial ovens (deck, conveyor, or wood-fired) for perfect cooking, prep tables and workstations for topping assembly, and refrigeration units to store dough, cheese, and toppings safely. Dough mixers, sheeters, pizza pans, cutters, utensils, and smallwares are also essential, along with dishwashing and storage solutions for a clean, efficient kitchen. Instead of hunting multiple suppliers, you can find all these essentials in one place at HorecaStore, making it easy to set up your pizza restaurant without missing a thing.",
    },
    {
      question: "What are the essential equipment pieces for opening a burger and fries restaurant?",
      answer:
        "To open a burger and fries restaurant, you need commercial fryers for crisp, consistent fries and grills or flat-top griddles for burgers. Prep tables and workstations streamline assembly, while refrigeration units keep ingredients fresh. Don't forget utensils, smallwares, and dishwashing solutions to maintain an efficient kitchen. HorecaStore offers all these essentials in one place, so you can equip your burger and fries restaurant quickly and reliably.",
    },
  ],
  "Suppliers & Sources": [
    {
      question: "How do I choose the best manufacturer for restaurant equipment?",
      answer:
        "Look for manufacturers with a proven track record in the HoReCa industry, known for durability and reliable performance under heavy use. Check that they use commercial-grade materials, offer good warranties, and have after-sales support and spare parts availability. Read customer reviews and case studies from similar restaurants to gauge real-world reliability. Also consider energy efficiency and compliance with local safety standards. For trusted brands and vetted equipment backed by expert support, HorecaStore partners with top manufacturers to bring quality solutions to your kitchen.",
    },
    {
      question: "How do I choose the right restaurant supply company?",
      answer:
        "Choose a restaurant supply company based on product range, reliability, and quality of commercial-grade equipment. Look for suppliers that offer trusted brands, detailed specifications, and expert guidance to help you select the right tools for your kitchen. Consider after-sales support, warranty coverage, and delivery options for uninterrupted operations. HorecaStore combines all these features in one platform, making it easy for restaurant owners to source everything they need with confidence.",
    },
    {
      question: "Where can I find reliable suppliers for restaurant kitchen equipment?",
      answer:
        "Reliable suppliers are those that offer commercial-grade equipment, trusted brands, and consistent product quality. They should provide detailed specifications, warranty support, and expert guidance to help you choose the right tools for your kitchen. HorecaStore is a one-stop platform for professional kitchens, offering a wide range of equipment, smallwares, and accessories, all from trusted brands, so you can source everything you need from a single reliable supplier.",
    },
    {
      question: "Where can I find reliable commercial kitchen supplies in Houston or Texas?",
      answer:
        "For reliable commercial kitchen supplies in Houston and across Texas, HorecaStore is your one-stop destination. We offer a wide range of commercial-grade equipment, smallwares, and kitchen essentials suitable for restaurants, bakeries, hotels, and food trucks. With trusted brands, detailed product specifications, and expert guidance, you can shop confidently online and get everything delivered directly to your location.",
    },
    {
      question: "Can you recommend reliable suppliers for fast food restaurant equipment?",
      answer:
        "Fast food kitchens need high-speed, durable equipment like fryers, grills, conveyor ovens, and prep stations that can handle heavy traffic. Look for suppliers that offer consistent product quality, trusted brands, and quick delivery. HorecaStore specializes in fast food restaurant setups, providing everything from fryers and grills to refrigeration and smallwares, all in one place.",
    },
  ],
  "Top Brands": [
    {
      question: "What are the top brands for restaurant kitchen equipment?",
      answer:
        "The top brands are those known for durability, reliability, and commercial performance across different kitchen categories. Popular choices include True Refrigeration, Hoshizaki America, Robot Coupe, Manitowoc, Thunder Group, CAC China, Hamilton Beach, Libbey, and Winco. These brands offer everything from refrigeration and cooking equipment to smallwares and prep tools. HorecaStore carries all these trusted brands, so you can source high-quality restaurant equipment from one platform without compromise.",
    },
    {
      question: "Which brands are the most trusted for commercial kitchen supplies?",
      answer:
        "The most trusted brands are those with a proven track record in commercial kitchens, durability, and consistent performance. Popular choices include True Refrigeration, Hoshizaki America, Robot Coupe, Manitowoc, Thunder Group, CAC China, Hamilton Beach, Libbey, and Winco. HorecaStore offers these top brands all in one place, making it easy to source reliable commercial kitchen supplies without visiting multiple suppliers.",
    },
    {
      question: "What are the best restaurant equipment brands for small businesses?",
      answer:
        "When selecting equipment for a small restaurant, choose brands known for commercial durability, reliability, and service support. On HorecaStore, you'll find trusted names like True Refrigeration, Hoshizaki America, Robot Coupe, Manitowoc, Thunder Group, CAC China, Hamilton Beach, Libbey, and Winco. Comparing specifications, warranties, and real user reviews helps you pick the right option for your budget and workflow.",
    },
  ],
  "Budget & Pricing": [
    {
      question: "How do I compare prices for budget restaurant supplies online?",
      answer:
        "To compare prices effectively, start by listing the exact products and specifications you need (size, capacity, material). Use filtered search tools and sort-by-price features on supplier websites to see competitive options. Check shipping costs, taxes, and warranty coverage, since these can affect the final price. Read customer reviews for value insights beyond just price tags. Also look out for bulk-buy discounts, seasonal promotions, and clearance deals to stretch your budget further.",
    },
    {
      question: "What are the best sources for restaurant supplies online?",
      answer:
        "The best online sources are platforms that specialize in restaurant and commercial kitchen supplies, not general marketplaces. Look for suppliers offering certified commercial-grade products, transparent pricing, and clear technical details. Reliable sources also provide after-sales support, easy returns, and spare parts availability. HorecaStore serves as a one-stop sourcing platform designed specifically for professional kitchens, making procurement simpler and more reliable.",
    },
    {
      question: "Where can I find the best deals on budget restaurant supplies?",
      answer:
        "The best deals come from suppliers that offer transparent pricing, seasonal discounts, and bulk purchase options. Compare product specifications and prices to ensure you're getting commercial-grade equipment without compromising quality. HorecaStore offers a wide range of budget-friendly restaurant supplies and trusted brands, often with special offers and promotions to help you save while stocking your kitchen.",
    },
    {
      question: "What are some reliable sources for affordable kitchen equipment?",
      answer:
        "Reliable sources are those that offer commercial-grade equipment at competitive prices, with clear specifications and warranty support. Look for suppliers that provide bulk options, seasonal deals, and energy-efficient products to maximize value. HorecaStore offers a wide selection of affordable, trusted kitchen equipment from top brands, all in one place with optional financing to help you stay within budget.",
    },
  ],
};

const CATEGORY_COLORS: Record<string, string> = {
  "Equipment Selection & Buying Guide": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Specific Equipment": "bg-blue-50 text-blue-700 border-blue-200",
  "Suppliers & Sources": "bg-purple-50 text-purple-700 border-purple-200",
  "Top Brands": "bg-amber-50 text-amber-700 border-amber-200",
  "Budget & Pricing": "bg-rose-50 text-rose-700 border-rose-200",
};

// ── Accordion Item ─────────────────────────────────────────────────────────────

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-200 ${
        isOpen
          ? "border-[#186737] shadow-sm shadow-[#186737]/10"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 text-left flex items-start justify-between gap-4 group"
      >
        <div className="flex items-start gap-3 min-w-0">
          <span
            className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 transition-colors ${
              isOpen
                ? "bg-[#186737] text-white"
                : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
            }`}
          >
            {index + 1}
          </span>
          <span
            className={`text-sm sm:text-[15px] font-semibold leading-relaxed transition-colors ${
              isOpen ? "text-[#186737]" : "text-gray-900"
            }`}
          >
            {question}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 mt-0.5 transition-all duration-300 ${
            isOpen ? "rotate-180 text-[#186737]" : "text-gray-400"
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-0 pl-14">
            <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FAQPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return Object.entries(FAQ_DATA).reduce<
      Record<string, { question: string; answer: string }[]>
    >((acc, [cat, items]) => {
      if (activeCategory && cat !== activeCategory) return acc;
      const filtered = q
        ? items.filter(
            (i) =>
              i.question.toLowerCase().includes(q) ||
              i.answer.toLowerCase().includes(q)
          )
        : items;
      if (filtered.length) acc[cat] = filtered;
      return acc;
    }, {});
  }, [searchQuery, activeCategory]);

  const totalResults = Object.values(filteredData).reduce(
    (s, arr) => s + arr.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative bg-[#186737] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-white text-xs font-semibold mb-6">
            <HelpCircle size={13} />
            Help Center
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-10">
            Find answers about restaurant equipment, trusted suppliers, top brands, and pricing. Everything you need to make confident decisions for your kitchen.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenKey(null);
              }}
              className="w-full h-[52px] pl-11 pr-4 rounded-xl bg-white text-gray-900 text-sm placeholder:text-gray-400 outline-none shadow-lg focus:ring-2 focus:ring-white/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => { setActiveCategory(null); setOpenKey(null); }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeCategory === null
                ? "bg-[#186737] text-white border-[#186737]"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            All Topics
          </button>
          {Object.keys(FAQ_DATA).map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat === activeCategory ? null : cat); setOpenKey(null); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeCategory === cat
                  ? "bg-[#186737] text-white border-[#186737]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {(searchQuery || activeCategory) && (
          <p className="text-xs text-gray-400 mb-6">
            {totalResults} result{totalResults !== 1 ? "s" : ""} found
            {searchQuery && <> for &ldquo;<span className="text-gray-600 font-medium">{searchQuery}</span>&rdquo;</>}
          </p>
        )}

        {/* FAQ sections */}
        {Object.keys(filteredData).length > 0 ? (
          <div className="space-y-10">
            {Object.entries(filteredData).map(([category, items]) => (
              <section key={category}>
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      CATEGORY_COLORS[category] ?? "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {category}
                  </span>
                  <span className="text-xs text-gray-400">{items.length} question{items.length !== 1 ? "s" : ""}</span>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => {
                    const key = `${category}-${idx}`;
                    return (
                      <AccordionItem
                        key={key}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openKey === key}
                        onToggle={() => setOpenKey(openKey === key ? null : key)}
                        index={idx}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium mb-1">No results found</p>
            <p className="text-gray-400 text-sm">Try different keywords or browse all topics.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
              className="mt-4 text-sm text-[#186737] hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-[#186737] rounded-2xl p-8 sm:p-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Still have questions?
          </h2>
          <p className="text-white/80 text-sm mb-6">
            Our team is ready to help you find the right equipment for your kitchen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+971800467322"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#186737] text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Call +971 800-467-322
            </a>
            <Link
              href="/pages/contact-us"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/15 border border-white/25 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
