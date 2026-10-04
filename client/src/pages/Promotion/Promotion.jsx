import PromotionBanner from "./PromotionBanner";
import PromotionCategoriesAndPacks from "./PromotionCategoriesAndPacks";

const Promotion = () => {
  return (
    <div className="space-y-2">
      <PromotionBanner />
      <PromotionCategoriesAndPacks />
    </div>
  );
};

export default Promotion;
