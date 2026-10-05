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
  FaGlobe,
  FaShoppingBag,
  FaUserFriends,
  FaBoxOpen,
} from "react-icons/fa";
import { MdRule, MdOutlineTaskAlt } from "react-icons/md";

import bkash_logo from "../../../assets/payments/bkash.png";
import nagad_logo from "../../../assets/payments/nagad.png";
import rocket_logo from "../../../assets/payments/rocket.jpeg";
import cod_logo from "../../../assets/payments/cod.png";
import usePlatform from "../../../hooks/usePlatform/usePlatform";
import Loader from "../../../components/Loader/Loader";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { platform, isPlatformPending } = usePlatform();

  const quickLinks = [
    { name: "আমাদের সম্পর্কে", path: "/about" },
    { name: "রিসেলিং শুরু করুন", path: "/dashboard/seller/reselling" },
    { name: "আমার অর্ডার", path: "/dashboard/seller/my-orders" },
    { name: "আমার রেফারেল", path: "/dashboard/seller/my-refer" },
    { name: "নিয়ম ও নির্দেশিকা", path: "/dashboard/seller/rules" },
    {
      name: "ই-কমার্স ওয়েবসাইট",
      path: "/dashboard/seller/ecommerce-web",
    },
  ];

  const socialLinks = [
    {
      icon: <FaFacebookF size={18} />,
      url: platform?.facebook || "https://facebook.com",
      label: "ফেসবুক",
      isActive: Boolean(platform?.facebook),
    },
    {
      icon: <FaInstagram size={18} />,
      url: platform?.instagram || "https://instagram.com",
      label: "ইনস্টাগ্রাম",
      isActive: Boolean(platform?.instagram),
    },
    {
      icon: <FaYoutube size={18} />,
      url: platform?.youtube || "https://youtube.com",
      label: "ইউটিউব",
      isActive: Boolean(platform?.youtube),
    },
    {
      icon: <FaWhatsapp size={18} className="text-green-500" />,
      url: `https://wa.me/${platform?.whatsappNumber}`,
      label: "হোয়াটসঅ্যাপ",
      isActive: Boolean(platform?.whatsappNumber),
    },
  ];

  if (isPlatformPending) {
    return <Loader />;
  }

  return (
    <footer className="w-full bg-card-bg border-t border-border-color text-text-secondary">
      <div className="container mx-auto px-5 py-5 lg:py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand & Reselling Info Section */}
          <div className="space-y-6 lg:col-span-5">
            <Link to="/" className="group inline-block">
              <h2 className="text-2xl font-black tracking-tight text-text-primary transition-colors duration-300 group-hover:text-primary-500 sm:text-3xl">
                Supply<span className="text-primary-500">Points</span>
              </h2>

              <p className="mt-1 text-xs font-semibold tracking-widest uppercase text-primary-500">
                আধুনিক বাংলাদেশি রিসেলিং প্ল্যাটফর্ম
              </p>
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-text-secondary">
              বাংলাদেশজুড়ে রিসেলার ও উদ্যোক্তাদের জন্য সহজ রিসেলিং, ড্রপশিপিং,
              অনলাইন ব্যবসা পরিচালনা এবং দ্রুত অর্ডার পূরণের সুবিধা নিয়ে আমরা
              কাজ করছি।
            </p>

            {/* Secure Payment Methods */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                নিরাপদ পেমেন্ট ব্যবস্থা
              </h4>

              <div className="flex flex-wrap items-center gap-2">
                <div className="h-9 w-16 bg-white border border-border-color rounded-md overflow-hidden p-1 flex items-center justify-center shadow-2xs">
                  <img
                    src={cod_logo}
                    alt="ক্যাশ অন ডেলিভারি"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="h-9 w-16 bg-white border border-border-color rounded-md overflow-hidden p-1 flex items-center justify-center shadow-2xs">
                  <img
                    src={bkash_logo}
                    alt="বিকাশ"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="h-9 w-16 bg-white border border-border-color rounded-md overflow-hidden p-1 flex items-center justify-center shadow-2xs">
                  <img
                    src={nagad_logo}
                    alt="নগদ"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="h-9 w-16 bg-white border border-border-color rounded-md overflow-hidden p-1 flex items-center justify-center shadow-2xs">
                  <img
                    src={rocket_logo}
                    alt="রকেট"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links & Platform Features */}
          <div className="space-y-5 lg:col-span-4">
            <h3 className="relative inline-block text-xs font-bold uppercase tracking-widest text-text-primary">
              প্রয়োজনীয় লিংক
              <span className="absolute -bottom-2 left-0 h-0.5 w-6 bg-primary-500 rounded-full"></span>
            </h3>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="group flex items-center py-1 text-xs sm:text-sm text-text-secondary transition-colors duration-300 hover:text-primary-500"
                  >
                    <FaChevronRight className="mr-2 text-[9px] text-text-secondary transition-all duration-300 group-hover:ml-0 group-hover:text-primary-500" />

                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-5 lg:col-span-3">
            <h3 className="relative inline-block text-xs font-bold uppercase tracking-widest text-text-primary">
              যোগাযোগ
              <span className="absolute -bottom-2 left-0 h-0.5 w-6 bg-primary-500 rounded-full"></span>
            </h3>

            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border-color bg-card-bg text-primary-500 shadow-2xs">
                  <FaMapMarkerAlt size={14} />
                </div>

                <span className="text-xs leading-relaxed">
                  {platform?.address || "ঢাকা, বাংলাদেশ"}
                </span>
              </li>

              <li className="flex items-center gap-3 group">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border-color bg-card-bg text-primary-500 shadow-2xs">
                  <FaPhoneAlt size={13} />
                </div>

                <Link
                  to={`tel:${platform?.phoneNumber || "+880 1700 0000"}`}
                  className="text-xs hover:text-primary-500 transition-colors"
                >
                  {platform?.phoneNumber || "+880 1700 0000"}
                </Link>
              </li>

              <li className="flex items-center gap-3 group">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border-color bg-card-bg text-primary-500 shadow-2xs">
                  <FaEnvelope size={13} />
                </div>

                <Link
                  to={`mailto:${
                    platform?.emailAddress || "support@supplypoints.com"
                  }`}
                  className="text-xs hover:text-primary-500 transition-colors break-all"
                >
                  {platform?.emailAddress || "support@supplypoints.com"}
                </Link>
              </li>
            </ul>

            {/* Social Links */}
            <div className="space-y-2.5 pt-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                আমাদের সোশ্যাল চ্যানেল
              </h4>

              <div className="flex items-center gap-2">
                {socialLinks
                  .filter((social) => social.isActive)
                  .map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-color bg-card-bg text-text-primary transition-all duration-300 hover:border-primary-500 shadow-2xs"
                    >
                      {social.icon}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-5 lg:mt-5 pt-5 lg:pt-10 border-t border-border-color flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <p>© {currentYear} SupplyPoints. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link
              to="/privacy-policy"
              className="hover:text-primary-500 transition-colors"
            >
              গোপনীয়তা নীতি
            </Link>

            <Link
              to="/terms-conditions"
              className="hover:text-primary-500 transition-colors"
            >
              শর্তাবলি
            </Link>

            <Link
              to="/dashboard/seller/rules"
              className="hover:text-primary-500 transition-colors"
            >
              নীতিমালা
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
