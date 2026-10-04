import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";

const MyWithdrawals = () => {
  const axiosSecure = useAxiosSecure();
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [status, setStatus] = useState("");

  const params = {
    currentPage,
    limitPerPage,
    status,
  };

  // Fetch my withdrawals
  const {
    isPending,
    isFetching,
    data: allWithdrawalsResponse = {},
    isPlaceholderData,
  } = useQuery({
    queryKey: ["myWithdrawals", params],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey;
      const res = await axiosSecure.get("/withdrawals/my-withdrawals", {
        params: p,
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const {
    data: myWithdrawals = [],
    totalWithdrawals,
    hasMore,
  } = allWithdrawalsResponse;

  const approvedTotal = myWithdrawals
    .filter((item) => item?.status === "Approved")
    .reduce((sum, item) => sum + Number(item?.amount || 0), 0);

  const pendingCount = myWithdrawals.filter(
    (item) => item?.status === "Pending",
  ).length;

  const rejectedCount = myWithdrawals.filter(
    (item) => item?.status === "Rejected",
  ).length;

  const handleResetAllQuery = () => {
    setIsResetQueryLoading(true);
    try {
      setStatus("");
      setLimitPerPage(10);
      setCurrentPage(0);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsResetQueryLoading(false);
      }, 500);
    }
  };

  if (isPending && myWithdrawals.length === 0) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">My Withdrawals</h1>
            <p className="text-sm text-text-secondary mt-1">
              Monitor all payout requests and status updates
            </p>
          </div>
          <div className="inline-flex h-10 items-center px-4 rounded-md surface-muted text-sm font-medium">
            Total: {totalWithdrawals || 0}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Approved Amount (Page)</p>
          <p className="text-xl font-semibold text-green-400 mt-1">
            ৳{approvedTotal.toFixed(2)}
          </p>
        </div>
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Pending Requests</p>
          <p className="text-xl font-semibold text-yellow-400 mt-1">
            {pendingCount}
          </p>
        </div>
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Rejected Requests</p>
          <p className="text-xl font-semibold text-red-400 mt-1">
            {rejectedCount}
          </p>
        </div>
      </div>

      <div className="card p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="control h-10 px-3 text-sm border focus:outline-none"
          >
            <option value="">All Status</option>
            {["Pending", "Approved", "Rejected"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
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
            className="btn btn-primary w-10 h-10 rounded-md text-white transition-colors duration-300 flex justify-center items-center cursor-pointer"
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
                <th>#</th>
                <th>Method</th>
                <th>Account</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {isFetching && isPlaceholderData ? (
                <tr className="control h-12 text-sm text-center border-b">
                  <td colSpan="6">Fetching...</td>
                </tr>
              ) : myWithdrawals?.length === 0 ? (
                <tr className="control h-12 text-sm text-center border-b">
                  <td colSpan="6">No withdrawals found.</td>
                </tr>
              ) : (
                myWithdrawals.map((withdrawal, index) => (
                  <tr
                    key={withdrawal?._id}
                    className="control h-11 text-sm text-center border-b"
                  >
                    <th>{currentPage * Number(limitPerPage) + index + 1}</th>
                    <td>{withdrawal?.payMethod}</td>
                    <td>{withdrawal?.account}</td>
                    <td className="font-semibold">
                      ৳{Number(withdrawal?.amount || 0).toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          withdrawal?.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : withdrawal?.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {withdrawal?.status}
                      </span>
                    </td>
                    <td>
                      {new Date(withdrawal?.addedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
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

export default MyWithdrawals;
