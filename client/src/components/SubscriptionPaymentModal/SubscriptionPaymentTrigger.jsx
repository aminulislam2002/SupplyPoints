import { useNavigate } from "react-router";

const SubscriptionPaymentTrigger = ({
  as = "button",
  className,
  children,
  onClick,
  ...rest
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    onClick?.(e);
    if (e?.defaultPrevented) return;

    e?.preventDefault?.();
    e?.stopPropagation?.();

    navigate("/dashboard/seller/subscription");
  };

  if (as === "span") {
    return (
      <span
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick(e);
        }}
        className={className}
        {...rest}
      >
        {children}
      </span>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={className} {...rest}>
      {children}
    </button>
  );
};

export default SubscriptionPaymentTrigger;
