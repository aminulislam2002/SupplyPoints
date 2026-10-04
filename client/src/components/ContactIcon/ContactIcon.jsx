import { Link } from "react-router";
import { FaTelegramPlane } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import usePlatform from "../../hooks/usePlatform/usePlatform";

const ContactIcon = () => {
  const { platform } = usePlatform();

  return (
    <div className="fixed right-4 bottom-12 z-9999">
      <Link
        to={platform?.telegramGroup}
        target="_blank"
        className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/20 bg-linear-to-r from-[#0088cc] via-[#0099e6] to-[#00bfff] px-2 py-1.5 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

        {/* Animated Ping */}
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex h-9 w-9 animate-ping rounded-full bg-white/30"></span>

          <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#0088cc] shadow-lg">
            <FaTelegramPlane size={16} />
          </div>
        </div>

        {/* Text Content */}
        <div className="relative flex flex-col leading-tight">
          <span className="text-sm font-normal text-white">Reseller Group</span>
        </div>

        {/* Shine Effect */}
        <div className="absolute -left-16 top-0 h-full w-10 rotate-12 bg-white/20 blur-md transition-all duration-700 group-hover:left-[120%]"></div>
      </Link>
    </div>
  );
};

export default ContactIcon;
