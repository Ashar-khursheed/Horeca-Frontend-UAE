import type { Metadata } from "next";
import RestaurantAdsPage from "@/features/starting-a-restaurant";
import { STATIC_SEO } from "@/data/seo/static-pages-seo";

const s = STATIC_SEO.startingARestaurant;

export const metadata: Metadata = {
  title: s.title,
  description: s.description,
  robots: s.robots,
  alternates: { canonical: s.canonical },
  openGraph: {
    title: s.og.title,
    description: s.og.description,
    url: s.canonical,
    type: "website",
  },
};

export default function StartingARestaurantPage() {
  return (
    <div>
      <RestaurantAdsPage />
    </div>
  );
}
