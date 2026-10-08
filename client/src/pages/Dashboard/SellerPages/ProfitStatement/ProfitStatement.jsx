import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";

const ProfitStatement = () => {
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);

  const params = {
    currentPage,
    limitPerPage,
    searchQuery,
    deliveryStatus: "Delivered",
  };

  // Fetch all orders
  const {
    isPending,
    isFetching,
    data: allOrdersResponse = {}, // Default to an empty object
    isPlaceholderData,
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

  const totalSales = myOrders.reduce(
    (sum, order) => sum + Number(order?.resellerPrice || 0),
    0,
  );

  const totalCost = myOrders.reduce(
    (sum, order) => sum + Number(order?.productsPrice || 0),
    0,
  );

  const totalProfit = myOrders.reduce(
    (sum, order) => sum + Number(order?.totalProfit || 0),
    0,
  );

  const handleResetAllQuery = () => {
    setIsResetQueryLoading(true);
    try {
      setSearchQuery("");
      setLimitPerPage(5);
      setCurrentPage(0);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsResetQueryLoading(false);
      }, 500);
    }
  };

  if (isPending && myOrders.length === 0) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Profit Statement</h1>
            <p className="text-sm text-text-secondary mt-1">
              Analyze delivered-order sales, costs, and profit performance
            </p>
          </div>
          <div className="inline-flex h-10 items-center px-4 rounded-md surface-muted text-sm font-medium">
            Total Delivered: {totalOrders || 0}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Total Sale (Page)</p>
          <p className="text-xl font-semibold text-primary-300 mt-1">
            ৳{totalSales.toFixed(2)}
          </p>
        </div>
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Total Cost (Page)</p>
          <p className="text-xl font-semibold text-amber-400 mt-1">
            ৳{totalCost.toFixed(2)}
          </p>
        </div>
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Total Profit (Page)</p>
          <p className="text-xl font-semibold text-green-400 mt-1">
            ৳{totalProfit.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="card p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="limitPerPage" className="text-sm font-medium">
              Show
            </label>
            <select
              id="limitPerPage"
              value={limitPerPage}
              onChange={(e) => setLimitPerPage(e.target.value)}
              className="control h-10 px-3 text-sm border focus:outline-none"
            >
              {["5", "10", "20", "50", "100"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleResetAllQuery}
            className="btn primary-btn w-10 h-10 text-white transition-colors duration-300 flex justify-center items-center rounded-md cursor-pointer"
            title="Reset filters"
          >
            <TfiReload
              size={14}
              className={isResetQueryLoading ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      <div className="card p-4 sm:p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="h-10 text-sm font-medium text-center">
                <th>Date & Time</th>
                <th>QTY</th>
                <th>Cost</th>
                <th>Sale</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              {isFetching && isPlaceholderData ? (
                <tr className="control h-12 text-sm text-center border-b">
                  <td colSpan="5">Fetching...</td>
                </tr>
              ) : myOrders?.length === 0 ? (
                <tr className="control h-12 text-sm text-center border-b">
                  <td colSpan="5">No delivered orders found.</td>
                </tr>
              ) : (
                myOrders.map((order) => (
                  <tr
                    key={order?._id}
                    className="control h-12 text-sm text-center border-b"
                  >
                    <td>
                      <p className="font-medium text-sm">
                        {new Date(order?.addedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {new Date(order?.addedAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td>{order?.products?.length || 0}</td>
                    <td>৳{Number(order?.productsPrice || 0).toFixed(2)}</td>
                    <td>৳{Number(order?.resellerPrice || 0).toFixed(2)}</td>
                    <td className="font-semibold text-green-400">
                      ৳{Number(order?.totalProfit || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center sm:justify-end items-center gap-2.5">
        <button
          className={
            currentPage === 0
              ? "w-9 h-9 rounded-md bg-section-bg text-primary-300 cursor-not-allowed"
              : "w-9 h-9 rounded-md bg-primary-700 hover:bg-primary-600 transition-colors duration-300 cursor-pointer"
          }
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          <IoIosArrowBack size={18} className="mx-auto" />
        </button>

        <span className="text-sm font-medium">{currentPage + 1}</span>

        <button
          className={
            isPlaceholderData || !hasMore
              ? "w-9 h-9 rounded-md bg-section-bg text-primary-300 cursor-not-allowed"
              : "w-9 h-9 rounded-md bg-primary-700 hover:bg-primary-600 transition-colors duration-300 cursor-pointer"
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

export default ProfitStatement;
