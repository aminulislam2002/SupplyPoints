import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IoImageOutline } from "react-icons/io5";
import { MdClose, MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import { BsDatabaseFillAdd } from "react-icons/bs";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";

const UpdateCategory = ({
  categoryId,
  setIsUpdateCategory,
  setCategoryId,
  refetch,
  modal,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [selectedImage, setSelectedImage] = useState(null);

  // Get a specific category by id
  const { isPending: isCategoryLoading, data: category = {} } = useQuery({
    queryKey: ["categoryId", categoryId],
    queryFn: async () => {
      const res = await axiosPublic.get(`/categories/${categoryId}`);
      return res?.data && res?.data?.data;
    },
    refetchOnWindowFocus: true,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  setValue("name", category?.name || "");

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  // Update Category
  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    for (const key in data) {
      if (key !== "image") {
        formData.append(key, data[key]);
      }
    }

    try {
      const res = await axiosSecure.put(
        `/categories/update-category/${category?._id}`,
        formData,
      );

      refetch();
      reset();
      setSelectedImage(null);
      setIsUpdateCategory(false);
      setCategoryId(null);
      await modal.close();

      const successMessage = res?.data?.message || "Success";
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

  // Update Category Modal Close
  const handleCloseUpdateCategory = () => {
    reset();
    setSelectedImage(null);
    setIsUpdateCategory(false);
    setCategoryId(null);
    modal.close();
  };

  if (isCategoryLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h3 className="section-title w-full border-b border-dashed border-border-color pb-2.5 text-center text-primary-600">
        Update Category
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2.5">
        <div className="relative w-full h-full flex flex-col">
          <label
            htmlFor="image"
            className="text-base font-medium mb-1 lg:mb-1.5"
          >
            Category Image
          </label>

          <div className="flex flex-wrap justify-start items-center gap-5">
            <label
              htmlFor="image"
              className="w-[125px] h-[125px] flex flex-col justify-center items-center gap-2.5 cursor-pointer border border-border-color border-dashed rounded-md"
            >
              <IoImageOutline size={20} />
              <span className="text-[12px] font-normal text-primary-600 text-center">
                Recommended Size (500px × 500px)
              </span>
              <input
                {...register("image", { required: false })}
                id="image"
                type="file"
                onChange={imageChange}
                accept="image/jpg, image/jpeg, image/png, image/webp, image/gif"
                style={{ display: "none" }}
              />
            </label>

            {selectedImage ? (
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
                  <MdDeleteForever size={20} />
                </button>
              </div>
            ) : category?.image ? (
              <div className="mt-2">
                <img
                  src={import.meta.env.VITE_IMAGE_URL + category.image}
                  alt="Selected"
                  className="w-[125px] h-[125px] object-cover rounded"
                />
              </div>
            ) : (
              <p>Please Select an Image</p>
            )}
          </div>
        </div>

        <div className="relative w-full h-full flex flex-col">
          <label
            htmlFor="name"
            className="text-base font-medium  mb-1 lg:mb-1.5"
          >
            Category Name
          </label>
          <input
            id="name"
            {...register("name", { required: true })}
            placeholder="Example: T-Shirt"
            aria-invalid={errors.name ? "true" : "false"}
            className="w-full p-2.5 rounded-md  border border-border-color text-base font-medium focus:outline-none"
          />
          {errors.name?.type === "required" && (
            <p
              role="alert"
              className="font-primary text-base font-medium text-red-500 mt-1 lg:mt-1.5"
            >
              This Field is Required
            </p>
          )}
        </div>

        <div className="relative w-full h-full flex justify-end gap-2.5">
          <button
            onClick={handleCloseUpdateCategory}
            type="button"
            className="btn btn-secondary w-full sm:w-auto"
          >
            <MdClose size={18}></MdClose>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary w-full sm:w-auto">
            <BsDatabaseFillAdd size={18}></BsDatabaseFillAdd>
            <span>{isLoading ? "Processing..." : "Update"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCategory;
