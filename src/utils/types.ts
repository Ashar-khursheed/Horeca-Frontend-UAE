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
  parent_id: number;
  image_url: string;
  order: number;
  products_count: number;
  name: ApiCategoryName | string;
  slug: string;
  children: ApiCategory[];
}
 interface ApiCategoryName { en: string; ar: string; }


export type {
    HeaderProps,
    Props,
    ApiCategory,
    ApiCategoryName
};

