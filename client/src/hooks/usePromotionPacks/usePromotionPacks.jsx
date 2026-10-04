import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../useAxiosPublic/useAxiosPublic";

const usePromotionPacks = ({ categoryId = "" } = {}) => {
  const axiosPublic = useAxiosPublic();

  const {
    isLoading: isPromotionPacksLoading,
    isFetching: isPromotionPacksFetching,
    data: promotionPacks = [],
  } = useQuery({
    queryKey: ["promotionPacksData", categoryId],
    queryFn: async () => {
      const params = {};

      if (categoryId) {
        params.category = categoryId;
      }

      const res = await axiosPublic.get("/promotion-packs", { params });
      return res?.data?.data || [];
    },
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });

  return {
    isPromotionPacksLoading,
    isPromotionPacksFetching,
    promotionPacks,
  };
};

export default usePromotionPacks;
