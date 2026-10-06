import { Outlet } from "react-router";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-page-bg px-4 py-10 sm:px-6">
      <ScrollToTop />
      <div className="w-full max-w-xl">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;