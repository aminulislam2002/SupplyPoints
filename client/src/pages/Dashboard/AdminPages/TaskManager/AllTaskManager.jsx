import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";
import AddTaskManager from "./AddTaskManager";
import UpdateTaskManager from "./UpdateTaskManager";
import { Link } from "react-router";

const AllTaskManager = () => {
  const [isAddNewTask, setIsAddNewTask] = useState(false);
  const [isUpdateTask, setIsUpdateTask] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [packIdFilter, setPackIdFilter] = useState("");
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const modal = document.getElementById("task_manager_add_update_modal");

  const {
    isPending,
    isFetching,
    data: allTasks = [],
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["task-manager", packIdFilter],
    queryFn: async () => {
      const params = {};

      if (packIdFilter) {
        params.packId = packIdFilter;
      }

      const res = await axiosPublic.get("/task-manager", { params });
      return res?.data?.data || [];
    },
    placeholderData: keepPreviousData,
  });

  const { data: packs = [] } = useQuery({
    queryKey: ["task-manager-packs"],
    queryFn: async () => {
      const res = await axiosPublic.get("/marketing-packs");
      return res?.data?.data || [];
    },
    refetchOnWindowFocus: false,
  });

  const handleDeleteTask = (id) => {
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
          const res = await axiosSecure.delete(`/task-manager/${id}`);
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

  const handleTaskAddUpdateModal = (status, id) => {
    if (status === "New") {
      setIsAddNewTask(true);
    }

    if (status === "Update") {
      setTaskId(id);
      setIsUpdateTask(true);
    }

    modal.showModal();
  };

  if (isPending && allTasks.length === 0) {
    return <Loader />;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      <div className="flex w-full items-center justify-between rounded-lg border border-border-color bg-card-bg p-4">
        <div className="w-full flex justify-between items-center gap-3">
          <h3 className="page-title w-full text-lg">Task Manager</h3>

          <div className="flex justify-end items-center gap-2.5">
            <select
              value={packIdFilter}
              onChange={(e) => setPackIdFilter(e.target.value)}
              className="control h-10 min-w-60"
            >
              <option value="">All Pack Id</option>
              {packs?.map((pack) => (
                <option key={pack?._id} value={pack?._id}>
                  {pack?.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleTaskAddUpdateModal("New")}
              className="btn primary-btn w-full sm:w-auto"
            >
              <FaPlus size={12} />
              <span className="text-base font-medium">Add New</span>
            </button>
          </div>
        </div>
      </div>

      <div className="table-shell">
        <table className="table">
          <thead className="bg-section-bg">
            <tr className="h-10 text-sm text-nowrap font-normal text-center">
              <th>#</th>
              <th>Pack Name</th>
              <th>Task URL</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="6">Loading...</td>
              </tr>
            ) : allTasks?.length === 0 ? (
              <tr className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="6">No tasks found.</td>
              </tr>
            ) : (
              allTasks?.map((task, index) => (
                <tr
                  key={task?._id}
                  className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color"
                >
                  <th>{index + 1}</th>
                  <td>{task?.packId?.name || "N/A"}</td>
                  <td>
                    <Link
                      to={task?.taskUrl}
                      target="_blank"
                      className="text-blue-500 hover:text-blue-400 transition-colors duration-300"
                    >
                      View
                    </Link>
                  </td>
                  <td>
                    <div className="flex justify-center items-center gap-2.5">
                      <button
                        title="Update"
                        onClick={() =>
                          handleTaskAddUpdateModal("Update", task?._id)
                        }
                        className="btn-icon h-9 w-9 rounded-full"
                      >
                        <FaRegEdit className="text-blue-500" size={18} />
                      </button>

                      <button
                        title="Delete"
                        onClick={() => handleDeleteTask(task?._id)}
                        className="btn-icon h-9 w-9 rounded-full border-danger/20 hover:bg-red-50"
                      >
                        <RiDeleteBin6Line className="text-red-500" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <dialog id="task_manager_add_update_modal" className="modal">
        <div className="modal-surface relative max-h-[90vh] w-11/12 max-w-2xl overflow-y-auto p-4 lg:p-5">
          <div>
            {isUpdateTask && (
              <UpdateTaskManager
                taskId={taskId}
                refetch={refetch}
                setIsUpdateTask={setIsUpdateTask}
                setTaskId={setTaskId}
                modal={modal}
                packs={packs}
              />
            )}

            {isAddNewTask && (
              <AddTaskManager
                refetch={refetch}
                setIsAddNewTask={setIsAddNewTask}
                modal={modal}
                packs={packs}
              />
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AllTaskManager;
