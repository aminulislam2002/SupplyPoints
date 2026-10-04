import { createContext, useState } from "react";

export const SidebarContext = createContext(null);

const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleFullWidth = () => {
    const dashboard = document.getElementById("dashboard");
    const isFullScreen = document.fullscreenElement;

    if (isFullScreen === dashboard) {
      document.exitFullscreen().then(() => {
        setIsFullWidth(false);
      });
    } else {
      dashboard.requestFullscreen().then(() => {
        setIsFullWidth(true);
      });
    }
  };

  const info = { collapsed, toggleSidebar, isFullWidth, toggleFullWidth };

  return (
    <SidebarContext.Provider value={info}>{children}</SidebarContext.Provider>
  );
};

export default SidebarProvider;

