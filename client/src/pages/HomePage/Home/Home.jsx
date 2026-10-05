import useAuth from "../../../hooks/useAuth/useAuth";
import NoticeModal from "../../../components/NoticeModal/NoticeModal";
import Balance from "../Sections/Balance/Balance";
import Shortcuts from "../Sections/DashboardShortcuts/Shortcuts";
import FAQ from "../Sections/FAQ/FAQ";
import QuickAccess from "../Sections/QuickAccess/QuickAccess";
import TopSlider from "../Sections/TopSlider/TopSlider";
import TopCategories from "../Sections/TopCategories/TopCategories";
import TopBanner from "../Sections/Banner/TopBanner";

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <TopBanner />

      {user && (
        <>
          <Balance />
          <Shortcuts />
        </>
      )}

      <TopCategories />

      {/* <QuickAccess /> */}
      <TopSlider />
      <FAQ />

      {/* <NoticeModal enabled={Boolean(user)} /> */}
    </div>
  );
};

export default Home;
