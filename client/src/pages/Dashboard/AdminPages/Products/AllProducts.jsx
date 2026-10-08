import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import { Link } from "react-router";
import { LuEye } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import useCategories from "../../../../hooks/useCategories/useCategories";
import Loader from "../../../../components/Loader/Loader";
import useSubCategories from "../../../../hooks/useSubCategories/useSubCategories";

const AllProducts = () => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Current page number
  const [searchQuery, setSearchQuery] = useState("");
  const [sortQuery, setSortQuery] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [availability, setAvailability] = useState("");
  const [limitPerPage, setLimitPerPage] = useState(5);
  const { isCategoriesLoading, isCategoriesFetching, categories } =
    useCategories();
  const { isSubCategoriesFetching, subCategories } = useSubCategories({
    categoryId: category,
  });

  const params = {
    currentPage,
    limitPerPage,
    searchQuery,
    category,
    subCategory,
    sortQuery,
    availability,
  };

  // Fetch all products
  const {
    isPending,
    isFetching,
    data: allProductResponse = {}, // Default to an empty object
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["products", params],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey;
      const res = await axiosPublic.get("/products", { params: p });

      return res.data;
    },

    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  // Destructure data and hasMore
  const { data: allProduct = [], totalProducts, hasMore } = allProductResponse;

  const handleResetAllQuery = () => {
    setIsResetQueryLoading(true); // Start the loading animation
    try {
      // Reset all states
      setSearchQuery("");
      setSortQuery("");
      setCategory("");
      setSubCategory("");
      setAvailability("");
      setLimitPerPage("5");
      setCurrentPage(0);
    } catch (error) {
      console.error(error);
    } finally {
      // Delay stopping the animation slightly
      setTimeout(() => {
        setIsResetQueryLoading(false); // Stop the loading animation
      }, 500);
    }
  };

  // Delete an product
  const handleDeleteProduct = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/products/${id}`);
          const successMessage = res?.data?.message || "Success";
          Swal.fire({
            title: "Deleted!",
            text: successMessage,
            icon: "success",
          });
          refetch();
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong!";
          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
          });
        }
      }
    });
  };

  if (
    (isPending && allProduct.length === 0) ||
    (isCategoriesLoading && (!categories || categories.length === 0))
  ) {
    return <Loader />;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      {/* Search and reset button */}
      <div className="flex flex-col items-start justify-between gap-3 border-b border-border-color pb-4 lg:flex-row lg:items-center">
        <h3 className="page-title text-xl">Products - {totalProducts}</h3>

        <div className="w-full lg:w-1/3 flex justify-between items-center gap-2.5">
          {/* Search Input */}
          <div className="w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search an product..."
              className="control h-10"
            />
          </div>

          <button onClick={handleResetAllQuery} className="btn-icon h-10 w-10">
            <TfiReload
              size={15}
              className={isResetQueryLoading ? "animate-spin" : ""}
            ></TfiReload>
          </button>
        </div>
      </div>

      {/* Filter, sort and pagination query */}
      <div className="py-2.5">
        <div className="flex flex-wrap justify-start items-center gap-2.5">
          {/* Category Selected */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="control h-10"
            >
              {isCategoriesFetching ? (
                <option>Loading...</option>
              ) : (
                <>
                  <option value="">Category (Default)</option>
                  {categories?.map((option, index) => (
                    <option key={index} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Sub-Category Selected */}
          <div className="relative">
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="control h-10"
            >
              {isSubCategoriesFetching ? (
                <option>Loading...</option>
              ) : (
                <>
                  <option value="">Sub-Category (Default)</option>
                  {subCategories?.map((option, index) => (
                    <option key={index} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Sort Selected */}
          <div className="relative">
            <select
              value={sortQuery}
              onChange={(e) => setSortQuery(e.target.value)}
              className="control h-10"
            >
              <option value="">Sort by (Default)</option>
              {[
                { value: "added_desc", label: "New Product" },
                { value: "added_asc", label: "Old Product" },
                { value: "price_desc", label: "Price (High to Low)" },
                { value: "price_asc", label: "Price (Low to High)" },
                { value: "most_sold", label: "Most Sold" },
              ]?.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Selected */}
          <div className="relative">
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="control h-10"
            >
              <option value="">Availability</option>
              {["In Stock", "Limited Stock", "Out of Stock"]?.map(
                (option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Page Limit selected */}
          <div className="relative flex items-center gap-2.5">
            <label htmlFor="limitPerPage" className="text-base font-medium ">
              Show
            </label>
            <select
              id="limitPerPage"
              value={limitPerPage}
              onChange={(e) => setLimitPerPage(e.target.value)}
              className="control h-10"
            >
              {["5", "10", "20", "50", "100"]?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Add Product */}
          <div className="relative">
            <Link
              to="/dashboard/admin/products/add-new"
              className="btn primary-btn h-10 w-full px-4"
            >
              Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-shell">
        <table className="table">
          <thead className="bg-section-bg">
            <tr className="h-10 text-sm text-nowrap font-normal text-center">
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Code</th>
              <th>Price</th>
              <th>Suggested</th>
              <th>Selling</th>
              <th>Profit</th>
              <th>Sold</th>
              <th>Verified</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="11">Fetching...</td>
              </tr>
            ) : allProduct?.length === 0 ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="11">No products found.</td>
              </tr>
            ) : (
              allProduct?.map((product, index) => (
                <tr
                  key={product._id}
                  className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color"
                >
                  <th>{currentPage * limitPerPage + index + 1}</th>
                  <td>
                    <div className="flex items-center justify-center gap-2 py-0.5 text-left">
                      <img
                        src={import.meta.env.VITE_IMAGE_URL + product.thumbnail}
                        alt={product.title}
                        className="h-10 w-10 shrink-0 rounded-md object-cover sm:h-12 sm:w-12"
                      />
                    </div>
                  </td>
                  <td className="min-w-56 max-w-sm whitespace-normal text-left text-sm font-medium leading-5">
                    <span className="line-clamp-2 wrap-break-word">
                      {product.title}
                    </span>
                  </td>
                  <td className="text-blue-500">{product.productCode}</td>
                  <td>৳ {product.price}</td>
                  <td>৳ {product.suggestedPrice}</td>
                  <td>
                    {product.sellingPrice ? `৳ ${product.sellingPrice}` : "-"}
                  </td>
                  <td>৳ {product.profit}</td>
                  <td>{product.sold}</td>
                  <td>{product.isVerified ? "Yes" : "No"}</td>
                  <td>
                    <div className="h-full flex justify-center items-center gap-2">
                      <Link
                        title="Update"
                        to={`/dashboard/admin/products/update/${product?._id}`}
                        className="btn-icon h-9 w-9 rounded-full"
                      >
                        <FaRegEdit
                          className="text-blue-500"
                          size={18}
                        ></FaRegEdit>
                      </Link>

                      <button
                        title="Delete"
                        onClick={() => handleDeleteProduct(product._id)}
                        className="btn-icon h-9 w-9 rounded-full border-danger/20 hover:bg-red-50"
                      >
                        <RiDeleteBin6Line
                          className="text-red-500"
                          size={18}
                        ></RiDeleteBin6Line>
                      </button>

                      <Link
                        title="View"
                        to={`/products/${product?._id}`}
                        state={{ product }}
                        className="btn-icon h-9 w-9 rounded-full"
                      >
                        <LuEye size={20} className="text-green-500" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Button */}
      <div className="px-2.5 py-1.5 lg:px-5 lg:py-2.5 flex justify-center lg:justify-end items-center gap-2.5">
        <button
          className={
            currentPage === 0
              ? "btn-icon cursor-not-allowed opacity-50"
              : "btn-icon"
          }
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          <IoIosArrowBack size={20}></IoIosArrowBack>
        </button>

        <span className="text-base font-medium ">{currentPage + 1}</span>

        <button
          className={
            isPlaceholderData || !hasMore
              ? "btn-icon cursor-not-allowed opacity-50"
              : "btn-icon"
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
    </div>
  );
};

export default AllProducts;
