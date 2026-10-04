import { useState, useEffect } from "react";
import { FaUser, FaCamera, FaEdit, FaSave } from "react-icons/fa";
import { SiShopee } from "react-icons/si";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth/useAuth";
import Loader from "../../../../components/Loader/Loader";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const SellerProfile = () => {
  const { user, isUserPending, refetchUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const axiosSecure = useAxiosSecure();
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // Set default values when user data is available
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        businessName: user.businessName || "",
      });
    }
  }, [user, reset]);

  // preview the selected image
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSaveProfile = async (data) => {
    setIsUpdating(true);

    const formData = new FormData();

    // Append the image (single file)
    formData.append("image", selectedImage);

    // Append form fields
    for (const key in data) {
      if (key !== "image") {
        formData.append(key, data[key]);
      }
    }

    try {
      const res = await axiosSecure.put("/users/profile", formData);
      const successMessage =
        res?.data?.message || "Profile updated successfully";

      await refetchUser();
      setSelectedImage(null);
      setIsEditing(false);

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
      setIsUpdating(false);
    }
  };

  const getPreviousMonthYear = (dateString) => {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() - 1);

    const options = { month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Fetch all orders
  const {
    isLoading: isPendingOrders,
    isFetching,
    data: allOrdersResponse = {},
    isPlaceholderData,
  } = useQuery({
    queryKey: ["my-orders-records"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders/my-orders");

      return res?.data;
    },

    placeholderData: keepPreviousData,
  });

  const { data: myOrders = [], totalOrders } = allOrdersResponse;

  const totalSpent = myOrders
    .filter((order) => order.deliveryStatus === "Delivered")
    .reduce((total, order) => total + parseFloat(order.totalCost || 0), 0);

  if (isUserPending || isPendingOrders) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">My Profile</h1>
            <p className="text-sm text-text-secondary mt-1">
              Manage your personal information and business details
            </p>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary inline-flex items-center gap-2 h-11 px-4 rounded-md text-white text-sm font-medium transition-colors duration-300 cursor-pointer"
            >
              <FaEdit size={14} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <div className="card p-6 shadow-sm">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="btn btn-primary control w-28 h-28 rounded-full border flex items-center justify-center text-3xl font-semibold overflow-hidden">
                  {selectedImage ? (
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      className="w-full h-full object-cover"
                      alt="Selected profile preview"
                    />
                  ) : user?.photo ? (
                    <img
                      src={import.meta.env.VITE_IMAGE_URL + user.photo}
                      alt={user?.name || "User profile"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>

                {isEditing && (
                  <label
                    htmlFor="image"
                    className="btn btn-primary absolute -bottom-1 -right-1 p-2.5 rounded-full cursor-pointer shadow"
                    title="Change profile photo"
                  >
                    <FaCamera size={14} />
                    <input
                      id="image"
                      name="image"
                      type="file"
                      onChange={imageChange}
                      accept="image/jpg, image/jpeg, image/png, image/webp, image/gif"
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>

              <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
              <p className="text-sm text-text-secondary mt-1">
                {user?.identifier}
              </p>

              <div className="inline-flex items-center justify-center gap-2 text-xs mt-4 bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Verified Account
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-border-color space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Member Since</span>
                <span className="font-medium text-sm">
                  {getPreviousMonthYear(user?.createdAt)}
                </span>
              </div>

              {isFetching && isPlaceholderData ? (
                <div className="animate-pulse space-y-2 pt-1">
                  <div className="btn btn-primary h-4 rounded w-full"></div>
                  <div className="btn btn-primary h-4 rounded w-4/5"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      Total Orders
                    </span>
                    <span className="font-semibold text-sm text-primary-300">
                      {totalOrders || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      Total Spent
                    </span>
                    <span className="font-semibold text-sm text-green-400">
                      ৳{totalSpent.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit(handleSaveProfile)}>
            <div className="card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-5 pb-3 border-b border-border-color">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-300" />
                    <input
                      type="text"
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 surface-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <SiShopee className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-300" />
                    <input
                      type="text"
                      {...register("businessName", {
                        required: "Business Name is required",
                        minLength: {
                          value: 2,
                          message:
                            "Business Name must be at least 2 characters",
                        },
                      })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 surface-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                    />
                  </div>
                  {errors.businessName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.businessName.message}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="control flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="btn btn-primary inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md text-white text-sm font-medium transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <FaSave size={14} />
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                    disabled={isUpdating}
                    className="h-11 px-5 rounded-md bg-primary-100 text-primary-800 hover:bg-primary-200 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
