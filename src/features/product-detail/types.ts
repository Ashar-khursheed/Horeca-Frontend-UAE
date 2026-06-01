export type VariantItem = {
  product_id: number;
  sku: string;
  attribute_value: string;
  label: string;
  selected: boolean;
  price: number;
  sale_price: number;
  images: string[];
};

export type AccessoryItem = { id: number; name: string; price: number };

export type Accessory = {
  id: number;
  name: string;
  isRequired: number;
  items: AccessoryItem[];
};

export type Spec = { attribute_name: string; attribute_value: string };

export type ProductAttribute = {
  attribute_name: string;
  attribute_value: string;
  measurement_unit?: string;
};

export type ProductFaq = {
  id: number;
  question: string;
  answer: string;
};

export type ProductSupplier = {
  vendor_id: number;
  price: number;
  sale_price: number;
  inventory: number;
  in_stock: boolean;
  delivery_days: string;
  return_policy: string;
  free_shipping: boolean;
  vendor: { id: number; name: string; country: string; city: string };
};

export type ProductSeo = {
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
  seo_schema: string | null;
};

export type ProductReview = {
  id: number;
  customer_name: string;
  customer_email: string;
  star: number;
  comment: string;
  images: string[];
  created_at: string;
};

export type ProductBreadcrumb = {
  name: string;
  url: string;
};

export type ProductDetailResponse = {
  id: number;
  sku: string;
  name: string;
  images: string[];
  description: string[];
  benefits_features: { benefit: string; feature: string }[];
  url: string;
  total_reviews: number;
  avg_rating: number | null;
  currency: { symbol: string; title: string };
  price: number;
  sale_price: number;
  selling_type: {
    attribute_value: string;
    attribute_value_unit: string;
  };
  suppliers: ProductSupplier[];
  attributes: ProductAttribute[];
  faqs: ProductFaq[];
  variants: unknown[];
  reviews: ProductReview[];
  seo: ProductSeo | null;
  in_wishlist: boolean;
  breadcrumbs?: ProductBreadcrumb[];
};
