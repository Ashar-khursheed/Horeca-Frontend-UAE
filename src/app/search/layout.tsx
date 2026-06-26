import type { Metadata } from "next";
import { SITE_URL } from "@/utils/site-url";

export const metadata: Metadata = {
  title: "Search | HorecaStore",
  description: "Search commercial kitchen equipment and restaurant supplies at HorecaStore.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/search` },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
