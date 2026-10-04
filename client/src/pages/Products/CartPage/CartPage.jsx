import { useContext, useEffect } from "react";
import { Link } from "react-router";
import { CartContext } from "../../../providers/CartProvider/CartProvider";
import { RiCloseFill } from "react-icons/ri";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";

const CartPage = () => {
  const { cartData, refetch, clearCart, removeProduct } =
    useContext(CartContext);

  // Fetch products from localStorage on component mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  // If there are no products in cart then show this component
  if (cartData?.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="surface flex flex-col items-center justify-center p-10 text-center">
          <p className="caption mb-2 uppercase tracking-[0.18em]">Your bag</p>
          <h1 className="section-title mb-4">
            Cart is Empty
          </h1>

          <Link
            to="/reselling"
            className="btn btn-primary w-full max-w-xs"
          >
            Start Reselling
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Cart", active: true },
  ];

  return (
    <div className="relative w-full min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Cart Desktop Version */}
        <div className="table-shell hidden lg:block">
          <table>
            <thead>
              <tr className="text-center">
                <td>Image</td>
                <td>Product Title</td>
                <td>Size</td>
                <td>Color</td>
                <td>Price</td>
                <td>Total</td>
                <td>Profit</td>
                <td>Action</td>
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
                      <button
                        onClick={() => removeProduct(index)}
                        className="btn btn-danger min-h-8 px-3 text-xs"
                      >
                        Remove
                      </button>
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
                    <div                     className="badge badge-success min-h-8 w-1/2 justify-center rounded-md">
                      Profit: ৳{product?.profit}
                    </div>

                    <button
                      title="Delete"
                      onClick={() => removeProduct(index)}
                      className="btn btn-danger min-h-8 w-1/2 px-2 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="flex flex-col items-stretch justify-end gap-3 border-t border-border-color pt-5 sm:flex-row sm:items-center">
          {/* Clear Cart Button */}
          <button
            onClick={() => {
              clearCart();
            }}
            className="btn btn-danger"
          >
            Clear Cart
          </button>
          {/* Checkout navigate link */}
          <Link
            to="/checkout"
            state={{ data: cartData }}
            className="btn btn-primary"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
