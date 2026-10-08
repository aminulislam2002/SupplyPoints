import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Loader from "../../../../components/Loader/Loader";
import { IoIosArrowDown } from "react-icons/io";
import usePlatform from "../../../../hooks/usePlatform/usePlatform";
import { useState } from "react";
import { FaThumbtack } from "react-icons/fa";

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
    <section className="container mx-auto px-4 py-5 lg:py-10 space-y-5 lg:space-y-10">
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
        <div className="mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            যেসব প্রশ্ন আপনার জন্য উপকারী হতে পারে
          </h2>
          <p className="mt-2 text-xs md:text-sm lg:text-base font-normal text-text-secondary">
            আপনার তাৎক্ষণিক প্রয়োজনগুলো বোঝার দ্রুত উপায়
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:items-start lg:gap-4">
          {allFaqData.map((item, index) => {
            const faqId = item?._id || index;
            const isOpen = openFaqId === faqId;
            const cardColors = [
              "bg-blue-50 dark:bg-blue-950/30",
              "bg-emerald-50 dark:bg-emerald-950/30",
              "bg-rose-50 dark:bg-rose-950/30",
              "bg-amber-50 dark:bg-amber-950/30",
              "bg-violet-50 dark:bg-violet-950/30",
              "bg-indigo-50 dark:bg-indigo-950/30",
              "bg-green-50 dark:bg-green-950/30",
              "bg-purple-50 dark:bg-purple-950/30",
              "bg-teal-50 dark:bg-teal-950/30",
              "bg-pink-50 dark:bg-pink-950/30",
              "bg-cyan-50 dark:bg-cyan-950/30",
              "bg-gray-50 dark:bg-gray-950/30",
              "bg-orange-50 dark:bg-orange-950/30",
              "bg-red-50 dark:bg-red-950/30",
              "bg-slate-50 dark:bg-slate-950/30",
            ];
            const rotations = [
              "-rotate-2",
              "rotate-1",
              "-rotate-1",
              "rotate-2",
            ];
            const offsets = [
              "lg:translate-y-4",
              "lg:translate-y-12",
              "lg:translate-y-5",
              "lg:translate-y-10",
            ];

            return (
              <div
                key={faqId}
                className={`relative overflow-visible rounded-2xl border border-border-color shadow-md transition-transform duration-300 hover:-translate-y-1 lg:mb-8 ${cardColors[index % cardColors.length]} ${rotations[index % rotations.length]} ${offsets[index % offsets.length]}`}
              >
                <FaThumbtack
                  className={`absolute -top-3 left-1/2 z-10 -translate-x-1/2 rotate-12 text-xl ${
                    [
                      "text-blue-400",
                      "text-emerald-400",
                      "text-rose-400",
                      "text-amber-400",
                      "text-violet-400",
                      "text-indigo-400",
                      "text-green-400",
                      "text-purple-400",
                      "text-teal-400",
                      "text-pink-400",
                      "text-cyan-400",
                      "text-gray-400",
                      "text-orange-400",
                      "text-red-400",
                      "text-slate-400",
                    ][index % 4]
                  } drop-shadow-sm`}
                />
                <button
                  type="button"
                  onClick={() => handleFaqToggle(faqId)}
                  className="flex w-full items-start justify-between gap-3 p-5 pt-7 text-left"
                >
                  <h3 className="text-xs lg:text-sm font-semibold leading-snug">
                    <span className="mb-2 block text-xs font-bold text-text-secondary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.question}
                  </h3>
                  <IoIosArrowDown
                    className={`mt-1 shrink-0 text-lg text-text-secondary transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="h-auto w-full overflow-hidden">
                    <p className="px-5 pb-6 text-xs leading-relaxed text-text-secondary sm:text-sm">
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
