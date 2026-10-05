import Loader from "../../../../components/Loader/Loader";
import useCategories from "../../../../hooks/useCategories/useCategories";
import SubCategories from "./SubCategories";

const TopCategories = () => {
  const { isCategoriesLoading, isCategoriesFetching, categories } =
    useCategories();

  if (isCategoriesLoading && categories.length === 0) {
    return <Loader></Loader>;
  }

  return (
    <section className="container mx-auto px-4 py-10">
      {isCategoriesFetching ? (
        <>
          <h3 className="text-center">Loading Categories...</h3>
        </>
      ) : categories.length === 0 ? (
        <>
          <h3 className="text-center">No Categories Found</h3>
        </>
      ) : (
        categories?.map((category) => (
          <>
            <h1 className="mb-1 border-l-2 border-primary-500 pl-3 text-left text-xl font-bold tracking-tight text-text-primary md:text-2xl">
              {category?.name}
            </h1>

            <SubCategories key={category?._id} category={category?._id} />
          </>
        ))
      )}
    </section>
  );
};

export default TopCategories;
