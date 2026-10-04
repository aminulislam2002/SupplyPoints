import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { FaInfoCircle } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import useAuth from "../../../../hooks/useAuth/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";
import Input from "../../../../components/FormFileds/Input";
import Select from "../../../../components/FormFileds/Select";
import usePlatform from "../../../../hooks/usePlatform/usePlatform";

const CreateWithdrawal = () => {
  const { user, isUserPending } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isLoading, setIsLoading] = useState(false);
  const { platform } = usePlatform();

  const availableBalance = Number(user?.balance || 0);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm();

  const accountNumber = watch("account");
  const withdrawalAmount = watch("amount");

  // Validate account number (11-12 digits, BD phone number)
  const isValidAccount = accountNumber && /^[0-9]{11,12}$/.test(accountNumber);
  const accountError =
    accountNumber && !isValidAccount
      ? "অ্যাকাউন্ট নম্বর ১১-১২ ডিজিটের BD ফোন নম্বর হতে হবে"
      : "";

  // Validate withdrawal amount
  const minLimit = platform?.minWithdrawalLimit || 100;
  const withdrawableAmount = Math.max(availableBalance - 120, 0);
  const parsedWithdrawalAmount = Number(withdrawalAmount);
  const isBelowMinimum =
    withdrawalAmount &&
    Number.isFinite(parsedWithdrawalAmount) &&
    parsedWithdrawalAmount < minLimit;
  const isAboveAllowedAmount =
    withdrawalAmount &&
    Number.isFinite(parsedWithdrawalAmount) &&
    parsedWithdrawalAmount > withdrawableAmount;
  const isValidAmount =
    withdrawalAmount &&
    Number.isFinite(parsedWithdrawalAmount) &&
    parsedWithdrawalAmount >= minLimit &&
    parsedWithdrawalAmount <= withdrawableAmount;
  const amountError = isBelowMinimum
    ? `সর্বনিম্ন উত্তোলনের পরিমাণ ৳${minLimit}`
    : isAboveAllowedAmount
      ? `অ্যাকাউন্টে ৳120 রেখে সর্বোচ্চ ৳${withdrawableAmount.toLocaleString()} পর্যন্ত উত্তোলন করতে পারবেন`
      : "";

  const accountBalanceError =
    availableBalance <= 120
      ? "উত্তোলন করার আগে ওয়ালেটে ৳120-এর বেশি থাকতে হবে"
      : "";

  // Disable submit if any validation fails
  const isFormValid =
    isValidAccount && isValidAmount && !accountBalanceError && !isLoading;

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await axiosSecure.post("/withdrawals", data);
      const successMessage = res?.data?.message || "Success";
      await Swal.fire({ title: successMessage, icon: "success" });
      reset();
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

  if (isUserPending) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="card p-5 sm:p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Create Withdrawal</h1>
        <p className="text-sm text-text-secondary mt-1">
          Submit secure withdrawal requests from your available wallet balance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Available Balance</p>
          <p className="text-2xl font-semibold mt-1 text-primary-300">
            ৳{availableBalance.toLocaleString()}
          </p>
        </div>
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Minimum Withdrawal</p>
          <p className="text-2xl font-semibold mt-1">৳{minLimit}</p>
        </div>
        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary">Withdrawable After Reserve</p>
          <p className="text-2xl font-semibold mt-1">
            ৳{withdrawableAmount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 card p-5 sm:p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Withdrawal Form</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative w-full h-full flex flex-col">
              <Select
                label="Payment Method"
                placeholder="Select Payment Method"
                register={register}
                errors={errors}
                name="payMethod"
                required={true}
                options={["Bkash", "Nagad"]}
              />
            </div>

            <div className="relative w-full h-full flex flex-col">
              <Input
                label="অ্যাকাউন্ট নম্বর"
                type="text"
                placeholder="BD ফোন নম্বর লিখুন (১১-১২ ডিজিট)"
                register={register}
                errors={errors}
                name="account"
                required={true}
              />
              {accountError && (
                <p className="text-red-400 text-sm mt-1 font-medium">
                  {accountError}
                </p>
              )}
            </div>

            <div className="relative w-full h-full flex flex-col">
              <Input
                label={`উত্তোলনের পরিমাণ (সর্বনিম্ন: ৳${minLimit}, সর্বোচ্চ: ৳${withdrawableAmount.toLocaleString()})`}
                type="number"
                placeholder="পরিমাণ লিখুন"
                register={register}
                errors={errors}
                name="amount"
                required={true}
              />
              {amountError && (
                <p className="text-red-400 text-sm mt-1 font-medium">
                  {amountError}
                </p>
              )}
              {accountBalanceError && (
                <p className="text-red-400 text-sm mt-1 font-medium">
                  {accountBalanceError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className="btn btn-primary inline-flex h-11 px-5 items-center justify-center gap-2 rounded-md text-white text-sm font-medium disabled:bg-primary-800 disabled:cursor-not-allowed transition-colors duration-300 cursor-pointer"
            >
              <MdSend size={16} />
              <span>{isLoading ? "Processing..." : "Submit Request"}</span>
            </button>

            <p className="text-sm text-yellow-500 italic">
              দ্রষ্টব্য: প্রতি সপ্তাহের রবিবারে আমরা পেমেন্ট দিয়ে থাকি।
            </p>
          </form>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FaInfoCircle className="text-primary-300" size={18} />
              <h3 className="text-base font-semibold">Instructions</h3>
            </div>

            <div className="space-y-2.5 text-sm text-text-secondary">
              <p>Minimum withdrawal amount is ৳{minLimit}.</p>
              <p>
                উত্তোলনের জন্য ওয়ালেটে ৳120 রেখে বাকিটা নিতে পারবেন। সর্বোচ্চ
                উত্তোলনযোগ্য পরিমাণ ৳{withdrawableAmount.toLocaleString()}।
              </p>
              <p>সঠিক বাংলাদেশি মোবাইল নম্বর ব্যবহার করুন (১১-১২ ডিজিট)।</p>
              <p>
                পেমেন্ট মেথড এবং অ্যাকাউন্ট নম্বর মিল আছে কিনা নিশ্চিত করুন।
              </p>
              <p>অনুরোধ ২৪-৪৮ ঘণ্টার মধ্যে প্রসেস করা হয়।</p>
              <p>My Withdrawals থেকে স্ট্যাটাস ট্র্যাক করতে পারবেন।</p>
            </div>
          </div>

          <div className="card p-5 shadow-sm">
            <h3 className="text-base font-semibold mb-2">Quick Tip</h3>
            <p className="text-sm text-text-secondary">
              Submit amounts that keep your wallet active for upcoming orders
              and fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWithdrawal;
