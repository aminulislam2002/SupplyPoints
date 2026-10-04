import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../useAxiosSecure/useAxiosSecure";

const useRole = () => {
  const axiosSecure = useAxiosSecure();

  const { isPending: isRolePending, data } = useQuery({
    queryKey: ["role"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/users/role`);
        return res?.data || {};
      } catch (error) {
        console.log(error?.data?.message || error.message);
      }
    },
  });

  return {
    isRolePending,
    role: data?.role,
    isUser: data?.isUser,
    isAdmin: data?.isAdmin,
    isSeller: data?.isSeller,
    isBlocked: data?.isBlocked,
  };
};

// const {isRolePending, role, isUser, isAdmin, isSeller, isBlocked} = useRole();

export default useRole;

