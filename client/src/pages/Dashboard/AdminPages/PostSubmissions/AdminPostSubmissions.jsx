import { useState } from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Swal from "sweetalert2";
import Loader from "../../../../components/Loader/Loader";
import { TfiReload } from "react-icons/tfi";

const AdminPostSubmissions = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [status, setStatus] = useState("");
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);

  const params = { currentPage, limitPerPage, status };

  const {
    isPending,
    data: response = {},
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["post-submissions", params],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey;
      const res = await axiosSecure.get("/post-submissions", { params: p });
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const { data: submissions = [], hasMore = false } = response;

  const handleApprove = async (id) => {
    const { value: amount } = await Swal.fire({
      title: "Enter amount to credit",
      input: "number",
      inputAttributes: { min: 1 },
      showCancelButton: true,
    });

    if (!amount) return;
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      Swal.fire({ title: "Invalid amount", icon: "error" });
      return;
    }

    try {
      const res = await axiosSecure.put(`/post-submissions/approve/${id}`, {
        amount: num,
      });
      Swal.fire({ title: res.data.message || "Approved", icon: "success" });
      queryClient.invalidateQueries({ queryKey: ["post-submissions"] });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: err?.response?.data?.message || err.message,
        icon: "error",
      });
    }
  };

  const handleReject = async (id) => {
    const confirmed = await Swal.fire({
      title: "Reject this submission?",
      showCancelButton: true,
      icon: "warning",
    });
    if (!confirmed.isConfirmed) return;

    try {
      const res = await axiosSecure.put(`/post-submissions/reject/${id}`);
      Swal.fire({ title: res.data.message || "Rejected", icon: "success" });
      queryClient.invalidateQueries({ queryKey: ["post-submissions"] });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: err?.response?.data?.message || err.message,
        icon: "error",
      });
    }
  };

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

  if (isPending) return <Loader />;

  return (
    <div className="space-y-4 p-5 sm:p-6">
      {/* Header */}
      <h3 className="page-title text-xl">Review queue</h3>

      <div className="card p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <label className="flex min-w-0 flex-1 flex-col gap-1.5 sm:max-w-xs">
            <span className="metadata">Status</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(0);
              }}
              className="control h-10"
            >
              <option value="">All Status</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Reject">Reject</option>
            </select>
          </label>

          <label
            htmlFor="limitPerPage"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <span className="metadata">Show</span>
            <select
              id="limitPerPage"
              value={limitPerPage}
              onChange={(e) => {
                setLimitPerPage(e.target.value);
                setCurrentPage(0);
              }}
              className="control h-10"
            >
              {["5", "10", "20", "50", "100"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={handleResetAllQuery}
            className="btn-icon h-10 w-10"
            title="Reset filters"
          >
            <TfiReload
              size={15}
              className={isResetQueryLoading ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      <div className="card p-4 sm:p-5">
        <div className="table-shell">
          <table className="table">
            <thead>
              <tr className="text-center text-sm font-medium">
                <th>#</th>
                <th>Seller</th>
                <th>Platform</th>
                <th>Post Link</th>
                <th>Note</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr className="text-center text-sm">
                  <td colSpan="8">Fetching...</td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr className="text-center text-sm">
                  <td colSpan="8">No submissions found.</td>
                </tr>
              ) : (
                submissions.map((s, idx) => (
                  <tr key={s._id} className="text-center text-sm">
                    <th>{currentPage * Number(limitPerPage) + idx + 1}</th>
                    <td>
                      {s.sellerName}
                      <br />
                      <span className="text-xs text-text-muted">
                        {s.identifier}
                      </span>
                    </td>
                    <td>{s.platform}</td>
                    <td>
                      <a
                        href={s.postLink}
                        target="_blank"
                        rel="noreferrer"
                        className="link whitespace-nowrap"
                      >
                        View
                      </a>
                    </td>
                    <td className="text-xs">{s.note || "-"}</td>
                    <td>৳{Number(s.amount || 0).toFixed(2)}</td>
                    <td>
                      <span
                        className={`badge text-nowrap ${s.status === "Approved" ? "badge-success" : s.status === "Reject" ? "badge-danger" : "badge-warning"}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex min-w-44 items-center justify-center gap-2">
                        {s.status !== "Approved" && (
                          <>
                            <button
                              onClick={() => handleApprove(s._id)}
                              className="btn primary-btn h-8 px-3 text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(s._id)}
                              className="btn danger-btn h-8 px-3 text-xs"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
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
              ? "btn-icon cursor-not-allowed opacity-50"
              : "btn-icon"
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
          <IoIosArrowForward size={18} className="mx-auto" />
        </button>
      </div>
    </div>
  );
};

export default AdminPostSubmissions;
