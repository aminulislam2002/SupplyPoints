import { Link, useParams, useNavigate } from "react-router";
import { ImMinus, ImPlus } from "react-icons/im";
import { MdArrowBackIos } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useContext, useEffect, useState } from "react";
import { TbCopy } from "react-icons/tb";
import ProductImageSliderOne from "./ProductImageSliderOne";
import useAxiosPublic from "../../../hooks/useAxiosPublic/useAxiosPublic";
import Loader from "../../../components/Loader/Loader";
import { CartContext } from "../../../providers/CartProvider/CartProvider";
import { BsCartPlus } from "react-icons/bs";
import MatchingProducts from "../MatchingProducts/MatchingProducts";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import DescriptionAndReviews from "./DescriptionAndReviews";
import PricingModal from "./PricingModal";
import useStatus from "../../../hooks/useStatus/useStatus";
import useAuth from "../../../hooks/useAuth/useAuth";
import ShareAndDownload from "./ShareAndDownload";
import SubscriptionPaymentTrigger from "../../../components/SubscriptionPaymentModal/SubscriptionPaymentTrigger";
import usePlatform from "../../../hooks/usePlatform/usePlatform";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { isActive } = useStatus();
  const { user } = useAuth();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(""); // 'addToCart' or 'orderNow'
  const { handleAddToCart } = useContext(CartContext);
  const { platform } = usePlatform();

  // Fetch Single product data
  const { isPending, data: product = {} } = useQuery({
    queryKey: ["productUrl", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/products/by-id/${id}`);

      return res?.data && res?.data?.data;
    },
    refetchOnWindowFocus: true,
  });

  // Set default selected color & size when the product colors and sizes are available
  useEffect(() => {
    if (product?.colors?.length > 0) {
      setSelectedColor(product?.colors[0]); // Set the first color as default
    }
    if (product?.sizes?.length > 0) {
      setSelectedSize(product?.sizes[0]); // Set the first size as default
    }
  }, [product]);

  // Selected Product Object
  const selectedProduct = {
    productId: product?._id,
    title: product?.title,
    price: product?.price,
    thumbnail: product?.thumbnail,
    productCode: product?.productCode,
    selectedQuantity,
    selectedColor,
    selectedSize,
    addedAt: new Date(),
  };

  // Handle Add to Cart with Reseller Modal
  const handleAddToCartClick = () => {
    setModalAction("addToCart");
    setIsPricingModalOpen(true);
  };

  // Handle Order Now with Reseller Modal
  const handleOrderNowClick = () => {
    setModalAction("orderNow");
    setIsPricingModalOpen(true);
  };

  // Handle Reseller Add to Cart
  const handleResellerAddToCart = (resellerProduct) => {
    handleAddToCart(resellerProduct);
    Swal.fire({
      icon: "success",
      title: "Added to Cart!",
      text: `Product added with selling price ৳${resellerProduct.resellerPrice}`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // Handle Reseller Order Now
  const handleResellerOrderNow = (resellerProduct) => {
    navigate("/checkout", { state: { data: [resellerProduct] } });
  };

  // Handle Copy Title
  const handleCopyTitle = () => {
    navigator.clipboard
      .writeText(product?.title || "")
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Copied!",
          text: "Product title copied successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to copy the title.",
        });
      });
  };

  if (isPending) {
    return <Loader></Loader>;
  }

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    {
      label: "Category",
      link: `/category/${product?.category}/sub/${product?.subCategory}`,
    },
    {
      label:
        product?.title?.split(" ").slice(0, 3).join(" ") +
        (product?.title?.split(" ").length > 3 ? "..." : ""),
      active: true,
    },
  ];

  return (
    <div className="relative min-h-screen w-full">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="surface relative order-2 w-full overflow-hidden p-2 lg:order-1 lg:p-3">
            {/* Product Images */}
            <ProductImageSliderOne product={product}></ProductImageSliderOne>
          </div>

          {/* Desktop Product Details */}
          <div className="surface relative order-3 w-full p-5 lg:order-2 lg:p-6">
            {/* Product Title, Regular & Discounted Price, In Stock & Out of Stock */}
            <div>
              {/* Product Title */}
              <div className="mb-4 flex items-start justify-between gap-3 border-b border-border-color/70 pb-4 md:mb-5 lg:mb-6">
                <h1 className="flex-1 text-xl font-semibold leading-snug lg:text-2xl">
                  {product?.title}
                </h1>
                <button
                  onClick={handleCopyTitle}
                  className="btn btn-outline min-h-10 px-2"
                  title="Copy Title"
                >
                  <TbCopy size={18} />
                </button>
              </div>

              {/* Price */}
              <div className="surface-muted mb-5 p-4">
                {product.category === "6a257b01c2c6674da70c6146" ? (
                  <div className="space-y-1.5">
                    <h1 className="text-xl font-semibold text-primary-600 lg:text-2xl">
                      Price <span className="font-bold">৳ {product.price}</span>
                    </h1>

                    <h3 className="text-base font-semibold text-yellow-600 lg:text-lg">
                      Suggested ৳ {product.suggestedPrice}
                    </h3>
                  </div>
                ) : !user ? (
                  <Link
                    to="/auth/sign-in"
                    className="text-base text-blue-500 font-medium block hover:underline"
                  >
                    লগইন আবশ্যক
                  </Link>
                ) : !isActive ? (
                  <>
                    {platform?.paymentGateway === "Manual" ? (
                      <Link
                        to={`/payment/Account/${platform?.accountActivationFee}`}
                        className="text-xs text-red-500 font-medium hover:underline"
                      >
                        Become a Seller
                      </Link>
                    ) : platform?.paymentGateway === "ClickPay" ||
                      platform?.paymentGateway === "StarPay" ? (
                      <SubscriptionPaymentTrigger
                        as="span"
                        className="text-xs text-red-500 font-medium hover:underline"
                      >
                        Become a Seller
                      </SubscriptionPaymentTrigger>
                    ) : null}
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <h1 className="text-xl font-semibold text-primary-600 lg:text-2xl">
                      Price <span className="font-bold">৳ {product.price}</span>
                    </h1>

                    <h3 className="text-base font-semibold text-yellow-600 lg:text-lg">
                      Suggested ৳ {product.suggestedPrice}
                    </h3>
                  </div>
                )}
              </div>
            </div>

            {/* Select Color & Size */}
            {(product?.sizes?.length > 0 || product?.colors?.length > 0) && (
              <div               className="surface-muted relative mb-6 flex h-12 w-full items-center justify-center overflow-hidden">
                {/* Color selected */}
                {product?.colors?.length > 0 && (
                  <div className="relative flex h-full w-full items-center justify-center">
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="h-full w-full appearance-none bg-transparent pl-3 focus:outline-none"
                    >
                      {product?.colors?.map((color, index) => (
                        <option key={index} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>

                    <div className="pointer-events-none absolute right-0 flex h-full w-10 items-center justify-center border-l border-border-color bg-section-bg/70">
                      <MdArrowBackIos
                        size={20}
                        className="-mb-2 -rotate-90"
                      ></MdArrowBackIos>
                    </div>
                  </div>
                )}

                {/* Size selected */}
                {product?.sizes?.length > 0 && (
                  <div className="relative flex h-full w-full items-center justify-center">
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="h-full w-full appearance-none border-l border-border-color/70 bg-transparent pl-3 focus:outline-none"
                    >
                      {product?.sizes?.map((size, index) => (
                        <option key={index} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>

                    <div className="pointer-events-none absolute right-0 flex h-full w-10 items-center justify-center border-l border-border-color bg-section-bg/70">
                      <MdArrowBackIos
                        size={20}
                        className="-mb-2 -rotate-90"
                      ></MdArrowBackIos>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Select Product Quantity */}
            {product?.availability !== "Out of Stock" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 mb-6 lg:mb-0">
                <div className="surface-muted relative mb-2 flex h-12 w-full items-center justify-between overflow-hidden md:mb-5">
                  <button
                    onClick={() => setSelectedQuantity(selectedQuantity - 1)}
                    disabled={selectedQuantity === 1}
                    className="absolute bottom-0 left-0 top-0 flex h-full w-12 cursor-not-allowed items-center justify-center border-r border-border-color transition-colors duration-300 hover:cursor-pointer disabled:opacity-40"
                  >
                    <ImMinus size={15}></ImMinus>
                  </button>

                  <span className="absolute left-1/2 -translate-x-1/2 text-lg font-medium">
                    {selectedQuantity}
                  </span>

                  <button
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    disabled={
                      selectedQuantity === product?.maxOrderLimit ||
                      selectedQuantity === product?.quantity ||
                      product?.quantity === 0
                    }
                    className="absolute bottom-0 right-0 top-0 flex h-full w-12 cursor-not-allowed items-center justify-center border-l border-border-color transition-colors duration-300 hover:cursor-pointer disabled:opacity-40"
                  >
                    <ImPlus size={15}></ImPlus>
                  </button>
                </div>

                <button
                  onClick={user && isActive ? handleAddToCartClick : undefined}
                  disabled={product?.availability === "Out of Stock"}
                  className="btn btn-primary h-12 w-full disabled:opacity-50"
                >
                  <BsCartPlus
                    size={18}
                    className={
                      product?.availability === "Out of Stock" ||
                      !user ||
                      !isActive
                        ? "hidden"
                        : ""
                    }
                  ></BsCartPlus>
                  <span>
                    {product?.availability === "Out of Stock" ? (
                      "Out of Stock"
                    ) : !user ? (
                      <Link
                        to="/auth/sign-in"
                        className="text-blue-200 underline"
                      >
                        লগইন আবশ্যক
                      </Link>
                    ) : !isActive ? (
                      <>
                        {platform?.paymentGateway === "Manual" ? (
                          <Link
                            to={`/payment/Account/${platform?.accountActivationFee}`}
                            className="text-xs text-red-500 font-medium hover:underline"
                          >
                            Become a Seller
                          </Link>
                        ) : platform?.paymentGateway === "ClickPay" ||
                          platform?.paymentGateway === "StarPay" ? (
                          <SubscriptionPaymentTrigger
                            as="span"
                            className="text-xs text-red-500 font-medium hover:underline"
                          >
                            Become a Seller
                          </SubscriptionPaymentTrigger>
                        ) : null}
                      </>
                    ) : (
                      "Add to Cart"
                    )}
                  </span>
                </button>
              </div>
            )}

            {/* Order Now Link */}
            <button
              onClick={user && isActive ? handleOrderNowClick : undefined}
              disabled={product?.availability === "Out of Stock"}
              className="btn btn-secondary mb-5 h-12 w-full disabled:opacity-50"
            >
              {product?.availability === "Out of Stock" ? (
                "Out of Stock"
              ) : !user ? (
                <Link to="/auth/sign-in" className="text-blue-200 underline">
                  Login Required
                </Link>
              ) : !isActive ? (
                <>
                  {platform?.paymentGateway === "Manual" ? (
                    <Link
                      to={`/payment/Account/${platform?.accountActivationFee}`}
                      className="text-xs text-red-500 font-medium hover:underline"
                    >
                      Become a Seller
                    </Link>
                  ) : platform?.paymentGateway === "ClickPay" ||
                    platform?.paymentGateway === "StarPay" ? (
                    <SubscriptionPaymentTrigger
                      as="span"
                      className="text-xs text-red-500 font-medium hover:underline"
                    >
                      Become a Seller
                    </SubscriptionPaymentTrigger>
                  ) : null}
                </>
              ) : (
                "Order Now"
              )}
            </button>

            {product?.notes && (
              <div className="alert alert-info mb-5 p-3 text-sm font-medium md:text-base">
                {product?.notes}
              </div>
            )}

            {/* Share social media & Download Image CTA */}
            <div className="surface-muted p-3 lg:p-4">
              <ShareAndDownload
                product={product}
                isActive={isActive}
                user={user}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features, Description & Reviews */}
      <DescriptionAndReviews product={product} />

      {/* Suggested Products by Category */}
      <MatchingProducts
        category={product?.category}
        subCategory={product?.subCategory}
      />

      {/* Reseller Pricing Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        product={product}
        selectedProduct={selectedProduct}
        onAddToCart={handleResellerAddToCart}
        onOrderNow={handleResellerOrderNow}
        modalAction={modalAction}
      />
    </div>
  );
};

export default ProductDetails;
