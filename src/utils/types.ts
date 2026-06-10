import { CustomerProfile } from "@/store/slices/my-profile/profileSlice";

interface HeaderProps {
  locale?: string;
  userName?: string;
  wishlistCount?: number;
  cartCount?: number;
  deliverTo?: {
    name: string;
    address: string;
  };
  initialProfile?: CustomerProfile | null;
}
interface Props extends HeaderProps {
  navItemData?: unknown[];
}

interface ApiCategory {
  id: number;
  parent_id: number | null;
  image_url: string;
  order: number;
  products_count?: number;
  is_featured?: boolean;
  status?: string;
  name: ApiCategoryName | string;
  slug: string;
  children: ApiCategory[];
  parent_recursive?: ApiCategory | null;
}
 interface ApiCategoryName { en: string; ar: string; }

interface LocalizedString { en?: string; ar?: string; }
 interface ApiProductRaw {
   id: number;
   sku?: string;
   name: LocalizedString | string;
   images: { en?: string[]; ar?: string[] } | string[];
   url: string;
   category_url_resolved?: string;
   parent_category_url_resolved?: string;
   price: number;
   sale_price: number;
   avg_rating: number | null;
   total_reviews: number;
   alt_tags?: string[];
   quote_available?: boolean | number | null;
   isRequired?: boolean;
   currency?: { name?: string; symbol?: string } | string;
   selling_type?: {
     attribute_value: LocalizedString | string;
     attribute_value_unit: LocalizedString | string;
   };
   suppliers?: {
     delivery_days?: string;
     free_shipping?: boolean | number;
     return_policy?: string;
   }[];
 }
 
 interface FeaturedCategory {
   id: number;
   name: LocalizedString | string;
   slug: string;
   products: ApiProductRaw[];
 }


interface CategoryPageImageDetail {
  image_url: string;
  alt: string;
  url: string;
}

interface CategoryPageSeoTranslation {
  title_tag: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  header_description: string | null;
  banner_image_url: string | null;
  banner_image_alt_text: string | null;
  short_title_variant: string | null;
  paragraph_1: string | null;
  paragraph_2: string | null;
  paragraph_3: string | null;
  paragraph_4: string | null;
  popular_tag_details: { popularTags: string; popularSlug: string }[] | null;
}

interface InnerCategoryPageSeo {
  id: number;
  url: string;
  indexing: boolean;
  title_tag: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  banner_image_url: string | null;
  banner_image_alt_text: string | null;
  header_description: string | null;
  short_title_variant: string | null;
  paragraph_1: string | null;
  paragraph_2: string | null;
  paragraph_3: string | null;
  paragraph_4: string | null;
  popular_tag_details: { popularTags: string; popularSlug: string }[] | null;
}

interface RangeFilterItem {
  attribute_id: number;
  attribute_name: string;
  unit_id?: number;
  unit_symbol: string;
  ranges: { min: number; max: number }[];
}

interface FixedFilterItem {
  attribute_id: number;
  attribute_name: string;
  values: string[];
}

interface InnerCategoryPageResponse {
  success: boolean;
  filters: {
    priceRange: { min_price: string; max_price: string; currency?: { symbol: string; title: string } };
    brands: { id: number; name: string; thumbnail: string | null }[];
    ratings: number[];
  } | null;
  rangeFilters?: Record<string, RangeFilterItem> | null;
  fixedFilters?: Record<string, FixedFilterItem> | null;
  seo: InnerCategoryPageSeo | null;
  faqs: { question: string; answer: string }[];
  categories: {
    id: number;
    name: { en: string; ar: string } | string;
    icon_image: string;
    url: string;
  }[];
}

interface ProductsListingResponse {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products?: any[];
  total?: number;
  total_pages?: number;
  current_page?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface LocaleField { en?: string | null; ar?: string | null; }

interface ApiCategoryPage {
  seo: {
    id: number;
    url: string;
    indexing: boolean;
    banner_slug?: string | null;
    banner_image_url?: LocaleField | null;
    banner_image_alt_text?: LocaleField | null;
    paragraph_1?: LocaleField | null;
    paragraph_2?: LocaleField | null;
    paragraph_3?: LocaleField | null;
    paragraph_4?: LocaleField | null;
    popular_tag_details?: {
      en?: { popularTags: string; popularSlug: string }[] | null;
      ar?: { popularTags: string; popularSlug: string }[] | null;
    } | null;
    current_translation: CategoryPageSeoTranslation;
  } | null;
  category_page: {
    id: number;
    category_id: number;
    title: string | null;
    description: string | null;
    banner_image_detail: CategoryPageImageDetail | null;
    secondary_banner_image_detail: CategoryPageImageDetail | null;
    explore_section_title: string | null;
    explore_section_description: string | null;
    explore_section_image_details: CategoryPageImageDetail[];
    brand_section_title: string | null;
    brand_section_description: string | null;
    faqs: { question: string; answer: string }[];  } | null;
}

interface LocalizedName {
  en: string;
  ar: string | null;
}

interface SearchProduct {
  id: number;
  sku: string;
  name: LocalizedName;
  images: { en: string[] | null; ar: string[] | null };
  url: string;
  category_url_resolved: string;
  parent_category_url_resolved: string;
  price: number;
  sale_price: number;
  currency: { symbol: string; title: string };
  quote_available?: boolean | null;
  isRequired?: boolean;
  total_reviews?: number;
  avg_rating?: number | null;
  alt_tags?: string[];
  in_wishlist?: boolean;
  in_cart?: boolean;
  selling_type?: {
    attribute_value: { en?: string | null; ar?: string | null } | string;
    attribute_value_unit: { en?: string | null; ar?: string | null } | string;
  };
  suppliers?: {
    vendor_id?: number;
    price?: number;
    sale_price?: number;
    delivery_days?: string;
    return_policy?: string;
    free_shipping?: boolean | number;
    min_quantity?: number;
    is_fixed?: boolean | number;
  }[];
}

interface SearchCategory {
  id: number;
  name: LocalizedName;
  image: string | null;
  url: string;
  super_parent_url: string;
  super_parent: { id: number; name: LocalizedName; url: string };
}

interface SearchBrand {
  id: number;
  name: LocalizedName;
  image: string | null;
  slug: string;
  url: string | null;
}

interface SearchFilterBrand {
  id: number;
  name: LocalizedName;
  thumbnail: string | null;
}

interface SearchFilters {
  priceRange: {
    min_price: number;
    max_price: number;
    currency: { symbol: string; title: string };
  };
  brands: SearchFilterBrand[];
  ratings: number[];
}

interface SearchSuggestions {
  success: boolean;
  data: {
    original_query: string;
    corrected_query: string;
    did_you_mean: string | null;
    products: SearchProduct[];
    categories: SearchCategory[];
    brands: SearchBrand[];
    total_records: number;
    total_pages: number;
    current_page: number;
    length: number;
    filters?: SearchFilters;
  };
}

export type {
  ApiCategory,
  ApiCategoryName, ApiCategoryPage, ApiProductRaw, CategoryPageImageDetail, CategoryPageSeoTranslation, FeaturedCategory, FixedFilterItem, HeaderProps, InnerCategoryPageResponse,
  InnerCategoryPageSeo, LocalizedString, ProductsListingResponse, Props, RangeFilterItem, SearchBrand, SearchCategory, SearchProduct, SearchSuggestions
};

