import { useContext } from "react";
import { VariantsContext } from "../../providers/VariantsProvider/VariantsProvider";
const useVariants = () => {
  const data = useContext(VariantsContext);

  if (!data) {
    throw new Error("useVariants must be used within a VariantsProvider");
  }

  return data;
};

export default useVariants;

