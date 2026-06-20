import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings | HorecaStore",
  description: "Manage your HorecaStore account profile and settings.",
  robots: { index: false, follow: false },
};

export default function MyProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
