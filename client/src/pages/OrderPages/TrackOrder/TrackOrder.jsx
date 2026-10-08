import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import {
  FaSearch,
  FaPhone,
  FaCheckCircle,
  FaTruck,
  FaShippingFast,
} from "react-icons/fa";
import { MdPending } from "react-icons/md";
import { BsBoxSeam, BsClockHistory } from "react-icons/bs";
import { BiPackage } from "react-icons/bi";
import useAxiosPublic from "../../../hooks/useAxiosPublic/useAxiosPublic";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";

const TrackOrder = () => {
  const axiosPublic = useAxiosPublic();
  const [orderId, setOrderId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Fetch order details
  const {
    isPending,
    data: order,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["track-order", orderId, phoneNumber],
    queryFn: async () => {
      if (!orderId || !phoneNumber) return null;
      const res = await axiosPublic.get("/orders/track", {
        params: { orderId, phoneNumber },
      });
      return res.data && res.data.data;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderId.trim() && phoneNumber.trim()) {
      setSearchTriggered(true);
      refetch();
    }
  };

  const handleReset = () => {
    setOrderId("");
    setPhoneNumber("");
    setSearchTriggered(false);
  };

  // Delivery status timeline
  const getDeliveryTimeline = (status) => {
    const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
    const currentIndex = statuses.indexOf(status);

    return statuses.map((s, index) => ({
      status: s,
      completed: index <= currentIndex,
      active: s === status,
    }));
  };

  // Status icon helper
  const getStatusIcon = (status) => {
    const icons = {
      Pending: <MdPending size={24} />,
      Processing: <BiPackage size={24} />,
      Shipped: <FaTruck size={24} />,
      Delivered: <FaCheckCircle size={24} />,
    };
    return icons[status] || <BsBoxSeam size={24} />;
  };

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Track Order", active: true },
  ];

  return (
    <div className="relative w-full h-auto ">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-5 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-700 text-primary-50 mb-6 shadow-lg shadow-primary-700/20">
            <FaShippingFast size={40} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Track Your Order
          </h1>
          <p className="max-w-2xl mx-auto text-base">
            Enter your Order ID and Phone Number to track your order status and
            delivery information.
          </p>
        </div>
        {/* Loading State */}
        {isPending && searchTriggered && (
          <div className="flex justify-center items-center py-20">
            Please wait...
          </div>
        )}
        {/* Error State */}
        {(searchTriggered && isError) ||
          (searchTriggered && !order ? (
            <div className="alert mx-auto mt-10 w-full max-w-5xl border-danger/20 bg-red-50 p-5 text-center dark:bg-red-950/30">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100  text-red-500 mb-4">
                <BsBoxSeam size={32} />
              </div>
              <h3 className="text-xl font-bold text-red-600  mb-2">
                Order Not Found
              </h3>
              <p className="text-red-600  mb-4">
                We couldn&apos;t find an order with the provided Order ID and
                Phone Number.
              </p>
              <p className="text-sm text-primary-700  mb-6">
                Please check your Order ID and Phone Number and try again.
              </p>

              <button onClick={handleReset} className="btn secondary-btn">
                <FaSearch size={16} />
                Try Again
              </button>
            </div>
          ) : !isPending && order && searchTriggered ? (
            <div className="w-full lg:max-w-5xl mx-auto space-y-5 mt-10">
              {/* Order Details */}
              <div>
                {/* Order Status Banner */}
                <div className="rounded-t-2xl bg-primary-700 p-5 text-primary-50">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Hello,</p>
                      <h2 className="text-2xl lg:text-3xl font-bold">
                        {order?.customerInfo?.name}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Delivery Timeline */}
                <div className="surface rounded-b-2xl p-5">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-2 border-b border-dashed border-border-color pb-3">
                    <BsClockHistory className="text-primary-500" />
                    Delivery Status
                  </h3>

                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary-100  hidden md:block"></div>

                  {/* Timeline Steps */}
                  <div className="space-y-8">
                    {getDeliveryTimeline(order?.deliveryStatus).map(
                      (step, index) => (
                        <div key={index} className="relative flex items-start">
                          {/* Icon Container */}
                          <div
                            className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${
                              step.completed
                                ? "bg-primary-800 border-primary-200  text-primary-50"
                                : "bg-primary-100 border-border-color text-primary-400"
                            } transition-all duration-300`}
                          >
                            {getStatusIcon(step.status)}
                          </div>

                          {/* Content */}
                          <div className="ml-6 flex-1">
                            <h4
                              className={`text-lg font-semibold mb-1 ${
                                step.active
                                  ? "text-primary-500"
                                  : step.completed
                                    ? ""
                                    : "text-primary-400"
                              }`}
                            >
                              {step.status}
                            </h4>
                            <p className="text-sm text-primary-600 ">
                              {step.status === "Pending" &&
                                "Your order has been received and is waiting to be processed."}
                              {step.status === "Processing" &&
                                "Your order is being prepared for shipment."}
                              {step.status === "Shipped" &&
                                "Your order is on the way to your location."}
                              {step.status === "Delivered" &&
                                "Your order has been successfully delivered."}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  {/* Reset Button */}
                  <div className="mt-8 pt-6 border-t border-border-color text-center">
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 bg-primary-100 hover:bg-primary-300   text-primary-800  rounded-md font-medium transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <FaSearch size={16} />
                      Clear Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Support Info */}
              <div className="bg-primary-950  border border-border-color rounded-md p-5 text-center">
                <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                <p className="text-sm mb-4">
                  If you have any questions about your order, please contact our
                  support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/support"
                    className="px-6 py-2.5 bg-primary-950  rounded-md font-medium transition-all duration-300"
                  >
                    Contact Support
                  </Link>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-primary-100 hover:bg-primary-300   rounded-md font-medium transition-all duration-300 cursor-pointer"
                  >
                    Track Another Order
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full lg:max-w-5xl mx-auto space-y-5">
              {/* Order Search Form */}
              <form
                onSubmit={handleSearch}
                className="bg-primary-950  border border-border-color rounded-md p-5 shadow-sm"
              >
                <div className="space-y-5">
                  {/* Order ID Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Order ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter your order ID"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="w-full px-4 py-3 pl-12 rounded-md border border-border-color bg-primary-950  focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                        required
                      />
                      <BsBoxSeam
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400"
                      />
                    </div>
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-3 pl-12 rounded-md border border-border-color bg-primary-950  focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                        required
                      />
                      <FaPhone
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-center items-center gap-3">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 px-6 py-3 bg-primary-950  rounded-md font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <FaSearch size={18} />
                      {isPending ? "Searching..." : "Track Order"}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-3 bg-primary-100 hover:bg-primary-300   rounded-md font-medium transition-all duration-300 cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ))}

        <p className="text-sm lg:text-base mt-10 text-center">
          <span>For manage your orders, please </span>
          <Link
            to="/auth/sign-up"
            className="text-blue-500 hover:text-blue-400 italic underline"
          >
            Sign Up{" "}
          </Link>{" "}
          /{" "}
          <Link
            to="/auth/sign-in"
            className="text-blue-500 hover:text-blue-400 italic underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default TrackOrder;
