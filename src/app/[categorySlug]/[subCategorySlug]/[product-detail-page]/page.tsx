import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'

import { apiUrls } from '@/apis/api-endpoint'
import { makeApiCallSSR } from '@/apis/ssr-fetch'
import ProductDetailPage from '@/features/product-detail'
import ProductJsonLd from '@/features/product-detail/json-ld-schema'
import type { ProductDetailResponse } from '@/features/product-detail/types'

interface PageProps {
  params: Promise<{
    categorySlug: string
    subCategorySlug: string
    'product-detail-page': string
  }>
}

async function fetchProduct(slug: string, locale: string) {
  return makeApiCallSSR<{ data: ProductDetailResponse }>(
    apiUrls.PRODUCT_DETAIL(slug),
    { lang: locale },
    { revalidate: 3600 },
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { 'product-detail-page': productSlug, categorySlug, subCategorySlug } = await params
  const locale = await getLocale()

  const res = await fetchProduct(productSlug, locale)
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
  const locale = await getLocale()

  const productData = await fetchProduct(productSlug, locale)

  if (!productData?.data) {
    return <div>Product not found</div>
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
      />
    </>
  )
}
