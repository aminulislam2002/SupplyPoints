import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "/api",
  withCredentials: true,
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;

