import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browsing History | HorecaStore",
  description: "View your recently browsed products on HorecaStore.",
  robots: { index: false, follow: false },
};

export default function BrowsingHistoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
