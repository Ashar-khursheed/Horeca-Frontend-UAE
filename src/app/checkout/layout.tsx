import type { Metadata } from "next";
import { STATIC_SEO } from "@/data/seo/static-pages-seo";

const s = STATIC_SEO.checkout;

export const metadata: Metadata = {
  title: s.title,
  description: s.description,
  robots: s.robots,
  alternates: { canonical: s.canonical },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
