import { useRef, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useParams } from "react-router";
import useAxiosPublic from "../../../hooks/useAxiosPublic/useAxiosPublic";
import Loader from "../../../components/Loader/Loader";
import ProductCard from "../ProductCard/ProductCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";

const ProductsByCategory = ({ isNewProduct = false }) => {
  const { category, subCategory } = useParams();
  const axiosPublic = useAxiosPublic();
  const productsRef = useRef(null);

  // Pagination & Layout states
  const [currentPage, setCurrentPage] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(50);
  const [sortQuery, setSortQuery] = useState("");

  // Responsive grid view state
  const getDefaultGridView = () => {
    if (typeof window === "undefined") return 2;
    const width = window.innerWidth;
    if (width >= 1280) return 5; // xl/
    if (width >= 1024) return 4; // lg
    if (width >= 640) return 3; // md/sm
    return 2; // xs/mobile
  };

  const [gridView, setGridView] = useState(getDefaultGridView);

  // Fetch sub-category details
  const {
    isLoading: isSubCategoryLoading,
    isFetching: isSubCategoryFetching,
    data: subCategoryData = {},
  } = useQuery({
    queryKey: ["subCategoryById", subCategory],
    queryFn: async () => {
      if (!subCategory) return {};

      const res = await axiosPublic.get(`/sub-categories/id/${subCategory}`);

      return res?.data && res?.data?.data;
    },

    enabled: !!subCategory,
    refetchOnWindowFocus: true,
  });

  const params = {
    currentPage,
    limitPerPage,
    category: isNewProduct ? undefined : category,
    subCategory: isNewProduct ? undefined : subCategory,
    sortQuery,
  };

  // Fetch all product
  const {
    data: response = {},
    isPending,
    isPlaceholderData,
  } = useQuery({
    queryKey: [isNewProduct ? "newProducts" : "productsByCategory", params],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey;
      const res = await axiosPublic.get("/products/on-display", { params: p });

      return res?.data && res?.data;
    },

    placeholderData: keepPreviousData,
  });

  const { data: allProduct = [], hasMore } = response;

  const productsLoading = isPending && allProduct?.length === 0;

  // Actions
  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortQuery(val);
    setCurrentPage(0);
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLimitChange = (e) => {
    setLimitPerPage(Number(e.target.value));
    setCurrentPage(0);
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Dynamic grid class based on selected grid view
  const getGridClass = () => {
    const baseClass = "grid gap-2.5 sm:gap-3.5";
    switch (gridView) {
      case 1:
        return `${baseClass} grid-cols-1`;
      case 2:
        return `${baseClass} grid-cols-2`;
      case 3:
        return `${baseClass} grid-cols-2 sm:grid-cols-3`;
      case 4:
        return `${baseClass} grid-cols-2 sm:grid-cols-3 md:grid-cols-4`;
      case 5:
        return `${baseClass} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5`;
      case 6:
        return `${baseClass} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6`;
      default:
        return `${baseClass} grid-cols-2`;
    }
  };

  if (productsLoading || isSubCategoryLoading) {
    return <Loader />;
  }

  const breadcrumbItems = isNewProduct
    ? [
        { label: "Home", link: "/" },
        { label: "Categories", link: "/reselling" },
        { label: "নতুন পণ্য", active: true },
      ]
    : [
        { label: "Home", link: "/" },
        { label: "Categories", link: "/reselling" },
        { label: subCategoryData?.name || "Sub-Category", active: true },
      ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <div
        ref={productsRef}
        className="container mx-auto px-3 py-4 sm:px-4 sm:py-8"
      >
        {/* Top Header & Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-2.5 justify-between items-center bg-card-bg border border-border-color p-2.5 lg:p-4 rounded-xl mb-5 shadow-xs">
          {/* Title & Item Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-nowrap">
                {isNewProduct
                  ? "নতুন পণ্য"
                  : isSubCategoryFetching
                    ? "Products"
                    : subCategoryData?.name || "Products"}
              </h1>
            </div>
          </div>

          {/* Controls Row: Sort, View Toggle, and Show Limit */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3">
            {/* Sort Control */}
            <div className="flex items-center gap-1">
              <span className="text-sm font-normal text-text-secondary">
                Sort:
              </span>
              <select
                value={sortQuery}
                onChange={handleSortChange}
                className="bg-card-bg border border-border-color text-xs font-medium rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary-500 transition-colors cursor-pointer"
              >
                <option value="">Default</option>
                <option value="price_desc">Highest Price</option>
                <option value="price_asc">Lowest Price</option>
                <option value="added_desc">New Arrival</option>
                <option value="added_asc">Oldest First</option>
                <option value="most_sold">Most Sold</option>
              </select>
            </div>

            {/* Grid View Toggle  */}
            <div className="flex items-center gap-3 ml-auto sm:ml-0">
              <span className="text-sm font-normal text-text-secondary">
                View:
              </span>
              <div className="flex items-center bg-card-bg p-1 border border-border-color rounded-lg shadow-2xs">
                {[1, 2, 3, 4, 5, 6].map((cols) => {
                  let visibilityClass = "flex";
                  if (cols === 3 || cols === 4) {
                    visibilityClass = "hidden sm:flex";
                  } else if (cols === 5 || cols === 6) {
                    visibilityClass = "hidden lg:flex";
                  }

                  return (
                    <button
                      key={cols}
                      onClick={() => {
                        setGridView(cols);
                      }}
                      className={`px-3 py-1.5 rounded-md transition-all duration-300 cursor-pointer text-xs font-bold ${visibilityClass} items-center justify-center ml-1 ${
                        gridView === cols
                          ? "bg-primary-600 text-white shadow-xs"
                          : "bg-section-bg text-text-secondary hover:text-primary-600 dark:hover:text-primary-400"
                      }`}
                      title={`${cols} Columns`}
                    >
                      {cols}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {allProduct?.length > 0 ? (
          <div className={getGridClass()}>
            {allProduct?.map((product) => (
              <div key={product?._id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="surface-muted rounded-xl p-12 text-center border border-border-color">
            <p className="text-sm font-semibold text-text-secondary">
              No products found in this collection.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {allProduct?.length > 0 && !isNewProduct && (
          <div className="flex justify-between items-center mt-5 lg:mt-10">
            {/* Limit Per Page Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-normal text-text-secondary">
                Show:
              </span>

              <select
                value={limitPerPage}
                onChange={handleLimitChange}
                className="bg-card-bg border border-border-color text-xs font-medium rounded-lg px-2.5 py-2.5 focus:outline-none focus:border-primary-500 transition-colors cursor-pointer"
              >
                {[4, 12, 20, 40, 80, 99]?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="px-3 py-4 flex justify-center lg:justify-end items-center gap-4">
              <button
                className={
                  currentPage === 0
                    ? "bg-slate-200 dark:bg-slate-800 text-text-secondary/50 cursor-not-allowed rounded-lg p-2"
                    : "bg-primary-600 text-white rounded-lg p-2 hover:bg-primary-700 transition-colors duration-300 cursor-pointer shadow-sm"
                }
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 0));
                  productsRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                disabled={currentPage === 0}
              >
                <IoIosArrowBack size={18} />
              </button>

              <span className="text-sm font-semibold">{currentPage + 1}</span>

              <button
                className={
                  isPlaceholderData || !hasMore
                    ? "bg-slate-200 dark:bg-slate-800 text-text-secondary/50 cursor-not-allowed rounded-lg p-2"
                    : "bg-primary-600 text-white rounded-lg p-2 hover:bg-primary-700 transition-colors duration-300 cursor-pointer shadow-sm"
                }
                onClick={() => {
                  if (!isPlaceholderData && hasMore) {
                    setCurrentPage((prev) => prev + 1);
                    productsRef.current?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                disabled={isPlaceholderData || !hasMore}
              >
                <IoIosArrowForward size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsByCategory;
