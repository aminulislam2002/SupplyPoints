import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { Link, useLocation } from "react-router";
import useAxiosPublic from "../../hooks/useAxiosPublic/useAxiosPublic";
import useCategories from "../../hooks/useCategories/useCategories";
import Loader from "../../components/Loader/Loader";
import ProductCard from "../Products/ProductCard/ProductCard";
import {
  TfiLayoutGrid2Alt,
  TfiLayoutGrid3Alt,
  TfiLayoutGrid4Alt,
} from "react-icons/tfi";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

const Shop = () => {
  const axiosPublic = useAxiosPublic();
  const [currentPage, setCurrentPage] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(12);
  const [gridView, setGridView] = useState(4); // 2, 3, 4, 5 columns
  const [searchQuery, setSearchQuery] = useState("");
  const [sortQuery, setSortQuery] = useState("");
  const [category, setCategory] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { isCategoriesPending, categories } = useCategories();

  const location = useLocation();

  useEffect(() => {
    const search = location?.search?.split("=")[1];
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  // Fetch all products
  const {
    isPending,
    data: allProductResponse = {},
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["shopProducts", currentPage],
    queryFn: async () => {
      const res = await axiosPublic.get("/products", {
        params: {
          currentPage,
          limitPerPage,
          category,
          sortQuery,
          searchQuery,
          visibility: "Public",
        },
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    refetch();
  }, [refetch, limitPerPage, sortQuery, category, searchQuery]);

  const { data: allProduct = [], totalProducts, hasMore } = allProductResponse;

  const handleCategoryChange = (category) => {
    setCategory(category);
    setCurrentPage(0);
    setShowMobileFilters(false);
  };

  const handleClearFilters = () => {
    setCategory("");
    setSortQuery("");
    setCurrentPage(0);
  };

  const getGridClass = () => {
    const baseClass = "grid gap-2.5";
    switch (gridView) {
      case 2:
        return `${baseClass} grid-cols-2`;
      case 3:
        return `${baseClass} grid-cols-2 md:grid-cols-3`;
      case 4:
        return `${baseClass} grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`;
      case 5:
        return `${baseClass} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`;
      default:
        return `${baseClass} grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`;
    }
  };

  if (isPending && allProduct.length === 0) {
    return <Loader />;
  }

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Shop", active: !category },
    ...(category ? [{ label: category, active: true }] : []),
  ];

  return (
    <div className="relative w-full min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-5 py-5">
        <div className="flex gap-5">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block h-full w-1/4 shrink-0">
            <div className="card sticky top-24 flex flex-col">
              {/* Sidebar Header */}
              <div className="p-5 border-b border-border-color">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Filters</h2>
                  {(category || sortQuery) && (
                    <button
                      onClick={handleClearFilters}
                      className="btn danger-btn text-sm cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}

                  {searchQuery && (
                    <Link
                      to="/products"
                      onClick={() => setSearchQuery("")}
                      className="btn danger-btn text-sm cursor-pointer"
                    >
                      Clear Search
                    </Link>
                  )}
                </div>
              </div>

              {/* Scrollable Filters */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Categories */}
                <div>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleCategoryChange("")}
                      className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 hover:cursor-pointer ${
                        category === ""
                          ? "bg-primary-950  shadow"
                          : " hover:text-primary-50 border border-border-color"
                      }`}
                    >
                      All Categories
                      {!category && (
                        <span className="float-right">({totalProducts})</span>
                      )}
                    </button>
                    {isCategoriesPending ? (
                      <div className="text-sm px-4 py-2 text-primary-600">
                        Loading...
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {categories?.map((cat) => (
                          <button
                            key={cat._id}
                            onClick={() => handleCategoryChange(cat.category)}
                            className={`w-full h-10 text-left rounded-md text-sm font-medium cursor-pointer transition-all duration-300 border border-border-color ${
                              category === cat.category
                                ? "bg-primary-950  shadow"
                                : " hover:text-primary-50"
                            }`}
                          >
                            <img
                              src={import.meta.env.VITE_IMAGE_URL + cat.image}
                              alt={cat.category}
                              className="w-10 h-10 inline-block mr-2 rounded-l"
                            />{" "}
                            {cat.category} ({cat.productsCount})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Overlay */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
              <div className="fixed inset-y-0 right-0 w-full max-w-sm surface shadow-2xl flex flex-col animate-slide-in-right">
                {/* Mobile Filter Header */}
                <div className="flex items-center justify-between p-5 border-b border-border-color">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-primary-100  rounded-md transition-colors duration-300"
                  >
                    <IoMdClose size={24} />
                  </button>
                </div>

                {/* Mobile Filter Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  {/* Categories */}
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleCategoryChange("")}
                      className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                        category === ""
                          ? "bg-primary-950  shadow-md"
                          : "bg-primary-950  hover:bg-primary-100 "
                      }`}
                    >
                      All Categories
                    </button>
                    {categories?.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => handleCategoryChange(cat.category)}
                        className={`w-full h-10 text-left rounded-md text-sm font-medium cursor-pointer transition-all duration-300 ${
                          category === cat.category
                            ? "bg-primary-950  shadow"
                            : " hover:text-primary-50"
                        }`}
                      >
                        <img
                          src={import.meta.env.VITE_IMAGE_URL + cat.image}
                          alt={cat.category}
                          className="w-10 h-10 inline-block mr-2 rounded-l"
                        />{" "}
                        {cat.category} ({cat.productsCount})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Filter Footer */}
                <div className="p-5 border-t border-border-color space-y-2">
                  {(category || sortQuery) && (
                    <button
                      onClick={handleClearFilters}
                      className="w-full px-5 py-2.5 rounded-md font-medium bg-red-500 hover:bg-red-400 text-primary-50 transition-colors duration-300 shadow-md cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {/* Controls Bar */}
            <div className="mb-5 space-y-5">
              <div className="flex justify-between items-center gap-5">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="sortQuery"
                    className="text-sm font-medium text-primary-700  whitespace-nowrap block"
                  >
                    Sort by:
                  </label>
                  <select
                    id="sortQuery"
                    value={sortQuery}
                    onChange={(e) => {
                      setSortQuery(e.target.value);
                      setCurrentPage(0);
                    }}
                    className="w-full h-10 bg-primary-950  px-2.5 text-sm font-medium border border-border-color rounded focus:outline-none focus:border-primary-500 focus:transition-colors focus:duration-300"
                  >
                    <option value="">Default</option>
                    <option value="most_sold">Best Selling</option>
                    <option value="added_desc">Newest First</option>
                    <option value="added_asc">Oldest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                  </select>
                </div>

                {/* Grid View Toggle (Desktop Only) */}
                <div className="hidden lg:flex items-center gap-2">
                  <span className="w-full text-sm font-medium text-primary-700  mr-1">
                    View (2 / 3 / 4):
                  </span>
                  <div className="w-full h-10 bg-primary-950  px-2.5 flex items-center gap-1 border border-border-color rounded">
                    {[2, 3, 4].map((cols) => {
                      const Icon =
                        cols === 2
                          ? TfiLayoutGrid2Alt
                          : cols === 3
                            ? TfiLayoutGrid3Alt
                            : cols === 4
                              ? TfiLayoutGrid4Alt
                              : null;
                      return (
                        <button
                          key={cols}
                          onClick={() => setGridView(cols)}
                          className={`p-1.5 rounded-md transition-all duration-300 cursor-pointer ${
                            gridView === cols
                              ? "text-primary-500"
                              : "text-primary-600  hover:text-primary-500"
                          }`}
                          title={`${cols} Columns`}
                        >
                          <Icon size={16} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Items Per Page Dropdown */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="limitPerPage"
                    className="text-sm font-medium text-primary-700  whitespace-nowrap block"
                  >
                    Show:
                  </label>
                  <select
                    id="limitPerPage"
                    value={limitPerPage}
                    onChange={(e) => {
                      setLimitPerPage(Number(e.target.value));
                      setCurrentPage(0);
                    }}
                    className="w-full h-10 bg-primary-950  px-2.5 text-sm font-medium border border-border-color rounded focus:outline-none focus:border-primary-500 focus:transition-colors focus:duration-300"
                  >
                    {[4, 12, 20, 40, 80, 100].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Button (Mobile Only) */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden w-full h-10 flex items-center justify-center gap-2 bg-primary-950  rounded-md active:scale-95 transition-all duration-300 shadow-sm text-sm font-semibold"
              >
                <FaFilter size={14} />
                Filters
                {category && (
                  <span className="w-2 h-2 bg-primary-50 rounded-full animate-pulse"></span>
                )}
              </button>
            </div>

            {isPending ? (
              <div className="flex items-center justify-center py-20">
                <Loader />
              </div>
            ) : allProduct.length === 0 ? (
              <div className="surface-muted rounded-xl p-12 text-center">
                <div className="max-w-md mx-auto">
                  <h3 className="text-2xl font-bold mb-3">No Products Found</h3>
                  <p className="text-primary-700  mb-6">
                    {category
                      ? "Try adjusting your filters"
                      : "No products available"}
                  </p>
                  {(category || sortQuery) && (
                    <button
                      onClick={handleClearFilters}
                      className="btn danger-btn text-sm cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  )}
                  {searchQuery && (
                    <Link
                      to="/products"
                      onClick={() => setSearchQuery("")}
                      className="btn danger-btn text-sm cursor-pointer"
                    >
                      Clear Search
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className={getGridClass()}>
                  {allProduct?.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination Button */}
                <div className="px-2.5 py-1.5 lg:px-5 lg:py-2.5 flex justify-center lg:justify-end items-center gap-2.5 mt-5">
                  <button
                    className={
                      currentPage === 0
                        ? "bg-primary-200  text-primary-600 cursor-not-allowed rounded-md p-1.5"
                        : "bg-primary-950  rounded-md p-1.5 transition-colors duration-300 cursor-pointer"
                    }
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={currentPage === 0}
                  >
                    <IoIosArrowBack size={20}></IoIosArrowBack>
                  </button>

                  <span className="text-base font-medium ">
                    {currentPage + 1}
                  </span>

                  <button
                    className={
                      isPlaceholderData || !hasMore
                        ? "bg-primary-200  text-primary-600 cursor-not-allowed rounded-md p-1.5"
                        : "bg-primary-950  rounded-md p-1.5 transition-colors duration-300 cursor-pointer"
                    }
                    onClick={() => {
                      if (!isPlaceholderData && hasMore) {
                        setCurrentPage((prev) => prev + 1);
                      }
                    }}
                    disabled={isPlaceholderData || !hasMore}
                  >
                    <IoIosArrowForward size={20}></IoIosArrowForward>
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
