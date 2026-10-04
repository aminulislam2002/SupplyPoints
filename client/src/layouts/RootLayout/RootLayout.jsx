import { Outlet } from "react-router";
import Navbar from "../../pages/SharedPages/Navbar/Navbar";
import Footer from "../../pages/SharedPages/Footer/Footer";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import ContactIcon from "../../components/ContactIcon/ContactIcon";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden overflow-y-auto">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 bg-page-bg">
        <Outlet />
      </main>
      <ContactIcon />
      <Footer />
    </div>
  );
};

export default RootLayout;
