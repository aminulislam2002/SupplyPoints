import { FaShippingFast, FaLock, FaUndo, FaHeadset } from "react-icons/fa";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaShippingFast size={20} />,
      title: "Fast Delivery",
      description:
        "Free shipping on orders over ৳1000. Get your products delivered within 3-7 days.",
      color: "from-blue-400 to-blue-600",
      bgColor:
        "from-blue-50 to-blue-100  ",
    },
    {
      icon: <FaLock size={20} />,
      title: "Secure Payment",
      description:
        "100% secure payment with SSL encryption. Multiple payment options available.",
      color: "from-green-400 to-green-600",
      bgColor:
        "from-green-50 to-green-100  ",
    },
    {
      icon: <FaUndo size={20} />,
      title: "Easy Returns",
      description:
        "7-day return policy. Hassle-free returns and refunds for your peace of mind.",
      color: "from-orange-400 to-orange-600",
      bgColor:
        "from-orange-50 to-orange-100  ",
    },
    {
      icon: <FaHeadset size={20} />,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support via phone, email, and WhatsApp chat.",
      color: "from-purple-400 to-purple-600",
      bgColor:
        "from-purple-50 to-purple-100  ",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feature, index) => (
          <div
            key={index}
            className="card group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-300"
          >
            {/* Icon */}
            <div className="flex justify-start items-center gap-5 mb-5">
              <div
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary-200 bg-primary-50 text-primary-700 transition-transform duration-300 group-hover:scale-105"
              >
                {feature.icon}
              </div>

              <h3 className="text-lg font-bold  group-hover:text-primary-500 transition-colors duration-300">
                {feature.title}
              </h3>
            </div>

            {/* Content */}
            <p className="text-sm font-normal leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
