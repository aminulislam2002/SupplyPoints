import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Loader from "../../../../components/Loader/Loader";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import { Link } from "react-router";
import { LuEye, LuKeyRound } from "react-icons/lu";
import { RiDeleteBin5Line, RiShieldUserLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa6";
import { TbHandClick, TbPlaystationTriangle } from "react-icons/tb";
import { FcApproval } from "react-icons/fc";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Current page number
  const [searchQuery, setSearchQuery] = useState("");
  const [sortQuery, setSortQuery] = useState("");
  const [role, setRole] = useState("");
  const [limitPerPage, setLimitPerPage] = useState(5);
  const [reqFreeActivation, setReqFreeActivation] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  // Fetch all users
  const {
    isPending,
    isFetching,
    data: allUserResponse = {}, // Default to an empty object
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["allUser", currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/all", {
        params: {
          currentPage,
          limitPerPage,
          searchQuery,
          sortQuery,
          role,
          reqFreeActivation,
        },
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    refetch();
  }, [refetch, limitPerPage, searchQuery, sortQuery, role, reqFreeActivation]);

  // Destructure data and hasMore
  const { data: allUser = [], totalUsers, hasMore } = allUserResponse;

  const handleResetAllQuery = () => {
    setIsResetQueryLoading(true); // Start the loading animation
    try {
      // Reset all states
      setSearchQuery("");
      setSortQuery("");
      setRole("");
      setLimitPerPage(5);
      setCurrentPage(0);
      setReqFreeActivation(false);
    } catch (error) {
      console.error(error);
    } finally {
      // Delay stopping the animation slightly
      setTimeout(() => {
        setIsResetQueryLoading(false); // Stop the loading animation
      }, 500);
    }
  };

  //   Handle user "Admin" role
  const handleUserAdminRole = async (id, role) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to ${
        role === "Blocked" ? "Block" : "Unblock"
      } this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I want!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.put(`/users/role/${id}`, {
            role,
          });

          const successMessage = res?.data?.message || "Success";
          Swal.fire({
            title: successMessage,
            icon: "success",
          });

          refetch();
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong!";
          Swal.fire({
            title: errorMessage,
            icon: "error",
          });
        }
      }
    });
  };

  // Delete an user
  const handleDeleteUser = (id) => {
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
          const res = await axiosSecure.delete(`/users/${id}`);
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

  // Impersonated Sign-In by Admin
  const handleSignInByAdmin = async (userIdentifier) => {
    try {
      const res = await axiosSecure.post(`/users/impersonate`, {
        userIdentifier,
      });

      window.location.href = `${import.meta.env.VITE_CLIENT_URL}?token=${
        res.data.accessToken
      }`;
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
  };

  // Handle Active Account
  const handleActiveAccount = async (id) => {
    try {
      const res = await axiosSecure.put(`/users/status/${id}`);
      const successMessage =
        res?.data?.message || "Account activated successfully!";
      Swal.fire({
        title: "Success!",
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
  };

  // Handle Password Change
  const handlePasswordChange = async () => {
    if (!selectedUser?.identifier) return;

    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      return Swal.fire({
        title: "Please enter password!",
        icon: "warning",
      });
    }

    if (passwordData.newPassword.length < 8) {
      return Swal.fire({
        title: "Password must be at least 8 characters!",
        icon: "warning",
      });
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return Swal.fire({
        title: "Passwords do not match!",
        icon: "warning",
      });
    }

    try {
      setIsPasswordUpdating(true);

      const res = await axiosSecure.put("/users/change-by-admin", {
        identifier: selectedUser.identifier,
        newPassword: passwordData.newPassword,
      });

      const successMessage =
        res?.data?.message || "Password changed successfully!";

      if (res?.data?.isValid) {
        await Swal.fire({
          title: successMessage,
          icon: "success",
        });

        setShowPasswordModal(false);
        setSelectedUser(null);

        setPasswordData({
          newPassword: "",
          confirmPassword: "",
        });
      }
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
      setIsPasswordUpdating(false);
    }
  };

  if (isPending && allUser?.length === 0) {
    return <Loader></Loader>;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      {/* Search and reset button */}
      <div className="flex flex-col items-start justify-between gap-3 border-b border-border-color pb-4 lg:flex-row lg:items-center">
        <h3 className="page-title text-xl">Users - {totalUsers}</h3>

        <div className="w-full lg:w-1/3 flex justify-between items-center gap-2.5">
          <div className="w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search an user?..."
              className="control h-10"
            />
          </div>

          <button onClick={handleResetAllQuery} className="btn-icon h-10 w-10">
            <TfiReload
              size={15}
              className={isResetQueryLoading ? "animate-spin" : ""}
            ></TfiReload>
          </button>
        </div>
      </div>

      {/* Filter, sort and pagination query */}
      <div className="py-2.5">
        <div className="flex flex-wrap justify-start items-center gap-2.5">
          {/* Sort Selected */}
          <div className="relative">
            <select
              value={sortQuery}
              onChange={(e) => setSortQuery(e.target.value)}
              className="control h-10"
            >
              <option value="">Sort by (Default)</option>
              {[
                { value: "newest", label: "New Joining" },
                { value: "oldest", label: "Old Joining" },
                { value: "A-Z", label: "Name (A-Z)" },
                { value: "Z-A", label: "Name (Z-A)" },
              ]?.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Role Selected */}
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="control h-10"
            >
              <option value="">All Users</option>
              {["User", "Seller", "Admin", "Blocked"]?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <button
              onClick={() => setReqFreeActivation(true)}
              disabled={reqFreeActivation}
              className="btn primary-btn w-full sm:w-auto"
            >
              Activation Request
            </button>
          </div>

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
        </div>
      </div>

      {/* User Table */}
      <div className="table-shell">
        <table className="table table-xs">
          <thead className="bg-section-bg">
            <tr className="h-10 text-sm text-nowrap font-normal text-center">
              <th>#</th>
              <th className="text-left">Profile</th>
              <th>Role</th>
              <th>Code</th>
              <th>Invite</th>
              <th>Balance</th>
              <th>Earnings</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="5">Loading...</td>
              </tr>
            ) : allUser?.length === 0 ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="5">No users found.</td>
              </tr>
            ) : (
              allUser?.map((user, index) => (
                <tr
                  key={user?._id}
                  className={`h-10 text-sm text-nowrap font-normal text-center border-b border-border-color ${searchQuery && user?.referralCode?.includes(searchQuery) ? "text-yellow-500 animate-pulse hover:animate-none transition-all duration-300" : ""}`}
                >
                  <th>{currentPage * limitPerPage + index + 1}</th>
                  <td>
                    <div className="flex justify-start items-center gap-2.5">
                      <div>
                        {user?.photo ? (
                          <div className="w-12 h-12 mx-auto">
                            <img
                              src={import.meta.env.VITE_IMAGE_URL + user?.photo}
                              alt={user?.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 mx-auto flex justify-center items-center bg-primary-950  rounded-full">
                            <FaUser size={20} className="text-primary-600" />
                          </div>
                        )}
                      </div>

                      <div className="text-start space-y-0.5">
                        <p>{user?.name}</p>
                        <p className="text-xs">{user?.identifier}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm font-medium">
                    <p
                      className={
                        user?.role === "User"
                          ? "text-yellow-500"
                          : user?.role === "Seller"
                            ? "text-primary-500"
                            : user?.role === "Blocked"
                              ? "text-red-500"
                              : ""
                      }
                    >
                      {user?.role}
                    </p>
                  </td>
                  <td>{user?.referralCode} </td>
                  <td>
                    {user?.referredBy && (
                      <button
                        className="btn primary-btn w-full sm:w-auto"
                        onClick={() =>
                          searchQuery !== user?.referredBy &&
                          setSearchQuery(user?.referredBy)
                        }
                      >
                        Click <TbHandClick size={16} />
                      </button>
                    )}
                  </td>
                  <td>৳ {user?.balance?.toFixed(2)}</td>
                  <td>৳ {user?.withdrawals?.toFixed(2)}</td>
                  <td>
                    <div className="flex justify-center items-center gap-2">
                      {user?.role === "User" &&
                        user?.status === "Inactive" &&
                        user?.subscriptionType === "Free" && (
                          <button
                            title="Activate Account"
                            onClick={() => handleActiveAccount(user?._id)}
                          >
                            <FcApproval
                              size={20}
                              className="text-green-500 cursor-pointer"
                            />
                          </button>
                        )}
                      <button
                        title="Change Role"
                        onClick={() =>
                          handleUserAdminRole(
                            user?._id,
                            user?.isBlocked && user?.status === "Inactive"
                              ? "User"
                              : user?.isBlocked
                                ? "Seller"
                                : "Blocked",
                          )
                        }
                      >
                        <TbPlaystationTriangle
                          size={20}
                          className={
                            user?.isBlocked
                              ? "text-red-500 cursor-pointer"
                              : "text-green-500 cursor-pointer"
                          }
                        />
                      </button>

                      <button
                        title="Sign In as User"
                        onClick={() => handleSignInByAdmin(user?.identifier)}
                      >
                        <RiShieldUserLine
                          size={18}
                          className="text-blue-500 cursor-pointer"
                        />
                      </button>

                      <button
                        type="button"
                        title="Change Password"
                        onClick={() => {
                          setSelectedUser(user);
                          setPasswordData({
                            newPassword: "",
                            confirmPassword: "",
                          });
                          setShowNewPassword(false);
                          setShowConfirmPassword(false);
                          setShowPasswordModal(true);
                        }}
                      >
                        <LuKeyRound
                          size={19}
                          className="text-yellow-500 hover:text-yellow-400 cursor-pointer"
                        />
                      </button>

                      <button
                        title="Delete User"
                        onClick={() => handleDeleteUser(user?._id)}
                      >
                        <RiDeleteBin5Line
                          size={18}
                          className="text-red-500 cursor-pointer"
                        />
                      </button>

                      <Link
                        to={`/dashboard/admin/all-users/user-details/${user?._id}`}
                        state={{ user }}
                      >
                        <LuEye size={20} className="text-blue-500" />
                      </Link>
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
              : "bg-primary-950  rounded-md p-1.5 transition-colors duration-300 cursor-pointer"
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
              : "bg-primary-950  rounded-md p-1.5 transition-colors duration-300 cursor-pointer"
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

      {/* Admin Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-secondary-950/70 p-4 backdrop-blur-sm sm:p-6">
          <div className="surface max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl shadow-2xl sm:max-h-[calc(100vh-3rem)]">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border-color px-5 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-text-primary sm:text-xl">
                  Change Password
                </h2>
                {selectedUser && (
                  <p className="mt-1 wrap-break-word text-sm text-text-secondary">
                    {selectedUser.name}{" "}
                    <span className="text-text-muted">
                      ({selectedUser.identifier})
                    </span>
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setSelectedUser(null);
                  setPasswordData({
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                aria-label="Close password change modal"
                className="btn-icon h-9 w-9 shrink-0 text-text-secondary hover:border-danger/40 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  ×
                </span>
              </button>
            </div>

            {/* Body */}
            <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
              {/* New Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter new password"
                    className="control h-11 w-full pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    aria-label={
                      showNewPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                    className="btn-icon absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 border-0 text-text-secondary hover:bg-secondary-100 hover:text-primary-600 dark:hover:bg-secondary-800"
                  >
                    <LuEye size={17} />
                  </button>
                </div>

                <p className="mt-2 text-xs leading-5 text-text-secondary">
                  Password must be at least 8 characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Confirm new password"
                    className="control h-11 w-full pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="btn-icon absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 border-0 text-text-secondary hover:bg-secondary-100 hover:text-primary-600 dark:hover:bg-secondary-800"
                  >
                    <LuEye size={17} />
                  </button>
                </div>

                {passwordData.newPassword &&
                  passwordData.confirmPassword &&
                  passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                      Passwords do not match.
                    </p>
                  )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-border-color pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setSelectedUser(null);
                    setPasswordData({
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  disabled={isPasswordUpdating}
                  className="btn secondary-btn w-full sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handlePasswordChange}
                  disabled={
                    isPasswordUpdating ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword ||
                    passwordData.newPassword.length < 8 ||
                    passwordData.newPassword !== passwordData.confirmPassword
                  }
                  className="btn primary-btn w-full sm:w-auto"
                >
                  {isPasswordUpdating ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
