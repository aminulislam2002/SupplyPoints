import useSubCategories from "../../../../hooks/useSubCategories/useSubCategories";
import { Link } from "react-router";

const SubCategories = ({ category }) => {
  const { isSubCategoriesFetching, subCategories } = useSubCategories({
    categoryId: category,
  });

  return (
    <section className="py-5">
      {isSubCategoriesFetching ? (
        <>
          <h3 className="text-center">Loading Sub Categories...</h3>
        </>
      ) : subCategories.length === 0 ? (
        <>
          <h3 className="text-center">No Sub-Categories Found</h3>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
          {subCategories?.map((subCategory) => (
            <Link
              key={subCategory._id}
              to={`/category/${category}/sub/${subCategory._id}`}
              className="surface group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <img
                src={import.meta.env.VITE_IMAGE_URL + subCategory.image}
                alt={subCategory.name}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-slate-950/75 px-2 py-2">
                <h4 className="text-center text-xs font-semibold text-white md:text-sm">
                  {subCategory.name} (
                  <span className="text-red-500">
                    {subCategory.productCount}
                  </span>
                  )
                </h4>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default SubCategories;
