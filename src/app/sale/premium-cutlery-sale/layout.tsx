import type { Metadata } from "next";
import { SITE_URL } from "@/utils/site-url";

const canonical = `${SITE_URL}/sale/premium-cutlery-sale`;

export const metadata: Metadata = {
  title: "Premium Cutlery Sale | HorecaStore",
  description:
    "Shop exclusive deals on premium restaurant cutlery. Gold, silver, black and copper collections for hotels, restaurants and catering.",
  robots: { index: true, follow: true },
  alternates: { canonical },
  openGraph: {
    title: "Premium Cutlery Sale | HorecaStore",
    description:
      "Shop exclusive deals on premium restaurant cutlery. Gold, silver, black and copper collections for hotels, restaurants and catering.",
    url: canonical,
    type: "website",
  },
};

export default function PremiumCutlerySaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
