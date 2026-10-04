import { useRef, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic/useAxiosPublic";
import Loader from "../../../components/Loader/Loader";
import ProductCard from "../ProductCard/ProductCard";

const MatchingProducts = ({ category, subCategory }) => {
  const axiosPublic = useAxiosPublic();
  const productsRef = useRef(null);

  // Configurable paging
  const INITIAL_LIMIT = 10;
  const STEP = 10;
  const [limitPerPage, setLimitPerPage] = useState(INITIAL_LIMIT);
  const [sortQuery, setSortQuery] = useState("");

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
    limitPerPage,
    category,
    subCategory,
    sortQuery,
  };

  // Fetch all product
  const {
    data: response = {},
    isPending,
    isFetching,
    fetchStatus,
  } = useQuery({
    queryKey: ["matchingProducts", params],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey;
      const res = await axiosPublic.get("/products/on-display", { params: p });

      return res?.data && res?.data;
    },

    placeholderData: keepPreviousData,
  });

  const { data: allProduct = [], hasMore } = response;

  const productsLoading = isPending && allProduct?.length === 0;
  const loadingMore = fetchStatus === "fetching" && !productsLoading;

  // Button states
  const canShowMore = hasMore && !loadingMore;
  const canShowLess = limitPerPage > INITIAL_LIMIT && !loadingMore;

  // Actions
  const handleShowMore = () => {
    if (canShowMore) {
      setLimitPerPage((prev) => prev + STEP);
    }
  };

  const handleShowLess = () => {
    if (canShowLess) {
      const next = Math.max(INITIAL_LIMIT, limitPerPage - STEP);
      setLimitPerPage(next);
      // Smoothly take user to the grid top
      productsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortQuery(val);
    // reset pagination and scroll to top on sort change
    setLimitPerPage(INITIAL_LIMIT);
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (productsLoading || isSubCategoryLoading) {
    return <Loader></Loader>;
  }

  return (
    <div ref={productsRef} className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-border-color pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Curated collection</p>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        {isSubCategoryFetching
          ? "Products"
          : subCategoryData?.name || "Products"}
      </h1>
      </div>

      {/* Sort control */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-text-secondary">
            Sort by:
          </label>
          <select
            value={sortQuery}
            onChange={handleSortChange}
            className="control h-10 px-3 text-sm"
          >
            <option value="">Default</option>=
            {[
              { value: "price_desc", label: "Highest Price" },
              { value: "price_asc", label: "Lowest Price" },
              { value: "added_desc", label: "New Arrival" },
              { value: "added_asc", label: "Oldest First" },
              { value: "most_sold", label: "Most Sold" },
            ]?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        </div>
      </div>

      {allProduct?.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {allProduct?.map((product) => (
            <div key={product?._id}>
              <ProductCard product={product}></ProductCard>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-base font-medium text-center">No products found.</p>
      )}

      {/* Show More / Show Less buttons */}
      <div className="flex justify-center items-center gap-3 mt-10 lg:mt-12 2xl:mt-14">
        <button
          className={`w-auto h-12 px-5 rounded text-base font-medium ${
            canShowMore ? "rounded-lg bg-primary-600 px-5 text-primary-50 shadow-sm hover:bg-primary-700 cursor-pointer" : "hidden"
          } transition-colors duration-300`}
          onClick={handleShowMore}
          disabled={!canShowMore}
        >
          {isFetching ? "Loading..." : "Show More"}
        </button>

        <button
          className={`w-auto h-12 px-5 rounded text-base font-medium ${
            canShowLess
              ? "rounded-lg bg-danger px-5 text-primary-50 shadow-sm hover:bg-red-700 cursor-pointer"
              : "hidden"
          } transition-colors duration-300`}
          onClick={handleShowLess}
          disabled={!canShowLess}
        >
          Show Less
        </button>
      </div>
    </div>
  );
};

export default MatchingProducts;
