import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Quotes | HorecaStore",
  description: "Manage and view your quote requests on HorecaStore.",
  robots: { index: false, follow: false },
};

export default function QuotesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
