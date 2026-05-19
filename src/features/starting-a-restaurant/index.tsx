

"use client";




import { useRef, useState } from "react";
// import BGIMG from "@/assets/marketing-images/restuarant//BGIMG.svg";
import BGIMG from "@/assets/marketing-images/restuarant/BGIMG.svg";
import leftImg from "@/assets/marketing-images/restuarant/chef-image-with-landing-page 2.svg";
import checfimg from "@/assets/marketing-images/restuarant/chef.svg";
import customer from "@/assets/marketing-images/restuarant/customer-avatar.svg fill.svg";
import img4 from "@/assets/marketing-images/restuarant/Group 1171276731.svg";
import mobileCard from "@/assets/marketing-images/restuarant/mobilecard.svg";
import trustedClient from "@/assets/marketing-images/restuarant/trustedclient.svg";
import uerimg from "@/assets/marketing-images/restuarant/user1.svg";
import uerimg2 from "@/assets/marketing-images/restuarant/user2.svg";
import uerimg3 from "@/assets/marketing-images/restuarant/user3.svg";

// import ReCAPTCHA from "react-google-recaptcha";
// import BGImageNew from "@/assets/marketing-images/restuarant//BG.svg";
import BGImageNew from "@/assets/marketing-images/restuarant/newimgAd.svg";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";





function RestaurantADS() {
  type FAQItem = {
    question: string;
    answer: string;
  };

  type SliderControl = Slider;

  type RecaptchaControl = {
    executeAsync?: () => Promise<string>;
    reset?: () => void;
  };

  type SliderSettings = {
    dots: boolean;
    infinite: boolean;
    speed: number;
    slidesToShow: number;
    slidesToScroll: number;
    autoplay: boolean;
    arrows: boolean;
    beforeChange: (oldIndex: number, newIndex: number) => void;
  };

  const sliderRef = useRef<SliderControl | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const FAQSpecification: FAQItem[] = [
    {
      question: "I’m opening my first restaurant… where do I even start?",
      answer:
        "We know it feels overwhelming. That’s exactly why HorecaStore exists. From kitchen layout design to your very first delivery of supplies, we walk with you step by step so nothing falls through the cracks.",
    },
    {
      question: "Do I need multiple suppliers for everything?",
      answer:
        "Not anymore. With HorecaStore, you get one trusted partner for equipment, OS&E, and F&B. One platform. One invoice. One team that understands how a restaurant comes to life.",
    },
    {
      question: "What if I don’t know what equipment I actually need?",
      answer:
        "That’s where our experts step in. We’ll map your menu, space, and budget and recommend only what fits your concept. No unnecessary upselling. Just the essentials to make your kitchen work from day one.",
    },
    {
      question: "How do I know I’m getting the right prices?",
      answer:
        "With HorecaStore, what you see is what you pay. Transparent, competitive pricing, no hidden markups, no inflated quotes. And to give you peace of mind, we back it with a 120-day Price Match Guarantee. If you find the same item at a lower price within 120 days of your purchase, we’ll refund you the difference. Because your trust matters more to us than a single sale.",
    },
    {
      question: "Do you offer Credit? Opening a restaurant is expensive.",
      answer:
        "Absolutely. We offer 0% installment plans for up to 60 months, so you can spread costs while keeping cash free for marketing, staff, and growth. Your dream shouldn’t wait on your budget. Terms and Conditions apply.",
    },
    {
      question: "Can I trust the quality of your products?",
      answer:
        "We’ve helped open 5,000+ kitchens across the Middle East and the US. From family cafés to global hotel brands, every product we deliver meets international hospitality standards — built to last, built to perform.",
    },
    {
      question: "What if something goes wrong after I buy?",
      answer:
        "You’re never left alone. Our Customer Success team is available 24/7, and every major brand comes with strong warranties even up to 7 years with some brands. We make sure problems get solved, not ignored.",
    },
    {
      question: "Do you handle supplier coordination for me?",
      answer:
        "Yes. We talk to the vendors, manage the purchase orders, and follow up with couriers. That means less phone calls, fewer headaches, and more time for you to focus on your menu and your guests.",
    },
    {
      question: "Can you help me with my restaurant layout before I order?",
      answer:
        "Of course. Our experts design your kitchen for free around your workflow , not the other way around. We make sure your space works perfectly for your concept, your team, and your guests.",
    },
    {
      question: "Why should I choose HorecaStore over other suppliers?",
      answer:
        "Because we don’t just sell products. We build partnerships. While others chase the cheapest shortcuts, we stay true to quality, service, and your long-term success.",
    },
    {
      question: "What if I’m not ready to commit yet?",
      answer:
        "No pressure. You can browse, compare, and ask us questions or request a 100% Free Estimate. When the time is right, we’ll be ready. Your trust means more to us than any single order.",
    },
    {
      question: "What’s your promise to me as a first-time restaurant owner?",
      answer:
        "That's when you turn the key on opening day, you’ll feel prepared, supported, and confident. Because before you serve your first guest, we’ll serve you.",
    },
  ];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loader, setLoading] = useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);
  const [termsError, setTermsError] = useState<boolean>(false);
  const recaptchaRef = useRef<RecaptchaControl | null>(null);
  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  // Get URL parameters
  const urlParams: URLSearchParams = new URLSearchParams(window.location.search);

  // Extract utm_source value only
  const utmSource: string | null = urlParams.get("utm_source");

  const settings: SliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    beforeChange: (oldIndex: number, newIndex: number) => {
      setCurrentSlide(newIndex);
    },
  };


 

  const handlePrevious = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };
 

  return (
    <>
   
      <div
        className="2xl:py-5 lg:py-4 md:pt-10  py-8  bg-no-repeat bg-center bg-cover relative"
        style={{ backgroundImage: `url(${BGIMG.src})` }}
      >
        <div className="global-container">
            <Slider {...settings} ref={sliderRef}>
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center justify-between h-full">
                <div className="lg:text-left text-center">
                  {/* <h5 className="text-[#186737] text-sm md:text-base font-bold">
                Restaurant Pre-Opening Made Simple
              </h5> */}
                  <span className="text-2xl md:text-3xl 2xl:text-5xl text-[#313435] font-extrabold md:mt-4 mt-2">
                    {/* Where Restaurant Dreams <span className="lg:block ">Begin</span> */}
                    Buy Now Pay in 60 Months
                  </span>
                  {/* <p className="text-base text-[#676767] my-5 lg:block hidden">
                We design, plan, and equip your restaurant with care — so your{" "}
                <span className="block">
                  dream opens smoothly, on time, and ready to thrive.
                </span>
              </p>
              <p className="text-base text-[#676767] my-5 lg:hidden block">
                We design, plan, and equip your restaurant with care — so your{" "}
                <span className="s">
                  dream opens smoothly, on time, and ready to thrive.
                </span>
              </p> */}

                  <ul>
                    <li>
                      <p className="text-base text-[#676767] my-5 flex gap-3 items-center">
                        <svg
                          width="18"
                          height="13"
                          viewBox="0 0 18 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.125 0.375C16.625 -0.125 15.875 -0.125 15.375 0.375L6 9.75L2.125 5.875C1.625 5.375 0.875 5.375 0.375 5.875C-0.125 6.375 -0.125 7.125 0.375 7.625L5.125 12.375C5.375 12.625 5.625 12.75 6 12.75C6.375 12.75 6.625 12.625 6.875 12.375L17.125 2.125C17.625 1.625 17.625 0.875 17.125 0.375Z"
                            fill="#186737"
                          />
                        </svg>
                        Approval in 30 seconds
                      </p>
                    </li>
                    <li>
                      <p className="text-base text-[#676767] my-5 flex gap-3 items-center">
                        <svg
                          width="18"
                          height="13"
                          viewBox="0 0 18 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.125 0.375C16.625 -0.125 15.875 -0.125 15.375 0.375L6 9.75L2.125 5.875C1.625 5.375 0.875 5.375 0.375 5.875C-0.125 6.375 -0.125 7.125 0.375 7.625L5.125 12.375C5.375 12.625 5.625 12.75 6 12.75C6.375 12.75 6.625 12.625 6.875 12.375L17.125 2.125C17.625 1.625 17.625 0.875 17.125 0.375Z"
                            fill="#186737"
                          />
                        </svg>
                        From $1500 - $200K, 60 Months
                      </p>
                    </li>
                    <li>
                      <p className="text-base text-[#676767] my-5 flex gap-3 items-center">
                        <svg
                          width="18"
                          height="13"
                          viewBox="0 0 18 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.125 0.375C16.625 -0.125 15.875 -0.125 15.375 0.375L6 9.75L2.125 5.875C1.625 5.375 0.875 5.375 0.375 5.875C-0.125 6.375 -0.125 7.125 0.375 7.625L5.125 12.375C5.375 12.625 5.625 12.75 6 12.75C6.375 12.75 6.625 12.625 6.875 12.375L17.125 2.125C17.625 1.625 17.625 0.875 17.125 0.375Z"
                            fill="#186737"
                          />
                        </svg>
                        0% Interest for 6 Months
                      </p>
                    </li>
                    <li>
                      <p className="text-base text-[#676767] my-5 flex gap-3 items-center">
                        <svg
                          width="18"
                          height="13"
                          viewBox="0 0 18 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.125 0.375C16.625 -0.125 15.875 -0.125 15.375 0.375L6 9.75L2.125 5.875C1.625 5.375 0.875 5.375 0.375 5.875C-0.125 6.375 -0.125 7.125 0.375 7.625L5.125 12.375C5.375 12.625 5.625 12.75 6 12.75C6.375 12.75 6.625 12.625 6.875 12.375L17.125 2.125C17.625 1.625 17.625 0.875 17.125 0.375Z"
                            fill="#186737"
                          />
                        </svg>
                        Interest as low as 0.99%
                      </p>
                    </li>
                    <li>
                      <p className="text-base text-[#676767] my-5 flex gap-3 items-center">
                        <svg
                          width="18"
                          height="13"
                          viewBox="0 0 18 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.125 0.375C16.625 -0.125 15.875 -0.125 15.375 0.375L6 9.75L2.125 5.875C1.625 5.375 0.875 5.375 0.375 5.875C-0.125 6.375 -0.125 7.125 0.375 7.625L5.125 12.375C5.375 12.625 5.625 12.75 6 12.75C6.375 12.75 6.625 12.625 6.875 12.375L17.125 2.125C17.625 1.625 17.625 0.875 17.125 0.375Z"
                            fill="#186737"
                          />
                        </svg>
                        Zero Restocking Fee
                      </p>
                    </li>
                  </ul>
                  <a href="#contactForm">
                    <button className=" bg-[#186737] text-white font-semibold rounded text-base h-[50px] 2xl:h-[55px] w-[191px] mb-5">
                      Get Started Today
                    </button>
                  </a>
                  {/* <p className="text-base text-[#676767] mb-5">
                From first-time cafés to global brands.
              </p> */}
                  <div className="flex gap-3 items-center md:justify-center lg:justify-start">
                    <Image src={customer} alt="" className="lg:w-fit w-[200px]" />
                    <p className="lg:text-base mg:text-center text-left text-sm text-[#676767]">
                      Trusted by 5,000+ restaurants{" "}
                      <span className="md:block inline">
                        and hotels worldwide
                      </span>
                    </p>
                  </div>
                </div>
                <div className=" justify-center lg:justify-end hidden md:flex">
                  <Image
                    src={BGImageNew}
                    alt=""
                    className=" w-[500px] 2xl:w-[750px]"
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center justify-between h-full">
                <div className="lg:text-left text-center">
                  <h5 className="text-[#186737] text-sm md:text-base font-bold">
                    Restaurant Pre-Opening Made Simple
                  </h5>
                  <h1 className="text-2xl md:text-3xl 2xl:text-5xl text-[#313435] font-extrabold md:mt-4 mt-2">
                    Where Restaurant Dreams{" "}
                    <span className="lg:block ">Begin</span>
                  </h1>
                  <p className="text-base text-[#676767] my-5 lg:block hidden">
                    We design, plan, and equip your restaurant with care — so
                    your{" "}
                    <span className="block">
                      dream opens smoothly, on time, and ready to thrive.
                    </span>
                  </p>
                  <p className="text-base text-[#676767] my-5 lg:hidden block">
                    We design, plan, and equip your restaurant with care — so
                    your{" "}
                    <span className="s">
                      dream opens smoothly, on time, and ready to thrive.
                    </span>
                  </p>
                  <a href="#contactForm">
                    <button className=" bg-[#186737] text-white font-semibold rounded text-base h-[50px] 2xl:h-[55px] w-[191px] mb-5">
                      Get Started Today
                    </button>
                  </a>
                  <p className="text-base text-[#676767] mb-5">
                    From first-time cafés to global brands.
                  </p>
                  <div className="flex gap-3 items-center md:justify-center lg:justify-start">
                    <Image src={customer} alt="" className="lg:w-fit w-[200px]" />
                    <p className="lg:text-base mg:text-center text-left text-sm text-[#676767]">
                      Trusted by 5,000+ restaurants{" "}
                      <span className="md:block inline">
                        and hotels worldwide
                      </span>
                    </p>
                  </div>
                </div>
                <div className=" justify-center lg:justify-end hidden md:flex">
                  <Image
                    src={leftImg}
                    alt=""
                    className=" w-[500px] 2xl:w-[750px]"
                  />
                </div>
              </div>
            </div>
          </Slider>
        </div>
        <div className="absolute top-1/2  left-0 right-0 gap-4 flex justify-end 2xl:bottom-[-304px] md:bottom-[-200px] items-center px-4 pointer-events-none z-10">
          <button
            onClick={handlePrevious}
            className="pointer-events-auto p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:scale-110 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="text-[#186737] w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="pointer-events-auto p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:scale-110 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="text-[#186737] w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="w-full py-12 text-center">
       <div className="global-container">
          <div className="grid grid-cols-1 gap-4 items-center justify-center h-full mt-4">
            <h2 className="md:text-3xl text-2xl text-[#313435]">
              From Local Cafés to Global Hotels{" "}
              <span className="lg:inline-block md:block">
                They All Started Here.
              </span>
            </h2>
            <p className="text-base text-[#676767] ">
              From first-time cafés to international hotel chains, we’ve helped
              over 5,000 hospitality businesses
              <span className="lg:block md:inline-block">
                bring their kitchens to life across 11 countries and counting
              </span>
            </p>

            <div className="flex justify-center mt-5">
              <Image src={trustedClient} alt="" />
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#E2E8F0] mt-3"></div>
        </div>
      </div>

      <div className="w-full py-10 hidden lg:block md:hidden sm:hidden xs:hidden">
        <div className="global-container">
          <div className="grid lg:grid-cols-2 md:grid-cols-1  gap-9 items-center  h-full mt-">
            <div className="flexs justify-center mt-2">
              {/* <Image src={whatishoreca} alt="" className="w-full" /> */}
              <div
                className="relative cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                // onClick={openModal}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-auto"
                >
                  {/* <source src={VideoNomanSir} type="video/mp4" /> */}
                  <source
                    src={
                      "https://d1p9kdrbe10xzz.cloudfront.net/production/IMG_6060.MP4"
                    }
                    type="video/mp4"
                  />
                  <source
                    src={
                      "https://d1p9kdrbe10xzz.cloudfront.net/production/IMG_6060.MP4"
                    }
                    type="video/ogg"
                  />
                  VIDEO noman sir
                </video>

                {/* Play Overlay */}
                {/* <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all duration-300">
          <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-300 hover:scale-110">
            <svg 
              className="w-8 h-8 text-gray-800 ml-1" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div> */}
              </div>
            </div>

            <div className="">
              <div className=" text-[#676767] text-base space-y-4 max-w-3xls">
                <h2 className="text-3xl text-[#313435]">
                  What is HorecaStore? 
                </h2>
                <p>
                  {" "}
                  We know that opening a restaurant isn’t just about buying
                  equipment. It’s{" "}
                  <span className="block">
                    about building a dream. We know the weight you carry, the
                    late nights, the{" "}
                  </span>
                  <span className="block">
                    money risk, the heart you pour in.
                  </span>
                </p>
                <p>
                  That’s why HorecaStore was built: to shoulder part of that
                  burden with you.{" "}
                  <span className="block">
                    {" "}
                    We design, plan, and equip as if we were building our own
                    kitchen. With
                  </span>{" "}
                  <span className="block">
                    nearly a decade of experience and over 5,000 kitchens
                    opened, we
                  </span>{" "}
                  <span className="block">
                    eliminate the chaos of dealing with dozens of vendors by
                    being your single,
                  </span>{" "}
                  <span className="block">trusted partner.</span>
                </p>
                <p>
                  Because when your doors open, it’s not just business, it’s
                  your life’s work.{" "}
                  <span className="block">
                    And we’ll make sure nothing stands in the way of it.
                  </span>
                </p>
                <a href="#contactForm">
                  <button className=" bg-[#186737] text-white font-semibold rounded-md text-base h-[55px] w-[284px] mb-5 mt-5">
                    Book Your Free Consultation
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full py-10 lg:hidden md:block sm:block xs:hidden">
        <div className="global-container">
          <div className="grid lg:grid-cols-2 md:grid-cols-1  gap-9 items-center  h-full mt-">
            <div className="text-center">
              <div className=" text-[#676767] text-base space-y-4">
                <h2 className="text-2xl md:text-3xl text-[#313435]">
                  What is HorecaStore? 
                </h2>
                <p>
                  {" "}
                  We know that opening a restaurant isn’t just about buying
                  equipment. It’s{" "}
                  <span className="md:block inline">
                    about building a dream. We know the weight you carry, the
                    late nights, the{" "}
                  </span>
                  <span className="block">
                    money risk, the heart you pour in.
                  </span>
                </p>
                <p>
                  That’s why HorecaStore was built: to shoulder part of that
                  burden with you.{" "}
                  <span className="md:block inline">
                    {" "}
                    We design, plan, and equip as if we were building our own
                    kitchen. With
                  </span>{" "}
                  <span className="md:block inline">
                    nearly a decade of experience and over 5,000 kitchens
                    opened, we
                  </span>{" "}
                  <span className="md:block inline">
                    eliminate the chaos of dealing with dozens of vendors by
                    being your single,
                  </span>{" "}
                  <span className="md:block inline">trusted partner.</span>
                </p>
                <p>
                  Because when your doors open, it’s not just business, it’s
                  your life’s work.{" "}
                  <span className="md:block inline">
                    And we’ll make sure nothing stands in the way of it.
                  </span>
                </p>
                <button className=" bg-[#186737] text-white font-semibold rounded-md text-base h-[55px] w-[284px] mb-5 mt-5">
                  Book Your Free Consultation
                </button>
              </div>
            </div>
            <div className="flexs justify-center mt-2">
              <video
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-auto"
              >
                {/* <source src={VideoNomanSir} type="video/mp4" /> */}
                <source
                  src={
                    "https://d1p9kdrbe10xzz.cloudfront.net/production/IMG_6060.MP4"
                  }
                  type="video/mp4"
                />
                <source
                  src={
                    "https://d1p9kdrbe10xzz.cloudfront.net/production/IMG_6060.MP4"
                  }
                  type="video/ogg"
                />
                VIDEO noman sir
              </video>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full py-12 md:pb-4 lg:pb-0 text-center">
        <div className="global-container">
          <div className="grid grid-cols-1 gap-4 items-center justify-center h-full mt-4">
            <h2 className="md:text-3xl text-xl text-[#313435]">
              From Empty Space to a Ready Kitchen — All in One Place
            </h2>
            <p className="text-base text-[#676767] ">
              We don’t just deliver equipment — we walk with you from the very
              first idea until your doors open.
            </p>

            <div className=" justify-center mt-5 lg:flex hidden">
              <Image src={checfimg} alt="" />
            </div>
            <div className=" justify-center mt-5  lg:hidden md:flex hidden ">
              <Image src={img4} alt="" />
            </div>
            <div className=" justify-center mt-5  lg:hidden md:hidden flex">
              <Image src={mobileCard} alt="" className="w-full" />
            </div>
          </div>
        </div >
      </div>

      <div className="w-full py-12  bg-[#DEF9EC]">
        <div className="global-container">
          <div className="grid grid-cols-1 gap-4 items-center justify-center h-full mt-4">
            <h2 className="md:text-3xl text-2xl text-[#313435] text-center">
              Stories From the Chefs We’ve Walked Beside
            </h2>
            <p className="text-base text-[#676767] text-center">
              Every chef, every owner — each carried a dream. We had the honor
              to help. Here’s what they shared.
            </p>
          </div>
          {/* Only laptop and desktop */}
          <div className="lg:block md:hidden sm:hidden hidden xs:hidden">
            <div className="grid grid-cols-3   gap-7 2xl:gap-0 items-center justify-center h-full mt-8">
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md ml-auto">
                <svg
                  width="118"
                  height="18"
                  viewBox="0 0 118 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.10314 1.55665L6.06251 5.69415L1.49689 6.35977C0.67814 6.47852 0.350015 7.4879 0.943765 8.06602L4.24689 11.2848L3.46564 15.8316C3.32501 16.6535 4.19064 17.2691 4.91564 16.8848L9.00002 14.7379L13.0844 16.8848C13.8094 17.266 14.675 16.6535 14.5344 15.8316L13.7531 11.2848L17.0563 8.06602C17.65 7.4879 17.3219 6.47852 16.5031 6.35977L11.9375 5.69415L9.89689 1.55665C9.53127 0.819146 8.47189 0.809771 8.10314 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M33.1031 1.55665L31.0625 5.69415L26.4969 6.35977C25.6781 6.47852 25.35 7.4879 25.9438 8.06602L29.2469 11.2848L28.4656 15.8316C28.325 16.6535 29.1906 17.2691 29.9156 16.8848L34 14.7379L38.0844 16.8848C38.8094 17.266 39.675 16.6535 39.5344 15.8316L38.7531 11.2848L42.0563 8.06602C42.65 7.4879 42.3219 6.47852 41.5031 6.35977L36.9375 5.69415L34.8969 1.55665C34.5313 0.819146 33.4719 0.809771 33.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M58.1031 1.55665L56.0625 5.69415L51.4969 6.35977C50.6781 6.47852 50.35 7.4879 50.9438 8.06602L54.2469 11.2848L53.4656 15.8316C53.325 16.6535 54.1906 17.2691 54.9156 16.8848L59 14.7379L63.0844 16.8848C63.8094 17.266 64.675 16.6535 64.5344 15.8316L63.7531 11.2848L67.0563 8.06602C67.65 7.4879 67.3219 6.47852 66.5031 6.35977L61.9375 5.69415L59.8969 1.55665C59.5313 0.819146 58.4719 0.809771 58.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M83.1031 1.55665L81.0625 5.69415L76.4969 6.35977C75.6781 6.47852 75.35 7.4879 75.9438 8.06602L79.2469 11.2848L78.4656 15.8316C78.325 16.6535 79.1906 17.2691 79.9156 16.8848L84 14.7379L88.0844 16.8848C88.8094 17.266 89.675 16.6535 89.5344 15.8316L88.7531 11.2848L92.0563 8.06602C92.65 7.4879 92.3219 6.47852 91.5031 6.35977L86.9375 5.69415L84.8969 1.55665C84.5313 0.819146 83.4719 0.809771 83.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M117.078 6.16298L112.163 5.44735L109.966 1.00142C109.769 0.604141 109.384 0.40332 108.998 0.40332C108.616 0.40332 108.233 0.601455 108.035 1.00142L105.838 5.44701L100.922 6.16198C100.04 6.28959 99.6872 7.37396 100.326 7.99522L103.882 11.4542L103.041 16.3397C102.921 17.0375 103.478 17.5974 104.102 17.5974C104.268 17.5974 104.438 17.5581 104.602 17.4714L108.999 15.165L113.396 17.4721C113.56 17.5577 113.73 17.5967 113.894 17.5967C114.519 17.5967 115.077 17.0389 114.958 16.3407L114.117 11.4549L117.674 7.99657C118.313 7.3753 117.96 6.2906 117.078 6.16298ZM112.99 10.3003L112.382 10.892L112.525 11.7275L113.181 15.5374L109.751 13.7378L108.999 13.3435L109 2.6916L110.714 6.1603L111.09 6.92026L111.93 7.0425L115.766 7.60097L112.99 10.3003Z"
                    fill="#FFBF15"
                  />
                </svg>

                <h4 className="text-[#313435] text-base 2xl:text-lg font-bold">
                  They answered questions I didn’t even{" "}
                  <span className="block"> know to ask.</span>
                </h4>
                <p className="text-[#777777] text-sm 2xl:text-base">
                  I was opening my first café and honestly had no clue what
                  equipment I actually needed. HorecaStore didn’t rush me — they
                  broke it down in simple steps and stopped me from
                  overspending.
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <Image src={uerimg} alt="" />
                  <div>
                    <h6 className="text-[#313435] text-base 2xl:text-lg font-bold">
                      Rayna B.
                    </h6>
                    <p className="text-[#777777] text-sm">Café Owner</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto">
                <svg
                  width="118"
                  height="18"
                  viewBox="0 0 118 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.10314 1.55665L6.06251 5.69415L1.49689 6.35977C0.67814 6.47852 0.350015 7.4879 0.943765 8.06602L4.24689 11.2848L3.46564 15.8316C3.32501 16.6535 4.19064 17.2691 4.91564 16.8848L9.00002 14.7379L13.0844 16.8848C13.8094 17.266 14.675 16.6535 14.5344 15.8316L13.7531 11.2848L17.0563 8.06602C17.65 7.4879 17.3219 6.47852 16.5031 6.35977L11.9375 5.69415L9.89689 1.55665C9.53127 0.819146 8.47189 0.809771 8.10314 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M33.1031 1.55665L31.0625 5.69415L26.4969 6.35977C25.6781 6.47852 25.35 7.4879 25.9438 8.06602L29.2469 11.2848L28.4656 15.8316C28.325 16.6535 29.1906 17.2691 29.9156 16.8848L34 14.7379L38.0844 16.8848C38.8094 17.266 39.675 16.6535 39.5344 15.8316L38.7531 11.2848L42.0563 8.06602C42.65 7.4879 42.3219 6.47852 41.5031 6.35977L36.9375 5.69415L34.8969 1.55665C34.5313 0.819146 33.4719 0.809771 33.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M58.1031 1.55665L56.0625 5.69415L51.4969 6.35977C50.6781 6.47852 50.35 7.4879 50.9438 8.06602L54.2469 11.2848L53.4656 15.8316C53.325 16.6535 54.1906 17.2691 54.9156 16.8848L59 14.7379L63.0844 16.8848C63.8094 17.266 64.675 16.6535 64.5344 15.8316L63.7531 11.2848L67.0563 8.06602C67.65 7.4879 67.3219 6.47852 66.5031 6.35977L61.9375 5.69415L59.8969 1.55665C59.5313 0.819146 58.4719 0.809771 58.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M83.1031 1.55665L81.0625 5.69415L76.4969 6.35977C75.6781 6.47852 75.35 7.4879 75.9438 8.06602L79.2469 11.2848L78.4656 15.8316C78.325 16.6535 79.1906 17.2691 79.9156 16.8848L84 14.7379L88.0844 16.8848C88.8094 17.266 89.675 16.6535 89.5344 15.8316L88.7531 11.2848L92.0563 8.06602C92.65 7.4879 92.3219 6.47852 91.5031 6.35977L86.9375 5.69415L84.8969 1.55665C84.5313 0.819146 83.4719 0.809771 83.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                </svg>

                <h4 className="text-[#313435] text-base 2xl:text-lg font-bold">
                  Delivery took longer than I hoped, but they{" "}
                  <span className="block">kept me updated.</span>
                </h4>
                <p className="text-[#777777] text-sm 2xl:text-base">
                  I was nervous because my oven showed up a week later than
                  planned. But they kept me informed the whole time and made
                  sure I had a temporary workaround. In the end, it arrived in
                  perfect condition — and the support never dropped.
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <Image src={uerimg2} alt="" />
                  <div>
                    <h6>Cheyenne D.</h6>
                    <p className="text-[#777777] text-sm">Restaurant Owner</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md mr-auto">
                <svg
                  width="118"
                  height="18"
                  viewBox="0 0 118 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.10314 1.55665L6.06251 5.69415L1.49689 6.35977C0.67814 6.47852 0.350015 7.4879 0.943765 8.06602L4.24689 11.2848L3.46564 15.8316C3.32501 16.6535 4.19064 17.2691 4.91564 16.8848L9.00002 14.7379L13.0844 16.8848C13.8094 17.266 14.675 16.6535 14.5344 15.8316L13.7531 11.2848L17.0563 8.06602C17.65 7.4879 17.3219 6.47852 16.5031 6.35977L11.9375 5.69415L9.89689 1.55665C9.53127 0.819146 8.47189 0.809771 8.10314 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M33.1031 1.55665L31.0625 5.69415L26.4969 6.35977C25.6781 6.47852 25.35 7.4879 25.9438 8.06602L29.2469 11.2848L28.4656 15.8316C28.325 16.6535 29.1906 17.2691 29.9156 16.8848L34 14.7379L38.0844 16.8848C38.8094 17.266 39.675 16.6535 39.5344 15.8316L38.7531 11.2848L42.0563 8.06602C42.65 7.4879 42.3219 6.47852 41.5031 6.35977L36.9375 5.69415L34.8969 1.55665C34.5313 0.819146 33.4719 0.809771 33.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M58.1031 1.55665L56.0625 5.69415L51.4969 6.35977C50.6781 6.47852 50.35 7.4879 50.9438 8.06602L54.2469 11.2848L53.4656 15.8316C53.325 16.6535 54.1906 17.2691 54.9156 16.8848L59 14.7379L63.0844 16.8848C63.8094 17.266 64.675 16.6535 64.5344 15.8316L63.7531 11.2848L67.0563 8.06602C67.65 7.4879 67.3219 6.47852 66.5031 6.35977L61.9375 5.69415L59.8969 1.55665C59.5313 0.819146 58.4719 0.809771 58.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M83.1031 1.55665L81.0625 5.69415L76.4969 6.35977C75.6781 6.47852 75.35 7.4879 75.9438 8.06602L79.2469 11.2848L78.4656 15.8316C78.325 16.6535 79.1906 17.2691 79.9156 16.8848L84 14.7379L88.0844 16.8848C88.8094 17.266 89.675 16.6535 89.5344 15.8316L88.7531 11.2848L92.0563 8.06602C92.65 7.4879 92.3219 6.47852 91.5031 6.35977L86.9375 5.69415L84.8969 1.55665C84.5313 0.819146 83.4719 0.809771 83.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M117.078 6.16298L112.163 5.44735L109.966 1.00142C109.769 0.604141 109.384 0.40332 108.998 0.40332C108.616 0.40332 108.233 0.601455 108.035 1.00142L105.838 5.44701L100.922 6.16198C100.04 6.28959 99.6872 7.37396 100.326 7.99522L103.882 11.4542L103.041 16.3397C102.921 17.0375 103.478 17.5974 104.102 17.5974C104.268 17.5974 104.438 17.5581 104.602 17.4714L108.999 15.165L113.396 17.4721C113.56 17.5577 113.73 17.5967 113.894 17.5967C114.519 17.5967 115.077 17.0389 114.958 16.3407L114.117 11.4549L117.674 7.99657C118.313 7.3753 117.96 6.2906 117.078 6.16298ZM112.99 10.3003L112.382 10.892L112.525 11.7275L113.181 15.5374L109.751 13.7378L108.999 13.3435L109 2.6916L110.714 6.1603L111.09 6.92026L111.93 7.0425L115.766 7.60097L112.99 10.3003Z"
                    fill="#FFBF15"
                  />
                </svg>

                <h4 className="text-[#313435] text-base 2xl:text-lg font-bold">
                  They cared even after the sale.
                </h4>
                <p className="text-[#777777] text-sm 2xl:text-base">
                  One of the items I ordered didn’t fit the space the way I
                  expected. HorecaStore helped me swap it quickly and never made
                  me feel like I was a problem. That kind of after-care is
                  normal with Amazon — but rare in B2B.
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <Image src={uerimg3} alt="" />
                  <div>
                    <h6>Lindsey G</h6>
                    <p className="text-[#777777] text-sm">Hotel F&B Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab and mobile */}
          <div className="lg:hidden md:block ">
            <div className=" h-full mt-8 flex overflow-x-auto no-scrollbar space-x-5 pb-5">
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4 min-w-[320px] max-w-[400px] ">
                <svg
                  width="118"
                  height="18"
                  viewBox="0 0 118 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.10314 1.55665L6.06251 5.69415L1.49689 6.35977C0.67814 6.47852 0.350015 7.4879 0.943765 8.06602L4.24689 11.2848L3.46564 15.8316C3.32501 16.6535 4.19064 17.2691 4.91564 16.8848L9.00002 14.7379L13.0844 16.8848C13.8094 17.266 14.675 16.6535 14.5344 15.8316L13.7531 11.2848L17.0563 8.06602C17.65 7.4879 17.3219 6.47852 16.5031 6.35977L11.9375 5.69415L9.89689 1.55665C9.53127 0.819146 8.47189 0.809771 8.10314 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M33.1031 1.55665L31.0625 5.69415L26.4969 6.35977C25.6781 6.47852 25.35 7.4879 25.9438 8.06602L29.2469 11.2848L28.4656 15.8316C28.325 16.6535 29.1906 17.2691 29.9156 16.8848L34 14.7379L38.0844 16.8848C38.8094 17.266 39.675 16.6535 39.5344 15.8316L38.7531 11.2848L42.0563 8.06602C42.65 7.4879 42.3219 6.47852 41.5031 6.35977L36.9375 5.69415L34.8969 1.55665C34.5313 0.819146 33.4719 0.809771 33.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M58.1031 1.55665L56.0625 5.69415L51.4969 6.35977C50.6781 6.47852 50.35 7.4879 50.9438 8.06602L54.2469 11.2848L53.4656 15.8316C53.325 16.6535 54.1906 17.2691 54.9156 16.8848L59 14.7379L63.0844 16.8848C63.8094 17.266 64.675 16.6535 64.5344 15.8316L63.7531 11.2848L67.0563 8.06602C67.65 7.4879 67.3219 6.47852 66.5031 6.35977L61.9375 5.69415L59.8969 1.55665C59.5313 0.819146 58.4719 0.809771 58.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M83.1031 1.55665L81.0625 5.69415L76.4969 6.35977C75.6781 6.47852 75.35 7.4879 75.9438 8.06602L79.2469 11.2848L78.4656 15.8316C78.325 16.6535 79.1906 17.2691 79.9156 16.8848L84 14.7379L88.0844 16.8848C88.8094 17.266 89.675 16.6535 89.5344 15.8316L88.7531 11.2848L92.0563 8.06602C92.65 7.4879 92.3219 6.47852 91.5031 6.35977L86.9375 5.69415L84.8969 1.55665C84.5313 0.819146 83.4719 0.809771 83.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M117.078 6.16298L112.163 5.44735L109.966 1.00142C109.769 0.604141 109.384 0.40332 108.998 0.40332C108.616 0.40332 108.233 0.601455 108.035 1.00142L105.838 5.44701L100.922 6.16198C100.04 6.28959 99.6872 7.37396 100.326 7.99522L103.882 11.4542L103.041 16.3397C102.921 17.0375 103.478 17.5974 104.102 17.5974C104.268 17.5974 104.438 17.5581 104.602 17.4714L108.999 15.165L113.396 17.4721C113.56 17.5577 113.73 17.5967 113.894 17.5967C114.519 17.5967 115.077 17.0389 114.958 16.3407L114.117 11.4549L117.674 7.99657C118.313 7.3753 117.96 6.2906 117.078 6.16298ZM112.99 10.3003L112.382 10.892L112.525 11.7275L113.181 15.5374L109.751 13.7378L108.999 13.3435L109 2.6916L110.714 6.1603L111.09 6.92026L111.93 7.0425L115.766 7.60097L112.99 10.3003Z"
                    fill="#FFBF15"
                  />
                </svg>

                <h4 className="text-[#313435] text-base 2xl:text-lg font-bold">
                  They answered questions I didn’t even know to ask.
                </h4>
                <p className="text-[#777777] text-sm 2xl:text-base">
                  I was opening my first café and honestly had no clue what
                  equipment I actually needed. HorecaStore didn’t rush me — they
                  broke it down in simple steps and stopped me from
                  overspending.
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <Image src={uerimg} alt="" />
                  <div>
                    <h6 className="text-[#313435] text-base 2xl:text-lg font-bold">
                      Rayna B.
                    </h6>
                    <p className="text-[#777777] text-sm">Café Owner</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4  min-w-[320px] max-w-[400px]">
                <svg
                  width="118"
                  height="18"
                  viewBox="0 0 118 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.10314 1.55665L6.06251 5.69415L1.49689 6.35977C0.67814 6.47852 0.350015 7.4879 0.943765 8.06602L4.24689 11.2848L3.46564 15.8316C3.32501 16.6535 4.19064 17.2691 4.91564 16.8848L9.00002 14.7379L13.0844 16.8848C13.8094 17.266 14.675 16.6535 14.5344 15.8316L13.7531 11.2848L17.0563 8.06602C17.65 7.4879 17.3219 6.47852 16.5031 6.35977L11.9375 5.69415L9.89689 1.55665C9.53127 0.819146 8.47189 0.809771 8.10314 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M33.1031 1.55665L31.0625 5.69415L26.4969 6.35977C25.6781 6.47852 25.35 7.4879 25.9438 8.06602L29.2469 11.2848L28.4656 15.8316C28.325 16.6535 29.1906 17.2691 29.9156 16.8848L34 14.7379L38.0844 16.8848C38.8094 17.266 39.675 16.6535 39.5344 15.8316L38.7531 11.2848L42.0563 8.06602C42.65 7.4879 42.3219 6.47852 41.5031 6.35977L36.9375 5.69415L34.8969 1.55665C34.5313 0.819146 33.4719 0.809771 33.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M58.1031 1.55665L56.0625 5.69415L51.4969 6.35977C50.6781 6.47852 50.35 7.4879 50.9438 8.06602L54.2469 11.2848L53.4656 15.8316C53.325 16.6535 54.1906 17.2691 54.9156 16.8848L59 14.7379L63.0844 16.8848C63.8094 17.266 64.675 16.6535 64.5344 15.8316L63.7531 11.2848L67.0563 8.06602C67.65 7.4879 67.3219 6.47852 66.5031 6.35977L61.9375 5.69415L59.8969 1.55665C59.5313 0.819146 58.4719 0.809771 58.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M83.1031 1.55665L81.0625 5.69415L76.4969 6.35977C75.6781 6.47852 75.35 7.4879 75.9438 8.06602L79.2469 11.2848L78.4656 15.8316C78.325 16.6535 79.1906 17.2691 79.9156 16.8848L84 14.7379L88.0844 16.8848C88.8094 17.266 89.675 16.6535 89.5344 15.8316L88.7531 11.2848L92.0563 8.06602C92.65 7.4879 92.3219 6.47852 91.5031 6.35977L86.9375 5.69415L84.8969 1.55665C84.5313 0.819146 83.4719 0.809771 83.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                </svg>

                <h4 className="text-[#313435] text-base 2xl:text-lg font-bold">
                  Delivery took longer than I hoped, but they{" "}
                  <span className="blocsk">kept me updated.</span>
                </h4>
                <p className="text-[#777777] text-sm 2xl:text-base">
                  I was nervous because my oven showed up a week later than
                  planned. But they kept me informed the whole time and made
                  sure I had a temporary workaround. In the end, it arrived in
                  perfect condition — and the support never dropped.
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <Image src={uerimg2} alt="" />
                  <div>
                    <h6>Cheyenne D.</h6>
                    <p className="text-[#777777] text-sm">Restaurant Owner</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4  min-w-[320px] max-w-[400px] ">
                <svg
                  width="118"
                  height="18"
                  viewBox="0 0 118 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.10314 1.55665L6.06251 5.69415L1.49689 6.35977C0.67814 6.47852 0.350015 7.4879 0.943765 8.06602L4.24689 11.2848L3.46564 15.8316C3.32501 16.6535 4.19064 17.2691 4.91564 16.8848L9.00002 14.7379L13.0844 16.8848C13.8094 17.266 14.675 16.6535 14.5344 15.8316L13.7531 11.2848L17.0563 8.06602C17.65 7.4879 17.3219 6.47852 16.5031 6.35977L11.9375 5.69415L9.89689 1.55665C9.53127 0.819146 8.47189 0.809771 8.10314 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M33.1031 1.55665L31.0625 5.69415L26.4969 6.35977C25.6781 6.47852 25.35 7.4879 25.9438 8.06602L29.2469 11.2848L28.4656 15.8316C28.325 16.6535 29.1906 17.2691 29.9156 16.8848L34 14.7379L38.0844 16.8848C38.8094 17.266 39.675 16.6535 39.5344 15.8316L38.7531 11.2848L42.0563 8.06602C42.65 7.4879 42.3219 6.47852 41.5031 6.35977L36.9375 5.69415L34.8969 1.55665C34.5313 0.819146 33.4719 0.809771 33.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M58.1031 1.55665L56.0625 5.69415L51.4969 6.35977C50.6781 6.47852 50.35 7.4879 50.9438 8.06602L54.2469 11.2848L53.4656 15.8316C53.325 16.6535 54.1906 17.2691 54.9156 16.8848L59 14.7379L63.0844 16.8848C63.8094 17.266 64.675 16.6535 64.5344 15.8316L63.7531 11.2848L67.0563 8.06602C67.65 7.4879 67.3219 6.47852 66.5031 6.35977L61.9375 5.69415L59.8969 1.55665C59.5313 0.819146 58.4719 0.809771 58.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M83.1031 1.55665L81.0625 5.69415L76.4969 6.35977C75.6781 6.47852 75.35 7.4879 75.9438 8.06602L79.2469 11.2848L78.4656 15.8316C78.325 16.6535 79.1906 17.2691 79.9156 16.8848L84 14.7379L88.0844 16.8848C88.8094 17.266 89.675 16.6535 89.5344 15.8316L88.7531 11.2848L92.0563 8.06602C92.65 7.4879 92.3219 6.47852 91.5031 6.35977L86.9375 5.69415L84.8969 1.55665C84.5313 0.819146 83.4719 0.809771 83.1031 1.55665Z"
                    fill="#FFBF15"
                  />
                  <path
                    d="M117.078 6.16298L112.163 5.44735L109.966 1.00142C109.769 0.604141 109.384 0.40332 108.998 0.40332C108.616 0.40332 108.233 0.601455 108.035 1.00142L105.838 5.44701L100.922 6.16198C100.04 6.28959 99.6872 7.37396 100.326 7.99522L103.882 11.4542L103.041 16.3397C102.921 17.0375 103.478 17.5974 104.102 17.5974C104.268 17.5974 104.438 17.5581 104.602 17.4714L108.999 15.165L113.396 17.4721C113.56 17.5577 113.73 17.5967 113.894 17.5967C114.519 17.5967 115.077 17.0389 114.958 16.3407L114.117 11.4549L117.674 7.99657C118.313 7.3753 117.96 6.2906 117.078 6.16298ZM112.99 10.3003L112.382 10.892L112.525 11.7275L113.181 15.5374L109.751 13.7378L108.999 13.3435L109 2.6916L110.714 6.1603L111.09 6.92026L111.93 7.0425L115.766 7.60097L112.99 10.3003Z"
                    fill="#FFBF15"
                  />
                </svg>

                <h4 className="text-[#313435] text-base 2xl:text-lg font-bold">
                  They cared even after the sale.
                </h4>
                <p className="text-[#777777] text-sm 2xl:text-base">
                  One of the items I ordered didn’t fit the space the way I
                  expected. HorecaStore helped me swap it quickly and never made
                  me feel like I was a problem. That kind of after-care is
                  normal with Amazon — but rare in B2B.
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <Image src={uerimg3} alt="" />
                  <div>
                    <h6>Lindsey G</h6>
                    <p className="text-[#777777] text-sm">Hotel F&B Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-12 ">
        <div className="global-container">
          <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4 items-center justify-center h-full mt-4">
            <div className="lg:text-left text-center max-w-xl mx-auto">
              <h2 className="text-xl md:text-3xl text-black font-bold mb-3">
                Your Dream Deserves a Strong Start
              </h2>
              <p className="text-base text-[#676767] ">
                We know opening a restaurant is a big leap. That’s why our job
                is simple: to carry the details so you can focus on your dream.
                Share your idea with us and we’ll guide you every step of the
                way.
              </p>

              <ul className="mt-4 lg:block md:hidden hidden">
                <li className="my-2">
                  <p className="flex items-center gap-2 ">
                    <svg
                      width="16"
                      height="13"
                      viewBox="0 0 16 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 8.5C1 8.5 2.5 8.5 4.5 12C4.5 12 10.0588 2.83333 15 1"
                        stroke="#186737"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="text-sm text-[#676767] ">
                      Kitchens designed around your menu and your flow
                    </span>
                  </p>
                </li>
                <li className="my-2">
                  <p className="flex items-center gap-2 ">
                    <svg
                      width="16"
                      height="13"
                      viewBox="0 0 16 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 8.5C1 8.5 2.5 8.5 4.5 12C4.5 12 10.0588 2.83333 15 1"
                        stroke="#186737"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="text-sm text-[#676767] ">
                      Equipment chosen to save money, not waste it
                    </span>
                  </p>
                </li>
                <li className="my-2">
                  <p className="flex items-center gap-2 ">
                    <svg
                      width="16"
                      height="13"
                      viewBox="0 0 16 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 8.5C1 8.5 2.5 8.5 4.5 12C4.5 12 10.0588 2.83333 15 1"
                        stroke="#186737"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="text-sm text-[#676767] ">
                      End-to-end support — from the first sketch to opening day
                    </span>
                  </p>
                </li>
                <li className="my-2">
                  <p className="flex items-center gap-2 ">
                    <svg
                      width="16"
                      height="13"
                      viewBox="0 0 16 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 8.5C1 8.5 2.5 8.5 4.5 12C4.5 12 10.0588 2.83333 15 1"
                        stroke="#186737"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="text-sm text-[#676767] ">
                      Honest pricing, flexible options, no hidden surprises
                    </span>
                  </p>
                </li>
                <li className="my-2">
                  <p className="flex items-center gap-2 ">
                    <svg
                      width="16"
                      height="13"
                      viewBox="0 0 16 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 8.5C1 8.5 2.5 8.5 4.5 12C4.5 12 10.0588 2.83333 15 1"
                        stroke="#186737"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="text-sm text-[#676767] ">
                      A launch process that feels smooth, not stressful
                    </span>
                  </p>
                </li>
              </ul>
            </div>

            <div>
              <form
                id="contactForm"
                className="bg-[#F5F5F5] p-6 rounded-lg shadow-md space-y-4 lg:max-w-[600px] md:max-w-[500px] mx-auto"
                // onSubmit={handleSubmit(onSubmit)}
              >
                {/* Full Name Field */}
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
                  >
                    Full Name*
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    placeholder="Jhon Smith"
                    className="w-full border border-[#D1D5DB] py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
                   
                  />
                
                </div>

                <div className="md:flex block gap-5 justify-between">
                  {/* Phone Number Field */}
                  {/* <div className="w-full mb-4 md:mb-0">
                    <label
                      htmlFor="phone"
                      className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
                    >
                      Phone Number*
                    </label>
                    <input
                      type="text"
                      id="phone"
                      placeholder="+1 (234) 567-8900"
                      className="w-full border border-[#D1D5DB] py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div> */}
                  {/* Phone Number Field with US Formatting */}
                  <div className="w-full mb-4 md:mb-0">
                    <label
                      htmlFor="phone"
                      className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
                    >
                      Phone Number*{" "}
                      <span className="text-xs text-gray-500">(US Format)</span>
                    </label>
                    <div className="relative flex items-center">
                      {/* ✅ US Flag Icon */}
                      <img
                        src={process.env.PUBLIC_URL + "/icons/flag.png"}
                        alt="US flag"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10 pointer-events-none"
                      />
                      <input
                        ref={phoneInputRef}
                        type="tel"
                        id="phone"
                        placeholder="(866) 446-7322"
                        maxLength={14}
                     
                        // value={phoneValue}
                        // onChange={handlePhoneChange}
                        // onKeyDown={handlePhoneKeyDown}
                        className={`w-full border pl-12 pr-3 py-2 2xl:py-3 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base  border-[#D1D5DB]`}
                      />
                    </div>
                
                  </div>
                  {/* Email Field */}
                  {/* <div className="w-full">
                    <label
                      htmlFor="email"
                      className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
                    >
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      className="w-full border border-[#D1D5DB] py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div> */}
                  <div className="w-full">
                    <label
                      htmlFor="email"
                      className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
                    >
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      className={`w-full border py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base  border-[#D1D5DB]
                      }`}
                    //   className={`w-full border py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base ${
                    //     errors.email ? "border-red-500" : "border-[#D1D5DB]"
                    //   }`}
                     
                      // {...register("email")}
                      // onBlur={(e) => {
                      //   // Trim on blur
                      //   setValue("email", e.target.value.trim(), {
                      //     shouldValidate: true,
                      //   });
                      // }}
                    />
                  
                  </div>
                </div>

                <div className="md:flex block gap-5 justify-between">
                  {/* Company Name Field */}
                  <div className="w-full mb-4 md:mb-0">
                    <label
                      htmlFor="company_name"
                      className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
                    >
                      Company / Restaurant Name*
                    </label>
                    <input
                      type="text"
                      id="company_name"
                      placeholder="Bella's Italian Bistro"
                      className="w-full border border-[#D1D5DB] py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
                      // {...register("company_name")}
                  
                    />
                   
                  </div>

                  {/* Restaurant Type Field */}
                  <div className="w-full">
                    <label
                      htmlFor="restaurant_type"
                      className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
                    >
                      Restaurant Type / Concept*
                    </label>
                    <select
                      id="restaurant_type"
                      className="w-full border border-[#D1D5DB] py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
                    
                    >
                      <option value="">Select Type</option>
                      <option value="American">American</option>
                      <option value="Mexican/Tex-Mex">Mexican/Tex-Mex</option>
                      <option value="Pizza/Italian">Pizza/Italian</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Fast Casual">Fast Casual</option>
                      <option value="Café/Coffee">Café/Coffee</option>
                      <option value="Asian">Asian</option>
                      <option value="Burgers">Burgers</option>
                      <option value="BBQ/Steakhouse">BBQ/Steakhouse</option>
                      <option value="Indian">Indian</option>
                      <option value="Seafood">Seafood</option>
                      <option value="Breakfast/Brunch">Breakfast/Brunch</option>
                      <option value="Food Truck">Food Truck</option>
                      <option value="Other">Other</option>
                    </select>
                  
                  </div>
                </div>

                {/* File Upload Field */}
                <div className="w-full">
                  <label
                    htmlFor="files"
                    className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
                  >
                    Upload Files (Optional)
                  </label>

                  <div
                    className="flex items-center w-full border border-[#D1D5DB] py-2 px-3 
                      2xl:py-3 2xl:px-2 rounded-md mt-2 bg-white overflow-hidden"
                  >
                    {/* Hidden Input */}
                    <input
                      type="file"
                      id="files"
                      className="hidden"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                     
                    />

                    {/* Button */}
                    <label
                      htmlFor="files"
                      className="cursor-pointer px-3 py-1 bg-gray-100 text-[#2D2D2D] font-medium text-sm border-r border-[#D1D5DB]"
                    >
                      Choose Files
                    </label>

                    {/* ✅ Show file names */}
                    <span className="px-3 text-sm text-black truncate">
                      {/* {selectedFiles && selectedFiles.length > 0
                        ? Array.from(selectedFiles)
                            .map((file) => file.name)
                            .join(", ")
                        : "Attach menu, layout, or BOQ if available"} */}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 mt-1">
                    PDF, Word, Excel — max 10MB
                  </p>

                
                </div>

                {/* Notes Field */}
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-[#2D2D2D] font-bold text-sm 2xl:text-base"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    placeholder="Your message..."
                    className="w-full border border-[#D1D5DB] py-2 px-3 2xl:py-3 2xl:px-2 rounded-md mt-2 placeholder:text-sm 2xl:placeholder:text-base"
                   
                  ></textarea>
                 
                </div>
                <div>
                  <div className="flex gap-2 items-start">
                    <input
                      type="checkbox"
                      name="terms"
                      id="terms"
                      className="mt-[4px]"
                  
                      //  checked={isTermsAccepted}
                      //  onChange={(e) => {
                      //    setIsTermsAccepted(e.target.checked);
                      //    if (e.target.checked) {
                      //      setTermsError(false);
                      //    }
                      //  }}
                    />
                    <label htmlFor="terms" className="text-sm cursor-pointer">
                      By submitting this form, you consent to receive
                      promotional offers from Horecastore at the number
                      provided. Consent is not a condition of purchase. Message
                      & data rates may apply. Message frequency varies.
                      Unsubscribe by replying STOP. Reply HELP for help. Phone
                      numbers aren't shared with third parties.{" "}
                      <span>
                        <Link
                          href={"/pages/privacy-policy"}
                          className="text-blue-500"
                        >
                          Privacy Policy
                        </Link>{" "}
                        &{" "}
                        <Link
                          href={"/pages/return-policy"}
                          className="text-blue-500"
                        >
                          Terms and condition
                        </Link>
                      </span>
                    </label>
                  </div>

                
                </div>
                {/* <div>
                  <ReCAPTCHA
                    sitekey="6LeAR_IrAAAAAPKlU4isb4ce0mrqwWeq5FXmXWYH"
                    onChange={onChangeFunc}
                  />
                </div> */}

                {/* <div>
                  <ReCAPTCHA
                    sitekey="6LewWvIrAAAAAHWqkx3qesrZpYSrwDa6v8y68AVO"
                    onChange={onCaptchaChange}
                  />

                  {captchaError && !recaptchaToken && (
                    <p className="text-red-500 text-sm mt-2">
                      Please verify that you are not a robot*
                    </p>
                  )}
                </div> */}

                {/* Submit Button */}
                <div>
                  <button
                    className="bg-[#186737] text-white font-semibold rounded-md text-base h-[55px] w-full hover:bg-[#155a2e] transition-colors flex items-center justify-center gap-2"
                    type="submit"
                    disabled={loader} // disable while loading
                  >
                    {loader ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      "Let's Open Together"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="py-5">
        <div className="global-container">
          <div className="grid grid-cols-1  gap-4 justify-center items-center text-center">
            <h3 className="text-2xl ">Frequently Asked Questions</h3>
            <p className="text-[#676767] text-base">
              Our FAQs cover what matters most - Costs, timelines, equipment,
              and support so you can open your restaurant with{" "}
              <span className="lg:block md:inline-block">
                clarity and confidence.
              </span>
            </p>
          </div>
          <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4 mt-6">
            {/* Left Column */}
            <div className=" flex flex-col gap-4">
              {FAQSpecification?.slice(
                0,
                Math.ceil(FAQSpecification.length / 2)
              )?.map((faq, index) => (
                <div
                  key={index}
                  className="border border-[#EAEAEA] rounded-lg overflow-hidden h-auto"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-[#242424] font-medium text-sm 2xl:text-[16px] bg-[#F9FAFC] hover:bg-[#F9F9F9] transition-all"
                  >
                    <span className="pr-4">{faq.question}</span>
                    {activeIndex === index ? (
                      <img
                        src={`${process.env.PUBLIC_URL}/icons/arrow-up.png`}
                        alt="Up Arrow"
                        loading="lazy"
                      />
                    ) : (
                      <img
                        src={`${process.env.PUBLIC_URL}/icons/arrow-down.png`}
                        alt="Down Arrow"
                        loading="lazy"
                      />
                    )}
                  </button>
                  <div
                    className={`px-4 py-0 text-[#242424] text-sm 2xl:text-[16px] bg-[#F9FAFC] border-t border-[#EAEAEA] overflow-hidden transition-all duration-300 ${
                      activeIndex === index
                        ? "max-h-96 py-3"
                        : "max-h-0 border-t-0"
                    }`}
                  >
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className=" flex flex-col gap-4">
              {FAQSpecification?.slice(
                Math.ceil(FAQSpecification.length / 2)
              )?.map((faq, index) => {
                const actualIndex =
                  index + Math.ceil(FAQSpecification.length / 2);
                return (
                  <div
                    key={actualIndex}
                    className="border border-[#EAEAEA] rounded-lg overflow-hidden h-auto"
                  >
                    <button
                      onClick={() => toggleFAQ(actualIndex)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-[#242424] font-medium text-sm 2xl:text-[16px] bg-[#F9FAFC] hover:bg-[#F9F9F9] transition-all"
                    >
                      <span className="pr-4">{faq.question}</span>
                      {activeIndex === actualIndex ? (
                        <img
                          src={`${process.env.PUBLIC_URL}/icons/arrow-up.png`}
                          alt="Up Arrow"
                          loading="lazy"
                        />
                      ) : (
                        <img
                          src={`${process.env.PUBLIC_URL}/icons/arrow-down.png`}
                          alt="Down Arrow"
                          loading="lazy"
                        />
                      )}
                    </button>
                    <div
                      className={`px-4 py-0 text-[#242424] text-sm 2xl:text-[16px] bg-[#F9FAFC] border-t border-[#EAEAEA] overflow-hidden transition-all duration-300 ${
                        activeIndex === actualIndex
                          ? "max-h-96 py-3"
                          : "max-h-0 border-t-0"
                      }`}
                    >
                      {faq.answer}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RestaurantADS;
