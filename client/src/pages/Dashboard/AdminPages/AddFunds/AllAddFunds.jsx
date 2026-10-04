import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";

const AllAddFunds = () => {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [gateway, setGateway] = useState("");
  const [status, setStatus] = useState("");
  const [limitPerPage, setLimitPerPage] = useState(10);

  const [isStatusUpdateLoading, setIsStatusUpdateLoading] = useState(false);

  const params = {
    currentPage,
    limitPerPage,
    status,
    gateway,
    searchQuery,
  };

  const {
    isPending,
    isFetching,
    data: allRequestsResponse = {},
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["all-add-funds", params],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey;
      const res = await axiosSecure.get("/add-funds", { params: p });
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const {
    data: allRequests = [],
    totalRequests = 0,
    hasMore = false,
  } = allRequestsResponse;

  const handleResetAllQuery = () => {
    setIsResetQueryLoading(true);
    try {
      setSearchQuery("");
      setGateway("");
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

  const handleDepositStatus = async (id, newStatus) => {
    setIsStatusUpdateLoading(true);
    try {
      const res = await axiosSecure.post(`/add-funds/callback/manual/${id}/`, {
        transactionId: id,
        status: newStatus,
      });
      const successMessage =
        res?.data?.message || "Deposit status updated successfully!";
      Swal.fire({
        title: "Success!",
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
    } finally {
      setIsStatusUpdateLoading(false);
    }
  };
  if (isPending && allRequests.length === 0) {
    return <Loader />;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      <div className="flex flex-col items-start justify-between gap-3 border-b border-border-color pb-4 lg:flex-row lg:items-center">
        <h3 className="page-title text-xl">
          Add Funds - {totalRequests}
        </h3>

        <div className="w-full lg:w-1/3 flex justify-between items-center gap-2.5">
          <div className="w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by seller or transactionId..."
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
            />
          </button>
        </div>
      </div>

      <div className="py-2.5">
        <div className="flex flex-wrap justify-start items-center gap-2.5">
          <div className="relative">
            <select
              value={gateway}
              onChange={(e) => setGateway(e.target.value)}
              className="control h-10"
            >
              <option value="">Gateway (Default)</option>
              {["Bkash", "Nagad", "Rocket"]?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="control h-10"
            >
              <option value="">Status (Default)</option>
              {["Pending", "Approved", "Cancelled"]?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex items-center gap-2.5">
            <label htmlFor="limitPerPage" className="text-base font-medium">
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

      <div className="table-shell">
        <table className="table">
          <thead className="bg-section-bg">
            <tr className="h-10 text-sm text-nowrap font-normal text-center">
              <th>#</th>
              <th>Seller</th>
              <th>Amount</th>
              <th>Gateway</th>
              <th>Purpose</th>
              <th>TxnId</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="7">Fetching...</td>
              </tr>
            ) : allRequests?.length === 0 ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="7">No add funds requests found.</td>
              </tr>
            ) : (
              allRequests?.map((request, index) => (
                <tr
                  key={request?._id}
                  className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color"
                >
                  <th>{currentPage * Number(limitPerPage) + index + 1}</th>
                  <td>
                    {request?.sellerName}
                    <br />
                    {request?.identifier}
                  </td>
                  <td className="font-semibold">
                    ৳ {Number(request?.amount || 0).toFixed(2)}
                  </td>
                  <td>{request?.gateway}</td>
                  <td>{request?.purpose}</td>
                  <td>{request?.transactionId}</td>
                  <td>
                    {request?.status === "Pending" ? (
                      <div className="relative">
                        <select
                          value={request?.status || status}
                          onChange={(e) =>
                            handleDepositStatus(
                              request.transactionId,
                              e.target.value,
                            )
                          }
                          className={`h-9 px-2.5 bg-primary-700 border border-border-color rounded focus:outline-none focus:border-blue-500 focus:transition-colors focus:duration-300 text-base font-medium ${
                            request?.status === "Pending"
                              ? "text-yellow-500"
                              : request?.status === "Approved"
                                ? "text-green-600"
                                : "text-red-500"
                          }`}
                        >
                          {[
                            {
                              label: "Pending",
                              value: "Pending",
                            },
                            {
                              label: "Approved",
                              value: "Approved",
                            },
                            {
                              label: "Rejected",
                              value: "Rejected",
                            },
                          ]?.map((option, index) => (
                            <option
                              key={index}
                              value={option.value}
                              className="text-black"
                            >
                              {isStatusUpdateLoading
                                ? "Updating..."
                                : option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : request?.status === "Approved" ? (
                      <span className="text-green-600 font-medium">
                        Approved
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium">
                        Cancelled
                      </span>
                    )}
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
          <IoIosArrowBack size={20} />
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
          <IoIosArrowForward size={20} />
        </button>
      </div>
    </div>
  );
};

export default AllAddFunds;
