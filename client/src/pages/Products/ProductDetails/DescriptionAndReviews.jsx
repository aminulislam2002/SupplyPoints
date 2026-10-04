import { useState } from "react";
import { TbCopy } from "react-icons/tb";
import Swal from "sweetalert2";

const DescriptionAndReviews = ({ product }) => {
  const [isActiveTab, setIsActiveTab] = useState("Descriptions");

  const [showFullDescription, setShowFullDescription] = useState(false);

  // Handle Copy Description
  const handleCopyDescription = () => {
    navigator.clipboard
      .writeText(product?.descriptions || "")
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Copied!",
          text: "Product description copied successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to copy the description.",
        });
      });
  };

  // This function for giving actual space
  const renderDescriptions = (descriptions) => {
    return (
      <div className="space-y-4">
        {descriptions?.split("\nn").map((paragraph, index) => (
          <div
            key={index}
            className="surface-muted p-4"
          >
            <p className="body-copy whitespace-pre-wrap text-base leading-relaxed">
              {paragraph.length > 100 && !showFullDescription
                ? `${paragraph.substring(0, 100)}... `
                : paragraph}{" "}
            </p>

            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="link text-sm underline decoration-primary-500/50 underline-offset-4"
              >
                {showFullDescription ? "Show Less" : "Show More"}{" "}
              </button>
              <button
                onClick={handleCopyDescription}
                className="btn btn-outline min-h-8 p-1.5"
                title="Copy Title"
              >
                <TbCopy size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
      {/*   Descriptions & Reviews tabs */}
      <div className="surface-muted flex h-14 w-full items-center gap-5 px-3">
        {/* "Reviews" */}
        {["Descriptions"].map((tab, index) => (
          <button
            key={index}
            onClick={() => setIsActiveTab(tab)}
            className="h-10 w-1/3 cursor-pointer text-base font-medium"
          >
            <span
              className={
                isActiveTab === tab
                  ? "flex h-full w-full items-center justify-center rounded-md bg-primary-100 text-primary-700 shadow-sm transition-colors duration-300"
                  : "flex h-full items-center justify-center transition-colors duration-300 hover:cursor-pointer hover:text-primary-500"
              }
            >
              {tab}
            </span>
          </button>
        ))}
      </div>
      {/* Tab details */}
      <div className="surface-muted h-auto w-full rounded-t-none p-1">
        {isActiveTab === "Reviews" && (
          <div className="p-3">
            {product?.reviews ? (
              <div>{product?.reviews}</div>
            ) : (
              <p className="py-6 text-center text-base font-medium">
                Sorry! No reviews found!
              </p>
            )}
          </div>
        )}

        {isActiveTab === "Descriptions" && (
          <div className="p-3 lg:p-4">
            {product?.descriptions ? (
              <>{renderDescriptions(product?.descriptions)} </>
            ) : (
              <p className="py-6 text-center text-base font-medium">
                Sorry! No descriptions found!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionAndReviews;
