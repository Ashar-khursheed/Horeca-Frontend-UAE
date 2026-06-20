import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | HorecaStore",
  robots: { index: false, follow: false },
};

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
