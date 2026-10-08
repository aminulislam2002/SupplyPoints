import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { BsDatabaseFillAdd } from "react-icons/bs";
import {
  FaStore,
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaTelegram,
  FaTelegramPlane,
  FaUsers,
  FaHeadset,
  FaInfoCircle,
  FaSearch,
} from "react-icons/fa";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";
import Input from "../../../../components/FormFileds/Input";
import Textarea from "../../../../components/FormFileds/Textarea";
import usePlatform from "../../../../hooks/usePlatform/usePlatform";
import { MdOutlinePayment } from "react-icons/md";
import Select from "../../../../components/FormFileds/Select";

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const axiosSecure = useAxiosSecure();
  const { platform, isPlatformPending, refetch } = usePlatform();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    if (platform) {
      reset(platform);
    }
  }, [platform, reset]);

  // Update Platform
  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await axiosSecure.put("/platform", data);
      const successMessage =
        res?.data?.message || "Platform updated successfully!";
      refetch();
      await Swal.fire({
        title: successMessage,
        icon: "success",
        timer: 2000,
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPlatformPending) {
    return <Loader />;
  }

  const tabs = [
    { id: "general", label: "General Ifo", icon: FaStore },
    { id: "payment", label: "Payment", icon: MdOutlinePayment },
    { id: "contact", label: "Contact", icon: FaPhone },
    { id: "social", label: "Social Media", icon: FaFacebook },
    { id: "business", label: "Business Info", icon: FaInfoCircle },
    { id: "seo", label: "SEO & Meta", icon: FaSearch },
  ];

  return (
    <div className="space-y-5 p-5 sm:p-6">
      {/* Header */}
      <div className="py-2.5 border-b border-dashed border-border-color mb-6">
        <h3 className="page-title text-lg">Website Settings</h3>
        <p className="text-sm text-primary-600  mt-1">
          Manage your website configuration and information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="pb-5">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-5 border-b border-border-color pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`btn flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-300 ${
                activeTab === tab.id ? "primary-btn" : "outline-btn"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="surface rounded-lg p-5 sm:p-6">
          {/* General Info Tab */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold mb-4 pb-3 border-b border-border-color flex items-center gap-2">
                <FaStore className="text-primary-500" />
                General Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Platform Name"
                  type="text"
                  placeholder="Supply Points"
                  register={register}
                  errors={errors}
                  name="platformName"
                  required={true}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="info@yourdomain.com"
                  register={register}
                  errors={errors}
                  name="emailAddress"
                  required={true}
                />

                <Input
                  label="Phone Number"
                  type="text"
                  placeholder="01700 000000"
                  register={register}
                  errors={errors}
                  name="phoneNumber"
                  required={true}
                />

                <Input
                  label="WhatsApp Number"
                  type="text"
                  placeholder="880 1700 000000"
                  register={register}
                  errors={errors}
                  name="whatsappNumber"
                  required={true}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Textarea
                  label="Address"
                  placeholder="Complete business address"
                  register={register}
                  errors={errors}
                  name="address"
                  required={true}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Google Map"
                  type="url"
                  placeholder="Google Map Embed Link"
                  register={register}
                  errors={errors}
                  name="googleMap"
                  required={false}
                />
              </div>
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === "payment" && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold mb-4 pb-3 border-b border-border-color flex items-center gap-2">
                <FaStore className="text-primary-500" />
                General Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Payment Gateway"
                  placeholder="Select payment gateway"
                  register={register}
                  errors={errors}
                  name="paymentGateway"
                  required={true}
                  options={["Manual", "ClickPay", "StarPay"]}
                />

                <Input
                  label="Bkash Number"
                  type="text"
                  placeholder="01700 000000"
                  register={register}
                  errors={errors}
                  name="bkashNumber"
                  required={true}
                />
                <Input
                  label="Nagad Number"
                  type="text"
                  placeholder="01700 000000"
                  register={register}
                  errors={errors}
                  name="nagadNumber"
                  required={true}
                />
                <Input
                  label="Rocket Number"
                  type="text"
                  placeholder="01700 000000"
                  register={register}
                  errors={errors}
                  name="rocketNumber"
                  required={true}
                />
                <Input
                  label="Account Activation Fee"
                  type="number"
                  placeholder="100"
                  step="1"
                  min="0"
                  register={register}
                  errors={errors}
                  name="accountActivationFee"
                  required={true}
                />
                <Input
                  label="Inside Delivery Charge"
                  type="number"
                  placeholder="100"
                  step="1"
                  min="0"
                  register={register}
                  errors={errors}
                  name="insideDeliveryCharge"
                  required={true}
                />
                <Input
                  label="Outside Delivery Charge"
                  type="number"
                  placeholder="100"
                  step="1"
                  min="0"
                  register={register}
                  errors={errors}
                  name="outsideDeliveryCharge"
                  required={true}
                />
                <Input
                  label="Referral Reward"
                  type="number"
                  placeholder="100"
                  step="1"
                  min="0"
                  register={register}
                  errors={errors}
                  name="referralReward"
                  required={true}
                />
                <Input
                  label="Withdrawal Limit"
                  type="number"
                  placeholder="100"
                  step="1"
                  min="0"
                  register={register}
                  errors={errors}
                  name="minWithdrawalLimit"
                  required={true}
                />
                <Input
                  label="Deposit Limit"
                  type="number"
                  placeholder="100"
                  step="1"
                  min="0"
                  register={register}
                  errors={errors}
                  name="minDepositLimit"
                  required={true}
                />
                <Input
                  label="Deposit Bonus (%)"
                  type="number"
                  placeholder="Example: 50%"
                  step="1"
                  min="0"
                  register={register}
                  errors={errors}
                  name="depositBonusPer"
                  required={true}
                />
                <Input
                  label="Referral Deposit Bonus (%)"
                  type="number"
                  placeholder="Example: 10%"
                  step="1"
                  min="0"
                  register={register}
                  errors={errors}
                  name="referralDepositBonusPer"
                  required={true}
                />
                <Input
                  label="Referral Order Bonus (%)"
                  type="number"
                  placeholder="Example: 5%"
                  step="1"
                  min="0"
                  register={register}
                  errors={errors}
                  name="referralOrderBonusPer"
                  required={true}
                />
                <Input
                  label="Packaging Charge"
                  type="number"
                  placeholder="100"
                  step="1"
                  min="0"
                  register={register}
                  errors={errors}
                  name="packagingCharge"
                  required={true}
                />
                <Input
                  label="COD Charge (%)"
                  type="number"
                  placeholder="100"
                  step="1"
                  min="0"
                  register={register}
                  errors={errors}
                  name="codCharge"
                  required={true}
                />
              </div>
            </div>
          )}

          {/* Contact Details Tab */}
          {activeTab === "contact" && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold mb-4 pb-3 border-b border-border-color flex items-center gap-2">
                <FaEnvelope className="text-primary-500" />
                Contact Email Addresses
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="Telegram Channel"
                    type="url"
                    placeholder="https://t.me/yourchannel"
                    register={register}
                    errors={errors}
                    name="telegramChannel"
                    required={false}
                  />
                  <FaTelegramPlane
                    className="absolute right-3 top-11 text-blue-500"
                    size={20}
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Telegram Support"
                    type="url"
                    placeholder="https://t.me/yoursupport"
                    register={register}
                    errors={errors}
                    name="telegramSupport"
                    required={false}
                  />
                  <FaHeadset
                    className="absolute right-3 top-11 text-primary-500"
                    size={20}
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Telegram Group"
                    type="url"
                    placeholder="https://t.me/yourgroup"
                    register={register}
                    errors={errors}
                    name="telegramGroup"
                    required={false}
                  />
                  <FaUsers
                    className="absolute right-3 top-11 text-primary-500"
                    size={20}
                  />
                </div>

                <Input
                  label="Support Email"
                  type="email"
                  placeholder="support@yourdomain.com"
                  register={register}
                  errors={errors}
                  name="supportEmail"
                  required={false}
                />

                <Input
                  label="Orders Email"
                  type="email"
                  placeholder="orders@yourdomain.com"
                  register={register}
                  errors={errors}
                  name="ordersEmail"
                  required={false}
                />

                <Input
                  label="Return Email"
                  type="email"
                  placeholder="returns@yourdomain.com"
                  register={register}
                  errors={errors}
                  name="returnEmail"
                  required={false}
                />
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === "social" && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold mb-4 pb-3 border-b border-border-color flex items-center gap-2">
                <FaFacebook className="text-primary-500" />
                Social Media Links
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="Facebook"
                    type="url"
                    placeholder="https://facebook.com/yourpage"
                    register={register}
                    errors={errors}
                    name="facebook"
                    required={false}
                  />
                  <FaFacebook
                    className="absolute right-3 top-11 text-blue-600"
                    size={20}
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Instagram"
                    type="url"
                    placeholder="https://instagram.com/yourprofile"
                    register={register}
                    errors={errors}
                    name="instagram"
                    required={false}
                  />
                  <FaInstagram
                    className="absolute right-3 top-11 text-pink-600"
                    size={20}
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Twitter"
                    type="url"
                    placeholder="https://twitter.com/yourhandle"
                    register={register}
                    errors={errors}
                    name="twitter"
                    required={false}
                  />
                  <FaTwitter
                    className="absolute right-3 top-11 text-blue-400"
                    size={20}
                  />
                </div>

                <div className="relative">
                  <Input
                    label="LinkedIn"
                    type="url"
                    placeholder="https://linkedin.com/company/yourcompany"
                    register={register}
                    errors={errors}
                    name="linkedin"
                    required={false}
                  />
                  <FaLinkedin
                    className="absolute right-3 top-11 text-blue-700"
                    size={20}
                  />
                </div>

                <div className="relative">
                  <Input
                    label="YouTube"
                    type="url"
                    placeholder="https://youtube.com/yourchannel"
                    register={register}
                    errors={errors}
                    name="youtube"
                    required={false}
                  />
                  <FaYoutube
                    className="absolute right-3 top-11 text-red-600"
                    size={20}
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Telegram"
                    type="url"
                    placeholder="https://t.me/yourchannel"
                    register={register}
                    errors={errors}
                    name="telegram"
                    required={false}
                  />
                  <FaTelegram
                    className="absolute right-3 top-11 text-blue-500"
                    size={20}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Business Info Tab */}
          {activeTab === "business" && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold mb-4 pb-3 border-b border-border-color flex items-center gap-2">
                <FaInfoCircle className="text-primary-500" />
                Business Information
              </h4>

              <div className="grid grid-cols-1 gap-4">
                <Textarea
                  label="Description"
                  placeholder="Brief description of your business"
                  register={register}
                  errors={errors}
                  name="description"
                  required={false}
                  rows={4}
                />

                <Textarea
                  label="Notice"
                  placeholder="Enter notice text here"
                  register={register}
                  errors={errors}
                  name="notice"
                  required={false}
                  rows={4}
                />

                <Textarea
                  label="Our Story"
                  placeholder="Tell your brand story"
                  register={register}
                  errors={errors}
                  name="ourStory"
                  required={false}
                  rows={5}
                />

                <Textarea
                  label="Our Mission"
                  placeholder="What is your mission?"
                  register={register}
                  errors={errors}
                  name="ourMission"
                  required={false}
                  rows={4}
                />

                <Textarea
                  label="Our Vision"
                  placeholder="What is your vision?"
                  register={register}
                  errors={errors}
                  name="ourVision"
                  required={false}
                  rows={4}
                />

                <Textarea
                  label="Marquee Text"
                  placeholder="Enter marquee text here"
                  register={register}
                  errors={errors}
                  name="marqueeText"
                  required={false}
                  rows={4}
                />

                <Input
                  label="YouTube Video"
                  type="url"
                  placeholder="https://www.youtube.com/embed/ww6N-jyjsbw?si=P2BSSM1n73I4YXj2"
                  register={register}
                  errors={errors}
                  name="youtubeVideo"
                  required={false}
                />

                <Input
                  label="YouTube (Reselling)"
                  type="url"
                  placeholder="https://www.youtube.com/embed/ww6N-jyjsbw?si=P2BSSM1n73I4YXj2"
                  register={register}
                  errors={errors}
                  name="resellingYoutube"
                  required={false}
                />

                <Input
                  label="YouTube (Promotion)"
                  type="url"
                  placeholder="https://www.youtube.com/embed/ww6N-jyjsbw?si=P2BSSM1n73I4YXj2"
                  register={register}
                  errors={errors}
                  name="promotionYoutube"
                  required={false}
                />

                <Input
                  label="YouTube (Marketing)"
                  type="url"
                  placeholder="https://www.youtube.com/embed/ww6N-jyjsbw?si=P2BSSM1n73I4YXj2"
                  register={register}
                  errors={errors}
                  name="marketingYoutube"
                  required={false}
                />
              </div>
            </div>
          )}

          {/* SEO & Meta Tab */}
          {activeTab === "seo" && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold mb-4 pb-3 border-b border-border-color flex items-center gap-2">
                <FaSearch className="text-primary-500" />
                SEO & Meta Information
              </h4>

              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Meta Title"
                  type="text"
                  placeholder="Supply Points - Your Online Shopping Destination"
                  register={register}
                  errors={errors}
                  name="metaTitle"
                  required={false}
                />

                <Textarea
                  label="Meta Description"
                  placeholder="Descriptions for search engines (150-160 characters)"
                  register={register}
                  errors={errors}
                  name="metaDescription"
                  required={false}
                  rows={3}
                />

                <Textarea
                  label="Meta Keywords"
                  placeholder="keyword1, keyword2, keyword3"
                  register={register}
                  errors={errors}
                  name="metaKeywords"
                  required={false}
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={() => reset()}
            className="btn secondary-btn w-full sm:w-auto"
          >
            Reset Changes
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn primary-btn w-full sm:w-auto"
          >
            <BsDatabaseFillAdd size={18} />
            {isLoading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
