import { useForm } from "react-hook-form";
import InputField from "../../../components/AuthFields/InputField";
import useAxiosPublic from "../../../hooks/useAxiosPublic/useAxiosPublic";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Alert from "../../../components/Alert/Alert";
import { TbLoader3 } from "react-icons/tb";
import { FiHelpCircle, FiPhone } from "react-icons/fi";

const Forgot = () => {
  const axiosPublic = useAxiosPublic();
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
      const res = await axiosPublic.post("/users/forgot", data);

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
        setInvalidMessage(error.response?.data?.message || "কিছু ভুল হয়েছে।");
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
          পাসওয়ার্ড পুনরুদ্ধার
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          অ্যাকাউন্ট পুনরুদ্ধার
        </h2>
        <p className="body-copy text-sm">
          পাসওয়ার্ড পুনরায় সেট করতে আপনার অ্যাকাউন্টের তথ্য যাচাই করুন।
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
          <p className="text-xs text-danger -mt-2 mb-2 font-medium">
            {phoneError.message}
          </p>
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
          className="btn primary-btn w-full mt-2"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <TbLoader3 className="animate-spin text-primary-50" size={18} />
              প্রক্রিয়াকরণ হচ্ছে...
            </div>
          ) : (
            "পাসওয়ার্ড ভুলে গেছি"
          )}
        </button>

        <p className="text-sm mt-6 text-center body-copy">
          পাসওয়ার্ড মনে পড়েছে?{" "}
          <Link to="/auth/sign-in" className="link hover:underline">
            লগইন করুন
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Forgot;
