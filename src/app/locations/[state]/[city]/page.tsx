import type { Metadata } from "next";
import LocationPageClient from "@/features/location/LocationPageClient";
import type { LocationPageData } from "@/features/location/LocationPageClient";

export const dynamic = "force-static";

interface PageProps {
  params: Promise<{ state: string; city: string }>;
}

// ── Hardcoded page data ────────────────────────────────────────────────────────
const HOUSTON_DATA: LocationPageData = {
  id: 43366,
  heroTitle: "Houston Restaurant Supply",
  heroDescription:
    "<p>Power your kitchen with professional-grade refrigeration, cooking equipment, and prep solutions designed to keep your business running smoothly.</p>",
  heroCta: "SHOP RESTAURANT SUPPLIES",
  banner_slug: "https://www.thehorecastore.com/",
  banner_image_file:
    "https://d1p9kdrbe10xzz.cloudfront.net/production/seo-banners/hW2ofhAMdJZOuQ4RVGAjouElshVxIRoh3QXlMOrg.webp",
  banner_image_alt_text:
    "Chef with laptop beside mobile shopping app and kitchen equipment, banner reads Order online, anytime, anywhere with delivery support icons.",

  leftParaDescription: `
    <h2>The HorecaStore — Houston's Premium Restaurant &amp; Kitchen Supply Store</h2>
    <p>Located in southwest Houston at 8960 Bissonnet Street, Suite A, Houston, TX 77074, The Horeca Store is a full-service restaurant supply and commercial kitchen equipment retailer serving foodservice professionals, hotels, cafs, restaurants, catering businesses, and hospitality operators throughout Greater Houston.</p>
    <p>At the HorecaStore, we provide top-quality <a href="/restaurant-equipment/commercial-cooking-equipment">commercial kitchen equipment in Houston, TX</a>, carefully selected to meet the needs of chefs, restaurant owners, and food service professionals. Our extensive inventory includes refrigeration units, commercial ovens, ice machines, food prep equipment, storage solutions, and all designed for durability, efficiency, and performance.</p>
    <p>The HorecaStore combines an in-person retail center with an online storefront that seasoned customers can shop, browse, and order the equipment they need — right from their home or virtually from one place.</p>
    <h3>Your Local Restaurant Supply Store Near You</h3>
    <p>Visit The HorecaStore at 8960 Bissonnet Street. TX We offer a comprehensive selection of commercial-grade products to help you build and maintain a high-performing kitchen. Whether you need refrigeration, food preparation tools, or storage solutions, we have everything you need in one place.</p>
  `,

  rightParaDescription: `
    <h3>Why Choose HorecaStore?</h3>
    <ul>
      <li>Commercial refrigeration and cooking equipment built for high-volume use</li>
      <li>Food preparation, cooking, and warming solutions for efficient workflows</li>
      <li>Durable restaurant and kitchen supplies designed for daily commercial use</li>
      <li>Equipment suited for restaurants, cafes, catering, and hotel kitchens</li>
    </ul>
  `,

  categories: [
    {
      id: 1,
      name: "Restaurant Equipment",
      slug: "restaurant-equipment",
      image: "https://d1p9kdrbe10xzz.cloudfront.net/production/categories/restaurant-equipment.webp",
    },
    {
      id: 2,
      name: "Refrigeration",
      slug: "refrigeration",
      image: "https://d1p9kdrbe10xzz.cloudfront.net/production/categories/refrigeration.webp",
    },
    {
      id: 3,
      name: "Commercial Cooking",
      slug: "restaurant-equipment/commercial-cooking-equipment",
      image: "https://d1p9kdrbe10xzz.cloudfront.net/production/categories/commercial-cooking.webp",
    },
    {
      id: 4,
      name: "Tableware",
      slug: "tableware",
      image: "https://d1p9kdrbe10xzz.cloudfront.net/production/categories/tableware.webp",
    },
    {
      id: 5,
      name: "Hotel Supplies",
      slug: "hotel-supplies",
      image: "https://d1p9kdrbe10xzz.cloudfront.net/production/categories/hotel-supplies.webp",
    },
    {
      id: 6,
      name: "Commercial Oven",
      slug: "restaurant-equipment/commercial-oven",
      image: "https://d1p9kdrbe10xzz.cloudfront.net/production/categories/commercial-oven.webp",
    },
    {
      id: 7,
      name: "Grocery",
      slug: "grocery",
      image: "https://d1p9kdrbe10xzz.cloudfront.net/production/categories/grocery.webp",
    },
  ],

  productTypes: [],

  faqs: [
    {
      question: "Which Restaurant Equipment Supplier Is The Best In Houston, TX?",
      answer:
        "<p>The HorecaStore is widely regarded as one of the best restaurant equipment suppliers in Houston, TX. We provide a wide selection of commercial kitchen equipment including refrigeration, cooking appliances, prep tables, and food storage solutions, all sourced from top industry brands trusted by foodservice professionals.</p>",
    },
    {
      question: "Where Can I Buy Commercial Kitchen Equipment In Houston?",
      answer:
        "<p>You can buy commercial kitchen equipment in Houston at The HorecaStore, located at 8960 Bissonnet Street, Suite A, Houston, TX 77074. We also offer a full online store at <a href='https://www.thehorecastore.com/'>thehorecastore.com</a> where you can browse and order equipment delivered directly to your facility.</p>",
    },
    {
      question: "Do You Offer Delivery In Houston, TX?",
      answer:
        "<p>Yes, The HorecaStore offers delivery services throughout Houston and surrounding areas. We work with reliable logistics partners to ensure your commercial kitchen equipment arrives safely and on schedule. Contact us for delivery options and timelines based on your location.</p>",
    },
    {
      question: "Do You Carry Energy-Efficient Commercial Kitchen Equipment?",
      answer:
        "<p>Yes, many of the commercial kitchen equipment products we carry at The HorecaStore are designed with energy efficiency in mind. From ENERGY STAR-rated refrigeration units to efficient commercial ovens, we help Houston foodservice businesses reduce operating costs while maintaining high performance.</p>",
    },
  ],

  paragraph_1: `<h2>Trusted Houston Restaurant Supply for Commercial Kitchens</h2><p>At The Horeca Store, we help restaurants, cafés, hotels, bakeries, and catering businesses find reliable Houston restaurant supply solutions designed for demanding foodservice environments. Commercial kitchens require durable refrigeration systems, prep stations, cooking equipment, and storage products that support efficient daily operations and long-term performance. Our goal is to provide professional-grade kitchen solutions that help businesses improve workflow, maintain food quality, and reduce operational downtime. Whether managing a fast-paced restaurant or opening a new hospitality concept, foodservice operators across Houston rely on dependable equipment built to handle high-volume commercial use while supporting smoother kitchen productivity.</p>`,

  paragraph_2: `<h2>Professional Restaurant Supply Store Houston TX Businesses Trust</h2><p>The Horeca Store provides dependable restaurant supply store Houston TX solutions tailored to modern foodservice operations. From cookware and shelving systems to prep equipment and commercial appliances, we help businesses source products designed for durability and consistent performance. Restaurants and hospitality operators often need equipment that can handle busy service hours while maintaining efficiency and organization throughout the kitchen. Our commercial product selection supports restaurants, food trucks, cafés, and institutional kitchens looking for practical foodservice solutions backed by trusted industry brands. By focusing on quality and reliability, we help businesses create productive kitchen environments that support long-term operational success.</p>`,

  paragraph_3: `<h2>Commercial Kitchen Equipment Houston TX for Foodservice Operations</h2><p>Restaurants searching for commercial kitchen equipment Houston TX providers need high-performance products capable of supporting demanding commercial workloads. At The Horeca Store, we offer professional refrigeration systems, cooking equipment, prep tables, food storage solutions, and heavy-duty appliances built for busy kitchen environments. Reliable commercial equipment helps improve workflow, maintain food consistency, and support faster service during peak operating hours. Many foodservice businesses also prioritize energy-efficient products and durable kitchen systems that reduce maintenance issues over time. Our focus is to provide dependable equipment solutions that help Houston restaurants operate more efficiently while maintaining professional foodservice standards.</p>`,

  paragraph_4: `<h2>Wholesale Restaurant Supply Houston TX for Growing Businesses</h2><p>As Houston's hospitality industry continues to expand, many restaurants and commercial kitchens look for wholesale restaurant supply Houston TX solutions that combine durability, value, and long-term performance. The Horeca Store supports foodservice businesses with professional kitchen products designed for restaurants, hotels, catering operations, and large-scale commercial facilities. From refrigeration and cooking appliances to serving essentials and storage systems, our equipment is selected to meet the demands of modern commercial kitchens. We focus on helping businesses build efficient, organized, and high-performing kitchen environments with products that support daily operations and long-term foodservice growth.</p>`,

  whyChoosePoints: [],

  popularTag_details: [
    { popularTags: "Commercial Cooking Equipment", popularSlug: "restaurant-equipment/commercial-cooking-equipment" },
    { popularTags: "Restaurant Equipment", popularSlug: "restaurant-equipment" },
    { popularTags: "Commercial Refrigeration", popularSlug: "refrigeration" },
    { popularTags: "Commercial Oven", popularSlug: "restaurant-equipment/commercial-oven" },
    { popularTags: "Commercial Pizza Oven", popularSlug: "restaurant-equipment/commercial-pizza-oven" },
    { popularTags: "Commercial Gas Fryer", popularSlug: "restaurant-equipment/commercial-gas-fryer" },
    { popularTags: "Commercial Convection Oven", popularSlug: "restaurant-equipment/commercial-convection-oven" },
  ],
};

// ── Per-city data map ──────────────────────────────────────────────────────────
function getPageData(state: string, city: string): LocationPageData | null {
  const key = `${state}/${city}`;
  const map: Record<string, LocationPageData> = {
    "texas/houston-restaurant-supply": HOUSTON_DATA,
  };
  return map[key] ?? null;
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, city } = await params;
  const data = getPageData(state, city);
  if (!data) return { title: "Page Not Found" };

  const title = `${data.heroTitle} | HorecaStore`;
  const description = `Find professional-grade commercial kitchen equipment and restaurant supplies in Houston, TX. The HorecaStore serves Houston foodservice professionals with durable, high-performance solutions.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.horecastore.ae/locations/${state}/${city}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.horecastore.ae/locations/${state}/${city}`,
      type: "website",
      images: [{ url: data.banner_image_file, alt: data.heroTitle }],
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function LocationCityPage({ params }: PageProps) {
  const { state, city } = await params;
  const data = getPageData(state, city);

  if (!data) {
    return (
      <div className="global-container py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page not found</h1>
        <p className="text-gray-500 mb-6">
          No location page found for <strong>{state}/{city}</strong>.
        </p>
      </div>
    );
  }

  return <LocationPageClient data={data} state={state} city={city} />;
}
