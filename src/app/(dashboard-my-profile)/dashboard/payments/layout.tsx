import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments & Invoices | HorecaStore",
  description: "View your payment history and invoices on HorecaStore.",
  robots: { index: false, follow: false },
};

export default function PaymentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
