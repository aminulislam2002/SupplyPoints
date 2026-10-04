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
          className="text-xs text-red-500 font-medium hover:underline"
        >
          লগইন আবশ্যক
        </button>
      );
    }

    if (!isActive) {
      return (
        <>
          {platform?.paymentGateway === "Manual" ? (
            <Link
              to={`/payment/Account/${platform?.accountActivationFee}`}
              className="text-xs text-red-500 font-medium hover:underline"
            >
              Become a Seller
            </Link>
          ) : platform?.paymentGateway === "ClickPay" ||
            platform?.paymentGateway === "StarPay" ? (
            <SubscriptionPaymentTrigger
              as="span"
              className="text-xs text-red-500 font-medium hover:underline"
            >
              Become a Seller
            </SubscriptionPaymentTrigger>
          ) : null}
        </>
      );
    }
    return <>৳ {product.price}</>;
  };

  return (
    <article className="surface relative w-full h-full group block overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg">
      <Link to={`/products/${product._id}`}>
        <div className="relative w-full aspect-square overflow-hidden bg-secondary-100">
          <LazyLoadImage
            src={import.meta.env.VITE_IMAGE_URL + product?.thumbnail}
            alt={product?.title}
            className="absolute inset-0 z-10 h-full w-full object-cover opacity-100 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        <div className="flex min-h-[112px] flex-col justify-between gap-3 p-4">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-text-primary transition-colors duration-300 group-hover:text-primary-600">
            {product?.title}
          </p>

          <div className="flex items-center justify-between text-base font-bold text-primary-600">
            {product.category === "6a257b01c2c6674da70c6146" ? (
              <span>৳ {product.price}</span>
            ) : (
              getPriceDisplay()
            )}
            <span className="text-xs font-medium text-text-muted">View details</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
