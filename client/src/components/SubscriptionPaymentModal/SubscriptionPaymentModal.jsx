import { IoClose } from "react-icons/io5";
import { MdOutlinePayment } from "react-icons/md";

const SubscriptionPaymentModal = ({
  open,
  onClose,
  activationFee,
  paymentGateways,
  selectedGateway,
  setSelectedGateway,
  onProceedPayment,
  isLoading,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-950/60 p-4 backdrop-blur-sm">
      <div className="modal-surface max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-border-color">
          <h2 className="text-lg font-semibold">Activate Your Account</h2>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon h-9 w-9"
            aria-label="Close payment dialog"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-5">
          {/* Amount Info */}
          <div className="surface-muted rounded-lg p-4 text-center">
            <p className="metadata">Activation Fee:</p>
            <p className="text-2xl font-semibold mt-1">৳{activationFee}</p>
          </div>

          {/* Payment Gateway Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Select Payment Gateway
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {paymentGateways.map((gateway) => (
                <button
                  key={gateway.name}
                  type="button"
                  onClick={() => setSelectedGateway(gateway.name)}
                  className={`h-12 rounded-md border text-sm font-semibold transition-colors duration-300 cursor-pointer flex items-center gap-2 px-3 ${
                    selectedGateway === gateway.name
                      ? "border-primary-500 bg-primary-600 text-primary-50"
                      : "bg-card-bg border-border-color hover:border-primary-500"
                  }`}
                >
                  <div className="bg-white w-12 h-6 rounded">
                    <img
                      src={gateway.logo}
                      alt={gateway.name}
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                  {gateway.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center">
            <button
              type="button"
              onClick={onProceedPayment}
              disabled={!selectedGateway || isLoading}
              className="btn primary-btn h-11 px-5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MdOutlinePayment size={18} />
              <span>Proceed to Payment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPaymentModal;
