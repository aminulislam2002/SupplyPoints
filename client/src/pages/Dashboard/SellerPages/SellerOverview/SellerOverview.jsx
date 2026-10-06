import { Link } from "react-router";
import {
  FaShoppingBag,
  FaBoxOpen,
  FaTruck,
  FaArrowRight,
} from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import useAuth from "../../../../hooks/useAuth/useAuth";
import Loader from "../../../../components/Loader/Loader";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useStatus from "../../../../hooks/useStatus/useStatus";
import usePlatform from "../../../../hooks/usePlatform/usePlatform";
import NoticeModal from "../../../../components/NoticeModal/NoticeModal";

import logo from "../../../../assets/logo/logo.png";

const SellerOverview = () => {
  const axiosSecure = useAxiosSecure();
  const { user, isUserPending } = useAuth();

  const { isStatusPending, status, isInactive, isActive, isPending } =
    useStatus();

  const { platform, isPlatformPending } = usePlatform();

  const activationFee = Number(platform?.accountActivationFee || 0);

  const {
    isLoading: isOrdersLoading,
    isFetching,
    data: recentOrders = [],
    isPlaceholderData,
  } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders/my-orders", {
        params: {
          currentPage: 0,
          limitPerPage: 3,
        },
      });

      return res?.data && res.data.data;
    },
    placeholderData: keepPreviousData,
  });

  const quickActions = [
    {
      title: "Track Order",
      description: "Track your recent orders",
      icon: FaTruck,
      link: "/track-order",
      color: "text-blue-600 ",
    },
    {
      title: "Browse Products",
      description: "Explore our collection",
      icon: FaBoxOpen,
      link: "/products",
      color: "text-purple-600 ",
    },
    {
      title: "Get Support",
      description: "Need help? Contact us",
      icon: BiSupport,
      link: "/support",
      color: "text-green-600 ",
    },
  ];

  const pendingOrdersCount = recentOrders.filter(
    (order) => order?.deliveryStatus === "Pending",
  ).length;

  const recentProfit = recentOrders.reduce(
    (total, order) => total + Number(order?.totalProfit || 0),
    0,
  );

  const profileCompletion = 75;

  if (
    isUserPending ||
    isStatusPending ||
    isPlatformPending ||
    isOrdersLoading
  ) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <NoticeModal enabled={true} />
      <div className="surface overflow-hidden rounded-xl shadow-sm">
        <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              className="control w-12 h-12 object-cover rounded-full border"
              alt="Platform Logo"
            />

            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">
                Hello, {user?.name || "User"}
              </h1>
              <p className="metadata mt-1">Seller Dashboard</p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:flex-row sm:items-center gap-3 sm:gap-4">
            <span
              className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-medium text-nowrap ${
                isPending
                  ? "bg-yellow-100 text-yellow-700"
                  : isInactive
                    ? "bg-red-100 text-red-700"
                    : isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-primary-100 text-primary-700"
              }`}
            >
              Account {status}
            </span>

            {isInactive && (
              <>
                {platform?.paymentGateway === "Manual" ? (
                  <Link
                    to={`/payment/Account/${activationFee}`}
                    className="btn btn-primary h-10 w-full px-4"
                  >
                    Get Started
                    <FaArrowRight className="ml-2" />
                  </Link>
                ) : platform?.paymentGateway === "ClickPay" ||
                  platform?.paymentGateway === "StarPay" ? (
                  <Link
                    to="/dashboard/seller/subscription"
                    className="btn btn-primary h-10 w-full px-4"
                  >
                    Get Started
                    <FaArrowRight className="ml-2" />
                  </Link>
                ) : null}
              </>
            )}
          </div>
        </div>

        {(isInactive || isPending) && (
          <div className="control border-t bg-section-bg px-5 py-4 sm:px-6">
            <p className="body-copy text-sm">
              {isPending
                ? "Your payment is being processed. Your account is under review."
                : `Activate your reseller account with fee: ৳${activationFee}.`}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="caption">Recent Orders</p>
          <p className="text-2xl font-semibold mt-1">{recentOrders.length}</p>
        </div>

        <div className="card p-4">
          <p className="caption">Pending Orders</p>
          <p className="text-2xl font-semibold mt-1">{pendingOrdersCount}</p>
        </div>

        <div className="card p-4">
          <p className="caption">Recent Profit</p>
          <p className="text-2xl font-semibold mt-1">৳{recentProfit}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="card p-5 shadow-sm xl:col-span-8">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-border-color">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FaShoppingBag className="text-primary-400" />
              Recent Orders
            </h2>
            <Link to="/dashboard/seller/my-orders" className="link text-sm">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {isFetching && isPlaceholderData ? (
              <div className="text-center py-12">
                <FaBoxOpen
                  size={44}
                  className="mx-auto text-primary-300 mb-3"
                />
                <p className="text-sm text-text-secondary">Loading orders...</p>
              </div>
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order, index) => (
                <Link
                  key={order?.id || index}
                  to={`/dashboard/seller/my-orders/${order?.id}`}
                  className="surface-muted block rounded-lg p-4 transition-colors duration-300 hover:border-primary-500"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="font-semibold text-sm">
                          ID: {order?.orderId}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            order?.deliveryStatus === "Pending"
                              ? "text-yellow-700 bg-yellow-100"
                              : order?.deliveryStatus === "Confirmed"
                                ? "text-blue-700 bg-blue-100"
                                : order?.deliveryStatus === "Shipped"
                                  ? "text-indigo-700 bg-indigo-100"
                                  : order?.deliveryStatus === "Delivered"
                                    ? "text-green-700 bg-green-100"
                                    : order?.deliveryStatus === "Cancelled"
                                      ? "text-red-700 bg-red-100"
                                      : "text-primary-700 bg-primary-100"
                          }`}
                        >
                          {order?.deliveryStatus}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-text-secondary">
                        <span>
                          {new Date(order?.addedAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{order?.products?.length || 0} items</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right space-y-1">
                      <p className="font-medium text-sm">
                        Total: ৳{order?.resellerPrice}
                      </p>
                      {/* <p className="font-medium text-sm text-primary-300">
                        Profit: ৳{order?.totalProfit}
                      </p> */}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <FaBoxOpen
                  size={44}
                  className="mx-auto text-primary-300 mb-3"
                />
                <p className="text-sm text-text-secondary mb-4">
                  No orders yet
                </p>
                <Link
                  to="/products"
                  className="btn btn-primary inline-flex h-10 px-4 items-center justify-center rounded-md text-sm font-medium transition-colors duration-300"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="card p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 pb-3 border-b border-border-color">
              Quick Actions
            </h2>

            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="control block p-4 border hover:border-primary-500 transition-colors duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-md bg-primary-100 ${action.color}`}
                    >
                      <action.icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{action.title}</h3>
                      <p className="text-xs text-text-secondary mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Complete Your Profile
            </h2>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1 bg-section-bg rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-primary-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{profileCompletion}%</span>
            </div>

            <p className="text-sm text-text-secondary mb-4">
              Add a profile picture and phone number to unlock exclusive
              benefits.
            </p>

            <Link
              to="/dashboard/seller/profile"
              className="btn btn-primary inline-flex h-10 px-4 items-center justify-center rounded-md text-white text-sm font-medium transition-colors duration-300"
            >
              Complete Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOverview;
