import type { Metadata } from "next";
import { STATIC_SEO } from "@/data/seo/static-pages-seo";
import { SITE_URL } from "@/utils/site-url";

const s = STATIC_SEO.aboutUs;

export const metadata: Metadata = {
  title: s.title,
  description: s.description,
  robots: s.robots,
  alternates: { canonical: s.canonical },
  openGraph: {
    title: s.og.title,
    description: s.og.description,
    url: s.canonical,
    type: "website",
    images: [{ url: `${SITE_URL}/images/logo/11_Sep_2025_logo.png`, alt: "HorecaStore" }],
  },
};

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
