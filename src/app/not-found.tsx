import Link from "next/link";

const CATEGORIES = [
  { label: "Restaurant Equipment", href: "/restaurant-equipment" },
  { label: "Refrigeration", href: "/refrigeration" },
  { label: "Tableware", href: "/tableware" },
  { label: "Smallware", href: "/smallware" },
  { label: "Hotel Supplies", href: "/hotel-supplies" },
  { label: "Shop By Brands", href: "/brands" },
];

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 bg-white">
      {/* Illustration */}
      <div className="relative mb-2">
        {/* Green blobs */}
        <svg
          viewBox="0 0 420 260"
          className="w-[320px] sm:w-[420px]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Background blobs */}
          <ellipse cx="210" cy="200" rx="190" ry="50" fill="#e8f5ee" />
          <circle cx="100" cy="90" r="60" fill="#d4edda" opacity="0.6" />
          <circle cx="310" cy="80" r="50" fill="#d4edda" opacity="0.6" />
          <circle cx="210" cy="70" r="75" fill="#c8e6d4" opacity="0.5" />

          {/* Trees */}
          {/* Left tree */}
          <rect x="68" y="130" width="6" height="40" rx="2" fill="#6aab7e" />
          <circle cx="71" cy="115" r="22" fill="#4caf50" opacity="0.8" />
          {/* Right tree */}
          <rect x="338" y="130" width="6" height="40" rx="2" fill="#6aab7e" />
          <circle cx="341" cy="115" r="18" fill="#4caf50" opacity="0.8" />

          {/* Ground line */}
          <line x1="40" y1="200" x2="380" y2="200" stroke="#b2d8bc" strokeWidth="2" />

          {/* Person 1 — left, pulling cable */}
          <g transform="translate(100, 130)">
            <circle cx="0" cy="-40" r="14" fill="#555" />
            <rect x="-10" y="-26" width="20" height="30" rx="4" fill="#333" />
            {/* arm extended right */}
            <line x1="10" y1="-15" x2="35" y2="-10" stroke="#555" strokeWidth="5" strokeLinecap="round" />
            {/* legs */}
            <line x1="-5" y1="4" x2="-8" y2="30" stroke="#333" strokeWidth="5" strokeLinecap="round" />
            <line x1="5" y1="4" x2="8" y2="30" stroke="#333" strokeWidth="5" strokeLinecap="round" />
          </g>

          {/* Person 2 — centre-left, holding cable */}
          <g transform="translate(168, 125)">
            <circle cx="0" cy="-40" r="14" fill="#8d6e63" />
            {/* Saree-like body */}
            <path d="M-12,-26 Q0,-10 12,-26 L16,10 Q0,20 -16,10 Z" fill="#7986cb" />
            {/* arms */}
            <line x1="-12" y1="-15" x2="-30" y2="-5" stroke="#8d6e63" strokeWidth="5" strokeLinecap="round" />
            <line x1="12" y1="-15" x2="30" y2="-5" stroke="#8d6e63" strokeWidth="5" strokeLinecap="round" />
            {/* legs/skirt */}
            <ellipse cx="0" cy="20" rx="14" ry="8" fill="#5c6bc0" />
          </g>

          {/* Plug gap — broken connection */}
          <g transform="translate(210, 155)">
            {/* Left plug end */}
            <rect x="-22" y="-6" width="18" height="12" rx="3" fill="#9e9e9e" />
            <line x1="-22" y1="-2" x2="-38" y2="-2" stroke="#9e9e9e" strokeWidth="3" />
            <line x1="-22" y1="2" x2="-38" y2="2" stroke="#9e9e9e" strokeWidth="3" />
            {/* Gap sparks */}
            <text x="-4" y="4" fontSize="12" fill="#ffc107" textAnchor="middle">⚡</text>
            {/* Right plug end */}
            <rect x="4" y="-6" width="18" height="12" rx="3" fill="#9e9e9e" />
            <line x1="22" y1="-2" x2="38" y2="-2" stroke="#9e9e9e" strokeWidth="3" />
            <line x1="22" y1="2" x2="38" y2="2" stroke="#9e9e9e" strokeWidth="3" />
          </g>

          {/* Person 3 — centre-right */}
          <g transform="translate(258, 125)">
            <circle cx="0" cy="-40" r="14" fill="#555" />
            <rect x="-10" y="-26" width="20" height="30" rx="4" fill="#186737" />
            <line x1="-10" y1="-15" x2="-30" y2="-8" stroke="#555" strokeWidth="5" strokeLinecap="round" />
            <line x1="10" y1="-15" x2="30" y2="-8" stroke="#555" strokeWidth="5" strokeLinecap="round" />
            <line x1="-5" y1="4" x2="-8" y2="30" stroke="#333" strokeWidth="5" strokeLinecap="round" />
            <line x1="5" y1="4" x2="8" y2="30" stroke="#333" strokeWidth="5" strokeLinecap="round" />
          </g>

          {/* Person 4 — right */}
          <g transform="translate(320, 130)">
            <circle cx="0" cy="-40" r="14" fill="#8d6e63" />
            <rect x="-10" y="-26" width="20" height="30" rx="4" fill="#186737" />
            <line x1="-10" y1="-15" x2="-35" y2="-10" stroke="#8d6e63" strokeWidth="5" strokeLinecap="round" />
            <line x1="-5" y1="4" x2="-8" y2="30" stroke="#333" strokeWidth="5" strokeLinecap="round" />
            <line x1="5" y1="4" x2="8" y2="30" stroke="#333" strokeWidth="5" strokeLinecap="round" />
          </g>

          {/* OOPS! text */}
          <text
            x="210"
            y="55"
            textAnchor="middle"
            fontSize="38"
            fontWeight="900"
            fill="#1a1a1a"
            fontFamily="sans-serif"
            letterSpacing="2"
          >
            OOPS!
          </text>
        </svg>
      </div>

      {/* PAGE NOT FOUND */}
      <h1 className="text-xl sm:text-2xl font-bold tracking-widest text-gray-800 uppercase mb-5">
        Page Not Found
      </h1>

      {/* Description */}
      <p className="text-sm sm:text-base text-gray-500 text-center max-w-md leading-relaxed mb-8">
        It looks like this page is unavailable. Try using the search bar or
        looking through one of these links below. Still need help?{" "}
        <a
          href="mailto:support@horecastore.ae"
          className="text-[#186737] font-semibold hover:underline"
        >
          Live Chat With Us!
        </a>
      </p>

      {/* Search bar */}
      {/* <Link
        href="/search"
        className="flex items-center gap-2 mb-10 px-5 py-2.5 rounded-full border-2 border-[#186737] text-[#186737] font-semibold text-sm hover:bg-[#186737] hover:text-white transition-all duration-200"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Search Products
      </Link> */}

      {/* Browse By Categories */}
      <div className="text-center">
        <p className="text-base font-bold text-gray-800 mb-4">Browse By Categories</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-lg">
          {CATEGORIES.map((cat, i) => (
            <span key={cat.href} className="flex items-center gap-3">
              <Link
                href={cat.href}
                className="text-sm text-[#186737] font-medium hover:underline transition-colors"
              >
                {cat.label}
              </Link>
              {i < CATEGORIES.length - 1 && (
                <span className="text-gray-300 text-lg leading-none">·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
