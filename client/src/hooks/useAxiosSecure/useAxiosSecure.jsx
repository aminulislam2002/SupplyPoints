import axios from "axios";
import useAxiosPublic from "../useAxiosPublic/useAxiosPublic";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "/api",
  withCredentials: true,
});

const useAxiosSecure = () => {
  const axiosPublic = useAxiosPublic();

  // Add a request interceptor
  axiosSecure.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Add a response interceptor
  axiosSecure.interceptors.response.use(
    function onFulfilled(response) {
      // 2xx response data
      return response;
    },
    async (error) => {
      // Do something with response error

      const originalRequest = error.config;
      if (
        (error.response?.status === 401 || error.response?.status === 403) &&
        !originalRequest._retry
      ) {
        try {
          originalRequest._retry = true;

          const response = await axiosPublic.post("/users/refresh");
          localStorage.setItem("accessToken", response.data.accessToken);

          return axiosSecure(originalRequest);
        } catch (error) {
          console.log(error?.data?.message || error.message);
        }
      }
      return Promise.reject(error);
    },
  );

  return axiosSecure;
};

export default useAxiosSecure;
