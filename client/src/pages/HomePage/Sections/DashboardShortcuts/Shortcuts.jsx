import { Link } from "react-router";
import { FaMoneyBillWave, FaShoppingBag } from "react-icons/fa";
import { MdOutlineTaskAlt } from "react-icons/md";
import { PiWalletBold } from "react-icons/pi";

const Shortcuts = () => {
  const shortcutCards = [
    {
      title: "আমার অর্ডার",
      icon: <FaShoppingBag size={18} />,
      to: "/dashboard/seller/my-orders",
      accent: "from-sky-400 to-cyan-500",
      glow: "from-sky-400/20 via-transparent to-transparent",
    },
    {
      title: "দৈনিক কাজ",
      icon: <MdOutlineTaskAlt size={18} />,
      to: "/dashboard/seller/todo-list",
      accent: "from-emerald-400 to-green-500",
      glow: "from-emerald-400/20 via-transparent to-transparent",
    },
    {
      title: "অর্থ হিসাব",
      icon: <PiWalletBold size={18} />,
      to: "/dashboard/seller/digital-wallet",
      accent: "from-amber-400 to-orange-500",
      glow: "from-amber-400/20 via-transparent to-transparent",
    },
    {
      title: "স্পন্সর নিন",
      icon: <FaMoneyBillWave size={18} />,
      to: "/dashboard/seller/submit-posts",
      accent: "from-rose-400 to-red-500",
      glow: "from-rose-400/20 via-transparent to-transparent",
    },
  ];

  return (
    <section className="container mx-auto px-5 pt-10">
      <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:gap-5">
        {shortcutCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="surface group relative w-full rounded-lg py-2.5 transition-colors hover:border-primary-400 lg:py-5"
          >
            <div className="relative flex flex-col items-center gap-2.5 text-center">
              <div
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary-100 text-primary-700 transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11 lg:h-12 lg:w-12"
              >
                {card.icon}
              </div>

              <h3 className="text-[10px] sm:text-sm lg:text-lg font-semibold leading-tight transition-colors duration-300 group-hover:text-primary-500">
                {card.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Shortcuts;
