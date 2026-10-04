import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Loader from "../../../../components/Loader/Loader";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import usePlatform from "../../../../hooks/usePlatform/usePlatform";
import { useState } from "react";
import { FcQuestions } from "react-icons/fc";
import google_play_logo from "../../../../assets/others/google-play-logo.png";
import { FiDownload } from "react-icons/fi";

const FAQ = () => {
  const axiosPublic = useAxiosPublic();
  const [openFaqId, setOpenFaqId] = useState(null);
  const { platform } = usePlatform();

  // Fetch all faqs
  const { isPending, data: allFaqData = [] } = useQuery({
    queryKey: ["allFaqData"],
    queryFn: async () => {
      const res = await axiosPublic.get("/faqs");
      return res?.data && res?.data?.data;
    },
    placeholderData: keepPreviousData,
  });

  const handleFaqToggle = (faqId) => {
    setOpenFaqId((prevFaqId) => (prevFaqId === faqId ? null : faqId));
  };

  if (isPending && allFaqData.length === 0) {
    return <Loader></Loader>;
  }
  return (
    <section className="container mx-auto space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      <div className="surface relative h-full w-full overflow-hidden rounded-xl">
        <iframe
          className="w-full h-[230px] lg:h-[680px]"
          src={platform?.youtubeVideo || "https://www.youtube.com"}
          title="Supply Points Introduction"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* <div className="relative flex justify-center items-center">
        <a
          href="earn-by-marketing.apk"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-left text-sm text-primary-50 shadow shadow-black/20"
        >
          <img
            src={google_play_logo}
            alt="Google Play"
            className="h-5 w-5 object-contain"
          />

          <span className="leading-tight">
            <span className="block text-[11px] uppercase tracking-[0.18em] text-primary-300">
              Get it on
            </span>
            <span className="block font-semibold text-primary-50">
              Download App
            </span>
          </span>

          <span className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-primary-200">
            <FiDownload size={16} />
          </span>
        </a>
      </div> */}

      <div>
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight lg:text-3xl">
          Frequently Asked Questions
        </h2>
        <div className="">
          {allFaqData.map((item, index) => {
            const faqId = item?._id || index;
            const isOpen = openFaqId === faqId;

            return (
              <div key={faqId} className="card mb-3 overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleFaqToggle(faqId)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-primary-50 dark:hover:bg-primary-950"
                >
                  <h3 className="text-base lg:text-lg font-semibold">
                    <FcQuestions
                      size={24}
                      className="inline-block mr-2 text-primary-500"
                    />
                    {item.question}
                  </h3>
                  {isOpen ? (
                    <IoIosArrowDown className="text-xl shrink-0" />
                  ) : (
                    <IoIosArrowForward className="text-xl shrink-0" />
                  )}
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="w-full h-auto overflow-hidden">
                    <p className="text-sm font-normal px-5 pb-5 leading-relaxed ml-2.5">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
