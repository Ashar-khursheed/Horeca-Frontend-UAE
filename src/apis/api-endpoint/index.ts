export interface BrandsParams {
  category_id?: string | number;
  letter?: string;
  featured?: boolean;
  with_logo?: boolean;
  grouped?: boolean;
  sort_by?: string;
}

export const apiUrls = {
  // Authentication
  LOGIN: "frontend/login",
  GOOGLE_AUTH: "frontend/auth/google",
  REGISTER: "frontend/customer/register",
  LOGOUT: "frontend/logout",
  GETMYPROFILE: "frontend/customer/get-profile",
  CHANGE_PASSWORD: "frontend/customer/change-password",
  UPDATE_PROFILE: "frontend/customer/update-profile",
  NavigationAPI: "frontend-categories",
  FEATURED_PRODUCTS: "frontend/featured-categories-with-products",
  FEATURED_CATEGORY_TABS: "frontend/featured-categories",
  FEATURED_BRAND_PRODUCTS: "frontend/featured-brands-with-products",
  BLOGS: "frontend/blogs",
  BLOG_CATEGORIES_WITH_BLOGS: "frontend/categories-with-blogs",
  MAIN_CATEGPRY_PAGES: (slug: string) =>
    `frontend/category-pages/by-url/${slug}`,
  BLOG_CATEGORY_BLOGS: (slug: string) => `frontend/category/${slug}/blog`,
  BLOG_SINGLE: (id: number | string) => `frontend/blogs/${id}`,
  BLOG_COMMENTS: (id: number | string) => `frontend/blogs/${id}/comments`,
  BLOG_LIKE: (id: number) => `frontend/blogs/${id}/like`,
  BLOG_SHARE: (id: number) => `frontend/blogs/${id}/share`,
  BLOG_VIEW: (id: number) => `frontend/blogs/${id}/view`,
  INNER_CATEGORY_PAGES_WITH_FILTER: "frontend/products/filters/get-filters",
  PRODUCTS_LISTING: "frontend/products/filters/get-products",
  PRODUCT_DETAIL: (slug: string) => `frontend/products/${slug}`,
  ALTERNATE_PRODUCTS_FOR_AUTHENTIC_USERS: (slug: string) =>
    `frontend/products/${slug}/alternates`,
  SIMILAR_PRODUCTS_FOR_GUEST_USERS: (slug: string) =>
    `frontend/products/${slug}/similar`,
  RECOMMENDED_PRODUCTS: (slug: string) =>
    `frontend/products/${slug}/recommended-product`,
  // SIMILAR_PRODUCTS_FOR_GUEST_USERS: (slug: string) => `frontend/guest/products/${slug}/similar`,
  // https://test-us.thehorecastore.co/api/frontend/products/berjaya-electric-griddle-1-plate/similar
  BRANDS: "frontend/brands",
  SEARCH_API_SUGGESTIONS: (query: string) =>
    `frontend/search?q=${encodeURIComponent(query)}`,
  SEARCH: "frontend/search",

  // Cart
  CART_GET: "frontend/carts",
  CART_ADD: "frontend/carts/add",
  CART_ADD_MULTIPLE: "frontend/carts/add-multiple",
  CART_UPDATE_QTY: (id: number) => `frontend/carts/update-quantity/${id}`,
  CART_REMOVE: (id: number) => `frontend/carts/remove/${id}`,
  CART_EMPTY: "frontend/carts/empty",

  // Wishlist
  WISHLIST_GET: "frontend/wishlist",
  WISHLIST_ADD: "frontend/wishlist/add",
  WISHLIST_REMOVE: "frontend/wishlist/remove",
  WISHLIST_ADD_MULTIPLE: "frontend/wishlist/add-multiple",

  // Save for Later
  SAVE_FOR_LATER: "frontend/save-for-later",
  SAVE_FOR_LATER_REMOVE: "frontend/remove-from-save-for-later",
//   // SAVE_FOR_LATER_REMOVE: "frontend/save-for-later/remove",
//   https://test-us.thehorecastore.co/api/frontend/remove-from-save-for-later/123
// // 


  // Customer Address
  GET_CUSTOMER_ADDRESS: "frontend/customer-address",
  ADD_CUSTOMER_ADDRESS: "frontend/customer-address",
  UPDATE_CUSTOMER_ADDRESS: (id: number) => `frontend/customer-address/${id}`,
  DELETE_CUSTOMER_ADDRESS: (id: number) => `frontend/customer-address/${id}`,
  GET_BY_ID_CUSTOMER_ADDRESS: (id: number) => `frontend/customer-address/${id}`,
  DEFAULT_CUSTOMER_ADDRESS: "frontend/customer-address/default",

  // Customer
  CUSTOMER_COUNTS: "frontend/customer/counts",

  // Brand detail
  BRAND_BY_SLUG: (slug: string) => `frontend/brand-by-slug/${slug}`,

  // Location pages
  HORECA_PAGE_BY_SLUG: (state: string, city: string) =>
    `frontend/horeca-pages-by-slug/locations/${state}/${city}`,
  BRAND_CATEGORY_PRODUCTS: (brandSlug: string, categorySlug: string) =>
    `frontend/products/brand/${brandSlug}/category/${categorySlug}`,

  // General
  COUNTRIES: "frontend/countries",
  STATES: "frontend/states",
  CITIES: "frontend/cities",
  SLIDER: (id: number) => `frontend/sliders/${id}`,


  MADE_TO_ORDER: "frontend/made-to-orders",

  SQUARE_PAYMENT:"frontend/payment-square",
  PLACE_ORDER:"frontend/orders",
  ADD_RECENT_PRODUCT: "frontend/recent-products/add",
  GET_RECENT_PRODUCTS: (page: number) => `frontend/recent-products?page=${page}`,
  GUEST_VIEW_PRODUCT: "frontend/guest/view-product",
  GUEST_RECENT_PRODUCTS: (guestToken: string, page: number) => `frontend/guest/recent-products?guest_token=${guestToken}&page=${page}`,
  ORDER_DETAIL: (id: number) => `frontend/orders/${id}`,
  PAYMENT_HISTORY:"frontend/payments",
  SCREEN_TRANSACTION:"screen-transaction",
  SALE_CATEGORIES: "frontend/sale-categories",
};
