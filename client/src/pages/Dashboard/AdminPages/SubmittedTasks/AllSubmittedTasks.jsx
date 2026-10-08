import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";
import { Link } from "react-router";

const STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];

const AllSubmittedTasks = () => {
  const axiosSecure = useAxiosSecure();
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isStatusUpdateLoading, setIsStatusUpdateLoading] = useState(false);
  const [statusUpdateTaskId, setStatusUpdateTaskId] = useState(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [activeProofImages, setActiveProofImages] = useState([]);

  const getImageUrl = (path = "") => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    return `${import.meta.env.VITE_BASE_URL}${path}`;
  };

  const params = {
    currentPage,
    limitPerPage,
    status,
    searchQuery,
  };

  const {
    isPending,
    isFetching,
    data: submittedTasksResponse = {},
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["admin-submitted-tasks", params],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey;
      const res = await axiosSecure.get("/seller-todo/submitted-tasks", {
        params: p,
      });
      return res?.data || {};
    },
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const {
    data: allSubmittedTasks = [],
    totalSubmittedTasks = 0,
    hasMore = false,
  } = submittedTasksResponse;

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

  const handleUpdateStatus = async (submittedTaskId, newStatus) => {
    if (!["Approved", "Rejected"].includes(newStatus)) {
      return;
    }

    setIsStatusUpdateLoading(true);
    setStatusUpdateTaskId(submittedTaskId);

    try {
      const res = await axiosSecure.put(
        `/seller-todo/submitted-tasks/${submittedTaskId}`,
        {
          status: newStatus,
        },
      );

      const successMessage =
        res?.data?.message || "Status updated successfully!";

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

      await Swal.fire({
        title: errorMessage,
        icon: "error",
        draggable: true,
      });
    } finally {
      setIsStatusUpdateLoading(false);
      setStatusUpdateTaskId(null);
    }
  };

  const handleOpenProofModal = (images = []) => {
    if (!images?.length) return;
    setActiveProofImages(images);
    setIsProofModalOpen(true);
  };

  const handleCloseProofModal = () => {
    setActiveProofImages([]);
    setIsProofModalOpen(false);
  };

  if (isPending && allSubmittedTasks.length === 0) {
    return <Loader />;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      <h3 className="page-title border-b border-border-color pb-4 text-xl">
        Submitted Tasks - {totalSubmittedTasks}
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
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
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
              {["5", "10", "20", "50", "100"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleResetAllQuery} className="btn-icon h-10 w-10">
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
              <th>Task Value</th>
              <th>Task Link</th>
              <th>Proof</th>
              <th>Submitted</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="8">Fetching...</td>
              </tr>
            ) : allSubmittedTasks.length === 0 ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="8">No submitted tasks found.</td>
              </tr>
            ) : (
              allSubmittedTasks.map((submittedTask, index) => {
                const currentStatus = submittedTask?.status || "Pending";

                return (
                  <tr
                    key={submittedTask?._id}
                    className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color"
                  >
                    <th>{currentPage * limitPerPage + index + 1}</th>
                    <td>
                      {submittedTask?.sellerName}
                      <br />
                      {submittedTask?.identifier}
                    </td>
                    <td>{submittedTask?.packName}</td>
                    <td className="font-semibold">
                      ৳ {Number(submittedTask?.taskValue || 0).toFixed(2)}
                    </td>
                    <td>
                      <Link
                        to={submittedTask?.taskUrl}
                        target="_blank"
                        className="text-blue-500 hover:text-blue-400 transition-colors duration-300"
                      >
                        Open
                      </Link>
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          handleOpenProofModal(submittedTask?.images || [])
                        }
                        className="btn outline-btn h-8 px-3"
                      >
                        View ({submittedTask?.images?.length || 0})
                      </button>
                    </td>
                    <td>
                      {new Date(submittedTask?.submittedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </td>
                    <td>
                      <select
                        value={currentStatus}
                        onChange={(e) =>
                          handleUpdateStatus(submittedTask?._id, e.target.value)
                        }
                        disabled={currentStatus !== "Pending"}
                        className={`w-full h-9 bg-light border border-border-color rounded focus:outline-none focus:border-blue-500 focus:transition-colors focus:duration-300 px-2.5 font-primary text-base font-medium ${
                          currentStatus === "Pending"
                            ? "text-yellow-500"
                            : currentStatus === "Approved"
                              ? "text-green-600"
                              : "text-red-500"
                        } ${
                          currentStatus !== "Pending"
                            ? "cursor-not-allowed opacity-75"
                            : ""
                        }`}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {statusUpdateTaskId === submittedTask?._id &&
                            isStatusUpdateLoading
                              ? "Wait..."
                              : option}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
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

      {isProofModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 p-4 flex justify-center items-center"
          onClick={handleCloseProofModal}
        >
          <div
            className="modal-surface max-h-[90vh] w-full max-w-5xl overflow-y-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Proof Images</h4>
              <button
                onClick={handleCloseProofModal}
                className="btn danger-btn h-8 px-3"
              >
                Close
              </button>
            </div>

            {console.log("Active Proof Images:", activeProofImages)}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeProofImages.map((img) => (
                <a
                  key={img}
                  href={getImageUrl(img)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={import.meta.env.VITE_IMAGE_URL + img}
                    alt="proof"
                    className="w-full h-56 object-cover rounded border border-border-color"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSubmittedTasks;
