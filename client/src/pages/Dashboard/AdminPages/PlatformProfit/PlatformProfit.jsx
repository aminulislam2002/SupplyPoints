import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";

const PlatformProfit = () => {
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(5);
  const [purpose, setPurpose] = useState("");
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);

  const params = {
    currentPage,
    limitPerPage,
    purpose,
  };

  // Fetch all platform profits
  const {
    isPending,
    isFetching,
    data: allProfitsResponse = {},
    isPlaceholderData,
  } = useQuery({
    queryKey: ["platform-profits", params],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey;
      const res = await axiosSecure.get("/platform-profits", { params: p });

      return res.data;
    },

    placeholderData: keepPreviousData,
  });

  // Destructure data and hasMore
  const { data: platformProfits = [], totalLogs, hasMore } = allProfitsResponse;

  const handleResetAllQuery = () => {
    setIsResetQueryLoading(true);
    try {
      setPurpose("");
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

  if (isPending && platformProfits.length === 0) {
    return <Loader />;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="page-title text-xl">
          Platform Profits - {totalLogs || 0}
        </h3>
      </div>

      {/* Filters Sorting and Pagination query Section */}
      <div className="py-2.5">
        <div className="flex flex-wrap justify-start items-center gap-2.5">
          {/* Purpose Filter  */}
          <div className="relative">
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="control h-10"
            >
              <option value="">All Purposes</option>
              <option value="Order Profit">Order Profit</option>
              <option value="Subscription Fee">Subscription Fee</option>
              <option value="Add Funds">Add Funds</option>
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

          <div className="relative">
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
      </div>

      {/* Platform Profit Table */}
      <div className="table-shell">
        <table className="table">
          <thead className="bg-section-bg">
            <tr className="h-10 text-sm text-nowrap font-normal text-center">
              <th>Date & Time</th>
              <th>Profit Details</th>
              <th>Purpose</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="4">Fetching...</td>
              </tr>
            ) : platformProfits?.length === 0 ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="4">No profit records found.</td>
              </tr>
            ) : (
              platformProfits?.map((profit) => (
                <tr
                  key={profit._id}
                  className="h-14 text-sm text-nowrap font-normal text-center border-b border-border-color"
                >
                  {/* Date & Time */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary-50 p-2 text-primary-700">
                        <FaCalendarAlt size={14} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {new Date(profit.addedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                        <p className="text-xs text-gray-300">
                          {new Date(profit.addedAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Profit Details */}
                  <td>
                    <p className="font-semibold text-sm mb-1">{profit.title}</p>
                    <p className="text-xs text-gray-300 line-clamp-3">
                      {profit.description}
                    </p>
                  </td>

                  {/* Purpose */}
                  <td>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        profit.purpose === "Order Profit"
                          ? "bg-blue-100 text-blue-800  "
                          : "bg-purple-100 text-purple-800  "
                      }`}
                    >
                      {profit.purpose}
                    </span>
                  </td>

                  {/* Amount */}
                  <td>
                    <p className="font-bold text-sm text-green-500">
                      +৳{profit.amount.toLocaleString()}
                    </p>
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
              ? "btn-icon cursor-not-allowed opacity-50"
              : "btn-icon"
          }
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          <IoIosArrowBack size={20}></IoIosArrowBack>
        </button>

        <span className="text-base font-medium">{currentPage + 1}</span>

        <button
          className={
            isPlaceholderData || !hasMore
              ? "btn-icon cursor-not-allowed opacity-50"
              : "btn-icon"
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
    </div>
  );
};

export default PlatformProfit;
