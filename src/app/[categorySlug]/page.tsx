import CategoriesPage from '@/features/category'
import { makeApiCallSSR } from '@/apis/ssr-fetch'
import { apiUrls } from '@/apis/api-endpoint'
import type { ApiCategory } from '@/utils/types'

const page = async ({ params }: { params: Promise<{ categorySlug: string }> }) => {
  const { categorySlug } = await params

  const res = await makeApiCallSSR<{ success: boolean; data: ApiCategory[] }>(
    apiUrls.NavigationAPI,
    { slug: categorySlug, with_parent: false },
    { revalidate: 3600 },
  )

  const categories = res?.data ?? []

  return (
    <div>
      <CategoriesPage categories={categories} categorySlug={categorySlug} />
    </div>
  )
}

export default page
