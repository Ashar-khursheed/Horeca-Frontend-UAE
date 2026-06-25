import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

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
      canonical: `${process.env.NEXT_SITE_URL}/${categorySlug}/${subCategorySlug}/${productSlug}`,
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: `${process.env.NEXT_SITE_URL}${product.url}`,
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

  if (!productData?.data) notFound()

  // Validate that categorySlug and subCategorySlug match the product's actual URL
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
    notFound()
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
