import React, { useEffect } from "react";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

const Alert = ({
  type = "success",
  message = "",
  onClose = () => {},
  autoDismiss = true,
}) => {
  useEffect(() => {
    if (!message) return;
    if (!autoDismiss) return;
    const t = setTimeout(() => {
      onClose();
    }, 1000);
    return () => clearTimeout(t);
  }, [message, autoDismiss, onClose]);

  const isSuccess = type === "success";

  return (
    <div
      role="status"
      className={`alert my-3 flex items-start gap-3 transition-colors duration-150 ${
        isSuccess
          ? "border-primary-200 bg-primary-50 text-primary-800 dark:bg-primary-950/40 dark:text-primary-200"
          : "border-danger/20 bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-200"
      }`}
    >
      <div className="mt-0.5 text-lg">
        {isSuccess ? (
          <FiCheckCircle size={20} className="text-success" />
        ) : (
          <FiAlertCircle size={20} className="text-danger" />
        )}
      </div>

      <div className="flex-1">
        <p className="font-medium text-sm">{message}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss message"
        className="btn-icon ml-2 h-8 w-8 border-transparent bg-transparent"
      >
        <FiX size={16} />
      </button>
    </div>
  );
};

export default Alert;
