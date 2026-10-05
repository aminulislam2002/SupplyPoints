import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link, useNavigate } from "react-router";
import useStatus from "../../../hooks/useStatus/useStatus";
import useAuth from "../../../hooks/useAuth/useAuth";
import SubscriptionPaymentTrigger from "../../../components/SubscriptionPaymentModal/SubscriptionPaymentTrigger";
import usePlatform from "../../../hooks/usePlatform/usePlatform";

const ProductCard = ({ product }) => {
  const { isActive } = useStatus();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { platform } = usePlatform();

  const getPriceDisplay = () => {
    if (!user) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate("/auth/sign-in");
          }}
          className="text-xs text-red-500 font-normal text-nowrap hover:underline bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded cursor-pointer"
        >
          লগইন করুন
        </button>
      );
    }

    if (!isActive) {
      return (
        <>
          {platform?.paymentGateway === "Manual" ? (
            <Link
              to={`/payment/Account/${platform?.accountActivationFee}`}
              className="text-xs text-primary-500 font-normal text-nowrap hover:underline bg-primary-50 dark:bg-primary-950/30 px-2 py-1 rounded cursor-pointer"
            >
              বিক্রেতা হোন
            </Link>
          ) : platform?.paymentGateway === "ClickPay" ||
            platform?.paymentGateway === "StarPay" ? (
            <SubscriptionPaymentTrigger
              as="span"
              className="text-xs text-primary-500 font-normal text-nowrap hover:underline bg-primary-50 dark:bg-primary-950/30 px-2 py-1 rounded cursor-pointer"
            >
              বিক্রেতা হোন
            </SubscriptionPaymentTrigger>
          ) : null}
        </>
      );
    }
    return (
      <span className="text-primary-600 font-bold">৳ {product.price}</span>
    );
  };

  return (
    <article className="surface relative w-full h-full group flex flex-col justify-between rounded-xl border border-border-color bg-card-bg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-400">
      <Link to={`/products/${product._id}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden bg-secondary-100">
          <LazyLoadImage
            src={import.meta.env.VITE_IMAGE_URL + product?.thumbnail}
            alt={product?.title}
            className="absolute inset-0 z-10 h-full w-full object-cover opacity-100 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        {/* Content Container */}
        <div className="flex flex-col grow justify-between p-3.5 gap-3">
          <h3 className="line-clamp-2 text-xs sm:text-sm font-medium leading-snug text-text-primary transition-colors duration-300 group-hover:text-primary-600">
            {product?.title}
          </h3>

          <div
            className={`flex items-center ${isActive ? "justify-between" : "justify-center"} pt-2 border-t border-border-color mt-auto`}
          >
            <div>
              {product.category === "6a257b01c2c6674da70c6146" ? (
                <span className="text-primary-600 font-bold">
                  ৳ {product.price}
                </span>
              ) : (
                getPriceDisplay()
              )}
            </div>
            {isActive && (
              <div className="text-xs text-text-secondary">
                <span className="text-xs font-normal text-nowrap text-text-secondary group-hover:text-primary-500 transition-colors">
                  বিস্তারিত দেখুন &rarr;
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
