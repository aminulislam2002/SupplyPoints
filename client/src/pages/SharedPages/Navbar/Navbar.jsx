import { useContext, useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiHeart,
  FiSearch,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth/useAuth";
import { IoCallOutline } from "react-icons/io5";
import Loader from "../../../components/Loader/Loader";
import { CgLogOut } from "react-icons/cg";
import { FaRegUser, FaChevronDown } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import useRole from "../../../hooks/useRole/useRole";
import { CartContext } from "../../../providers/CartProvider/CartProvider";
import usePlatform from "../../../hooks/usePlatform/usePlatform";

import logo from "../../../assets/logo/logo.jpeg";
import useAxiosPublic from "../../../hooks/useAxiosPublic/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { ThemeContext } from "../../../providers/ThemeProvider/ThemeProvider";

const Navbar = () => {
  const axiosPublic = useAxiosPublic();
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

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   console.log(e);
  // };

  const navLinks = [
    { name: "হোম", path: "/" },
    { name: "রিসেলিং প্রোডাক্ট", path: "/reselling" },
    { name: "সোশ্যাল প্রোমোশন", path: "/promotion" },
    { name: "মাইক্রো জব", path: "/marketing" },
  ];

  if (isUserPending || isRolePending || isPlatformPending) {
    return <Loader />;
  }

  return (
    <>
      {/* Top Bar */}
      <div
        className={`block w-full fixed top-0 left-0 right-0 z-50 bg-section-bg/95 backdrop-blur-sm border-b border-border-color transition-all duration-300 ${
          scrolled ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="container mx-auto px-5">
          <div className="flex items-center justify-between h-9 text-xs text-text-secondary">
            <div className="flex items-center gap-5">
              <Link
                to={`tel:${platform?.phoneNumber || "+8801700000000"}`}
                className="flex items-center gap-2 hover:text-primary-600 transition-colors"
              >
                <IoCallOutline size={16} />{" "}
                {platform?.phoneNumber || "+8801700000000"}
              </Link>
              <Link
                to={`mailto:${platform?.emailAddress || "info@yourdomain.com"}`}
                className="hidden lg:flex items-center gap-2 hover:text-primary-600 transition-colors"
              >
                <MdOutlineEmail size={16} />{" "}
                {platform?.emailAddress || "info@yourdomain.com"}
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/support"
                className="hover:text-primary-600 transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`fixed left-0 right-0 z-50 bg-section-bg transition-all duration-300 ${
          scrolled ? "top-0 backdrop-blur-md shadow-lg" : "top-10 shadow-sm"
        }`}
      >
        <style>{`body { padding-top: ${scrolled ? "64px" : "104px"}; }`}</style>
        <div className="container mx-auto px-5">
          <div className="flex items-center justify-between min-h-16 gap-4">
            {/* Logo */}
            <Link
              to="/"
              onClick={() => {
                (setSearchOpen(false), setSearchQuery(" "));
              }}
              className="flex items-center gap-2 group"
            >
              <div className="relative overflow-hidden rounded-lg border border-border-color bg-card-bg">
                <img
                  src={logo}
                  className="h-11 w-11 object-cover transition-transform duration-300 group-hover:scale-105"
                  alt="Supply Points Logo"
                />
              </div>
              <div>
                <h1 className="text-base md:text-lg lg:text-xl font-extrabold tracking-tight text-primary-700 dark:text-primary-400 transition-colors duration-300 uppercase">
                  Supply Points
                </h1>
                <p className="hidden sm:block text-[10px] text-text-muted tracking-wide">
                  Your Shopping Paradise
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 rounded-lg border border-border-color bg-card-bg/70 p-1">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  onClick={() => {
                    (setSearchOpen(false), setSearchQuery(" "));
                  }}
                  className="relative rounded-md px-3.5 py-2.5 text-sm font-semibold text-text-secondary hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-950 dark:hover:text-primary-300 transition-colors duration-300 group"
                >
                  {link.name}
                  <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 origin-left scale-x-0 bg-primary-600 transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border-color bg-card-bg px-2.5 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                {theme === "dark" ? (
                  <FiSun size={16} className="text-primary-400" />
                ) : (
                  <FiMoon size={16} className="text-primary-600" />
                )}
              </button>
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="btn-icon rounded-lg border border-transparent transition-colors duration-300 hover:border-border-color hover:bg-primary-50 dark:hover:bg-primary-950"
                aria-label="Search"
              >
                {searchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="btn-icon relative hidden rounded-lg border border-transparent transition-colors duration-300 hover:border-border-color hover:bg-primary-50 dark:hover:bg-primary-950 lg:flex"
                aria-label="Shopping cart"
              >
                <FiShoppingCart size={20} />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-700 px-1 text-[10px] font-bold text-white">
                  {cartData?.length || 0}
                </span>
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="hidden lg:block relative group">
                  <button className="flex items-center gap-2 rounded-lg border border-transparent px-2 py-2 hover:border-border-color hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-700 to-primary-800 flex items-center justify-center text-primary-50 text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">
                      {user?.name?.split(" ")[0]}
                    </span>
                    <FaChevronDown className="text-xs text-primary-600" />
                  </button>

                  {/* Dropdown */}
                  <div className="invisible absolute right-0 top-full z-50 mt-2 w-60 origin-top-right rounded-xl border border-border-color bg-card-bg p-1.5 text-text-primary opacity-0 shadow-xl shadow-slate-900/10 transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:shadow-black/30">
                    <div className="border-b border-border-color px-3 py-3">
                      <p className="truncate text-sm font-semibold">
                        {user?.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-text-muted">
                        {user?.identifier}
                      </p>
                    </div>
                    <div className="space-y-1 p-1.5">
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
                        className="flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors duration-200 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-950 dark:hover:text-primary-300"
                      >
                        <FaRegUser size={16} />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={loggedOut}
                        className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-danger transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <CgLogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link
                    to="/auth/sign-in"
                    className="px-4 py-3 text-sm font-medium hover:text-primary-500 transition-colors duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/sign-up"
                    className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-primary-50 shadow-sm transition-all duration-300 hover:bg-primary-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => {
                  if (searchOpen) {
                    setSearchOpen(false);
                    setSearchQuery(" ");
                  }
                  setOpen(!open);
                }}
                className="lg:hidden p-2 rounded-md hover:bg-primary-100  transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {open ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {searchOpen && (
          <div className="border-t border-border-color bg-section-bg">
            <div className="container mx-auto h-[calc(100vh-64px)] overflow-y-auto px-5 py-4">
              <form
                // onSubmit={handleSearch}
                className="max-w-2xl mx-auto"
              >
                <div className="relative">
                  <FiSearch
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    size={20}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="control w-full pl-12 pr-4 py-3"
                    autoFocus
                  />
                </div>
              </form>

              {isProductLoading ? (
                <div className="flex justify-center items-center mt-5">
                  <p className="text-sm">Loading products...</p>
                </div>
              ) : isProductFetching ? (
                <div className="flex justify-center items-center mt-5">
                  <p className="text-sm">Fetching products...</p>
                </div>
              ) : productData && productData.length > 0 ? (
                <div className="mt-5 space-y-2.5">
                  {productData.map((product) => (
                    <Link
                      key={product?._id}
                      to={`/products/${product?._id}`}
                      onClick={() => {
                        (setSearchOpen(false), setSearchQuery(" "));
                      }}
                      className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300 flex justify-start items-center gap-2"
                    >
                      <img
                        src={
                          import.meta.env.VITE_IMAGE_URL + product?.thumbnail ||
                          logo
                        }
                        alt={product?.title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="p-3">
                        <h3 className="text-sm font-medium line-clamp-1">
                          {product?.title}
                        </h3>
                        <div className="flex justify-between items-center">
                          <p className="text-sm mt-1 text-gray-300">
                            দাম: {product?.price?.toFixed(2)}
                          </p>
                          <p className="text-sm mt-1 text-gray-300">
                            Code: {product?.productCode}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center mt-6">
                  <p className="text-sm">No products found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden border-t border-border-color bg-section-bg">
            <div className="container mx-auto px-5 py-4 space-y-1">
              {/* Mobile Navigation */}
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery(" ");
                    setOpen(false);
                  }}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors duration-200 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-950 dark:hover:text-primary-300"
                >
                  {link.name}
                </Link>
              ))}

              {/* Wishlist & Cart */}
              <div className="pt-4 mt-4 border-t border-border-color space-y-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-left transition-colors hover:bg-primary-50 dark:hover:bg-primary-950"
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                  {theme === "dark" ? (
                    <FiSun size={18} />
                  ) : (
                    <FiMoon size={18} />
                  )}
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </button>
                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors duration-200 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-950 dark:hover:text-primary-300"
                >
                  <span className="flex items-center gap-3">
                    <FiShoppingCart size={18} />
                    Cart
                  </span>
                  <span className="text-xs bg-primary-950  px-2 py-0.5 rounded-full">
                    {cartData?.length || 0}
                  </span>
                </Link>
              </div>

              {/* User Menu */}
              {user ? (
                <div className="pt-4 mt-4 border-t border-border-color space-y-2">
                  <div className="px-4 py-3 flex justify-start items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-700 to-primary-800 flex items-center justify-center text-primary-50 text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-xs">{user?.identifier}</p>
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
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors duration-200 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-950 dark:hover:text-primary-300"
                  >
                    <FaRegUser size={16} />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      loggedOut();
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-danger transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <CgLogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-border-color space-y-2">
                  <Link
                    to="/auth/sign-in"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-center rounded-md hover:bg-primary-100  transition-colors duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/sign-up"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-center rounded-md text-primary-50 bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
