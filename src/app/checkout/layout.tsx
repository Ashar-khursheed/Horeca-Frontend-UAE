import type { Metadata } from "next";
import Script from "next/script";
import { STATIC_SEO } from "@/data/seo/static-pages-seo";

const s = STATIC_SEO.checkout;

export const metadata: Metadata = {
  title: s.title,
  description: s.description,
  robots: s.robots,
  alternates: { canonical: s.canonical },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Preload Square Web Payments SDK as soon as checkout layout mounts */}
      {/* <Script
        src={process.env.NEXT_PUBLIC_SQUARE_CDN_LINK!}
        strategy="afterInteractive"
      /> */}
      {children}
    </>
  );
}
