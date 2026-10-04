import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../useAxiosSecure/useAxiosSecure";

const useStatus = () => {
  const axiosSecure = useAxiosSecure();

  const { isPending: isStatusPending, data } = useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/users/status`);
        return res?.data || {};
      } catch (error) {
        console.log(error?.data?.message || error.message);
      }
    },
  });

  return {
    isStatusPending,
    status: data?.status,
    isInactive: data?.isInactive,
    isActive: data?.isActive,
    isPending: data?.isPending,
  };
};

// const {isStatusPending, status, isInactive, isActive, isPending} = useStatus();

export default useStatus;

