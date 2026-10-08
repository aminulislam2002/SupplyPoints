import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoImageOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import { BsDatabaseFillAdd } from "react-icons/bs";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";

const AddSlider = ({ refetch, setIsAddNewSlider, modal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // Preview the selected image
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Clear the preview / selected image
  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  // Post Slider
  const onSubmit = async (data) => {
    setIsLoading(true);

    const formData = new FormData();

    // Append the image (single file)
    formData.append("image", selectedImage);

    // Append link if provided
    if (data.link) {
      formData.append("link", data.link);
    }

    try {
      const res = await axiosSecure.post("/sliders/add-slider", formData);
      const successMessage = res?.data?.message || "Slider added successfully";
      refetch();
      reset();
      modal.close();
      setSelectedImage(null);
      setIsAddNewSlider(false);
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

  // Add Slider Modal Close
  const handleCloseAddSlider = () => {
    setIsAddNewSlider(false);
    reset();
    setSelectedImage(null);
    modal.close();
  };

  return (
    <div>
      <h3 className="section-title w-full border-b border-dashed border-border-color pb-2.5 text-center text-primary-600">
        Add New Slider
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2.5">
        <div className="relative w-full h-full flex flex-col">
          <label
            htmlFor="image"
            className="text-base font-medium mb-1 lg:mb-1.5"
          >
            Slider Image <span className="text-red-500">*</span>
          </label>

          <div className="flex flex-col justify-start items-center gap-5">
            <label
              htmlFor="image"
              className="flex h-52 w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-lg border border-dashed border-border-color bg-section-bg"
            >
              <IoImageOutline size={20} />
              <span className="text-[12px] font-normal text-primary-600  text-center px-2">
                Recommended Size (1920px × 1280px)
              </span>
              <input
                {...register("image", { required: true })}
                id="image"
                type="file"
                onChange={imageChange}
                accept="image/jpg, image/jpeg, image/png, image/webp, image/gif"
                style={{ display: "none" }}
              />
            </label>

            {selectedImage && (
              <div className="mt-2 relative">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className="w-full h-52 object-cover rounded"
                />

                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="text-red-500 text-sm absolute top-1 right-1 cursor-pointer bg-primary-50 rounded-full p-1 hover:bg-primary-100 transition-colors duration-300"
                >
                  <MdDeleteForever size={20} />
                </button>
              </div>
            )}
          </div>

          {errors.image?.type === "required" && (
            <p
              role="alert"
              className="text-base font-medium text-red-500 mt-1 lg:mt-1.5"
            >
              Slider image is required
            </p>
          )}
        </div>

        <div className="relative w-full h-full flex flex-col">
          <label
            htmlFor="link"
            className="text-base font-medium mb-1 lg:mb-1.5"
          >
            Link URL (Optional)
          </label>
          <input
            {...register("link")}
            id="link"
            type="url"
            placeholder="https://example.com"
            className="control h-10"
          />
          <p className="text-xs text-primary-600 mt-1">
            Enter a URL if you want the slider to be clickable
          </p>
        </div>

        <div className="relative w-full h-full flex justify-end items-center gap-2.5 pt-2.5">
          <button
            onClick={handleCloseAddSlider}
            type="button"
            disabled={isLoading}
            className="btn danger-btn h-10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-base font-medium">Cancel</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="btn primary-btn h-10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <BsDatabaseFillAdd size={16} />
            <span className="text-base font-medium">
              {isLoading ? "Adding..." : "Add Slider"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSlider;
