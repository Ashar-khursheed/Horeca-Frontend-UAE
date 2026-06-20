import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | HorecaStore",
  description: "Create a HorecaStore account to access exclusive deals, order tracking, and more.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
