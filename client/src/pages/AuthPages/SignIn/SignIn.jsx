import { useForm } from "react-hook-form";
import InputField from "../../../components/AuthFields/InputField";
import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import Alert from "../../../components/Alert/Alert";
import useAxiosPublic from "../../../hooks/useAxiosPublic/useAxiosPublic";
import useAuth from "../../../hooks/useAuth/useAuth";
import { TbLoader3 } from "react-icons/tb";

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
        // store token immediately so secure axios picks it up
        localStorage.setItem("accessToken", res?.data?.accessToken);
        refetchUser();

        setSuccessMessage(res?.data?.message);
        setVisibleMessage("success");
        reset();

        // navigate after a short delay
        setTimeout(() => {
          navigate(state || res?.data?.navigateTo || "/");
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
      setIsLoading(false);
    }
  };

  if (identifier && !phonePattern.test(identifier)) {
    phoneError = {
      isInvalid: true,
      message: "Enter a valid Phone Number.",
    };
  }

  return (
    <div className="surface mx-auto w-full max-w-xl p-6 sm:p-8">
      <div className="mb-6 text-center space-y-2">
        <p className="caption uppercase tracking-[0.2em] text-primary-600">
          Secure Access
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold">Welcome Back</h2>
        <p className="body-copy text-sm">
          Sign in to continue managing your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Phone Number"
          type="text"
          placeholder="Enter your phone number"
          register={register}
          name="identifier"
          required
          errors={errors}
        />

        {phoneError?.isInvalid ? (
          <p className="text-sm text-red-400 mb-4">{phoneError.message}</p>
        ) : null}

        <InputField
          label="Enter Password"
          type="password"
          placeholder="Enter your password"
          register={register}
          name="password"
          required
          errors={errors}
        />

        <p className="text-sm mb-4 text-right">
          <Link to="/auth/forgot-pass" className="link hover:underline">
            Forgot Password?
          </Link>
        </p>

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

        <button type="submit" className="btn btn-primary w-full">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <TbLoader3
                className="animate-spin text-primary-50 text-center"
                size={18}
              />
              Processing...
            </div>
          ) : (
            "Sign In"
          )}
        </button>

        <p className="text-sm mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/auth/sign-up" className="link hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
