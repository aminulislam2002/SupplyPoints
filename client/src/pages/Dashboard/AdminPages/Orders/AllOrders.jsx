import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import { Link } from "react-router";
import { LuEye } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";
import { FaRegEdit } from "react-icons/fa";
import DeliveryPaymentModal from "./DeliveryPaymentModal";
import TrackingUpdateModal from "./TrackingUpdateModal";
import { TbTruckDelivery } from "react-icons/tb";

const AllOrders = () => {
  const axiosSecure = useAxiosSecure();
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Current page number
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortQuery, setSortQuery] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [deliveryPaymentStatus, setDeliveryPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // States for update delivery status
  const [isDeliveryStatusLoading, setIsDeliveryStatusLoading] = useState(false);
  const [deliveryStatusUpdateProductId, setDeliveryStatusUpdateProductId] =
    useState("");
  // States for update payment status
  const [isPaymentStatusLoading, setIsPaymentStatusLoading] = useState(false);
  const [paymentStatusUpdateProductId, setPaymentStatusUpdateProductId] =
    useState("");
  // States for update tracking info
  const [isTrackingInfoLoading, setIsTrackingInfoLoading] = useState(false);
  const [trackingInfoUpdateOrderId, setTrackingInfoUpdateOrderId] =
    useState("");

  // Modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const params = {
    currentPage,
    limitPerPage,
    searchQuery,
    sortQuery,
    deliveryStatus,
    deliveryPaymentStatus,
    paymentMethod,
  };

  // Fetch all orders
  const {
    isPending,
    isFetching,
    data: allOrdersResponse = {}, // Default to an empty object
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["orders", params],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey;
      const res = await axiosSecure.get("/orders", { params: p });

      return res.data;
    },

    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  // Destructure data and hasMore
  const { data: allOrders = [], totalOrders, hasMore } = allOrdersResponse;

  const handleResetAllQuery = () => {
    setIsResetQueryLoading(true); // Start the loading animation
    try {
      // Reset all states
      setSearchQuery("");
      setSortQuery("");
      setDeliveryStatus("");
      setDeliveryPaymentStatus("");
      setPaymentMethod("");
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

  // Update Delivery Payment Status
  const handleUpdateDeliveryPaymentStatus = async (status, orderId) => {
    setIsPaymentStatusLoading(true);
    setPaymentStatusUpdateProductId(orderId);

    try {
      const res = await axiosSecure.put(
        `/orders/delivery-payment-status/${orderId}`,
        {
          deliveryPaymentStatus: status,
        },
      );

      const successMessage =
        res?.data?.message || "Delivery payment status updated successfully!";
      Swal.fire({
        title: successMessage,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      refetch();
      setIsPaymentModalOpen(false);
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
      setIsPaymentStatusLoading(false);
      setPaymentStatusUpdateProductId("");
    }
  };

  // Open delivery payment modal
  const handleOpenDeliveryPaymentModal = (order) => {
    setSelectedOrder(order);
    setIsPaymentModalOpen(true);
  };

  // Open tracking update modal
  const handleOpenTrackingModal = (order) => {
    setSelectedOrder(order);
    setIsTrackingModalOpen(true);
  };

  // Close delivery payment modal
  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedOrder(null);
  };

  // Close tracking update modal
  const handleCloseTrackingModal = () => {
    setIsTrackingModalOpen(false);
    setSelectedOrder(null);
  };

  // Update courier tracking info
  const handleUpdateTracking = async (data, orderId) => {
    setIsTrackingInfoLoading(true);
    setTrackingInfoUpdateOrderId(orderId);

    try {
      const payload = {
        courierTracking: data?.currierTracking || data?.courierTracking,
        courierMessage: data?.courierMessage,
        platformCode: data?.platformCode,
      };

      const res = await axiosSecure.patch(
        `/orders/courier-info/${orderId}`,
        payload,
      );

      const successMessage =
        res?.data?.message || "Courier info updated successfully!";
      Swal.fire({
        title: successMessage,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      refetch();
      setIsTrackingModalOpen(false);
      setSelectedOrder(null);
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
      setIsTrackingInfoLoading(false);
      setTrackingInfoUpdateOrderId("");
    }
  };

  // Delete an order
  const handleDeleteOrder = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/orders/${id}`);
          const successMessage = res?.data?.message || "Success";
          Swal.fire({
            title: "Deleted!",
            text: successMessage,
            icon: "success",
          });
          refetch();
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
      }
    });
  };

  if (isPending && allOrders.length === 0) {
    return <Loader></Loader>;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      {/* Search and reset button */}
      <div className="flex flex-col items-start justify-between gap-3 border-b border-border-color pb-4 lg:flex-row lg:items-center">
        <h3 className="page-title text-xl">Orders - {totalOrders}</h3>

        <div className="w-full lg:w-1/3 flex justify-between items-center gap-2.5">
          {/* Search Input */}
          <div className="w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Customer..."
              className="control h-10"
            />
          </div>

          <button
            onClick={handleResetAllQuery}
            className="btn-icon h-10 w-10"
          >
            <TfiReload
              size={15}
              className={isResetQueryLoading ? "animate-spin" : ""}
            ></TfiReload>
          </button>
        </div>
      </div>

      {/* Filter, sort and pagination query */}
      <div className="py-2.5">
        <div className="flex flex-wrap justify-start items-center gap-2.5">
          {/* Delivery Status Selected */}
          <div className="relative">
            <select
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value)}
              className="control h-10"
            >
              <option value="">Delivery Status</option>
              {[
                "Pending",
                "Confirmed",
                "Shipped",
                "Delivered",
                "Cancelled",
                "Returned",
                "Out of Stock",
              ]?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Selected */}
          <div className="relative">
            <select
              value={deliveryPaymentStatus}
              onChange={(e) => setDeliveryPaymentStatus(e.target.value)}
              className="control h-10"
            >
              <option value="">Delivery Payment</option>
              {["Pending", "Paid", "Unpaid"]?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selected */}
          <div className="relative">
            <select
              value={sortQuery}
              onChange={(e) => setSortQuery(e.target.value)}
              className="control h-10"
            >
              <option value="">Sort by (Default)</option>
              {[
                { value: "added_desc", label: "Newest First" },
                { value: "added_asc", label: "Oldest First" },
                { value: "total_desc", label: "Total (High to Low)" },
                { value: "total_asc", label: "Total (Low to High)" },
              ]?.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Page Limit selected */}
          <div className="relative flex items-center gap-2.5">
            <label htmlFor="limitPerPage" className="text-base font-medium ">
              Show
            </label>
            <select
              id="limitPerPage"
              value={limitPerPage}
              onChange={(e) => setLimitPerPage(e.target.value)}
              className="control h-10"
            >
              {["5", "10", "20", "50", "100"]?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-shell">
        <table className="table">
          <thead className="bg-section-bg">
            <tr className="h-10 text-sm text-nowrap font-normal text-center">
              <th>#</th>
              {/* <th>Date & Time</th> */}
              <th>Reseller</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Delivery Status</th>
              <th>Delivery Payment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="10">Fetching...</td>
              </tr>
            ) : allOrders?.length === 0 ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="10">No orders found.</td>
              </tr>
            ) : (
              allOrders?.map((order, index) => (
                <tr
                  key={order._id}
                  className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color"
                >
                  <th>{currentPage * limitPerPage + index + 1}</th>
                  {/* <td>
                    {order?.addedAt
                      ? new Date(order.addedAt).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                      : "N/A"}
                  </td> */}
                  <td className="font-medium">
                    {order?.sellerName || "N/A"}
                    <br />
                    {order.identifier}
                    {order?.sellerCurBal && (
                      <span
                        className={
                          order?.sellerCurBal > 0
                            ? "text-green-600"
                            : order?.sellerCurBal < 0
                              ? "text-red-500"
                              : "text-gray-500"
                        }
                      >
                        {" - "}৳{order?.sellerCurBal?.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="font-semibold">
                    #{order.orderId} <br />
                    {order?.deliveryInfo?.platformCode && (
                      <span className="text-blue-500">
                        {order?.deliveryInfo?.platformCode}
                      </span>
                    )}
                  </td>
                  <td className="font-medium">
                    {order.customerInfo?.name} <br />
                    {order.customerInfo?.number}
                  </td>

                  <td className="font-semibold">
                    ৳{" "}
                    {(
                      order.resellerPrice + order.deliveryInfo?.deliveryCharge
                    )?.toFixed(2)}{" "}
                    <br />
                    {order?.advanceAmount > 0 && (
                      <span className="text-xs font-semibold text-indigo-700">
                        Adv: ৳{order?.advanceAmount?.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="relative">
                      <select
                        value={order?.deliveryStatus || deliveryStatus}
                        onChange={(e) =>
                          handleUpdateDeliveryStatus(e.target.value, order?._id)
                        }
                        className={`w-full h-9 bg-light  border border-border-color rounded focus:outline-none focus:border-blue-500  focus:transition-colors focus:duration-300 px-2.5 font-primary text-base font-medium ${
                          order?.deliveryStatus === "Pending"
                            ? "text-yellow-500"
                            : order?.deliveryStatus === "Confirmed"
                              ? "text-blue-500"
                              : order?.deliveryStatus === "Shipped"
                                ? "text-purple-500"
                                : order?.deliveryStatus === "Delivered"
                                  ? "text-green-600"
                                  : order?.deliveryStatus === "Returned"
                                    ? "text-orange-500"
                                    : order?.deliveryStatus === "Out of Stock"
                                      ? "text-red-500"
                                      : "text-gray-300"
                        }`}
                      >
                        {[
                          "Pending",
                          "Confirmed",
                          "Shipped",
                          "Delivered",
                          "Cancelled",
                          "Returned",
                          "Out of Stock",
                        ]?.map((option, index) => (
                          <option key={index} value={option}>
                            {deliveryStatusUpdateProductId == order?._id &&
                            isDeliveryStatusLoading
                              ? "Wait..."
                              : option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      {(order?.deliveryPaymentMethod && (
                        <>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              order?.deliveryPaymentMethod === "Balance"
                                ? "bg-blue-100 text-blue-700  "
                                : order?.deliveryPaymentMethod === "COD"
                                  ? "bg-amber-100 text-amber-700  "
                                  : "bg-green-100 text-green-700  "
                            }`}
                          >
                            {order?.deliveryPaymentMethod === "Balance"
                              ? "Balance"
                              : order?.deliveryPaymentMethod === "COD"
                                ? "COD"
                                : "Manual"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ml-1 ${
                              order?.deliveryPaymentStatus === "Paid"
                                ? "bg-green-100 text-green-700  "
                                : "bg-yellow-100 text-yellow-700  "
                            }`}
                          >
                            {order?.deliveryPaymentStatus}
                          </span>
                        </>
                      )) || (
                        <span className="text-primary-400 text-xs">N/A</span>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="h-full flex justify-end items-center gap-2">
                      {/* Only show edit button for manual pending payments */}
                      {order?.deliveryPaymentStatus !== "Paid" && (
                        <button
                          title="Manage Delivery Payment"
                          onClick={() => handleOpenDeliveryPaymentModal(order)}
                          className="cursor-pointer bg-primary-950  p-2 rounded-full hover:bg-primary-100  transition-colors"
                        >
                          <FaRegEdit
                            className="text-blue-500"
                            size={18}
                          ></FaRegEdit>
                        </button>
                      )}

                      <button
                        title="Update Tracking"
                        onClick={() => handleOpenTrackingModal(order)}
                        className="cursor-pointer bg-primary-950  p-2 rounded-full hover:bg-primary-100  transition-colors"
                      >
                        <TbTruckDelivery
                          className="text-purple-500"
                          size={18}
                        ></TbTruckDelivery>
                      </button>

                      <button
                        title="Delete"
                        onClick={() => handleDeleteOrder(order._id)}
                        className="cursor-pointer bg-primary-950  p-2 rounded-full"
                      >
                        <RiDeleteBin6Line
                          className="text-red-500"
                          size={18}
                        ></RiDeleteBin6Line>
                      </button>

                      <Link
                        title="View"
                        to={`/dashboard/order-details/${order?._id}`}
                        className="cursor-pointer bg-primary-950  p-2 rounded-full"
                      >
                        <LuEye size={20} className="text-green-500" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Button */}
      <div className="px-2.5 py-1.5 lg:px-5 lg:py-2.5 flex justify-center lg:justify-end items-center gap-2.5">
        <button
          className={
            currentPage === 0
              ? "bg-primary-200  text-primary-600 cursor-not-allowed rounded-md p-1.5"
              : "bg-primary-950  rounded-md p-1.5 transition-colors duration-300 cursor-pointer"
          }
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          <IoIosArrowBack size={20}></IoIosArrowBack>
        </button>

        <span className="text-base font-medium ">{currentPage + 1}</span>

        <button
          className={
            isPlaceholderData || !hasMore
              ? "bg-primary-200  text-primary-600 cursor-not-allowed rounded-md p-1.5"
              : "bg-primary-950  rounded-md p-1.5 transition-colors duration-300 cursor-pointer"
          }
          onClick={() => {
            if (!isPlaceholderData && hasMore) {
              setCurrentPage((prev) => prev + 1);
            }
          }}
          disabled={isPlaceholderData || !hasMore}
        >
          <IoIosArrowForward size={20}></IoIosArrowForward>
        </button>
      </div>

      {/* Delivery Payment Modal */}
      <DeliveryPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        order={selectedOrder}
        onUpdatePaymentStatus={handleUpdateDeliveryPaymentStatus}
        isLoading={
          isPaymentStatusLoading &&
          paymentStatusUpdateProductId === selectedOrder?._id
        }
      />

      <TrackingUpdateModal
        isOpen={isTrackingModalOpen}
        onClose={handleCloseTrackingModal}
        order={selectedOrder}
        onUpdateTracking={handleUpdateTracking}
        isLoading={
          isTrackingInfoLoading &&
          trackingInfoUpdateOrderId === selectedOrder?._id
        }
      />
    </div>
  );
};

export default AllOrders;
