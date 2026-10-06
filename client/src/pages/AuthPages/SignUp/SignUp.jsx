import { useForm } from "react-hook-form";
import InputField from "../../../components/AuthFields/InputField";
import { Link, useNavigate, useSearchParams } from "react-router";
import useAxiosPublic from "../../../hooks/useAxiosPublic/useAxiosPublic";
import { useState } from "react";
import Alert from "../../../components/Alert/Alert";
import useAuth from "../../../hooks/useAuth/useAuth";
import { TbLoader3 } from "react-icons/tb";
import SelectField from "../../../components/AuthFields/SelectField";

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

  // Watch for password and confirmPassword fields
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
      message: "Passwords do not match.",
    };
  }

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
          New Account
        </p>
        <h2 className="text-2xl font-semibold text-center">
          Create Your Account
        </h2>
        <p className="body-copy text-sm">
          Register once and start using all platform services.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Full Name"
          type="name"
          placeholder="Write your full name"
          register={register}
          name="name"
          required
          errors={errors}
        />

        <InputField
          label="Business Name"
          type="text"
          placeholder="Write your business name"
          register={register}
          name="businessName"
          required
          errors={errors}
        />

        <SelectField
          label="Gender"
          placeholder="Select gender"
          register={register}
          name="gender"
          options={["Male", "Female", "Other"]}
          required
          errors={errors}
          defaultValue=""
        />

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

        <InputField
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          register={register}
          name="confirmPassword"
          required
          errors={errors}
        />

        {passwordError?.isMismatched ? (
          <p className="text-sm text-red-400 mb-4">{passwordError.message}</p>
        ) : null}

        <InputField
          label="Security Question"
          type="text"
          placeholder="What is your nickname?"
          register={register}
          name="securityAnswer"
          required
          errors={errors}
        />

        <p className="body-copy mb-4 text-sm font-medium">
          Note: Security Question is required for account recovery.
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
            "Sign Up"
          )}
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/auth/sign-in" className="link hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
