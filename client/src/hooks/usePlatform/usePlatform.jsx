import React from "react";
import useAxiosPublic from "../useAxiosPublic/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const usePlatform = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch platform
  const {
    isPending: isPlatformPending,
    data: platform = {},
    refetch,
  } = useQuery({
    queryKey: ["platform"],
    queryFn: async () => {
      const res = await axiosPublic.get("platform");
      return res?.data && res?.data?.data;
    },
  });

  return { platform, isPlatformPending, refetch };
};

export default usePlatform;

