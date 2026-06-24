import type { Metadata } from "next";
import { STATIC_SEO } from "@/data/seo/static-pages-seo";

const s = STATIC_SEO.wishlist;

export const metadata: Metadata = {
  title: s.title,
  description: s.description,
  robots: s.robots,
  alternates: { canonical: s.canonical },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
