import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaTelegramPlane, FaUsers, FaHeadset } from "react-icons/fa";
import usePlatform from "../../hooks/usePlatform/usePlatform";

const NoticeModal = ({ enabled = false }) => {
  const { platform, isPlatformPending } = usePlatform();
  const [open, setOpen] = useState(false);
  const hasAutoOpenedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (isPlatformPending) return;
    if (!platform?.notice) return;
    if (hasAutoOpenedRef.current) return;

    const t = setTimeout(() => {
      hasAutoOpenedRef.current = true;
      setOpen(true);
    }, 2000);
    return () => clearTimeout(t);
  }, [enabled, platform?.notice, isPlatformPending]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-950/60 p-4 backdrop-blur-sm">
      <div className="modal-surface max-h-[90vh] w-full max-w-xl overflow-y-auto">
        <div className="flex justify-between items-center p-2.5 lg:p-3.5 border-b border-border-color">
          <h2 className="text-base font-medium">Important Notice</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="btn-icon h-9 w-9"
            aria-label="Close notice"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="p-2.5 lg:p-5">
          <p className="body-copy text-sm leading-relaxed">
            {platform?.notice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoticeModal;
