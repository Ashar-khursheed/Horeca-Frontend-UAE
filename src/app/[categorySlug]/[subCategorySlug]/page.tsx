import SubCategoryPage from '@/features/category/sub-category'
import { makeApiCallSSR } from '@/apis/ssr-fetch'
import { apiUrls } from '@/apis/api-endpoint'
import { ApiCategory } from '@/utils/types'

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string; subCategorySlug: string }>
  searchParams: Promise<{ parent?: string }>
}) => {
  const { categorySlug, subCategorySlug } = await params
  const { parent } = await searchParams

  const res = await makeApiCallSSR<{ success: boolean; data: ApiCategory[] }>(
    apiUrls.NavigationAPI,
    { slug: subCategorySlug },
    { revalidate: 3600 },
  )

  const subCategories = res?.data ?? []

  return (
    <div>
      <SubCategoryPage
        subCategories={subCategories}
        categorySlug={categorySlug}
        subCategorySlug={subCategorySlug}
        parentSlug={parent}
      />
    </div>
  )
}

export default page
