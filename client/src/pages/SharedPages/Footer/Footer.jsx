import { Link } from "react-router";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChevronRight,
  FaWhatsapp,
} from "react-icons/fa";

import bkash_logo from "../../../assets/payments/bkash.png";
import nagad_logo from "../../../assets/payments/nagad.png";
import rocket_logo from "../../../assets/payments/rocket.jpeg";
import cod_logo from "../../../assets/payments/cod.png";
import usePlatform from "../../../hooks/usePlatform/usePlatform";
import Loader from "../../../components/Loader/Loader";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { platform, isPlatformPending } = usePlatform();

  const customerService = [
    { name: "Support Center", path: "/support" },
    { name: "Track Order", path: "/track-order" },
    { name: "Shipping Info", path: "/shipping" },
    { name: "Returns Policy", path: "/returns-policy" },
    { name: "Size Guideline", path: "/size-guide" },
  ];

  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms & Conditions", path: "/terms-conditions" },
    { name: "Careers", path: "/contact" },
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
      color: "bg-linear-to-tr from-yellow-300 via-pink-500 to-pink-600",
      isActive: platform?.instagram ? true : false,
    },
    {
      icon: <FaYoutube size={20} />,
      url: platform?.youtube || "https://youtube.com",
      label: "YouTube",
      color: "bg-red-600",
      isActive: platform?.youtube ? true : false,
    },
    {
      icon: <FaWhatsapp size={20} />,
      url: `https://wa.me/${platform?.whatsappNumber}`,
      label: "WhatsApp",
      color: "bg-green-600",
      isActive: platform?.whatsappNumber ? true : false,
    },
  ];

  if (isPlatformPending) {
    return <Loader />;
  }

  return (
    <footer className="w-full border-t border-border-color">
      <div className="container mx-auto px-5 py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Brand Section  */}
          <div className="space-y-6 lg:col-span-2">
            <Link to="/" className="group inline-block">
              <h2 className="text-2xl font-extrabold tracking-tight text-primary-400 transition-colors duration-300 group-hover:text-primary-300 sm:text-3xl">
                Supply Points
              </h2>
              <p className="mt-1 text-xs text-secondary-400">
                Your Shopping Paradise
              </p>
            </Link>

            <p className="max-w-md text-sm leading-7">
              Experience the future of online shopping with Supply Points. We
              deliver quality, authenticity, and excellence right to your
              doorstep. Join millions of happy customers today!
            </p>

            {/* Payment Methods */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-secondary-400">
                Payment Methods
              </h4>
              <div className="grid w-full max-w-xs grid-cols-4 overflow-hidden rounded-lg border border-secondary-700 bg-secondary-900">
                <img
                  src={cod_logo}
                  alt="Cash on Delivery"
                  className="h-12 w-full border-r border-secondary-700 object-cover"
                />
                <img
                  src={bkash_logo}
                  alt="bKash"
                  className="h-12 w-full border-r border-secondary-700 object-cover"
                />
                <img
                  src={nagad_logo}
                  alt="Nagad"
                  className="h-12 w-full border-r border-secondary-700 object-cover"
                />
                <img
                  src={rocket_logo}
                  alt="Rocket"
                  className="h-12 w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="relative inline-block text-sm font-bold uppercase tracking-[0.12em] text-secondary-100">
              Quick Links
              <span className="absolute -bottom-2 left-0 h-0.5 w-8 bg-primary-500"></span>
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="group flex items-center py-1 text-sm text-secondary-300 transition-colors duration-300 hover:text-primary-300"
                  >
                    <FaChevronRight className="mr-2 text-[10px] opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100 md:-ml-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-5">
            <h3 className="relative inline-block text-sm font-bold uppercase tracking-[0.12em] text-secondary-100">
              Customer Service
              <span className="absolute -bottom-2 left-0 h-0.5 w-8 bg-primary-500"></span>
            </h3>
            <ul className="space-y-2.5">
              {customerService.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="group flex items-center py-1 text-sm text-secondary-300 transition-colors duration-300 hover:text-primary-300"
                  >
                    <FaChevronRight className="mr-2 text-[10px] opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100 md:-ml-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-5">
            <h3 className="relative inline-block text-sm font-bold uppercase tracking-[0.12em] text-secondary-100">
              Get In Touch
              <span className="absolute -bottom-2 left-0 h-0.5 w-8 bg-primary-500"></span>
            </h3>

            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-secondary-700 bg-secondary-900 text-primary-300 transition-colors duration-300 group-hover:border-primary-500 group-hover:bg-primary-700 group-hover:text-white">
                  <FaMapMarkerAlt />
                </div>
                <span className="text-sm">
                  {platform?.address || "123 Shopping Street, Dhaka 1205"}
                </span>
              </li>

              <li className="flex items-center gap-3 group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-secondary-700 bg-secondary-900 text-primary-300 transition-colors duration-300 group-hover:border-primary-500 group-hover:bg-primary-700 group-hover:text-white">
                  <FaPhoneAlt />
                </div>
                <Link
                  to={`tel:${platform?.phoneNumber || "+880 1700 0000"}`}
                  className="break-words text-sm transition-colors duration-300 hover:text-primary-400"
                >
                  {platform?.phoneNumber || "+880 1700 0000"}
                </Link>
              </li>

              <li className="flex items-center gap-3 group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-secondary-700 bg-secondary-900 text-primary-300 transition-colors duration-300 group-hover:border-primary-500 group-hover:bg-primary-700 group-hover:text-white">
                  <FaEnvelope />
                </div>
                <Link
                  to={`mailto:${
                    platform?.emailAddress || "support@yourdomain.com"
                  }`}
                  className="break-words text-sm transition-colors duration-300 hover:text-primary-400"
                >
                  {platform?.emailAddress || "support@yourdomain.com"}
                </Link>
              </li>
            </ul>

            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider">
                Connect With Us
              </h4>
              <div className="flex items-center gap-2.5">
                {socialLinks
                  .filter((social) => social.isActive)
                  .map((social, index) => (
                    <Link
                      key={index}
                      to={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary-700 bg-secondary-900 text-primary-300 transition-all duration-300 hover:border-primary-500 hover:bg-primary-700 hover:text-white"
                    >
                      {social.icon}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
