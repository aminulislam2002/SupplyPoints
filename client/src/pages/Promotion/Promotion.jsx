import PromotionBanner from "./PromotionBanner";
import PromotionCategoriesAndPacks from "./PromotionCategoriesAndPacks";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

const Promotion = () => {
  return (
    <div className="relative w-full h-full">
      <Breadcrumb
        items={[
          { label: "Home", link: "/" },
          { label: "Promotion", active: true },
        ]}
      />
      <PromotionBanner />
      <PromotionCategoriesAndPacks />
    </div>
  );
};

export default Promotion;
