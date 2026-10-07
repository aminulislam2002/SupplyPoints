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
        <div className="grid grid-cols-3 gap-2.5 lg:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {subCategories?.map((subCategory) => (
            <Link
              key={subCategory._id}
              to={`/category/${category}/sub/${subCategory._id}`}
              className="group flex flex-col items-center rounded-xl border border-border-color bg-card-bg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg"
            >
              <div className="aspect-square w-full overflow-hidden rounded-t-lg border-b border-border-color bg-primary-50/50 dark:bg-primary-950/20">
                <img
                  src={import.meta.env.VITE_IMAGE_URL + subCategory.image}
                  alt={subCategory.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <h3 className="p-2.5 w-full truncate text-center text-xs font-semibold text-text-primary transition-colors group-hover:text-primary-600 sm:text-sm">
                {subCategory?.name}{" "}
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary-700 dark:text-primary-400 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                  {subCategory.productCount}
                </span>
              </h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubCategories;
