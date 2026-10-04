import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../useAxiosPublic/useAxiosPublic";

const useMarketingPacks = ({ category = "" } = {}) => {
  const axiosPublic = useAxiosPublic();

  const {
    isLoading: isMarketingPacksLoading,
    isFetching: isMarketingPacksFetching,
    data: marketingPacks = [],
  } = useQuery({
    queryKey: ["marketingPacksData", category],
    queryFn: async () => {
      const params = {};

      if (category) {
        params.category = category;
      }

      const res = await axiosPublic.get("/marketing-packs", { params });
      return res?.data?.data || [];
    },
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });

  return {
    isMarketingPacksLoading,
    isMarketingPacksFetching,
    marketingPacks,
  };
};

export default useMarketingPacks;
