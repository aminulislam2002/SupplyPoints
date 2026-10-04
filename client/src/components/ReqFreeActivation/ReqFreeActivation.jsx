import { Link } from "react-router";
import { FaCheckCircle, FaHome, FaShoppingBag } from "react-icons/fa";
import { IoReceiptOutline } from "react-icons/io5";

const ReqFreeActivation = () => {
  return (
    <div className="relative min-h-screen bg-page-bg text-center">
      <div className="container mx-auto max-w-2xl space-y-5 px-5 py-20">
        {/* Animated/Glowing Success Icon Box */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
          <FaCheckCircle className="text-4xl sm:text-5xl text-emerald-500 animate-bounce" />
        </div>

        {/* Success Message Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            আবেদন সফলভাবে জমা হয়েছে!
          </h1>
          <p className="text-xs xl:text-sm text-text-secondary leading-relaxed">
            আপনার আবেদনটি গ্রহণ করা হয়েছে। আমাদের একজন প্রতিনিধি কিছুক্ষণের
            মধ্যেই আপনার সাথে যোগাযোগ করবে।
          </p>
        </div>

        {/* Action Buttons Group */}
        <div className="space-y-3 pt-2">
          {/* Seller Rules Button */}
          <Link
            to="/dashboard/seller/rules"
            className="btn btn-primary mx-auto h-11 w-2/3 gap-2.5 text-xs font-semibold md:w-1/2 xl:w-1/3"
          >
            <IoReceiptOutline className="text-lg group-hover:scale-110 transition-transform" />
            <span>সেলার রুলস জানুন</span>
          </Link>

          {/* Home Button */}
          <Link
            to="/"
            className="btn btn-outline mx-auto h-11 w-2/3 gap-2 text-xs font-medium md:w-1/2 xl:w-1/3"
          >
            <FaHome className="text-base text-slate-500" />
            <span>হোম পেজে ফিরে যান</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReqFreeActivation;
