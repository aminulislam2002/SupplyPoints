import { IoClose } from "react-icons/io5";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

const DeliveryPaymentModal = ({
  isOpen,
  onClose,
  order,
  onUpdatePaymentStatus,
  isLoading,
}) => {
  if (!isOpen || !order) return null;

  const handleUpdateStatus = async (status) => {
    const result = await Swal.fire({
      title: `Mark as ${status}?`,
      text: `Are you sure you want to mark this delivery payment as ${status.toLowerCase()}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: status === "Paid" ? "#10B981" : "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: `Yes, Mark as ${status}`,
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await onUpdatePaymentStatus(status, order._id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
      <div className="max-w-md w-full relative">
        {/* Modal Header */}
        <div className="modal-surface rounded-t-xl px-5 py-2.5">
          <h2 className="text-xl font-semibold mb-4">Payment Status</h2>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="btn-icon absolute right-4 top-4 h-9 w-9 border-transparent bg-transparent text-danger"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-surface rounded-b-xl px-5 pb-5">
          <div className="text-sm space-y-3 pb-5 border-b border-border-color mb-2.5">
            {order?.deliveryPaymentInfo?.gateway && (
              <p>
                Method:{" "}
                <span className="font-semibold">
                  {order?.deliveryPaymentInfo?.gateway}
                </span>
              </p>
            )}
            {order?.deliveryPaymentInfo?.txnId && (
              <p>
                TxnId:{" "}
                <span className="font-semibold">
                  {order?.deliveryPaymentInfo?.txnId}
                </span>
              </p>
            )}
            {order?.deliveryPaymentInfo?.amount && (
              <p>
                Amount:{" "}
                <span className="font-semibold">
                  {order?.deliveryPaymentInfo?.amount?.toFixed(2)}
                </span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleUpdateStatus("Paid")}
              disabled={isLoading || order?.deliveryPaymentStatus === "Paid"}
              className="btn primary-btn h-12 w-full gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaCheckCircle size={18} />
                  Mark as Paid
                </>
              )}
            </button>

            <button
              onClick={() => handleUpdateStatus("Unpaid")}
              disabled={isLoading || order?.deliveryPaymentStatus === "Unpaid"}
              className="btn danger-btn h-12 w-full gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaTimes size={18} />
                  Mark as Unpaid
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPaymentModal;
