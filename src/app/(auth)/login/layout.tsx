import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | HorecaStore",
  description: "Sign in to your HorecaStore account to manage orders, wishlist, and more.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
