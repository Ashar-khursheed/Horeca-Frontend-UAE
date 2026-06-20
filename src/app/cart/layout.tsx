import type { Metadata } from "next";
import { STATIC_SEO } from "@/data/seo/static-pages-seo";

const s = STATIC_SEO.cart;

export const metadata: Metadata = {
  title: s.title,
  description: s.description,
  robots: s.robots,
  alternates: { canonical: s.canonical },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
