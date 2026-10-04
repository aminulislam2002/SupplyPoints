import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../useAxiosPublic/useAxiosPublic";

const useCategories = () => {
  const axiosPublic = useAxiosPublic();

  const {
    isLoading: isCategoriesLoading,
    isFetching: isCategoriesFetching,
    data: categories = [],
  } = useQuery({
    queryKey: ["categoriesData"],
    queryFn: async () => {
      const res = await axiosPublic.get("/categories");

      return res?.data && res?.data?.data;
    },

    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });

  return { isCategoriesLoading, isCategoriesFetching, categories };
};

export default useCategories;

