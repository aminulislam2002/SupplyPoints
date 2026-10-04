import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AddressContext } from "../../../providers/AddressProvider/AddressProvider";

const CheckoutForm = ({
  deliveryInfo,
  showWarning,
  handleDeliveryLocationChange,
  handlePaymentMethodChange,
  onSubmit,
  isLoading,
  user,
  totalOrders,
  deliveryPaymentMethod,
  setDeliveryPaymentMethod,
  advanceAmount,
  setAdvanceAmount,
  resellerPrice,
}) => {
  const addresses = useContext(AddressContext);
  const [thanaNames, setThanaNames] = useState([]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // Function to handle zilla change
  const handleZillaChange = (selectedZilla) => {
    const selectedThanaNames = addresses[selectedZilla] || [];
    setThanaNames(selectedThanaNames);
  };

  return (
    <div className="surface col-span-12 p-5 sm:p-6 lg:col-span-7">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-5"
      >
        {/* Name Field */}
        <div className="col-span-12 lg:col-span-6">
          <label className="block mb-1.5 text-base font-semibold font-secondary">
            আপনার নাম
          </label>
          <input
            type="text"
            {...register("name", { required: "true" })}
            placeholder="সম্পূর্ণ নাম লিখুন"
            className="control w-full font-secondary"
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name?.type === "required" && (
            <span className="text-red-500 text-sm mt-1 block font-secondary">
              আপনার নাম লিখতে হবে
            </span>
          )}
        </div>

        {/* Mobile Number Field */}
        <div className="col-span-12 lg:col-span-6">
          <label className="block mb-1.5 text-base font-semibold font-secondary">
            মোবাইল নাম্বার
          </label>
          <div className="control flex w-full items-center justify-start px-4">
            <span className="font-medium whitespace-nowrap">+88</span>
            <input
              type="number"
              min={0}
              {...register("number", {
                required: "মোবাইল নম্বর লিখুন",
                validate: (value) =>
                  /^01[3-9]\d{8}$/.test(value) || "সঠিক মোবাইল নম্বর লিখুন",
              })}
              placeholder="01712 000000"
              className="w-full bg-transparent pl-2 pr-4 focus:outline-none"
              aria-invalid={errors.number ? "true" : "false"}
            />
          </div>
          {errors?.number && (
            <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>
          )}
        </div>

        {/* Delivery Area */}
        <div className="col-span-12">
          <div className="flex justify-start items-center">
            <div className="w-1/2 flex items-center gap-3">
              <input
                type="checkbox"
                name="deliveryArea"
                value={`Inside Dhaka`}
                checked={deliveryInfo.deliveryArea === `Inside Dhaka`}
                onChange={() => handleDeliveryLocationChange(`Inside Dhaka`)}
                className="checkbox checkbox-neutral"
              />
              <label className="text-base font-medium font-secondary">
                ঢাকা সিটির ভিতরে
              </label>
            </div>
            <div className="w-1/2 flex items-center gap-3">
              <input
                type="checkbox"
                name="deliveryArea"
                value={`Outside Dhaka`}
                checked={deliveryInfo.deliveryArea === `Outside Dhaka`}
                onChange={() => handleDeliveryLocationChange(`Outside Dhaka`)}
                className="checkbox checkbox-neutral"
              />
              <label className="text-base font-medium font-secondary">
                ঢাকা সিটির বাহিরে
              </label>
            </div>
          </div>
          {showWarning && (
            <p className="text-red-500 text-sm mt-2.5 block font-secondary">
              ডেলিভারি এলাকা অবশ্যই নির্বাচন করুন
            </p>
          )}
        </div>

        {/* Zilla Field */}
        <div className="col-span-12 lg:col-span-6">
          <label className="block mb-1.5 text-base font-semibold font-secondary">
            আপনার জেলা
          </label>
          <select
            {...register("zilla", { required: "true" })}
            onChange={(e) => handleZillaChange(e.target.value)}
            className="control w-full font-secondary"
            aria-invalid={errors.zilla ? "true" : "false"}
          >
            <option value="">জেলা সিলেক্ট করুন</option>
            {Object.keys(addresses).map((zilla) => (
              <option key={zilla} value={zilla} className="bg-primary-950 ">
                {zilla}
              </option>
            ))}
          </select>
          {errors.zilla?.type === "required" && (
            <span className="text-red-500 text-sm mt-1 block font-secondary">
              জেলা দিতে হবে
            </span>
          )}
        </div>

        {/* Thana Field */}
        <div className="col-span-12 lg:col-span-6">
          <label className="block mb-1.5 text-base font-semibold font-secondary">
            আপনার থানা
          </label>
          <select
            {...register("thana", { required: "true" })}
            className="control w-full font-secondary"
            aria-invalid={errors.thana ? "true" : "false"}
          >
            <option value="">থানা সিলেক্ট করুন</option>
            {thanaNames?.map((thana) => (
              <option key={thana} value={thana} className="bg-primary-950 ">
                {thana}
              </option>
            ))}
          </select>
          {errors.thana?.type === "required" && (
            <span className="text-red-500 text-sm mt-1 block font-secondary">
              থানা দিতে হবে
            </span>
          )}
        </div>

        {/* Address Field */}
        <div className="col-span-12">
          <label className="block mb-1.5 text-base font-semibold font-secondary">
            আপনার বাসার ঠিকানা লিখুন
          </label>
          <textarea
            {...register("address", { required: "true" })}
            placeholder="বাড়ি নম্বর/নাম, রোড, এলাকা/ওয়ার্ড - পোস্ট কোড লিখুন"
            className="control min-h-20 w-full resize-none font-secondary"
            aria-invalid={errors.address ? "true" : "false"}
          />
          {errors.address?.type === "required" && (
            <span className="text-red-500 text-sm mt-1 block font-secondary">
              ঠিকানা দিতে হবে
            </span>
          )}
        </div>

        {/* Message Field */}
        <div className="col-span-12">
          <label className="block mb-1.5 text-base font-semibold font-secondary">
            আপনার নোট (অপশনাল)
          </label>
          <textarea
            {...register("message")}
            placeholder="আপনার কিছু বলার আছে? আমাদের জানান!"
            rows={3}
            className="control w-full resize-none font-secondary"
            aria-invalid={errors.message ? "true" : "false"}
          />
        </div>

        {/* Payment Method Selection */}
        <div className="col-span-12">
          <label className="block mb-2 text-base font-semibold font-secondary">
            পেমেন্ট পদ্ধতি নির্বাচন করুন
          </label>
          <div className="space-y-3">
            {/* Cash On Delivery Option */}
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

            {/* Advanced Payment Option */}
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

              {/* Advanced Payment Amount Input */}
              {deliveryInfo.paymentMethod === "Advanced Payment" &&
                deliveryInfo.deliveryCharge > 0 && (
                  <div className="mt-3 space-y-3 pl-8">
                    {/* Quick Amount Buttons */}
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

                    {/* Amount Input */}
                    <div>
                      <label className="block mb-1 text-sm font-medium font-secondary text-text-secondary">
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
                      <p className="text-xs text-primary-600 mt-1 font-secondary">
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
            <div className="col-span-12">
              <label className="block mb-2 text-base font-semibold font-secondary">
                পেমেন্ট মাধ্যম
              </label>
              <div className="space-y-3">
                {/* Balance Payment Option */}
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

                {/* Manual Payment Option */}
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

        {/* Submit Button */}
        <div className="col-span-12">
          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            {isLoading
              ? "Please Wait..."
              : deliveryInfo.paymentMethod === "Advanced Payment" &&
                  deliveryPaymentMethod === "Manual"
                ? "Proceed to Payment"
                : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
