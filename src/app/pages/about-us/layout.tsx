import type { Metadata } from "next";
import { STATIC_SEO } from "@/data/seo/static-pages-seo";

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
  },
};

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
