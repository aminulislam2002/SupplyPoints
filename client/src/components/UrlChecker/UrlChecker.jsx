import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic/useAxiosPublic";

const UrlChecker = ({ productUrl }) => {
  const axiosPublic = useAxiosPublic();

  const { isFetching, data: products = [] } = useQuery({
    queryKey: ["isMatchingUrl", productUrl],
    queryFn: async () => {
      const res = await axiosPublic.get("/products", {
        params: { searchQuery: productUrl },
      });
      return res?.data && res?.data?.data;
    },
    enabled: Boolean(productUrl),
    placeholderData: keepPreviousData,
  });

  // Simple UI: show checking / exists / available states
  const renderStatus = () => {
    if (!productUrl) return null;
    if (isFetching)
      return <p className="text-sm text-primary-600">Checking...</p>;
    if (products && products?.length > 0) {
      return (
        <p className="text-sm text-yellow-600">This URL is already in use.</p>
      );
    }
    return <p className="text-sm text-green-600">URL is available.</p>;
  };

  return <div className="mt-1">{renderStatus()}</div>;
};

export default UrlChecker;
