import { Link } from "react-router";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaHeadset,
  FaQuestionCircle,
  FaShoppingBag,
  FaYoutube,
  FaTelegram,
} from "react-icons/fa";
import usePlatform from "../../hooks/usePlatform/usePlatform";
import Loader from "../../components/Loader/Loader";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

const ContactUs = () => {
  const { platform, isPlatformPending } = usePlatform();

  const contactInfo = [
    {
      icon: <FaPhoneAlt className="text-3xl" />,
      title: "Phone",
      details: [platform?.phoneNumber || "+880 1700 0000"],
      description: "Mon-Sat: 9 AM - 9 PM",
      color: "from-blue-400 to-blue-600",
      href: `tel:${platform?.phoneNumber}`,
    },
    {
      icon: <FaEnvelope className="text-3xl" />,
      title: "Email",
      details: [platform?.emailAddress || "support@yourdomain.com"],
      description: "24/7 Email Support",
      color: "from-green-400 to-green-600",
      href: `mailto:${platform?.emailAddress}`,
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl" />,
      title: "Address",
      details: [platform?.address || "123 Shopping Street, Dhaka 1205"],
      description: "Visit our office",
      color: "from-purple-400 to-purple-600",
      href: "https://maps.google.com",
    },
    {
      icon: <FaWhatsapp className="text-3xl" />,
      title: "WhatsApp",
      details: [platform?.whatsappNumber || "+880 1700 0000"],
      description: "Chat with us instantly",
      color: "from-emerald-400 to-emerald-600",
      href: `https://wa.me/${platform?.whatsappNumber}`,
    },
  ];

  const departments = [
    {
      icon: <FaHeadset className="text-2xl" />,
      title: "Customer Support",
      email: platform?.supportEmail || "support@yourdomain.com",
      description: "For general inquiries and assistance",
      color: "text-blue-500",
    },
    {
      icon: <FaShoppingBag className="text-2xl" />,
      title: "Order & Delivery",
      email: platform?.ordersEmail || "orders@yourdomain.com",
      description: "Track orders, delivery issues",
      color: "text-green-500",
    },
    {
      icon: <FaQuestionCircle className="text-2xl" />,
      title: "Returns & Refunds",
      email: platform?.returnEmail || "returns@yourdomain.com",
      description: "Return requests and refund status",
      color: "text-orange-500",
    },
  ];

  const socialLinks = [
    {
      icon: <FaFacebookF size={20} />,
      url: platform?.facebook || "https://facebook.com",
      label: "Facebook",
      color: "bg-blue-600",
      isActive: platform?.facebook ? true : false,
    },
    {
      icon: <FaInstagram size={20} />,
      url: platform?.instagram || "https://instagram.com",
      label: "Instagram",
      color: "bg-primary-600",
      isActive: platform?.instagram ? true : false,
    },
    {
      icon: <FaTwitter size={20} />,
      url: platform?.twitter || "https://twitter.com",
      label: "Twitter",
      color: "bg-blue-400",
      isActive: platform?.twitter ? true : false,
    },
    {
      icon: <FaYoutube size={20} />,
      url: platform?.youtube || "https://youtube.com",
      label: "YouTube",
      color: "bg-red-600",
      isActive: platform?.youtube ? true : false,
    },
    {
      icon: <FaLinkedinIn size={20} />,
      url: platform?.linkedin || "https://linkedin.com",
      label: "Linkedin",
      color: "bg-blue-600",
      isActive: platform?.linkedin ? true : false,
    },
    {
      icon: <FaTelegram size={20} />,
      url: platform?.telegram || "https://telegram.org",
      label: "Telegram",
      color: "bg-blue-400",
      isActive: platform?.telegram ? true : false,
    },
  ];

  if (isPlatformPending) {
    return <Loader />;
  }

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Contact Us", active: true },
  ];

  return (
    <div className="relative w-full min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-5 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-700 text-primary-50 mb-6">
            <FaHeadset size={40} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Get In Touch</h1>
          <p className="max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {contactInfo.map((info, index) => (
            <Link
              key={index}
              to={info.href}
              target={info.href.startsWith("http") ? "_blank" : undefined}
              rel={
                info.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="card p-5 text-center transition-shadow duration-300 hover:shadow-md"
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600 mb-4">
                {info.icon}
              </div>
              <h3 className="text-lg font-bold mb-3">{info.title}</h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-sm font-medium mb-1">
                  {detail}
                </p>
              ))}
              <p className="text-xs mt-3">{info.description}</p>
            </Link>
          ))}
        </div>

        {/* Department Contact */}
        <div className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8">
            Contact by Department
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="card p-6 transition-shadow duration-300 hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                  {dept.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{dept.title}</h3>
                <a
                  href={`mailto:${dept.email}`}
                  className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors duration-300 mb-2 block"
                >
                  {dept.email}
                </a>
                <p className="text-sm">{dept.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media , Quick Links & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
          {/* Social Media & Quick Links */}
          <div className="grid grid-cols-1 gap-5 mb-10">
            {/* Social Media */}
            <div className="card p-5">
              <h2 className="text-lg lg:text-xl font-bold mb-6 text-center">
                Follow Us on Social Media
              </h2>
              <div className="flex justify-center items-center gap-2.5 lg:gap-3.5">
                {socialLinks
                  .filter((social) => social.isActive)
                  .map((social, index) => (
                    <Link
                      key={index}
                      to={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`w-10 h-10 flex items-center justify-center rounded-md ${social.color} text-primary-50 transition-all duration-300 transform hover:scale-110 hover:shadow-lg`}
                    >
                      {social.icon}
                    </Link>
                  ))}
              </div>
              <p className="text-center text-sm mt-6">
                Stay connected for exclusive deals, updates, and more!
              </p>
            </div>

            {/* Quick Links */}
            <div className="card p-5">
              <h2 className="text-lg lg:text-xl font-bold mb-6 text-center">
                Quick Links
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/support"
                  className="p-4 bg-primary-700 rounded-md text-center hover:shadow-md transition-all duration-300"
                >
                  <FaHeadset className="text-2xl text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Support Center</p>
                </Link>
                <Link
                  to="/about"
                  className="p-4 bg-primary-700 rounded-md text-center hover:shadow-md transition-all duration-300"
                >
                  <FaQuestionCircle className="text-2xl text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">About Us</p>
                </Link>
                <Link
                  to="/returns-policy"
                  className="p-4 bg-primary-700 rounded-md text-center hover:shadow-md transition-all duration-300"
                >
                  <FaShoppingBag className="text-2xl text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Returns Policy</p>
                </Link>
                <Link
                  to="/privacy-policy"
                  className="p-4 bg-primary-700 rounded-md text-center hover:shadow-md transition-all duration-300"
                >
                  <FaMapMarkerAlt className="text-2xl text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Privacy Policy</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Location Map */}
          <div className="card overflow-hidden">
            <div className="bg-primary-700 p-5 border-b border-border-color">
              <div className="flex items-center gap-4">
                <div className="surface flex h-12 w-12 items-center justify-center rounded-md text-primary-600">
                  <FaMapMarkerAlt className="text-2xl" />
                </div>
                <h2 className="text-lg lg:text-xl font-bold">Our Location</h2>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                <div className="surface-muted aspect-video overflow-hidden rounded-md">
                  <iframe
                    src={platform?.googleMap || ""}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Supply Points Office Location"
                  ></iframe>
                </div>
                <div className="text-center">
                  <p className="font-medium mb-1">123 Shopping Street</p>
                  <p className="text-sm">Dhaka 1205, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="surface-muted rounded-lg border border-border-color p-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            We're Here to Help!
          </h2>
          <p className="max-w-2xl mx-auto mb-6">
            Whether you have a question about our products, need assistance with
            an order, or just want to provide feedback, our team is ready to
            assist you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`tel:${platform?.phoneNumber || "+880 1700 0000"}`}
              className="btn primary-btn px-8 py-3"
            >
              <FaPhoneAlt />
              Call Now
            </Link>
            <Link
              to={`mailto:${platform?.emailAddress || "info@yourdomain.com"}`}
              className="btn outline-btn px-8 py-3"
            >
              <FaEnvelope />
              Send Email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
