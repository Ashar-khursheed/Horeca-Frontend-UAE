// "use client";

// import Link from "next/link";
// import {
//   Phone,
//   Mail,
//   MapPin,
//   Facebook,
//   Twitter,
//   Instagram,
//   Linkedin,
//   Youtube,
//   ChevronDown,
//   ChevronUp,
//   ArrowUpRight,
// } from "lucide-react";
// import { useState } from "react";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface Category {
//   id: number;
//   name: string;
//   slug: string;
//   children?: Category[];
// }

// // ─── Data — top-level categories from your JSON ───────────────────────────────
// const TOP_CATEGORIES: Category[] = [
//   {
//     id: 1,
//     name: "Restaurant Equipment",
//     slug: "restaurant-equipment",
//     children: [
//       { id: 61, name: "Commercial Coffee Machines", slug: "commercial-coffee-machine" },
//       { id: 40, name: "Commercial Cooking Equipment", slug: "commercial-cooking-equipment" },
//       { id: 42, name: "Food Prep Equipment", slug: "food-prep-equipment" },
//       { id: 62, name: "Commercial Oven", slug: "commercial-oven" },
//       { id: 65, name: "Commercial Dishwasher", slug: "commercial-dishwasher" },
//       { id: 63, name: "Beverage Equipment", slug: "beverage-equipment" },
//       { id: 595, name: "Commercial Shelving", slug: "commercial-shelving" },
//       { id: 44, name: "Commercial Work Tables", slug: "commercial-work-tables" },
//     ],
//   },
//   {
//     id: 45,
//     name: "Refrigeration",
//     slug: "refrigeration",
//     children: [
//       { id: 46, name: "Commercial Refrigerator", slug: "commercial-refrigerator" },
//       { id: 88, name: "Commercial Freezer", slug: "commercial-freezer" },
//       { id: 87, name: "Ice Machine", slug: "ice-machine" },
//       { id: 950, name: "Walk-In Refrigerator", slug: "walk-in-refrigerator" },
//     ],
//   },
//   {
//     id: 67,
//     name: "Tableware",
//     slug: "tableware",
//     children: [
//       { id: 68, name: "Crockery", slug: "crockery" },
//       { id: 69, name: "Serveware", slug: "serveware" },
//       { id: 71, name: "Melamine Dinnerware", slug: "melamine-dinnerware" },
//       { id: 74, name: "Glassware", slug: "glassware" },
//       { id: 75, name: "Bar Equipment", slug: "bar-equipment" },
//       { id: 941, name: "Cutlery", slug: "cutlery" },
//     ],
//   },
//   {
//     id: 76,
//     name: "Smallware",
//     slug: "smallware",
//     children: [
//       { id: 77, name: "Cookware", slug: "cookware" },
//       { id: 81, name: "Kitchen Knives", slug: "kitchen-knives" },
//       { id: 82, name: "Baking Tools & Supplies", slug: "baking-tools-supplies" },
//       { id: 83, name: "Kitchen Supplies", slug: "kitchen-supplies" },
//       { id: 78, name: "Storage & Transportation", slug: "storage-transportation" },
//       { id: 80, name: "Food Pans", slug: "food-pans-food-accessories" },
//     ],
//   },
//   {
//     id: 96,
//     name: "Hotel Supplies",
//     slug: "hotel-supplies",
//     children: [
//       { id: 97, name: "Guest Room Supplies", slug: "guest-room-supplies" },
//       { id: 99, name: "Heating & Cooling", slug: "heating-cooling-systems" },
//     ],
//   },
// ];

// const QUICK_LINKS = [
//   { label: "About Us", href: "/about" },
//   { label: "Starting a Restaurant?", href: "/starting-a-restaurant" },
//   { label: "Financing Options", href: "/financing" },
//   { label: "Request a Quote", href: "/quote" },
//   { label: "Track Your Order", href: "/track-order" },
//   { label: "Returns & Refunds", href: "/returns" },
//   { label: "Warranty Info", href: "/warranty" },
//   { label: "Blog & Resources", href: "/blog" },
// ];

// const SUPPORT_LINKS = [
//   { label: "Help Center", href: "/help" },
//   { label: "Contact Us", href: "/contact" },
//   { label: "Live Chat", href: "/chat" },
//   { label: "FAQs", href: "/faqs" },
//   { label: "Shipping Policy", href: "/shipping" },
//   { label: "Terms of Service", href: "/terms" },
//   { label: "Privacy Policy", href: "/privacy" },
//   { label: "Sitemap", href: "/sitemap" },
// ];

// const SOCIAL_LINKS = [
//   { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
//   { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
//   { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
//   { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
//   { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
// ];

// // ─── Mobile Accordion ──────────────────────────────────────────────────────────
// const MobileAccordion = ({ category }: { category: Category }) => {
//   const [open, setOpen] = useState(false);
//   return (
//     <div className="border-b border-gray-100">
//       <button
//         onClick={() => setOpen(!open)}
//         className="w-full flex items-center justify-between py-3 text-left"
//       >
//         <span className="text-sm font-semibold text-gray-800">{category.name}</span>
//         {open ? (
//           <ChevronUp className="w-4 h-4 text-[#186737]" />
//         ) : (
//           <ChevronDown className="w-4 h-4 text-gray-400" />
//         )}
//       </button>
//       {open && (
//         <div className="pb-3 pl-2 flex flex-col gap-1.5">
//           {category.children?.map((child) => (
//             <Link
//               key={child.id}
//               href={`/${child.slug}`}
//               className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors"
//             >
//               {child.name}
//             </Link>
//           ))}
//           <Link
//             href={`/${category.slug}`}
//             className="text-[12px] font-semibold text-[#186737] flex items-center gap-1 mt-1"
//           >
//             View All <ArrowUpRight className="w-3 h-3" />
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Main Footer ──────────────────────────────────────────────────────────────
// export const Footer = () => {
//   return (
//     <footer className="bg-white border-t border-gray-100">
//       {/* ── Top CTA Banner ── */}
//       <div className="header-bg">
//         <div className="global-container py-8 sm:py-10">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
//             <div className="text-center sm:text-left">
//               <p className="text-white/70 text-sm font-medium tracking-wide uppercase mb-1">
//                 Need Help Getting Started?
//               </p>
//               <h2 className="text-white text-xl sm:text-2xl font-bold">
//                 We're Always Here To Help
//               </h2>
//             </div>
//             <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
//               <a
//                 href="tel:+18664467322"
//                 className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-5 py-3 rounded-[7px] transition-all duration-200 group"
//               >
//                 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
//                   <Phone className="w-4 h-4 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-white/60 text-[10px] font-medium uppercase tracking-wide">
//                     Call Us
//                   </p>
//                   <p className="text-white font-semibold text-sm">+1 (866) 446-7322</p>
//                 </div>
//               </a>
//               <a
//                 href="mailto:support@horecastore.com"
//                 className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-5 py-3 rounded-[7px] transition-all duration-200"
//               >
//                 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
//                   <Mail className="w-4 h-4 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-white/60 text-[10px] font-medium uppercase tracking-wide">
//                     Email Support
//                   </p>
//                   <p className="text-white font-semibold text-sm">support@horecastore.com</p>
//                 </div>
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Category Grid — Desktop ── */}
//       <div className="global-container py-10 hidden md:block">
//         <div className="grid grid-cols-3 lg:grid-cols-5 gap-8">
//           {TOP_CATEGORIES.map((cat) => (
//             <div key={cat.id}>
//               <Link
//                 href={`/${cat.slug}`}
//                 className="group flex items-center gap-1 mb-4"
//               >
//                 <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#186737] transition-colors">
//                   {cat.name}
//                 </h3>
//                 <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#186737] transition-colors opacity-0 group-hover:opacity-100" />
//               </Link>
//               <ul className="flex flex-col gap-2">
//                 {cat.children?.map((child) => (
//                   <li key={child.id}>
//                     <Link
//                       href={`/${child.slug}`}
//                       className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors leading-relaxed"
//                     >
//                       {child.name}
//                     </Link>
//                   </li>
//                 ))}
//                 <li>
//                   <Link
//                     href={`/${cat.slug}`}
//                     className="text-[12px] font-semibold text-[#186737] flex items-center gap-1 mt-1 hover:underline"
//                   >
//                     View All <ArrowUpRight className="w-3 h-3" />
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── Category Accordion — Mobile ── */}
//       <div className="global-container py-6 block md:hidden">
//         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
//           Browse Categories
//         </p>
//         {TOP_CATEGORIES.map((cat) => (
//           <MobileAccordion key={cat.id} category={cat} />
//         ))}
//       </div>

//       {/* ── Divider ── */}
//       <div className="global-container">
//         <div className="border-t border-gray-100" />
//       </div>

//       {/* ── Middle Row: Quick Links + Support + Newsletter ── */}
//       <div className="global-container py-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Quick Links */}
//           <div>
//             <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
//               <span className="w-1 h-4 bg-[#186737] rounded-full inline-block" />
//               Quick Links
//             </h4>
//             <ul className="flex flex-col gap-2">
//               {QUICK_LINKS.map((link) => (
//                 <li key={link.href}>
//                   <Link
//                     href={link.href}
//                     className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Support */}
//           <div>
//             <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
//               <span className="w-1 h-4 bg-[#186737] rounded-full inline-block" />
//               Customer Support
//             </h4>
//             <ul className="flex flex-col gap-2">
//               {SUPPORT_LINKS.map((link) => (
//                 <li key={link.href}>
//                   <Link
//                     href={link.href}
//                     className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div>
//             <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
//               <span className="w-1 h-4 bg-[#186737] rounded-full inline-block" />
//               Contact Info
//             </h4>
//             <ul className="flex flex-col gap-3">
//               <li className="flex items-start gap-3">
//                 <div className="w-7 h-7 rounded-[7px] bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
//                   <Phone className="w-3.5 h-3.5 text-[#186737]" />
//                 </div>
//                 <div>
//                   <p className="text-[11px] text-gray-400 font-medium">Phone</p>
//                   <a
//                     href="tel:+18664467322"
//                     className="text-[13px] text-gray-700 hover:text-[#186737] transition-colors font-medium"
//                   >
//                     +1 (866) 446-7322
//                   </a>
//                 </div>
//               </li>
//               <li className="flex items-start gap-3">
//                 <div className="w-7 h-7 rounded-[7px] bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
//                   <Mail className="w-3.5 h-3.5 text-[#186737]" />
//                 </div>
//                 <div>
//                   <p className="text-[11px] text-gray-400 font-medium">Email</p>
//                   <a
//                     href="mailto:support@horecastore.com"
//                     className="text-[13px] text-gray-700 hover:text-[#186737] transition-colors font-medium"
//                   >
//                     support@horecastore.com
//                   </a>
//                 </div>
//               </li>
//               <li className="flex items-start gap-3">
//                 <div className="w-7 h-7 rounded-[7px] bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
//                   <MapPin className="w-3.5 h-3.5 text-[#186737]" />
//                 </div>
//                 <div>
//                   <p className="text-[11px] text-gray-400 font-medium">Address</p>
//                   <p className="text-[13px] text-gray-700 leading-relaxed">
//                     123 Commerce Blvd,<br />
//                     New York, NY 10001
//                   </p>
//                 </div>
//               </li>
//             </ul>
//           </div>

//           {/* Newsletter */}
//           <div>
//             <h4 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
//               <span className="w-1 h-4 bg-[#186737] rounded-full inline-block" />
//               Newsletter
//             </h4>
//             <p className="text-[12px] text-gray-400 mb-4 leading-relaxed">
//               Get deals, new products & restaurant tips straight to your inbox.
//             </p>
//             <div className="flex flex-col gap-2">
//               <input
//                 type="email"
//                 placeholder="Your email address"
//                 className="w-full border border-gray-200 rounded-[7px] px-3.5 py-2.5 text-[13px] text-gray-700 placeholder:text-gray-300 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all"
//               />
//               <button className="w-full bg-[#186737] hover:bg-[#145a2f] text-white text-[13px] font-semibold py-2.5 rounded-[7px] transition-colors duration-200">
//                 Subscribe
//               </button>
//             </div>

//             {/* Social Links */}
//             <div className="mt-5">
//               <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest mb-3">
//                 Follow Us
//               </p>
//               <div className="flex items-center gap-2">
//                 {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
//                   <a
//                     key={label}
//                     href={href}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     aria-label={label}
//                     className="w-8 h-8 rounded-[7px] border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#186737] hover:text-[#186737] hover:bg-green-50 transition-all duration-200"
//                   >
//                     <Icon className="w-3.5 h-3.5" />
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Divider ── */}
//       <div className="global-container">
//         <div className="border-t border-gray-100" />
//       </div>

//       {/* ── Bottom Bar ── */}
//       <div className="global-container py-5">
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//           {/* Copyright */}
//           <p className="text-[12px] text-gray-400 text-center sm:text-left">
//             © {new Date().getFullYear()} HorecaStore. All Rights Reserved.
//           </p>

//           {/* Payment Methods */}
//           <div className="flex items-center gap-2">
//             <span className="text-[11px] text-gray-400 mr-1">We Accept:</span>
//             {["VISA", "MC", "AMEX", "PayPal", "CASH"].map((method) => (
//               <div
//                 key={method}
//                 className="h-7 px-2 border border-gray-200 rounded-[7px] flex items-center justify-center bg-gray-50"
//               >
//                 <span className="text-[10px] font-bold text-gray-500">{method}</span>
//               </div>
//             ))}
//           </div>

//           {/* Legal Links */}
//           <div className="flex items-center gap-4">
//             {[
//               { label: "Privacy", href: "/privacy" },
//               { label: "Terms", href: "/terms" },
//               { label: "Sitemap", href: "/sitemap" },
//             ].map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className="text-[12px] text-gray-400 hover:text-[#186737] transition-colors"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;




"use client";

import {
    ArrowUpRight,
    ChevronDown,
    ChevronUp,
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Twitter,
    Youtube,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category {
  id: number;
  name: string;
  slug: string;
  children?: Category[];
}

interface LinkItem {
  label: string;
  href: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const TOP_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Restaurant Equipment",
    slug: "restaurant-equipment",
    children: [
      { id: 61, name: "Commercial Coffee Machines", slug: "commercial-coffee-machine" },
      { id: 40, name: "Commercial Cooking Equipment", slug: "commercial-cooking-equipment" },
      { id: 42, name: "Food Prep Equipment", slug: "food-prep-equipment" },
      { id: 62, name: "Commercial Oven", slug: "commercial-oven" },
      { id: 65, name: "Commercial Dishwasher", slug: "commercial-dishwasher" },
      { id: 63, name: "Beverage Equipment", slug: "beverage-equipment" },
      { id: 595, name: "Commercial Shelving", slug: "commercial-shelving" },
      { id: 44, name: "Commercial Work Tables", slug: "commercial-work-tables" },
    ],
  },
  {
    id: 45,
    name: "Refrigeration",
    slug: "refrigeration",
    children: [
      { id: 46, name: "Commercial Refrigerator", slug: "commercial-refrigerator" },
      { id: 88, name: "Commercial Freezer", slug: "commercial-freezer" },
      { id: 87, name: "Ice Machine", slug: "ice-machine" },
      { id: 950, name: "Walk-In Refrigerator", slug: "walk-in-refrigerator" },
    ],
  },
  {
    id: 67,
    name: "Tableware",
    slug: "tableware",
    children: [
      { id: 68, name: "Crockery", slug: "crockery" },
      { id: 69, name: "Serveware", slug: "serveware" },
      { id: 71, name: "Melamine Dinnerware", slug: "melamine-dinnerware" },
      { id: 74, name: "Glassware", slug: "glassware" },
      { id: 75, name: "Bar Equipment", slug: "bar-equipment" },
      { id: 941, name: "Cutlery", slug: "cutlery" },
    ],
  },
  {
    id: 76,
    name: "Smallware",
    slug: "smallware",
    children: [
      { id: 77, name: "Cookware", slug: "cookware" },
      { id: 81, name: "Kitchen Knives", slug: "kitchen-knives" },
      { id: 82, name: "Baking Tools & Supplies", slug: "baking-tools-supplies" },
      { id: 83, name: "Kitchen Supplies", slug: "kitchen-supplies" },
      { id: 78, name: "Storage & Transportation", slug: "storage-transportation" },
      { id: 80, name: "Food Pans", slug: "food-pans-food-accessories" },
    ],
  },
  {
    id: 96,
    name: "Hotel Supplies",
    slug: "hotel-supplies",
    children: [
      { id: 97, name: "Guest Room Supplies", slug: "guest-room-supplies" },
      { id: 99, name: "Heating & Cooling", slug: "heating-cooling-systems" },
    ],
  },
];

const QUICK_LINKS: LinkItem[] = [
  { label: "About Us", href: "/about" },
  { label: "Starting a Restaurant?", href: "/starting-a-restaurant" },
  { label: "Financing Options", href: "/financing" },
  { label: "Request a Quote", href: "/quote" },
  { label: "Track Your Order", href: "/track-order" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Warranty Info", href: "/warranty" },
  { label: "Blog & Resources", href: "/blog" },
];

const SUPPORT_LINKS: LinkItem[] = [
  { label: "Help Center", href: "/help" },
  { label: "Contact Us", href: "/contact" },
  { label: "Live Chat", href: "/chat" },
  { label: "FAQs", href: "/faqs" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Sitemap", href: "/sitemap" },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

// ─── Category Accordion (Mobile) ─────────────────────────────────────────────
const CategoryAccordion = ({ category }: { category: Category }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="text-sm font-semibold text-gray-800">{category.name}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[#186737]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="pb-3 pl-2 flex flex-col gap-1.5">
          {category.children?.map((child) => (
            <Link
              key={child.id}
              href={`/${child.slug}`}
              className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors"
            >
              {child.name}
            </Link>
          ))}
          <Link
            href={`/${category.slug}`}
            className="text-[12px] font-semibold text-[#186737] flex items-center gap-1 mt-1"
          >
            View All <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
};

// ─── Links Accordion (Mobile) — Quick Links & Support ────────────────────────
const LinksAccordion = ({ title, links }: { title: string; links: LinkItem[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[#186737]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="pb-3 pl-2 flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Footer ──────────────────────────────────────────────────────────────
export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">

      {/* ── Top CTA Banner ── */}
      <div className="bg-[#f3f4f8] ">
        <div className="global-container py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between md:gap-6">
            <div className="text-center sm:text-left">
              <p className="text-[#7e859b] text-sm font-medium tracking-wide uppercase mb-1 md:flex hidden">
                Need Help Getting Started?
              </p>
              <p className="text-[#7e859b] text-[12px] font-medium tracking-wide uppercase mb-1 md:hidden block">
            Our team is here to guide you with the best solutions for your restaurant.

              </p>
              <h2 className="text-black text-xl sm:text-2xl font-bold md:hidden block">
                Need Expert Assistance? 
              </h2>
              <h2 className="text-black text-xl sm:text-2xl font-bold md:block hidden">
                We're Always Here To Help
              </h2>
            </div>
            <div className="md:flex hidden flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <a
                href="tel:+18664467322"
                className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-black px-5 py-3 rounded-[7px] transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-black" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[#7e859b] text-[15px] font-medium uppercase tracking-wide">Call Us</p>
                  <p className="text-black font-semibold text-base">+1 (866) 446-7322</p>
                </div>
              </a>
              <a
                href="mailto:support@horecastore.com"
                className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-5 py-3 rounded-[7px] transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-black" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[#7e859b] text-[15px] font-medium uppercase tracking-wide">Email Support</p>
                  <p className="text-black font-semibold text-base">support@horecastore.com</p>
                </div>
              </a>
            </div>

            <div className="block md:hidden ">
              {/* Mobile CTA Buttons */}
           <a href="tel:+18664467322" className="bg-[#186737] relative top-2.5 p-2.5 text-white 2xl:px-4 px-2.5 2xl:py-3 py-1.5 rounded  2xl:text-[14px] text-[12px] ">Talk to Our Expert Now</a>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP — Category Grid (md+)
      ══════════════════════════════════════════ */}
      <div className="global-container py-10 hidden md:block">
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-8">
          {TOP_CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <Link href={`/${cat.slug}`} className="group flex items-center gap-1 mb-4">
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#186737] transition-colors">
                  {cat.name}
                </h3>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#186737] transition-colors opacity-0 group-hover:opacity-100" />
              </Link>
              <ul className="flex flex-col gap-2">
                {cat.children?.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={`/${child.slug}`}
                      className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors leading-relaxed"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/${cat.slug}`}
                    className="text-[12px] font-semibold text-[#186737] flex items-center gap-1 mt-1 hover:underline"
                  >
                    View All <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE — All Accordions (< md)
      ══════════════════════════════════════════ */}
      <div className="global-container py-4 block md:hidden">

        {/* Categories */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-3 pb-1">
          Browse Categories
        </p>
        {TOP_CATEGORIES.map((cat) => (
          <CategoryAccordion key={cat.id} category={cat} />
        ))}

        {/* Quick Links */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-4 pb-1">
          Company
        </p>
        <LinksAccordion title="Quick Links" links={QUICK_LINKS} />

        {/* Support */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-4 pb-1">
          Help
        </p>
        <LinksAccordion title="Customer Support" links={SUPPORT_LINKS} />
      </div>

      {/* ── Divider ── */}
      <div className="global-container">
        <div className="border-t border-gray-100" />
      </div>

      {/* ══════════════════════════════════════════
          Middle Row — Desktop: 4 cols | Mobile: stacked
      ══════════════════════════════════════════ */}
      <div className="global-container py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Quick Links — Desktop only */}
          <div className="hidden md:block">
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#186737] rounded-full inline-block" />
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support — Desktop only */}
          <div className="hidden md:block">
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#186737] rounded-full inline-block" />
              Customer Support
            </h4>
            <ul className="flex flex-col gap-2">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-gray-500 hover:text-[#186737] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info — always visible */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#186737] rounded-full inline-block" />
              Contact Info
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-[7px] bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-[#186737]" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Phone</p>
                  <a href="tel:+18664467322" className="text-[13px] text-gray-700 hover:text-[#186737] transition-colors font-medium">
                    +1 (866) 446-7322
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-[7px] bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#186737]" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Email</p>
                  <a href="mailto:support@horecastore.com" className="text-[13px] text-gray-700 hover:text-[#186737] transition-colors font-medium">
                    support@horecastore.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-[7px] bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#186737]" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Address</p>
                  <p className="text-[13px] text-gray-700 leading-relaxed">
                    123 Commerce Blvd,<br />New York, NY 10001
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter — always visible */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#186737] rounded-full inline-block" />
              Newsletter
            </h4>
            <p className="text-[12px] text-gray-400 mb-4 leading-relaxed">
              Get deals, new products & restaurant tips straight to your inbox.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full border border-gray-200 rounded-[7px] px-3.5 py-2.5 text-[13px] text-gray-700 placeholder:text-gray-300 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all"
              />
              <button className="w-full bg-[#186737] hover:bg-[#145a2f] text-white text-[13px] font-semibold py-2.5 rounded-[7px] transition-colors duration-200">
                Subscribe
              </button>
            </div>
            <div className="mt-5">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-[7px] border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#186737] hover:text-[#186737] hover:bg-green-50 transition-all duration-200"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="global-container">
        <div className="border-t border-gray-100" />
      </div>

      {/* ── Bottom Bar ── */}
      <div className="global-container py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-gray-400 text-center sm:text-left">
            © 2026 HorecaStore. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 mr-1">We Accept:</span>
            {["VISA", "MC", "AMEX", "PayPal", "CASH"].map((method) => (
              <div key={method} className="h-7 px-2 border border-gray-200 rounded-[7px] flex items-center justify-center bg-gray-50">
                <span className="text-[10px] font-bold text-gray-500">{method}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Sitemap", href: "/sitemap" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-[12px] text-gray-400 hover:text-[#186737] transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;