import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { BsCartPlus } from "react-icons/bs";
import { FaTruckArrowRight } from "react-icons/fa6";

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
        setError(`Selling price must be at least ৳${product.sellingPrice}`);
      } else {
        setError(`Selling price must be at least ৳${product.price}`);
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
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full relative">
        <div className="modal-surface rounded-b-none p-5">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="btn btn-danger absolute right-4 top-4 min-h-8 rounded-full p-1"
          >
            <IoClose size={24} />
          </button>

          {/* Modal Header */}
          <h2 className="text-xl font-semibold mb-4">Set Selling Price</h2>
        </div>

        <div className="modal-surface rounded-t-none border-t-0 p-5">
          {/* Product Info */}
          <div className="text-sm space-y-3 pb-5 border-b border-border-color mb-5">
            <p>
              Product Price:{" "}
              <span className="font-semibold">৳{product?.price}</span>
            </p>
            {product?.sellingPrice && (
              <p>
                Fixed Selling Price:{" "}
                <span className="font-semibold text-red-600">
                  ৳{product?.sellingPrice}
                </span>
              </p>
            )}
            {product?.suggestedPrice && (
              <p>
                Suggested Price:{" "}
                <span className="font-semibold text-green-600">
                  ৳{product?.suggestedPrice}
                </span>
              </p>
            )}
          </div>

          {/* Selling Price Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Your Selling Price (৳)
            </label>
            <input
              type="number"
              min={minimumPrice}
              value={sellingPrice}
              onChange={(e) => handleSellingPriceChange(e.target.value)}
              placeholder={`At least ৳${minimumPrice}`}
              className="control w-full"
            />

            {error && (
              <p className="alert alert-danger my-4 p-2.5">
                {error}
              </p>
            )}
          </div>

          {/* Profit Display */}
          {sellingPrice && !error && (
            <div className="alert alert-success mb-4 p-2.5">
              <p className="text-sm">
                <span className="font-semibold">
                  Your Profit: ৳{calculateProfit().toFixed(2)}
                </span>
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center">
            {modalAction === "addToCart" ? (
              <button
                onClick={handleAddToCart}
                disabled={isProceedDisabled()}
                className="btn btn-primary h-12 w-full"
              >
                <BsCartPlus size={16} />
                Add to Cart
              </button>
            ) : (
              <button
                onClick={handleOrderNow}
                disabled={isProceedDisabled()}
                className="btn btn-primary h-12 w-full"
              >
                <FaTruckArrowRight size={16} />
                Order Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
