import { IS_UAE_REGION, SITE_URL } from "@/utils/site-url";

const LOGO = `${SITE_URL}/images/logo/11_Sep_2025_logo.png`;

const KNOWS_ABOUT = [
  "Restaurant Equipment",
  "Commercial Kitchen Equipment",
  "Hotel Supplies",
  "Restaurant Supplies",
];

/** www.horecastore.ae: the UAE business, matching the address and phones in the site footer. */
function uaeHomeSchema() {
  const org = `${SITE_URL}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: "HorecaStore",
        alternateName: "HorecaStore UAE",
        url: SITE_URL,
        logo: LOGO,
        email: "sales@horecastore.ae",
        description:
          "UAE supplier of commercial kitchen equipment, restaurant supplies and hotel supplies for restaurants, hotels, cafés and catering businesses.",
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+971-800-467322",
            contactType: "sales",
            areaServed: "AE",
            availableLanguage: ["English", "Arabic"],
          },
          {
            "@type": "ContactPoint",
            telephone: "+971-4-224-5818",
            contactType: "customer service",
            areaServed: "AE",
          },
        ],
        knowsAbout: KNOWS_ABOUT,
        sameAs: [
          "https://www.facebook.com/horecastore.ae",
          "https://www.instagram.com/horecastore.ae",
          "https://www.linkedin.com/company/horecastore/",
        ],
      },
      {
        "@type": "Store",
        "@id": `${SITE_URL}/#store`,
        name: "HorecaStore",
        image: LOGO,
        url: SITE_URL,
        telephone: "+971-4-224-5818",
        email: "sales@horecastore.ae",
        currenciesAccepted: "AED",
        address: {
          "@type": "PostalAddress",
          streetAddress: "FAB Compound, Building 5 - Warehouse Unit 9 A",
          addressLocality: "Dubai Investment Park First",
          addressRegion: "Dubai",
          addressCountry: "AE",
        },
        areaServed: { "@type": "Country", name: "United Arab Emirates" },
        parentOrganization: { "@id": org },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "HorecaStore",
        publisher: { "@id": org },
        inLanguage: "en-AE",
      },
    ],
  };
}

/** www.thehorecastore.com: unchanged from the previous inline schema in app/page.tsx. */
function usHomeSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.thehorecastore.com/#organization",
        name: "The HorecaStore",
        legalName: "The Horeca Store Inc",
        alternateName: "The HorecaStore",
        url: "https://www.thehorecastore.com",
        logo: "https://www.thehorecastore.com/images/logo/11_Sep_2025_logo.png",
        description:
          "Trusted U.S. supplier providing high-quality commercial kitchen equipment and professional hotel, restaurant, and café supplies.",
        foundingDate: "2020",
        founder: { "@type": "Person", name: "Noman Peera" },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+1-866-446-7322",
          contactType: "Sales",
          areaServed: "US",
        },
        knowsAbout: KNOWS_ABOUT,
        sameAs: [
          "https://www.facebook.com/horecastoreamerica",
          "https://www.instagram.com/horecastoreamerica",
          "https://www.linkedin.com/company/horecastoreamerica",
          "https://www.youtube.com/@horecastoreinternational",
          "https://www.yelp.com/biz/the-horeca-store-houston",
          "https://share.google/lB0ZElNyy7Vd7KbTV",
          "https://www.crunchbase.com/organization/the-horeca-store",
          "https://www.pinterest.com/thehorecastoreamerica",
          "https://x.com/HorecastoreUSA",
          "https://www.tiktok.com/@thehorecastoreusa",
          "https://www.trustpilot.com/review/thehorecastore.com",
          "https://www.chamberofcommerce.com/business-directory/texas/houston/kitchen-supply-store/2033926095-the-horeca-store",
          "https://www.merchantcircle.com/the-horecastore-houston-tx",
          "https://www.manta.com/c/m1wng4g/the-horeca-store",
          "https://citysquares.com/b/the-horecastore-26689496?updated=true",
          "https://www.brownbook.net/business/54269743/the-horecastore",
          "https://www.cylex.us.com/company/the-horeca-store-37695046.html",
          "https://www.hotfrog.com/company/5e187734dfc7b90b0e3033963cdb8c9c/the-horecastore/houston/services-supplies",
          "https://www.n49.com/biz/6093837/the-horeca-store-tx-houston-8800-bissonnet-st-suite-a",
          "https://www.f6s.com/company/the-horeca-store",
          "https://www.showmelocal.com/39108720-the-horecastore-houston",
          "https://patch.com/texas/houston/business/listing/548472/the-horecastore",
          "https://www.superpages.com/houston-tx/bpp/the-horeca-store-579639691",
          "https://www.dexknows.com/houston-tx/bp/the-horeca-store-579639691",
          "https://www.2findlocal.com/b/15282963/the-horecastore-houston-tx",
          "https://www.cybo.com/US-biz/the-horeca-store",
          "https://www.find-us-here.com/businesses/The-Horecastore-Houston-Texas-USA/34367392",
          "https://www.bunity.com/the-horecastore#",
          "https://linktr.ee/thehorecastore",
          "https://addyp.com/listing/tx/houston/find-top-best-b2b-services-near-me/the-horecastore",
        ],
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://www.thehorecastore.com/#localbusiness",
        name: "The HorecaStore",
        image:
          "https://www.thehorecastore.com/images/logo/11_Sep_2025_logo.png",
        url: "https://www.thehorecastore.com",
        telephone: "+1-866-446-7322",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "8800 Bissonnet St Suite A",
          addressLocality: "Houston",
          addressRegion: "TX",
          postalCode: "77074",
          addressCountry: "US",
        },
        areaServed: { "@type": "Country", name: "United States" },
        parentOrganization: {
          "@id": "https://www.thehorecastore.com/#organization",
        },
      },
    ],
  };
}

export const HOME_SCHEMA = IS_UAE_REGION ? uaeHomeSchema() : usHomeSchema();
