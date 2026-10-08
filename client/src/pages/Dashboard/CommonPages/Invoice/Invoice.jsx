import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { LuPrinter } from "react-icons/lu";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { FaArrowLeft } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import { IoIosCall } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import Loader from "../../../../components/Loader/Loader";
import useRole from "../../../../hooks/useRole/useRole";
import usePlatform from "../../../../hooks/usePlatform/usePlatform";

import logo from "../../../../assets/logo/logo.png";

const Invoice = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const { isAdmin, isSeller, isBlocked, isRolePending } = useRole();
  const { platform, isPlatformPending } = usePlatform();

  // Fetch a specific order
  const { isPending: isOrderLoading, data: order = {} } = useQuery({
    queryKey: ["id", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/${id}`);
      return res?.data && res?.data?.data;
    },
    refetchOnWindowFocus: true,
  });

  const calculateDiscountedAmount = (regularPrice, discountPercentage) => {
    const discountAmount = (regularPrice * discountPercentage) / 100;
    return discountAmount;
  };

  if (isOrderLoading || isRolePending || isPlatformPending) {
    return <Loader></Loader>;
  }

  return (
    <div className="w-full h-full relative bg-primary-100">
      {/* Invoice */}
      <div
        ref={contentRef}
        className="control bg-primary-50 border-b border-dashed p-10"
      >
        {/* Company Information */}
        <div className="pb-5 border-b border-dashed border-border-color">
          <div className="w-full h-auto">
            <div className="w-32 h-32 mx-auto mb-2.5">
              <img
                src={logo}
                alt="Supply Points"
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-extrabold  text-center text-primary-950 mb-2.5">
              <div className="flex justify-center items-center">
                <span className="text-2xl text-primary-800 font-extrabold ">
                  {platform?.platformName}
                </span>
              </div>
            </h3>
            <p className="text-center text-primary-800  font-medium text-sm mb-1">
              Phone: <span>{platform?.phoneNumber}</span>
            </p>
            <p className="text-center text-primary-800  font-medium text-sm mb-1">
              Email: <span>{platform?.emailAddress}</span>
            </p>
            <p className="text-center text-primary-800  font-medium text-sm mb-1">
              Address: <span>{platform?.address}</span>
            </p>
          </div>
        </div>

        {/* Customer Details, Shipping Address, Invoice Details  */}
        <div className="w-full h-full flex justify-center items-stretch">
          {/* Customer Details */}
          <div className="control w-full h-auto grow px-2.5 py-5 lg:p-5 border-b border-r border-dashed">
            <h3 className="text-center text-primary-950  font-semibold text-xl mb-2.5">
              Customer Details:
            </h3>

            <p className="text-primary-800  font-medium text-sm mb-1 flex justify-center items-center gap-1.5">
              <FaUser size={16} className="text-green-500"></FaUser>{" "}
              <span>{order?.customerInfo?.name}</span>
            </p>
            <p className="text-primary-800  font-medium text-sm mb-1 flex justify-center items-center gap-1.5">
              <IoIosCall size={16} className="text-blue-500"></IoIosCall>{" "}
              <span>{order?.customerInfo?.number}</span>
            </p>
            <p className="text-primary-800  font-medium text-sm mb-1 flex justify-center items-center gap-1.5">
              <IoLocation size={16} className=""></IoLocation>{" "}
              <span>{order?.customerInfo?.address}</span>
            </p>
          </div>

          {/* Shipping Address */}
          <div className="control w-full h-auto grow px-2.5 py-5 lg:p-5 border-b border-r border-dashed">
            <h3 className="text-center text-primary-950  font-semibold text-xl mb-2.5">
              Shipping Address:
            </h3>

            <p className="text-center text-primary-800  font-medium text-sm mb-1">
              Zilla: <span>{order?.customerInfo?.zilla}</span>
            </p>
            <p className="text-center text-primary-800  font-medium text-sm mb-1">
              Thana: <span>{order?.customerInfo?.thana}</span>
            </p>
            <p className="text-center text-primary-800  font-medium text-sm mb-1">
              Address: <span>{order?.customerInfo?.address}</span>
            </p>
          </div>

          {/*  Invoice Details */}
          <div className="control w-full h-auto grow px-2.5 py-5 lg:p-5 border-b border-dashed">
            <h3 className="text-center text-primary-950  font-semibold text-xl mb-2.5">
              Invoice Details:
            </h3>

            <p className="text-center text-primary-800  font-medium text-sm mb-1">
              Invoice No. <span>{order?.orderId}</span>
            </p>
            <p className="text-center text-primary-800  font-medium text-sm mb-1">
              Oder Date:{" "}
              <span>{new Date(order?.addedAt).toLocaleString()}</span>
            </p>
            <p className="text-center text-primary-800  font-medium text-sm mb-1">
              Status:{" "}
              <span
                className={
                  order?.paymentStatus === "Unpaid"
                    ? "text-red-500"
                    : order?.paymentStatus === "Paid"
                      ? "text-green-500"
                      : "text-red-500"
                }
              >
                {order?.paymentStatus}
              </span>
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className="w-full h-auto mt-5">
          <div className="w-full max-w-full overflow-y-hidden truncate overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-primary-100">
                  <th className="text-sm  font-medium text-primary-950 text-center border border-border-color">
                    #
                  </th>
                  <th className="control text-sm font-medium text-primary-950 text-center border px-0">
                    Images
                  </th>
                  <th className="control text-sm font-medium text-primary-950 text-center border px-0">
                    Code
                  </th>
                  <th className="text-sm  font-medium text-primary-950 text-center border border-border-color">
                    Product
                  </th>
                  <th className="text-sm  font-medium text-primary-950 text-center border border-border-color">
                    Color
                  </th>
                  <th className="text-sm  font-medium text-primary-950 text-center border border-border-color">
                    Size
                  </th>
                  <th className="text-sm  font-medium text-primary-950 text-center border border-border-color">
                    Qty
                  </th>
                  <th className="text-sm  font-medium text-primary-950 text-center border border-border-color">
                    Price
                  </th>
                  <th className="text-sm  font-medium text-primary-950 text-center border border-border-color">
                    Discount
                  </th>
                </tr>
              </thead>
              <tbody>
                {order?.products?.map((product, index) => (
                  <tr
                    key={index}
                    className="border-b border-dashed border-border-color"
                  >
                    <th className="text-sm  font-medium text-primary-800 text-center border border-dashed border-border-color text-nowrap">
                      {index + 1}
                    </th>
                    <td className="control text-sm font-medium text-primary-800 text-center border border-dashed text-nowrap p-0 w-14 h-16">
                      <div className="w-14 h-16">
                        <LazyLoadImage
                          src={
                            import.meta.env.VITE_IMAGE_URL + product?.thumbnail
                          }
                          className="w-full h-full object-cover"
                          effect="blur"
                          alt={product?.title}
                        />
                      </div>
                    </td>
                    <td className="text-sm  font-medium text-primary-800 text-center border border-dashed border-border-color text-nowrap">
                      {product?.productCode}
                    </td>
                    <td className="text-sm  font-medium text-primary-800 text-center border border-dashed border-border-color text-wrap">
                      {product?.title}
                    </td>
                    <td className="text-sm  font-medium text-primary-800 text-center border border-dashed border-border-color text-nowrap">
                      {product?.selectedColor}
                    </td>
                    <td className="text-sm  font-medium text-primary-800 text-center border border-dashed border-border-color text-nowrap">
                      {product?.selectedSize}
                    </td>
                    <td className="text-sm  font-medium text-primary-800 text-center border border-dashed border-border-color text-nowrap">
                      {product?.selectedQuantity}
                    </td>
                    <td className="text-sm  font-medium text-primary-800 text-center border border-dashed border-border-color text-nowrap">
                      ৳{product?.regularPrice}
                    </td>
                    <td className="control text-sm font-medium text-primary-800 text-center border border-dashed text-nowrap p-0">
                      ৳
                      {product?.discountPercentage
                        ? calculateDiscountedAmount(
                            product?.regularPrice,
                            product?.discountPercentage,
                          )
                        : "0"}{" "}
                      <span className="badge badge-danger px-1 py-0.5">
                        -
                        {product?.discountPercentage
                          ? product?.discountPercentage
                          : "0"}
                        %
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sub total and total amount count */}
        <div className="pt-5 w-full h-auto flex flex-col lg:flex-row justify-between items-start gap-2.5 lg:gap-5">
          <div className="w-full lg:w-2/3 order-2 lg:order-1">
            <p className="hidden lg:block text-sm  font-medium text-primary-800">
              {order?.comment}
            </p>
            <p className="lg:hidden text-sm  font-medium text-primary-800 text-center">
              Your satisfaction is our priority. Thank you!
            </p>
          </div>

          <div className="w-full lg:w-1/3 order-1 lg:order-2">
            <div className=" text-sm font-medium text-primary-800 mb-2.5 flex justify-between items-center gap-10 md:gap-12 lg:gap-16 2xl:gap-20">
              <p>Sub Total:</p> <p>৳{order?.resellerPrice?.toFixed(2)}</p>
            </div>
            <div className=" text-sm font-medium text-primary-800 mb-2.5 flex justify-between items-center gap-10 md:gap-12 lg:gap-16 2xl:gap-20">
              <p>{order?.deliveryArea}:</p>{" "}
              <p>৳{order?.deliveryCharge?.toFixed(2)}</p>
            </div>
            <div className=" text-sm font-medium text-primary-800 mb-2.5 flex justify-between items-center gap-10 md:gap-12 lg:gap-16 2xl:gap-20">
              <p>Total Coast:</p> <p>৳{order?.totalCost?.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div className="p-2.5 lg:p-5 mb-5 bg-primary-100 rounded flex justify-center items-center gap-5">
        <Link
          to={
            isAdmin
              ? "/dashboard/admin/orders"
              : isSeller
                ? "/dashboard/my-orders"
                : isBlocked
                  ? "/support"
                  : "/"
          }
          className="btn outline-btn text-base"
        >
          <FaArrowLeft size={20}></FaArrowLeft> Back
        </Link>
        <button onClick={reactToPrintFn} className="btn primary-btn text-sm">
          <LuPrinter size={20}></LuPrinter> Print
        </button>
      </div>
    </div>
  );
};

export default Invoice;
