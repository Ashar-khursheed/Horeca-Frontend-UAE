import type { Metadata } from "next";
import { SITE_URL } from "@/utils/site-url";

export const metadata: Metadata = {
  title: "Commercial Kitchen Equipment Brands | HorecaStore",
  description:
    "Browse top commercial kitchen equipment brands at HorecaStore. Shop trusted manufacturers for restaurant supplies, cookware, refrigeration, and foodservice essentials.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/brands` },
  openGraph: {
    title: "Commercial Kitchen Equipment Brands | HorecaStore",
    description:
      "Discover leading restaurant equipment brands at HorecaStore. Find reliable commercial kitchen products from trusted manufacturers.",
    url: `${SITE_URL}/brands`,
    type: "website",
  },
};

export default function BrandsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
