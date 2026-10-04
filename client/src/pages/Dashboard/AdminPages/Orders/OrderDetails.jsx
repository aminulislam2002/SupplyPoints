import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { IoArrowBack } from "react-icons/io5";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaArrowDown,
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaCopy,
} from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import Loader from "../../../../components/Loader/Loader";
import useRole from "../../../../hooks/useRole/useRole";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { isRolePending, isUser, isAdmin, isSeller } = useRole();
  const [copiedField, setCopiedField] = useState(null);

  // Copy to clipboard handler
  const handleCopy = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Fetch order details
  const {
    isPending,
    data: order,
    refetch,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/orders/${id}`);
      return res.data && res.data.data;
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch, id]);

  if (isPending || isRolePending) {
    return <Loader />;
  }

  const navigateTo = isAdmin
    ? "/dashboard/admin/orders"
    : isSeller || isUser
      ? "/dashboard/seller/my-orders"
      : "/dashboard/user/my-orders";

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center p-5">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <button
          onClick={() => navigate(navigateTo)}
          className="btn btn-primary"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-5 sm:p-6">
      {/* Header with Back Button */}
      <div className="py-1.5 lg:py-2.5 border-b border-dashed border-border-color flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(navigateTo)}
            className="btn-icon h-10 w-10"
          >
            <IoArrowBack size={20} />
          </button>
          <div>
            <h3 className="text-lg font-medium">Order Details</h3>
            <p className="text-sm text-gray-300">
              Order ID:{" "}
              <span className="font-semibold text-primary-500">
                {order?.orderId}
              </span>
            </p>
          </div>
        </div>
        <Link
          to={`/invoice/order/${order?._id}`}
          className="btn btn-outline invisible gap-2"
        >
          Invoice <FaArrowDown size={18} />
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-5">
        {/* Left Column - Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information Card */}
          <div className="card p-5">
            <h4 className="text-base font-semibold mb-4 pb-3 border-b border-border-color flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary-500" />
              Customer Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300 mb-1">Customer Name</p>
                <div className="flex items-center justify-start gap-2">
                  <p className="font-medium">{order?.customerInfo?.name}</p>
                  <button
                    onClick={() =>
                      handleCopy(order?.customerInfo?.name, "name")
                    }
                    className="p-1.5 text-primary-600 hover:text-primary-50 rounded transition-colors duration-300 cursor-pointer"
                    title="Copy name"
                  >
                    <FaCopy
                      size={12}
                      className={copiedField === "name" ? "text-green-500" : ""}
                    />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-300 mb-1">Phone Number</p>
                <div className="flex items-center justify-start gap-2">
                  <p className="font-medium flex items-center gap-2">
                    <FaPhone className="text-primary-500" size={14} />
                    {order?.customerInfo?.number}
                  </p>
                  <button
                    onClick={() =>
                      handleCopy(order?.customerInfo?.number, "phone")
                    }
                    className="p-1.5 text-primary-600 hover:text-primary-50 rounded transition-colors duration-300 cursor-pointer"
                    title="Copy phone number"
                  >
                    <FaCopy
                      size={12}
                      className={
                        copiedField === "phone" ? "text-green-500" : ""
                      }
                    />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-300 mb-1">District</p>
                <div className="flex items-center justify-start gap-2">
                  <p className="font-medium">{order?.customerInfo?.zilla}</p>
                  <button
                    onClick={() =>
                      handleCopy(order?.customerInfo?.zilla, "district")
                    }
                    className="p-1.5 text-primary-600 hover:text-primary-50 rounded transition-colors duration-300 cursor-pointer"
                    title="Copy district"
                  >
                    <FaCopy
                      size={12}
                      className={
                        copiedField === "district" ? "text-green-500" : ""
                      }
                    />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-300 mb-1">Thana</p>
                <div className="flex items-center justify-start gap-2">
                  <p className="font-medium">{order?.customerInfo?.thana}</p>
                  <button
                    onClick={() =>
                      handleCopy(order?.customerInfo?.thana, "thana")
                    }
                    className="p-1.5 text-primary-600 hover:text-primary-50 rounded transition-colors duration-300 cursor-pointer"
                    title="Copy thana"
                  >
                    <FaCopy
                      size={12}
                      className={
                        copiedField === "thana" ? "text-green-500" : ""
                      }
                    />
                  </button>
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-300 mb-1">Address</p>
                <div className="flex items-center justify-start gap-2">
                  <p className="font-medium">{order?.customerInfo?.address}</p>
                  <button
                    onClick={() =>
                      handleCopy(order?.customerInfo?.address, "address")
                    }
                    className="p-1.5 text-primary-600 hover:text-primary-50 rounded transition-colors duration-300 cursor-pointer"
                    title="Copy address"
                  >
                    <FaCopy
                      size={12}
                      className={
                        copiedField === "address" ? "text-green-500" : ""
                      }
                    />
                  </button>
                </div>
              </div>
              {order?.customerInfo?.message && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-300 mb-1">Customer Message</p>
                  <div className="flex items-start justify-start gap-2">
                    <p className="font-medium text-primary-700  italic flex-1 pr-2">
                      "{order?.customerInfo?.message}"
                    </p>
                    <button
                      onClick={() =>
                        handleCopy(order?.customerInfo?.message, "message")
                      }
                      className="mt-1 p-1.5 text-primary-600 hover:text-primary-500 hover:bg-primary-50  rounded transition-all duration-200 shrink-0"
                      title="Copy message"
                    >
                      <FaCopy
                        size={12}
                        className={
                          copiedField === "message" ? "text-green-500" : ""
                        }
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Card */}
          <div className="card p-5">
            <h4 className="text-base font-semibold mb-4 pb-3 border-b border-border-color flex items-center gap-2">
              <BsBoxSeam className="text-primary-500" />
              Purchased Products ({order?.products?.length})
            </h4>
            <div className="space-y-4">
              {order?.products?.map((product, index) => (
                <div
                  key={index}
                  className="group relative flex flex-row gap-3 rounded-lg border border-border-color bg-section-bg p-3 transition-shadow duration-300 hover:shadow-sm sm:p-4"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-md border border-border-color">
                    <img
                      src={import.meta.env.VITE_IMAGE_URL + product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    {/* Title and Code */}
                    <div>
                      <h5 className="font-semibold text-sm sm:text-base mb-1 line-clamp-1">
                        {product.title}
                      </h5>
                      <p className="text-xs text-gray-300">
                        Code:{" "}
                        <span className="font-medium text-primary-800 ">
                          {product.productCode}
                        </span>
                      </p>
                    </div>

                    {/* Variant Info - Color & Size */}
                    {(product.selectedColor || product.selectedSize) && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {product.selectedColor && (
                          <div className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-primary-100 rounded-full text-xs font-medium">
                            <span className="text-gray-300">Color:</span>
                            <span className="text-primary-900 ">
                              {product.selectedColor}
                            </span>
                          </div>
                        )}
                        {product.selectedSize && (
                          <div className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-primary-100 rounded-full text-xs font-medium">
                            <span className="text-gray-300">Size:</span>
                            <span className="text-primary-900 ">
                              {product.selectedSize}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Price Information */}
                    <div className="space-y-3 pt-1.5 sm:pt-2 border-t border-border-color">
                      {/* Pricing Row */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <div>
                          <p className="text-xs text-gray-300 mb-0.5">Price</p>
                          <p className="text-sm font-bold text-primary-500">
                            ৳{product.price}
                          </p>
                        </div>

                        <div className="hidden sm:block h-8 w-px bg-primary-100 "></div>

                        <div>
                          <p className="text-xs text-gray-300 mb-0.5">Sale</p>
                          <p className="text-sm font-bold text-primary-500">
                            ৳{product.resellerPrice}
                          </p>
                        </div>

                        <div className="hidden sm:block h-8 w-px bg-primary-100 "></div>

                        <div>
                          <p className="text-xs text-gray-300 mb-0.5">QTY</p>
                          <p className="text-sm font-semibold">
                            {product.selectedQuantity}
                          </p>
                        </div>

                        <div className="hidden sm:block h-8 w-px bg-primary-100 "></div>

                        {product.profit && (
                          <>
                            <div>
                              <p className="text-xs text-green-600  mb-0.5">
                                Profit
                              </p>
                              <p className="text-sm font-bold text-green-600 ">
                                ৳{product.profit}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary & Status */}
        <div className="lg:col-span-1 space-y-6">
          {/* Delivery Payment Details Card */}
          {order?.deliveryPaymentMethod && (
            <div className="bg-primary-950  border border-border-color rounded p-5">
              <h4 className="text-base font-semibold mb-4 pb-3 border-b border-border-color flex items-center gap-2">
                {order?.deliveryPaymentMethod === "Balance" ? (
                  <MdAccountBalanceWallet className="text-blue-500" />
                ) : order?.deliveryPaymentMethod === "COD" ? (
                  <FaMoneyBillWave className="text-amber-500" />
                ) : (
                  <FaCreditCard className="text-green-500" />
                )}
                Delivery & Payment
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-gray-300 text-sm">Payment Method</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order?.deliveryPaymentMethod === "Balance"
                        ? "bg-blue-100 text-blue-700  "
                        : order?.deliveryPaymentMethod === "COD"
                          ? "bg-amber-100 text-amber-700  "
                          : "bg-green-100 text-green-700  "
                    }`}
                  >
                    {order?.deliveryPaymentMethod === "Balance"
                      ? "Balance Deduction"
                      : order?.deliveryPaymentMethod === "COD"
                        ? "Cash On Delivery"
                        : "Manual Payment"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-gray-300 text-sm">Delivery Area</p>
                  <p className="font-medium text-sm">
                    {order?.deliveryInfo?.deliveryArea || order?.deliveryArea}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-gray-300 text-sm">Payment Status</p>
                  <div className="flex items-center gap-2">
                    {order?.deliveryPaymentStatus === "Paid" ? (
                      <FaCheckCircle className="text-green-500" size={14} />
                    ) : (
                      <FaClock className="text-yellow-500" size={14} />
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        order?.deliveryPaymentStatus === "Paid"
                          ? "text-green-700 "
                          : "text-yellow-700 "
                      }`}
                    >
                      {order?.deliveryPaymentStatus}
                    </span>
                  </div>
                </div>

                {/* Manual Payment Details */}
                {order?.deliveryPaymentMethod === "Manual" &&
                  order?.deliveryPaymentInfo && (
                    <>
                      <div className="pt-3 border-t border-border-color">
                        <p className="text-sm font-semibold text-primary-800  mb-2">
                          Payment Details:
                        </p>
                      </div>

                      {/* Advance Amount */}
                      <div className="flex justify-between items-center">
                        <p className="text-gray-300 text-sm">Amount: </p>
                        <p className="font-bold text-indigo-600">
                          ৳{order?.advanceAmount?.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-gray-300 text-sm">Gateway</p>
                        <p className="font-medium text-sm">
                          {order?.deliveryPaymentInfo?.method ||
                            order?.deliveryPaymentInfo?.gateway}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-300 text-sm">Transaction ID</p>
                        <p className="font-mono text-sm bg-primary-100 px-2 py-1 rounded">
                          {order?.deliveryPaymentInfo?.transactionId ||
                            order?.deliveryPaymentInfo?.txnId}
                        </p>
                      </div>
                    </>
                  )}
              </div>
            </div>
          )}

          {/* Price Summary Card */}
          <div className="bg-primary-950  border border-border-color rounded p-5">
            <h4 className="text-base font-semibold mb-4 pb-3 border-b border-border-color flex items-center gap-2">
              <FaMoneyBillWave className="text-primary-500" />
              Financial Summary
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-300">Products Total</p>
                <p className="font-medium">
                  ৳{order?.productsPrice?.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-300">Reseller Price</p>
                <p className="font-medium">
                  ৳{order?.resellerPrice?.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-300">Delivery Charge</p>
                <p className="font-medium">
                  ৳{order?.deliveryInfo?.deliveryCharge?.toFixed(2)}
                </p>
              </div>

              <div className="border-t border-border-color"></div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-300">Total Amount:</p>
                <p className="font-medium">
                  ৳
                  {(
                    order?.resellerPrice + order?.deliveryInfo?.deliveryCharge
                  )?.toFixed(2)}
                </p>
              </div>

              {/* Advance Amount in Financial Summary */}
              {order?.advanceAmount > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-300">Advance Paid</p>
                    <p className="font-medium text-green-600">
                      ৳{order?.advanceAmount?.toFixed(2)}
                    </p>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-300">Due at Delivery</p>
                <p className="font-medium text-amber-600">
                  ৳
                  {(
                    (order?.resellerPrice || 0) +
                    (order?.deliveryInfo?.deliveryCharge || 0) -
                    (order?.advanceAmount || 0)
                  ).toFixed(2)}
                </p>
              </div>

              {isAdmin && (
                <>
                  <div className="border-t border-border-color"></div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-300">Packaging Charge</p>
                    <p className="font-medium text-red-500">
                      - ৳
                      {order?.deliveryInfo?.packagingCharge ||
                        order?.packagingCharge}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-300">COD Charge</p>
                    <p className="font-medium text-red-500">
                      - ৳{order?.deliveryInfo?.codCharge || order?.codCharge}
                    </p>
                  </div>
                  <div className="border-t border-border-color"></div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-base font-semibold">Seller Profit</p>
                    <p className="text-xl font-bold text-primary-500">
                      ৳{order?.totalProfit?.toFixed(2)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
