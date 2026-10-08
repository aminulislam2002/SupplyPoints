import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { IoImageOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { BsDatabaseFillAdd } from "react-icons/bs";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";

const TodoSubmit = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const {
    isPending,
    data: task = {},
    refetch,
  } = useQuery({
    queryKey: ["seller-todo-task", taskId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/seller-todo/my-task/${taskId}`);
      return res?.data?.data || {};
    },
    enabled: Boolean(taskId),
    refetchInterval: 60000,
  });

  const previewImages = useMemo(
    () => selectedImages.map((file) => URL.createObjectURL(file)),
    [selectedImages],
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();

    if (!selectedImages?.length) {
      await Swal.fire({
        title: "Please select at least one image",
        icon: "warning",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      const res = await axiosSecure.post(
        `/seller-todo/submit-task/${taskId}`,
        formData,
      );

      const successMessage = res?.data?.message || "Success";
      await Swal.fire({ title: successMessage, icon: "success" });
      setSelectedImages([]);
      await refetch();
      navigate("/dashboard/seller/todo-list");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      await Swal.fire({ title: errorMessage, icon: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Submit Task Proof</h1>
            <p className="text-sm text-text-secondary mt-1">
              Upload multiple screenshots/images to complete this task
            </p>
          </div>

          <div className="inline-flex h-10 items-center px-4 rounded-md surface-muted text-sm font-medium">
            Reward: ৳{Number(task?.taskValue || 0).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="card p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{task?.packName || "Pack"}</h3>
        </div>

        <div className="control border bg-section-bg/30 p-3">
          <p className="text-sm font-semibold text-primary-300 mb-1">
            Instruction
          </p>
          <p className="text-sm text-text-primary leading-relaxed">
            {task?.description || "N/A"}
          </p>
        </div>

        <a
          href={task?.taskUrl}
          target="_blank"
          rel="noreferrer"
          className="btn primary-btn inline-flex h-10 items-center px-4 rounded-md text-white text-sm font-medium transition-colors duration-300"
        >
          Open Task Link
        </a>

        {task?.isCompletedToday ? (
          <div className="control border p-4">
            <p className="text-sm text-text-secondary">
              You already completed this task today. Please try again after
              12:00 AM.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitProof} className="space-y-4">
            <div>
              <label
                htmlFor="proofImages"
                className="control w-full min-h-32 border border-dashed flex flex-col justify-center items-center gap-2.5 cursor-pointer p-4"
              >
                <IoImageOutline size={24} />
                <span className="text-sm text-primary-300 text-center">
                  Select Multiple Images (Max 10)
                </span>
                <input
                  id="proofImages"
                  type="file"
                  multiple
                  accept="image/jpg, image/jpeg, image/png, image/webp, image/gif"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {previewImages?.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {previewImages.map((img, index) => (
                  <div
                    key={img}
                    className="control relative border overflow-hidden"
                  >
                    <img
                      src={img}
                      alt={`Proof ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-primary-50 text-red-500 cursor-pointer"
                    >
                      <MdClose size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => navigate("/dashboard/seller/todo-list")}
                className="btn danger-btn h-10 px-3.5"
              >
                <MdClose size={18} />
                Cancel
              </button>

              <button
                type="submit"
                className="btn primary-btn h-10 px-3.5 rounded-md cursor-pointer flex justify-center items-center gap-1.5 text-white transition-colors duration-300 disabled:bg-primary-800 disabled:cursor-not-allowed"
                disabled={isLoading || !selectedImages?.length}
              >
                <BsDatabaseFillAdd size={18} />
                <span>{isLoading ? "Uploading..." : "Submit Task"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TodoSubmit;
