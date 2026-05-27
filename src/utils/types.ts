import { LocationData } from "@/components/LocationInitializer";
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
  locationData?: LocationData | null;
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


export type {
    HeaderProps,
    Props,
    ApiCategory,
    ApiCategoryName,
    LocalizedString,
    ApiProductRaw,
    FeaturedCategory,
};

