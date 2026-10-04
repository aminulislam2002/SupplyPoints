import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";

const AllPromotionPurchases = () => {
  const axiosSecure = useAxiosSecure();
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const params = {
    currentPage,
    limitPerPage,
    status,
    searchQuery,
  };

  const {
    isPending,
    isFetching,
    data: allPurchasesResponse = {},
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["all-purchases", params],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey;
      const res = await axiosSecure.get("/promotion-purchases", {
        params: p,
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const {
    data: allPurchases = [],
    totalPurchases = 0,
    hasMore = false,
  } = allPurchasesResponse;

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

  const handleDeletePurchase = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this purchase!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/promotion-purchases/${id}`);
          Swal.fire({
            title: "Deleted!",
            text: res?.data?.message || "Purchase deleted successfully!",
            icon: "success",
          });
          refetch();
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text:
              error?.response?.data?.message ||
              error?.message ||
              "Something went wrong!",
            icon: "error",
          });
        }
      }
    });
  };

  if (isPending && allPurchases.length === 0) {
    return <Loader />;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      <h3 className="page-title border-b border-border-color pb-4 text-xl">
        Purchases - {totalPurchases}
      </h3>

      <div className="py-2.5">
        <div className="flex flex-wrap justify-start items-center gap-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search seller or pack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="control h-10"
            />
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="control h-10"
            >
              <option value="">All Status</option>
              <option value="Activated">Activated</option>
              <option value="Deactivated">Deactivated</option>
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
              {["5", "10", "20", "50", "100"].map((option) => (
                <option key={option} value={option}>
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

      <div className="table-shell">
        <table className="table">
          <thead className="bg-section-bg">
            <tr className="h-10 text-sm text-nowrap font-normal text-center">
              <th>#</th>
              <th>Seller</th>
              <th>Pack</th>
              <th>Promotion Link</th>
              <th>Amount</th>
              <th>Duration</th>
              <th>Purchased</th>
              <th>Expired</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="10">Fetching...</td>
              </tr>
            ) : allPurchases?.length === 0 ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="10">No purchases found.</td>
              </tr>
            ) : (
              allPurchases?.map((purchase, index) => (
                <tr
                  key={purchase?._id}
                  className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color"
                >
                  <th>{currentPage * Number(limitPerPage) + index + 1}</th>
                  <td>
                    {purchase?.sellerName}
                    <br />
                    {purchase?.identifier}
                  </td>
                  <td>
                    <p className="font-semibold">{purchase?.packTitle}</p>
                    <p className="text-xs text-primary-200">
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
                      Visit
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
                    {new Date(purchase?.expiredAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        purchase?.status === "Activated"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {purchase?.status}
                    </span>
                  </td>
                  <td>
                    <button
                      title="Delete"
                      onClick={() => handleDeletePurchase(purchase?._id)}
                      className="btn-icon h-9 w-9 rounded-full border-danger/20 hover:bg-red-50"
                    >
                      <RiDeleteBin6Line className="text-red-500" size={18} />
                    </button>
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

export default AllPromotionPurchases;
