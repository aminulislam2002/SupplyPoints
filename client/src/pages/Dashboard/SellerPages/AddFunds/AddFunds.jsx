import { useMemo, useState } from "react";
import { Link } from "react-router";
import { FaCoins } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import useAuth from "../../../../hooks/useAuth/useAuth";
import usePlatform from "../../../../hooks/usePlatform/usePlatform";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";

import bkash_logo from "../../../../assets/gateway_logo/bkash.png";
import nagad_logo from "../../../../assets/gateway_logo/nagad.png";

const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

const AddFunds = () => {
  const { user } = useAuth();
  const { platform } = usePlatform();
  const axiosSecure = useAxiosSecure();
  const [selectedAmount, setSelectedAmount] = useState(quickAmounts[1]);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedGateway, setSelectedGateway] = useState("Bkash");
  const activeGateway = platform?.paymentGateway || "Manual";
  const isOnlineGateway =
    activeGateway === "ClickPay" || activeGateway === "StarPay";

  const minDepositLimit = Number(platform?.minDepositLimit || 1);

  const finalAmount = useMemo(() => {
    const parsedCustom = Number(customAmount || 0);
    if (parsedCustom > 0) {
      return parsedCustom;
    }

    return Number(selectedAmount || 0);
  }, [customAmount, selectedAmount]);

  const paymentGateways = [
    {
      name: "Bkash",
      dialCode: "*247#",
      number: platform?.bkashNumber || "01712345678",
      logo: bkash_logo,
      color: "#CF2771",
    },
    {
      name: "Nagad",
      dialCode: "*167#",
      number: platform?.nagadNumber || "01812345678",
      logo: nagad_logo,
      color: "#C90008",
    },
    // {
    //   name: "Rocket",
    //   dialCode: "*322#",
    //   number: platform?.rocketNumber || "01912345678",
    //   logo: rocket_logo,
    //   color: "#89288F",
    // },
  ];

  const handleProceedPayment = async () => {
    if (!finalAmount || finalAmount < minDepositLimit) {
      return;
    }

    const paymentData = {
      amount: finalAmount,
      gateway: selectedGateway?.toUpperCase() || "BKASH",
      purpose: "Deposit",
      channel: activeGateway,
    };

    const res = await axiosSecure.post(`/add-funds`, paymentData);

    if (res?.data && res.data.paymentUrl) {
      window.location.href = res.data.paymentUrl;
    } else {
      Swal.fire({
        title: "পেমেন্ট প্রক্রিয়া শুরু করতে ব্যর্থ!",
        icon: "error",
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Add Funds</h1>
            <p className="text-sm text-text-secondary mt-1">
              Add money to your wallet and use it for purchases and services
            </p>
          </div>
          <div className="flex justify-center items-center gap-2.5">
            <div className="inline-flex h-10 items-center px-4 rounded-md surface-muted text-sm font-medium">
              Balance: ৳{Number(user?.balance || 0).toLocaleString()}
            </div>
            <Link
              to="/dashboard/seller/my-add-funds"
              className="btn btn-outline inline-flex h-10 items-center px-4 text-sm font-medium"
            >
              Funds History
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 card p-5 sm:p-6 shadow-sm space-y-5">
          {activeGateway === "ClickPay" && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Select Payment Gateway
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {paymentGateways.map((gateway) => (
                  <button
                    key={gateway.name}
                    type="button"
                    onClick={() => setSelectedGateway(gateway.name)}
                    className={`h-12 rounded-md border text-sm font-semibold transition-colors duration-300 cursor-pointer flex items-center gap-2 px-3 ${
                      selectedGateway === gateway.name
                        ? "bg-primary-600 border-primary-500 text-white"
                        : "bg-section-bg/40 border-border-color hover:border-primary-500"
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
          )}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Select Amount</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={`h-12 rounded-md border text-sm font-semibold transition-colors duration-300 cursor-pointer ${
                    Number(selectedAmount) === amount && !customAmount
                      ? "bg-primary-600 border-primary-500 text-white"
                      : "bg-section-bg/40 border-border-color hover:border-primary-500"
                  }`}
                >
                  ৳{amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Or Enter Custom Amount
            </label>
            <input
              type="number"
              min={minDepositLimit}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Enter amount"
              className="control w-full h-11 px-3 text-sm border focus:outline-none"
            />
            {finalAmount > 0 && finalAmount < minDepositLimit && (
              <p className="text-red-400 text-sm mt-2 font-medium">
                Minimum deposit amount is ৳{minDepositLimit}
              </p>
            )}
          </div>

          <div className="control border bg-section-bg/30 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaCoins className="text-yellow-400" size={18} />
              <p className="text-sm text-text-secondary">You are going to add</p>
            </div>
            <p className="text-xl font-bold text-green-400">
              ৳{Number(finalAmount || 0).toLocaleString()}
            </p>
          </div>

          {activeGateway === "Manual" ? (
            <Link
              to={`/payment/Deposit/${finalAmount}`}
              className="btn btn-primary inline-flex h-11 px-5 items-center justify-center gap-2 rounded-md text-white text-sm font-medium disabled:bg-primary-800 disabled:cursor-not-allowed transition-colors duration-300 cursor-pointer"
            >
              Proceed to Payment
              <MdOutlinePayment className="ml-2" />
            </Link>
          ) : isOnlineGateway ? (
            <button
              type="button"
              onClick={handleProceedPayment}
              disabled={!finalAmount || finalAmount < minDepositLimit}
              className="btn btn-primary inline-flex h-11 px-5 items-center justify-center gap-2 rounded-md text-white text-sm font-medium disabled:bg-primary-800 disabled:cursor-not-allowed transition-colors duration-300 cursor-pointer"
            >
              <MdOutlinePayment size={18} />
              <span>Proceed to Payment</span>
            </button>
          ) : null}
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="card p-5 shadow-sm">
            <h3 className="text-base font-semibold mb-3">How it works</h3>
            <div className="space-y-2.5 text-sm text-text-secondary">
              <p>1. Select or enter your preferred amount.</p>
              <p>2. Complete payment using your preferred gateway.</p>
              <p>3. Submit Transaction ID for verification.</p>
              <p>4. Admin will review and update status.</p>
              <p>5. On approval, funds will be added to your balance.</p>
              <p>6. Minimum deposit limit: ৳{minDepositLimit}</p>
            </div>
          </div>

          <div className="card p-5 shadow-sm">
            <h3 className="text-base font-semibold mb-2">Status Flow</h3>
            <p className="text-sm text-text-secondary">
              Pending &gt; Approved / Cancelled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFunds;
