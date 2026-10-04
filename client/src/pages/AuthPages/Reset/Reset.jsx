import { useForm } from "react-hook-form";
import InputField from "../../../components/InputField/InputField";
import { Link, useNavigate } from "react-router";
import useAxiosPublic from "../../../hooks/useAxiosPublic/useAxiosPublic";
import { useState } from "react";
import Alert from "../../../components/Alert/Alert";
import useAuth from "../../../hooks/useAuth/useAuth";
import { TbLoader3 } from "react-icons/tb";

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

  // Watch for password and confirmPassword fields
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
          // localStorage.setItem("user", JSON.stringify(res?.data?.user));
          navigate(res?.data?.navigateTo || "/");
        }, 1000);
      }
    } catch (error) {
      if (!error.response?.data?.isValid) {
        setInvalidMessage(
          error.response?.data?.message || "Something went wrong.",
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
      message: "Passwords do not match.",
    };
  }

  return (
    <div className="surface mx-auto w-full max-w-xl rounded-2xl p-6 shadow-lg sm:p-8">
      <div className="mb-6 text-center space-y-2">
        <p className="caption uppercase tracking-[0.2em] text-primary-600">
          Set New Password
        </p>
        <h2 className="text-2xl font-semibold text-center">
          Reset Your Password
        </h2>
        <p className="body-copy text-sm">
          Choose a strong password to secure your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          register={register}
          name="password"
          required
          errors={errors}
        />

        <InputField
          label="Confirm Password"
          type="password"
          placeholder="Confirm your new password"
          register={register}
          name="confirmPassword"
          required
          errors={errors}
        />

        {passwordError?.isMismatched ? (
          <p className="mb-4 text-sm text-danger">{passwordError.message}</p>
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

        <button
          type="submit"
          className="btn btn-primary h-12 w-full"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <TbLoader3
                className="animate-spin text-primary-50"
                size={18}
              />
              Processing...
            </div>
          ) : (
            "Reset Password"
          )}
        </button>

        <p className="text-sm mt-4 text-center">
          Back to login?{" "}
          <Link
            to="/auth/sign-in"
            className="link"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Reset;
