import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import usePlatform from "../../hooks/usePlatform/usePlatform";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import { IoClose } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { FaCopy } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import Loader from "../../components/Loader/Loader";
import { FiHome } from "react-icons/fi";

import bkash_logo from "../../assets/gateway_logo/bkash.png";
import nagad_logo from "../../assets/gateway_logo/nagad.png";

import logo from "../../assets/logo/logo.png";

import { BiSupport } from "react-icons/bi";
import { MdOutlineContactSupport } from "react-icons/md";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";

const DeliveryPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [selectedGateway, setSelectedGateway] = useState("");
  const { platform, isPlatformPending } = usePlatform();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Get delivery payment data
  const paymentData = location?.state?.paymentData;

  // If no payment data, redirect back
  if (!paymentData) {
    navigate("/checkout");
    return null;
  }

  const { orderInfo, customerInfo, deliveryCharge } = paymentData;

  // Copy function with toast notification
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

  // Payment Gateway Options
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

  // Handle Gateway Selection
  const handleGatewaySelect = (gatewayName) => {
    setSelectedGateway(gatewayName);
  };

  // Get selected gateway details
  const selectedGatewayDetails = paymentGateways.find(
    (gw) => gw.name === selectedGateway,
  );

  // Handle Payment Submit - Delivery specific logic
  const onSubmit = async (data) => {
    setIsLoading(true);

    const orderData = {
      ...orderInfo,
      customerInfo,
      deliveryPaymentMethod: "Manual",
      deliveryPaymentStatus: "Pending",
      deliveryPaymentInfo: {
        gateway: selectedGateway,
        txnId: data.txnId,
        amount: deliveryCharge,
      },
    };

    try {
      const res = await axiosSecure.post("/orders", orderData);
      const successMessage = res?.data?.message || "অর্ডার সফলভাবে জমা হয়েছে!";

      Swal.fire({
        title: successMessage,
        text: "পেমেন্ট যাচাইয়ের পর আপনার অর্ডার নিশ্চিত করা হবে।",
        icon: "success",
      });

      navigate("/");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "অর্ডার জমা দিতে সমস্যা হয়েছে!";

      Swal.fire({
        title: errorMessage,
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPlatformPending) {
    return <Loader />;
  }

  return (
    <div className="relative page-bg text-primary-950 min-h-screen flex justify-center items-center">
      <div className="w-full md:max-w-2xl container mx-auto px-5 lg:px-0 py-5 lg:py-10">
        <div className="card rounded-2xl lg:p-10">
          {/* Top Header */}
          <div className="py-3.5 px-5 bg-primary-50 rounded-md border border-border-color flex justify-between items-center mb-8">
            <Link to="/">
              <FiHome
                size={20}
                className="text-primary-600 cursor-pointer hover:text-primary transition-colors"
              />
            </Link>

            <Link to="/">
              <IoClose
                size={24}
                className="text-primary-600 cursor-pointer hover:text-red-500 transition-colors"
              />
            </Link>
          </div>

          {/* Logo Section */}
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
                <span className="font-bold text-blue-500">
                  ৳{deliveryCharge}
                </span>
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

          {/* Payment Gateway Selection */}
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-2.5 lg:gap-5">
              {paymentGateways.map((gateway) => (
                <button
                  key={gateway.name}
                  type="button"
                  onClick={() => handleGatewaySelect(gateway.name)}
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

          {/* Payment Instructions */}
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
                    <span
                      className={`font-bold text-yellow-300 inline-flex items-center gap-2`}
                    >
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
                    <span
                      className={`font-bold text-yellow-300 inline-flex items-center gap-2`}
                    >
                      {deliveryCharge?.toFixed(2)}
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(deliveryCharge?.toFixed(2), "amount")
                        }
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
                  সবকিছু ঠিক থাকলে, আপনি {selectedGatewayDetails.name} থেকে একটি
                  নিশ্চিতকরণ মেসেজ পাবেন।
                </p>
                <p className="flex items-start gap-2">
                  <GoDotFill size={12} className="shrink-0" />
                  এখন নিচের বক্সে আপনার Transaction ID দিন এবং নিচের VERIFY
                  বাটনে ক্লিক করুন।
                </p>
                <p className="flex items-start gap-2 text-yellow-200">
                  <GoDotFill size={12} className="shrink-0" />
                  <span className="font-semibold">
                    বিশেষ দ্রষ্টব্য: এই পেমেন্ট শুধুমাত্র ডেলিভারি চার্জের জন্য।
                    প্রোডাক্টের টাকা ডেলিভারির সময় নেওয়া হবে।
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Transaction ID Form */}
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
                  <span>VERIFY & PLACE ORDER</span>
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

export default DeliveryPayment;
