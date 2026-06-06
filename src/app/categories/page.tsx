import AllCategoriesPage from "@/features/all-categories";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";
import type { ApiCategory } from "@/utils/types";
import { revalidate } from "@/utils";

const page = async () => {
  const res = await makeApiCallSSR<{ success: boolean; data: ApiCategory[] }>(
    apiUrls.NavigationAPI,
    { with_parent: true },
    { revalidate: revalidate },
  );

  const categories = res?.data ?? [];

  return <AllCategoriesPage categories={categories} />;
};

export default page;
