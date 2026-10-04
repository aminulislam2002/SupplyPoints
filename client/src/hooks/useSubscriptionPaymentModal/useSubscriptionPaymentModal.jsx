import { useContext } from "react";
import { SubscriptionPaymentModalContext } from "../../providers/SubscriptionPaymentProvider/SubscriptionPaymentProvider";

const useSubscriptionPaymentModal = () => {
  const ctx = useContext(SubscriptionPaymentModalContext);

  if (!ctx) {
    throw new Error(
      "useSubscriptionPaymentModal must be used within SubscriptionPaymentProvider",
    );
  }

  return ctx;
};

export default useSubscriptionPaymentModal;
