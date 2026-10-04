import { Link } from "react-router";
import usePlatform from "../../hooks/usePlatform/usePlatform";

const MarketingBanner = () => {
  const { platform } = usePlatform();

  return (
    <section className="surface-muted rounded-xl p-5 sm:p-7 lg:p-10">
      <p className="metadata text-center uppercase tracking-[0.2em] text-primary-600">
        Micro work that compounds
      </p>
      <h1 className="mx-auto mb-7 mt-3 max-w-3xl text-center text-2xl font-extrabold leading-tight tracking-tight text-text-primary md:text-3xl lg:text-4xl">
        ডিজিটাল মার্কেটিং সার্ভিস দিয়ে আজই নিশ্চিত করুন আপনার স্মার্ট ক্যারিয়ার
        ও নিয়মিত আয়
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-5 text-center lg:text-left">
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                icon: "​✅",
                text: "প্রতিদিন কাজের সুযোগ।",
              },
              {
                icon: "​​✅",
                text: "কাজ শেষে তাৎক্ষণিক পেমেন্ট।",
              },
              {
                icon: "​✅",
                text: "স্মার্টফোনেই সম্পূর্ণ কাজ।",
              },
              {
                icon: "​✅",
                text: "স্থায়ী রিমোট জব সুবিধা।",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="surface flex items-center gap-3 rounded-lg p-3 transition-colors duration-300 hover:border-primary-300"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium text-text-secondary md:text-base">
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
              to={`https://wa.me/${platform.whatsappNumber}?text=Hi%20Supply Points,%20I%20want%20to%20know%20more%20about%20the%20reseller%20program.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline w-full sm:w-auto"
            >
              <span className="text-green-600 text-xl group-hover:scale-110 transition-transform">
                💬
              </span>
              বিস্তারিত জানুন
            </Link>
          </div>
        </div>

        {/* Right Video */}
        <div className="surface relative w-full overflow-hidden rounded-lg">
          <iframe
            className="w-full h-[230px] lg:h-[340px]"
            src={platform?.marketingYoutube || "https://www.youtube.com"}
            title="Supply Points Introduction"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default MarketingBanner;
