import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../useAxiosSecure/useAxiosSecure";

const useRole = () => {
  const axiosSecure = useAxiosSecure();

  const { isLoading: isRoleLoading, data } = useQuery({
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
    isRoleLoading,
    role: data?.role,
    isUser: data?.isUser,
    isAdmin: data?.isAdmin,
    isEmployee: data?.isEmployee,
    isSeller: data?.isSeller,
    isBlocked: data?.isBlocked,
  };
};

// const {isRoleLoading, role, isUser, isAdmin, isSeller, isBlocked} = useRole();

export default useRole;
