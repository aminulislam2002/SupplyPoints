import { Link } from "react-router";
import {
  FaUndo,
  FaClock,
  FaBoxOpen,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import usePlatform from "../../../hooks/usePlatform/usePlatform";
import Loader from "../../../components/Loader/Loader";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";

const ReturnsPolicy = () => {
  const lastUpdated = "November 14, 2025";
  const { platform, isPlatformPending } = usePlatform();

  const returnSteps = [
    {
      number: "1",
      title: "Contact Us",
      description:
        "Contact our customer service within 7 days of receiving your order",
      icon: <FaClock className="text-2xl" />,
    },
    {
      number: "2",
      title: "Return Authorization",
      description:
        "Receive return authorization and instructions from our team",
      icon: <FaCheckCircle className="text-2xl" />,
    },
    {
      number: "3",
      title: "Pack the Item",
      description:
        "Pack the item securely in its original packaging with all accessories",
      icon: <FaBoxOpen className="text-2xl" />,
    },
    {
      number: "4",
      title: "Ship the Item",
      description: "Ship the item back to us using our provided shipping label",
      icon: <FaUndo className="text-2xl" />,
    },
  ];

  const eligibleItems = [
    "Products must be unused and in original condition",
    "All original packaging, tags, and accessories must be included",
    "Products must be returned within 7 days of delivery",
    "Items must not be damaged due to misuse or negligence",
    "Proof of purchase (invoice/receipt) must be provided",
  ];

  const nonEligibleItems = [
    "Personalized or custom-made products",
    "Intimate wear, underwear, and swimwear",
    "Beauty and personal care products (opened)",
    "Perishable goods and food items",
    "Digital products and gift cards",
    "Products marked as 'non-returnable' at the time of purchase",
    "Items damaged by the customer",
    "Products returned after 7 days of delivery",
  ];

  if (isPlatformPending) {
    return <Loader />;
  }

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Returns Policy", active: true },
  ];

  return (
    <div className="relative w-full min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-5 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-green-400 to-green-600 text-primary-50 mb-6">
            <FaUndo size={40} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Returns & Exchange Policy
          </h1>
          <p className="text-sm text-primary-600  mt-4">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Return Process Steps */}
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="card p-6 text-center h-full">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-primary-700 to-primary-800 text-primary-50 text-lg lg:text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <div className="mb-4 text-primary-500">{step.icon}</div>
                  <h3 className="text-lg font-semibold  mb-2">{step.title}</h3>
                  <p className="text-sm ">{step.description}</p>
                </div>
                {index < returnSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <FaChevronRight className="text-primary-200 " />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Eligible Items */}
        <div className=" mb-8">
          <div className="card overflow-hidden">
            <div className="surface-muted p-6 border-b border-border-color">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-primary-950 flex items-center justify-center text-green-500 shadow-md">
                  <FaCheckCircle className="text-2xl" />
                </div>
                <h2 className="text-lg lg:text-xl font-bold ">
                  Eligible for Return
                </h2>
              </div>
            </div>
            <div className="p-8">
              <p className=" leading-relaxed mb-6">
                To be eligible for a return, your item must meet the following
                conditions:
              </p>
              <ul className="space-y-3">
                {eligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                    <span className="">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Non-Eligible Items */}
        <div className=" mb-8">
          <div className="card overflow-hidden">
            <div className="surface-muted p-6 border-b border-border-color">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-primary-950 flex items-center justify-center text-red-500 shadow-md">
                  <FaTimesCircle className="text-2xl" />
                </div>
                <h2 className="text-lg lg:text-xl font-bold ">
                  Non-Returnable Items
                </h2>
              </div>
            </div>
            <div className="p-8">
              <p className=" leading-relaxed mb-6">
                The following items cannot be returned or exchanged:
              </p>
              <ul className="space-y-3">
                {nonEligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FaTimesCircle className="text-red-500 mt-1 shrink-0" />
                    <span className="">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Shipping Costs */}
        <div className=" mb-8">
          <div className="surface-muted rounded-xl border border-border-color p-8">
            <h2 className="text-lg lg:text-xl font-bold  mb-4">
              Return Shipping Costs
            </h2>
            <div className="space-y-4 ">
              <p className="leading-relaxed">
                <strong>Defective or Wrong Items:</strong> We will cover the
                return shipping costs and provide a prepaid shipping label.
              </p>
              <p className="leading-relaxed">
                <strong>Change of Mind:</strong> Customer is responsible for
                return shipping costs unless you opt for store credit.
              </p>
              <p className="leading-relaxed">
                <strong>Free Return Shipping:</strong> Available when you choose
                store credit instead of a refund.
              </p>
            </div>
          </div>
        </div>

        {/* Exchanges */}
        <div className=" mb-8">
          <div className="surface-muted rounded-xl border border-border-color p-8">
            <h2 className="text-lg lg:text-xl font-bold  mb-4">Exchanges</h2>
            <p className=" leading-relaxed mb-4">
              We gladly accept exchanges for size or color variations of the
              same product. To exchange an item:
            </p>
            <ul className="space-y-2 ">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Contact customer service within 7 days of delivery</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>
                  Return the original item following our return process
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>
                  We'll ship the replacement item once we receive your return
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Exchanges are subject to product availability</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="">
          <div className="surface-muted rounded-xl border border-border-color p-8 text-center">
            <h2 className="text-lg lg:text-xl font-bold  mb-4">
              Need Help with a Return?
            </h2>
            <p className=" leading-relaxed mb-6">
              Our customer service team is here to help you with any questions
              about returns or exchanges.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={`mailto:${
                  platform?.returnEmail || "returns@yourdomain.com"
                }`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-950  rounded-md font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {platform?.returnEmail || "returns@yourdomain.com"}
              </Link>
              <Link
                to={`tel:${platform?.phoneNumber || "+8801700000000"}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-950 border-2 border-primary-500 text-primary-500 hover:bg-primary-50  rounded-md font-semibold transition-all duration-300"
              >
                {platform?.phoneNumber || "+8801700000000"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicy;

