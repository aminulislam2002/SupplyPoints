import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";

const MyAddFunds = () => {
  const axiosSecure = useAxiosSecure();
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [status, setStatus] = useState("");
  const [gateway, setGateway] = useState("");

  const params = {
    currentPage,
    limitPerPage,
    status,
    gateway,
  };

  const {
    isPending,
    isFetching,
    data: allRequestsResponse = {},
    isPlaceholderData,
  } = useQuery({
    queryKey: ["my-add-funds", params],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey;
      const res = await axiosSecure.get("/add-funds/my-requests", {
        params: p,
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const {
    data: myRequests = [],
    totalRequests = 0,
    hasMore = false,
  } = allRequestsResponse;

  const handleResetAllQuery = () => {
    setIsResetQueryLoading(true);
    try {
      setStatus("");
      setGateway("");
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

  if (isPending && myRequests.length === 0) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">My Add Funds Requests</h1>
            <p className="text-sm text-text-secondary mt-1">
              Track all your wallet top-up requests and current status
            </p>
          </div>
          <div className="inline-flex h-10 items-center px-4 rounded-md surface-muted text-sm font-medium">
            Total: {totalRequests}
          </div>
        </div>
      </div>

      <div className="card p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={gateway}
            onChange={(e) => setGateway(e.target.value)}
            className="control h-10 px-3 text-sm border focus:outline-none"
          >
            <option value="">All Gateway</option>
            <option value="Bkash">Bkash</option>
            <option value="Nagad">Nagad</option>
            <option value="Rocket">Rocket</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="control h-10 px-3 text-sm border focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Cancelled">Cancelled</option>
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
                <th>Amount</th>
                <th>Gateway</th>
                <th>Txn ID</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {isFetching && isPlaceholderData ? (
                <tr className="control h-12 text-sm text-center border-b">
                  <td colSpan="6">Fetching...</td>
                </tr>
              ) : myRequests?.length === 0 ? (
                <tr className="control h-12 text-sm text-center border-b">
                  <td colSpan="6">No add funds request found.</td>
                </tr>
              ) : (
                myRequests.map((request, index) => (
                  <tr
                    key={request?._id}
                    className="control h-11 text-sm text-center border-b"
                  >
                    <th>{currentPage * Number(limitPerPage) + index + 1}</th>
                    <td className="font-semibold">
                      ৳{Number(request?.amount || 0).toFixed(2)}
                    </td>
                    <td>{request?.gateway}</td>
                    <td>{request?.transactionId}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request?.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : request?.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {request?.status}
                      </span>
                    </td>
                    <td>
                      {new Date(request?.addedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
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

export default MyAddFunds;
