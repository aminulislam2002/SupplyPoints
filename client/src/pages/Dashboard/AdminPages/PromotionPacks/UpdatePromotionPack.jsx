import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IoImageOutline } from "react-icons/io5";
import { MdClose, MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import { BsDatabaseFillAdd } from "react-icons/bs";
import Loader from "../../../../components/Loader/Loader";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import usePromotionCategories from "../../../../hooks/usePromotionCategories/usePromotionCategories";

const UpdatePromotionPack = ({
  packId,
  setPackId,
  setIsUpdatePack,
  refetch,
  modal,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [selectedImage, setSelectedImage] = useState(null);

  const { isPromotionCategoriesLoading, promotionCategories } =
    usePromotionCategories();

  const { isPending: isPackLoading, data: pack = {} } = useQuery({
    queryKey: ["promotionPackId", packId],
    queryFn: async () => {
      const res = await axiosPublic.get(`/promotion-packs/${packId}`);
      return res?.data?.data || {};
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

  setValue("name", pack?.name || "");
  setValue("title", pack?.title || "");
  setValue("price", pack?.price || "");
  setValue("durationDays", pack?.durationDays || "");
  setValue("description", pack?.description || "");
  setValue("category", pack?.category || "");

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

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    for (const key in data) {
      formData.append(key, data[key]);
    }

    try {
      const res = await axiosSecure.put(
        `/promotion-packs/update-pack/${pack?._id}`,
        formData,
      );

      refetch();
      reset();
      setSelectedImage(null);
      setIsUpdatePack(false);
      setPackId(null);
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

  const handleCloseUpdatePack = () => {
    setPackId(null);
    reset();
    setSelectedImage(null);
    setIsUpdatePack(false);
    modal.close();
  };

  if (isPackLoading || isPromotionCategoriesLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h3 className="w-full h-auto text-lg font-medium text-center pb-2.5 border-b border-dashed border-border-color text-primary-500">
        Update Promotion Pack
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2.5">
        <div className="relative w-full h-full flex flex-col">
          <label
            htmlFor="image"
            className="text-base font-medium mb-1 lg:mb-1.5"
          >
            Pack Image
          </label>

          <div className="flex flex-wrap justify-start items-center gap-5">
            <label
              htmlFor="image"
              className="w-[125px] h-[125px] flex flex-col justify-center items-center gap-2.5 cursor-pointer border border-border-color border-dashed rounded-md"
            >
              <IoImageOutline size={20} />
              <span className="text-[12px] font-normal text-primary-600 text-center">
                Recommended Size (800px x 500px)
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
            ) : pack?.image ? (
              <div className="mt-2">
                <img
                  src={import.meta.env.VITE_IMAGE_URL + pack?.image}
                  alt="Selected"
                  className="w-[125px] h-[125px] object-cover rounded"
                />
              </div>
            ) : (
              <p>Please Select an Image</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative w-full h-full flex flex-col">
            <label
              htmlFor="category"
              className="text-base font-medium mb-1 lg:mb-1.5"
            >
              Category
            </label>
            <select
              id="category"
              {...register("category", { required: true })}
              className="w-full p-2.5 rounded-md border border-border-color text-base font-medium focus:outline-none"
            >
              <option value="" className="bg-primary-700">
                Select Category
              </option>
              {promotionCategories.map((option) => (
                <option
                  key={option?._id}
                  value={option?._id}
                  className="bg-primary-700"
                >
                  {option?.name}
                </option>
              ))}
            </select>
            {errors.category?.type === "required" && (
              <p
                role="alert"
                className="text-base font-medium text-red-500 mt-1 lg:mt-1.5"
              >
                This Field is Required
              </p>
            )}
          </div>

          <div className="relative w-full h-full flex flex-col">
            <label
              htmlFor="name"
              className="text-base font-medium mb-1 lg:mb-1.5"
            >
              Pack Name
            </label>
            <input
              id="name"
              {...register("name", { required: true })}
              placeholder="Example: Starter Pack"
              className="w-full p-2.5 rounded-md border border-border-color text-base font-medium focus:outline-none"
            />
            {errors.name?.type === "required" && (
              <p
                role="alert"
                className="text-base font-medium text-red-500 mt-1 lg:mt-1.5"
              >
                This Field is Required
              </p>
            )}
          </div>

          <div className="relative w-full h-full flex flex-col md:col-span-2">
            <label
              htmlFor="title"
              className="text-base font-medium mb-1 lg:mb-1.5"
            >
              Title
            </label>
            <input
              id="title"
              {...register("title", { required: true })}
              placeholder="Example: Facebook Growth Booster"
              className="w-full p-2.5 rounded-md border border-border-color text-base font-medium focus:outline-none"
            />
            {errors.title?.type === "required" && (
              <p
                role="alert"
                className="text-base font-medium text-red-500 mt-1 lg:mt-1.5"
              >
                This Field is Required
              </p>
            )}
          </div>

          <div className="relative w-full h-full flex flex-col">
            <label
              htmlFor="price"
              className="text-base font-medium mb-1 lg:mb-1.5"
            >
              Price (BDT)
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              {...register("price", { required: true })}
              placeholder="Example: 2500"
              className="w-full p-2.5 rounded-md border border-border-color text-base font-medium focus:outline-none"
            />
            {errors.price?.type === "required" && (
              <p
                role="alert"
                className="text-base font-medium text-red-500 mt-1 lg:mt-1.5"
              >
                This Field is Required
              </p>
            )}
          </div>

          <div className="relative w-full h-full flex flex-col">
            <label
              htmlFor="durationDays"
              className="text-base font-medium mb-1 lg:mb-1.5"
            >
              Duration (Days)
            </label>
            <input
              id="durationDays"
              type="number"
              min="1"
              {...register("durationDays", { required: true })}
              placeholder="Example: 30"
              className="w-full p-2.5 rounded-md border border-border-color text-base font-medium focus:outline-none"
            />
            {errors.durationDays?.type === "required" && (
              <p
                role="alert"
                className="text-base font-medium text-red-500 mt-1 lg:mt-1.5"
              >
                This Field is Required
              </p>
            )}
          </div>

          <div className="relative w-full h-full flex flex-col md:col-span-2">
            <label
              htmlFor="description"
              className="text-base font-medium mb-1 lg:mb-1.5"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register("description", { required: true })}
              placeholder="Write promotion package details"
              className="w-full p-2.5 rounded-md border border-border-color text-base font-medium focus:outline-none"
            />
            {errors.description?.type === "required" && (
              <p
                role="alert"
                className="text-base font-medium text-red-500 mt-1 lg:mt-1.5"
              >
                This Field is Required
              </p>
            )}
          </div>
        </div>

        <div className="relative w-full h-full flex justify-end gap-2.5">
          <button
            onClick={handleCloseUpdatePack}
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

export default UpdatePromotionPack;
