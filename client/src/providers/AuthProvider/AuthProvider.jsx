/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";
import Swal from "sweetalert2";
// Create a context for user data
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      localStorage.setItem("accessToken", token);

      // Redirect to the home page
      window.history.replaceState(
        {},
        document.title,
        "/dashboard/seller/overview"
      );
      window.location.href = "/dashboard/seller/overview";

      // Force reload (important)
      window.location.reload();
    }
  }, []);

  const { isPending: isUserPending, data: user = null } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/users/me");
        return res?.data?.user || null;
      } catch (error) {
        console.log(error?.data?.message || error.message);
        return null;
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loggedOut = async () => {
    try {
      await axiosSecure.post("/users/logout");

      Swal.fire({
        title: "Logged Out",
        text: "You have been logged out successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      Swal.fire({
        title: "Failed to Logout",
        text: "An error occurred while logging out. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      localStorage.removeItem("accessToken");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  };

  const values = {
    user,
    isUserPending,
    loggedOut,
    refetchUser: () => queryClient.invalidateQueries(["user"]),
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

