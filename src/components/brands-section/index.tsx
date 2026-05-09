import Link from "next/link";

const BRANDS = [
  { name: "Arctic Air",          slug: "arctic-air",          logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "Atosa",               slug: "atosa",              logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "American Dish Service",slug: "american-dish-service",logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "BakeMax",             slug: "bakemax",             logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "Beverage-Air",        slug: "beverage-air",        logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "CAC",                 slug: "cac",                 logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "CMA Dishmachines",    slug: "cma",                 logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "ChiliCore",           slug: "chilicore",           logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "Cadco",               slug: "cadco",               logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "Midea",               slug: "midea",               logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "Serv-Ware",           slug: "serv-ware",           logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "Forbes Industries",   slug: "forbes-industries",   logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "Hamilton Beach",      slug: "hamilton-beach",      logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "Hoshizaki",           slug: "hoshizaki",           logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "Nuova Simonelli",     slug: "nuova-simonelli",     logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "Omega Juicers",       slug: "omega-juicers",       logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "Robot Coupe",         slug: "robot-coupe",         logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "Taylor",              slug: "taylor",              logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "Thunder Group",       slug: "thunder-group",       logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
  { name: "True Refrigeration",  slug: "true-refrigeration",  logo: "https://d1p9kdrbe10xzz.cloudfront.net/production/brands/VRBvluGcbxdgn5eqpMZQVCVNjbTwTasd8xk40Vjt.webp" },
];

export default function BrandsSection() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="global-container">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900">
            Shop Direct from Official Brand Stores
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-2 max-w-3xl mx-auto leading-relaxed">
            No Middlemen. No Compromises. Just 100% Authentic Products. Trusted
            by Leading Hotels, Restaurants, and Cafes. Buy Straight from the
            Source and Explore Official Brand Stores Featuring Authorized
            Products, Guaranteed Quality, and Exclusive Horeca Deals You
            Won&apos;t Find Anywhere Else.
          </p>
        </div>

        {/* ── Brand Grid Table ── */}
        <div className="border border-gray-200 rounded-[7px] overflow-hidden">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
            }}
          >
            {BRANDS.map((brand, index) => {
              const isLastRow =
                index >= BRANDS.length - (BRANDS.length % 4 || 4);
              const isLastCol = (index + 1) % 4 === 0;

              return (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className={[
                    "flex items-center justify-center",
                    "px-2 py-8 md:py-5 ",
                    "bg-white hover:bg-gray-50 transition-colors duration-200",
                    "group",
                    /* Right border — except last column */
                    !isLastCol ? "border-r border-gray-200" : "",
                    /* Bottom border — except last row */
                    !isLastRow ? "border-b border-gray-200" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="
                      max-h-[52px] md:max-h-[64px] w-auto max-w-[140px] md:max-w-[180px]
                      object-contain
                      filter grayscale opacity-70
                      group-hover:grayscale-0 group-hover:opacity-100
                      transition-all duration-300
                    "
                    onError={(e) => {
                      /* Fallback: show brand name if image fails */
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector("span")) {
                        const span = document.createElement("span");
                        span.textContent = brand.name;
                        span.className =
                          "text-sm font-semibold text-gray-500 text-center";
                        parent.appendChild(span);
                      }
                    }}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── View all brands CTA ── */}
        <div className="text-center mt-8">
          <Link
            href="/all-brands"
            className="inline-flex items-center gap-2 bg-[#186737] hover:bg-[#145c2e] text-white text-sm font-semibold px-8 py-3 rounded-full transition-colors duration-200"
          >
            View All Brands
            <span className="text-base leading-none">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}