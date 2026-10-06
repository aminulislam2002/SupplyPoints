import { Link } from "react-router";
import { FaChevronRight, FaHome } from "react-icons/fa";

const Breadcrumb = ({ items }) => {
  return (
    <div className="border-b border-border-color bg-section-bg">
      <div className="container mx-auto overflow-x-auto px-4 py-2.5 sm:px-5 sm:py-3.5">
        <nav aria-label="Breadcrumb" className="flex min-w-max items-center">
          <ol className="flex items-center gap-1.5 whitespace-nowrap text-xs sm:gap-2 sm:text-sm">
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                {/* Breadcrumb Item with Home Icon */}
                {item.link ? (
                  <Link
                    to={item.link}
                    className="link group flex items-center gap-1 sm:gap-1.5"
                    aria-label={item.label}
                  >
                    {index === 0 && (
                      <FaHome className="text-base group-hover:scale-110 transition-transform duration-300" />
                    )}
                    <span className={index === 0 ? "hidden sm:inline" : ""}>
                      {item.label}
                    </span>
                  </Link>
                ) : (
                  <span
                    className={`flex items-center gap-1 sm:gap-1.5 font-medium ${
                      item.active ? "font-semibold text-primary-700" : "text-text-secondary"
                    }`}
                    aria-current={item.active ? "page" : undefined}
                  >
                    {index === 0 && <FaHome className="text-base" />}
                    <span className={index === 0 ? "hidden sm:inline" : ""}>
                      {item.label}
                    </span>
                  </span>
                )}

                {/* Separator - don't show after last item */}
                {index < items.length - 1 && (
                  <FaChevronRight className="text-[10px] text-primary-400 sm:text-xs" />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
