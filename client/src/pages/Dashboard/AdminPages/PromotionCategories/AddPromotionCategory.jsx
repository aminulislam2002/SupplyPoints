import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoImageOutline } from "react-icons/io5";
import { MdClose, MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import { BsDatabaseFillAdd } from "react-icons/bs";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";

const AddPromotionCategory = ({ refetch, setIsAddNewCategory, modal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("name", data?.name || "");

    try {
      const res = await axiosSecure.post(
        "/promotion-categories/add-category",
        formData,
      );

      refetch();
      reset();
      setSelectedImage(null);
      setIsAddNewCategory(false);
      await modal.close();

      const successMessage = res?.data?.message || "Success";
      await Swal.fire({ title: successMessage, icon: "success" });
    } catch (error) {
      refetch();
      reset();
      setSelectedImage(null);
      setIsAddNewCategory(false);
      await modal.close();

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

  const handleCloseAddCategory = () => {
    setIsAddNewCategory(false);
    reset();
    setSelectedImage(null);
    modal.close();
  };

  return (
    <div className="min-w-0">
      <h3 className="section-title w-full border-b border-dashed border-border-color pb-3 text-center text-primary-600">
        Add Promotion Category
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2.5">
        <div className="relative w-full h-full flex flex-col">
          <label
            htmlFor="image"
            className="text-base font-medium  mb-1 lg:mb-1.5"
          >
            Category Image
          </label>

          <div className="flex flex-wrap justify-start items-center gap-5">
            <label
              htmlFor="image"
              className="w-[125px] h-[125px] flex flex-col justify-center items-center gap-2.5 cursor-pointer border border-border-color border-dashed rounded-md"
            >
              <IoImageOutline size={20} />
              <span className="text-[12px] font-normal text-primary-600  text-center">
                Recommended Size (500px × 500px)
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
                  className="w-[125px] h-[125px] object-cover rounded"
                />

                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="text-red-500 text-sm absolute top-1 right-1 cursor-pointer bg-primary-50 rounded-full p-1 hover:bg-primary-100 transition-colors duration-300"
                >
                  <MdDeleteForever size={20}></MdDeleteForever>
                </button>
              </div>
            )}
          </div>

          {errors.image?.type === "required" && (
            <p
              role="alert"
              className="text-base font-medium text-red-500 mt-1 lg:mt-1.5"
            >
              This Field is Required
            </p>
          )}
        </div>

        <div className="relative flex w-full flex-col">
          <label
            htmlFor="name"
            className="mb-2 text-sm font-semibold text-text-primary"
          >
            Category Name
          </label>
          <input
            id="name"
            {...register("name", { required: true })}
            placeholder="Example: Facebook Promotion"
            aria-invalid={errors.name ? "true" : "false"}
            className="control w-full"
          />
          {errors.name?.type === "required" && (
            <p role="alert" className="mt-2 text-sm font-medium text-red-500">
              This Field is Required
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse justify-end gap-3 border-t border-border-color pt-4 sm:flex-row">
          <button
            onClick={handleCloseAddCategory}
            type="button"
            className="btn btn-secondary w-full sm:w-auto"
          >
            <MdClose size={18} />
            Cancel
          </button>
          <button type="submit" className="btn btn-primary w-full sm:w-auto">
            <BsDatabaseFillAdd size={18} />
            <span>{isLoading ? "Processing..." : "Add New"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPromotionCategory;
