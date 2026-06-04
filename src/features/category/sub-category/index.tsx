"use client";

import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import Breadcrumb from "@/components/breadcum";
import FilterSidebar from "@/components/filters";
import { ProductCardSkeleton } from "@/components/loading-sketlon";
import Pagination from "@/components/pagination";
import ProductCard from "@/components/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ApiCategory,
  ApiCategoryName,
  InnerCategoryPageResponse,
  ProductsListingResponse,
} from "@/utils/types";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// ─── URL codec helpers ─────────────────────────────────────────────────────────
// RF format: "attrId-unitId:min_max,min_max|attrId2-unitId2:min_max"
function encodeRF(
  rf: Record<number, { min: number; max: number }[]>,
  unitMap: Record<number, number> = {},
): string {
  return Object.entries(rf)
    .filter(([, ranges]) => ranges.length > 0)
    .map(([id, ranges]) => {
      const uid = unitMap[Number(id)];
      const key = uid ? `${id}-${uid}` : id;
      return `${key}:${ranges.map((r) => `${r.min}_${r.max}`).join(",")}`;
    })
    .join("|");
}

function decodeRF(str: string): Record<number, { min: number; max: number }[]> {
  const out: Record<number, { min: number; max: number }[]> = {};
  str.split("|").forEach((part) => {
    const ci = part.indexOf(":");
    if (ci < 0) return;
    const attrId = Number(part.slice(0, ci).split("-")[0]); // strip unitId
    if (isNaN(attrId)) return;
    out[attrId] = part
      .slice(ci + 1)
      .split(",")
      .map((r) => {
        const [min, max] = r.split("_").map(Number);
        return { min, max };
      });
  });
  return out;
}

function encodeFF(ff: Record<number, string[]>): string {
  return Object.entries(ff)
    .filter(([, vals]) => vals.length > 0)
    .map(
      ([id, vals]) =>
        `${id}:${vals.map((v) => v.replace(/ /g, "+")).join(",")}`,
    )
    .join("|");
}

function decodeFF(str: string): Record<number, string[]> {
  const out: Record<number, string[]> = {};
  str.split("|").forEach((part) => {
    const colonIdx = part.indexOf(":");
    if (colonIdx < 0) return;
    const id = part.slice(0, colonIdx);
    const valsStr = part.slice(colonIdx + 1);
    out[Number(id)] = valsStr.split(",").map((v) => v.replace(/\+/g, " "));
  });
  return out;
}

// ─── Types ────────────────────────────────────────────────────────────────────

const slugToTitle = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const getName = (name: ApiCategoryName | string, locale: string): string => {
  if (typeof name === "string") return name;
  return locale === "ar" ? name.ar || name.en : name.en || name.ar;
};

interface PriceRange {
  min: number;
  max: number;
}

const SORT_OPTIONS = [
  "Default Sorting",
  "Price: Low to High",
  "Price: High to Low",
  // "Top Rated",
  // "Newest First",
];

const SHOW_OPTIONS = [20, 50, 100];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SubCategoryPage({
  subCategories,
  categorySlug,
  subCategorySlug,
  parentSlug,
  subCategoryPage,
  productsData,
  productsBody,
  currentPage = 1,
}: {
  subCategories: ApiCategory[];
  categorySlug: string;
  subCategorySlug: string;
  parentSlug?: string;
  productsData?: ProductsListingResponse | null;
  subCategoryPage?: InnerCategoryPageResponse | null;
  currentPage?: number;
  productsBody?: any;
}) {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Client-side state for both filter data and products (correct local-currency)
  const [clientSubCategoryPage, setClientSubCategoryPage] = useState<InnerCategoryPageResponse | null | undefined>(subCategoryPage);
  const [clientProducts, setClientProducts] = useState<any[]>(productsData?.products ?? []);
  const [clientFetchDone, setClientFetchDone] = useState(false);
  const products = clientProducts;

  const filterAPIData = clientSubCategoryPage?.filters;
  const rangeFiltersData = clientSubCategoryPage?.rangeFilters;
  const fixedFiltersData = clientSubCategoryPage?.fixedFilters;

  // unit_id lookup map: attrId → unit_id (from SSR filter data, stable)
  const unitMap: Record<number, number> = Object.fromEntries(
    Object.values(rangeFiltersData ?? {})
      .filter((f) => f.unit_id != null)
      .map((f) => [f.attribute_id, f.unit_id as number]),
  );
  const totalProducts = productsData?.total_records ?? products.length;
  const totalPages =
    (productsData?.total_pages ?? Math.ceil(totalProducts / 20)) || 1;

  // Children of the currently active subcategory shown in the swiper
  const activeSubCategory = subCategories.find(
    (cat) => cat.slug === subCategorySlug,
  );
  const childCategories = activeSubCategory?.children ?? [];

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: slugToTitle(categorySlug), href: `/${categorySlug}` },
    ...(parentSlug
      ? [
          {
            label: slugToTitle(parentSlug),
            href: `/${categorySlug}/${parentSlug}`,
          },
        ]
      : []),
    { label: slugToTitle(subCategorySlug), href: null },
  ];

  const apiPriceMin = Math.floor(
    Number(filterAPIData?.priceRange?.min_price ?? 10),
  );
  const apiPriceMax = Math.ceil(
    Number(filterAPIData?.priceRange?.max_price ?? 78000),
  );

  // ── Read initial state from URL params ──────────────────────────────────────
  // useSearchParams already decodes the value, so no extra decoding needed
  const initBrands = (
    searchParams.get("brands")?.split(",").filter(Boolean) ?? []
  ).map((entry) => {
    const colonIdx = entry.indexOf(":");
    return {
      id: Number(entry.slice(0, colonIdx)),
      name: entry.slice(colonIdx + 1),
    };
  });
  const rawMin = searchParams.get("min")
    ? Number(searchParams.get("min"))
    : apiPriceMin;
  const rawMax = searchParams.get("max")
    ? Number(searchParams.get("max"))
    : apiPriceMax;
  const initMin = Math.max(apiPriceMin, Math.min(rawMin, apiPriceMax));
  const initMax = Math.min(apiPriceMax, Math.max(rawMax, apiPriceMin));
  const initRF = searchParams.get("rf")
    ? decodeRF(searchParams.get("rf")!)
    : {};
  const initFF = searchParams.get("ff")
    ? decodeFF(searchParams.get("ff")!)
    : {};

  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: initMin,
    max: initMax,
  });
  const [selectedBrands, setSelectedBrands] =
    useState<{ id: number; name: string }[]>(initBrands);
  const [selectedRangeFilters, setSelectedRangeFilters] =
    useState<Record<number, { min: number; max: number }[]>>(initRF);
  const [selectedFixedFilters, setSelectedFixedFilters] =
    useState<Record<number, string[]>>(initFF);
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") ?? "Default Sorting",
  );
  const [showCount, setShowCount] = useState(
    Number(searchParams.get("show") ?? 20),
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const swiperRef = useRef<SwiperType | null>(null);

  // ── Sync filters → URL ───────────────────────────────────────────────────────
  // Build URL purely from state — no searchParams base so there's no stale closure risk.
  // parentSlug is preserved from the prop (stable across re-renders).
  const pushURL = useCallback(
    (overrides: {
      brands?: { id: number; name: string }[];
      min?: number;
      max?: number;
      sort?: string;
      show?: number;
      page?: number;
      rf?: Record<number, { min: number; max: number }[]>;
      ff?: Record<number, string[]>;
    }) => {
      const brands = overrides.brands ?? selectedBrands;
      const min = overrides.min ?? priceRange.min;
      const max = overrides.max ?? priceRange.max;
      const sort = overrides.sort ?? sortBy;
      const show = overrides.show ?? showCount;
      const page = overrides.page ?? 1;
      const rf = overrides.rf ?? selectedRangeFilters;
      const ff = overrides.ff ?? selectedFixedFilters;

      const parts: string[] = [];
      const priceActive = min !== apiPriceMin || max !== apiPriceMax;
      if (parentSlug) parts.push(`parent=${parentSlug}`);
      if (brands.length)
        parts.push(
          "brands=" +
            brands.map((b) => `${b.id}:${b.name.replace(/ /g, "+")}`).join(","),
        );
      if (priceActive) parts.push(`min=${min}`);
      if (priceActive) parts.push(`max=${max}`);
      if (sort !== "Default Sorting")
        parts.push(`sort=${encodeURIComponent(sort).replace(/%20/g, "+")}`);
      if (show !== 20) parts.push(`show=${show}`);
      if (page > 1) parts.push(`page=${page}`);
      const rfStr = encodeRF(rf, unitMap);
      if (rfStr) parts.push(`rf=${rfStr}`);
      const ffStr = encodeFF(ff);
      if (ffStr) parts.push(`ff=${ffStr}`);

      const qs = parts.join("&");
      window.scrollTo({ top: 0, behavior: "smooth" });
      startTransition(() => {
        router.replace(qs ? `?${qs}` : location.pathname, { scroll: false });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedBrands,
      priceRange,
      sortBy,
      showCount,
      apiPriceMin,
      apiPriceMax,
      parentSlug,
      selectedRangeFilters,
      selectedFixedFilters,
    ],
  );

  const handleBrandToggle = useCallback(
    (brand: { id: number; name: string }) => {
      const next = selectedBrands.some((b) => b.id === brand.id)
        ? selectedBrands.filter((b) => b.id !== brand.id)
        : [...selectedBrands, brand];
      setSelectedBrands(next);
      pushURL({ brands: next, page: 1 });
    },
    [selectedBrands, pushURL],
  );

  const handlePriceChange = useCallback(
    (range: PriceRange) => {
      setPriceRange(range);
      pushURL({ min: range.min, max: range.max, page: 1 });
    },
    [pushURL],
  );

  const handleRangeFilterToggle = useCallback(
    (attrId: number, range: { min: number; max: number }) => {
      const current = selectedRangeFilters[attrId] ?? [];
      const exists = current.some(
        (r) => r.min === range.min && r.max === range.max,
      );
      const next = {
        ...selectedRangeFilters,
        [attrId]: exists
          ? current.filter((r) => !(r.min === range.min && r.max === range.max))
          : [...current, range],
      };
      setSelectedRangeFilters(next);
      pushURL({ rf: next, page: 1 });
    },
    [selectedRangeFilters, pushURL],
  );

  const handleClearRangeFilter = useCallback(
    (attrId: number) => {
      const next = { ...selectedRangeFilters, [attrId]: [] };
      setSelectedRangeFilters(next);
      pushURL({ rf: next, page: 1 });
    },
    [selectedRangeFilters, pushURL],
  );

  const handleFixedFilterToggle = useCallback(
    (attrId: number, val: string) => {
      const current = selectedFixedFilters[attrId] ?? [];
      const next = {
        ...selectedFixedFilters,
        [attrId]: current.includes(val)
          ? current.filter((v) => v !== val)
          : [...current, val],
      };
      setSelectedFixedFilters(next);
      pushURL({ ff: next, page: 1 });
    },
    [selectedFixedFilters, pushURL],
  );

  const handleClearFixedFilter = useCallback(
    (attrId: number) => {
      const next = { ...selectedFixedFilters, [attrId]: [] };
      setSelectedFixedFilters(next);
      pushURL({ ff: next, page: 1 });
    },
    [selectedFixedFilters, pushURL],
  );

  const handleClearAll = useCallback(() => {
    setSelectedBrands([]);
    setSelectedRangeFilters({});
    setSelectedFixedFilters({});
    setPriceRange({ min: apiPriceMin, max: apiPriceMax });
    pushURL({
      brands: [],
      min: apiPriceMin,
      max: apiPriceMax,
      page: 1,
      rf: {},
      ff: {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiPriceMin, apiPriceMax, pushURL]);

  useEffect(() => {
    if (!productsBody) return;

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://test-us.thehorecastore.co/api/";
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token")?.trim().replace(/^["']|["']$/g, "")
      : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // Fetch filter data (correct local-currency price range from user's IP)
    const filterBody = {
      category_url: subCategorySlug,
      applied_filters: {},
      applied_range_filters: [{}],
      applied_fixed_filters: [{}],
      locale: "en",
    };

    fetch(`${baseURL}${apiUrls.INNER_CATEGORY_PAGES_WITH_FILTER}`, {
      method: "POST",
      headers,
      body: JSON.stringify(filterBody),
    })
      .then((res) => res.json())
      .then((data: InnerCategoryPageResponse) => {
        if (data?.filters) {
          setClientSubCategoryPage(data);
          // Update price range slider bounds with correct local-currency values
          const newMin = Math.floor(Number(data.filters.priceRange?.min_price ?? apiPriceMin));
          const newMax = Math.ceil(Number(data.filters.priceRange?.max_price ?? apiPriceMax));
          if (!searchParams.get("min") && !searchParams.get("max")) {
            setPriceRange({ min: newMin, max: newMax });
          }
        }
      })
      .catch(() => {});

    // Fetch products (correct local-currency prices from user's IP)
    fetch(`${baseURL}${apiUrls.PRODUCTS_LISTING}`, {
      method: "POST",
      headers,
      body: JSON.stringify(productsBody),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.products?.length) {
          setClientProducts(data.products);
        }
      })
      .catch((err) => console.error("Products API Error:", err))
      .finally(() => setClientFetchDone(true));
  }, [productsBody]);

  return (
    <main className="min-h-screen bg-gray-5p0">
      <Breadcrumb crumbs={crumbs} />

      <div className="global-container ">
        {/* Page Header */}
        <div className="py-5">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            {slugToTitle(subCategorySlug)}
          </h1>
          <p className="text-[13px] text-gray-500 max-w-2xl">
            Power up your kitchen with reliable cooking equipment for
            restaurants and catering services. Trusted brands, fast shipping,
            unbeatable prices.
          </p>
        </div>

        {/* Subcategory Slider — children of the active subcategory */}
        {childCategories.length > 0 && (
          <div className="mb-6 bg-white border border-gray-100 rounded-[7px] p-4 md:p-5 relative">
            {childCategories.length > 3 && (
              <>
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-[#186737] hover:text-[#186737] transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-[#186737] hover:text-[#186737] transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </>
            )}
            <Swiper
              modules={[Navigation]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              spaceBetween={8}
              breakpoints={{
                0: { slidesPerView: 3 },
                480: { slidesPerView: 4 },
                640: { slidesPerView: 5 },
                768: { slidesPerView: 6 },
                1024: { slidesPerView: 6 },
                1280: { slidesPerView: 9 },
                1536: { slidesPerView: 11 },
              }}
              className="px-6"
            >
              {childCategories.map((child) => (
                <SwiperSlide key={child.id}>
                  <Link
                    href={`/${categorySlug}/${child.slug}?parent=${subCategorySlug}`}
                    className="group flex flex-col items-center gap-1.5 rounded-[7px] border border-transparent hover:border-green-100 hover:bg-green-50 transition-all duration-200 p-1"
                  >
                    <img
                      src={child.image_url}
                      alt={getName(child.name, locale)}
                      className="w-full aspect-square object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="text-[9px] md:text-[13px] font-light text-gray-500 group-hover:text-[#186737] text-center leading-tight transition-colors duration-200 line-clamp-2">
                      {getName(child.name, locale)}
                    </span>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Mobile Filter + Sort Bar */}
        <div className="md:hidden mb-3 flex items-center justify-between bg-white border border-gray-100 rounded-[7px] px-3 py-2.5">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 text-[13px] font-semibold text-gray-700"
          >
            <SlidersHorizontal size={14} className="text-[#186737]" />
            Filters
            {selectedBrands.length +
              Object.values(selectedRangeFilters).reduce(
                (a, v) => a + v.length,
                0,
              ) +
              Object.values(selectedFixedFilters).reduce(
                (a, v) => a + v.length,
                0,
              ) >
              0 && (
              <span className="bg-[#186737] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {selectedBrands.length +
                  Object.values(selectedRangeFilters).reduce(
                    (a, v) => a + v.length,
                    0,
                  ) +
                  Object.values(selectedFixedFilters).reduce(
                    (a, v) => a + v.length,
                    0,
                  )}
              </span>
            )}
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-400">Sort:</span>
            <Select
              value={sortBy}
              onValueChange={(val) => {
                setSortBy(val);
                pushURL({ sort: val });
              }}
            >
              <SelectTrigger className="h-7 text-[1px] border-gray-200 px-2 bg-white cursor-pointer min-w-35">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt} className="text-[10px]">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-5">
          {/* Sidebar — desktop only */}
          <div className="hidden md:block w-55 lg:w-60 shrink-0">
            <FilterSidebar
              priceRange={priceRange}
              onPriceChange={handlePriceChange}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              onClearBrands={() => {
                setSelectedBrands([]);
                pushURL({ brands: [], page: 1 });
              }}
              onClearAll={handleClearAll}
              brands={filterAPIData?.brands}
              priceMin={apiPriceMin}
              priceMax={apiPriceMax}
              rangeFilters={rangeFiltersData}
              fixedFilters={fixedFiltersData}
              selectedRangeFilters={selectedRangeFilters}
              onRangeFilterToggle={handleRangeFilterToggle}
              onClearRangeFilter={handleClearRangeFilter}
              selectedFixedFilters={selectedFixedFilters}
              onFixedFilterToggle={handleFixedFilterToggle}
              onClearFixedFilter={handleClearFixedFilter}
              currency={filterAPIData?.priceRange?.currency?.symbol}
              loading={!clientFetchDone}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search + Sort Bar */}
            <div className="bg-white border border-gray-100 rounded-[7px] px-4 py-3 mb-4  gap-3">
              {/* <div className="bg-white border border-gray-100 rounded-[7px] px-4 py-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"> */}
              {/* Search */}
              <div className="relative hidden flex-1 max-w-xs">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in results..."
                  className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-[7px] outline-none focus:border-[#186737] transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 justify-between">
                <span className="text-[12px] text-gray-400 hidden sm:block">
                  Showing{" "}
                  <span className="font-semibold text-gray-700">
                    {products.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-700">
                    {totalProducts}
                  </span>{" "}
                  products
                </span>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-1.5">
                    <span className="text-[11px] text-gray-400">Sort:</span>
                    <Select
                      value={sortBy}
                      onValueChange={(val) => {
                        setSortBy(val);
                        pushURL({ sort: val });
                      }}
                    >
                      <SelectTrigger className="h-7 text-[12px] border-gray-200 px-2 bg-white cursor-pointer min-w-35">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map((opt) => (
                          <SelectItem
                            key={opt}
                            value={opt}
                            className="text-[12px]"
                          >
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-gray-400">Show:</span>
                    <Select
                      value={String(showCount)}
                      onValueChange={(val) => {
                        setShowCount(Number(val));
                        pushURL({ show: Number(val) });
                      }}
                    >
                      <SelectTrigger className="h-7 text-[12px] border-gray-200 px-2 bg-white cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SHOW_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={String(opt)}>
                            {opt} Items
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* <div className="md:flex hidden items-center gap-1.5">
                    <span className="text-[11px] text-gray-400">
                      Grid Type:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Grid2x2 className="text-gray-600" size={17} />
                      <Rows3 className="text-gray-600" size={17} />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {selectedBrands.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedBrands.map((brand) => (
                  <span
                    key={brand.id}
                    className="flex items-center gap-1 text-[11px] font-medium bg-green-50 text-[#186737] border border-green-200 px-2.5 py-1 rounded-full"
                  >
                    {brand.name}
                    <button onClick={() => handleBrandToggle(brand)}>
                      <X
                        size={10}
                        className="hover:text-red-500 transition-colors"
                      />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Product Grid */}
            {!isPending && products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-[7px]">
                <Search size={52} className="text-gray-200 mb-5" />
                <h3 className="text-[17px] font-semibold text-gray-700 mb-2">
                  No Products Found
                </h3>
                <p className="text-[13px] text-gray-400 text-center max-w-xs leading-relaxed">
                  We couldn&apos;t find any products matching your filters. Try
                  adjusting or clearing them.
                </p>
                <button
                  onClick={handleClearAll}
                  className="mt-6 px-6 py-2.5 rounded-[7px] bg-[#186737] text-white text-[13px] font-semibold hover:bg-[#145c30] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-5 gap-3">
                {isPending || !clientFetchDone
                  ? Array.from({ length: showCount }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))
                  : products.map((product: any, index: number) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        aboveFold={index < 8}
                      />
                    ))}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                key={currentPage}
                totalPages={totalPages}
                initialPage={currentPage}
                onPageChange={(page) => {
                  pushURL({ page });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                showFirstLast={true}
                showPageInfo={true}
              />
            )}
            {/* <div className="flex items-center justify-center gap-2 mt-8">
              {[1, 2, 3, "...", 7].map((page, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 text-[12px] font-medium rounded-[7px] transition-colors ${
                    page === 1
                      ? "bg-[#186737] text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-[#186737] hover:text-[#186737]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div> */}
          </div>
        </div>
      </div>
      {/* ── Mobile Filter Drawer ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 md:hidden bg-black/50 transition-opacity duration-300 ${
          mobileFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileFilterOpen(false)}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          mobileFilterOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "88vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#186737]" />
            <span className="text-[15px] font-bold text-gray-900">Filters</span>
            {selectedBrands.length +
              Object.values(selectedRangeFilters).reduce(
                (a, v) => a + v.length,
                0,
              ) +
              Object.values(selectedFixedFilters).reduce(
                (a, v) => a + v.length,
                0,
              ) >
              0 && (
              <span className="bg-[#186737] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {selectedBrands.length +
                  Object.values(selectedRangeFilters).reduce(
                    (a, v) => a + v.length,
                    0,
                  ) +
                  Object.values(selectedFixedFilters).reduce(
                    (a, v) => a + v.length,
                    0,
                  )}
              </span>
            )}
          </div>
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Filter Body */}
        <div className="overflow-y-auto flex-1 px-4 py-3">
          <FilterSidebar
            mobile
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            selectedBrands={selectedBrands}
            onBrandToggle={handleBrandToggle}
            onClearBrands={() => {
              setSelectedBrands([]);
              pushURL({ brands: [], page: 1 });
            }}
            onClearAll={handleClearAll}
            brands={filterAPIData?.brands}
            priceMin={apiPriceMin}
            priceMax={apiPriceMax}
            rangeFilters={rangeFiltersData}
            fixedFilters={fixedFiltersData}
            selectedRangeFilters={selectedRangeFilters}
            onRangeFilterToggle={handleRangeFilterToggle}
            onClearRangeFilter={handleClearRangeFilter}
            selectedFixedFilters={selectedFixedFilters}
            onFixedFilterToggle={handleFixedFilterToggle}
            onClearFixedFilter={handleClearFixedFilter}
            currency={filterAPIData?.priceRange?.currency?.symbol}
            loading={!clientFetchDone}
          />
        </div>

        {/* Footer Buttons */}
        <div className="shrink-0 px-4 py-4 border-t border-gray-100 bg-white flex gap-3">
          {selectedBrands.length +
            Object.values(selectedRangeFilters).reduce(
              (a, v) => a + v.length,
              0,
            ) +
            Object.values(selectedFixedFilters).reduce(
              (a, v) => a + v.length,
              0,
            ) >
            0 && (
            <button
              onClick={handleClearAll}
              className="flex-1 py-3 rounded-[7px] border border-gray-200 text-sm font-semibold text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors duration-200"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="flex-1 py-3 rounded-[7px] bg-[#186737] hover:bg-[#145c30] text-white text-sm font-semibold transition-colors duration-200"
          >
            {(() => {
              const n =
                selectedBrands.length +
                Object.values(selectedRangeFilters).reduce(
                  (a, v) => a + v.length,
                  0,
                ) +
                Object.values(selectedFixedFilters).reduce(
                  (a, v) => a + v.length,
                  0,
                );
              return n > 0 ? `Apply Filters (${n})` : "Apply Filters";
            })()}
          </button>
        </div>
      </div>
    </main>
  );
}
