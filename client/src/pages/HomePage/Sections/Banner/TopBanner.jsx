import bd_map from "../../../../assets/banner/bd_map.png";
import model from "../../../../assets/banner/model.png";
import { FaUsers, FaShoppingCart, FaStar, FaUserTie } from "react-icons/fa";
import { Link } from "react-router";

const TopBanner = () => {
  return (
    <section className="relative container mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 px-4 py-5 lg:py-10 items-center">
        {/* Left Column: Heading, Subheading, CTA & Stats */}
        <div className="lg:col-span-7 text-center lg:text-left flex flex-col justify-between items-center lg:items-start z-20 space-y-4 lg:h-full">
          {/* Top content wrapper to group heading, badge & buttons */}
          <div className="flex flex-col items-center lg:items-start space-y-5 w-full">
            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-700 dark:text-primary-400 leading-tight">
              ব্যবসা গড়ে তুলুন
            </h1>

            {/* Subtitle */}
            <p className="text-xs md:text-sm lg:text-base font-normal max-w-xl">
              অল্প পুঁজিতে ব্যবসা করতে চাচ্ছেন? তাহলে আজকেই যোগাযোগ করুন, এবং
              সফলতার সাথে গড়ে তুলুন আপনার ব্যবসা।
            </p>

            {/* Award Badge */}
            <div className="inline-flex items-center gap-2 bg-card-bg border border-border-color px-3.5 py-1.5 rounded-full shadow-sm">
              <span className="text-xs sm:text-sm font-normal">
                চাকরির অপেক্ষায় না থেকে, ঘরে বসেই হয়ে উঠুন সফল উদ্যোক্তা
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5">
              <Link to="/auth/sign-up" className="btn btn-primary">
                ব্যবসা শুরু করুন
              </Link>
              <Link className="btn btn-secondary">ভিডিও দেখুন</Link>
            </div>
          </div>

          {/* Statistics Section (Desktop View) */}
          <div className="hidden lg:grid grid-cols-4 gap-4 w-full">
            <div className="flex items-center gap-2.5">
              <div className="text-primary-700 dark:text-primary-400 text-xl bg-card-bg border border-border-color shadow p-2.5 rounded-full">
                <FaUsers />
              </div>
              <div>
                <h4 className="text-base font-bold">২৯১৯+</h4>
                <p className="text-[11px] text-text-secondary">ড্রপশিপার্স</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="text-primary-700 dark:text-primary-400 text-xl bg-card-bg border border-border-color shadow p-2.5 rounded-full">
                <FaShoppingCart />
              </div>
              <div>
                <h4 className="text-base font-bold">১১১৮৯১+</h4>
                <p className="text-[11px] text-text-secondary">
                  অর্ডার কমপ্লিটেড
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="text-primary-700 dark:text-primary-400 text-xl bg-card-bg border border-border-color shadow p-2.5 rounded-full">
                <FaStar />
              </div>
              <div>
                <h4 className="text-base font-bold">৩৫০+</h4>
                <p className="text-[11px] text-text-secondary">রিভিউ</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="text-primary-700 dark:text-primary-400 text-xl bg-card-bg border border-border-color shadow p-2.5 rounded-full">
                <FaUserTie />
              </div>
              <div>
                <h4 className="text-base font-bold">২০+</h4>
                <p className="text-[11px] text-text-secondary">টিম মেম্বার</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Model Image with Map Background Directly Behind It */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40 overflow-visible z-0">
            <img
              src={bd_map}
              alt="Bangladesh Map"
              className="w-[110%] lg:w-[130%] max-w-none h-auto object-contain"
            />
          </div>

          {/* Model Image */}
          <div className="relative z-10 flex items-end max-w-[260px] sm:max-w-[300px] lg:max-w-[340px]">
            <img
              src={model}
              alt="Model"
              className="w-full h-full object-cover mx-auto"
            />
          </div>
        </div>

        {/* Statistics Section (Mobile View Only) */}
        <div className="grid grid-cols-2 gap-3 w-full lg:hidden pt-3 z-20">
          <div className="flex items-center gap-2.5 bg-card-bg p-2.5 rounded-lg shadow">
            <div className="text-primary-700 dark:text-primary-400 text-lg p-2 rounded-full">
              <FaUsers />
            </div>
            <div>
              <h4 className="text-sm font-bold">২৯১৯+</h4>
              <p className="text-[10px] text-text-secondary">ড্রপশিপার্স</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-card-bg p-2.5 rounded-lg shadow">
            <div className="text-primary-700 dark:text-primary-400 text-lg p-2 rounded-full">
              <FaShoppingCart />
            </div>
            <div>
              <h4 className="text-sm font-bold">১১১৮৯১+</h4>
              <p className="text-[10px] text-text-secondary">
                অর্ডার কমপ্লিটেড
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-card-bg p-2.5 rounded-lg shadow">
            <div className="text-primary-700 dark:text-primary-400 text-lg p-2 rounded-full">
              <FaStar />
            </div>
            <div>
              <h4 className="text-sm font-bold">৩৫০+</h4>
              <p className="text-[10px] text-text-secondary">রিভিউ</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-card-bg p-2.5 rounded-lg shadow">
            <div className="text-primary-700 dark:text-primary-400 text-lg p-2 rounded-full">
              <FaUserTie />
            </div>
            <div>
              <h4 className="text-sm font-bold">২০+</h4>
              <p className="text-[10px] text-text-secondary">টিম মেম্বার</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBanner;
