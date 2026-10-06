import { FaChevronRight } from "react-icons/fa6";
import Loader from "../../../../components/Loader/Loader";
import useCategories from "../../../../hooks/useCategories/useCategories";
import SubCategories from "./SubCategories";
import { FaLayerGroup } from "react-icons/fa";

const CategoriesAdnSubCategories = () => {
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
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category?._id} className="space-y-4">
              {/* Category Title Header */}
              <div className="relative flex items-center justify-between bg-linear-to-r from-primary-500/10 via-card-bg to-transparent border-l-4 border-primary-600 dark:border-primary-500 px-4 py-3 rounded-r-xl shadow-xs">
                <div className="flex items-center gap-3">
                  <h3 className="text-base sm:text-xl font-bold tracking-tight text-text-primary flex items-center gap-2">
                    {category?.name}
                  </h3>
                </div>
              </div>

              {/* SubCategories Grid Container */}
              <SubCategories category={category?._id} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoriesAdnSubCategories;
