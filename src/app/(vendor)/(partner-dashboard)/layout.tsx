import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Dashboard | HorecaStore",
  robots: { index: false, follow: false },
};

export default function PartnerDashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
