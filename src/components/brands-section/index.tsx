import Link from "next/link";

export interface ApiBrand {
  id: number;
  name: string;
  slug: string;
  thumbnail?: string | null;
  logo?: string | null;
}

export default function BrandsSection({ brands }: { brands?: ApiBrand[] | null }) {
  const list = brands ?? [];
  if (!list.length) return null;

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="global-container">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="heading-font-size font-bold text-gray-900">
            Shop Direct from Official Brand Stores
          </h2>
          <p className="text-gray-500 text-[12px] md:text-base mt-2 max-w-3xl mx-auto leading-relaxed">
            No Middlemen. No Compromises. Just 100% Authentic Products. Trusted
            by Leading Hotels, Restaurants, and Cafes. Buy Straight from the
            Source and Explore Official Brand Stores Featuring Authorized
            Products, Guaranteed Quality, and Exclusive Horeca Deals You
            Won&apos;t Find Anywhere Else.
          </p>
        </div>

        {/* Brand Grid — outer border + overflow-hidden clips extra cell borders */}
        <div className="border border-gray-200 rounded-[7px] overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-8">
            {list.map((brand) => {
              const logo = brand.logo 
              return (
                <Link
                  key={brand.id ?? brand.slug}
                  href={`/brands/${brand.slug}`}
                  className="flex items-center justify-center px-2 py-3 md:py-5 bg-white hover:bg-gray-50 transition-colors duration-200 group border-r border-b border-gray-200"
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt={brand.name}
                      className="max-h-13 md:max-h-16 w-auto max-w-35 md:max-w-45 object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector("span")) {
                          const span = document.createElement("span");
                          span.textContent = brand.name;
                          span.className = "text-sm font-semibold text-gray-500 text-center";
                          parent.appendChild(span);
                        }
                      }}
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-500 text-center">
                      {brand.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* View all CTA */}
        <div className="text-center mt-8">
          <Link
            href="/brands"
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
