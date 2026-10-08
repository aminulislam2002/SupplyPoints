import { useState } from "react";
import {
  FaLock,
  FaShieldAlt,
  FaTrash,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth/useAuth";
import Swal from "sweetalert2";

const SellerSettings = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { refetchUser } = useAuth();

  const handlePasswordChange = async () => {
    // Password change logic here
    try {
      const data = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };
      const res = await axiosSecure.put("/users/change", data);
      const successMessage = res?.data?.message || "Success";

      if (res?.data?.isValid) {
        await Swal.fire({ title: successMessage, icon: "success" });
        setTimeout(() => {
          navigate("/dashboard/seller/profile");
        }, 1000);
      }
    } catch (error) {
      if (!error.response?.data?.isValid) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong!";
        Swal.fire({
          title: errorMessage,
          icon: "error",
        });

        setTimeout(() => {
          navigate("/dashboard/seller/profile");
        }, 1000);
      }
    } finally {
      refetchUser();
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="card p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-md bg-primary-100 text-primary-700">
            <MdSecurity size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Account Settings</h1>
            <p className="text-sm text-text-secondary mt-1">
              Manage account security options and privacy controls
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Security Score</p>
          <p className="text-2xl font-semibold mt-1">80%</p>
          <p className="text-xs text-text-secondary mt-1">
            Good protection status
          </p>
        </div>
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Password</p>
          <p className="text-lg font-semibold mt-1">Updated Recently</p>
        </div>
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Two-Factor Auth</p>
          <p className="text-lg font-semibold mt-1">Not Enabled</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-md bg-blue-100 text-blue-700">
                <FaLock size={18} />
              </div>
              <div>
                <p className="font-semibold">Password</p>
                <p className="text-sm text-text-secondary">
                  Keep your password strong and unique.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="btn primary-btn inline-flex h-10 px-4 items-center justify-center rounded-md text-white text-sm font-medium transition-colors duration-300 cursor-pointer"
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="card p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-md bg-green-100 text-green-700">
                <FaShieldAlt size={18} />
              </div>
              <div>
                <p className="font-semibold">Two-Factor Authentication</p>
                <p className="text-sm text-text-secondary">
                  Add one more layer of account protection.
                </p>
              </div>
            </div>
            <button className="btn primary-btn inline-flex h-10 px-4 items-center justify-center text-sm font-medium">
              Enable
            </button>
          </div>
        </div>

        <div className="control rounded-xl border border-red-300/50 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-md bg-red-100 text-red-700">
                <FaTrash size={18} />
              </div>
              <div>
                <p className="font-semibold">Delete Account</p>
                <p className="text-sm text-text-secondary">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>
            <button className="btn danger-btn inline-flex h-10 px-4 items-center justify-center text-sm font-medium">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="modal-surface max-w-md w-full">
            <div className="border-b border-border-color p-6">
              <h2 className="text-xl font-bold">Change Password</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="control w-full px-4 py-3 pr-12"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-300 hover:text-text-secondary"
                  >
                    {showCurrentPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 pr-12 surface-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-300 hover:text-text-secondary"
                  >
                    {showNewPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 pr-12 surface-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-300 hover:text-text-secondary"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
                {passwordData.newPassword &&
                  passwordData.confirmPassword &&
                  passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-xs text-red-400 mt-1">
                      Passwords do not match
                    </p>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="flex-1 px-6 py-3 bg-primary-100 text-primary-800 rounded-md hover:bg-primary-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    passwordData.newPassword !== passwordData.confirmPassword
                  }
                  className="btn primary-btn flex-1 px-6 py-3 text-white rounded-md transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerSettings;
