import { Link } from "react-router";
import {
  FaHeadset,
  FaQuestionCircle,
  FaUndo,
  FaLock,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaClock,
} from "react-icons/fa";
import Loader from "../../components/Loader/Loader";
import usePlatform from "../../hooks/usePlatform/usePlatform";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

const SupportCenter = () => {
  const { platform, isPlatformPending } = usePlatform();

  const contactMethods = [
    {
      icon: <FaPhoneAlt className="text-3xl" />,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      contact: platform?.phoneNumber || "+8801700000000",
      href: `tel:${platform?.phoneNumber || "+8801700000000"}`,
      color: "text-blue-500",
      bgColor: "bg-blue-50 ",
      available: "9 AM - 9 PM (Daily)",
    },
    {
      icon: <FaEnvelope className="text-3xl" />,
      title: "Email Support",
      description: "Send us your queries anytime",
      contact: platform?.supportEmail || "support@yourdomain.com",
      href: `mailto:${platform?.supportEmail || "support@yourdomain.com"}`,
      color: "text-green-500",
      bgColor: "bg-green-50 ",
      available: "Response within 24 hours",
    },
    {
      icon: <FaWhatsapp className="text-3xl" />,
      title: "WhatsApp Chat",
      description: "Chat with our support team",
      contact: platform?.whatsappNumber || "+8801700000000",
      href: `https://wa.me/${platform?.whatsappNumber || "8801700000000"}`,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 ",
      available: "9 AM - 9 PM (Daily)",
    },
  ];

  if (isPlatformPending) {
    return <Loader></Loader>;
  }

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Support Center", active: true },
  ];

  return (
    <div className="relative w-full min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-5 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-700 text-primary-50 mb-6">
            <FaHeadset size={40} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            How Can We Help You?
          </h1>
          <p className="max-w-2xl mx-auto">
            Welcome to Supply Points Support Center. Find answers to common
            questions or contact our support team.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="card p-5 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">24/7</div>
            <p className="text-sm">Customer Support Available</p>
          </div>
          <div className="card p-5 text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              &lt;1hr
            </div>
            <p className="text-sm">Average Response Time</p>
          </div>
          <div className="card p-5 text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">98%</div>
            <p className="text-sm">Customer Satisfaction Rate</p>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8">
            Still Need Help? Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <Link
                key={index}
                to={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  method.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="card p-8 text-center hover:-translate-y-1 transition-transform duration-300"
              >
                <div
                  className={`${method.bgColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <div className={method.color}>{method.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                <p className="text-sm mb-4">{method.description}</p>
                <p className={`font-semibold ${method.color} mb-2`}>
                  {method.contact}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-primary-600">
                  <FaClock />
                  <span>{method.available}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="card p-8">
          <h2 className="text-lg lg:text-xl font-bold mb-4 text-center">
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/privacy-policy"
              className="surface-muted flex items-center gap-3 p-4 rounded-md hover:shadow-md transition-all duration-300"
            >
              <FaLock className="text-primary-500 text-xl" />
              <div>
                <h4 className="font-semibold text-sm">Privacy Policy</h4>
                <p className="text-xs">How we protect your data</p>
              </div>
            </Link>
            <Link
              to="/terms-conditions"
              className="surface-muted flex items-center gap-3 p-4 rounded-md hover:shadow-md transition-all duration-300"
            >
              <FaQuestionCircle className="text-primary-500 text-xl" />
              <div>
                <h4 className="font-semibold text-sm">Terms & Conditions</h4>
                <p className="text-xs">Our terms of service</p>
              </div>
            </Link>
            <Link
              to="/returns-policy"
              className="surface-muted flex items-center gap-3 p-4 rounded-md hover:shadow-md transition-all duration-300"
            >
              <FaUndo className="text-primary-500 text-xl" />
              <div>
                <h4 className="font-semibold text-sm">Returns Policy</h4>
                <p className="text-xs">Easy returns & refunds</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;
