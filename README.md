# 🍽️ HorecaStore — Next.js 16 (App Router)

> **B2B Hospitality Supply E-Commerce Platform**  
> Serving **UAE 🇦🇪** and **USA 🇺🇸** from a single unified Next.js codebase.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Multi-Region Architecture (UAE + USA)](#multi-region-architecture-uae--usa)
- [Rendering Strategy — SSR / SSG / CSR](#rendering-strategy--ssr--ssg--csr)
- [URL Structure](#url-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Key Features](#key-features)
- [Migration Notes (React → Next.js)](#migration-notes-react--nextjs)
- [Deployment](#deployment)

---

## Overview

HorecaStore is a **B2B e-commerce platform** for the hospitality industry (hotels, restaurants, cafes). It supports two regional storefronts:

| Region | Domain | Currency | VAT |
|--------|--------|----------|-----|
| 🇺🇸 USA | `thehorecastore.com` | USD $ | 0% |
| 🇦🇪 UAE | `horecastore.ae` | AED د.إ | 5% |

Both regions share the **same Next.js codebase**, with region-specific logic handled via environment variables, middleware, and locale config.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand / Redux Toolkit |
| Data Fetching | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Auth | JWT + NextAuth.js (or custom middleware) |
| Payments | Square, Stripe, Stax, CCAvenue, Paymob, Tamara |
| Email | AWS SES |
| Infra | AWS (CloudFront, S3, Amplify, EC2) |
| Analytics | Google Tag Manager (region-specific IDs) |
| Chat Widget | Freshchat |

---

## Project Structure

```
horeca-store/
│
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   ├── hero-banner.jpg
│   │   └── products/
│   ├── fonts/
│   │   ├── inter/
│   │   └── arabic/               ← UAE Arabic support
│   └── favicon.ico
│
├── src/
│   │
│   ├── app/                                    # Next.js 16 App Router
│   │   │
│   │   ├── (customer)/                        # Customer Section
│   │   │   │
│   │   │   ├── (marketing)/                   # Public pages — SSG
│   │   │   │   ├── page.tsx                   # Homepage
│   │   │   │   ├── about/page.tsx
│   │   │   │   ├── contact/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── (shop)/                        # Shopping — SSR + SSG
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx               # Product listing — SSR
│   │   │   │   │   └── [slug]/page.tsx        # Product detail — SSG
│   │   │   │   ├── categories/
│   │   │   │   │   ├── page.tsx               # Categories — SSG
│   │   │   │   │   └── [slug]/page.tsx        # Category products — SSR
│   │   │   │   ├── brands/
│   │   │   │   │   └── [slug]/page.tsx
│   │   │   │   ├── deals/page.tsx
│   │   │   │   └── search/page.tsx
│   │   │   │
│   │   │   ├── (cart)/                        # Cart & Checkout — CSR
│   │   │   │   ├── cart/page.tsx
│   │   │   │   ├── checkout/page.tsx
│   │   │   │   ├── payment/page.tsx
│   │   │   │   └── order-success/page.tsx
│   │   │   │
│   │   │   ├── (account)/                     # Customer Account — SSR
│   │   │   │   ├── profile/page.tsx
│   │   │   │   ├── orders/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── wishlist/page.tsx
│   │   │   │   ├── addresses/page.tsx
│   │   │   │   ├── reviews/page.tsx
│   │   │   │   ├── settings/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   └── layout.tsx                     # Customer root layout
│   │   │
│   │   ├── vendor/                            # Vendor Section
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── (dashboard)/
│   │   │   │   ├── page.tsx                   # Dashboard home — SSR
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx               # Product list — SSR
│   │   │   │   │   ├── new/page.tsx           # Add product — CSR
│   │   │   │   │   └── [id]/edit/page.tsx     # Edit product — CSR
│   │   │   │   ├── orders/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── inventory/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── bulk-update/page.tsx
│   │   │   │   ├── earnings/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── payouts/page.tsx
│   │   │   │   │   └── transactions/page.tsx
│   │   │   │   ├── analytics/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── sales/page.tsx
│   │   │   │   │   └── customers/page.tsx
│   │   │   │   ├── reviews/page.tsx
│   │   │   │   ├── shipping/page.tsx
│   │   │   │   ├── profile/page.tsx
│   │   │   │   ├── settings/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── store/page.tsx
│   │   │   │   │   ├── payment/page.tsx
│   │   │   │   │   └── notifications/page.tsx
│   │   │   │   └── layout.tsx                 # Dashboard layout (with sidebar)
│   │   │   │
│   │   │   └── layout.tsx                     # Vendor root layout
│   │   │
│   │   ├── (auth)/                            # Shared Auth
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── layout.tsx                         # Root layout
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                               # Base UI — Shared
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   ├── card/
│   │   │   ├── modal/
│   │   │   ├── select/
│   │   │   ├── checkbox/
│   │   │   ├── table/
│   │   │   ├── toast/
│   │   │   ├── badge/
│   │   │   ├── avatar/
│   │   │   ├── skeleton/
│   │   │   └── spinner/
│   │   │
│   │   ├── customer/                         # Customer-specific
│   │   │   ├── layout/
│   │   │   │   ├── CustomerHeader.tsx
│   │   │   │   ├── CustomerFooter.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── MobileNav.tsx
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── FeaturedProducts.tsx
│   │   │   │   ├── CategoryGrid.tsx
│   │   │   │   └── DealsSection.tsx
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   ├── ProductFilter.tsx
│   │   │   │   ├── ProductGallery.tsx
│   │   │   │   └── ProductReviews.tsx
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.tsx
│   │   │   │   ├── CartSummary.tsx
│   │   │   │   ├── CartDrawer.tsx
│   │   │   │   └── MiniCart.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── CheckoutSteps.tsx
│   │   │   │   ├── ShippingForm.tsx
│   │   │   │   ├── PaymentForm.tsx
│   │   │   │   └── OrderSummary.tsx
│   │   │   └── widgets/
│   │   │       ├── NewsletterForm.tsx
│   │   │       └── ChatWidget.tsx
│   │   │
│   │   ├── vendor/                           # Vendor-specific
│   │   │   ├── layout/
│   │   │   │   ├── VendorSidebar.tsx
│   │   │   │   ├── VendorHeader.tsx
│   │   │   │   └── VendorMobileNav.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── RecentOrders.tsx
│   │   │   │   ├── SalesChart.tsx
│   │   │   │   └── QuickActions.tsx
│   │   │   ├── products/
│   │   │   │   ├── ProductForm.tsx
│   │   │   │   ├── ProductTable.tsx
│   │   │   │   ├── BulkUpload.tsx
│   │   │   │   ├── VariantManager.tsx
│   │   │   │   └── ImageUploader.tsx
│   │   │   ├── orders/
│   │   │   │   ├── OrderTable.tsx
│   │   │   │   ├── OrderCard.tsx
│   │   │   │   ├── OrderStatusUpdate.tsx
│   │   │   │   └── OrderFilters.tsx
│   │   │   └── analytics/
│   │   │       ├── SalesGraph.tsx
│   │   │       ├── TopProducts.tsx
│   │   │       └── RevenueChart.tsx
│   │   │
│   │   └── common/                           # Shared by both
│   │       ├── Loading.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── Pagination.tsx
│   │       ├── EmptyState.tsx
│   │       └── SearchInput.tsx
│   │
│   ├── features/                             # Feature Modules
│   │   ├── auth/
│   │   │   ├── api/            # login, register, logout, verifyToken
│   │   │   ├── hooks/          # useAuth, useLogin, useRegister, useSession
│   │   │   ├── components/     # LoginForm, RegisterForm, ProtectedRoute
│   │   │   ├── store/          # authStore.ts
│   │   │   ├── types/          # auth.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── products/
│   │   │   ├── api/            # getProducts, getProductBySlug, createProduct...
│   │   │   ├── hooks/          # useProducts, useProduct, useProductSearch...
│   │   │   ├── components/     # ProductDetails.tsx (shared)
│   │   │   ├── store/          # productStore.ts
│   │   │   ├── types/          # product.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── cart/               # Customer only
│   │   ├── orders/             # Shared
│   │   ├── checkout/           # Customer only
│   │   ├── wishlist/           # Customer only
│   │   ├── reviews/            # Shared
│   │   ├── inventory/          # Vendor only
│   │   ├── analytics/          # Vendor only
│   │   └── earnings/           # Vendor only
│   │
│   ├── lib/
│   │   ├── api-client/
│   │   │   ├── client.ts       # Axios instance with base URL
│   │   │   ├── interceptors.ts # Auth token injection + error handling
│   │   │   └── endpoints.ts    # All API endpoint constants
│   │   ├── utils/
│   │   │   ├── cn.ts           # Tailwind class merge utility
│   │   │   ├── formatters.ts   # Currency, date, phone formatters
│   │   │   ├── validators.ts
│   │   │   └── helpers.ts
│   │   ├── auth/
│   │   │   ├── session.ts
│   │   │   ├── tokens.ts
│   │   │   └── middleware.ts
│   │   └── validation/
│   │       ├── schemas.ts      # Zod schemas
│   │       └── rules.ts
│   │
│   ├── hooks/                              # Global Custom Hooks
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useClickOutside.ts
│   │   ├── useOnlineStatus.ts
│   │   ├── usePaymentState.ts
│   │   └── useScrollLock.ts
│   │
│   ├── store/                              # Global State (Zustand / Redux)
│   │   ├── index.ts
│   │   ├── provider.tsx
│   │   └── slices/
│   │       ├── uiSlice.ts
│   │       ├── userSlice.ts
│   │       └── settingsSlice.ts
│   │
│   ├── types/                              # TypeScript Types
│   │   ├── index.ts
│   │   ├── common.types.ts
│   │   ├── api/
│   │   │   ├── product.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── order.types.ts
│   │   │   └── response.types.ts
│   │   └── models/
│   │       ├── Product.ts
│   │       ├── User.ts
│   │       ├── Order.ts
│   │       ├── Vendor.ts
│   │       └── Customer.ts
│   │
│   ├── config/
│   │   ├── site.config.ts      # Site name, SEO defaults, region config
│   │   ├── api.config.ts       # API base URLs per region
│   │   ├── env.ts              # Typed env variable access
│   │   └── routes.ts           # Route constants
│   │
│   ├── constants/
│   │   ├── index.ts
│   │   ├── api-endpoints.ts
│   │   ├── navigation.ts
│   │   └── status.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── customer.css
│   │   └── vendor.css
│   │
│   └── middleware.ts                       # Next.js Middleware (auth + region)
│
├── .env.local                             # Local env (not committed)
├── .env.example                           # Example env template
├── .env.uae                               # UAE-specific overrides
├── .env.usa                               # USA-specific overrides
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Multi-Region Architecture (UAE + USA)

Both storefronts are built from **one codebase**. Region is determined at runtime via:

### 1. Environment Variables

```env
# .env.usa
NEXT_PUBLIC_REGION=usa
NEXT_PUBLIC_API_BASE_URL=https://pim.thehorecastore.co/api
NEXT_PUBLIC_SITE_URL=https://www.thehorecastore.com
NEXT_PUBLIC_CURRENCY=USD
NEXT_PUBLIC_CURRENCY_SYMBOL=$
NEXT_PUBLIC_VAT_RATE=0
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_PHONE=+1 800-467-322
NEXT_PUBLIC_PHONE_TEL=tel:+18664467322

# .env.uae
NEXT_PUBLIC_REGION=uae
NEXT_PUBLIC_API_BASE_URL=https://pim.horecastore.ae/api
NEXT_PUBLIC_SITE_URL=https://www.horecastore.ae
NEXT_PUBLIC_CURRENCY=AED
NEXT_PUBLIC_CURRENCY_SYMBOL=د.إ
NEXT_PUBLIC_VAT_RATE=5
NEXT_PUBLIC_GTM_ID=GTM-YYYYYYY
NEXT_PUBLIC_PHONE=+971 4 XXX XXXX
NEXT_PUBLIC_PHONE_TEL=tel:+97160000000
```

### 2. Region Config Helper

```ts
// src/config/site.config.ts
export const siteConfig = {
  region: process.env.NEXT_PUBLIC_REGION as 'usa' | 'uae',
  currency: process.env.NEXT_PUBLIC_CURRENCY!,
  currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL!,
  vatRate: Number(process.env.NEXT_PUBLIC_VAT_RATE),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
  phone: process.env.NEXT_PUBLIC_PHONE!,
  isUAE: process.env.NEXT_PUBLIC_REGION === 'uae',
  isUSA: process.env.NEXT_PUBLIC_REGION === 'usa',
};
```

### 3. Region-Specific UI Differences

| Feature | USA 🇺🇸 | UAE 🇦🇪 |
|---------|---------|---------|
| Currency | USD ($) | AED (د.إ) |
| VAT | None (0%) | 5% on checkout |
| Language | English | English + Arabic RTL |
| Payment Gateways | Square, Stripe, Stax | CCAvenue, Paymob, Tamara |
| Shipping Tiers | Houston $99 / Texas $199 / Rest $299 | UAE flat rate |
| Phone | +1 800-467-322 | +971 4 XXX XXXX |
| GTM ID | US GTM ID | UAE GTM ID |
| Chat Widget | Freshchat US | Freshchat UAE |

### 4. Middleware — Region + Auth Guard

```ts
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/profile', '/orders', '/wishlist', '/addresses',
  '/checkout', '/payment', '/vendor',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value;

  // Auth guard
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Vendor guard
  if (pathname.startsWith('/vendor') && !token) {
    return NextResponse.redirect(new URL('/vendor/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## Rendering Strategy — SSR / SSG / CSR

| Page | Strategy | Reason |
|------|----------|--------|
| `/` Homepage | **SSG** + ISR | Marketing content, revalidate every 1hr |
| `/products` Listing | **SSR** | Filters, search, pagination — dynamic |
| `/products/[slug]` Detail | **SSG** + ISR | SEO-critical, pre-build popular SKUs |
| `/categories/[slug]` | **SSR** | Dynamic product filtering |
| `/brands/[slug]` | **SSG** | Mostly static brand pages |
| `/search` | **CSR** | Real-time search input |
| `/cart` | **CSR** | User-specific, no SEO needed |
| `/checkout` | **CSR** | Protected, dynamic |
| `/payment` | **CSR** | Protected, gateway callbacks |
| `/account/*` | **SSR** | Protected user data |
| `/vendor/*` | **SSR / CSR** | Dashboard data + interactive forms |
| `/blog` | **SSG** + ISR | SEO content, revalidate every 6hr |
| `/blog/[slug]` | **SSG** | Per-article static generation |
| `/about`, `/contact` | **SSG** | Pure static marketing pages |

### SSG Example — Product Detail

```ts
// src/app/(customer)/(shop)/products/[slug]/page.tsx

import { Metadata } from 'next';
import { getProductBySlug, getAllProductSlugs } from '@/features/products/api';

// Pre-build top 1000 products at build time
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs({ limit: 1000 });
  return slugs.map((slug) => ({ slug }));
}

// Dynamic SEO meta per product
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  return {
    title: product.meta_title,
    description: product.meta_description,
    openGraph: {
      title: product.og_title,
      description: product.og_description,
      images: [product.og_image_url],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.url}`,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  return <ProductDetailClient product={product} />;
}

// ISR — revalidate every 10 minutes
export const revalidate = 600;
```

### SSR Example — Product Listing

```ts
// src/app/(customer)/(shop)/products/page.tsx

export default async function ProductListingPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string; sort?: string };
}) {
  const products = await getProducts({
    page: Number(searchParams.page ?? 1),
    category: searchParams.category,
    sort: searchParams.sort,
  });

  return <ProductListingClient initialData={products} />;
}

// No cache — SSR on every request
export const dynamic = 'force-dynamic';
```

---

## URL Structure

### Customer Routes

```
/                                → Homepage
/about                           → About page
/contact                         → Contact us
/products                        → Product listing (SSR)
/products/[slug]                 → Product detail (SSG)
/categories                      → All categories (SSG)
/categories/[slug]               → Category products (SSR)
/brands/[id]                     → Brand page
/brands/[id]/[slug]              → Brand sub-page
/search                          → Search results (CSR)
/blog                            → Blog listing (SSG)
/blog/[slug]                     → Blog post (SSG)
/cart                            → Shopping cart (CSR)
/checkout                        → Checkout (CSR, protected)
/payment                         → Payment (CSR, protected)
/order-success                   → Order confirmation (CSR)
/profile                         → Customer profile (SSR, protected)
/orders                          → Order history (SSR, protected)
/orders/[id]                     → Order detail (SSR, protected)
/wishlist                        → Wishlist (SSR, protected)
/addresses                       → Saved addresses (SSR, protected)
/login                           → Login
/register                        → Register
/forgot-password                 → Forgot password
/pages/[id]                      → Dynamic pages (Privacy, Terms etc.)
/faq                             → FAQ
/sell-on-horeca                  → Sell on HorecaStore
/price-match                     → Price match page
/locations/[state]/[slug]        → Location pages (Houston, UAE etc.)
/sale                            → Sale page
```

### Vendor Routes

```
/vendor                          → Vendor dashboard (SSR, protected)
/vendor/products                 → Product list (SSR, protected)
/vendor/products/new             → Add product (CSR, protected)
/vendor/products/[id]/edit       → Edit product (CSR, protected)
/vendor/orders                   → Orders list (SSR, protected)
/vendor/orders/[id]              → Order detail (SSR, protected)
/vendor/inventory                → Inventory (SSR, protected)
/vendor/inventory/bulk-update    → Bulk inventory update (CSR)
/vendor/earnings                 → Earnings overview (SSR)
/vendor/earnings/payouts         → Payouts (SSR)
/vendor/analytics                → Analytics dashboard (SSR)
/vendor/reviews                  → Product reviews (SSR)
/vendor/shipping                 → Shipping settings
/vendor/profile                  → Vendor profile
/vendor/settings                 → Store settings
/vendor/login                    → Vendor login
/vendor/register                 → Vendor register
```

---

## Environment Variables

```env
# ── App ──────────────────────────────────────────
NEXT_PUBLIC_REGION=usa                            # 'usa' | 'uae'
NEXT_PUBLIC_SITE_URL=https://www.thehorecastore.com
NEXT_PUBLIC_API_BASE_URL=https://pim.thehorecastore.co/api

# ── Region ───────────────────────────────────────
NEXT_PUBLIC_CURRENCY=USD
NEXT_PUBLIC_CURRENCY_SYMBOL=$
NEXT_PUBLIC_VAT_RATE=0
NEXT_PUBLIC_PHONE=+1 800-467-322
NEXT_PUBLIC_PHONE_TEL=tel:+18664467322

# ── Analytics ────────────────────────────────────
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# ── Payments (USA) ───────────────────────────────
NEXT_PUBLIC_SQUARE_APP_ID=
NEXT_PUBLIC_SQUARE_LOCATION_ID=
SQUARE_ACCESS_TOKEN=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STAX_API_KEY=

# ── Payments (UAE) ───────────────────────────────
CCAVENUE_MERCHANT_ID=
CCAVENUE_ACCESS_CODE=
CCAVENUE_WORKING_KEY=
PAYMOB_API_KEY=
TAMARA_API_KEY=

# ── AWS ──────────────────────────────────────────
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SES_FROM_EMAIL=noreply@thehorecastore.com
AWS_S3_BUCKET=

# ── Auth ─────────────────────────────────────────
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://www.thehorecastore.com
JWT_SECRET=

# ── Chat ─────────────────────────────────────────
NEXT_PUBLIC_FRESHCHAT_TOKEN=
```

---

## Getting Started

### Prerequisites

- Node.js `v18+`
- npm / yarn / pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/horeca-store.git
cd horeca-store

# Install dependencies
npm install

# Copy env template
cp .env.example .env.local
# Fill in your values in .env.local
```

### Development

```bash
# USA version
npm run dev

# UAE version (separate env)
cp .env.uae .env.local && npm run dev
```

### Build & Production

```bash
# Build
npm run build

# Start production server
npm start
```

### Lint & Type Check

```bash
npm run lint
npm run type-check
```

---

## Key Features

### 🛒 E-Commerce
- Product listing with SSR-based filtering, sorting, pagination
- SSG product detail pages with ISR for fresh inventory data
- Cart with persistent state (Zustand)
- Multi-step checkout flow
- Order tracking

### 💳 Payments (Region-Based)
| Gateway | Region |
|---------|--------|
| Square | 🇺🇸 USA |
| Stripe | 🇺🇸 USA |
| Stax | 🇺🇸 USA |
| CCAvenue | 🇦🇪 UAE |
| Paymob | 🇦🇪 UAE |
| Tamara (BNPL) | 🇦🇪 UAE |

### 🚚 Shipping Logic (USA)
```
Houston, TX         → $99
Rest of Texas       → $199
Outside Texas       → $299
```

### 🧾 Tax Logic
```
UAE  → 5% VAT applied at checkout
USA  → No tax (0%)
```

### 🔍 SEO
- `generateMetadata` per page (dynamic title, description, OG tags)
- `generateStaticParams` for product + category pages
- JSON-LD schema injection
- Canonical URLs per region
- Sitemap via `app/sitemap.ts`
- robots.txt via `app/robots.ts`

### 🔐 Auth & Protected Routes
- JWT-based authentication
- Middleware-level route protection
- Separate vendor auth flow
- `PrivateRoute` wrapper component for client-side guard

### 📱 UTM Tracking
- UTM params captured on landing
- Stored in `localStorage`
- Lead sent to backend API with session ID

---

## Migration Notes (React → Next.js)

Coming from the old React (CRA) `App.tsx` with React Router. Key changes:

| Old (React Router) | New (Next.js App Router) |
|-------------------|--------------------------|
| `<Route path="/products" />` | `app/(customer)/(shop)/products/page.tsx` |
| `<Route path="/products/:id" />` | `app/(customer)/(shop)/products/[slug]/page.tsx` |
| `React Helmet` | `generateMetadata()` |
| `lazy(() => import(...))` | Automatic code-splitting by route |
| `PrivateRoute` component | `middleware.ts` + layout-level auth |
| `useLocation`, `useNavigate` | `useRouter`, `usePathname` from `next/navigation` |
| `localStorage` for cart | Zustand store + cookies for SSR |
| `axios` in `useEffect` | `fetch` / `axios` in Server Components |
| `ScrollToTop` component | `scroll={true}` on `<Link>` (default) |
| CRA `process.env.PUBLIC_URL` | `public/` folder (no prefix needed) |

### Component Migration Rule

```
Client-side logic (useState, useEffect, event handlers)
  → Add "use client" directive at top of file

Server-side data fetching (API calls for initial data)
  → Use async Server Components, no "use client"

Mixed (fetch data server-side + interactive UI)
  → Server Component fetches → passes data to Client Component
```

---

## Deployment

### USA (`thehorecastore.com`)
- Hosting: **AWS Amplify** / **Vercel**
- CDN: **AWS CloudFront**
- Storage: **AWS S3**
- Build env: `.env.usa`

### UAE (`horecastore.ae`)
- Hosting: **AWS Amplify** (subdirectory deploy)
- CDN: **AWS CloudFront**
- Storage: **AWS S3**
- Build env: `.env.uae`

### Build Commands

```bash
# USA Build
NEXT_PUBLIC_REGION=usa npm run build

# UAE Build
NEXT_PUBLIC_REGION=uae npm run build
```

---

## Contributing

1. Branch naming: `feature/`, `fix/`, `chore/`
2. Always run `npm run type-check` before pushing
3. Components must be TypeScript — no `.js` files in `src/`
4. Use `cn()` utility for conditional Tailwind classes
5. Server Components by default — only add `"use client"` when needed

---

## License

Private — HorecaStore © 2025. All rights reserved.