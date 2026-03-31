interface HeaderProps {
  locale?: string;
  userName?: string;
  wishlistCount?: number;
  cartCount?: number;
  deliverTo?: {
    name: string;
    address: string;
  };
}

export type {
    HeaderProps
};

