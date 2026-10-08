import { useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { FiCopy } from "react-icons/fi";
import { useLocation } from "react-router";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import usePlatform from "../../../../hooks/usePlatform/usePlatform";
import Swal from "sweetalert2";

const UserDetails = () => {
  const location = useLocation();
  const initialUser = location?.state?.user || {};

  const [user, setUser] = useState(initialUser);
  const [copied, setCopied] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { platform } = usePlatform();

  const addForm = useForm();
  const cutForm = useForm();

  // Handle balance add/cut
  const onSubmit = async (data, option) => {
    if (!user?._id) return;

    try {
      const response = await axiosSecure.put(`/users/balance/${user._id}`, {
        amount: data.amount,
        option, // "Increase" or "Decrease"
      });

      // Update local user state with new balance
      setUser((prevUser) => ({
        ...prevUser,
        balance: response.data.newBalance || prevUser.balance,
      }));

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
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

  // small helper to format dates safely
  const formatDate = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "-";
    }
  };

  // Copy identifier to clipboard
  const copyIdentifier = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-5 p-5 sm:p-6">
      <div className="flex min-h-14 w-full items-center gap-3 rounded-lg border border-border-color bg-card-bg px-5 py-3">
        <FaRegCircleUser size={20} /> User Details
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <div className="card col-span-1 p-5">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-700">
              <FaRegCircleUser className="text-3xl" />
            </div>

            <div>
              <h2 className="text-lg font-bold">{user?.name || "-"}</h2>
              <p className="text-sm text-primary-600">
                {user?.businessName || "Business Name"}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">Identifier</p>
                <p className="font-medium">{user?.identifier || "-"}</p>
              </div>
              <button
                onClick={() => copyIdentifier(user?.identifier || "")}
                className="btn-icon ml-3 h-9 w-9"
                title="Copy identifier"
              >
                <FiCopy />
              </button>
            </div>

            <div>
              <p className="text-xs font-medium">Created</p>
              <p className="font-medium">{formatDate(user?.createdAt)}</p>
            </div>

            <div>
              <p className="text-xs font-medium">Last Login</p>
              <p className="font-medium">{formatDate(user?.lastLogin)}</p>
            </div>

            <button
              onClick={() => handleSignInByAdmin(user.identifier)}
              className="btn primary-btn mt-4 w-full gap-2"
            >
              <FaRegCircleUser className="text-lg" />
              Sign In
            </button>

            {copied && <div className="text-sm text-green-500">Copied!</div>}
          </div>
        </div>

        {/* User Information */}
        <div className="card col-span-2 p-5">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaRegCircleUser /> Balance Management
          </h3>

          <div className="space-y-5">
            {/* Balance Section */}
            <div className="space-y-4 mt-4">
              {/* Current Balance Display */}
              <div className="surface-muted rounded-lg border border-primary-200 p-5">
                <p className="text-xs font-medium mb-1">Current Balance</p>
                <p className="font-bold text-2xl text-green-600">
                  {platform?.currency || "BDT"}{" "}
                  {user?.balance ? Number(user.balance).toFixed(2) : "0.00"}
                </p>
              </div>

              {/* Balance Add Form */}
              <div className="surface-muted rounded-lg border border-border-color p-5">
                <p className="text-sm font-semibold mb-3 text-green-600">
                  Add Balance
                </p>
                <form
                  onSubmit={addForm.handleSubmit((data) => {
                    if (data.addAmount && data.addAmount > 0) {
                      onSubmit({ amount: data.addAmount }, "Increase");
                      addForm.reset();
                    }
                  })}
                  className="flex flex-col md:flex-row items-start md:items-center gap-3"
                >
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    {...addForm.register("addAmount", {
                      required: "Amount is required",
                      min: {
                        value: 0.01,
                        message: "Amount must be greater than 0",
                      },
                    })}
                    placeholder="Enter amount to add"
                    className="control h-10 flex-1"
                  />
                  <button type="submit" className="btn primary-btn">
                    Add Balance
                  </button>
                </form>
                {addForm.formState.errors.addAmount && (
                  <p className="text-red-500 text-xs mt-1">
                    {addForm.formState.errors.addAmount.message}
                  </p>
                )}
              </div>

              {/* Balance Cut Form */}
              <div className="surface-muted rounded-lg border border-border-color p-5">
                <p className="text-sm font-semibold mb-3 text-red-600">
                  Cut Balance
                </p>
                <form
                  onSubmit={cutForm.handleSubmit((data) => {
                    if (data.cutAmount && data.cutAmount > 0) {
                      onSubmit({ amount: data.cutAmount }, "Decrease");
                      cutForm.reset();
                    }
                  })}
                  className="flex flex-col md:flex-row items-start md:items-center gap-3"
                >
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    {...cutForm.register("cutAmount", {
                      required: "Amount is required",
                      // min: {
                      //   value: 0.01,
                      //   message: "Amount must be greater than 0",
                      // },
                      // max: {
                      //   value: user?.balance || 0,
                      //   message: "Amount cannot exceed current balance",
                      // },
                    })}
                    placeholder="Enter amount to cut"
                    className="control h-10 flex-1"
                  />
                  <button type="submit" className="btn danger-btn">
                    Cut Balance
                  </button>
                </form>
                {cutForm.formState.errors.cutAmount && (
                  <p className="text-red-500 text-xs mt-1">
                    {cutForm.formState.errors.cutAmount.message}
                  </p>
                )}
              </div>
            </div>

            {user?.bio && (
              <div className="surface-muted rounded-lg p-5">
                <p className="text-xs font-medium mb-2">Bio</p>
                <p className="text-sm leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
