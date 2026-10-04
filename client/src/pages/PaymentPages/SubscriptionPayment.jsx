import { useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";

import { FaCoins } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";
import usePlatform from "../../hooks/usePlatform/usePlatform";
import Loader from "../../components/Loader/Loader";

import bkash_logo from "../../assets/gateway_logo/bkash.png";
import nagad_logo from "../../assets/gateway_logo/nagad.png";

const SubscriptionPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState("Bkash");
  const axiosSecure = useAxiosSecure();
  const { platform, isPlatformPending } = usePlatform();

  const amount = Number(platform?.accountActivationFee || 0);
  const activeGateway = platform?.paymentGateway || "Manual";
  const isOnlineGateway =
    activeGateway === "ClickPay" || activeGateway === "StarPay";

  const paymentGateways = [
    {
      name: "Bkash",
      number: platform?.bkashNumber || "01712345678",
      logo: bkash_logo,
    },
    {
      name: "Nagad",
      number: platform?.nagadNumber || "01812345678",
      logo: nagad_logo,
    },
  ];

  const selectedGatewayDetails = paymentGateways.find(
    (gateway) => gateway.name === selectedGateway,
  );

  const handleProceedPayment = async () => {
    if (!amount || amount <= 0) {
      Swal.fire({
        title: "অবৈধ পেমেন্ট তথ্য!",
        icon: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await axiosSecure.post("/add-funds", {
        amount,
        gateway: selectedGateway?.toUpperCase() || "BKASH",
        purpose: "Account",
        channel: activeGateway,
      });

      if (res?.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
        return;
      }

      Swal.fire({
        title: "পেমেন্ট প্রক্রিয়া শুরু করতে ব্যর্থ!",
        icon: "error",
      });
    } catch (error) {
      Swal.fire({
        title:
          error?.response?.data?.message ||
          error?.message ||
          "পেমেন্ট প্রক্রিয়া শুরু করতে ব্যর্থ!",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPlatformPending) {
    return <Loader />;
  }

  if (!amount || amount <= 0) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center px-4">
        <div className="card p-6 text-center max-w-md w-full">
          <p className="text-lg font-semibold">অবৈধ পেমেন্ট তথ্য</p>
          <p className="text-sm text-primary-200 mt-2">
            Account activation fee is not configured yet.
          </p>
          <Link
            to="/dashboard/seller/overview"
            className="inline-flex mt-4 h-11 px-5 items-center justify-center rounded-md bg-primary-600 hover:bg-primary-500 text-primary-50 text-sm font-medium"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg text-primary-950 flex items-center justify-center px-4 py-6">
      <div className="card w-full max-w-4xl rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-border-color flex items-center justify-between gap-3">
          <Link to="/">
            <FiHome
              size={20}
              className="text-primary-300 hover:text-primary-50"
            />
          </Link>

          <div className="text-center flex-1">
            <h1 className="text-xl sm:text-2xl font-semibold">
              Activate Your Account
            </h1>
            <p className="text-sm text-primary-200 mt-1">
              Select a gateway and continue to the payment page
            </p>
          </div>

          <Link to="/dashboard/seller/overview">
            <IoClose
              size={24}
              className="text-primary-300 hover:text-red-400"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6">
          <div className="lg:col-span-7 space-y-5">
            <div className="surface-muted rounded-xl border border-border-color p-4 sm:p-5">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm text-primary-200">Activation Fee</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">
                    ৳{amount.toLocaleString()}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-md border border-border-color px-3 py-2 text-sm text-primary-200">
                  <FaCoins className="text-yellow-400" />
                  Gateway: {activeGateway}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                Select Payment Gateway
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentGateways.map((gateway) => (
                  <button
                    key={gateway.name}
                    type="button"
                    onClick={() => setSelectedGateway(gateway.name)}
                    className={`h-14 rounded-md border text-sm font-semibold transition-colors duration-300 cursor-pointer flex items-center gap-3 px-3 ${
                      selectedGateway === gateway.name
                        ? "bg-primary-600 border-primary-500 text-primary-50"
                        : "bg-primary-900/40 border-border-color hover:border-primary-500"
                    }`}
                  >
                    <div className="bg-white w-12 h-6 rounded">
                      <img
                        src={gateway.logo}
                        alt={gateway.name}
                        className="w-full h-full object-contain rounded"
                      />
                    </div>
                    {gateway.name}
                  </button>
                ))}
              </div>
            </div>

            {isOnlineGateway ? (
              <button
                type="button"
                onClick={handleProceedPayment}
                disabled={isLoading || !amount}
                className="inline-flex h-12 px-5 items-center justify-center gap-2 rounded-md bg-primary-600 hover:bg-primary-500 text-primary-50 text-sm font-medium disabled:bg-primary-800 disabled:cursor-not-allowed transition-colors duration-300 cursor-pointer"
              >
                <MdOutlinePayment size={18} />
                <span>
                  {isLoading ? "Processing..." : "Proceed to Payment"}
                </span>
              </button>
            ) : (
              <Link
                to={`/payment/Account/${amount}`}
                className="inline-flex h-12 px-5 items-center justify-center gap-2 rounded-md bg-primary-600 hover:bg-primary-500 text-primary-50 text-sm font-medium transition-colors duration-300 cursor-pointer"
              >
                <MdOutlinePayment size={18} />
                <span>Proceed to Payment</span>
              </Link>
            )}
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="surface-muted rounded-xl border border-border-color p-4 sm:p-5">
              <h3 className="text-base font-semibold mb-3">Payment Details</h3>
              {selectedGatewayDetails ? (
                <div className="space-y-3 text-sm text-primary-200">
                  <p>Selected gateway: {selectedGatewayDetails.name}</p>
                  <p>Recipient number: {selectedGatewayDetails.number}</p>
                  <p>Amount to pay: ৳{amount.toLocaleString()}</p>
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-border-color bg-primary-900/40 p-4 sm:p-5">
              <h3 className="text-base font-semibold mb-2">Next Step</h3>
              <p className="text-sm text-primary-200">
                After clicking proceed, you will be redirected to the payment
                flow that matches the active platform gateway.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPayment;
