import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth/useAuth";
import SubscriptionPaymentTrigger from "../../components/SubscriptionPaymentModal/SubscriptionPaymentTrigger";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";
import useMarketingPacks from "../../hooks/useMarketingPacks/useMarketingPacks";
import MarketingBanner from "./MarketingBanner";
import useStatus from "../../hooks/useStatus/useStatus";
import usePlatform from "../../hooks/usePlatform/usePlatform";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader/Loader";

const MarketingPackages = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [purchasePackId, setPurchasePackId] = useState(null);
  const { user, refetchUser } = useAuth();
  const { isActive } = useStatus();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { platform } = usePlatform();

  const { isMarketingPacksLoading, isMarketingPacksFetching, marketingPacks } =
    useMarketingPacks({ category: selectedCategory });

  // Fetch owned selectedPacks for current user
  const { data: ownedSelectedPacks = [], isPending: isOwnedLoading } = useQuery(
    {
      queryKey: ["owned-pack", user?.identifier],
      queryFn: async () => {
        const res = await axiosSecure.get(
          "/marketing-purchases/already-purchased",
        );
        return res?.data?.data || [];
      },
      enabled: !!user?.identifier,
    },
  );

  const handleGetStarted = async (pack) => {
    if (!user) {
      const result = await Swal.fire({
        title: "Login Required",
        text: "Please login first to get started with this earning package.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
      });

      if (result.isConfirmed) {
        navigate("/auth/sign-in");
      }
      return;
    }

    setPurchasePackId(pack?._id);
    try {
      const res = await axiosSecure.post("/marketing-purchases", {
        packId: pack?._id,
      });

      await Swal.fire({
        title: "Success",
        text: res?.data?.message || "Package activated successfully!",
        icon: "success",
      });

      refetchUser();
      navigate("/dashboard/seller/my-marketing-purchases");
    } catch (error) {
      Swal.fire({
        title: "Get Started Failed",
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

  if (isOwnedLoading) {
    return <Loader />;
  }

  return (
    <section className="container mx-auto px-5 py-10 space-y-8">
      <MarketingBanner />

      <div className="text-center">
        <p className="metadata uppercase tracking-[0.2em]">Earn with intention</p>
        <h2 className="page-title mt-2">Marketing</h2>
        <p className="body-copy mt-2">
          Start your earning journey with our ready-to-work marketing packages.
        </p>
      </div>

      <div className="flex max-w-full gap-2 overflow-x-auto border-b border-border-color pb-1" role="tablist" aria-label="Marketing package categories">
        {[
          { label: "All", value: "" },
          { label: "FREE", value: "FREE" },
          { label: "Regular", value: "Regular" },
          { label: "Standard", value: "Standard" },
          { label: "Premium", value: "Premium" },
        ].map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`shrink-0 rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors duration-300 cursor-pointer ${
              selectedCategory === category.value
                ? "border-primary-600 text-primary-700 dark:text-primary-300"
                : "border-transparent text-text-secondary hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-300"
            }`}
            role="tab"
            aria-selected={selectedCategory === category.value}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div>
        {isMarketingPacksLoading || isMarketingPacksFetching ? (
          <p className="text-sm text-center">Loading marketing packages...</p>
        ) : marketingPacks.length === 0 ? (
          <div className="surface-muted rounded-xl p-10 text-center">
            <p className="body-copy">No marketing packages found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {marketingPacks.map((pack) => (
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
                  <p className="metadata uppercase tracking-wide text-primary-500">
                    {pack?.category || "Marketing"}
                  </p>
                  <h3 className="card-title line-clamp-1">
                    {pack?.title}
                  </h3>
                  <p className="metadata">
                    {pack?.name}
                  </p>
                  <p className="body-copy line-clamp-3">
                    {pack?.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <p className="text-base lg:text-lg font-bold text-primary-500">
                      BDT {pack?.price}
                    </p>
                    <p className="text-xs lg:text-sm font-normal text-end">
                      Duration:{" "}
                      <span className="text-primary-500 font-medium">
                        {pack?.durationDays} days
                      </span>
                    </p>
                    <p className="text-xs lg:text-sm font-normal col-span-2">
                      Work Value:{" "}
                      <span className="text-primary-500 font-medium ">
                        BDT {pack?.taskValue}
                      </span>
                    </p>
                    {pack?.taskQty && (
                      <p className="text-xs lg:text-sm font-normal col-span-2">
                        Work Quantity:{" "}
                        <span className="text-primary-500 font-medium ">
                          {pack?.taskQty}
                        </span>
                      </p>
                    )}
                  </div>
                  {console.log(
                    "isActive:",
                    isActive,
                    "paymentGateway:",
                    platform?.paymentGateway,
                  )}
                  {!user ? (
                    <Link
                      to="/auth/sign-in"
                      className="btn btn-outline w-full"
                    >
                      লগইন আবশ্যক
                    </Link>
                  ) : !isActive ? (
                    <>
                      {platform?.paymentGateway === "Manual" ? (
                        <Link
                          to={`/payment/Account/${platform?.accountActivationFee}`}
                          className="btn btn-primary w-full"
                        >
                          Become a Seller
                        </Link>
                      ) : platform?.paymentGateway === "ClickPay" ||
                        platform?.paymentGateway === "StarPay" ? (
                        <SubscriptionPaymentTrigger className="btn btn-primary w-full">
                          Become a Seller
                        </SubscriptionPaymentTrigger>
                      ) : null}
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleGetStarted(pack)}
                      disabled={
                        purchasePackId === pack?._id ||
                        !isActive ||
                        !user ||
                        ownedSelectedPacks.includes(pack?._id)
                      }
                      className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {ownedSelectedPacks.includes(pack?._id)
                        ? "ইতোমধ্যে কেনা হয়েছে"
                        : "Get Started"}
                    </button>
                  )}{" "}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MarketingPackages;
