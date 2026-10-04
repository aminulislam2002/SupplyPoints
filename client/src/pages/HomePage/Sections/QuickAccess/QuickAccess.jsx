import { FaArrowRight, FaSync, FaChartLine } from "react-icons/fa";
import { SiSocialblade } from "react-icons/si";
import { Link } from "react-router";

const QuickAccess = () => {
  const quickCards = [
    {
      icon: <FaSync size={24} />,
      title: "রিসেলিং প্রোডাক্ট",
      description:
        "আমাদের ১০,০০০+ পণ্যের বিশাল ইনভেন্টরি নিয়ে কোনো প্রকার বিনিয়োগ, প্যাকেজিং বা ডেলিভারির ঝামেলা ছাড়াই শুরু করুন আপনার নিজস্ব ব্যবসা",
      color: "from-blue-400 to-blue-600",
      path: "/reselling",
      actionText: "ব্যবসা শুরু করুন",
    },
    {
      icon: <SiSocialblade size={24} />,
      title: "সোশ্যাল প্রোমোশন",
      description:
        "ফেসবুক, ইউটিউব, ইনস্টাগ্রাম ও টিকটকসহ সকল সোশ্যাল মিডিয়ায় অর্গানিক প্রোমোশনের মাধ্যমে আপনার ব্যক্তিগত বা ব্যবসায়িক ব্র্যান্ডের পরিচিতি ও গ্রহণযোগ্যতা বৃদ্ধি করুন",
      color: "from-orange-400 to-orange-600",
      path: "/promotion",
      actionText: "প্রোমোশন দেখুন",
    },
    {
      icon: <FaChartLine size={24} />,
      title: "মাইক্রো জব",
      description:
        "সঠিক দিকনির্দেশনা এবং ধৈর্যের সাথে অর্গানিক প্রোমোশনের কাজ শিখে নিজের জন্য আয়ের একটি দীর্ঘস্থায়ী ও নির্ভরযোগ্য বিকল্প উৎস তৈরি করুন",
      color: "from-green-400 to-green-600",
      path: "/marketing",
      actionText: "কাজ শুরু করুন",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-7">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">Built for momentum</p>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Choose your growth path</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {quickCards.map((card, index) => (
          <Link
            key={index}
            to={card?.path}
            className="card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-300"
          >
            {/* Icon */}
            <div className="relative mb-5 flex items-center justify-start gap-4">
              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-primary-200 bg-primary-50 text-primary-700 transition-transform duration-300 group-hover:scale-105"
              >
                {card.icon}
              </div>

              <h3 className="text-lg font-bold transition-colors duration-300 group-hover:text-primary-500">
                {card.title}
              </h3>

              <FaArrowRight className="ml-auto text-primary-500 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
            </div>

            {/* Content */}
            <p className="relative text-sm font-normal leading-relaxed">
              {card.description}
            </p>

            <div className="relative mt-5 flex items-center gap-2 text-sm font-semibold text-primary-500">
              <span className="transition-all duration-300 group-hover:tracking-wide">
                {card.actionText}
              </span>
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickAccess;
