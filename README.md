
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```



/𝘀𝗿𝗰
├── /𝗮𝘀𝘀𝗲𝘁𝘀 → Images, fonts, and other static files
├── /𝗰𝗼𝗺𝗽𝗼𝗻𝗲𝗻𝘁𝘀 → Reusable components
├── /𝗰𝗼𝗻𝘁𝗲𝘅𝘁 → Context API or Redux logic
├── /𝗱𝗮𝘁𝗮 → Static data or data models used in the app
├── /𝗳𝗲𝗮𝘁𝘂𝗿𝗲𝘀 → Feature-specific modules
├── /app → Page-level components
├── /𝗵𝗼𝗼𝗸𝘀 → Custom React hooks
├── /𝗹𝗮𝘆𝗼𝘂𝘁𝘀 → App structure components (header, footer)
├── /𝗹𝗶𝗯 → External libraries and utilities
├── /𝘀𝗲𝗿𝘃𝗶𝗰𝗲𝘀 → API calls and external services
├── /𝘀𝘁𝘆𝗹𝗲𝘀 → Global and component-specific styles
└── /𝘂𝘁𝗶𝗹𝘀 → Utility functions and helpers


📁 Single App Structure (Customer + Vendor Both)

horeca-store/
│
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   ├── hero-banner.jpg
│   │   └── products/
│   ├── fonts/
│   │   ├── inter/
│   │   └── arabic/
│   └── favicon.ico
│
├── src/
│   │
│   ├── app/                                    # Next.js 14 App Router
│   │   │
│   │   ├── (customer)/                        # Customer Section
│   │   │   │
│   │   │   ├── (marketing)/                   # Public pages (SSG)
│   │   │   │   ├── page.tsx                  # Homepage
│   │   │   │   ├── /about
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── /contact
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx                # Marketing layout
│   │   │   │
│   │   │   ├── (shop)/                       # Shopping (SSR + SSG)
│   │   │   │   ├── /products
│   │   │   │   │   ├── page.tsx             # Product list (SSR)
│   │   │   │   │   └── /[slug]
│   │   │   │   │       └── page.tsx         # Product detail (SSG)
│   │   │   │   ├── /categories
│   │   │   │   │   ├── page.tsx             # Categories (SSG)
│   │   │   │   │   └── /[slug]
│   │   │   │   │       └── page.tsx         # Category products (SSR)
│   │   │   │   ├── /brands
│   │   │   │   │   └── /[slug]
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── /deals
│   │   │   │   │   └── page.tsx
│   │   │   │   └── /search
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── (cart)/                       # Cart & Checkout (CSR)
│   │   │   │   ├── /cart
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── /checkout
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── /payment
│   │   │   │   │   └── page.tsx
│   │   │   │   └── /order-success
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── (account)/                    # Customer Account (SSR)
│   │   │   │   ├── /profile
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── /orders
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── /[id]
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── /wishlist
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── /addresses
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── /reviews
│   │   │   │   │   └── page.tsx
│   │   │   │   └── /settings
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx               # Account layout
│   │   │   │
│   │   │   └── layout.tsx                    # Customer root layout
│   │   │
│   │   ├── /vendor/                          # Vendor Section
│   │   │   │
│   │   │   ├── (auth)/                       # Vendor Auth
│   │   │   │   ├── /login
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── /register
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── (dashboard)/                  # Vendor Dashboard
│   │   │   │   ├── page.tsx                 # Dashboard home (SSR)
│   │   │   │   │
│   │   │   │   ├── /products                # Product Management
│   │   │   │   │   ├── page.tsx            # Product list (SSR)
│   │   │   │   │   ├── /new
│   │   │   │   │   │   └── page.tsx        # Add product (CSR)
│   │   │   │   │   └── /[id]
│   │   │   │   │       └── /edit
│   │   │   │   │           └── page.tsx    # Edit product (CSR)
│   │   │   │   │
│   │   │   │   ├── /orders                  # Order Management
│   │   │   │   │   ├── page.tsx            # Orders list (SSR)
│   │   │   │   │   └── /[id]
│   │   │   │   │       └── page.tsx        # Order details (SSR)
│   │   │   │   │
│   │   │   │   ├── /inventory               # Inventory
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── /bulk-update
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── /earnings                # Earnings
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── /payouts
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── /transactions
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── /analytics               # Analytics
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── /sales
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── /customers
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── /reviews                 # Reviews
│   │   │   │   │   └── page.tsx
│   │   │   │   │
│   │   │   │   ├── /shipping                # Shipping
│   │   │   │   │   └── page.tsx
│   │   │   │   │
│   │   │   │   ├── /profile                 # Vendor Profile
│   │   │   │   │   └── page.tsx
│   │   │   │   │
│   │   │   │   ├── /settings                # Settings
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── /store
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── /payment
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── /notifications
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   └── layout.tsx               # Dashboard layout (with sidebar)
│   │   │   │
│   │   │   └── layout.tsx                    # Vendor root layout
│   │   │
│   │   ├── (auth)/                           # Shared Auth (Customer + Vendor)
│   │   │   ├── /login
│   │   │   │   └── page.tsx
│   │   │   ├── /register
│   │   │   │   └── page.tsx
│   │   │   ├── /forgot-password
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   │
│   │   ├── layout.tsx                        # Root layout
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── globals.css
│   │
│   ├── components/                           # Reusable Components
│   │   │
│   │   ├── ui/                              # Base UI (Shared)
│   │   │   ├── /button
│   │   │   │   ├── Button.tsx
│   │   │   │   └── index.ts
│   │   │   ├── /input
│   │   │   ├── /card
│   │   │   ├── /modal
│   │   │   ├── /select
│   │   │   ├── /checkbox
│   │   │   ├── /table
│   │   │   ├── /toast
│   │   │   ├── /dialog
│   │   │   ├── /badge
│   │   │   ├── /avatar
│   │   │   ├── /skeleton
│   │   │   └── /spinner
│   │   │
│   │   ├── customer/                        # Customer-specific
│   │   │   ├── /layout
│   │   │   │   ├── CustomerHeader.tsx
│   │   │   │   ├── CustomerFooter.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── MobileNav.tsx
│   │   │   ├── /home
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── FeaturedProducts.tsx
│   │   │   │   ├── CategoryGrid.tsx
│   │   │   │   └── DealsSection.tsx
│   │   │   ├── /product
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   ├── ProductFilter.tsx
│   │   │   │   ├── ProductGallery.tsx
│   │   │   │   └── ProductReviews.tsx
│   │   │   ├── /cart
│   │   │   │   ├── CartItem.tsx
│   │   │   │   ├── CartSummary.tsx
│   │   │   │   ├── CartDrawer.tsx
│   │   │   │   └── MiniCart.tsx
│   │   │   ├── /checkout
│   │   │   │   ├── CheckoutSteps.tsx
│   │   │   │   ├── ShippingForm.tsx
│   │   │   │   ├── PaymentForm.tsx
│   │   │   │   └── OrderSummary.tsx
│   │   │   └── /widgets
│   │   │       ├── NewsletterForm.tsx
│   │   │       └── ChatWidget.tsx
│   │   │
│   │   ├── vendor/                          # Vendor-specific
│   │   │   ├── /layout
│   │   │   │   ├── VendorSidebar.tsx
│   │   │   │   ├── VendorHeader.tsx
│   │   │   │   └── VendorMobileNav.tsx
│   │   │   ├── /dashboard
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── RecentOrders.tsx
│   │   │   │   ├── SalesChart.tsx
│   │   │   │   └── QuickActions.tsx
│   │   │   ├── /products
│   │   │   │   ├── ProductForm.tsx
│   │   │   │   ├── ProductTable.tsx
│   │   │   │   ├── BulkUpload.tsx
│   │   │   │   ├── VariantManager.tsx
│   │   │   │   └── ImageUploader.tsx
│   │   │   ├── /orders
│   │   │   │   ├── OrderTable.tsx
│   │   │   │   ├── OrderCard.tsx
│   │   │   │   ├── OrderStatusUpdate.tsx
│   │   │   │   └── OrderFilters.tsx
│   │   │   └── /analytics
│   │   │       ├── SalesGraph.tsx
│   │   │       ├── TopProducts.tsx
│   │   │       └── RevenueChart.tsx
│   │   │
│   │   └── common/                          # Shared by both
│   │       ├── Loading.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── Pagination.tsx
│   │       ├── EmptyState.tsx
│   │       └── SearchInput.tsx
│   │
│   ├── features/                            # Feature Modules
│   │   │
│   │   ├── auth/                            # Authentication (Shared)
│   │   │   ├── /api
│   │   │   │   ├── login.ts
│   │   │   │   ├── register.ts
│   │   │   │   ├── logout.ts
│   │   │   │   └── verifyToken.ts
│   │   │   ├── /hooks
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useLogin.ts
│   │   │   │   ├── useRegister.ts
│   │   │   │   └── useSession.ts
│   │   │   ├── /components
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── /store
│   │   │   │   └── authStore.ts
│   │   │   ├── /types
│   │   │   │   └── auth.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── products/                        # Products (Shared)
│   │   │   ├── /api
│   │   │   │   ├── getProducts.ts
│   │   │   │   ├── getProductById.ts
│   │   │   │   ├── getProductBySlug.ts
│   │   │   │   ├── createProduct.ts         # Vendor only
│   │   │   │   ├── updateProduct.ts         # Vendor only
│   │   │   │   ├── deleteProduct.ts         # Vendor only
│   │   │   │   └── searchProducts.ts
│   │   │   ├── /hooks
│   │   │   │   ├── useProducts.ts           # Customer & Vendor
│   │   │   │   ├── useProduct.ts
│   │   │   │   ├── useProductSearch.ts
│   │   │   │   ├── useCreateProduct.ts      # Vendor only
│   │   │   │   └── useUpdateProduct.ts      # Vendor only
│   │   │   ├── /components
│   │   │   │   └── ProductDetails.tsx       # Shared
│   │   │   ├── /store
│   │   │   │   └── productStore.ts
│   │   │   ├── /types
│   │   │   │   └── product.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── cart/                            # Cart (Customer only)
│   │   │   ├── /api
│   │   │   │   ├── addToCart.ts
│   │   │   │   ├── updateCartItem.ts
│   │   │   │   ├── removeFromCart.ts
│   │   │   │   └── getCart.ts
│   │   │   ├── /hooks
│   │   │   │   ├── useCart.ts
│   │   │   │   └── useCartMutations.ts
│   │   │   ├── /store
│   │   │   │   └── cartStore.ts
│   │   │   ├── /types
│   │   │   │   └── cart.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── orders/                          # Orders (Shared)
│   │   │   ├── /api
│   │   │   │   ├── getOrders.ts             # Customer & Vendor
│   │   │   │   ├── getOrderById.ts
│   │   │   │   ├── createOrder.ts           # Customer only
│   │   │   │   ├── updateOrderStatus.ts     # Vendor only
│   │   │   │   └── cancelOrder.ts
│   │   │   ├── /hooks
│   │   │   │   ├── useOrders.ts
│   │   │   │   ├── useOrder.ts
│   │   │   │   ├── useCreateOrder.ts        # Customer
│   │   │   │   └── useUpdateOrder.ts        # Vendor
│   │   │   ├── /components
│   │   │   │   ├── OrderCard.tsx            # Shared
│   │   │   │   ├── OrderStatus.tsx
│   │   │   │   └── OrderTimeline.tsx
│   │   │   ├── /types
│   │   │   │   └── order.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── checkout/                        # Checkout (Customer only)
│   │   │   ├── /api
│   │   │   ├── /hooks
│   │   │   │   ├── useCheckout.ts
│   │   │   │   └── usePayment.ts
│   │   │   ├── /store
│   │   │   │   └── checkoutStore.ts
│   │   │   └── /types
│   │   │
│   │   ├── wishlist/                        # Wishlist (Customer only)
│   │   │   ├── /api
│   │   │   ├── /hooks
│   │   │   │   └── useWishlist.ts
│   │   │   ├── /store
│   │   │   └── /types
│   │   │
│   │   ├── reviews/                         # Reviews (Customer & Vendor)
│   │   │   ├── /api
│   │   │   ├── /hooks
│   │   │   ├── /components
│   │   │   └── /types
│   │   │
│   │   ├── inventory/                       # Inventory (Vendor only)
│   │   │   ├── /api
│   │   │   ├── /hooks
│   │   │   │   └── useInventory.ts
│   │   │   └── /types
│   │   │
│   │   ├── analytics/                       # Analytics (Vendor only)
│   │   │   ├── /api
│   │   │   ├── /hooks
│   │   │   │   ├── useSalesAnalytics.ts
│   │   │   │   └── useRevenueStats.ts
│   │   │   └── /types
│   │   │
│   │   └── earnings/                        # Earnings (Vendor only)
│   │       ├── /api
│   │       ├── /hooks
│   │       │   ├── useEarnings.ts
│   │       │   └── usePayouts.ts
│   │       └── /types
│   │
│   ├── lib/                                 # Utilities & Helpers
│   │   ├── /api-client
│   │   │   ├── client.ts
│   │   │   ├── interceptors.ts
│   │   │   └── endpoints.ts
│   │   ├── /utils
│   │   │   ├── cn.ts
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── helpers.ts
│   │   ├── /auth
│   │   │   ├── session.ts
│   │   │   ├── tokens.ts
│   │   │   └── middleware.ts
│   │   └── /validation
│   │       ├── schemas.ts
│   │       └── rules.ts
│   │
│   ├── hooks/                               # Global Custom Hooks
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useClickOutside.ts
│   │   └── useScrollLock.ts
│   │
│   ├── store/                               # Global State
│   │   ├── index.ts
│   │   ├── provider.tsx
│   │   └── slices/
│   │       ├── uiSlice.ts
│   │       ├── userSlice.ts
│   │       └── settingsSlice.ts
│   │
│   ├── types/                               # TypeScript Types
│   │   ├── index.ts
│   │   ├── common.types.ts
│   │   ├── /api
│   │   │   ├── product.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── order.types.ts
│   │   │   └── response.types.ts
│   │   └── /models
│   │       ├── Product.ts
│   │       ├── User.ts
│   │       ├── Order.ts
│   │       ├── Vendor.ts
│   │       └── Customer.ts
│   │
│   ├── config/                              # App Configuration
│   │   ├── site.config.ts
│   │   ├── api.config.ts
│   │   ├── env.ts
│   │   └── routes.ts
│   │
│   ├── constants/                           # Constants
│   │   ├── index.ts
│   │   ├── api-endpoints.ts
│   │   ├── navigation.ts
│   │   └── status.ts
│   │
│   ├── styles/                              # Global Styles
│   │   ├── globals.css
│   │   ├── customer.css
│   │   └── vendor.css
│   │
│   └── middleware.ts                        # Next.js Middleware
│
├── .env.local
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
└── README.md

🌐 URLs Structure

Customer Routes:
├── /                          → Homepage
├── /about                     → About page
├── /products                  → Product listing
├── /products/[slug]          → Product details
├── /categories               → Categories
├── /cart                     → Shopping cart
├── /checkout                 → Checkout
├── /profile                  → Customer profile
└── /orders                   → Customer orders

Vendor Routes:
├── /vendor                   → Vendor dashboard
├── /vendor/products         → Manage products
├── /vendor/products/new     → Add product
├── /vendor/orders           → Vendor orders
├── /vendor/analytics        → Analytics
├── /vendor/earnings         → Earnings
└── /vendor/settings         → Settings

Auth Routes (Shared):
├── /login                    → Login
├── /register                 → Register
└── /forgot-password         → Forgot password