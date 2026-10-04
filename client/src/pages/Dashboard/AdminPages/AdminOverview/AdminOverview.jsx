import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaTags,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaHourglassHalf,
  FaClipboardCheck,
} from "react-icons/fa";
import { MdInventory, MdRemoveShoppingCart, MdWarning } from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { Link } from "react-router";

const AdminOverview = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch statistics from API
  const { isLoading: isStatisticsPending, data: statistics = null } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/platform/statistics");
      return res?.data?.data || null;
    },
    refetchOnWindowFocus: true,
  });

  if (isStatisticsPending) {
    return <Loader />;
  }

  const { products, categories, orders, users } = statistics;

  return (
    <div className="min-h-screen w-full bg-page-bg p-5 sm:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="page-title mb-2">
          Dashboard Overview
        </h1>
        <p className="body-copy text-sm md:text-base">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* Total Products Card */}
        <Link
          to="/dashboard/admin/products"
          className="card block p-5 transition-shadow duration-300 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1">Total Products</p>
              <h3 className="text-3xl md:text-4xl font-bold">
                {products?.total || 0}
              </h3>
            </div>
            <div className="rounded-xl bg-primary-100 p-4 text-primary-700">
              <FaBox className="text-2xl md:text-3xl" />
            </div>
          </div>
        </Link>

        {/* Total Categories Card */}
        <Link
          to="/dashboard/admin/categories"
          className="card block p-5 transition-shadow duration-300 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1">Categories</p>
              <h3 className="text-3xl md:text-4xl font-bold">
                {categories || 0}
              </h3>
            </div>
            <div className="rounded-xl bg-primary-100 p-4 text-primary-700">
              <FaTags className="text-2xl md:text-3xl" />
            </div>
          </div>
        </Link>

        {/* Total Orders Card */}
        <Link
          to="/dashboard/admin/orders"
          className="card block p-5 transition-shadow duration-300 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1">Total Orders</p>
              <h3 className="text-3xl md:text-4xl font-bold">
                {orders?.total || 0}
              </h3>
            </div>
            <div className="rounded-xl bg-primary-100 p-4 text-primary-700">
              <FaShoppingCart className="text-2xl md:text-3xl" />
            </div>
          </div>
        </Link>

        {/* Total Users Card */}
        <Link
          to="/dashboard/admin/all-users"
          className="card block p-5 transition-shadow duration-300 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1">Total Users</p>
              <h3 className="text-3xl md:text-4xl font-bold">{users || 0}</h3>
            </div>
            <div className="rounded-xl bg-primary-100 p-4 text-primary-700">
              <FaUsers className="text-2xl md:text-3xl" />
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Products Availability Section */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-blue-50 p-3 text-info">
              <MdInventory className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Product Inventory</h2>
              <p className="body-copy text-sm">
                Stock availability overview
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* In Stock */}
            <div className="surface-muted flex items-center justify-between rounded-lg p-4 transition-shadow duration-300 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary-100 p-2 text-primary-700">
                  <FaCheckCircle className="text-xl" />
                </div>
                <div>
                  <p className="font-semibold">In Stock</p>
                  <p className="metadata">Available products</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-success">
                {products?.inStock || 0}
              </span>
            </div>

            {/* Limited Stock */}
            <div className="surface-muted flex items-center justify-between rounded-lg p-4 transition-shadow duration-300 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-2 text-warning">
                  <MdWarning className="text-xl" />
                </div>
                <div>
                  <p className="font-semibold">Limited Stock</p>
                  <p className="metadata">Running low</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-warning">
                {products?.limitedStock || 0}
              </span>
            </div>

            {/* Out of Stock */}
            <div className="surface-muted flex items-center justify-between rounded-lg p-4 transition-shadow duration-300 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2 text-danger">
                  <MdRemoveShoppingCart className="text-xl" />
                </div>
                <div>
                  <p className="font-semibold">Out of Stock</p>
                  <p className="metadata">Needs restocking</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-danger">
                {products?.outOfStock || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Orders Status Section */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-primary-50 p-3 text-success">
              <BiPackage className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Order Management</h2>
              <p className="body-copy text-sm">Delivery status breakdown</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Pending Orders */}
            <div className="surface-muted flex items-center justify-between rounded-lg p-4 transition-shadow duration-300 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-secondary-100 p-2 text-secondary-700">
                <FaHourglassHalf className="text-xl" />
                </div>
                <div>
                  <p className="font-semibold">Pending</p>
                  <p className="metadata">Awaiting action</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-300">
                {orders?.pending || 0}
              </span>
            </div>

            {/* Confirmed Orders */}
            <div className="surface-muted flex items-center justify-between rounded-lg p-4 transition-shadow duration-300 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 text-info">
                  <FaClipboardCheck className="text-xl" />
                </div>
                <div>
                  <p className="font-semibold">Confirmed</p>
                  <p className="metadata">Ready to ship</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600 ">
                {orders?.confirmed || 0}
              </span>
            </div>

            {/* Shipped Orders */}
            <div className="surface-muted flex items-center justify-between rounded-lg p-4 transition-shadow duration-300 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-100 p-2 text-indigo-700">
                  <FaTruck className="text-xl" />
                </div>
                <div>
                  <p className="font-semibold">Shipped</p>
                  <p className="metadata">In transit</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-purple-600 ">
                {orders?.shipped || 0}
              </span>
            </div>

            {/* Delivered Orders */}
            <div className="surface-muted flex items-center justify-between rounded-lg p-4 transition-shadow duration-300 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary-100 p-2 text-success">
                  <IoMdCheckmarkCircle className="text-xl" />
                </div>
                <div>
                  <p className="font-semibold">Delivered</p>
                  <p className="metadata">
                    Successfully completed
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600 ">
                {orders?.delivered || 0}
              </span>
            </div>

            {/* Cancelled Orders */}
            <div className="surface-muted flex items-center justify-between rounded-lg p-4 transition-shadow duration-300 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2 text-danger">
                  <FaTimesCircle className="text-xl" />
                </div>
                <div>
                  <p className="font-semibold">Cancelled</p>
                  <p className="metadata">Order cancelled</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-danger">
                {orders?.cancelled || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
