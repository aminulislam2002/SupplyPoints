import { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";

const BalanceStatement = () => {
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);

  const params = {
    currentPage,
    limitPerPage,
    searchQuery,
    transactionType,
  };

  // Fetch all logs
  const {
    isPending,
    isFetching,
    data: allLogsResponse = {},
    isPlaceholderData,
  } = useQuery({
    queryKey: ["seller-logs", params],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey;
      const res = await axiosSecure.get("/seller-logs", { params: p });

      return res.data;
    },

    placeholderData: keepPreviousData,
  });

  // Destructure data and hasMore
  const { data: sellerLogs = [], totalLogs, hasMore } = allLogsResponse;

  const creditTotal = sellerLogs
    .filter((log) => log?.transactionType === "Credit")
    .reduce((sum, log) => sum + Number(log?.amount || 0), 0);

  const debitTotal = sellerLogs
    .filter((log) => log?.transactionType !== "Credit")
    .reduce((sum, log) => sum + Number(log?.amount || 0), 0);

  const netFlow = creditTotal - debitTotal;

  const handleResetAllQuery = () => {
    setIsResetQueryLoading(true);
    try {
      setSearchQuery("");
      setTransactionType("");
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

  if (isPending && sellerLogs.length === 0) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Balance Statement</h1>
            <p className="text-sm text-text-secondary mt-1">
              Track wallet credits, debits, and running balances
            </p>
          </div>
          <div className="inline-flex h-10 items-center px-4 rounded-md surface-muted text-sm font-medium">
            Total Transactions: {totalLogs || 0}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Total Credit (Page)</p>
          <p className="text-xl font-semibold text-green-400 mt-1">
            ৳{creditTotal.toFixed(2)}
          </p>
        </div>
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Total Debit (Page)</p>
          <p className="text-xl font-semibold text-red-400 mt-1">
            ৳{debitTotal.toFixed(2)}
          </p>
        </div>
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Net Flow (Page)</p>
          <p
            className={`text-xl font-semibold mt-1 ${netFlow >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            ৳{netFlow.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="card p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="control h-10 px-3 text-sm border focus:outline-none"
          >
            <option value="">All Transaction Types</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>

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
                <th>Transaction</th>
                <th>Amount</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {isFetching && isPlaceholderData ? (
                <tr className="control h-12 text-sm text-center border-b">
                  <td colSpan="4">Fetching...</td>
                </tr>
              ) : sellerLogs?.length === 0 ? (
                <tr className="control h-12 text-sm text-center border-b">
                  <td colSpan="4">No statement records found.</td>
                </tr>
              ) : (
                sellerLogs.map((log) => (
                  <tr
                    key={log?._id}
                    className="control h-14 text-sm text-center border-b"
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-primary-100 text-primary-700">
                          <FaCalendarAlt size={14} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {new Date(log?.addedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {new Date(log?.addedAt).toLocaleTimeString(
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

                    <td>
                      <p className="font-semibold text-sm">{log?.title}</p>
                      <p className="text-xs text-text-secondary line-clamp-2">
                        {log?.description}
                      </p>
                    </td>

                    <td>
                      <p
                        className={`inline-flex items-center gap-1 font-semibold text-sm ${
                          log?.transactionType === "Credit"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {log?.transactionType === "Credit" ? (
                          <FaArrowUp size={12} />
                        ) : (
                          <FaArrowDown size={12} />
                        )}
                        {log?.transactionType === "Credit" ? "+" : "-"}৳
                        {Number(log?.amount || 0).toFixed(2)}
                      </p>
                    </td>

                    <td>
                      <p className="font-semibold text-sm text-primary-300">
                        ৳{Number(log?.balanceAfter || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-text-secondary">
                        From: ৳{Number(log?.balanceBefore || 0).toFixed(2)}
                      </p>
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

export default BalanceStatement;
