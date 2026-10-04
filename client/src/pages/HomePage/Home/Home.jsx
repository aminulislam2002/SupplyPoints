import useAuth from "../../../hooks/useAuth/useAuth";
import NoticeModal from "../../../components/NoticeModal/NoticeModal";
import Balance from "../Sections/Balance/Balance";
import Shortcuts from "../Sections/DashboardShortcuts/Shortcuts";
import FAQ from "../Sections/FAQ/FAQ";
import QuickAccess from "../Sections/QuickAccess/QuickAccess";
import TopSlider from "../Sections/TopSlider/TopSlider";

const Home = () => {
  const { user } = useAuth();
  return (
    <div>
      <NoticeModal enabled={Boolean(user)} />
      <TopSlider />
      <Balance />

      {user && <Shortcuts />}

      <QuickAccess />
      <FAQ />
    </div>
  );
};

export default Home;
