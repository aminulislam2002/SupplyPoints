import useSubCategories from "../../../../hooks/useSubCategories/useSubCategories";
import { Link } from "react-router";

const SubCategories = ({ category }) => {
  const { isSubCategoriesFetching, subCategories } = useSubCategories({
    categoryId: category,
  });

  return (
    <div className="w-full">
      {isSubCategoriesFetching ? (
        <div className="flex justify-center py-5">
          <p className="text-xs text-text-secondary animate-pulse">
            Loading Sub Categories...
          </p>
        </div>
      ) : !subCategories || subCategories.length === 0 ? (
        <div className="py-5 text-center text-xs text-text-secondary bg-card-bg/50 rounded-xl border border-border-color">
          No Sub-Categories Found
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
          {subCategories?.map((subCategory) => (
            <Link
              key={subCategory._id}
              to={`/category/${category}/sub/${subCategory._id}`}
              className="surface group relative flex flex-col overflow-hidden rounded-xl border border-border-color bg-card-bg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary-500"
            >
              {/* Image Container with Zoom Effect */}
              <div className="relative aspect-square w-full overflow-hidden bg-primary-50/50 dark:bg-primary-950/20">
                <img
                  src={import.meta.env.VITE_IMAGE_URL + subCategory.image}
                  alt={subCategory.name}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>
              </div>

              {/* Title and Product Count Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-2.5 text-center flex flex-col items-center justify-end">
                <h4 className="text-xs sm:text-sm font-semibold text-white drop-shadow-sm line-clamp-1 transition-colors group-hover:text-primary-300">
                  {subCategory.name}
                </h4>
                <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                  পণ্য:{" "}
                  <span className="text-primary-400 font-bold">
                    {subCategory.productCount}
                  </span>{" "}
                  টি
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubCategories;
