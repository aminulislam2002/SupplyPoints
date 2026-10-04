import { useForm } from "react-hook-form";
import InputField from "../../../components/InputField/InputField";
import useAxiosPublic from "../../../hooks/useAxiosPublic/useAxiosPublic";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Alert from "../../../components/Alert/Alert";
import { TbLoader3 } from "react-icons/tb";

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
    <div className="surface mx-auto w-full max-w-xl rounded-2xl p-6 shadow-lg sm:p-8">
      <div className="mb-6 text-center space-y-2">
        <p className="caption uppercase tracking-[0.2em] text-primary-600">
          Password Recovery
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold">Account Recovery</h2>
        <p className="body-copy text-sm">
          Verify your account details to continue resetting your password.
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
          <p className="mb-4 text-sm text-danger">{phoneError.message}</p>
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
            "Forgot Password"
          )}
        </button>

        <p className="text-sm mt-4 text-center">
          Remember your password?{" "}
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

export default Forgot;
