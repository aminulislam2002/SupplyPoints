import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AddressContext } from "../../../providers/AddressProvider/AddressProvider";

const CheckoutForm = ({
  showWarning,
  handleDeliveryLocationChange,
  onSubmit,
}) => {
  const addresses = useContext(AddressContext);
  const [thanaNames, setThanaNames] = useState([]);
  const [selectedZilla, setSelectedZilla] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // Function to handle zilla change
  const handleZillaChange = (selectedZilla) => {
    const selectedThanaNames = addresses[selectedZilla] || [];
    setSelectedZilla(selectedZilla);
    setThanaNames(selectedThanaNames);
    handleDeliveryLocationChange(selectedZilla);
  };

  return (
    <div className="surface col-span-12 p-5 sm:p-6 lg:col-span-7">
      <form
        id="checkout-form"
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
              <option key={zilla} value={zilla}>
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
            onChange={(e) =>
              handleDeliveryLocationChange(selectedZilla, e.target.value)
            }
            className="control w-full font-secondary"
            aria-invalid={errors.thana ? "true" : "false"}
          >
            <option value="">থানা সিলেক্ট করুন</option>
            {thanaNames?.map((thana) => (
              <option key={thana} value={thana}>
                {thana}
              </option>
            ))}
          </select>
          {errors.thana?.type === "required" && (
            <span className="text-red-500 text-sm mt-1 block font-secondary">
              থানা দিতে হবে
            </span>
          )}
          {showWarning && (
            <span className="text-red-500 text-sm mt-1 block font-secondary">
              জেলা ও থানা নির্বাচন করুন
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
      </form>
    </div>
  );
};

export default CheckoutForm;
