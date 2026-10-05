import { Link } from "react-router";
import usePlatform from "../../hooks/usePlatform/usePlatform";

const ResellingBanner = () => {
  const { platform } = usePlatform();

  return (
    <section className="container mx-auto mt-8 px-4 sm:px-6 lg:mt-12 lg:px-8">
      <div className="surface-muted rounded-xl p-5 sm:p-7 lg:p-10">
        <p className="metadata text-center uppercase tracking-[0.2em] text-primary-600">
          Start with less, build with confidence
        </p>
        <h1 className="mx-auto mb-7 mt-3 max-w-2xl text-center text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl lg:mb-10 lg:text-4xl">
          চাকরির অপেক্ষায় না থেকে, ঘরে বসেই হয়ে উঠুন সফল উদ্যোক্তা
        </h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-5 text-center lg:text-left">
            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: "💰", text: "শূন্য পুঁজিতেই নিজের ব্যবসা" },
                { icon: "🚀", text: "পাইকারি দামের ওপর ইচ্ছামতো লাভ" },
                { icon: "📦", text: "প্যাকিং-ডেলিভারি সব আমাদের দায়িত্ব" },
                { icon: "🛡️", text: "ঝুঁকিমুক্ত আনলিমিটেড আয়ের সুযোগ" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="surface flex items-center gap-3 rounded-lg p-4 transition-all duration-300 hover:border-primary-300"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium text-text-secondary md:text-base font-hindi">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/auth/sign-up"
                className="btn btn-primary w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  এখনই শুরু করুন
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Link>

              <Link
                to="/dashboard/seller/rules"
                className="btn btn-outline w-full sm:w-auto"
              >
                <span className="text-green-600 text-xl group-hover:scale-110 transition-transform">
                  💬
                </span>
                সেলার রুলস
              </Link>
            </div>
          </div>

          {/* Right Video */}
          <div className="surface relative h-full w-full overflow-hidden rounded-lg">
            <iframe
              className="w-full h-[230px] lg:h-[340px]"
              src={platform?.resellingYoutube || "https://www.youtube.com"}
              title="Supply Points Introduction"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResellingBanner;
