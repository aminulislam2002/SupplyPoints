import { useState } from "react";
import { FaShare, FaCopy, FaGift, FaUserPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth/useAuth";
import Loader from "../../../../components/Loader/Loader";
import usePlatform from "../../../../hooks/usePlatform/usePlatform";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FaUser } from "react-icons/fa6";

const MyRefer = () => {
  const { user, isUserPending } = useAuth();
  const { platform, isPlatformPending } = usePlatform();
  const [copiedLink, setCopiedLink] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Fetch all users
  const {
    isLoading,
    isFetching,
    data: myReferrals = [], // Default to an empty array
    isPlaceholderData,
  } = useQuery({
    queryKey: ["myReferrals"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/referrals/${user?.referralCode}`,
        {},
      );
      return res?.data && res.data?.data;
    },
    placeholderData: keepPreviousData,
  });

  // Generate referral link with user ID or referral code
  const referralCode =
    user?.referralCode || user?._id?.slice(-8).toUpperCase() || user?.email;
  const referralLink = `${import.meta.env.VITE_CLIENT_URL || "http://localhost:5173"}/auth/sign-up?ref=${referralCode}`;

  // Copy to clipboard function
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: "Referral link copied to clipboard!",
        timer: 2000,
        showConfirmButton: false,
      });

      // Reset copy state after 3 seconds
      setTimeout(() => {
        setCopiedLink(false);
      }, 3000);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to copy link. Please try again.",
        timer: 2000,
        showConfirmButton: false,
      });
      console.error("Failed to copy: ", err);
    }
  };

  if (isUserPending || isPlatformPending || isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="card p-5 sm:p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">My Referrals</h1>
        <p className="text-sm text-text-secondary mt-1">
          Share your link, bring active sellers, and earn referral rewards
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Referral Code</p>
          <p className="text-xl font-semibold mt-1 break-all">{referralCode}</p>
        </div>
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Reward Per Referral</p>
          <p className="text-xl font-semibold text-green-400 mt-1">
            ৳{platform?.referralReward || 0}
          </p>
        </div>
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Status</p>
          <p className="text-xl font-semibold mt-1">Ready to Share</p>
        </div>
      </div>

      <div className="card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <FaShare className="text-primary-400" size={18} />
          <h2 className="text-lg font-semibold">Referral Link</h2>
        </div>

        <div className="control border p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 text-sm text-text-primary font-mono break-all">
            {referralLink}
          </div>
          <button
            onClick={copyToClipboard}
            className={`inline-flex h-10 px-4 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors duration-300 ${
              copiedLink
                ? "bg-green-600 text-white"
                : "bg-primary-600 hover:bg-primary-500 text-white"
            }`}
          >
            <FaCopy size={14} />
            {copiedLink ? "Copied" : "Copy Link"}
          </button>
        </div>
      </div>

      <div className="card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <FaShare className="text-primary-400" size={18} />
          <h2 className="text-lg font-semibold">Referral Link</h2>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="table table-xs">
            <thead className="bg-primary-950 ">
              <tr className="h-10 text-sm text-nowrap font-normal text-center">
                <th>#</th>
                <th className="text-left">Profile</th>
                <th>Status</th>
                <th>Balance</th>
                <th>Earnings</th>
              </tr>
            </thead>
            <tbody>
              {isFetching && isPlaceholderData ? (
                <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                  <td colSpan="5">Loading...</td>
                </tr>
              ) : myReferrals?.length === 0 ? (
                <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                  <td colSpan="5">No referrals found.</td>
                </tr>
              ) : (
                myReferrals?.map((referral, index) => (
                  <tr
                    key={referral?._id}
                    className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color"
                  >
                    <th>{index + 1}</th>
                    <td>
                      <div className="flex justify-start items-center gap-2.5">
                        <div>
                          {referral?.photo ? (
                            <div className="w-12 h-12 mx-auto">
                              <img
                                src={
                                  import.meta.env.VITE_IMAGE_URL +
                                  referral?.photo
                                }
                                alt={referral?.name}
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
                          <p>{referral?.name}</p>
                          <p className="text-xs">{referral?.identifier}</p>
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
                        {user?.role === "User"
                          ? "Inactive"
                          : user?.role === "Seller"
                            ? "Active"
                            : user?.role === "Blocked"
                              ? "Blocked"
                              : ""}
                      </p>
                    </td>
                    <td>৳ {referral?.balance?.toFixed(2)}</td>
                    <td>৳ {referral?.withdrawals?.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-5 sm:p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-5">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="control border bg-section-bg/30 p-4">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mb-3">
              <FaShare className="text-primary-700" size={16} />
            </div>
            <h4 className="font-semibold mb-1">1. Share Link</h4>
            <p className="text-sm text-text-secondary">
              Send your referral link to friends and partners.
            </p>
          </div>

          <div className="control border bg-section-bg/30 p-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <FaUserPlus className="text-green-700" size={16} />
            </div>
            <h4 className="font-semibold mb-1">2. They Register</h4>
            <p className="text-sm text-text-secondary">
              Referred users sign up and activate as sellers.
            </p>
          </div>

          <div className="control border bg-section-bg/30 p-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <FaGift className="text-yellow-700" size={16} />
            </div>
            <h4 className="font-semibold mb-1">3. You Earn</h4>
            <p className="text-sm text-text-secondary">
              Earn ৳{platform?.referralReward || 0} for each successful
              referral.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRefer;
