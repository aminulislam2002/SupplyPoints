import { Link } from "react-router";
import { FaShieldAlt, FaLock, FaUserShield, FaEnvelope } from "react-icons/fa";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";

const PrivacyPolicy = () => {
  const lastUpdated = "November 14, 2025";

  const sections = [
    {
      icon: <FaUserShield className="text-2xl" />,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "We collect information you provide directly to us, including your name, email address, phone number, shipping address, and payment information when you create an account or place an order.",
        },
        {
          subtitle: "Automatically Collected Information",
          text: "We automatically collect certain information about your device when you use our website, including your IP address, browser type, operating system, and browsing behavior.",
        },
        {
          subtitle: "Cookies and Tracking",
          text: "We use cookies and similar tracking technologies to track activity on our service and hold certain information to improve your experience.",
        },
      ],
    },
    {
      icon: <FaLock className="text-2xl" />,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Order Processing",
          text: "We use your information to process and fulfill your orders, send order confirmations, and provide customer support.",
        },
        {
          subtitle: "Communication",
          text: "We may send you marketing communications about our products, services, and promotions. You can opt-out of these communications at any time.",
        },
        {
          subtitle: "Service Improvement",
          text: "We analyze usage patterns to improve our website, products, and services, and to develop new features and functionality.",
        },
        {
          subtitle: "Security and Fraud Prevention",
          text: "We use your information to protect against fraud, unauthorized transactions, and other illegal activities.",
        },
      ],
    },
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: "Information Sharing",
      content: [
        {
          subtitle: "Service Providers",
          text: "We share your information with third-party service providers who perform services on our behalf, such as payment processing, shipping, and marketing.",
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information if required by law or in response to valid requests by public authorities.",
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.",
        },
      ],
    },
    {
      icon: <FaEnvelope className="text-2xl" />,
      title: "Your Rights and Choices",
      content: [
        {
          subtitle: "Access and Update",
          text: "You can access and update your account information at any time through your account settings.",
        },
        {
          subtitle: "Marketing Opt-Out",
          text: "You can opt-out of receiving marketing emails by clicking the unsubscribe link in any marketing email or by contacting us directly.",
        },
        {
          subtitle: "Data Deletion",
          text: "You can request deletion of your personal information by contacting our customer support team.",
        },
        {
          subtitle: "Cookie Preferences",
          text: "You can control cookies through your browser settings, though this may affect your ability to use certain features of our website.",
        },
      ],
    },
  ];

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Privacy Policy", active: true },
  ];

  return (
    <div className="relative w-full min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-5 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-primary-700 to-primary-800 text-primary-50 mb-6">
            <FaShieldAlt size={40} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold  mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-primary-600  mt-4">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-10">
          <div className="card p-8">
            <h2 className="text-lg lg:text-xl font-bold  mb-4">Introduction</h2>
            <div className="prose prose-primary  max-w-none">
              <p className=" leading-relaxed">
                This Privacy Policy describes how Supply Points ("we," "us," or
                "our") collects, uses, and shares your personal information when
                you visit or make a purchase from our website. By using our
                website, you consent to the collection and use of information in
                accordance with this policy.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className=" space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="card overflow-hidden">
              <div className="surface-muted p-6 border-b border-border-color">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md bg-primary-950 flex items-center justify-center text-primary-500 shadow-md">
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

        {/* Data Security */}
        <div className=" mt-8">
          <div className="alert alert-info p-8">
            <h2 className="text-lg lg:text-xl font-bold  mb-4">
              Data Security
            </h2>
            <p className=" leading-relaxed mb-4">
              We implement appropriate technical and organizational security
              measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. However, no method
              of transmission over the Internet or electronic storage is 100%
              secure.
            </p>
            <p className=" leading-relaxed">
              We use industry-standard SSL encryption to protect sensitive
              information during transmission and store your data on secure
              servers with restricted access.
            </p>
          </div>
        </div>

        {/* Updates Notice */}
        <div className=" mt-8">
          <div className="alert alert-warning p-6">
            <h3 className="text-lg font-semibold  mb-2">Policy Updates</h3>
            <p className=" text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date. We encourage you
              to review this Privacy Policy periodically for any changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
