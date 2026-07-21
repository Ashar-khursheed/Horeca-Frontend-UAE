import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { notFound, redirect } from 'next/navigation'

import { apiUrls } from '@/apis/api-endpoint'
import { makeApiCallSSR } from '@/apis/ssr-fetch'
import ProductDetailPage from '@/features/product-detail'
import ProductJsonLd from '@/features/product-detail/json-ld-schema'
import type { ProductDetailResponse } from '@/features/product-detail/types'
import { cookies, headers } from 'next/headers'
import { revalidate } from '@/utils'
import { SITE_URL } from '@/utils/site-url'
import { liveProductRobots, UNAVAILABLE_PAGE_ROBOTS } from '@/utils/seo-robots'

interface PageProps {
  params: Promise<{
    categorySlug: string
    subCategorySlug: string
    'product-detail-page': string
  }>
}

async function fetchProduct(slug: string, locale: string, withAuth: boolean, countryCode: string) {
  return makeApiCallSSR<{ data: ProductDetailResponse }>(
    apiUrls.PRODUCT_DETAIL(slug),
    { lang: locale },
    { revalidate: revalidate, withAuth, countryCode },
  )
}
async function fetchSimilarProductsForGuestUser(slug: string, locale: string, withAuth: boolean, countryCode: string) {
  return makeApiCallSSR<{ data: any[] }>(
    apiUrls.SIMILAR_PRODUCTS_FOR_GUEST_USERS(slug),
    { lang: locale },
    { revalidate: revalidate, withAuth, countryCode },
  )
}
async function fetchAlternateProducts(slug: string, locale: string, withAuth: boolean, countryCode: string) {
  return makeApiCallSSR<{ data: any[] }>(
    apiUrls.ALTERNATE_PRODUCTS_FOR_AUTHENTIC_USERS(slug),
    { lang: locale },
    { revalidate: revalidate, withAuth, countryCode },
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

  const [cookieStore, reqHeaders] = await Promise.all([cookies(), headers()])
  const countryCode =
    reqHeaders.get('x-country-code') ??
    cookieStore.get('hc_cc')?.value ??
    'US'

  const res = await fetchProduct(productSlug, locale, false, countryCode)
  const product = res?.data
  if (!product) {
    return { title: productSlug, robots: UNAVAILABLE_PAGE_ROBOTS }
  }

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
    // robots: liveProductRobots(),
    robots: {index: true, follow: true} ,
    alternates: {
      canonical: `${SITE_URL}/${categorySlug}/${subCategorySlug}/${productSlug}`,
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: `${SITE_URL}${product.url}`,
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
  const [cookieStore, reqHeaders] = await Promise.all([cookies(), headers()]);
  const isLoggedIn  = !!cookieStore.get("token")?.value;
  const countryCode =
    reqHeaders.get('x-country-code') ??
    cookieStore.get('hc_cc')?.value ??
    'US'
  const locale = await getLocale()

  const [productData, similarProductsGuest, alternateProducts] = await Promise.all([
    fetchProduct(productSlug, locale, isLoggedIn, countryCode),
    fetchSimilarProductsForGuestUser(productSlug, locale, isLoggedIn, countryCode),
    fetchAlternateProducts(productSlug, locale, isLoggedIn, countryCode),
  ])

  if (!productData?.data) notFound()

  // If category/subcategory in the URL don't match the product's canonical path,
  // redirect to product.data.url instead of 404ing a product that exists.
  // Product URL format: /categorySlug/subCategorySlug/productSlug
  const productUrl = productData.data.url ?? ""
  const urlParts = productUrl.replace(/^\//, "").split("/")
  const expectedCategory = urlParts[0]
  const expectedSubCategory = urlParts[1]

  if (
    expectedCategory &&
    expectedSubCategory &&
    (categorySlug !== expectedCategory || subCategorySlug !== expectedSubCategory)
  ) {
    const requestedUrl = `/${categorySlug}/${subCategorySlug}/${productSlug}`
    const canonicalUrl = productUrl.startsWith("/") ? productUrl : `/${productUrl}`
    console.warn("[product-pdp] category path mismatch — redirecting", {
      requestedUrl,
      canonicalUrl,
      productSlug,
    })
    redirect(canonicalUrl)
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
