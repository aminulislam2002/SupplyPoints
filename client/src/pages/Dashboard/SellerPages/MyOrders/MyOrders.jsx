import { useState } from "react";
import { Link } from "react-router";
import {
  FaSearch,
  FaFilter,
  FaBoxOpen,
  FaTruck,
  FaCheck,
  FaTimesCircle,
  FaEye,
} from "react-icons/fa";
import { MdPending } from "react-icons/md";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import Swal from "sweetalert2";

const MyOrders = () => {
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [sortQuery, setSortQuery] = useState("");
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);
  // States for update delivery status
  const [isDeliveryStatusLoading, setIsDeliveryStatusLoading] = useState(false);
  const [deliveryStatusUpdateProductId, setDeliveryStatusUpdateProductId] =
    useState("");

  const params = {
    currentPage,
    limitPerPage,
    searchQuery,
    sortQuery,
    deliveryStatus,
  };

  // Fetch all orders
  const {
    isPending,
    isFetching,
    data: allOrdersResponse = {}, // Default to an empty object
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ["orders", params],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey;
      const res = await axiosSecure.get("/orders/my-orders", { params: p });

      return res.data;
    },

    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  // Destructure data and hasMore
  const { data: myOrders = [], totalOrders, hasMore } = allOrdersResponse;

  const currentPageProfit = myOrders.reduce(
    (sum, order) => sum + Number(order?.totalProfit + 10 || 0),
    0,
  );

  const pendingCount = myOrders.filter(
    (order) => order?.deliveryStatus === "Pending",
  ).length;

  const deliveredCount = myOrders.filter(
    (order) => order?.deliveryStatus === "Delivered",
  ).length;

  const cancelledCount = myOrders.filter(
    (order) => order?.deliveryStatus === "Cancelled",
  ).length;

  const getStatusStyles = (status) => {
    if (status === "Pending") {
      return "text-yellow-700 bg-yellow-100";
    }

    if (status === "Confirmed") {
      return "text-blue-700 bg-blue-100";
    }

    if (status === "Shipped") {
      return "text-indigo-700 bg-indigo-100";
    }

    if (status === "Delivered") {
      return "text-green-700 bg-green-100";
    }

    if (status === "Cancelled") {
      return "text-red-700 bg-red-100";
    }

    return "text-primary-700 bg-primary-100";
  };

  const getStatusIcon = (status) => {
    if (status === "Pending") {
      return <MdPending size={18} />;
    }

    if (status === "Confirmed") {
      return <FaCheck size={18} />;
    }

    if (status === "Shipped") {
      return <FaTruck size={18} />;
    }

    if (status === "Delivered") {
      return <FaCheck size={18} />;
    }

    if (status === "Cancelled") {
      return <FaTimesCircle size={18} />;
    }

    return <FaBoxOpen size={18} />;
  };

  const isFiltering = Boolean(searchQuery || deliveryStatus || sortQuery);

  const handleResetAllQuery = () => {
    setIsResetQueryLoading(true); // Start the loading animation
    try {
      // Reset all states
      setSearchQuery("");
      setSortQuery("");
      setDeliveryStatus("");
      setLimitPerPage("5");
      setCurrentPage(0);
    } catch (error) {
      console.error(error);
    } finally {
      // Delay stopping the animation slightly
      setTimeout(() => {
        setIsResetQueryLoading(false); // Stop the loading animation
      }, 500);
    }
  };

  // Update Delivery Status
  const handleUpdateDeliveryStatus = async (deliveryStatus, productId) => {
    setIsDeliveryStatusLoading(true);
    setDeliveryStatusUpdateProductId(productId);

    try {
      const res = await axiosSecure.put(
        `/orders/delivery-status/${productId}`,
        {
          deliveryStatus,
        },
      );

      const successMessage = res?.data?.message || "Success";
      Swal.fire({
        title: successMessage,
        icon: "success",
        draggable: true,
      });
      refetch();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      Swal.fire({
        title: errorMessage,
        icon: "error",
        draggable: true,
      });
    } finally {
      setIsDeliveryStatusLoading(false);
      setDeliveryStatusUpdateProductId("");
      setDeliveryStatus("");
    }
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">My Orders</h1>
            <p className="text-sm text-text-secondary mt-1">
              Monitor order status, payment details, and item-level performance
            </p>
          </div>

          <div className="inline-flex h-10 items-center px-4 rounded-md surface-muted text-sm font-medium">
            Total Orders: {totalOrders || 0}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Current Page Profit</p>
          <p className="text-xl font-semibold mt-1 text-green-400">
            ৳{currentPageProfit.toFixed(2)}
          </p>
        </div>

        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Pending</p>
          <p className="text-xl font-semibold mt-1 text-yellow-400">
            {pendingCount}
          </p>
        </div>

        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Delivered</p>
          <p className="text-xl font-semibold mt-1 text-green-400">
            {deliveredCount}
          </p>
        </div>

        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Cancelled</p>
          <p className="text-xl font-semibold mt-1 text-red-400">
            {cancelledCount}
          </p>
        </div>
      </div>

      <div className="card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-primary-400" />
          <h2 className="font-semibold">Filters and Controls</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3">
          <div className="xl:col-span-4 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
            <input
              type="text"
              placeholder="Search by order ID or product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="control w-full h-10 px-3 pl-10 text-sm border focus:outline-none"
            />
          </div>

          <div className="xl:col-span-2">
            <select
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value)}
              className="control w-full h-10 px-3 text-sm border focus:outline-none"
            >
              <option value="">All Statuses</option>
              {[
                "Pending",
                "Confirmed",
                "Shipped",
                "Delivered",
                "Cancelled",
              ].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="xl:col-span-2">
            <select
              value={sortQuery}
              onChange={(e) => setSortQuery(e.target.value)}
              className="control w-full h-10 px-3 text-sm border focus:outline-none"
            >
              <option value="">Sort (Default)</option>
              {[
                { value: "added_desc", label: "Newest First" },
                { value: "added_asc", label: "Oldest First" },
                { value: "total_desc", label: "Total High-Low" },
                { value: "total_asc", label: "Total Low-High" },
              ].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="xl:col-span-2 flex items-center gap-2">
            <label htmlFor="limitPerPage" className="text-sm font-medium">
              Show
            </label>
            <select
              id="limitPerPage"
              value={limitPerPage}
              onChange={(e) => setLimitPerPage(e.target.value)}
              className="control w-full h-10 px-3 text-sm border focus:outline-none"
            >
              {["5", "10", "20", "50", "100"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="xl:col-span-2 flex justify-end">
            <button
              onClick={handleResetAllQuery}
              className="btn btn-primary inline-flex w-10 h-10 items-center justify-center rounded-md text-white transition-colors duration-300"
              title="Reset filters"
            >
              <TfiReload
                size={14}
                className={isResetQueryLoading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {isFetching && isPlaceholderData ? (
          <div className="card p-12 text-center">
            <FaBoxOpen size={52} className="mx-auto text-primary-300 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Loading orders...</h3>
            <p className="text-sm text-text-secondary">
              Please wait while we fetch your orders.
            </p>
          </div>
        ) : myOrders?.length > 0 ? (
          myOrders.map((order) => (
            <div
              key={order?.id}
              className="card shadow-sm overflow-hidden"
            >
              <div className="control p-4 sm:p-5 border-b">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-md ${getStatusStyles(order?.deliveryStatus)}`}
                    >
                      {getStatusIcon(order?.deliveryStatus)}
                    </div>

                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        ID: {order?.orderId}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        Placed on{" "}
                        {new Date(order?.addedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* <div className="text-left md:text-right">
                    <p className="text-xs text-text-secondary">Profit</p>
                    <p className="font-semibold text-green-400 text-base">
                      ৳{order?.totalProfit}
                    </p>
                  </div> */}
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3">
                {order?.products?.map((product, index) => (
                  <div
                    key={index}
                    className="control border p-3"
                  >
                    <div className="flex gap-3">
                      <div className="control w-20 h-16 shrink-0 overflow-hidden border">
                        {product?.thumbnail ? (
                          <img
                            src={
                              import.meta.env.VITE_IMAGE_URL +
                              product?.thumbnail
                            }
                            className="w-full h-full object-cover"
                            alt={product?.title}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaBoxOpen className="text-primary-300" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">
                          {product?.title}
                        </p>
                        <p className="text-xs text-text-secondary mt-1">
                          Code: {product?.productCode}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-xs text-text-secondary">
                            Qty: {product?.selectedQuantity}
                          </p>
                          <p className="font-semibold text-sm text-primary-300">
                            ৳
                            {(
                              Number(product?.resellerPrice || 0) *
                              Number(product?.selectedQuantity || 0)
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="control pt-3 border-t flex flex-wrap items-center gap-2">
                  {order?.deliveryStatus === "Pending" ? (
                    <button
                      onClick={() =>
                        handleUpdateDeliveryStatus("Cancelled", order?._id)
                      }
                      disabled={isDeliveryStatusLoading}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-700 text-red-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deliveryStatusUpdateProductId === order?._id &&
                      isDeliveryStatusLoading
                        ? "Updating..."
                        : "Mark as Cancelled"}
                    </button>
                  ) : (
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyles(order?.deliveryStatus)}`}
                    >
                      {order?.deliveryStatus}
                    </span>
                  )}

                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      order?.deliveryPaymentMethod === "COD"
                        ? "text-amber-700 bg-amber-100"
                        : order?.deliveryPaymentMethod === "Balance"
                          ? "text-blue-700 bg-blue-100"
                          : "text-emerald-700 bg-emerald-100"
                    }`}
                  >
                    {order?.deliveryPaymentMethod === "COD"
                      ? "Cash On Delivery"
                      : order?.deliveryPaymentMethod === "Balance"
                        ? "Balance"
                        : "Manual"}
                    {order?.deliveryPaymentStatus
                      ? ` (${order?.deliveryPaymentStatus})`
                      : ""}
                  </span>

                  {order?.advanceAmount > 0 && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium text-indigo-700 bg-indigo-100">
                      Advance: ৳{order?.advanceAmount?.toFixed(2)}
                    </span>
                  )}

                  <Link
                    to={`/dashboard/order-details/${order?._id}`}
                    className="btn btn-primary inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-white text-xs font-medium transition-colors duration-300"
                  >
                    <FaEye size={12} />
                    Details
                  </Link>

                  {order?.deliveryInfo?.courierTracking && (
                    <Link
                      to={order?.deliveryInfo?.courierTracking}
                      target="_blank"
                      className="btn btn-outline px-3 py-1.5 text-xs font-medium"
                    >
                      Tracking
                    </Link>
                  )}

                  {order?.deliveryInfo?.courierMessage && (
                    <div className="w-full px-3 py-2 rounded-md bg-cyan-100 text-cyan-800 text-xs sm:text-sm">
                      {order?.deliveryInfo?.courierMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card p-12 text-center">
            <FaBoxOpen size={52} className="mx-auto text-primary-300 mb-3" />
            <h3 className="text-lg font-semibold mb-1">No orders found</h3>
            <p className="text-sm text-text-secondary mb-5">
              {isFiltering
                ? "Try changing search or filter options."
                : "You have not placed any orders yet."}
            </p>

            {!isFiltering && (
              <Link
                to="/products"
                className="btn btn-primary inline-flex h-10 px-5 items-center justify-center rounded-md text-white text-sm font-medium transition-colors duration-300"
              >
                Start Shopping
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center sm:justify-end gap-3">
        <button
          className={
            currentPage === 0
              ? "w-9 h-9 rounded-md bg-section-bg text-primary-300 cursor-not-allowed"
              : "w-9 h-9 rounded-md bg-primary-700 hover:bg-primary-600 transition-colors duration-300"
          }
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          <IoIosArrowBack size={18} className="mx-auto" />
        </button>

        <span className="min-w-8 text-center text-sm font-medium">
          {currentPage + 1}
        </span>

        <button
          className={
            isPlaceholderData || !hasMore
              ? "w-9 h-9 rounded-md bg-section-bg text-primary-300 cursor-not-allowed"
              : "w-9 h-9 rounded-md bg-primary-700 hover:bg-primary-600 transition-colors duration-300"
          }
          onClick={() => {
            if (!isPlaceholderData && hasMore) {
              setCurrentPage((prev) => prev + 1);
            }
          }}
          disabled={isPlaceholderData || !hasMore}
        >
          <IoIosArrowForward size={18} className="mx-auto" />
        </button>
      </div>
    </div>
  );
};

export default MyOrders;
