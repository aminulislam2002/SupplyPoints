import { FiMenu } from "react-icons/fi";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarRightExpand,
} from "react-icons/tb";
import { useContext } from "react";
import { SidebarContext } from "../../../providers/SidebarProvider/SidebarProvider";

const DashNavbar = () => {
  const { collapsed, toggleSidebar, isFullWidth, toggleFullWidth } =
    useContext(SidebarContext);

  return (
    <div className="flex h-full w-full items-center justify-between border-b border-border-color bg-section-bg px-5">
      {/* Left: Collapsed and Menu Icon */}
      <div>
        <button
          onClick={toggleSidebar}
          className="btn-icon hidden lg:flex"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <TbLayoutSidebarLeftExpand size={24}></TbLayoutSidebarLeftExpand>
          ) : (
            <TbLayoutSidebarRightExpand size={24}></TbLayoutSidebarRightExpand>
          )}
        </button>

        <button onClick={toggleSidebar} className="btn-icon lg:hidden" aria-label="Open sidebar">
          <FiMenu size={20}></FiMenu>
        </button>
      </div>

      <div>{/* Middle */}</div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleFullWidth}
          className="btn-icon"
          aria-label={isFullWidth ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullWidth ? (
            <BiExitFullscreen size={24}></BiExitFullscreen>
          ) : (
            <BiFullscreen size={24}></BiFullscreen>
          )}
        </button>
      </div>
    </div>
  );
};

export default DashNavbar;
