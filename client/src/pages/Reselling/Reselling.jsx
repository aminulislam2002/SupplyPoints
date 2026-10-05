import TopCategories from "../HomePage/Sections/TopCategories/TopCategories";
import WhyChooseUs from "../HomePage/Sections/WhyChooseUs/WhyChooseUs";
import ResellingBanner from "./ResellingBanner";

const Reselling = () => {
  return (
    <div className="space-y-10 pb-8">
      <ResellingBanner />
      <TopCategories />
      {/* <WhyChooseUs /> */}
    </div>
  );
};

export default Reselling;
