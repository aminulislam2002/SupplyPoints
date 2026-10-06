import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";
import usePlatform from "../../hooks/usePlatform/usePlatform";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import { ImSpinner2 } from "react-icons/im";
import { IoClose } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { FaCopy } from "react-icons/fa";
import Loader from "../../components/Loader/Loader";
import { FiHome } from "react-icons/fi";

import bkash_logo from "../../assets/gateway_logo/bkash.png";
import nagad_logo from "../../assets/gateway_logo/nagad.png";
// import rocket_logo from "../../assets/gateway_logo/rocket.png";

import logo from "../../assets/logo/logo.png";

import { BiSupport } from "react-icons/bi";
import { MdOutlineContactSupport } from "react-icons/md";
import useAuth from "../../hooks/useAuth/useAuth";

const ManualPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, refetchUser } = useAuth();
  const { purpose, amount } = useParams();
  const axiosSecure = useAxiosSecure();
  const [selectedGateway, setSelectedGateway] = useState("");
  const { platform, isPlatformPending } = usePlatform();

  const minDepositLimit = Number(platform?.minDepositLimit || 1);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      Swal.fire({
        title: type === "number" ? "নম্বর কপি হয়েছে!" : "পরিমাণ কপি হয়েছে!",
        icon: "success",
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "কপি করতে সমস্যা হয়েছে!",
        icon: "error",
      });
    }
  };

  const paymentGateways = [
    {
      name: "Bkash",
      dialCode: "*247#",
      number: platform?.bkashNumber || "01712345678",
      logo: bkash_logo,
      color: "#CF2771",
    },
    {
      name: "Nagad",
      dialCode: "*167#",
      number: platform?.nagadNumber || "01812345678",
      logo: nagad_logo,
      color: "#C90008",
    },
    // {
    //   name: "Rocket",
    //   dialCode: "*322#",
    //   number: platform?.rocketNumber || "01912345678",
    //   logo: rocket_logo,
    //   color: "#89288F",
    // },
  ];

  const selectedGatewayDetails = paymentGateways.find(
    (gw) => gw.name === selectedGateway,
  );

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await axiosSecure.post("/add-funds/payments", {
        amount,
        gateway: selectedGateway.toUpperCase(),
        purpose,
        transactionId: data.txnId,
      });

      const successMessage =
        res?.data?.message || "Add funds request submitted successfully!";

      await Swal.fire({
        title: successMessage,
        text: `Admin verification এর পর আপনার ${purpose === "Account" ? "অ্যাকাউন্ট" : "ব্যালেন্স"} আপডেট হবে।`,
        icon: "success",
      });

      navigate("/dashboard/seller/overview");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "পেমেন্ট জমা দিতে সমস্যা হয়েছে!";

      Swal.fire({
        title: errorMessage,
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubscriptionType = async (id) => {
    try {
      await axiosSecure.put(`/users/subscription-type/${id}`);

      refetchUser();
      navigate("/req-free-activation");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    }
  };

  if (isPlatformPending) {
    return <Loader />;
  }

  return (
    <div className="relative page-bg text-primary-950 min-h-screen flex justify-center items-center">
      <div className="w-full md:max-w-2xl container mx-auto px-5 lg:px-0 py-5 lg:py-10">
        <div className="card rounded-2xl lg:p-10">
          <div className="py-3.5 px-5 bg-primary-50 rounded-md border border-border-color flex justify-between items-center mb-8">
            <Link to="/">
              <FiHome
                size={20}
                className="text-primary-600 cursor-pointer hover:text-primary transition-colors"
              />
            </Link>

            <Link to="/dashboard/seller/add-funds">
              <IoClose
                size={24}
                className="text-primary-600 cursor-pointer hover:text-red-500 transition-colors"
              />
            </Link>
          </div>

          {user?.subscriptionType === "Premium" && (
            <div className="mb-5 p-2.5 rounded-xl bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex items-center justify-between gap-2.5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <p className="text-xs xl:text-sm font-semibold">
                    বিনামূল্যে অ্যাকাউন্ট অ্যাক্টিভেশন করুন
                  </p>
                  <p className="text-[10px] xl:text-xs text-text-secondary">
                    আপনার ফ্রি অ্যাকাউন্ট সুবিধা পেতে নিচের বাটনে ক্লিক করে
                    আবেদন করুন।
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleUpdateSubscriptionType(user?._id)}
                className="shrink-0 bg-blue-500 hover:bg-blue-400 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
              >
                ক্লিক করুন
              </button>
            </div>
          )}

          <div className="mb-8 flex flex-col lg:flex-row justify-start items-center gap-5 lg:gap-8">
            <img
              src={logo}
              alt={platform?.name || "Platform Logo"}
              className="w-20 lg:w-28 h-auto object-contain border border-border-color rounded-full p-2.5"
            />

            <div className="text-center lg:text-left">
              <h2 className="font-primary text-lg lg:text-xl font-bold text-primary-700 mb-2.5">
                {platform?.name || "Supply Points"}
              </h2>
              <p className="text-sm text-primary-700 mb-3">
                Amount:{" "}
                <span className="font-bold text-blue-500">৳{amount}</span>
              </p>
              <p className="text-xs text-primary-600 mb-3">
                Minimum deposit: ৳{minDepositLimit}
              </p>

              <div className="flex justify-start items-center gap-2.5">
                <Link
                  to="/support"
                  className="px-3 py-1.5 bg-primary-50 rounded-md border border-border-color flex justify-center items-center gap-2"
                >
                  <BiSupport /> <span>Support</span>
                </Link>
                <Link
                  to="/contact"
                  className="px-3 py-1.5 bg-primary-50 rounded-md border border-border-color flex justify-center items-center gap-2"
                >
                  <MdOutlineContactSupport /> <span>Contact</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-3 gap-2.5 lg:gap-5">
              {paymentGateways.map((gateway) => (
                <button
                  key={gateway.name}
                  type="button"
                  onClick={() => setSelectedGateway(gateway.name)}
                  className={`relative py-1 lg:py-2 rounded-md border-2 transition-all duration-300 cursor-pointer ${
                    selectedGateway === gateway.name
                      ? "border-current"
                      : "border-border-color bg-primary-50 hover:border-border-color"
                  }`}
                  style={{
                    borderColor:
                      selectedGateway === gateway.name
                        ? gateway.color
                        : undefined,
                  }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={gateway.logo}
                      alt={gateway.name}
                      className="w-20 h-12 object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedGateway && selectedGatewayDetails && (
            <div
              className="p-5 rounded-md mb-5"
              style={{ backgroundColor: selectedGatewayDetails.color }}
            >
              <h3 className="font-bengali text-primary-50 text-base font-semibold mb-3 text-center gap-2">
                নিম্নের নির্দেশাবলী ফলো করুন
              </h3>

              <div className="space-y-5 font-bengali text-sm text-primary-50">
                <p className="flex items-start gap-2">
                  <GoDotFill size={12} className="shrink-0" />
                  <span>
                    {selectedGatewayDetails.dialCode} ডায়াল করে আপনার{" "}
                    {selectedGatewayDetails.name} মোবাইল মেনুতে যান অথবা{" "}
                    {selectedGatewayDetails.name} অ্যাপে যান।
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <GoDotFill size={12} className="shrink-0" />
                  <span>Send Money -এ ক্লিক করুন।</span>
                </p>
                <p className="flex items-start gap-2">
                  <GoDotFill size={12} className="shrink-0" />
                  <span>
                    প্রাপক নম্বর হিসেবে এই নম্বরটি লিখুনঃ{" "}
                    <span className="font-bold text-yellow-300 inline-flex items-center gap-2">
                      {selectedGatewayDetails.number}
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(selectedGatewayDetails.number, "number")
                        }
                        className="text-yellow-300 hover:text-primary-50 transition-colors duration-200 p-1 hover:bg-primary-50/10 rounded cursor-pointer"
                      >
                        <FaCopy size={12} />
                      </button>
                    </span>
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <GoDotFill size={12} className="shrink-0" />
                  <span>
                    টাকার পরিমাণঃ{" "}
                    <span className="font-bold text-yellow-300 inline-flex items-center gap-2">
                      {amount}
                      <button
                        type="button"
                        onClick={() => handleCopy(amount, "amount")}
                        className="text-yellow-300 hover:text-primary-50 transition-colors duration-200 p-1 hover:bg-primary-50/10 rounded cursor-pointer"
                      >
                        <FaCopy size={12} />
                      </button>
                    </span>{" "}
                    টাকা
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <GoDotFill size={12} className="shrink-0" />
                  <span>
                    এখন নিচের বক্সে আপনার Transaction ID দিন এবং VERIFY বাটনে
                    ক্লিক করুন।
                  </span>
                </p>
              </div>
            </div>
          )}

          {selectedGateway ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <input
                  type="text"
                  id="txnId"
                  {...register("txnId", {
                    required: "Transaction ID is required",
                    minLength: {
                      value: selectedGateway === "Nagad" ? 8 : 10,
                      message: `Transaction ID must be at least ${
                        selectedGateway === "Nagad" ? 8 : 10
                      } characters`,
                    },
                  })}
                  placeholder="ট্রান্সজেকশন আইডি দিন"
                  className="w-full px-4 py-3 rounded-md border-2 border-border-color bg-primary-50 text-primary-950 font-primary text-sm lg:text-base focus:outline-none focus:border-transparent transition-all duration-300"
                  style={{
                    borderColor: selectedGatewayDetails?.color,
                  }}
                />
                {errors.txnId && (
                  <p className="text-red-500 text-sm mt-1 font-primary">
                    {errors.txnId.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !selectedGateway}
                className="w-full h-12 disabled:bg-primary-200 disabled:cursor-not-allowed text-primary-50 rounded-md font-primary font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  backgroundColor:
                    !isLoading && selectedGateway
                      ? selectedGatewayDetails?.color
                      : undefined,
                }}
              >
                {isLoading ? (
                  <>
                    <ImSpinner2 className="animate-spin h-5 w-5 text-primary-50" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>VERIFY</span>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-5 lg:py-10">
              <p className="font-primary text-base font-medium text-primary-800">
                অনুগ্রহ করে একটি পেমেন্ট গেটওয়ে নির্বাচন করুন।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualPayment;
