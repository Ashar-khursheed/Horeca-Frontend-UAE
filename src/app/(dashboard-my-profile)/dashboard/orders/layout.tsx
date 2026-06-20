import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders | HorecaStore",
  description: "View and track all your HorecaStore orders.",
  robots: { index: false, follow: false },
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
