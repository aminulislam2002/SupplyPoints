import { Outlet, useNavigate } from "react-router";
import { useContext } from "react";
import { SidebarContext } from "../../providers/SidebarProvider/SidebarProvider";
import DashSidebar from "../../pages/Dashboard/DashSidebar/DashSidebar";
import DashNavbar from "../../pages/Dashboard/DashNavbar/DashNavbar";
import useAuth from "../../hooks/useAuth/useAuth";
import Loader from "../../components/Loader/Loader";
import { PiSignOutFill } from "react-icons/pi";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import ContactIcon from "../../components/ContactIcon/ContactIcon";

const DashLayout = () => {
  const axiosSecure = useAxiosSecure();
  const { collapsed, toggleSidebar } = useContext(SidebarContext);
  const { isUserPending, user, refetchUser } = useAuth();
  const navigate = useNavigate();

  const handleExitImpersonated = async () => {
    try {
      const res = await axiosSecure.post("/users/exit-impersonation");

      // store token immediately so secure axios picks it up
      localStorage.setItem("accessToken", res?.data?.accessToken);
      refetchUser();

      await Swal.fire({ title: res?.data?.message, icon: "success" });

      // navigate after a short delay
      setTimeout(() => {
        navigate("/dashboard/admin/overview");
      }, 1000);
    } catch (error) {
      await Swal.fire({
        title: error.response?.data?.message || "Something went wrong.",
        icon: "error",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  if (isUserPending) {
    return <Loader />;
  }

  return (
    <div
      id="dashboard"
      className="relative flex h-screen w-full justify-between overflow-hidden bg-page-bg"
    >
      {/* Desktop sidebar*/}
      {!collapsed && (
        <div className="hidden w-2/12 border-r border-border-color lg:block">
          <DashSidebar />
        </div>
      )}

      {/* Mobile sidebar*/}
      {collapsed && (
        <div className="fixed bottom-0 left-0 top-0 z-50 w-[min(84vw,20rem)] lg:hidden">
          <DashSidebar />
        </div>
      )}

      {/* Overlay for small/medium screens when sidebar is open */}
      {collapsed && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content area */}
      <div
        className={collapsed ? "relative w-full" : "relative w-full lg:w-10/12"}
      >
        <div
          className={`h-[10vh] fixed z-30 ${
            collapsed ? "w-full" : "w-full lg:w-10/12"
          }`}
        >
          <DashNavbar />
        </div>

        {user?.isImpersonated && (
          <button
            onClick={handleExitImpersonated}
            className="btn btn-danger fixed bottom-5 right-5 z-50 rounded-full px-5 shadow-lg"
          >
            <PiSignOutFill size={16} />
            Exit {user?.role}
          </button>
        )}

        <div className="relative w-full h-[90vh] mt-[10vh] overflow-hidden overflow-y-auto">
          <ScrollToTop />
          <Outlet />
          <ContactIcon />
        </div>
      </div>
    </div>
  );
};

export default DashLayout;
