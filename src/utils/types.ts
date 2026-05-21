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

export type {
    HeaderProps
};

