import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from "../../components/Loader/Loader";
import useAxiosPublic from "../../hooks/useAxiosPublic/useAxiosPublic";
import SubCategories from "../HomePage/Sections/TopCategories/SubCategories";
import { FaChevronRight } from "react-icons/fa";

const SubCategoriesByCategory = () => {
  const { category: categoryId } = useParams();
  const axiosPublic = useAxiosPublic();

  const {
    data: category = {},
    isPending: isCategoryLoading,
    isFetching: isCategoryFetching,
  } = useQuery({
    queryKey: ["categoryById", categoryId],
    queryFn: async () => {
      const response = await axiosPublic.get(`/categories/${categoryId}`);
      return response?.data?.data || {};
    },
    enabled: Boolean(categoryId),
    refetchOnWindowFocus: false,
  });

  if (isCategoryLoading) {
    return <Loader />;
  }

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Categories", link: "/reselling" },
    { label: category?.name || "Category", active: true },
  ];

  return (
    <div className="relative w-full h-full">
      <Breadcrumb items={breadcrumbItems} />

      <main className="container mx-auto px-4 py-5 sm:px-5 lg:py-10">
        {isCategoryFetching ? (
          <div className="flex justify-center py-12">
            <p className="text-sm font-medium text-text-secondary animate-pulse">
              Loading Category...
            </p>
          </div>
        ) : !category?._id ? (
          <div className="rounded-2xl border border-border-color bg-card-bg py-12 text-center shadow-sm">
            <h1 className="text-base font-semibold text-text-primary">
              Category Not Found
            </h1>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Category Title Header */}
            <div className="relative flex items-center justify-between bg-linear-to-r from-primary-500/10 via-card-bg to-transparent border-l-4 border-primary-600 dark:border-primary-500 px-4 py-3 rounded-r-xl shadow-xs">
              <div className="flex items-center gap-3">
                <h3 className="text-base sm:text-xl font-bold tracking-tight text-text-primary flex items-center gap-2">
                  {category?.name}
                </h3>
              </div>

              {/* Optional Action / Pill indicator */}
              <Link
                to="/reselling"
                className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 cursor-pointer hover:underline group"
              >
                <span>সব দেখুন</span>
                <FaChevronRight className="text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <SubCategories category={categoryId} />
          </div>
        )}
      </main>
    </div>
  );
};

export default SubCategoriesByCategory;
