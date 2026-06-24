"use client";

import { makeApiRequest } from "@/apis/axios-instance";
import logo1 from "@/assets/banners/contact-us/1.png";
import logo2 from "@/assets/banners/contact-us/2.png";
import logo3 from "@/assets/banners/contact-us/3.png";
import logo4 from "@/assets/banners/contact-us/4.png";
import logo5 from "@/assets/banners/contact-us/5.png";
import BannerContact from "@/assets/banners/contact-us/contactMainBanner.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ContactUsFAQ } from "@/data";
import { useAppSelector } from "@/store/hooks";
import {
  CheckCircle2,
  Globe,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Paperclip,
  Phone,
  RotateCcw,
  Send,
  Star,
  Truck,
  UtensilsCrossed,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

// ── Phone helpers (same logic as legacy contact form) ─────────────────────────
const formatPhoneWithCursor = (value: string, cursorPosition: number) => {
  const digitsOnly = value.replace(/\D/g, "");
  const digitsBeforeCursor = value.slice(0, cursorPosition).replace(/\D/g, "").length;

  let formatted = "";
  if (digitsOnly.length === 0) formatted = "";
  else if (digitsOnly.length <= 3) formatted = `(${digitsOnly}`;
  else if (digitsOnly.length <= 6) formatted = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
  else formatted = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;

  let newCursorPosition = 0;
  let digitCount = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      digitCount++;
      if (digitCount === digitsBeforeCursor) { newCursorPosition = i + 1; break; }
    }
  }
  if (digitCount < digitsBeforeCursor) newCursorPosition = formatted.length;
  return { formatted, newCursorPosition };
};

const isValidPhoneNumber = (phone: string): { valid: boolean; message: string } => {
  const d = phone.replace(/\D/g, "");
  if (d.length !== 10) return { valid: false, message: "Please enter a valid 10-digit US phone number" };
  if (/^(\d)\1{9}$/.test(d)) return { valid: false, message: "Please enter a valid phone number (repeated digits not allowed)" };
  const isSeq = (s: string) => { for (let i = 1; i < s.length; i++) if (parseInt(s[i]) !== (parseInt(s[i - 1]) + 1) % 10) return false; return true; };
  if (isSeq(d)) return { valid: false, message: "Please enter a valid phone number (sequential digits not allowed)" };
  if (d[0] === "0" || d[0] === "1") return { valid: false, message: "Area code cannot start with 0 or 1" };
  if (d[3] === "0" || d[3] === "1") return { valid: false, message: "Invalid exchange code in phone number" };
  return { valid: true, message: "" };
};

const ButtonTabs = [
  "About HorecaStore",
  "Ordering",
  "Delivery",
  "Payments",
  "Returns",
  "Support",
];


const stats = [
  { icon: Star, value: "98%", label: "Customer Satisfaction" },
  { icon: UtensilsCrossed, value: "5,000+", label: "Restaurants" },
  { icon: Globe, value: "500+", label: "International Brands" },
  { icon: Truck, value: "24–48h", label: "Delivery Time" },
];

const logos = [
  { src: logo1, alt: "The Cheesecake Factory" },
  { src: logo2, alt: "The Ritz-Carlton" },
  { src: logo3, alt: "The Plaza NYC" },
  { src: logo4, alt: "Little Nell" },
  { src: logo5, alt: "Ritz Paris" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const inputCls = (err?: string) =>
  `w-full h-11 rounded-[9px] border text-sm outline-none transition-all placeholder:text-gray-300 bg-white px-4 ${
    err
      ? "border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
  }`;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ContactUsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+1",
    topic: "",
    orderId: "",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [activeTab, setActiveTab] = useState(ButtonTabs[0]);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const country = useAppSelector((s) => s.country.data);

  const set = (k: string, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));
  const clr = (k: string) => setErrors((p) => ({ ...p, [k]: "" }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (form.phone) {
      const phoneCheck = isValidPhoneNumber(form.phone);
      if (!phoneCheck.valid) e.phone = phoneCheck.message;
    }
    if (!form.topic) e.topic = "Please select a topic.";
    if (!form.message.trim()) e.message = "Message is required.";
    if (!form.consent) e.consent = "You must agree to the terms and conditions.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursor = input.selectionStart ?? 0;
    const { formatted, newCursorPosition } = formatPhoneWithCursor(input.value, cursor);
    set("phone", formatted);
    clr("phone");
    requestAnimationFrame(() => {
      if (input === document.activeElement) {
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("email", form.email.trim());
      formData.append("phone", form.phone.replace(/\D/g, ""));
      formData.append("topic", form.topic);
      if (form.orderId.trim()) formData.append("order_number", form.orderId.trim());
      formData.append("message", form.message.trim());
      if (file) formData.append("image", file);

      await makeApiRequest("frontend/get-in-touch", {
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSent(true);
    } catch {
      setErrors((p) => ({ ...p, _api: "Something went wrong. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

  const activeQuestions =
    ContactUsFAQ.find((c) => c.type === activeTab)?.questions ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full">
        {!bannerLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" style={{ minHeight: 220 }} />
        )}
        <Image
          src={BannerContact}
          alt="Contact Us Banner"
          className={`w-full h-6s4 object-cover transition-opacity duration-300 ${bannerLoaded ? "opacity-100" : "opacity-0"}`}
          priority
          onLoad={() => setBannerLoaded(true)}
        />
      </div>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center">
          <span className="inline-block text-[11px] font-bold text-[#186737] bg-[#186737]/8 rounded-full px-3 py-1 mb-3 tracking-widest uppercase">
            Support Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            Get in Touch <span className="text-[#186737]">with Us</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            HorecaStore&apos;s dedicated support team is here to assist
            restaurants, hotels, cafes, and foodservice businesses with fast,
            reliable service. Contact us by phone, email, or through our online
            form — we&apos;re committed to making your experience smooth and
            efficient.
          </p>
          <div className="mt-8 flex h-1 rounded-full overflow-hidden max-w-xs mx-auto">
            <div className="flex-1 bg-[#186737]" />
            <div className="flex-1 bg-amber-400" />
            <div className="flex-1 bg-red-500" />
          </div>
        </div>
      </section>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-1 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Package,
              title: "Track Your Order",
              desc: "Provide your order number to use our live tracking system.",
              href: "/track-order",
              label: "Track Order",
              color: "text-[#186737]",
              bg: "bg-[#186737]/8",
              btn: "bg-[#186737] hover:bg-[#145c30]",
            },
            {
              icon: RotateCcw,
              title: "Return or Replace Item",
              desc: "Something not right? We'll make it right — fast and easy.",
              href: "/dashboard/orders",
              label: "Start Return",
              color: "text-amber-600",
              bg: "bg-amber-50",
              btn: "bg-amber-500 hover:bg-amber-600",
            },
            {
              icon: XCircle,
              title: "Cancel My Order",
              desc: "Changed your mind? Cancel your order quickly online.",
              href: "/dashboard/orders",
              label: "Manage My Order",
              color: "text-red-600",
              bg: "bg-red-50",
              btn: "bg-red-500 hover:bg-red-600",
            },
          ].map(({ icon: Icon, title, desc, href, label, color, bg, btn }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3"
            >
              <div
                className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}
              >
                <Icon size={20} className={color} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">
                  {title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
              <Link
                href={href}
                className={`mt-auto inline-flex items-center justify-center h-9 rounded-[8px] ${btn} text-white text-xs font-bold transition-all`}
              >
                {label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main Grid ─────────────────────────────────────────────────────── */}
      <section id="form" className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* ── Form ────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-black text-gray-900 mb-1">
              Get in Touch
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              We typically reply within 24–48 hours on business days.
            </p>

            {sent ? (
              <div className="flex flex-col items-center text-center py-10">
                <div className="w-16 h-16 rounded-full bg-[#186737]/10 flex items-center justify-center mb-5">
                  <CheckCircle2 size={32} className="text-[#186737]" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                  Thank you for reaching out. Our team will get back to you at{" "}
                  <span className="font-semibold text-[#186737]">
                    {form.email}
                  </span>{" "}
                  within 24–48 hours.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setErrors({});
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      countryCode: "+1",
                      topic: "",
                      orderId: "",
                      message: "",
                      consent: false,
                    });
                    setFile(null);
                  }}
                  className="mt-6 text-xs text-[#186737] font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Row 1 – Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => {
                        set("name", e.target.value);
                        clr("name");
                      }}
                      placeholder="Enter your name"
                      className={inputCls(errors.name)}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-red-500 mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => {
                        set("email", e.target.value);
                        clr("email");
                      }}
                      placeholder="you@example.com"
                      className={inputCls(errors.email)}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2 – Phone + Order ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <div
                      className={`flex h-11 rounded-[9px] border overflow-hidden transition-all ${
                        errors.phone
                          ? "border-red-400"
                          : "border-gray-200 focus-within:border-[#186737] focus-within:ring-2 focus-within:ring-[#186737]/10"
                      }`}
                    >
                      <div className="flex items-center px-3 bg-white border-r border-gray-200 shrink-0">
                        {/* <Phone size={13} className="text-gray-400 mr-1.5" /> */}
                        {/* <select
                          value={form.countryCode}
                          onChange={(e) => set("countryCode", e.target.value)}
                          disabled
                          className="text-sm outline-none bg-transparent cursor-pointer text-gray-700"
                        >
                          {countryCodes.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select> */}

                        <div className="flex gap-1.5 items-center">
                          <img src={country?.icon ?? ""} alt="country image" className="w-4 h-4" />
                          <span>{country?.phone_code}</span>
                        </div>
                      </div>
                      <input
                        ref={phoneInputRef}
                        type="tel"
                        value={form.phone}
                        onChange={handlePhoneChange}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" || e.key === "Delete") {
                            const input = e.currentTarget;
                            const pos = input.selectionStart ?? 0;
                            const char = input.value[pos - 1];
                            if (char && /[^\d]/.test(char) && e.key === "Backspace") {
                              e.preventDefault();
                              input.setSelectionRange(pos - 1, pos - 1);
                              input.dispatchEvent(new Event("input", { bubbles: true }));
                            }
                          }
                        }}
                        maxLength={14}
                        placeholder="(866) 446-7322"
                        className="flex-1 px-3 text-sm outline-none bg-white placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Order ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.orderId}
                      onChange={(e) => set("orderId", e.target.value)}
                      placeholder="e.g. #HS-00123"
                      className={inputCls()}
                    />
                  </div>
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Topic of Inquiry <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.topic}
                    onChange={(e) => { set("topic", e.target.value); clr("topic"); }}
                    className={`w-full h-11 rounded-[9px] border text-sm outline-none transition-all bg-white px-4 ${
                      errors.topic
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
                    } ${!form.topic ? "text-black" : "text-gray-800"}`}
                  >
                    <option value="" disabled>Select a topic</option>
                    <option value="order">Order Related</option>
                    <option value="product">Product Inquiry</option>
                    <option value="support">Support</option>
                  </select>
                  {errors.topic && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.topic}</p>
                  )}
                </div>

                {/* File upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Attachment (Optional)
                  </label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-3 h-11 px-4 rounded-[9px] border border-dashed border-gray-300 hover:border-[#186737] bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <Paperclip
                      size={14}
                      className="text-gray-400 group-hover:text-[#186737] shrink-0 transition-colors"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-gray-600 flex-1 truncate transition-colors">
                      {file ? file.name : "Choose file — No file chosen"}
                    </span>
                    {file && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Images, PDFs up to 5MB
                  </p>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => {
                      set("message", e.target.value);
                      clr("message");
                    }}
                    placeholder="Describe your issue or inquiry in detail..."
                    rows={5}
                    className={`w-full rounded-[9px] border text-sm outline-none transition-all placeholder:text-gray-300 bg-white px-4 py-3 resize-none ${
                      errors.message
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Consent */}
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <div className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => set("consent", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 rounded border-2 border-gray-300 peer-checked:border-[#186737] peer-checked:bg-[#186737] transition-all flex items-center justify-center">
                      {form.consent && (
                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                          <path
                            d="M1.5 4.5l2 2L7.5 2"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-500 leading-relaxed">
                  <p className="text-sm">By submitting this form, you consent to receive promotional offers from Horecastore at the number provided. Consent is not a condition of purchase. Message &amp; data rates may apply. Message frequency varies. Unsubscribe by replying STOP. Reply HELP for help. Phone numbers aren't shared with third parties.  <Link href="/pages/privacy-policy" className="text-[#186737] hover:underline">Privacy Policy</Link>{" "}&amp;{" "}
                    <Link href="/pages/refund-policy" className="text-[#186737] hover:underline">Terms and Conditions</Link>.</p>
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-[11px] text-red-500 mt-1 ml-6">{errors.consent}</p>
                )}

                {/* API error */}
                {errors._api && (
                  <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-[9px] text-sm text-red-600 font-medium">
                    {errors._api}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-[9px] bg-[#186737] hover:bg-[#145c30] disabled:opacity-70 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {loading ? (
                    <svg
                      className="animate-spin"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeOpacity="0.3"
                        strokeWidth="3"
                      />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <>
                      <Send size={15} />
                      Submit Request
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* ── Right Sidebar ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Live Support */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#186737]/10 flex items-center justify-center">
                  <Headphones size={17} className="text-[#186737]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Live Support
                  </h3>
                  <span className="flex items-center gap-1 text-[11px] text-[#186737] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#186737] animate-pulse" />
                    Online Now
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600 mb-4">
                <p className="font-semibold text-gray-700 text-[11px] uppercase tracking-wide">
                  Support Hours
                </p>
                <div className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span className="font-semibold">8:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold">9:30 AM – 3:00 PM</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                  Contact Numbers
                </p>
                <a
                  href="tel:+18664467322"
                  className="flex items-center gap-2 text-sm font-semibold text-[#186737] hover:underline"
                >
                  <Phone size={13} /> +1 (866) 446-7322
                </a>
                {/* <a
                  href="tel:+18664467323"
                  className="flex items-center gap-2 text-sm font-semibold text-[#186737] hover:underline"
                >
                  <Phone size={13} /> (866) 446-7323
                </a> */}
              </div>

              {/* <a
                href="tel:+18664467322"
                className="mt-4 flex items-center justify-center gap-2 h-10 w-full rounded-[8px] bg-[#186737] hover:bg-[#145c30] text-white text-xs font-bold transition-all"
              >
                <Phone size={13} /> Call Us 
              </a> */}
            </div>

            {/* Showroom */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                  <MapPin size={17} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Visit Our Showroom
                  </h3>
                  <p className="text-[11px] text-gray-400">Houston, Texas</p>
                </div>
              </div>

              <div className="rounded-[10px] overflow-hidden border border-gray-100 mb-4">
                <iframe
                  title="HorecaStore Showroom"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3465.7!2d-95.3698!3d29.7604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDQ1JzM3LjQiTiA5NcKwMjInMTEuMyJX!5e0!3m2!1sen!2sus!4v1600000000000"
                  width="100%"
                  height="160"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
              </div>

              <div className="space-y-1 mb-4">
                <p className="text-xs font-semibold text-gray-700">
                  HorecaStore Showroom
                </p>
                <p className="text-xs text-gray-500">
                  6802 Bissonet Street, Ste A · Houston, Texas 77074
                </p>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-10 w-full rounded-[8px] border border-[#186737] text-[#186737] hover:bg-[#186737] hover:text-white text-xs font-bold transition-all"
              >
                <MapPin size={13} /> Get Directions
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <MessageCircle size={17} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Quick Reply via WhatsApp
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Fastest way to reach us
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Need a quick reply? Chat with us on WhatsApp for instant
                support.
              </p>
              <a
                href="https://wa.me/18664467322"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-10 w-full rounded-[8px] bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-all"
              >
                <MessageCircle size={13} /> Message Us
              </a>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Mail size={17} className="text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-700">
                  Email Us Directly
                </p>
                <a
                  href="mailto:sales@thehorecastore.com"
                  className="text-xs text-[#186737] hover:underline break-all"
                >
              sales@thehorecastore.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats + Trusted By ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center mb-8">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#DEF9EC] flex items-center justify-center text-[#186737]">
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Brand logos */}
          <div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-5">
              Trusted By Leading Businesses
            </h3>
            <div className="flex flex-wrap justify-between items-center gap-4 border border-[#E2E8F0] rounded-lg p-5">
              {logos.map((logo) => (
                <div
                  key={logo.alt}
                  className="flex justify-center items-center w-[45%] sm:w-[17%]"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={160}
                    height={65}
                    className="h-12 w-full object-contain max-h-16"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Frequently Asked <span className="text-[#186737]">Questions</span>
            </h2>
            <p className="text-sm text-gray-500">
              From delivery to returns, we&apos;ve answered the most common
              questions. Still need help?{" "}
              <a
                href="#form"
                className="text-[#186737] hover:underline font-medium"
              >
                Chat or email us
              </a>{" "}
              — we&apos;re happy to assist.
            </p>
          </div>

          {/* Tab Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
            {ButtonTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-[#186737] text-white border-[#186737] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#186737] hover:text-[#186737]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Questions count badge */}
          <p className="text-[11px] text-gray-400 mb-4 font-medium">
            {activeQuestions.length} questions in{" "}
            <span className="text-[#186737] font-semibold">{activeTab}</span>
          </p>

          {/* Accordion */}
          <Accordion type="single" collapsible className="space-y-0">
            {activeQuestions.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-sm font-semibold text-gray-800 hover:text-[#186737] transition-colors text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p
                    className="text-sm text-gray-500 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
