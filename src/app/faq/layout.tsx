import type { Metadata } from "next";
import { SITE_URL } from "@/utils/site-url";

export const metadata: Metadata = {
  title: "FAQ | Restaurant Equipment & Supplies | HorecaStore",
  description:
    "Find answers to common questions about commercial kitchen equipment, restaurant supplies, shipping, returns, and ordering from HorecaStore.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    title: "FAQ | Restaurant Equipment & Supplies | HorecaStore",
    description:
      "Get expert answers about restaurant equipment, supplies, delivery, and support from HorecaStore.",
    url: `${SITE_URL}/faq`,
    type: "website",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
