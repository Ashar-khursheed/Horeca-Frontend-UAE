import { cache } from "react";
import { makeApiCallSSR } from "@/apis/ssr-fetch";
import { apiUrls } from "@/apis/api-endpoint";

export const getGlobalData = cache(async () => {

    const [nav, search, scripts] =
    await Promise.all([

        makeApiCallSSR(apiUrls.NavigationAPI),

        makeApiCallSSR(apiUrls.SEARCH),

        makeApiCallSSR(apiUrls.CUSTOM_SCRIPTS),

    ]);

    return {

        nav,
        search,
        scripts

    };

});