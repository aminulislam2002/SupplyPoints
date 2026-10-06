import ResellingBanner from "./ResellingBanner";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import CategoriesAdnSubCategories from "../HomePage/Sections/TopCategories/CategoriesAdnSubCategories";

const Reselling = () => {
  return (
    <div className="relative w-full h-full">
      <Breadcrumb
        items={[
          { label: "Home", link: "/" },
          { label: "Reselling", active: true },
        ]}
      />

      <ResellingBanner />
      <CategoriesAdnSubCategories />
      {/* <WhyChooseUs /> */}
    </div>
  );
};

export default Reselling;
