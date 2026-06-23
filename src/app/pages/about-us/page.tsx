"use client";

import Link from "next/link";
import FinancingModal from "@/components/financing-modal";
import { useRef, useState, useEffect } from "react";
import {
  Shield,
  Truck,
  RotateCcw,
  Package,
  Headphones,
  Zap,
  UtensilsCrossed,
  CreditCard,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  ChevronRight,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────
const tabs = [
  { name: "Our Vision", id: "vision" },
  { name: "Our Goal", id: "goal" },
  { name: "Our Achievements", id: "achievements" },
  { name: "Our Team", id: "team" },
];

const serviceFeatures = [
  {
    icon: Shield,
    title: "Warranty Coverage",
    description:
      "Every product is backed by a warranty with no hidden terms — just reliable protection.",
  },
  {
    icon: Truck,
    title: "Free Shipping & Setup",
    description:
      "Enjoy end-to-end convenience. We take care of everything, so you don't have to lift a finger.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns & Refunds",
    description:
      "Our simple, no-questions-asked return and refund policy gives you up to 90 days of stress-free flexibility.",
  },
  {
    icon: Package,
    title: "Simple Sourcing for All",
    description:
      "One trusted supplier. One invoice. Whether it's a single item or bulk procurement, every customer gets the same care.",
  },
  {
    icon: Headphones,
    title: "24/7 Support Team",
    description:
      "Real people, real solutions — available around the clock. We listen, resolve fast, and prioritize your operations.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description:
      "With next-day and priority shipping, we keep your kitchen stocked when it matters most.",
  },
  {
    icon: UtensilsCrossed,
    title: "Built for Hospitality",
    description:
      "Every product is rigorously tested and trusted by professionals — built to withstand daily commercial use.",
  },
  {
    icon: CreditCard,
    title: "Secure Pay & Best Price",
    description:
      "Flexible, encrypted payment options with transparent pricing and no hidden costs — protecting your margins.",
  },
];

const socials = [
  { icon: Facebook, href: "https://www.facebook.com/horecastoreamerica/", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/horecastoreamerica", label: "Instagram" },
  { icon: Youtube, href: "https://www.youtube.com/@horecastoreinternational", label: "YouTube" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/horecastoreamerica/", label: "LinkedIn" },
];

// ── Image placeholder (replace src with actual image path) ────────────────────
function SectionImage({ alt }: { alt: string }) {
  return (
    <div className="relative w-full h-[300px] sm:h-[420px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#186737]/10 to-[#186737]/30 flex items-center justify-center">
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #186737 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
      <UtensilsCrossed size={56} className="text-[#186737]/30" />
      <span className="sr-only">{alt}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AboutUsPage() {
  const [activeTab, setActiveTab] = useState("Our Vision");
  const [videoSrc, setVideoSrc] = useState("");
  const [financingOpen, setFinancingOpen] = useState(false);

  const visionRef = useRef<HTMLDivElement>(null);
  const goalRef = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
    vision: visionRef,
    goal: goalRef,
    achievements: achievementsRef,
    team: teamRef,
  };

  useEffect(() => {
    const isMobile = window.innerWidth < 640;
    setVideoSrc(
      isMobile
        ? "https://horecastore-s3-storage.s3.us-west-1.amazonaws.com/production/products/440x680+voice+over+2.mp4"
        : "https://horecastore-s3-storage.s3.us-west-1.amazonaws.com/production/products/updated+1+1920x500+Voice+over+2.mp4"
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollTo = (id: string, name: string) => {
    setActiveTab(name);
    refMap[id]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
    <div className="min-h-screen bg-white">

      {/* ── Video Hero ─────────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden bg-[#0f4d26]">
        {window?.innerWidth < 640 && (
          <video
            className="w-full h-full object-cover"
            src={`https://horecastore-s3-storage.s3.us-west-1.amazonaws.com/production/products/440x680+voice+over+2.mp4`}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        {window?.innerWidth > 640 && (
          <video
            className="w-full h-full object-cover"
            // src={`https://horecastore-s3-storage.s3.us-west-1.amazonaws.com/production/Brand/Amana/horecastore.mp4`}
            src={`https://horecastore-s3-storage.s3.us-west-1.amazonaws.com/production/products/updated+1+1920x500+Voice+over+2.mp4`}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
      </div>

      {/* ── Sticky Tab Nav ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-30 w-full bg-[#E2E8F0] shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <ul className="flex overflow-x-auto scrollbar-none gap-0 border-b border-gray-300">
            {tabs.map((tab) => (
              <li key={tab.name} className="shrink-0">
                <button
                  onClick={() => scrollTo(tab.id, tab.name)}
                  className={`relative px-5 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.name
                      ? "text-gray-900 font-semibold"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab.name}
                  {activeTab === tab.name && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#186737] rounded-t" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── About Intro ────────────────────────────────────────────────────── */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-extrabold text-[#186737] mb-2">
            About HorecaStore — Trusted Restaurant Supply &amp; Commercial Equipment Provider
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Empowering Hospitality Businesses with Quality Supplies and Seamless Procurement
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed hidden sm:block">
            HorecaStore is a leading restaurant supply and commercial equipment provider built to
            support hotels, restaurants, cafés, and cloud kitchens of every size. As a
            purpose-driven B2B procurement platform, we simplify the way professional kitchens
            source, stock, and scale by offering affordable supplies, fast delivery, trusted
            brands, and expert support. With over 100,000 industry-grade products, transparent
            pricing, comprehensive warranties, and easy returns, HorecaStore helps hospitality
            teams save time, reduce stress, and focus on delivering outstanding guest experiences.
          </p>
        </div>
      </section>

      {/* ── Our Vision ─────────────────────────────────────────────────────── */}
      <section ref={visionRef} className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 scroll-mt-16">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1">
            <h3 className="text-2xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-5">
              HorecaStore: Empowering Every Kitchen, Every Day
            </h3>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-4">
              HorecaStore is the all-in-one B2B procurement platform purpose-built for the
              hospitality industry, serving hotels, restaurants, cafés, and cloud kitchens of
              every size. Whether you're running a single outlet or managing a multi-location
              group, we simplify the way you source, stock, and scale.
            </p>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
              We're more than just a supplier — we're your strategic partner behind the scenes.
              Our platform delivers the lowest prices, fastest deliveries, and deep hospitality
              expertise, eliminating the daily complexities of procurement. With HorecaStore,
              you save time, reduce stress, and stay focused on what truly matters: delivering
              exceptional guest experiences.
            </p>
          </div>
          <div className="flex-1 w-full">
            <SectionImage alt="HorecaStore Vision" />
          </div>
        </div>
      </section>

      {/* ── Our Goal ───────────────────────────────────────────────────────── */}
      <section ref={goalRef} className="bg-gray-50 py-16 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h3 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-3">
              Why Hospitality Teams Rely on{" "}
              <span className="text-[#186737]">HorecaStore?</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
              Everything we do is powered by our Dual Brand Promise: Affordable Supplies.
              Effortless Process. Here's how we help hospitality businesses save more and
              stress less every single day.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {serviceFeatures.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col items-center sm:items-start text-center sm:text-left group hover:border-[#186737]/40 hover:shadow-sm transition-all"
              >
                <div className="w-11 h-11 rounded-full bg-white border border-[#186737] flex items-center justify-center mb-3 group-hover:bg-[#186737]/5 transition-colors shrink-0">
                  <Icon size={18} className="text-[#186737]" />
                </div>
                <h4 className="text-sm sm:text-base font-semibold text-[#186737] mb-1.5">
                  {title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Green CTA Banner ───────────────────────────────────────────────── */}
      <div className="relative w-full py-16 sm:py-24 flex items-center justify-center overflow-hidden bg-[#186737]">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 text-center px-4">
          <h2 className="text-white font-semibold text-xl sm:text-3xl lg:text-5xl leading-tight mb-2">
            Everything You Need, All in One Place
          </h2>
          <p className="text-white/80 font-medium text-base sm:text-2xl lg:text-3xl">
            It&apos;s easier with HorecaStore.
          </p>
          <Link
            href="/pages/contact-us"
            className="mt-8 inline-flex items-center gap-2 bg-white text-[#186737] font-bold text-sm px-6 py-3 rounded-full hover:bg-gray-50 transition-colors"
          >
            Get in Touch <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* ── Our Achievements – Sustainability ──────────────────────────────── */}
      <section ref={achievementsRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-16">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16">
          <div className="flex-1">
            <span className="inline-block text-[11px] font-bold text-[#186737] bg-[#186737]/8 rounded-full px-3 py-1 mb-4 tracking-widest uppercase">
              Our Achievements
            </span>
            <h3 className="text-2xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-5">
              Our Commitment to Sustainability
            </h3>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-4">
              At HorecaStore, we believe sustainability isn't an add-on — it's a responsibility.
              Our commitment to preserving the planet begins with every product we offer and
              every solution we deliver.
            </p>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
              That's why through our in-house initiative{" "}
              <span className="font-semibold text-[#186737]">Planet247</span>, we are dedicated
              to transforming sustainability across the HORECA industry. From recyclable and
              biodegradable packaging to energy-efficient systems and carbon offsetting
              solutions, with Planet247 we help hospitality businesses operate responsibly
              without compromising performance.
            </p>
          </div>
          <div className="flex-1 w-full">
            <SectionImage alt="Sustainability" />
          </div>
        </div>
      </section>

      {/* ── Help You Grow ──────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1">
              <h3 className="text-2xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-5">
                We&apos;re Here to Help You Grow
              </h3>
              <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
                We're not here just to sell products. We're here to understand your business,
                reduce your procurement costs, and give you back the time to focus on what
                truly matters — creating exceptional guest experiences, not managing supply stress.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/pages/contact-us"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-[9px] bg-[#186737] hover:bg-[#145c30] text-white text-sm font-bold transition-all"
                >
                  Contact Us <ChevronRight size={15} />
                </Link>
                <button
                  onClick={() => setFinancingOpen(true)}
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-[9px] border border-[#186737] text-[#186737] hover:bg-[#186737] hover:text-white text-sm font-bold transition-all"
                >
                  Request a Quote
                </button>
              </div>
            </div>
            <div className="flex-1 w-full">
              <SectionImage alt="Help You Grow" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Quote Banner ───────────────────────────────────────────────────── */}
      <div className="relative w-full py-14 sm:py-20 flex items-center justify-center overflow-hidden bg-[#186737]">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <blockquote className="relative z-10 text-white text-center font-medium italic text-base sm:text-xl lg:text-2xl max-w-3xl px-6 leading-relaxed">
          &ldquo;HorecaStore takes care of everything for us. Great prices, fast delivery,
          and real support when it matters. They understand hospitality and make it all feel easy.&rdquo;
        </blockquote>
      </div>

      {/* ── Our Team – Community / Social ─────────────────────────────────── */}
      <section ref={teamRef} className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center scroll-mt-16">
        <h3 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-4">
          Join the HorecaStore Community
        </h3>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-2xl mx-auto mb-8">
          We're not just a procurement platform — we're a community of hospitality professionals.
          Follow us for supplier tips, product launches, restaurant stories, and
          behind-the-scenes insights that keep you informed and inspired.
        </p>

        <div className="flex items-center justify-center gap-4 mb-12">
          {socials.map(({ icon: Icon, href, label }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-11 h-11 rounded-full bg-[#186737] hover:bg-[#145c30] flex items-center justify-center transition-colors"
            >
              <Icon size={18} className="text-white" />
            </Link>
          ))}
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-gray-50 rounded-2xl border border-gray-100 p-6">
          {[
            { value: "25,000+", label: "Community Members" },
            { value: "100,000+", label: "Products Listed" },
            { value: "5,000+", label: "Businesses Served" },
            { value: "50 States", label: "Nationwide Delivery" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <p className="text-2xl font-black text-[#186737]">{value}</p>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

    </div>

    <FinancingModal
      isOpen={financingOpen}
      onClose={() => setFinancingOpen(false)}
      title="Request a Quote"
    />
    </>
  );
}
