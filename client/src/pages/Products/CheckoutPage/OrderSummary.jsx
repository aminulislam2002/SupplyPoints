import { RiCloseFill } from "react-icons/ri";

const OrderSummary = ({
  products,
  deliveryInfo,
  resellerPrice,
  advanceAmount,
  handlePaymentMethodChange,
  user,
  totalOrders,
  deliveryPaymentMethod,
  setDeliveryPaymentMethod,
  setAdvanceAmount,
  isLoading,
}) => {
  return (
    <div className="surface col-span-12 p-5 sm:p-6 lg:col-span-5">
      {products.length > 0 &&
        products.map((product, index) => (
          <div key={index}>
            {/* Product Details */}
            <div className="relative w-full h-full flex justify-start items-start gap-2.5 mb-5">
              <img
                src={import.meta.env.VITE_IMAGE_URL + product?.thumbnail}
                alt={product?.title}
                className="h-28 w-24 rounded-lg object-cover"
              />

              <div className="relative w-full h-full space-y-1.5">
                {/* Product Title */}
                <h3 className="text-base font-primary font-medium line-clamp-1">
                  {product?.title}
                </h3>

                {/* Pricing Part */}
                <div className="flex justify-start items-center gap-2.5">
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
                  <div className="flex flex-wrap gap-2 text-sm font-primary">
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

                {/* Profit */}
                <div className="badge badge-success min-h-8 rounded-md">
                  Profit: ৳{product?.profit}
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Enhanced Reseller Price Breakdown */}
      <div className="surface-muted relative w-full space-y-3 p-4">
        {/* Selling Price */}
        <div className="flex justify-between items-center font-primary text-sm font-medium">
          <span>Sale Price</span>
          <span className="font-bold">৳{resellerPrice.toFixed(2)}</span>
        </div>

        {/* Delivery Charge */}
        <div className="flex justify-between items-center font-primary text-sm font-medium">
          <span>Delivery Charge</span>
          <span className="text-teal-500">
            ৳ {deliveryInfo?.deliveryCharge.toFixed(2)}
          </span>
        </div>
        {/* Packaging Charge */}
        {/* <div className="flex justify-between items-center font-primary text-sm font-medium">
          <span>Packaging Charge</span>
          <span className="text-red-500">
            - ৳{deliveryInfo?.packagingCharge.toFixed(2)}
          </span>
        </div> */}
        {/* COD Charge */}
        {/* <div className="flex justify-between items-center font-primary text-sm font-medium">
          <span>COD Charge</span>
          <span className="text-yellow-500"> - ৳{codCharge.toFixed(2)}</span>
        </div> */}

        {/* Profit */}
        {/* <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-green-500 ">Your Profit</span>
          <div className="text-right">
            <span className="text-green-500  font-semibold">
              ৳{netProfit.toFixed(2)}
            </span>
          </div>
        </div> */}

        {/* Advance Payment */}
        {advanceAmount > 0 && (
          <div className="flex justify-between items-center font-primary text-sm font-medium">
            <span className="text-green-500">Advance Payment</span>
            <span className="text-green-500 font-semibold">
              ৳{advanceAmount.toFixed(2)}
            </span>
          </div>
        )}

        <hr className="border-border-color" />
        {/* Final Total */}
        <div className="flex items-center justify-between rounded-lg bg-primary-100 p-3 text-lg font-bold">
          <span className="text-primary-800 ">
            {advanceAmount > 0 ? "Due at Delivery" : "Customer Pays"}
          </span>
          <span className="text-primary-800 ">
            ৳
            {(
              resellerPrice +
              deliveryInfo.deliveryCharge -
              advanceAmount
            ).toFixed(2)}
          </span>
        </div>

        {/* Payment Method Selection */}
        <div className="mt-5">
          <label className="mb-2 block text-base font-semibold font-secondary">
            পেমেন্ট পদ্ধতি নির্বাচন করুন
          </label>
          <div className="space-y-3">
            {(user?.subscriptionType !== "Free" || totalOrders > 2) && (
              <div
                className={`flex items-center gap-3 rounded-lg border p-3 ${
                  deliveryInfo.paymentMethod === "Cash On Delivery"
                    ? "border-warning bg-amber-50"
                    : "border-border-color bg-section-bg"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash On Delivery"
                  checked={deliveryInfo.paymentMethod === "Cash On Delivery"}
                  onChange={() => handlePaymentMethodChange("Cash On Delivery")}
                  className="radio radio-warning"
                />
                <label className="text-base font-medium font-secondary text-amber-800">
                  ক্যাশ অন ডেলিভারি
                </label>
              </div>
            )}

            <div
              className={`rounded-lg border p-3 ${
                deliveryInfo.paymentMethod === "Advanced Payment"
                  ? "border-info bg-blue-50"
                  : "border-border-color bg-section-bg"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Advanced Payment"
                  checked={deliveryInfo.paymentMethod === "Advanced Payment"}
                  onChange={() => handlePaymentMethodChange("Advanced Payment")}
                  className="radio radio-primary"
                />
                <label className="text-base font-medium font-secondary text-blue-800">
                  অ্যাডভান্স পেমেন্ট
                </label>
              </div>

              {deliveryInfo.paymentMethod === "Advanced Payment" &&
                deliveryInfo.deliveryCharge > 0 && (
                  <div className="mt-3 space-y-3 pl-8">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setAdvanceAmount(deliveryInfo.deliveryCharge)
                        }
                        className="btn btn-secondary min-h-9 px-3 py-1.5 text-xs"
                      >
                        ডেলিভারি চার্জ (৳{deliveryInfo.deliveryCharge})
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setAdvanceAmount(
                            resellerPrice + deliveryInfo.deliveryCharge,
                          )
                        }
                        className="btn btn-outline min-h-9 px-3 py-1.5 text-xs"
                      >
                        সম্পূর্ণ পেমেন্ট (৳
                        {resellerPrice + deliveryInfo.deliveryCharge})
                      </button>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium font-secondary text-text-secondary">
                        অ্যাডভান্স পরিমাণ (৳)
                      </label>
                      <input
                        type="number"
                        value={advanceAmount}
                        onChange={(e) =>
                          setAdvanceAmount(Number(e.target.value))
                        }
                        onBlur={() => {
                          const max =
                            resellerPrice + deliveryInfo.deliveryCharge;
                          if (advanceAmount < deliveryInfo.deliveryCharge) {
                            setAdvanceAmount(deliveryInfo.deliveryCharge);
                          } else if (advanceAmount > max) {
                            setAdvanceAmount(max);
                          }
                        }}
                        min={deliveryInfo.deliveryCharge}
                        max={resellerPrice + deliveryInfo.deliveryCharge}
                        className="control w-full px-4 text-text-secondary"
                      />
                      <p className="mt-1 text-xs text-primary-600 font-secondary">
                        সর্বনিম্ন: ৳{deliveryInfo.deliveryCharge} | সর্বোচ্চ: ৳
                        {resellerPrice + deliveryInfo.deliveryCharge}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Payment Method for Advanced Payment */}
        {deliveryInfo.paymentMethod === "Advanced Payment" &&
          deliveryInfo.deliveryCharge > 0 && (
            <div className="mt-5">
              <label className="mb-2 block text-base font-semibold font-secondary">
                পেমেন্ট মাধ্যম
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg border border-primary-200 bg-primary-50 p-3">
                  <input
                    type="radio"
                    name="deliveryPayment"
                    value="Balance"
                    checked={deliveryPaymentMethod === "Balance"}
                    onChange={() => setDeliveryPaymentMethod("Balance")}
                    className="radio radio-success"
                  />
                  <div className="flex-1">
                    <label className="text-base font-medium text-green-800">
                      ব্যালেন্স থেকে কাটুন (৳
                      {user?.balance?.toFixed(2)} available)
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <input
                    type="radio"
                    name="deliveryPayment"
                    value="Manual"
                    checked={deliveryPaymentMethod === "Manual"}
                    onChange={() => setDeliveryPaymentMethod("Manual")}
                    className="radio radio-primary"
                  />
                  <div className="flex-1">
                    <label className="text-base font-medium text-blue-800">
                      ম্যানুয়াল পেমেন্ট (BKash/Nagad/Rocket)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

        <button
          type="submit"
          form="checkout-form"
          className="btn btn-primary mt-5 w-full"
          disabled={isLoading}
        >
          {isLoading
            ? "Please Wait..."
            : deliveryInfo.paymentMethod === "Advanced Payment" &&
                deliveryPaymentMethod === "Manual"
              ? "Proceed to Payment"
              : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
