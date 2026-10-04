import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";

const StarPaySuccess = () => {
  const [params] = useSearchParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const transactionId = params.get("transactionId");

        const response = await axiosSecure.post("/add-funds/callback/starpay", {
          transactionId,
        });

        console.log("Verification:", response.data);

        navigate("/");
      } catch (error) {
        console.error("Verification failed:", error);
      }
    };

    verify();
  }, [axiosSecure, navigate, params]);

  return (
    <div className="min-h-[50vh] bg-page-bg px-5 py-20 text-center">
      <div className="surface mx-auto max-w-md rounded-lg p-8">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
        <h1 className="section-title">Processing payment</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Please wait while we confirm your transaction.
        </p>
      </div>
    </div>
  );
};

export default StarPaySuccess;
