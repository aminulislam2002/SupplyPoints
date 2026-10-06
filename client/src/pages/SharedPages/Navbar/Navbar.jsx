import { useContext, useState, useEffect } from "react";
import {
  HiOutlineMenuAlt3,
  HiOutlineX,
  HiOutlineShoppingBag,
  HiOutlineSearch,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineChevronDown,
  HiOutlineLogout,
} from "react-icons/hi";
import { Link, useLocation } from "react-router";
import useAuth from "../../../hooks/useAuth/useAuth";
import Loader from "../../../components/Loader/Loader";
import useRole from "../../../hooks/useRole/useRole";
import { CartContext } from "../../../providers/CartProvider/CartProvider";
import usePlatform from "../../../hooks/usePlatform/usePlatform";

import logo from "../../../assets/logo/logo.png";
import useAxiosPublic from "../../../hooks/useAxiosPublic/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { ThemeContext } from "../../../providers/ThemeProvider/ThemeProvider";

const Navbar = () => {
  const axiosPublic = useAxiosPublic();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, loggedOut, isUserPending } = useAuth();
  const { isUser, isAdmin, isSeller, isBlocked, isRolePending } = useRole();
  const { cartData } = useContext(CartContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { platform, isPlatformPending } = usePlatform();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch sub-category details
  const {
    isLoading: isProductLoading,
    isFetching: isProductFetching,
    data: productData = {},
  } = useQuery({
    queryKey: ["productById", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return {};

      const res = await axiosPublic.get(`/products/search`, {
        params: { searchQuery },
      });

      return res?.data && res?.data?.data;
    },

    enabled: !!searchQuery,
    refetchOnWindowFocus: true,
  });

  const navLinks = [
    { name: "হোম", path: "/" },
    { name: "রিসেলিং প্রোডাক্ট", path: "/reselling" },
    { name: "সোশ্যাল প্রোমোশন", path: "/promotion" },
    { name: "মাইক্রো জব", path: "/marketing" },
  ];

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  if (isUserPending || isRolePending || isPlatformPending) {
    return <Loader />;
  }

  return (
    <>
      {/* International Style Top Bar with Marquee */}
      <div
        className={`w-full fixed top-0 left-0 right-0 z-50 bg-secondary-900 text-secondary-200 border-b border-border-color transition-all duration-300 ${
          scrolled ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-between gap-4 text-xs">
            {/* Contact Info (Left) */}
            <div className="hidden md:flex items-center gap-6 text-secondary-300">
              <Link
                to={`tel:${platform?.phoneNumber || "+8801700000000"}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <HiOutlinePhone className="text-primary-400" size={14} />
                <span>{platform?.phoneNumber || "+8801700000000"}</span>
              </Link>
              <Link
                to={`mailto:${platform?.emailAddress || "info@yourdomain.com"}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <HiOutlineMail className="text-primary-400" size={14} />
                <span>{platform?.emailAddress || "info@yourdomain.com"}</span>
              </Link>
            </div>

            {/* Center Marquee */}
            <div className="flex-1 overflow-hidden px-2">
              <marquee className="pt-1.5 pb-0.5 text-sm md:text-base font-semibold tracking-wide text-primary-300">
                {platform?.marqueeText ||
                  "Welcome to Supply Points - Global Standard Digital Marketplace & Reselling Platform"}
              </marquee>
            </div>

            {/* Right Links */}
            <div className="hidden sm:flex items-center gap-4 font-medium text-secondary-300">
              <Link
                to="/support"
                className="hover:text-white transition-colors"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modern International Header */}
      <header
        className={`fixed left-0 right-0 z-50 bg-card-bg/80 backdrop-blur-xl border-b border-border-color transition-all duration-300 ${
          scrolled ? "top-0 shadow-md" : "top-10 shadow-sm"
        }`}
      >
        <style>{`body { padding-top: ${scrolled ? "72px" : "112px"}; }`}</style>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-18 gap-6">
            {/* Global Branding / Logo Part */}
            <Link
              to="/"
              onClick={closeSearch}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md ring-2 ring-primary-500/20 group-hover:ring-primary-500 transition-all duration-300">
                <img
                  src={logo}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  alt="Supply Points Logo"
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-black tracking-tight text-text-primary transition-colors duration-300 group-hover:text-primary-500">
                  Supply<span className="text-primary-500">Points</span>
                </h2>
                <span className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold mt-1">
                  Reselling platform
                </span>
              </div>
            </Link>

            {/* Navigation Items Part (Pill Style Container) */}
            <nav className="hidden lg:flex items-center gap-1 bg-secondary-100/80 dark:bg-secondary-800/60 p-1.5 rounded-full border border-border-color shadow-inner">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={index}
                    to={link.path}
                    onClick={closeSearch}
                    className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-card-bg text-primary-600 shadow-sm font-semibold"
                        : "text-text-secondary hover:text-text-primary hover:bg-card-bg/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons & Profile Part */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-secondary-100 dark:hover:bg-secondary-800  transition-colors border border-border-color cursor-pointer"
              >
                {theme === "dark" ? (
                  <HiOutlineSun size={18} className="text-amber-400" />
                ) : (
                  <HiOutlineMoon size={18} className="text-text-primary" />
                )}
              </button>

              {/* Search Toggle Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-secondary-100 dark:hover:bg-secondary-800  transition-colors border border-border-color cursor-pointer"
                aria-label="Search"
              >
                {searchOpen ? (
                  <HiOutlineX size={20} />
                ) : (
                  <HiOutlineSearch size={20} />
                )}
              </button>

              {/* Shopping Cart Button */}
              <Link
                to="/cart"
                className="relative w-10 h-10 rounded-full hidden sm:flex items-center justify-center text-text-secondary hover:bg-secondary-100 dark:hover:bg-secondary-800  transition-colors border border-border-color"
                aria-label="Shopping Cart"
              >
                <HiOutlineShoppingBag size={20} />
                {cartData?.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {cartData.length}
                  </span>
                )}
              </Link>

              {/* User Dropdown / Authentication */}
              {user ? (
                <div className="relative group hidden lg:block">
                  <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-border-color bg-card-bg hover:shadow-sm transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary-600 to-primary-500 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-text-primary">
                      {user?.name?.split(" ")[0]}
                    </span>
                    <HiOutlineChevronDown
                      size={14}
                      className="text-text-secondary group-hover:rotate-180 transition-transform duration-300"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full pt-2 w-56 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-card-bg rounded-2xl shadow-xl border border-border-color p-2 overflow-hidden backdrop-blur-xl">
                      <div className="px-3 py-3 border-b border-border-color">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-text-secondary truncate mt-0.5">
                          {user?.identifier}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          to={
                            isAdmin
                              ? "/dashboard/admin/overview"
                              : isSeller || isUser
                                ? "/dashboard/seller/overview"
                                : isBlocked
                                  ? "/support"
                                  : "/"
                          }
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-text-secondary rounded-xl hover:bg-primary-50 dark:hover:bg-secondary-800 hover:text-primary-600 transition-colors"
                        >
                          <HiOutlineUser size={18} />
                          <span>প্রোফাইল</span>
                        </Link>
                        <button
                          onClick={loggedOut}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-danger rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <HiOutlineLogout size={18} />
                          <span>লগ আউট</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link
                    to="/auth/sign-in"
                    className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-primary-600 transition-colors"
                  >
                    সাইন-ইন
                  </Link>
                  <Link
                    to="/auth/sign-up"
                    className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-full shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30 transition-all duration-300"
                  >
                    শুরু করুন
                  </Link>
                </div>
              )}

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => {
                  if (searchOpen) closeSearch();
                  setOpen(!open);
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-text-primary hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors border border-border-color lg:hidden cursor-pointer"
                aria-label="Toggle Menu"
              >
                {open ? (
                  <HiOutlineX size={22} />
                ) : (
                  <HiOutlineMenuAlt3 size={22} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay Panel */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 bg-card-bg/95 backdrop-blur-2xl border-b border-border-color shadow-2xl transition-all duration-300">
            <div className="max-w-3xl mx-auto px-4 py-6">
              <form onSubmit={(e) => e.preventDefault()} className="relative">
                <HiOutlineSearch
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
                  size={22}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="টাইটেল, কোড বা ক্যাটাগরি অনুযায়ী পণ্য খুঁজুন..."
                  className="w-full bg-secondary-100 border border-border-color rounded-2xl py-4 pl-12 pr-12 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  >
                    <HiOutlineX size={18} />
                  </button>
                )}
              </form>

              {/* Search Results Container */}
              <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-2">
                {isProductLoading || isProductFetching ? (
                  <div className="text-center py-8 text-text-secondary">
                    পণ্যগুলি খুঁজে বার হচ্ছে...
                  </div>
                ) : productData && productData.length > 0 ? (
                  productData.map((product) => (
                    <Link
                      key={product?._id}
                      to={`/products/${product?._id}`}
                      onClick={closeSearch}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-secondary-50 dark:bg-secondary-800/50 hover:bg-primary-50/50 border border-border-color transition-all group"
                    >
                      <img
                        src={
                          import.meta.env.VITE_IMAGE_URL + product?.thumbnail ||
                          logo
                        }
                        alt={product?.title}
                        className="w-14 h-14 rounded-xl object-cover shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-text-primary truncate group-hover:text-primary-600 transition-colors">
                          {product?.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-1 text-xs text-text-secondary">
                          <span className="font-semibold text-primary-600">
                            ৳ {product?.price?.toFixed(2)}
                          </span>
                          <span>Code: {product?.productCode}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : searchQuery ? (
                  <div className="text-center py-8 text-text-secondary">
                    কোনো পণ্য পাওয়া যায়নি &quot;{searchQuery}&quot;
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {open && (
          <div className="absolute top-full left-0 right-0 bg-card-bg border-b border-border-color shadow-2xl lg:hidden">
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
              {/* Nav links */}
              <div className="space-y-1">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                      setOpen(false);
                    }}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      location.pathname === link.path
                        ? "bg-primary-50 dark:bg-primary-950/50 text-primary-600 font-semibold"
                        : "text-text-secondary hover:bg-secondary-100 dark:hover:bg-secondary-800 "
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Cart link for mobile */}
              <div className="pt-4 border-t border-border-color">
                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-text-secondary hover:bg-secondary-100 dark:hover:bg-secondary-800"
                >
                  <span className="flex items-center gap-3">
                    <HiOutlineShoppingBag size={20} />
                    কার্ট আইটেম
                  </span>
                  <span className="px-2.5 py-0.5 bg-primary-600 text-white text-xs font-bold rounded-full">
                    {cartData?.length || 0}
                  </span>
                </Link>
              </div>

              {/* User authentication / profile menu for mobile */}
              <div className="pt-4 border-t border-border-color">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-primary-600 to-primary-500 text-white flex items-center justify-center font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">
                          {user?.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {user?.identifier}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={
                        isAdmin
                          ? "/dashboard/admin/overview"
                          : isSeller || isUser
                            ? "/dashboard/seller/overview"
                            : isBlocked
                              ? "/support"
                              : "/"
                      }
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-secondary-100 dark:hover:bg-secondary-800 font-medium"
                    >
                      <HiOutlineUser size={18} />
                      প্রোফাইল
                    </Link>
                    <button
                      onClick={() => {
                        loggedOut();
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-red-50 dark:hover:bg-red-950/30 font-medium text-left"
                    >
                      <HiOutlineLogout size={18} />
                      লগ আউট
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      to="/auth/sign-in"
                      onClick={() => setOpen(false)}
                      className="w-full py-3 text-center text-sm font-semibold rounded-xl border border-border-color text-text-secondary hover:bg-secondary-100 dark:hover:bg-secondary-800  transition-colors"
                    >
                      সাইন-ইন
                    </Link>
                    <Link
                      to="/auth/sign-up"
                      onClick={() => setOpen(false)}
                      className="w-full py-3 text-center text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-md transition-colors"
                    >
                      শুরু করুন
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
