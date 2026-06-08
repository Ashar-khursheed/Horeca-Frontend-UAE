import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import Link from 'next/link'

import { apiUrls } from '@/apis/api-endpoint'
import { makeApiCallSSR } from '@/apis/ssr-fetch'
import ProductDetailPage from '@/features/product-detail'
import ProductJsonLd from '@/features/product-detail/json-ld-schema'
import type { ProductDetailResponse } from '@/features/product-detail/types'
import { cookies } from 'next/headers'
import { revalidate } from '@/utils'

interface PageProps {
  params: Promise<{
    categorySlug: string
    subCategorySlug: string
    'product-detail-page': string
  }>
}

async function fetchProduct(slug: string, locale: string, withAuth: boolean) {
  return makeApiCallSSR<{ data: ProductDetailResponse }>(
    apiUrls.PRODUCT_DETAIL(slug),
    { lang: locale },
    { revalidate: revalidate, withAuth },
  )
}
async function fetchSimilarProductsForGuestUser(slug: string, locale: string, withAuth: boolean) {
  return makeApiCallSSR<{ data: any[] }>(
    apiUrls.SIMILAR_PRODUCTS_FOR_GUEST_USERS(slug),
    { lang: locale },
    { revalidate: revalidate, withAuth },
  )
}
async function fetchAlternateProducts(slug: string, locale: string, withAuth: boolean) {
  return makeApiCallSSR<{ data: any[] }>(
    apiUrls.ALTERNATE_PRODUCTS_FOR_AUTHENTIC_USERS(slug),
    { lang: locale },
    { revalidate: revalidate, withAuth },
  )
}
// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://test-us.thehorecastore.co/api"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// async function fetchSimilarProductsForAuthenticUser(slug: string, locale: string): Promise<any[] | null> {
//   try {
//     const cookieStore = await cookies()
//     const token = cookieStore.get("token")?.value

//     const url = `${API_BASE}/frontend/products/${slug}/similar?lang=${locale}`
//     const res = await fetch(url, {
//       next: { revalidate: 0 }, // no cache — auth-protected endpoint
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//     })
//     if (!res.ok) return null
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const json: any = await res.json()
//     // API returns { success: true, data: [...] }
//     return Array.isArray(json?.data) ? json.data : null
//   } catch {
//     return null
//   }
// }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { 'product-detail-page': productSlug, categorySlug, subCategorySlug } = await params
  const locale = await getLocale()

  const res = await fetchProduct(productSlug, locale, false)
  const product = res?.data
  if (!product) return { title: productSlug }

  const seo = product.seo

  const title = seo?.meta_title || seo?.title_tag || product.name || productSlug
  const description = seo?.meta_description || undefined

  const ogTitle = seo?.og_title || seo?.meta_title || undefined
  const ogDesc = seo?.og_description || seo?.meta_description || undefined
  const ogImg = seo?.og_image_url && seo.og_image_url !== 'null' && seo.og_image_url !== ''
    ? seo.og_image_url
    : undefined
  const firstImg = product.images?.[0]

  return {
    title: title ?? undefined,
    description,
    robots: { index: seo?.indexing ?? true, follow: true },
    alternates: {
      canonical: `https://www.horecastore.ae/${categorySlug}/${subCategorySlug}/${productSlug}`,
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: `https://www.horecastore.ae${product.url}`,
      images: ogImg
        ? [{ url: ogImg }]
        : firstImg
        ? [{ url: firstImg }]
        : undefined,
      type: 'website',
    },
  }
}

export default async function ProductDetailSlugPage({ params }: PageProps) {
  const { 'product-detail-page': productSlug, categorySlug, subCategorySlug } = await params
    const cookieStore = await cookies();
  const isLoggedIn  = !!cookieStore.get("token")?.value;
  // console.log("Received params:", { categorySlug, subCategorySlug, productSlug })
  const locale = await getLocale()

  const [productData, similarProductsGuest, alternateProducts] = await Promise.all([
    fetchProduct(productSlug, locale, isLoggedIn),
    fetchSimilarProductsForGuestUser(productSlug, locale, isLoggedIn),
    fetchAlternateProducts(productSlug, locale, isLoggedIn),
  ])

  if (!productData?.data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4 py-16">
        <div className="text-center max-w-md w-full">
          {/* Icon */}
          <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-[#186737]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.375c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          </div>

          {/* Text */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-3">
            Product Not Found
          </h1>
          <p className="text-sm md:text-base text-gray-500 mb-8 leading-relaxed">
            The product you&apos;re looking for doesn&apos;t exist or may have been removed.
            Browse our catalog to find what you need.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c2f] transition-colors"
            >
              Go to Homepage
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#186737] text-[#186737] text-sm font-semibold hover:bg-green-50 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const schema = productData.data.seo?.seo_schema


  return (
    <>
      <ProductJsonLd schema={schema} />
      <ProductDetailPage
        productData={productData.data}
        locale={locale}
        categorySlug={categorySlug}
        subCategorySlug={subCategorySlug}
        similarProductsGuest={similarProductsGuest?.data ?? []}
        alternateProducts={alternateProducts?.data ?? []}
      />
    </>
  )
}
