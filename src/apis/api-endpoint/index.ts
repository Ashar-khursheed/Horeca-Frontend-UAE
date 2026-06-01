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
  REGISTER: "frontend/customer/register",
  LOGOUT: "frontend/logout",
  GETMYPROFILE: "frontend/customer/get-profile",
  CHANGE_PASSWORD: "frontend/customer/change-password",
  UPDATE_PROFILE: "frontend/customer/update-profile",
  NavigationAPI:"frontend-categories",
  FEATURED_PRODUCTS: "frontend/featured-categories-with-products",
  FEATURED_BRAND_PRODUCTS: "frontend/featured-brands-with-products",
  BLOGS: "frontend/blogs",
  BLOG_CATEGORIES_WITH_BLOGS: "frontend/categories-with-blogs",
  MAIN_CATEGPRY_PAGES: (slug: string) => `frontend/category-pages/by-url/${slug}`,
  BLOG_CATEGORY_BLOGS: (slug: string) => `frontend/category/${slug}/blog`,
  BLOG_SINGLE: (id: number | string) => `frontend/blogs/${id}`,
  BLOG_COMMENTS: (id: number | string) => `frontend/blogs/${id}/comments`,
  BLOG_LIKE: (id: number) => `frontend/blogs/${id}/like`,
  BLOG_SHARE: (id: number) => `frontend/blogs/${id}/share`,
  BLOG_VIEW: (id: number) => `frontend/blogs/${id}/view`,
  INNER_CATEGORY_PAGES_WITH_FILTER: "frontend/products/filters/get-filters",
  PRODUCTS_LISTING: "frontend/products/filters/get-products",
  PRODUCT_DETAIL: (slug: string) => `frontend/products/${slug}`,
  BRANDS: "frontend/brands",

  // General
  COUNTRIES: "frontend/countries",
  SLIDER: (id: number) => `frontend/sliders/${id}`,
};
