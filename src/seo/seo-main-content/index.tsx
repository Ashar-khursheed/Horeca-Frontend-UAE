import { slugToTitle } from "@/utils";

interface SEOMainContentProps {
  APIDATA?: { title?: string; description?: string };
  categorySlug?: string;
  sectionTitle?: string;
  htmlContent?: string;
}

const SEOMainContent = ({
  APIDATA,
  categorySlug,
  sectionTitle,
  htmlContent,
}: SEOMainContentProps) => {
  return (
    <div className="md:py-12 md:pb-12 md:pt-6 pt-6 bg-white">
      <div className="global-container mx-auto rounded-[7px] bg-[#f8f8f7] py-5 px-4">

        {/* Category / page heading (h1) */}
        {categorySlug && (
          <h1 className="heading-font-size font-extrabold text-[#186737] mb-3 leading-tight text-center">
            {slugToTitle(categorySlug)}
          </h1>
        )}

        {/* Sub-title (h2) */}
        {(APIDATA?.title ?? sectionTitle) && (
          <h2 className="text-[12px] md:text-[15px] font-bold text-gray-900 mb-3 leading-tight text-center">
            {APIDATA?.title ?? sectionTitle}
          </h2>
        )}

        {/* Plain-text description (category pages) */}
        {APIDATA?.description && (
          <p className="text-[10px] md:text-[14px] text-black leading-relaxed md:block hidden text-center">
            {APIDATA.description}
          </p>
        )}

        {/* Rich HTML content (policy pages) */}
        {htmlContent && (
          <div
            className="policy-prose mt-3"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </div>
    </div>
  );
};

export default SEOMainContent;
