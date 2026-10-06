import { useForm } from "react-hook-form";
import InputField from "../../../components/AuthFields/InputField";
import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import Alert from "../../../components/Alert/Alert";
import useAxiosPublic from "../../../hooks/useAxiosPublic/useAxiosPublic";
import useAuth from "../../../hooks/useAuth/useAuth";
import { TbLoader3 } from "react-icons/tb";
import { FiLock, FiPhone } from "react-icons/fi";

const SignIn = () => {
  const axiosPublic = useAxiosPublic();
  const { refetchUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [visibleMessage, setVisibleMessage] = useState(null);

  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const identifier = watch("identifier", "");
  let phoneError = null;

  const phonePattern = /^([+]{1}[8]{2}|0088)?(01){1}[3-9]{1}\d{8}$/;

  const onSubmit = async (data) => {
    setIsLoading(true);

    if (phoneError) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await axiosPublic.post("/users/signin", data);

      if (res?.data?.isValid) {
        localStorage.setItem("accessToken", res?.data?.accessToken);
        refetchUser();

        setSuccessMessage(res?.data?.message);
        setVisibleMessage("success");
        reset();

        setTimeout(() => {
          navigate(state || res?.data?.navigateTo || "/");
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
      setIsLoading(false);
    }
  };

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
          নিরাপদ প্রবেশ
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">আবারও স্বাগতম</h2>
        <p className="body-copy text-sm">
          অ্যাকাউন্ট পরিচালনা চালিয়ে যেতে লগইন করুন।
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="flex items-center justify-end pb-1">
          <Link
            to="/auth/forgot-pass"
            className="link text-sm hover:underline"
          >
            পাসওয়ার্ড ভুলে গেছেন?
          </Link>
        </div>

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

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full mt-2"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <TbLoader3
                className="animate-spin text-white"
                size={18}
              />
              প্রক্রিয়াকরণ হচ্ছে...
            </div>
          ) : (
            "লগইন করুন"
          )}
        </button>

        <p className="text-sm mt-6 text-center body-copy">
          অ্যাকাউন্ট নেই?{" "}
          <Link to="/auth/sign-up" className="link hover:underline">
            নিবন্ধন করুন
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;