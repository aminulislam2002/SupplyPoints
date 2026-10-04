import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Loader from "../../components/Loader/Loader";
import usePlatform from "../../hooks/usePlatform/usePlatform";
import usePromotionCategories from "../../hooks/usePromotionCategories/usePromotionCategories";
import usePromotionPacks from "../../hooks/usePromotionPacks/usePromotionPacks";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";
import useAuth from "../../hooks/useAuth/useAuth";

const PromotionCategoriesAndPacks = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [purchasePackId, setPurchasePackId] = useState(null);
  const { platform } = usePlatform();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user, refetchUser } = useAuth();

  const {
    isPromotionCategoriesLoading,
    isPromotionCategoriesFetching,
    promotionCategories,
  } = usePromotionCategories();

  const { isPromotionPacksLoading, isPromotionPacksFetching, promotionPacks } =
    usePromotionPacks({ categoryId: selectedCategory });

  const selectedCategoryName = useMemo(() => {
    if (!selectedCategory) {
      return "All Promotion Packs";
    }

    const found = promotionCategories.find(
      (cat) => cat?._id === selectedCategory,
    );
    return found?.name || "Promotion Packs";
  }, [promotionCategories, selectedCategory]);

  const handlePurchaseNow = async (pack) => {
    if (!user) {
      const result = await Swal.fire({
        title: "Login Required",
        text: "Please login first to purchase this promotion pack.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
      });

      if (result.isConfirmed) {
        navigate("/auth/sign-in");
      }
      return;
    }

    const { value: promotionLink } = await Swal.fire({
      title: "Enter Promotion Link",
      input: "url",
      inputLabel: "Promotion Link",
      inputPlaceholder: "https://facebook.com/your-post-link",
      confirmButtonText: "Purchase Now",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Promotion link is required!";
        }

        return undefined;
      },
    });

    if (!promotionLink) {
      return;
    }

    setPurchasePackId(pack?._id);
    try {
      const res = await axiosSecure.post("/promotion-purchases", {
        packId: pack?._id,
        promotionLink,
      });

      await Swal.fire({
        title: "Success",
        text: res?.data?.message || "Purchase completed successfully!",
        icon: "success",
      });

      refetchUser();
      navigate("/dashboard/seller/my-purchases");
    } catch (error) {
      Swal.fire({
        title: "Purchase Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong!",
        icon: "error",
      });
    } finally {
      setPurchasePackId(null);
    }
  };

  if (isPromotionCategoriesLoading && promotionCategories.length === 0) {
    return <Loader />;
  }

  return (
    <section className="container mx-auto space-y-10 px-5 py-10">
      <div>
        <div className="mb-4">
          <p className="metadata uppercase tracking-[0.2em] text-primary-600">
            Choose a channel
          </p>
          <h2 className="page-title mt-2">
          Promotion Categories
          </h2>
        </div>

        {isPromotionCategoriesFetching ? (
          <p className="text-sm text-center">Loading categories...</p>
        ) : promotionCategories.length === 0 ? (
          <p className="text-sm text-center">No promotion categories found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <button
              onClick={() => setSelectedCategory("")}
              className={`min-h-12 rounded-lg border px-3 py-2 text-left text-sm font-semibold transition-all duration-300 cursor-pointer ${
                selectedCategory === ""
                  ? "border-primary-600 bg-primary-700 text-white"
                  : "surface hover:border-primary-400"
              }`}
            >
              All Categories
            </button>

            {promotionCategories.map((category) => (
              <button
                key={category?._id}
                onClick={() => setSelectedCategory(category?._id)}
                className={`flex min-h-12 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  selectedCategory === category?._id
                    ? "border-primary-600 bg-primary-700 text-white"
                    : "surface hover:border-primary-400"
                }`}
              >
                <img
                  src={import.meta.env.VITE_IMAGE_URL + category?.image}
                  alt={category?.name}
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="truncate">{category?.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="page-title">
          {selectedCategoryName}
        </h2>
        <span className="metadata hidden sm:block">Curated packages</span>
        </div>

        {isPromotionPacksLoading || isPromotionPacksFetching ? (
          <p className="text-sm text-center">Loading promotion packs...</p>
        ) : promotionPacks.length === 0 ? (
          <p className="surface-muted rounded-lg p-10 text-center text-sm">
            No promotion packs found for this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {promotionPacks.map((pack) => {
              return (
                <div
                  key={pack?._id}
                  className="card overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                >
                  <img
                    src={import.meta.env.VITE_IMAGE_URL + pack?.image}
                    alt={pack?.name}
                    className="w-full h-52 object-cover"
                  />

                  <div className="p-4 space-y-2.5">
                    <p className="text-xs uppercase tracking-wide text-primary-500 font-semibold">
                      {pack?.category?.name || "Promotion"}
                    </p>
                    <h3 className="text-lg font-bold line-clamp-1">
                      {pack?.title}
                    </h3>
                    <p className="metadata">
                      {pack?.name}
                    </p>
                    <p className="body-copy line-clamp-3">
                      {pack?.description}
                    </p>

                    <div className="flex items-center justify-between text-sm pt-1">
                      <p className="font-semibold text-primary-600 dark:text-primary-400">
                        BDT {pack?.price}
                      </p>
                      <p className="font-medium">
                        Duration: {pack?.durationDays} days
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePurchaseNow(pack)}
                      disabled={purchasePackId === pack?._id}
                      className="btn btn-primary w-full"
                    >
                      {purchasePackId === pack?._id
                        ? "Processing..."
                        : "Start Now"}
                    </button>

                    <p className="metadata text-center">
                      Need manual support? WhatsApp:{" "}
                      {platform?.whatsappNumber || "8801700000000"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PromotionCategoriesAndPacks;
