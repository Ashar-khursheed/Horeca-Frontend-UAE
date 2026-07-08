import { unstable_cache } from "next/cache";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";

export const getCategoryData = unstable_cache(

async (slug:string)=>{

return makeApiCallSSR(
apiUrls.INNER_CATEGORY_PAGES_WITH_FILTER,
{},
{
method:"POST",
body:{
category_url:slug
}
}
);

},

["category-data"],

{

revalidate:3600

}

);