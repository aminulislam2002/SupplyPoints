import { useForm } from "react-hook-form";
import InputField from "../../../components/AuthFields/InputField";
import { Link, useNavigate } from "react-router";
import useAxiosPublic from "../../../hooks/useAxiosPublic/useAxiosPublic";
import { useState } from "react";
import Alert from "../../../components/Alert/Alert";
import useAuth from "../../../hooks/useAuth/useAuth";
import { TbLoader3 } from "react-icons/tb";
import { FiLock } from "react-icons/fi";

const Reset = () => {
  const axiosPublic = useAxiosPublic();
  const { refetchUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [visibleMessage, setVisibleMessage] = useState(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  let passwordError = null;

  const onSubmit = async (data) => {
    setIsLoading(true);

    if (passwordError) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await axiosPublic.put("/users/reset", data);

      if (res?.data?.isValid) {
        setSuccessMessage(res?.data?.message);
        setVisibleMessage("success");
        reset();
        setTimeout(() => {
          navigate(res?.data?.navigateTo || "/");
        }, 1000);
      }
    } catch (error) {
      if (!error.response?.data?.isValid) {
        setInvalidMessage(
          error.response?.data?.message ||           "কিছু ভুল হয়েছে।",
        );
        setVisibleMessage("error");
        reset();
        setTimeout(() => {
          navigate(error.response?.data?.navigateTo || "/");
        }, 1000);
      }
    } finally {
      refetchUser();
      setIsLoading(false);
    }
  };

  if (password && confirmPassword && password !== confirmPassword) {
    passwordError = {
      isMismatched: true,
      message: "পাসওয়ার্ড দুটি এক নয়।",
    };
  }

  return (
    <div className="card surface mx-auto w-full p-6 sm:p-10 shadow-xl">
      <div className="mb-8 text-center space-y-2">
        <p className="caption uppercase tracking-[0.2em] text-primary-600">
          নতুন পাসওয়ার্ড সেট করুন
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          আপনার পাসওয়ার্ড পুনরায় সেট করুন
        </h2>
        <p className="body-copy text-sm">
          অ্যাকাউন্ট সুরক্ষিত রাখতে একটি শক্তিশালী পাসওয়ার্ড বেছে নিন।
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="নতুন পাসওয়ার্ড"
          type="password"
          placeholder="আপনার নতুন পাসওয়ার্ড লিখুন"
          register={register}
          name="password"
          required
          errors={errors}
          icon={FiLock}
        />

        <InputField
          label="পাসওয়ার্ড নিশ্চিত করুন"
          type="password"
          placeholder="আপনার নতুন পাসওয়ার্ড নিশ্চিত করুন"
          register={register}
          name="confirmPassword"
          required
          errors={errors}
          icon={FiLock}
        />

        {passwordError?.isMismatched ? (
          <p className="text-xs text-danger -mt-2 mb-2 font-medium">{passwordError.message}</p>
        ) : null}

        {visibleMessage && (
          <Alert
            type={visibleMessage}
            message={
              visibleMessage === "success" ? successMessage : invalidMessage
            }
            onClose={() => {
              setVisibleMessage(null);
              setInvalidMessage("");
              setSuccessMessage("");
            }}
          />
        )}

        <button type="submit" disabled={isLoading} className="btn btn-primary w-full mt-2">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <TbLoader3 className="animate-spin text-primary-50" size={18} />
              প্রক্রিয়াকরণ হচ্ছে...
            </div>
          ) : (
            "পাসওয়ার্ড পুনরায় সেট করুন"
          )}
        </button>

        <p className="text-sm mt-6 text-center body-copy">
          লগইন পাতায় ফিরে যাবেন?{" "}
          <Link to="/auth/sign-in" className="link hover:underline">
            লগইন করুন
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Reset;