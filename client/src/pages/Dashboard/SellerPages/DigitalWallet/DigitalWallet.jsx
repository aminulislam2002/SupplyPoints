import { useState } from "react";
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaHistory,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";
import { Link } from "react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";

import bkash_logo from "../../../../assets/gateway_logo/bkash.png";
import nagad_logo from "../../../../assets/payments/nagad.png";
import rocket_logo from "../../../../assets/payments/rocket.jpeg";

const DigitalWallet = () => {
  const { user, isUserPending } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [showBalance, setShowBalance] = useState(true);

  // Fetch recent transactions
  const { isPending: isTransactionsPending, data: recentTransactions = [] } =
    useQuery({
      queryKey: ["recent-transactions"],
      queryFn: async () => {
        const res = await axiosSecure.get("/seller-logs", {
          params: {
            currentPage: 0,
            limitPerPage: 5,
          },
        });
        return res?.data?.data || [];
      },
      placeholderData: keepPreviousData,
    });

  const balanceCards = [
    {
      title: "Current Balance",
      amount: user?.balance,
      icon: FaWallet,
      iconBg: "bg-blue-100 text-blue-700",
    },
    {
      title: "Total Earnings",
      amount: user?.withdrawals,
      icon: MdTrendingUp,
      iconBg: "bg-green-100 text-green-700",
    },
  ];

  const transactionCount = recentTransactions?.length || 0;
  const creditCount = recentTransactions.filter(
    (item) => item?.transactionType === "Credit",
  ).length;
  const debitCount = recentTransactions.filter(
    (item) => item?.transactionType !== "Credit",
  ).length;

  const formatMoney = (value) => {
    if (!showBalance) {
      return "******";
    }

    const amount = Number(value || 0);
    return `৳${amount.toLocaleString()}`;
  };

  if (isUserPending) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Digital Wallet</h1>
            <p className="text-sm text-text-secondary mt-1">
              Track your earnings, withdrawals, and recent wallet activity
            </p>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 flex items-center gap-3">
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="control w-1/2 text-nowrap flex justify-center items-center gap-2 h-10 px-4 border hover:bg-primary-800/70 text-sm font-medium transition-colors duration-300 cursor-pointer"
            >
              {showBalance ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              {showBalance ? "Hide Balance" : "Show Balance"}
            </button>

            <Link
              to="/dashboard/seller/add-funds"
              className="btn btn-primary flex h-10 w-1/2 text-nowrap items-center justify-center rounded-md text-white text-sm font-medium transition-colors duration-300"
            >
              Add Funds
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {balanceCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="card p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-text-secondary">{card.title}</p>
                <span className={`p-2 rounded-md ${card.iconBg}`}>
                  <Icon size={16} />
                </span>
              </div>
              <p className="text-2xl font-semibold">
                {formatMoney(card.amount)}
              </p>
            </div>
          );
        })}

        <div className="card p-4 shadow-sm">
          <p className="text-xs text-text-secondary mb-3">Recent Activity</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Transactions</span>
              <span className="font-semibold">{transactionCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Credits</span>
              <span className="font-semibold text-green-400">
                {creditCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Debits</span>
              <span className="font-semibold text-red-400">{debitCount}</span>
            </div>
          </div>
        </div>

        <div className="card p-4 shadow-sm space-y-2.5">
          <p className="text-xs text-text-secondary mb-2">Quick Action</p>
          <Link
            to="/dashboard/seller/create-withdrawal"
            className="btn btn-primary inline-flex h-10 w-full items-center justify-center rounded-md text-white text-sm font-medium transition-colors duration-300"
          >
            Withdraw Now
          </Link>
          <Link
            to="/dashboard/seller/my-withdrawals"
            className="btn btn-primary inline-flex h-10 w-full items-center justify-center rounded-md text-white text-sm font-medium transition-colors duration-300"
          >
            My Withdrawals
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-border-color">
            <div className="flex items-center gap-2">
              <FaHistory className="text-primary-400" size={16} />
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
            </div>

            <Link
              to="/dashboard/seller/balance-statement"
              className="text-sm text-primary-300 hover:text-text-secondary font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {isTransactionsPending ? (
              <div className="flex items-center justify-center py-8">
                <Loader />
              </div>
            ) : recentTransactions.length > 0 ? (
              recentTransactions.slice(0, 5).map((transaction, index) => (
                <div
                  key={transaction?.id || index}
                  className="control flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-md ${
                        transaction.transactionType === "Credit"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.transactionType === "Credit" ? (
                        <FaArrowUp size={14} />
                      ) : (
                        <FaArrowDown size={14} />
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-sm">
                        {transaction?.title || "Transaction"}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        {new Date(transaction?.addedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`font-semibold text-sm ${
                      transaction.transactionType === "Credit"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {transaction.transactionType === "Credit" ? "+" : "-"}
                    {formatMoney(transaction?.amount)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <FaHistory
                  size={42}
                  className="mx-auto text-primary-300 mb-3"
                />
                <p className="text-sm text-text-secondary">
                  No recent transactions
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="card p-5 shadow-sm">
            <h3 className="text-base font-semibold mb-4">Payment Methods</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="control border bg-primary-50 overflow-hidden">
                <img
                  src={bkash_logo}
                  alt="bKash"
                  className="w-full h-14 object-cover"
                />
              </div>
              <div className="control border bg-primary-50 overflow-hidden">
                <img
                  src={nagad_logo}
                  alt="Nagad"
                  className="w-full h-14 object-cover"
                />
              </div>
              <div className="control border bg-primary-50 overflow-hidden">
                <img
                  src={rocket_logo}
                  alt="Rocket"
                  className="w-full h-14 object-cover"
                />
              </div>
            </div>
          </div>

          <div className="card p-5 shadow-sm space-y-2.5">
            <h3 className="text-base font-semibold">Need Full Statement?</h3>
            <p className="text-sm text-text-secondary mb-2">
              Review complete wallet history, date ranges, and balances.
            </p>
            <Link
              to="/dashboard/seller/profit-statement"
              className="btn btn-primary inline-flex h-10 w-full items-center justify-center rounded-md text-white text-sm font-medium transition-colors duration-300"
            >
              Profit Statement
            </Link>
            <Link
              to="/dashboard/seller/balance-statement"
              className="btn btn-primary inline-flex h-10 w-full items-center justify-center rounded-md text-white text-sm font-medium transition-colors duration-300"
            >
              Balance Statement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalWallet;
