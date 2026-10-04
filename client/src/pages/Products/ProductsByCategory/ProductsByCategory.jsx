import { useRef, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useParams } from "react-router";
import useAxiosPublic from "../../../hooks/useAxiosPublic/useAxiosPublic";
import Loader from "../../../components/Loader/Loader";
import ProductCard from "../ProductCard/ProductCard";

const ProductsByCategory = () => {
  const { category, subCategory } = useParams();
  const axiosPublic = useAxiosPublic();
  const productsRef = useRef(null);

  // Configurable paging
  const INITIAL_LIMIT = 50;
  const STEP = 50;
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
    queryKey: ["productsByCategory", params],
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
    <div ref={productsRef} className="container mx-auto px-5 py-10">
      <div className="mb-8 text-center">
        <p className="metadata uppercase tracking-[0.2em]">Collection</p>
        <h1 className="page-title mt-2">
        {isSubCategoryFetching
          ? "Products"
          : subCategoryData?.name || "Products"}
        </h1>
      </div>

      {/* Sort control */}
      <div className="flex justify-end items-center mb-3">
        <div className="flex items-center gap-2">
          <label className="metadata">
            Sort by:
          </label>
          <select
            value={sortQuery}
            onChange={handleSortChange}
            className="select control h-10 min-w-44 text-sm md:text-base"
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

      {allProduct?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5">
          {allProduct?.map((product) => (
            <div key={product?._id}>
              <ProductCard product={product}></ProductCard>
            </div>
          ))}
        </div>
      ) : (
        <div className="surface-muted rounded-xl p-10 text-center">
          <p className="body-copy">No products found.</p>
        </div>
      )}

      {/* Show More / Show Less buttons */}
      <div className="flex justify-center items-center gap-3 mt-10 lg:mt-12 2xl:mt-14">
        <button
          className={`btn btn-secondary h-12 ${
            canShowMore ? "cursor-pointer" : "hidden"
          } transition-colors duration-300`}
          onClick={handleShowMore}
          disabled={!canShowMore}
        >
          {isFetching ? "Loading..." : "Show More"}
        </button>

        <button
          className={`btn btn-danger h-12 ${
          canShowLess ? "cursor-pointer" : "hidden"
          }`}
          onClick={handleShowLess}
          disabled={!canShowLess}
        >
          Show Less
        </button>
      </div>
    </div>
  );
};

export default ProductsByCategory;
