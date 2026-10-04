import { Link } from "react-router";
import {
  FaFileContract,
  FaUserCheck,
  FaShoppingCart,
  FaGavel,
  FaExclamationTriangle,
} from "react-icons/fa";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";

const TermsConditions = () => {
  const lastUpdated = "November 14, 2025";

  const sections = [
    {
      icon: <FaUserCheck className="text-2xl" />,
      title: "Account Terms",
      content: [
        {
          subtitle: "Account Creation",
          text: "You must be at least 18 years old to create an account and make purchases on Supply Points. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
        },
        {
          subtitle: "Account Responsibilities",
          text: "You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and agree not to disclose it to any third party.",
        },
        {
          subtitle: "Account Termination",
          text: "We reserve the right to suspend or terminate your account at any time if we believe you have violated these Terms and Conditions or engaged in fraudulent or illegal activities.",
        },
      ],
    },
    {
      icon: <FaShoppingCart className="text-2xl" />,
      title: "Orders and Payments",
      content: [
        {
          subtitle: "Order Acceptance",
          text: "All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including product availability, errors in pricing, or suspected fraud.",
        },
        {
          subtitle: "Pricing",
          text: "All prices are displayed in Bangladeshi Taka (BDT) and are subject to change without notice. We strive to display accurate pricing information, but errors may occur. If we discover a pricing error, we will notify you and give you the option to cancel or proceed with the correct price.",
        },
        {
          subtitle: "Payment Methods",
          text: "We accept various payment methods including credit/debit cards, mobile banking (Bkash, Nagad, Rocket), and cash on delivery. Payment must be received before we process your order for shipment.",
        },
        {
          subtitle: "Order Confirmation",
          text: "You will receive an order confirmation email once your order has been placed. This confirmation does not constitute acceptance of your order. Acceptance occurs when we ship your products.",
        },
      ],
    },
    {
      icon: <FaGavel className="text-2xl" />,
      title: "Product Information and Availability",
      content: [
        {
          subtitle: "Product Descriptions",
          text: "We attempt to be as accurate as possible in product descriptions, images, and specifications. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.",
        },
        {
          subtitle: "Availability",
          text: "All products are subject to availability. We will notify you as soon as possible if a product you ordered is out of stock or discontinued.",
        },
        {
          subtitle: "Product Colors",
          text: "We have made every effort to display the colors of our products as accurately as possible. However, the actual color you see will depend on your monitor, and we cannot guarantee that your display will accurately reflect the product color.",
        },
      ],
    },
    {
      icon: <FaFileContract className="text-2xl" />,
      title: "Intellectual Property",
      content: [
        {
          subtitle: "Ownership",
          text: "All content on this website, including text, graphics, logos, images, and software, is the property of Supply Points or its content suppliers and is protected by international copyright and trademark laws.",
        },
        {
          subtitle: "Limited License",
          text: "You are granted a limited, non-exclusive, non-transferable license to access and use the website for personal, non-commercial purposes. You may not reproduce, distribute, modify, or create derivative works without our express written consent.",
        },
        {
          subtitle: "Prohibited Uses",
          text: "You may not use our website or content for any illegal purpose or in violation of any local, state, national, or international law. Unauthorized use may result in civil and criminal penalties.",
        },
      ],
    },
    {
      icon: <FaExclamationTriangle className="text-2xl" />,
      title: "Limitation of Liability",
      content: [
        {
          subtitle: "Disclaimer",
          text: "Our website and all products and services are provided 'as is' without any warranties, express or implied. We do not guarantee that the website will be uninterrupted, secure, or error-free.",
        },
        {
          subtitle: "Liability Limits",
          text: "To the maximum extent permitted by law, Supply Points shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the website or products purchased.",
        },
        {
          subtitle: "Maximum Liability",
          text: "Our total liability for any claims arising from your use of the website or purchase of products shall not exceed the amount you paid for the product or service in question.",
        },
      ],
    },
  ];

  const prohibitedActivities = [
    "Using the website for any unlawful purpose",
    "Attempting to gain unauthorized access to our systems",
    "Interfering with the proper functioning of the website",
    "Transmitting viruses, malware, or harmful code",
    "Engaging in any form of automated data collection (scraping, bots)",
    "Impersonating another person or entity",
    "Posting false, misleading, or defamatory content",
    "Violating the intellectual property rights of others",
  ];

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Terms & Conditions", active: true },
  ];

  return (
    <div className="relative w-full min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-5 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-blue-400 to-blue-600 text-primary-50 mb-6">
            <FaFileContract size={40} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold  mb-4">
            Terms & Conditions
          </h1>
          <p className="text-sm text-primary-600  mt-4">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Agreement Notice */}
        <div className="mb-10">
          <div className="alert alert-info p-8">
            <h2 className="text-lg lg:text-xl font-bold  mb-4">
              Agreement to Terms
            </h2>
            <div className="prose prose-primary  max-w-none">
              <p className=" leading-relaxed">
                By accessing and using Supply Points's website and services, you
                acknowledge that you have read, understood, and agree to be
                bound by these Terms and Conditions. If you do not agree with
                any part of these terms, you must not use our website or
                services.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className=" space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="card overflow-hidden">
              <div className="surface-muted p-6 border-b border-border-color">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md bg-primary-950 flex items-center justify-center text-blue-500 shadow-md">
                    {section.icon}
                  </div>
                  <h2 className="text-lg lg:text-xl font-bold ">
                    {section.title}
                  </h2>
                </div>
              </div>
              <div className="p-8 space-y-6">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <h3 className="text-lg font-semibold  mb-3">
                      {item.subtitle}
                    </h3>
                    <p className=" leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Prohibited Activities */}
        <div className=" mt-8">
          <div className="card overflow-hidden">
            <div className="surface-muted p-6 border-b border-border-color">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-primary-950 flex items-center justify-center text-red-500 shadow-md">
                  <FaExclamationTriangle className="text-2xl" />
                </div>
                <h2 className="text-lg lg:text-xl font-bold ">
                  Prohibited Activities
                </h2>
              </div>
            </div>
            <div className="p-8">
              <p className=" leading-relaxed mb-6">
                You are prohibited from engaging in the following activities on
                our website:
              </p>
              <ul className="space-y-3">
                {prohibitedActivities.map((activity, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0"></div>
                    <span className="">{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Governing Law */}
        <div className=" mt-8">
          <div className="surface-muted rounded-xl border border-border-color p-8">
            <h2 className="text-lg lg:text-xl font-bold  mb-4">
              Governing Law
            </h2>
            <p className=" leading-relaxed">
              These Terms and Conditions shall be governed by and construed in
              accordance with the laws of Bangladesh. Any disputes arising from
              these terms shall be subject to the exclusive jurisdiction of the
              courts of Dhaka, Bangladesh.
            </p>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className=" mt-8">
          <div className="alert alert-warning p-6">
            <h3 className="text-lg font-semibold  mb-2">Changes to Terms</h3>
            <p className=" text-sm leading-relaxed">
              We reserve the right to modify these Terms and Conditions at any
              time. Changes will be effective immediately upon posting to the
              website. Your continued use of the website after any changes
              constitutes acceptance of the new Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
