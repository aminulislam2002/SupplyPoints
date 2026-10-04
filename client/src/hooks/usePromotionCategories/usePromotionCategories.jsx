import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../useAxiosPublic/useAxiosPublic";

const usePromotionCategories = () => {
  const axiosPublic = useAxiosPublic();

  const {
    isLoading: isPromotionCategoriesLoading,
    isFetching: isPromotionCategoriesFetching,
    data: promotionCategories = [],
  } = useQuery({
    queryKey: ["promotionCategoriesData"],
    queryFn: async () => {
      const res = await axiosPublic.get("/promotion-categories");
      return res?.data?.data || [];
    },
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });

  return {
    isPromotionCategoriesLoading,
    isPromotionCategoriesFetching,
    promotionCategories,
  };
};

export default usePromotionCategories;
