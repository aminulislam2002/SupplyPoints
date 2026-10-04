import {
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import { TbHandClick } from "react-icons/tb";
import Swal from "sweetalert2";
import { LuImageDown } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

const ShareAndDownload = ({ product, isActive, user }) => {
  // Combine thumbnail and photos into a single array
  const images = product ? [product.thumbnail, ...(product.photos || [])] : [];

  const productLink = `${import.meta.env.VITE_CLIENT_URL}/product-details/${
    product?.productUrl
  }`;

  // Handle Click to Copy
  const handleClickToCopy = () => {
    navigator.clipboard
      .writeText(productLink)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Copied!",
          text: "Share link copied successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to copy the link.",
        });
      });
  };

  // Handle Modal Open
  const handleOpenModal = () => {
    const modal = document.getElementById("image-download-modal");
    if (modal) {
      modal.showModal();
    }
  };

  // Handle Image Download
  const handleImageDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl, {
        mode: "cors",
      });
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = imageUrl.split("/").pop(); // file name
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Download failed",
        text: "Image download korte problem hocche",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="alert border-warning/30 bg-amber-50 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
        <p className="mb-2 font-semibold text-warning">
          ডেলিভারি ও অর্ডার নির্দেশনা
        </p>
        <ul className="list-disc space-y-1 pl-5 font-normal">
          <li>ঢাকার ভিতরে ডেলিভারি চার্জ: ৭০ টাকা (২ থেকে ৪ দিন সময়)</li>
          <li>ঢাকার বাহিরে ডেলিভারি চার্জ: ১২০ টাকা (২ থেকে ৫ দিন সময়)</li>
          <li>
            অর্ডার করার আগে অবশ্যই কাস্টমার চেকার দিয়ে যাচাই করতে হবে এবং অর্ডার
            কম্পিলিট রেট ৮০% এর উপরে থাকতে হবে।
          </li>
          <li>
            নির্ধারিত শর্ত অনুযায়ী অর্ডার প্লেস করতে হবে, অন্যথায় অর্ডার বাতিল
            করা হবে।
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary-500">Share Product</p>
          {/* Social media for icon for large devices */}
          <div className="flex w-full items-center justify-start gap-2.5 lg:gap-2.5">
            <FacebookShareButton
              url={productLink}
              hashtag="#KrayBazar #E-commerce"
            >
              <FacebookIcon size={30} round={true} />
            </FacebookShareButton>

            <WhatsappShareButton
              url={productLink}
              title={`Check out this amazing product: ${product?.title}!`}
              separator=" - "
            >
              <WhatsappIcon size={30} round={true} />
            </WhatsappShareButton>

            <TelegramShareButton
              url={productLink}
              title={`Discover this great product: ${product?.title}!`}
            >
              <TelegramIcon size={30} round={true} />
            </TelegramShareButton>

            {/* Click to Copy */}
            <button
              className="btn-icon group rounded-full"
              onClick={handleClickToCopy}
              title="Copy product link"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-primary-50 transition-colors duration-300 group-hover:bg-primary-100">
                  <TbHandClick size={30} />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Download Image Button */}
        {user && isActive && (
          <button
            onClick={handleOpenModal}
            className="btn btn-outline"
          >
            <LuImageDown size={20} /> Image
          </button>
        )}
      </div>

      <dialog id="image-download-modal" className="modal">
        <div className="modal-surface relative max-w-4xl p-5 shadow-xl lg:p-6">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn-icon absolute right-4 top-4 border-danger/30 bg-red-50 text-danger hover:bg-red-100" aria-label="Close image download dialog">
              <IoClose size={24} />
            </button>
          </form>
          <h3 className="section-title text-base tracking-wide">
            Download Images
          </h3>

          <div>
            {images.length > 0 ? (
              <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleImageDownload(
                        import.meta.env.VITE_IMAGE_URL + image,
                      )
                    }
                    className="group relative cursor-pointer overflow-hidden rounded-lg border border-border-color/70"
                  >
                    <img
                      src={import.meta.env.VITE_IMAGE_URL + image}
                      alt={`Product Image ${index + 1}`}
                      className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary-950/65 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            ) : (
              <p>No images available for download.</p>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ShareAndDownload;
