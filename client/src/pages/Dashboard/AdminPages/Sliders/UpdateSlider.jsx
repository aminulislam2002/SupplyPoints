import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoImageOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import { BsDatabaseFillAdd } from "react-icons/bs";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";

const UpdateSlider = ({ refetch, setIsUpdateSlider, sliderId, modal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [selectedImage, setSelectedImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  const { register, handleSubmit, reset, setValue } = useForm();

  // Fetch slider data
  useEffect(() => {
    const fetchSlider = async () => {
      try {
        setIsFetching(true);
        const res = await axiosPublic.get(`/sliders/${sliderId}`);
        const slider = res?.data?.data;
        setExistingImage(slider?.image);
        setValue("link", slider?.link || "");
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message || "Failed to fetch slider",
          icon: "error",
        });
      } finally {
        setIsFetching(false);
      }
    };

    if (sliderId) {
      fetchSlider();
    }
  }, [sliderId, axiosPublic, setValue]);

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

  // Update Slider
  const onSubmit = async (data) => {
    setIsLoading(true);

    const formData = new FormData();

    // Append the image if a new one is selected
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    // Append link if provided
    if (data.link) {
      formData.append("link", data.link);
    }

    try {
      const res = await axiosSecure.put(
        `/sliders/update-slider/${sliderId}`,
        formData,
      );
      const successMessage =
        res?.data?.message || "Slider updated successfully";
      refetch();
      reset();
      modal.close();
      setSelectedImage(null);
      setIsUpdateSlider(false);
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

  // Update Slider Modal Close
  const handleCloseUpdateSlider = () => {
    setIsUpdateSlider(false);
    reset();
    setSelectedImage(null);
    modal.close();
  };

  if (isFetching) {
    return <Loader />;
  }

  return (
    <div>
      <h3 className="section-title w-full border-b border-dashed border-border-color pb-2.5 text-center text-primary-600">
        Update Slider
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2.5">
        <div className="relative w-full h-full flex flex-col">
          <label
            htmlFor="image"
            className="text-base font-medium mb-1 lg:mb-1.5"
          >
            Slider Image
          </label>

          <div className="flex flex-col justify-start items-center gap-5 flex-wrap">
            {/* Existing Image */}
            {existingImage && !selectedImage && (
              <div className="relative">
                <img
                  src={import.meta.env.VITE_IMAGE_URL + existingImage}
                  alt="Current Slider"
                  className="w-full h-52 object-cover rounded border-2 border-border-color"
                />
                <span className="absolute top-1 left-1 bg-primary-950  text-xs px-2 py-1 rounded">
                  Current
                </span>
              </div>
            )}

            {/* Upload New Image */}
            <label
              htmlFor="image"
              className="flex h-52 w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-lg border border-dashed border-border-color bg-section-bg"
            >
              <IoImageOutline size={20} />
              <span className="text-[12px] font-normal text-primary-600  text-center px-2">
                {existingImage
                  ? "Upload New Image"
                  : "Recommended Size (1920px × 600px)"}
              </span>
              <input
                {...register("image")}
                id="image"
                type="file"
                onChange={imageChange}
                accept="image/jpg, image/jpeg, image/png, image/webp, image/gif"
                style={{ display: "none" }}
              />
            </label>

            {/* New Selected Image */}
            {selectedImage && (
              <div className="relative">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className="w-full h-52 object-cover rounded border-2 border-primary-500"
                />
                <span className="absolute top-1 left-1 bg-green-500 text-primary-50 text-xs px-2 py-1 rounded">
                  New
                </span>
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
            onClick={handleCloseUpdateSlider}
            type="button"
            disabled={isLoading}
            className="btn btn-danger h-10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-base font-medium">Cancel</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary h-10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <BsDatabaseFillAdd size={16} />
            <span className="text-base font-medium">
              {isLoading ? "Updating..." : "Update Slider"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSlider;
