/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback } from "react";

export const SubscriptionPaymentModalContext = createContext(null);

const SubscriptionPaymentProvider = ({ children }) => {
  const openSubscriptionPaymentModal = useCallback(() => {
    window.location.assign("/dashboard/seller/subscription");
  }, []);

  const closeSubscriptionPaymentModal = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.assign("/dashboard/seller/overview");
  }, []);

  return (
    <SubscriptionPaymentModalContext.Provider
      value={{
        openSubscriptionPaymentModal,
        closeSubscriptionPaymentModal,
      }}
    >
      {children}
    </SubscriptionPaymentModalContext.Provider>
  );
};

export default SubscriptionPaymentProvider;
