import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { BsCartPlus } from "react-icons/bs";
import { FaTruckArrowRight } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";

const PricingModal = ({
  isOpen,
  onClose,
  product,
  selectedProduct,
  onAddToCart,
  onOrderNow,
  modalAction,
}) => {
  const [sellingPrice, setSellingPrice] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // Get minimum allowed price
  const getMinimumPrice = () => {
    if (product?.sellingPrice) {
      return Math.max(product.price, product.sellingPrice);
    }
    return product.price;
  };

  const minimumPrice = getMinimumPrice();

  // Handle selling price change
  const handleSellingPriceChange = (value) => {
    setSellingPrice(value);

    const numericValue = parseFloat(value);

    if (value === "" || isNaN(numericValue)) {
      setError("");
    } else if (numericValue < minimumPrice) {
      if (product?.sellingPrice && numericValue < product.sellingPrice) {
        setError(`৳${product.sellingPrice}`);
      } else {
        setError(`৳${product.price}`);
      }
    } else {
      setError("");
    }
  };

  // Check if proceed is disabled
  const isProceedDisabled = () => {
    const numericValue = parseFloat(sellingPrice);
    return !sellingPrice || isNaN(numericValue) || numericValue < minimumPrice;
  };

  // Handle add to cart
  const handleAddToCart = () => {
    const resellerProduct = {
      ...selectedProduct,
      resellerPrice: parseFloat(sellingPrice),
      profit:
        (parseFloat(sellingPrice) - product.price) *
        selectedProduct.selectedQuantity,
    };
    onAddToCart(resellerProduct);
    handleClose();
  };

  // Handle order now
  const handleOrderNow = () => {
    const resellerProduct = {
      ...selectedProduct,
      resellerPrice: parseFloat(sellingPrice),
      profit:
        (parseFloat(sellingPrice) - product.price) *
        selectedProduct.selectedQuantity,
    };
    onOrderNow(resellerProduct);
    handleClose();
  };

  // Handle close modal
  const handleClose = () => {
    setSellingPrice("");
    setError("");
    onClose();
  };

  // Calculate profit
  const calculateProfit = () => {
    const numericValue = parseFloat(sellingPrice);
    if (!isNaN(numericValue) && numericValue >= product.price) {
      return (numericValue - product.price) * selectedProduct.selectedQuantity;
    }
    return 0;
  };

  return (
    <div className="w-full relative mb-5">
      {/* Selling Price Input */}
      <input
        type="number"
        min={minimumPrice}
        value={sellingPrice}
        onChange={(e) => handleSellingPriceChange(e.target.value)}
        placeholder={`সর্বনিম্ন বিক্রয় মূল্য ৳${minimumPrice}`}
        className="w-full h-12 bg-transparent text-primary-600 border border-border-color rounded-xl focus:outline-none px-2.5 text-sm font-medium"
      />

      <div className="flex justify-between items-center pt-2.5">
        {error && (
          <p className="text-xs font-medium text-warning">
            সর্বনিম্ন বিক্রয় মূল্য: {error}
          </p>
        )}

        {/* Profit Display */}
        {sellingPrice && !error && (
          <p className="text-xs font-medium text-primary-600">
            লাভ: ৳{calculateProfit().toFixed(2)}
          </p>
        )}
      </div>

      {/* Action Button */}
      <div className="absolute top-0 right-0 flex justify-center">
        {modalAction === "addToCart" ? (
          <button
            onClick={handleAddToCart}
            disabled={isProceedDisabled()}
            className="w-12 h-12 bg-primary-600 text-white flex justify-center items-center cursor-pointer"
          >
            {sellingPrice && !error ? (
              <FaArrowRight size={20} />
            ) : (
              <BsCartPlus size={20} />
            )}

            {/* Add to Cart */}
          </button>
        ) : (
          <button
            onClick={handleOrderNow}
            disabled={isProceedDisabled()}
            className="w-12 h-12 bg-primary-600 text-white flex justify-center items-center cursor-pointer"
          >
            {sellingPrice && !error ? (
              <FaArrowRight size={20} />
            ) : (
              <FaTruckArrowRight size={20} />
            )}

            {/* Order Now */}
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="w-12 h-12 bg-danger text-white flex justify-center items-center rounded-r-xl cursor-pointer"
        >
          <IoClose size={24} />
        </button>
      </div>
    </div>
  );
};

export default PricingModal;
