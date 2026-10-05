import { Link } from "react-router";
import {
  FaBoxOpen,
  FaTasks,
  FaMobileAlt,
  FaBullhorn,
  FaGlobe,
  FaShoppingBag,
  FaMoneyBillWave,
  FaUserFriends,
} from "react-icons/fa";
import {
  MdDashboard,
  MdOutlineTaskAlt,
  MdOutlineCampaign,
  MdRule,
} from "react-icons/md";
import { PiWallet } from "react-icons/pi";
import { BiSupport } from "react-icons/bi";

const Shortcuts = () => {
  const shortcutCards = [
    {
      title: "রিসেলিং / ড্রপশিপিং",
      icon: <FaBoxOpen size={20} />,
      to: "/dashboard/seller/reselling",
    },
    {
      title: "মাইক্রো জবস",
      icon: <FaTasks size={20} />,
      to: "/dashboard/seller/micro-jobs",
    },
    {
      title: "ডিজিটাল মার্কেটিং",
      icon: <FaBullhorn size={20} />,
      to: "/promotion",
    },
    {
      title: "ই-কমার্স ওয়েবসাইট",
      icon: <FaGlobe size={20} />,
      to: "/dashboard/seller/ecommerce-web",
    },
    {
      title: "আমার অর্ডার",
      icon: <FaShoppingBag size={20} />,
      to: "/dashboard/seller/my-orders",
    },
    {
      title: "ফান্ড যোগ করুন",
      icon: <FaMoneyBillWave size={20} />,
      to: "/dashboard/seller/add-funds",
    },
    {
      title: "ফান্ড উত্তোলন করুন",
      icon: <FaMoneyBillWave size={20} />,
      to: "/dashboard/seller/create-withdrawal",
    },
    {
      title: "টু-ডু লিস্ট",
      icon: <MdOutlineTaskAlt size={20} />,
      to: "/dashboard/seller/todo-list",
    },
    {
      title: "ডিজিটাল ওয়ালেট",
      icon: <PiWallet size={20} />,
      to: "/dashboard/seller/digital-wallet",
    },
    {
      title: "রেফারেল",
      icon: <FaUserFriends size={20} />,
      to: "/dashboard/seller/my-refer",
    },
    {
      title: "রিভিউ আয়",
      icon: <MdOutlineCampaign size={20} />,
      to: "/dashboard/seller/submit-posts",
    },
    {
      title: "সেলার রুলস",
      icon: <MdRule size={20} />,
      to: "/dashboard/seller/rules",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-5 lg:py-10">
      {/* Section Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-700 dark:text-primary-400">
          আমাদের সার্ভিস সমূহ ও শর্টকাটস
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          আমাদের এই প্ল্যাটফর্মের মাধ্যমে আপনি পাচ্ছেন অসংখ্য বিজনেস এবং ইনকাম
          করার সুযোগ।
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {shortcutCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="surface group relative flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border-color bg-card-bg shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary-500 overflow-hidden"
          >
            {/* Animated Icon Container */}
            <div className="shrink-0 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary-100">
              {card.icon}
            </div>

            {/* Title & Arrow hint */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-text-primary truncate transition-colors duration-300 group-hover:text-primary-600">
                {card.title}
              </h3>
              <span className="text-[10px] text-text-secondary flex items-center gap-1 mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                বিস্তারিত দেখুন &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Shortcuts;
