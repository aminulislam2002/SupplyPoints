import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../useAxiosPublic/useAxiosPublic";

const useSubCategories = ({ categoryId }) => {
  const axiosPublic = useAxiosPublic();

  const {
    isLoading: isSubCategoriesLoading,
    isFetching: isSubCategoriesFetching,
    data: subCategories = [],
  } = useQuery({
    queryKey: ["sub-categoriesData", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];

      const res = await axiosPublic.get(
        `/sub-categories/category/${categoryId}`,
      );

      return res?.data && res?.data?.data;
    },

    enabled: !!categoryId,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });

  return { isSubCategoriesLoading, isSubCategoriesFetching, subCategories };
};

export default useSubCategories;

