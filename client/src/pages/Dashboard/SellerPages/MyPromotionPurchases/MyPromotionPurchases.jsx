import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";

const MyPromotionPurchases = () => {
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

  const {
    isPending,
    isFetching,
    data: purchasesResponse = {},
    isPlaceholderData,
  } = useQuery({
    queryKey: ["my-purchases", params],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey;
      const res = await axiosSecure.get("/promotion-purchases/my-purchases", {
        params: p,
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const {
    data: myPurchases = [],
    totalPurchases = 0,
    hasMore = false,
  } = purchasesResponse;

  const activeCount = myPurchases.filter(
    (item) => item?.status === "Activated",
  ).length;
  const deactiveCount = myPurchases.filter(
    (item) => item?.status === "Deactivated",
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

  if (isPending && myPurchases.length === 0) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Promotion Purchases</h1>
            <p className="text-sm text-text-secondary mt-1">
              Track your purchased promotion packs and expiry status
            </p>
          </div>
          <div className="inline-flex h-10 items-center px-4 rounded-md surface-muted text-sm font-medium">
            Total: {totalPurchases}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Activated (Page)</p>
          <p className="text-xl font-semibold text-green-400 mt-1">
            {activeCount}
          </p>
        </div>
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Deactivated (Page)</p>
          <p className="text-xl font-semibold text-red-400 mt-1">
            {deactiveCount}
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
            <option value="Activated">Activated</option>
            <option value="Deactivated">Deactivated</option>
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
                <th>Pack</th>
                <th>Promotion Link</th>
                <th>Amount</th>
                <th>Duration</th>
                <th>Purchased</th>
                <th>Expired</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isFetching && isPlaceholderData ? (
                <tr className="control h-12 text-sm text-center border-b">
                  <td colSpan="8">Fetching...</td>
                </tr>
              ) : myPurchases?.length === 0 ? (
                <tr className="control h-12 text-sm text-center border-b">
                  <td colSpan="8">No purchases found.</td>
                </tr>
              ) : (
                myPurchases.map((purchase, index) => (
                  <tr
                    key={purchase?._id}
                    className="control h-11 text-sm text-center border-b"
                  >
                    <th>{currentPage * Number(limitPerPage) + index + 1}</th>
                    <td>
                      <p className="font-semibold">{purchase?.packTitle}</p>
                      <p className="text-xs text-text-secondary">
                        {purchase?.packName}
                      </p>
                    </td>
                    <td>
                      <a
                        href={purchase?.promotionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        View Link
                      </a>
                    </td>
                    <td className="font-semibold">
                      ৳{Number(purchase?.amount || 0).toFixed(2)}
                    </td>
                    <td>{purchase?.durationDays} days</td>
                    <td>
                      {new Date(purchase?.purchasedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </td>
                    <td>
                      {new Date(purchase?.expiredAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          purchase?.status === "Activated"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {purchase?.status}
                      </span>
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

export default MyPromotionPurchases;
