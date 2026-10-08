import { useContext, useEffect } from "react";
import { Link } from "react-router";
import { CartContext } from "../../../providers/CartProvider/CartProvider";
import { RiCloseFill } from "react-icons/ri";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import { BsBagX, BsCartX } from "react-icons/bs";

const CartPage = () => {
  const { cartData, refetch, clearCart, removeProduct } =
    useContext(CartContext);

  // Fetch products from localStorage on component mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Cart", active: true },
  ];

  // If there are no products in cart then show this component
  if (cartData?.length === 0) {
    return (
      <div>
        <Breadcrumb items={breadcrumbItems} />
        <div className="container mx-auto px-4 py-5 lg:py-10">
          <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
            <BsBagX size={60} className="text-text-secondary opacity-50" />

            <h1 className="section-title">কার্টটি খালি</h1>

            <Link to="/reselling" className="btn primary-btn w-full max-w-xs">
              পণ্যের পৃষ্ঠায় ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-5 lg:py-10">
        {/* Cart Desktop Version */}
        <div className="table-shell hidden lg:block">
          <table className="table table-xs w-full table-fixed">
            <thead thead className="bg-section-bg">
              <tr className="h-10 text-sm text-nowrap font-normal text-center">
                <td>ছবি</td>
                <td>পণ্যের নাম</td>
                <td>সাইজ</td>
                <td>কালার</td>
                <td>দাম</td>
                <td>টোটাল</td>
                <td>প্রফিট</td>
                <td>ডিলিট</td>
              </tr>
            </thead>

            {cartData
              ?.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
              .map((product, index) => (
                <tbody key={index}>
                  <tr>
                    <td>
                      <img
                        src={
                          import.meta.env.VITE_IMAGE_URL + product?.thumbnail
                        }
                        className="h-20 w-20 rounded-lg object-cover"
                        alt="Product Name"
                      />
                    </td>
                    <td>
                      <Link
                        to={`/products/${product?.productId}`}
                        className="link line-clamp-3"
                      >
                        {product?.title}
                      </Link>
                    </td>
                    <td className="px-5 text-nowrap text-center">
                      {product?.selectedSize}
                    </td>
                    <td className="px-5 text-nowrap text-center">
                      {product?.selectedColor}
                    </td>

                    <td className="px-5 text-nowrap text-center">
                      <div className="flex justify-center items-center gap-2.5 italic">
                        {product?.selectedQuantity}
                        <RiCloseFill />৳{product?.resellerPrice}
                      </div>
                    </td>

                    <td className="px-5 text-nowrap  text-center">
                      ৳{product?.resellerPrice * product?.selectedQuantity}
                    </td>

                    <td className="px-5 text-nowrap text-center">
                      ৳{product?.profit}
                    </td>
                    <td>
                      <div className="w-full h-full flex justify-center items-center">
                        <button
                          onClick={() => removeProduct(index)}
                          className="btn secondary-btn w-full sm:w-auto"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ))}
          </table>
        </div>

        {/* Cart Mobile Version */}
        <div className="lg:hidden">
          {cartData
            ?.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
            .map((product, index) => (
              <div
                key={index}
                className="surface mb-4 flex h-full w-full items-center gap-4 p-4"
              >
                <div className="h-full w-24 shrink-0">
                  <img
                    src={import.meta.env.VITE_IMAGE_URL + product?.thumbnail}
                    alt={product?.title}
                    className="h-28 w-24 rounded-lg object-cover"
                  />
                </div>

                <div className="h-full min-w-0 flex-1">
                  <h3 className="text-base font-medium mb-2 line-clamp-1">
                    {product?.title}
                  </h3>

                  {/* Pricing Part */}
                  <div className="flex justify-start items-center gap-2.5 mb-2">
                    {/* Price */}
                    <div className="flex justify-center items-center gap-2.5">
                      <span className="flex items-center gap-1 italic">
                        {product?.selectedQuantity}
                        <RiCloseFill />৳{product?.resellerPrice}
                      </span>{" "}
                      ={" "}
                      <span className="font-bold">
                        ৳{product?.resellerPrice * product?.selectedQuantity}
                      </span>
                    </div>
                  </div>

                  {/* Select Color & Size */}
                  {(product?.selectedColor || product?.selectedSize) && (
                    <div className="flex flex-wrap gap-2 text-sm ">
                      {product?.selectedColor && (
                        <div className="badge badge-info rounded-md">
                          <span className="font-semibold">Color:</span>{" "}
                          {product?.selectedColor}
                        </div>
                      )}
                      {product?.selectedSize && (
                        <div className="badge badge-info rounded-md">
                          <span className="font-semibold">Size:</span>{" "}
                          {product?.selectedSize}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Profit and Remove buttons */}
                  <div className="flex justify-between items-center gap-2.5 mt-2">
                    <div className="badge badge-success min-h-8 w-1/2 justify-center rounded-md">
                      Profit: ৳{product?.profit}
                    </div>

                    <button
                      title="Delete"
                      onClick={() => removeProduct(index)}
                      className="btn danger-btn min-h-8 w-1/2 px-2 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="w-full relative flex items-center justify-center gap-3 pt-5">
          {/* Clear Cart Button */}
          <button
            onClick={() => {
              clearCart();
            }}
            className="btn secondary-btn w-1/2 sm:w-auto"
          >
            কার্ট খালি করুন
          </button>
          {/* Checkout navigate link */}
          <Link
            to="/checkout"
            state={{ data: cartData }}
            className="btn primary-btn w-1/2 sm:w-auto"
          >
            চেক-আউট
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
