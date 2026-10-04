import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";

const TrackingUpdateModal = ({
  isOpen,
  onClose,
  order,
  onUpdateTracking,
  isLoading,
}) => {
  const { register, handleSubmit, reset } = useForm();

  if (!isOpen || !order) return null;

  const onSubmit = async (data) => {
    await onUpdateTracking(data, order?._id);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
      <div className="max-w-md w-full relative">
        <div className="modal-surface rounded-t-xl px-5 py-2.5">
          <h2 className="text-xl font-semibold mb-4">Update Tracking</h2>

          <button
            onClick={handleClose}
            className="btn-icon absolute right-4 top-4 h-9 w-9 border-transparent bg-transparent text-danger"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="modal-surface rounded-b-xl px-5 pb-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Platform Code
              </label>
              <input
                type="text"
                {...register("platformCode", {
                  required: false,
                })}
                defaultValue={order?.deliveryInfo?.platformCode || ""}
                placeholder="Enter platform code"
                className="control h-11 w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">
                Currier Tracking
              </label>
              <input
                type="url"
                {...register("currierTracking", {
                  required: false,
                })}
                defaultValue={order?.deliveryInfo?.courierTracking || ""}
                placeholder="Enter currier Tracking"
                className="control h-11 w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">
                Courier Message
              </label>
              <textarea
                type="text"
                {...register("courierMessage", {
                  required: false,
                })}
                rows={5}
                defaultValue={order?.deliveryInfo?.courierMessage || ""}
                placeholder="Enter courier message"
                className="control min-h-24 w-full p-3"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary h-12 w-full gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrackingUpdateModal;
