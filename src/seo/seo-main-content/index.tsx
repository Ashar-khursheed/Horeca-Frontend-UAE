import { slugToTitle } from "@/utils";

const SEOMainContent = ({ APIDATA, categorySlug }: { APIDATA: any; categorySlug: string }) => {
  return (
    <>
      <div className="  md:py-12 md:pb-12 md:pt-0 pt-6  bg-white">
        <div className=" global-container mx-auto rounded-[7px] text-center bg-[#f8f8f7] py-5 px-4">
          {/* Main Heading */}
          <h1 className="heading-font-size font-extrabold text-[#186737] mb-3 leading-tight">
           {slugToTitle(categorySlug)}
          </h1>

          {/* Subheading */}
          <h2 className="text-[12px]  md:text-[15px] font-bold text-gray-900 mb-3 leading-tight">
          {APIDATA?.title }
          </h2>

          {/* Description */}
          <p className="text-[10px] md:text-[14px] text-black leading-relaxed md:block hidden">
            {APIDATA?.description}
         
          </p>
        </div>
      </div>
    </>
  );
};

export default SEOMainContent;
