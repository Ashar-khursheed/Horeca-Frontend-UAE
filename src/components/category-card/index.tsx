// import { useState, useRef } from "react";
// import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

// const CATEGORIES = [
//   { id: 1, name: "Reach In Refrigerator", img: "https://placehold.co/240x200/f0f4f8/64748b?text=Refrigerator", tag: "Bestseller" },
//   { id: 2, name: "Pizza Prep Table", img: "https://placehold.co/240x200/f0f4f8/64748b?text=Pizza+Prep", tag: "Popular" },
//   { id: 3, name: "Worktop Refrigerator", img: "https://placehold.co/240x200/f0f4f8/64748b?text=Worktop" },
//   { id: 4, name: "Chef Base Refrigerator", img: "https://placehold.co/240x200/f0f4f8/64748b?text=Chef+Base" },
//   { id: 5, name: "Undercounter Refrigerator", img: "https://placehold.co/240x200/f0f4f8/64748b?text=Undercounter" },
//   { id: 6, name: "Beer Dispenser", img: "https://placehold.co/240x200/f0f4f8/64748b?text=Beer+Disp", tag: "New" },
//   { id: 7, name: "Back Bar Cooler", img: "https://placehold.co/240x200/f0f4f8/64748b?text=Bar+Cooler" },
//   { id: 8, name: "Glass Chillers", img: "https://placehold.co/240x200/f0f4f8/64748b?text=Glass+Chiller" },
//   { id: 9, name: "Commercial Gas Fryer", img: "https://placehold.co/240x200/f0f4f8/64748b?text=Gas+Fryer", tag: "Trending" },
//   { id: 10, name: "Deck Oven", img: "https://placehold.co/240x200/f0f4f8/64748b?text=Deck+Oven" },
//   { id: 11, name: "Commercial Espresso", img: "https://placehold.co/240x200/f0f4f8/64748b?text=Espresso" },
//   { id: 12, name: "Milk Cooler", img: "https://placehold.co/240x200/f0f4f8/64748b?text=Milk+Cooler" },
//   { id: 13, name: "Commercial Food Processor", img: "https://placehold.co/240x200/f0f4f8/64748b?text=Food+Proc" },
//   { id: 14, name: "Planetary Mixer", img: "https://placehold.co/240x200/f0f4f8/64748b?text=Mixer", tag: "New" },
// ];

// const TAG_STYLES = {
//   Bestseller: "bg-amber-100 text-amber-700",
//   Popular: "bg-blue-100 text-blue-700",
//   New: "bg-emerald-100 text-emerald-700",
//   Trending: "bg-rose-100 text-rose-700",
// };

// export default function ShopByCategories() {
//   const [hoveredId, setHoveredId] = useState(null);
//   const scrollRef = useRef(null);

//   const scroll = (dir) => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
//     }
//   };

//   return (
//     <section className="w-full bg-white py-8 px-4 md:px-6">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

//         .cats-section * { font-family: 'DM Sans', sans-serif; }

//         .cats-scroll-area {
//           display: flex;
//           gap: 14px;
//           overflow-x: auto;
//           scroll-snap-type: x mandatory;
//           padding-bottom: 10px;
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//         .cats-scroll-area::-webkit-scrollbar { display: none; }

//         .cat-card {
//           flex: 0 0 160px;
//           scroll-snap-align: start;
//           border-radius: 16px;
//           background: #f8fafc;
//           border: 1.5px solid #e8edf3;
//           overflow: hidden;
//           cursor: pointer;
//           transition: transform 0.22s cubic-bezier(.34,1.56,.64,1),
//                       box-shadow 0.22s ease,
//                       border-color 0.22s ease,
//                       background 0.22s ease;
//           position: relative;
//         }
//         .cat-card:hover {
//           transform: translateY(-5px) scale(1.025);
//           box-shadow: 0 12px 36px rgba(0,0,0,0.10);
//           border-color: #7c1e20;
//           background: #fff;
//         }

//         .cat-img-wrap {
//           width: 100%;
//           height: 130px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: linear-gradient(145deg, #f0f4f8 0%, #e8edf3 100%);
//           overflow: hidden;
//           padding: 12px;
//           transition: background 0.22s ease;
//         }
//         .cat-card:hover .cat-img-wrap {
//           background: linear-gradient(145deg, #fdf2f2 0%, #fce8e8 100%);
//         }
//         .cat-img-wrap img {
//           width: 100%;
//           height: 100%;
//           object-fit: contain;
//           transition: transform 0.32s cubic-bezier(.34,1.2,.64,1);
//           filter: drop-shadow(0 4px 8px rgba(0,0,0,0.08));
//         }
//         .cat-card:hover .cat-img-wrap img {
//           transform: scale(1.1);
//         }

//         .cat-name {
//           font-size: 12.5px;
//           font-weight: 600;
//           color: #1e293b;
//           text-align: center;
//           padding: 10px 10px 12px;
//           line-height: 1.35;
//           letter-spacing: -0.01em;
//           transition: color 0.2s;
//         }
//         .cat-card:hover .cat-name { color: #7c1e20; }

//         .cat-tag {
//           position: absolute;
//           top: 8px;
//           left: 8px;
//           font-size: 10px;
//           font-weight: 700;
//           padding: 2px 7px;
//           border-radius: 20px;
//           letter-spacing: 0.02em;
//           text-transform: uppercase;
//           z-index: 2;
//         }

//         .scroll-btn {
//           width: 38px;
//           height: 38px;
//           border-radius: 50%;
//           background: white;
//           border: 1.5px solid #e2e8f0;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: all 0.18s ease;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.08);
//           color: #475569;
//           flex-shrink: 0;
//         }
//         .scroll-btn:hover {
//           background: #7c1e20;
//           border-color: #7c1e20;
//           color: white;
//           box-shadow: 0 4px 14px rgba(124,30,32,0.28);
//           transform: scale(1.08);
//         }

//         .all-cats-btn {
//           display: inline-flex;
//           align-items: center;
//           gap: 5px;
//           font-size: 13px;
//           font-weight: 600;
//           color: #7c1e20;
//           padding: 6px 14px;
//           border-radius: 8px;
//           border: 1.5px solid #f0d0d0;
//           background: #fdf5f5;
//           cursor: pointer;
//           transition: all 0.18s ease;
//           text-decoration: none;
//           letter-spacing: -0.01em;
//         }
//         .all-cats-btn:hover {
//           background: #7c1e20;
//           color: white;
//           border-color: #7c1e20;
//           gap: 8px;
//           box-shadow: 0 4px 14px rgba(124,30,32,0.24);
//         }
//         .all-cats-btn svg {
//           transition: transform 0.18s ease;
//         }
//         .all-cats-btn:hover svg { transform: translateX(3px); }

//         .section-title {
//           font-size: 20px;
//           font-weight: 700;
//           color: #0f172a;
//           letter-spacing: -0.03em;
//           position: relative;
//         }
//         .section-title::after {
//           content: '';
//           position: absolute;
//           bottom: -4px;
//           left: 0;
//           width: 32px;
//           height: 3px;
//           background: #7c1e20;
//           border-radius: 2px;
//         }

//         @keyframes fadeSlideIn {
//           from { opacity: 0; transform: translateY(12px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .cats-scroll-area .cat-card {
//           animation: fadeSlideIn 0.4s ease both;
//         }
//         ${CATEGORIES.map((_, i) => `.cats-scroll-area .cat-card:nth-child(${i+1}) { animation-delay: ${i * 0.04}s; }`).join('\n')}
//       `}</style>

//       <div className="cats-section max-w-screen-xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-5">
//           <div className="flex items-center gap-4">
//             <h2 className="section-title">Shop by Categories</h2>
//           </div>
//           <div className="flex items-center gap-3">
//             {/* Scroll Buttons */}
//             <div className="hidden md:flex items-center gap-2">
//               <button className="scroll-btn" onClick={() => scroll(-1)} aria-label="Scroll left">
//                 <ChevronLeft size={18} />
//               </button>
//               <button className="scroll-btn" onClick={() => scroll(1)} aria-label="Scroll right">
//                 <ChevronRight size={18} />
//               </button>
//             </div>
//             <a href="/categories" className="all-cats-btn">
//               All Categories
//               <ArrowRight size={13} />
//             </a>
//           </div>
//         </div>

//         {/* Cards Row */}
//         <div ref={scrollRef} className="cats-scroll-area">
//           {CATEGORIES.map((cat) => (
//             <a
//               key={cat.id}
//               href={`/categories/${cat.id}`}
//               className="cat-card"
//               onMouseEnter={() => setHoveredId(cat.id)}
//               onMouseLeave={() => setHoveredId(null)}
//             >
//               {cat.tag && (
//                 <span className={`cat-tag ${TAG_STYLES[cat.tag]}`}>
//                   {cat.tag}
//                 </span>
//               )}
//               <div className="cat-img-wrap">
//                 <img src={cat.img} alt={cat.name} loading="lazy" />
//               </div>
//               <p className="cat-name">{cat.name}</p>
//             </a>
//           ))}
//         </div>

//         {/* Mobile scroll hint */}
//         <p className="text-xs text-slate-400 mt-3 text-center md:hidden">
//           ← Swipe to explore all categories →
//         </p>
//       </div>
//     </section>
//   );
// }

import Link from "next/link";

const CATEGORIES = [
  {
    "id": 48,
    "name": "Reach In Refrigerator",
    "image": "https://d1p9kdrbe10xzz.cloudfront.net/categories/E7vOjF8DGLifYgWhSXTS7RG5LWDvlVVqzQrLCVpD.webp",
    "slug": "reach-in-refrigerator",
    "productCount": 346,
  },
  {
    "id": 568,
    "name": "Pizza Prep Table",
    "image": "https://d1p9kdrbe10xzz.cloudfront.net/categories/1AnQBJPhv5vVl4BxEbWfQbD6AVJoSfYjOiCMzv6P.webp",
    "slug": "pizza-prep-table",
    "productCount": 51,
  },
  {
    "id": 49,
    "name": "Worktop Refrigerator",
    "image": "https://d1p9kdrbe10xzz.cloudfront.net/categories/v9OFWJqHqdtf2jKhh7NCALOrJaVoyNBQDGUFCKzd.webp",
    "slug": "worktop-refrigerator",
    "productCount": 144,
  },
  {
    "id": 47,
    "name": "Chef Base Refrigerator",
    "image": "https://d1p9kdrbe10xzz.cloudfront.net/categories/nmPCnBh9WmsEqsny68peDdhqiCmzpp2AmkiNUD6V.webp",
    "slug": "chef-base-refrigerator",
    "productCount": 63,
  },
  {
    "id": 50,
    "name": "Undercounter Refrigerator",
    "image": "https://d1p9kdrbe10xzz.cloudfront.net/categories/2BhgxEE4QMurHnllGnuF0B5OH5awT9gVbf5HHqtE.webp",
    "slug": "undercounter-refrigerator",
    "productCount": 121,
  },
  {
    "id": 570,
    "name": "Beer Dispenser",
    "image": "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/a0yzXuY1UN0Jl8ViE8GwSHk7vRdo53MPcTAfQyvP.webp",
    "slug": "beer-dispenser",
    "productCount": 96,
  },
  {
    "id": 569,
    "name": "Back Bar Cooler",
    "image": "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/LjhWMScTX358VD5d19e2TD6thDDawm28Jf97UiFY.webp",
    "slug": "back-bar-cooler",
    "productCount": 184,
  },
  {
    "id": 57,
    "name": "Glass Chillers and Frosters",
    "image": "https://d1p9kdrbe10xzz.cloudfront.net/categories/categories/glass-chillers-and-frosters.webp",
    "slug": "glass-chillers-glass-frosters",
    "productCount": 22,
  },
  {
    "id": 539,
    "name": "Commercial Gas Fryer",
    "image": "https://d1p9kdrbe10xzz.cloudfront.net/categories/icons/0BwGoac9ljLnRVr4zBo0R8kq3llYcMfUrqiiGgxI.webp",
    "slug": "commercial-gas-fryer",
    "productCount": 44,
  },
  {
    "id": 179,
    "name": "Deck Oven",
    "image": "https://d1p9kdrbe10xzz.cloudfront.net/categories/StyyRQoOiWMleZUno4kjCrBK25Rv0RuqJT6n9eeH.webp",
    "slug": "deck-oven",
    "productCount": 19,
  },
  {
    "id": 170,
    "name": "Commercial Espresso Machine",
    "image": "https://d1p9kdrbe10xzz.cloudfront.net/categories/UJBrToZNSOjLCzaCVFvRSGVMrrblB6RjLivlNFUv.webp",
    "slug": "commercial-espresso-machine",
    "productCount": 21,
  },
  {
    "id": 55,
    "name": "Milk Cooler",
    "image": "https://d1p9kdrbe10xzz.cloudfront.net/categories/jnBDPc5A34QkT4R9oOJvSUZhdD0c05WZj2Do5mPh.webp",
    "slug": "milk-cooler",
    "productCount": 62,
  },
  {
    "id": 139,
    "name": "Commercial Food Processors",
    "image": "https://d1p9kdrbe10xzz.cloudfront.net/categories/tmAc5pD0M6lOqTRku6dy0okCJ8dfY9cFwxZlYwiO.webp",
    "slug": "commercial-food-processors",
    "productCount": 83,
  },
  {
    "id": 152,
    "name": "Planetary Mixer",
    "image": "https://d1p9kdrbe10xzz.cloudfront.net/categories/52uk7DiasaVgD2aaeoOFYf10I8OIMAW1kOo9CXDL.webp",
    "slug": "planetary-mixer",
    "productCount": 20,
  },
];

export default function ShopByCategories() {
  return (
    <section className="w-full bg-white py-6 px-4 md:px-6">
      <div className="global-container mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
            Shop by Categories
          </h2>
          <Link
            href="/categories"
            className="text-sm font-semibold text-[#186737] hover:underline underline-offset-2"
          >
            All Categories
          </Link>
        </div>

        {/* Grid - exactly like screenshot: 7 per row, 2 rows */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center bg-slate-50 border border-slate-200 rounded-md overflow-hidden hover:border-[#186737] hover:shadow-md hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-slate-100 to-slate-200"
            >
              {/* Image */}
              <div className="w-full aspect-square bg-gray-50 group-hover:from-green-900 group-hover:to-green-200 flex items-center justify-content-center p-3 transition-colors duration-200">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                />
              </div>

              {/* Name */}
              <p className="text-[13px] font-semibold text-slate-700 group-hover:text-[#186737] text-center leading-snug px-2 py-2.5  transition-colors duration-200 line-clamp-2">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}