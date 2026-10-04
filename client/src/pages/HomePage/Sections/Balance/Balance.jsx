import React, { useState } from "react";
import useAuth from "../../../../hooks/useAuth/useAuth";
import { ImSpinner9 } from "react-icons/im";

const Balance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(null);
  const [showBalance, setShowBalance] = useState(false);
  const { user } = useAuth();

  const handleShowBalance = () => {
    // If balance is shown, hide it
    if (showBalance) {
      setShowBalance(false);
      setBalance(null);
      return;
    }

    setIsLoading(true);
    setShowBalance(false); // Hide balance while loading continues

    setTimeout(() => {
      // Set balance based on user profile data
      if (user?.balance) {
        setBalance(user?.balance);
      } else {
        setBalance("00.00");
      }

      setIsLoading(false);
      setShowBalance(true); // Show balance after loading completes

      // Auto hide the balance after 3 seconds
      setTimeout(() => {
        setShowBalance(false);
        setBalance(null);
      }, 3000); // Auto hide after 3 seconds
    }, 1000); // Simulate loading delay
  };

  // console.log(`Is loading ${isLoading} / Is pending ${isPending} & show balance ${showBalance} === ${balance}`);

  return (
    <section className="container mx-auto flex items-center justify-center px-4 pt-8 sm:px-6">
      <div className="surface relative flex h-12 w-full max-w-xs items-center justify-center bg-card-bg p-1 shadow-sm">
        <div
          onClick={handleShowBalance}
          className="flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-600 font-secondary text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          {isLoading ? (
            //    ||  isPending
            <>
              <ImSpinner9 className="animate-spin"></ImSpinner9>{" "}
              <span>Checking Balance</span>
            </>
          ) : balance ? (
            <>
              <div>
                <span className="text-lg font-semibold">
                  {balance}
                </span>{" "}
                <span>টাকা</span>
              </div>
            </>
          ) : (
            <>
              <ImSpinner9></ImSpinner9> <span>Tap For Balance</span>
            </>
          )}
        </div>

        {!isLoading && balance ? (
          <div
            className={`h-6 w-6 bg-primary-950 font-secondary text-sm font-medium text-white absolute left-1 z-50 p-1.5 rounded-full flex items-center justify-center`}
          >
            ৳
          </div>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

export default Balance;
