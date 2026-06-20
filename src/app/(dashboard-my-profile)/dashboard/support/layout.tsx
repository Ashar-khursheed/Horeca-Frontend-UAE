import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Center | HorecaStore",
  description: "Get help and support for your HorecaStore orders and account.",
  robots: { index: false, follow: false },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
