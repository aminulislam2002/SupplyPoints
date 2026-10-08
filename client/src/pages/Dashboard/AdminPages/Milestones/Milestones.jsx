import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Loader from "../../../../components/Loader/Loader";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import AddMilestone from "./AddMilestone";
import UpdateMilestone from "./UpdateMilestone";
import { FaPlus, FaRegEdit } from "react-icons/fa";

const Milestones = () => {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(5);
  const [isAddNewMilestone, setIsAddNewMilestone] = useState(false);
  const [isUpdateMilestone, setIsUpdateMilestone] = useState(false);
  const [milestoneId, setMilestoneId] = useState(null);

  const modal = document.getElementById("milestone_add_update_modal");

  // Fetch all milestones
  const {
    isPending,
    isFetching,
    data: allMilestoneResponse = {},
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["allMilestone", currentPage],
    queryFn: async () => {
      const res = await axiosPublic.get("/milestones", {
        params: { currentPage, limitPerPage },
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    refetch();
  }, [refetch, limitPerPage]);

  const {
    data: allMilestone = [],
    totalMilestones,
    hasMore,
  } = allMilestoneResponse;

  const handleResetAllQuery = () => {
    setIsResetQueryLoading(true);
    try {
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

  // Delete a milestone
  const handleDeleteMilestone = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/milestones/${id}`);
          const successMessage = res?.data?.message || "Success";
          Swal.fire({
            title: "Deleted!",
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
        }
      }
    });
  };

  // Handle Add New Milestone & Update Milestone Modal
  const handleAddMilestoneAndUpdateMilestoneModal = (status, id) => {
    if (status === "New") {
      setIsAddNewMilestone(true);
    }

    if (status === "Update") {
      setMilestoneId(id);
      setIsUpdateMilestone(true);
    }

    modal.showModal();
  };

  if (isPending && allMilestone.length === 0) {
    return <Loader></Loader>;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      {/* Add new Milestone CTA */}
      <div className="flex w-full items-center justify-between rounded-lg border border-border-color bg-card-bg p-4">
        <div className="w-full flex justify-between items-center">
          <h3 className="page-title w-full text-lg">
            Our Milestone - {totalMilestones}
          </h3>

          <button
            onClick={() => handleAddMilestoneAndUpdateMilestoneModal("New")}
            className="btn primary-btn w-full sm:w-auto"
          >
            <FaPlus size={12}></FaPlus>
            <span className="text-base font-medium">Add New</span>
          </button>
        </div>
      </div>

      {/* Filter and pagination query */}
      <div className="py-2.5">
        <div className="flex flex-wrap justify-start items-center gap-2.5">
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

          <button onClick={handleResetAllQuery} className="btn-icon h-10 w-10">
            <TfiReload
              size={15}
              className={isResetQueryLoading ? "animate-spin" : ""}
            ></TfiReload>
          </button>
        </div>
      </div>

      {/* Milestone Table */}
      <div className="table-shell">
        <table className="table">
          <thead className="bg-section-bg">
            <tr className="h-10 text-sm text-nowrap font-normal text-center">
              <th>#</th>
              <th>Year</th>
              <th>Title</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="5">Loading...</td>
              </tr>
            ) : allMilestone?.length === 0 ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="5">No milestones found.</td>
              </tr>
            ) : (
              allMilestone?.map((milestone, index) => (
                <tr
                  key={milestone._id}
                  className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color"
                >
                  <th>{currentPage * limitPerPage + index + 1}</th>
                  <td className="font-semibold text-primary-500">
                    {milestone.year}
                  </td>
                  <td className="text-wrap max-w-xs">{milestone.title}</td>
                  <td className="text-wrap max-w-md">
                    <p className="text-sm font-normal text-primary-600">
                      {milestone.descriptions.length > 80
                        ? milestone.descriptions.substring(0, 80) + "..."
                        : milestone.descriptions}
                    </p>
                  </td>
                  <td>
                    <div className="h-full flex justify-center items-center gap-2">
                      <button
                        title="Update"
                        onClick={() =>
                          handleAddMilestoneAndUpdateMilestoneModal(
                            "Update",
                            milestone._id,
                          )
                        }
                        className="btn-icon h-9 w-9 rounded-full"
                      >
                        <FaRegEdit
                          className="text-blue-500"
                          size={18}
                        ></FaRegEdit>
                      </button>

                      <button
                        title="Delete"
                        onClick={() => handleDeleteMilestone(milestone._id)}
                        className="btn-icon h-9 w-9 rounded-full border-danger/20 hover:bg-red-50"
                      >
                        <RiDeleteBin6Line
                          className="text-red-500"
                          size={18}
                        ></RiDeleteBin6Line>
                      </button>
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
              : "btn-icon h-9 w-9 rounded-full"
          }
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          <IoIosArrowBack size={20}></IoIosArrowBack>
        </button>

        <span className="text-base font-medium ">{currentPage + 1}</span>

        <button
          className={
            isPlaceholderData || !hasMore
              ? "bg-primary-200  text-primary-600 cursor-not-allowed rounded-md p-1.5"
              : "btn-icon h-9 w-9 rounded-full border-danger/20 hover:bg-red-50"
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

      {/* Add & Update Milestone Modal */}
      <dialog id="milestone_add_update_modal" className="modal">
        <div className="modal-surface relative max-h-[90vh] w-11/12 max-w-2xl overflow-y-auto p-4 lg:p-5">
          <div>
            {isUpdateMilestone && (
              <UpdateMilestone
                milestoneId={milestoneId}
                refetch={refetch}
                setIsUpdateMilestone={setIsUpdateMilestone}
                setMilestoneId={setMilestoneId}
                modal={modal}
              />
            )}

            {isAddNewMilestone && (
              <AddMilestone
                refetch={refetch}
                setIsAddNewMilestone={setIsAddNewMilestone}
                modal={modal}
              />
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Milestones;
