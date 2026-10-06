import { useForm } from "react-hook-form";
import InputField from "../../../components/AuthFields/InputField";
import { Link, useNavigate, useSearchParams } from "react-router";
import useAxiosPublic from "../../../hooks/useAxiosPublic/useAxiosPublic";
import { useState } from "react";
import Alert from "../../../components/Alert/Alert";
import useAuth from "../../../hooks/useAuth/useAuth";
import { TbLoader3 } from "react-icons/tb";
import {
  FiBriefcase,
  FiHelpCircle,
  FiLock,
  FiPhone,
  FiUser,
} from "react-icons/fi";

const SignUp = () => {
  const axiosPublic = useAxiosPublic();
  const { refetchUser } = useAuth();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");

  const [isLoading, setIsLoading] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [visibleMessage, setVisibleMessage] = useState(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");
  const identifier = watch("identifier", "");

  let phoneError = null;
  let passwordError = null;

  const phonePattern = /^([+]{1}[8]{2}|0088)?(01){1}[3-9]{1}\d{8}$/;

  const onSubmit = async (data) => {
    setIsLoading(true);

    if (phoneError || passwordError) {
      setIsLoading(false);
      return;
    }

    try {
      const signUpData = {
        ...data,
        referredBy: referralCode || null,
      };

      const res = await axiosPublic.post("/users/signup", signUpData);

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
        setFailedMessage(error.response?.data?.message);
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

  if (identifier && !phonePattern.test(identifier)) {
    phoneError = {
      isInvalid: true,
      message: "সঠিক ফোন নম্বর লিখুন।",
    };
  }

  return (
    <div className="card surface mx-auto w-full p-6 sm:p-10 shadow-xl">
      <div className="mb-8 text-center space-y-2">
        <p className="caption uppercase tracking-[0.2em] text-primary-600">
          নতুন অ্যাকাউন্ট
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">
          আপনার অ্যাকাউন্ট তৈরি করুন
        </h2>
        <p className="body-copy text-sm">
          একবার নিবন্ধন করে প্ল্যাটফর্মের সব সেবা ব্যবহার করুন।
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="পূর্ণ নাম"
          type="text"
          placeholder="আপনার পূর্ণ নাম লিখুন"
          register={register}
          name="name"
          required
          errors={errors}
          icon={FiUser}
        />

        <InputField
          label="ব্যবসার নাম"
          type="text"
          placeholder="আপনার ব্যবসার নাম লিখুন"
          register={register}
          name="businessName"
          required
          errors={errors}
          icon={FiBriefcase}
        />

        <InputField
          label="ফোন নম্বর"
          type="text"
          placeholder="আপনার ফোন নম্বর লিখুন"
          register={register}
          name="identifier"
          required
          errors={errors}
          icon={FiPhone}
        />

        {phoneError?.isInvalid ? (
          <p className="text-xs text-danger -mt-2 mb-2 font-medium">{phoneError.message}</p>
        ) : null}

        <InputField
          label="পাসওয়ার্ড লিখুন"
          type="password"
          placeholder="আপনার পাসওয়ার্ড লিখুন"
          register={register}
          name="password"
          required
          errors={errors}
          icon={FiLock}
        />

        <InputField
          label="পাসওয়ার্ড নিশ্চিত করুন"
          type="password"
          placeholder="আপনার পাসওয়ার্ড নিশ্চিত করুন"
          register={register}
          name="confirmPassword"
          required
          errors={errors}
          icon={FiLock}
        />

        {passwordError?.isMismatched ? (
          <p className="text-xs text-danger -mt-2 mb-2 font-medium">{passwordError.message}</p>
        ) : null}

        <InputField
          label="নিরাপত্তা প্রশ্ন"
          type="text"
          placeholder="আপনার ডাকনাম কী?"
          register={register}
          name="securityAnswer"
          required
          errors={errors}
          icon={FiHelpCircle}
        />

        <p className="metadata mb-4 rounded-lg bg-secondary-100 dark:bg-secondary-800 p-3">
          <span className="font-semibold text-text-primary">নোট:</span> অ্যাকাউন্ট পুনরুদ্ধারের জন্য নিরাপত্তা প্রশ্নটি আবশ্যক।
        </p>

        {visibleMessage && (
          <Alert
            type={visibleMessage}
            message={
              visibleMessage === "success" ? successMessage : failedMessage
            }
            onClose={() => {
              setVisibleMessage(null);
              setFailedMessage("");
              setSuccessMessage("");
            }}
          />
        )}

        <button type="submit" disabled={isLoading} className="btn btn-primary w-full mt-2">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <TbLoader3
                className="animate-spin text-white"
                size={18}
              />
              প্রক্রিয়াকরণ হচ্ছে...
            </div>
          ) : (
            "নিবন্ধন করুন"
          )}
        </button>

        <p className="text-sm mt-6 text-center body-copy">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link to="/auth/sign-in" className="link hover:underline">
            লগইন করুন
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;