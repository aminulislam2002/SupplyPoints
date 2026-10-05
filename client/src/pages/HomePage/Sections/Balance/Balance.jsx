import { useState } from "react";
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

  return (
    <section className="container mx-auto flex items-center justify-center px-4 pt-6 sm:px-6">
      <div className="relative w-full max-w-sm">
        {/* Glow Background Effect */}
        <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-primary-500 via-emerald-400 to-cyan-500 opacity-40 blur-sm transition duration-500 group-hover:opacity-100"></div>

        {/* Main Card Container */}
        <div
          onClick={handleShowBalance}
          className="relative flex h-14 w-full cursor-pointer items-center justify-between rounded-xl bg-card-bg border border-border-color px-4 shadow-md transition-all duration-300 hover:shadow-lg hover:border-primary-400 group overflow-hidden"
        >
          {/* Left Icon Badge */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 shadow-inner transition-transform duration-300 group-hover:scale-110">
              <span className="text-lg font-bold">৳</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-text-secondary">
                আপনার ব্যালেন্স
              </span>
              <span className="text-xs font-semibold text-text-primary">
                {isLoading
                  ? "যাচাই করা হচ্ছে..."
                  : balance
                    ? "টাকার পরিমাণ"
                    : "ব্যালেন্স দেখতে ক্লিক করুন"}
              </span>
            </div>
          </div>

          {/* Right Action / Display Area */}
          <div className="flex items-center">
            {isLoading ? (
              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-sm">
                <ImSpinner9 className="animate-spin text-lg" />
              </div>
            ) : balance ? (
              <div className="flex items-center gap-1.5 bg-primary-50 dark:bg-primary-950/40 px-3 py-1.5 rounded-lg border border-primary-200 dark:border-primary-800 animate-fadeIn">
                <span className="text-base sm:text-lg font-bold text-primary-600 dark:text-primary-400 font-secondary">
                  {balance}
                </span>
                <span className="text-xs font-medium text-text-secondary">
                  টাকা
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 px-3.5 py-2 rounded-lg shadow transition-colors">
                <span>ট্যাপ করুন</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Balance;
