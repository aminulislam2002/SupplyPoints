import { RiCloseFill, RiWallet3Line, RiBankCardLine } from "react-icons/ri";
import { FaMobileAlt, FaTruck } from "react-icons/fa";

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
      <div className="relative w-full space-y-3">
        {/* Payment Method Selection */}
        <div className="mt-5">
          <label className="mb-2 block text-base font-semibold ">
            পেমেন্ট পদ্ধতি নির্বাচন করুন
          </label>
          <div className="flex flex-col lg:flex-row justify-center items-center gap-2.5">
            {(user?.subscriptionType !== "Free" || totalOrders > 2) && (
              <button
                type="button"
                onClick={() => handlePaymentMethodChange("Cash On Delivery")}
                className={`w-full lg:w-1/2 flex justify-between items-center gap-2 rounded-lg border p-2.5 transition-none cursor-pointer ${
                  deliveryInfo.paymentMethod === "Cash On Delivery"
                    ? "border-success"
                    : "border-border-color bg-card-bg"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      deliveryInfo.paymentMethod === "Cash On Delivery"
                        ? "bg-success text-white"
                        : "border border-border-color text-text-secondary"
                    }`}
                  >
                    <FaTruck size={18} />
                  </div>

                  <p
                    className={`text-xs lg:text-sm font-medium ${
                      deliveryInfo.paymentMethod === "Cash On Delivery"
                        ? "text-primary-400"
                        : "text-text-primary"
                    }`}
                  >
                    ক্যাশ অন ডেলিভারি
                  </p>
                </div>

                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    deliveryInfo.paymentMethod === "Cash On Delivery"
                      ? "border-success bg-success"
                      : "border-border-color bg-card-bg"
                  }`}
                >
                  {deliveryInfo.paymentMethod === "Cash On Delivery" && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
              </button>
            )}

            {/* Advanced Payment */}
            <button
              type="button"
              onClick={() => handlePaymentMethodChange("Advanced Payment")}
              className={`w-full lg:w-1/2 flex items-center justify-between gap-2 rounded-lg border p-2.5 transition-none cursor-pointer ${
                deliveryInfo.paymentMethod === "Advanced Payment"
                  ? "border-success"
                  : "border-border-color bg-card-bg"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    deliveryInfo.paymentMethod === "Advanced Payment"
                      ? "bg-success text-white"
                      : "border border-border-color text-text-secondary"
                  }`}
                >
                  <RiBankCardLine size={18} />
                </div>

                <p
                  className={`text-xs lg:text-sm font-medium ${
                    deliveryInfo.paymentMethod === "Advanced Payment"
                      ? "text-primary-400"
                      : "text-text-primary"
                  }`}
                >
                  অ্যাডভান্স পেমেন্ট
                </p>
              </div>

              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  deliveryInfo.paymentMethod === "Advanced Payment"
                    ? "border-success bg-success"
                    : "border-border-color bg-card-bg"
                }`}
              >
                {deliveryInfo.paymentMethod === "Advanced Payment" && (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Payment Method for Advanced Payment */}
        {deliveryInfo.paymentMethod === "Advanced Payment" &&
          deliveryInfo.deliveryCharge > 0 && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2.5">
                <p className="text-sm font-medium  text-text-secondary">
                  অ্যাডভান্স পরিমাণ (৳)
                </p>

                <input
                  type="number"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                  onBlur={() => {
                    const max = resellerPrice + deliveryInfo.deliveryCharge;

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

                <div className="flex justify-between items-start gap-2">
                  <p className="text-[10px] lg:text-xs font-normal  text-shadow-text-secondary">
                    সর্বনিম্ন: ৳{deliveryInfo.deliveryCharge}
                    {/* | সর্বোচ্চ: ৳ {resellerPrice + deliveryInfo.deliveryCharge} */}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setAdvanceAmount(deliveryInfo.deliveryCharge)
                      }
                      className="btn primary-btn min-h-4 text-xs font-normal"
                    >
                      চার্জ (৳{deliveryInfo.deliveryCharge})
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setAdvanceAmount(
                          resellerPrice + deliveryInfo.deliveryCharge,
                        )
                      }
                      className="btn outline-btn min-h-4 text-xs font-normal"
                    >
                      সম্পূর্ণ (৳
                      {resellerPrice + deliveryInfo.deliveryCharge})
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="mb-2 block text-base font-semibold ">
                  পেমেন্ট মাধ্যম
                </label>

                <div className="flex flex-col lg:flex-row justify-center items-center gap-2.5">
                  {/* Balance */}
                  <button
                    type="button"
                    onClick={() => setDeliveryPaymentMethod("Balance")}
                    className={`w-full lg:w-1/2 flex items-center gap-2 rounded-lg border p-2.5 transition-none cursor-pointer ${
                      deliveryPaymentMethod === "Balance"
                        ? "border-success"
                        : "border-border-color bg-card-bg"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        deliveryPaymentMethod === "Balance"
                          ? "bg-success text-white"
                          : "border border-border-color text-text-secondary"
                      }`}
                    >
                      <RiWallet3Line size={18} />
                    </div>

                    <p
                      className={`text-xs lg:text-sm font-medium text-left ${
                        deliveryPaymentMethod === "Balance"
                          ? "text-primary-400"
                          : "text-text-primary"
                      }`}
                    >
                      ব্যালেন্স <br />{" "}
                      <span className="text-text-secondary">
                        (৳
                        {user?.balance
                          ? user?.balance?.toFixed(2)
                          : "0.00"}{" "}
                        available)
                      </span>
                    </p>
                  </button>

                  {/* Manual / MFS */}
                  <button
                    type="button"
                    onClick={() => setDeliveryPaymentMethod("Manual")}
                    className={`w-full lg:w-1/2 flex items-center gap-2 rounded-lg border p-2.5 transition-none cursor-pointer ${
                      deliveryPaymentMethod === "Manual"
                        ? "border-success"
                        : "border-border-color bg-card-bg"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        deliveryPaymentMethod === "Manual"
                          ? "bg-success text-white"
                          : "border border-border-color text-text-secondary"
                      }`}
                    >
                      <FaMobileAlt size={18} />
                    </div>

                    <p
                      className={`text-xs lg:text-sm font-medium text-left ${
                        deliveryPaymentMethod === "Manual"
                          ? "text-primary-400"
                          : "text-text-primary"
                      }`}
                    >
                      MFS <br />{" "}
                      <span className="text-text-secondary">
                        (BKash/Nagad/Rocket)
                      </span>
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

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

        <button
          type="submit"
          form="checkout-form"
          className="btn primary-btn mt-5 w-full"
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
