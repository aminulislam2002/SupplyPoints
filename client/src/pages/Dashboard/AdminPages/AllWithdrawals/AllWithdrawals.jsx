import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import { FaMoneyBillWave } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";

const AllWithdrawals = () => {
  const axiosSecure = useAxiosSecure();
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isStatusUpdateLoading, setIsStatusUpdateLoading] = useState(false);
  const [statusUpdateWithdrawalId, setStatusUpdateWithdrawalId] =
    useState(null);

  const params = {
    currentPage,
    limitPerPage,
    status,
    searchQuery,
  };

  // Fetch all withdrawals
  const {
    isPending,
    isFetching,
    data: allWithdrawalsResponse = {},
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["allWithdrawals", params],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey;
      const res = await axiosSecure.get("/withdrawals", {
        params: p,
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const {
    data: allWithdrawals = [],
    totalWithdrawals,
    hasMore,
  } = allWithdrawalsResponse;

  const handleResetAllQuery = () => {
    setIsResetQueryLoading(true);
    try {
      setStatus("");
      setSearchQuery("");
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

  const handleUpdateStatus = async (withdrawalId, newStatus) => {
    setIsStatusUpdateLoading(true);
    setStatusUpdateWithdrawalId(withdrawalId);
    try {
      const res = await axiosSecure.put(`/withdrawals/${withdrawalId}`, {
        status: newStatus,
      });
      const successMessage =
        res?.data?.message || "Status updated successfully";
      await Swal.fire({
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
      setIsStatusUpdateLoading(false);
      setStatusUpdateWithdrawalId(null);
    }
  };

  if (isPending && allWithdrawals.length === 0) {
    return <Loader />;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      {/* Header */}
      <h3 className="page-title text-xl">
        Withdrawals - {totalWithdrawals}
      </h3>

      {/* Filter and pagination query */}
      <div className="py-2.5">
        <div className="flex flex-wrap justify-start items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search seller name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="control h-10"
            />
          </div>

          {/* Status Selected */}
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="control h-10"
            >
              <option value="">All Status</option>
              {["Pending", "Approved", "Rejected"]?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
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

          <button
            onClick={handleResetAllQuery}
            className="btn-icon h-10 w-10"
          >
            <TfiReload
              size={15}
              className={isResetQueryLoading ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="table-shell">
        <table className="table">
          <thead className="bg-section-bg">
            <tr className="h-10 text-sm text-nowrap font-normal text-center">
              <th>#</th>
              <th>Seller</th>
              <th>Method</th>
              <th>Account</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="7">Fetching...</td>
              </tr>
            ) : allWithdrawals?.length === 0 ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="7">No withdrawals found.</td>
              </tr>
            ) : (
              allWithdrawals?.map((withdrawal, index) => (
                <tr
                  key={withdrawal?._id}
                  className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color"
                >
                  <th>{currentPage * limitPerPage + index + 1}</th>
                  <td>
                    {withdrawal?.sellerName}
                    <br />
                    {withdrawal?.identifier}
                  </td>
                  <td>{withdrawal?.payMethod}</td>
                  <td>{withdrawal?.account}</td>
                  <td className="font-semibold">
                    ৳ {withdrawal?.amount?.toFixed(2)}
                  </td>
                  <td>
                    {new Date(withdrawal?.addedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <div className="relative">
                      <select
                        value={withdrawal?.status || status}
                        onChange={(e) =>
                          handleUpdateStatus(withdrawal?._id, e.target.value)
                        }
                        disabled={withdrawal?.status !== "Pending"}
                        className={`w-full h-9 bg-light  border border-border-color rounded focus:outline-none focus:border-blue-500  focus:transition-colors focus:duration-300 px-2.5 font-primary text-base font-medium ${
                          withdrawal?.status === "Pending"
                            ? "text-yellow-500"
                            : withdrawal?.status === "Approved"
                              ? "text-green-600"
                              : withdrawal?.status === "Rejected"
                                ? "text-red-500"
                                : "text-gray-300"
                        } ${withdrawal?.status !== "Pending" ? "cursor-not-allowed opacity-75" : ""}`}
                      >
                        {["Pending", "Approved", "Rejected"]?.map(
                          (option, index) => (
                            <option key={index} value={option}>
                              {statusUpdateWithdrawalId == withdrawal?._id &&
                              isStatusUpdateLoading
                                ? "Wait..."
                                : option}
                            </option>
                          ),
                        )}
                      </select>
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
              : "control rounded-md p-1.5"
          }
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          <IoIosArrowBack size={20} />
        </button>

        <span className="text-base font-medium ">{currentPage + 1}</span>

        <button
          className={
            isPlaceholderData || !hasMore
              ? "bg-primary-200  text-primary-600 cursor-not-allowed rounded-md p-1.5"
              : "control rounded-md p-1.5"
          }
          onClick={() => {
            if (!isPlaceholderData && hasMore) {
              setCurrentPage((prev) => prev + 1);
            }
          }}
          disabled={isPlaceholderData || !hasMore}
        >
          <IoIosArrowForward size={20} />
        </button>
      </div>
    </div>
  );
};

export default AllWithdrawals;
