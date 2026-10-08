import Loader from "../../../../components/Loader/Loader";
import useCategories from "../../../../hooks/useCategories/useCategories";
import { FaLayerGroup } from "react-icons/fa";
import { Link } from "react-router";

const TopCategories = () => {
  const { isCategoriesLoading, isCategoriesFetching, categories } =
    useCategories();

  if (isCategoriesLoading && (!categories || categories.length === 0)) {
    return <Loader />;
  }

  return (
    <section className="container mx-auto px-4 py-5 lg:py-10">
      {/* Main Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-3 border border-primary-200 dark:border-primary-800">
          <FaLayerGroup /> জনপ্রিয় ক্যাটাগরি
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
          আপনার পছন্দের পণ্য খুঁজে নিন
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-2 max-w-lg mx-auto">
          আমাদের বিভিন্ন ক্যাটাগরি থেকে আপনার প্রয়োজনীয় রিসেলিং পণ্যগুলো ব্রাউজ
          করুন।
        </p>
      </div>

      {isCategoriesFetching ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-sm font-medium text-text-secondary animate-pulse">
            Loading Categories...
          </p>
        </div>
      ) : !categories || categories.length === 0 ? (
        <div className="text-center py-12 bg-card-bg rounded-2xl border border-border-color shadow-sm">
          <h3 className="text-base font-semibold text-text-primary">
            No Categories Found
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 lg:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category?._id}
              to={
                category?.name?.trim() === "নতুন পণ্য"
                  ? "/category/new-product"
                  : `/category/${category?._id}`
              }
              className="group flex flex-col items-center rounded-xl border border-border-color bg-card-bg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg"
            >
              <div className="aspect-square w-full overflow-hidden rounded-t-lg border-b border-border-color bg-primary-50/50 dark:bg-primary-950/20">
                <img
                  src={import.meta.env.VITE_IMAGE_URL + category?.image}
                  alt={category?.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="p-2.5 w-full truncate text-center text-xs font-semibold text-text-primary transition-colors group-hover:text-primary-600 sm:text-sm">
                {category?.name}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default TopCategories;
