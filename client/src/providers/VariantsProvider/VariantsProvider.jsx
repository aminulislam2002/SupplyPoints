/* eslint-disable react-refresh/only-export-components */
import { createContext } from "react";

export const VariantsContext = createContext(null);

const VariantsProvider = ({ children }) => {
  // colors
  const colors = [
    "Aqua",
    "Black",
    "Blue",
    "Brown",
    "Chocolate",
    "Coffee",
    "Cream",
    "Gold",
    "primary",
    "Green",
    "Magenta",
    "Maroon",
    "Mint Green",
    "Navy",
    "Navy Blue",
    "Neon Green",
    "Neon Pink",
    "Olive",
    "Orange",
    "Pastel Pink",
    "Pest",
    "Pink",
    "Purple",
    "Red",
    "Rose Gold",
    "Sapphire",
    "Seafoam",
    "Silver",
    "Sky Blue",
    "Tan",
    "Titan",
    "Turquoise",
    "White",
    "Yellow",
  ];

  const clothSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

  const shoesSizes = [28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48];

  const babySizes = [
    "0-3 Months",
    "3-6 Months",
    "6-9 Months",
    "9-12 Months",
    "12-18 Months",
    "18-24 Months",
    "2-3 Years",
    "3-4 Years",
    "4-5 Years",
    "5-6 Years",
    "6-7 Years",
    "7-8 Years",
    "8-9 Years",
    "9-10 Years",
    "10-11 Years",
    "11-12 Years",
  ];

  const volumeSizes = [
    "100ml",
    "250ml",
    "500ml",
    "1L",
    "2L",
    "2.5L",
    "3L",
    "5L",
    "8L",
    "10L",
  ];

  const weightSizes = [
    "1gm",
    "25gm",
    "50gm",
    "100gm",
    "250gm",
    "500g",
    "1kg",
    "2kg",
    "2.5kg",
    "5kg",
    "10kg",
  ];

  const values = {
    colors,
    clothSizes,
    shoesSizes,
    babySizes,
    volumeSizes,
    weightSizes,
  };

  return (
    <VariantsContext.Provider value={values}>
      {children}
    </VariantsContext.Provider>
  );
};

export default VariantsProvider;
