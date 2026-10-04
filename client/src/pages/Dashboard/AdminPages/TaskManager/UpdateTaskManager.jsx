import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import { BsDatabaseFillAdd } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../../components/Loader/Loader";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";

const UpdateTaskManager = ({
  taskId,
  setTaskId,
  setIsUpdateTask,
  refetch,
  modal,
  packs = [],
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const { isPending: isTaskLoading, data: task = {} } = useQuery({
    queryKey: ["taskId", taskId],
    queryFn: async () => {
      const res = await axiosPublic.get(`/task-manager/${taskId}`);
      return res?.data?.data || {};
    },
    refetchOnWindowFocus: true,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    if (task) {
      reset({
        packId: task?.packId?._id || task?.packId || "",
        taskUrl: task?.taskUrl || "",
        description: task?.description || "",
      });
    }
  }, [task, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await axiosSecure.put(`/task-manager/${taskId}`, data);
      const successMessage = res?.data?.message || "Success";
      refetch();
      reset();
      setIsUpdateTask(false);
      setTaskId(null);
      modal.close();
      await Swal.fire({ title: successMessage, icon: "success" });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      Swal.fire({
        title: errorMessage,
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseUpdateTask = () => {
    setTaskId(null);
    setIsUpdateTask(false);
    reset();
    modal.close();
  };

  if (isTaskLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h3 className="w-full h-auto text-lg font-medium text-center pb-2.5 border-b border-dashed border-border-color text-primary-500">
        Update Task
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2.5">
        <div className="space-y-2">
          <p className="text-base font-medium truncate">Select Pack</p>
          <select
            {...register("packId", { required: true })}
            aria-invalid={errors.packId ? "true" : "false"}
            className="w-full text-base bg-primary-950 border border-border-color rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select packId</option>
            {packs?.map((pack) => (
              <option key={pack?._id} value={pack?._id}>
                {pack?.name} ({pack?._id})
              </option>
            ))}
          </select>
          {errors.packId && (
            <p className="text-sm text-red-500 mt-1">
              Select Pack is required.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-base font-medium truncate">Task URL</p>
          <input
            type="url"
            placeholder="https://example.com/task"
            {...register("taskUrl", { required: true })}
            aria-invalid={errors.taskUrl ? "true" : "false"}
            className="w-full h-10 text-base bg-primary-950 border border-border-color rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.taskUrl && (
            <p className="text-sm text-red-500 mt-1">Task URL is required.</p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-base font-medium truncate">Description</p>
          <textarea
            rows={5}
            placeholder="Write task details"
            {...register("description", { required: true })}
            aria-invalid={errors.description ? "true" : "false"}
            className="w-full text-base bg-primary-950 border border-border-color rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">
              Description is required.
            </p>
          )}
        </div>

        <div className="relative w-full h-full flex justify-end gap-2.5">
          <button
            onClick={handleCloseUpdateTask}
            type="button"
            className="btn btn-secondary w-full sm:w-auto"
          >
            <MdClose size={18} />
            Cancel
          </button>

          <button
            type="submit"
            className="relative h-10 px-3.5 rounded-md text-nowrap cursor-pointer flex justify-center items-center gap-1.5 bg-linear-to-r from-[#0088cc] via-[#0099e6] to-[#00bfff] transition-colors duration-300"
          >
            <BsDatabaseFillAdd size={18} />
            <span>{isLoading ? "Processing..." : "Update"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTaskManager;
