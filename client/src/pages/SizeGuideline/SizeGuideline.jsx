import { Link } from "react-router";
import {
  FaRulerCombined,
  FaTshirt,
  FaShoePrints,
  FaChild,
  FaInfoCircle,
} from "react-icons/fa";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

const SizeGuideline = () => {
  const howToMeasure = [
    {
      title: "Chest/Bust",
      description:
        "Measure around the fullest part of your chest/bust, keeping the tape horizontal.",
    },
    {
      title: "Waist",
      description:
        "Measure around your natural waistline, keeping the tape comfortably loose.",
    },
    {
      title: "Hips",
      description:
        "Measure around the fullest part of your hips, approximately 8 inches below waist.",
    },
    {
      title: "Inseam",
      description:
        "Measure from the crotch to the bottom of your ankle along the inside of your leg.",
    },
    {
      title: "Shoulder Width",
      description:
        "Measure from one shoulder point to the other across your back.",
    },
    {
      title: "Sleeve Length",
      description:
        "Measure from the shoulder point to the wrist with your arm slightly bent.",
    },
  ];

  const menShirtSizes = [
    { size: "XS", chest: "34-36", waist: "28-30", length: "27-28" },
    { size: "S", chest: "36-38", waist: "30-32", length: "28-29" },
    { size: "M", chest: "38-40", waist: "32-34", length: "29-30" },
    { size: "L", chest: "40-42", waist: "34-36", length: "30-31" },
    { size: "XL", chest: "42-44", waist: "36-38", length: "31-32" },
    { size: "2XL", chest: "44-46", waist: "38-40", length: "32-33" },
    { size: "3XL", chest: "46-48", waist: "40-42", length: "33-34" },
  ];

  const womenDressSizes = [
    { size: "XS", bust: "32-34", waist: "24-26", hips: "34-36" },
    { size: "S", bust: "34-36", waist: "26-28", hips: "36-38" },
    { size: "M", bust: "36-38", waist: "28-30", hips: "38-40" },
    { size: "L", bust: "38-40", waist: "30-32", hips: "40-42" },
    { size: "XL", bust: "40-42", waist: "32-34", hips: "42-44" },
    { size: "2XL", bust: "42-44", waist: "34-36", hips: "44-46" },
    { size: "3XL", bust: "44-46", waist: "36-38", hips: "46-48" },
  ];

  const shoeSizes = [
    { us: "6", uk: "5.5", eu: "39", cm: "24.5" },
    { us: "7", uk: "6.5", eu: "40", cm: "25.5" },
    { us: "8", uk: "7.5", eu: "41", cm: "26.5" },
    { us: "8.5", uk: "8", eu: "42", cm: "27" },
    { us: "9.5", uk: "9", eu: "43", cm: "28" },
    { us: "10", uk: "9.5", eu: "44", cm: "28.5" },
    { us: "11", uk: "10.5", eu: "45", cm: "29.5" },
  ];

  const kidsClothingSizes = [
    { size: "2-3Y", height: "92-98", chest: "52-54", waist: "51-52" },
    { size: "3-4Y", height: "98-104", chest: "54-56", waist: "52-53" },
    { size: "4-5Y", height: "104-110", chest: "56-58", waist: "53-54" },
    { size: "5-6Y", height: "110-116", chest: "58-60", waist: "54-55" },
    { size: "6-7Y", height: "116-122", chest: "60-62", waist: "55-56" },
    { size: "7-8Y", height: "122-128", chest: "62-65", waist: "56-58" },
    { size: "8-9Y", height: "128-134", chest: "65-68", waist: "58-60" },
    { size: "9-10Y", height: "134-140", chest: "68-72", waist: "60-62" },
  ];

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Size Guideline", active: true },
  ];

  return (
    <div className="relative w-full min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-5 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-700 text-primary-50 mb-6">
            <FaRulerCombined size={40} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Size Guideline
          </h1>
          <p className="max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive size guideline. All
            measurements are in inches unless otherwise specified.
          </p>
        </div>

        {/* How to Measure */}
        <div className="mb-10">
          <div className="card overflow-hidden">
            <div className="surface-muted border-b border-border-color p-5">
              <div className="flex items-center gap-4">
                <div className="surface flex h-12 w-12 items-center justify-center rounded-md text-primary-600">
                  <FaInfoCircle className="text-2xl" />
                </div>
                <h2 className="text-lg lg:text-xl font-bold">
                  How to Measure Yourself
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {howToMeasure.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-bold text-primary-500">{item.title}</h3>
                    <p className="text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Men's Shirt Sizes */}
        <div className="mb-10">
          <div className="card overflow-hidden">
            <div className="surface-muted border-b border-border-color p-5">
              <div className="flex items-center gap-4">
                <div className="surface flex h-12 w-12 items-center justify-center rounded-md text-primary-600">
                  <FaTshirt className="text-2xl" />
                </div>
                <h2 className="text-lg lg:text-xl font-bold">
                  Men's Clothing Size Chart
                </h2>
              </div>
            </div>
            <div className="p-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-color">
                    <th className="text-left py-3 px-4 font-bold">Size</th>
                    <th className="text-left py-3 px-4 font-bold">
                      Chest (in)
                    </th>
                    <th className="text-left py-3 px-4 font-bold">
                      Waist (in)
                    </th>
                    <th className="text-left py-3 px-4 font-bold">
                      Length (in)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {menShirtSizes.map((size, index) => (
                    <tr
                      key={index}
                      className="border-b border-border-color hover:bg-primary-100  transition-colors duration-200"
                    >
                      <td className="py-3 px-4 font-semibold text-primary-500">
                        {size.size}
                      </td>
                      <td className="py-3 px-4">{size.chest}</td>
                      <td className="py-3 px-4">{size.waist}</td>
                      <td className="py-3 px-4">{size.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Women's Dress Sizes */}
        <div className="mb-10">
          <div className="card overflow-hidden">
            <div className="bg-primary-700 p-5 border-b border-border-color">
              <div className="flex items-center gap-4">
                <div className="surface flex h-12 w-12 items-center justify-center rounded-md text-primary-600">
                  <FaTshirt className="text-2xl" />
                </div>
                <h2 className="text-lg lg:text-xl font-bold">
                  Women's Clothing Size Chart
                </h2>
              </div>
            </div>
            <div className="p-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-color">
                    <th className="text-left py-3 px-4 font-bold">Size</th>
                    <th className="text-left py-3 px-4 font-bold">Bust (in)</th>
                    <th className="text-left py-3 px-4 font-bold">
                      Waist (in)
                    </th>
                    <th className="text-left py-3 px-4 font-bold">Hips (in)</th>
                  </tr>
                </thead>
                <tbody>
                  {womenDressSizes.map((size, index) => (
                    <tr
                      key={index}
                      className="border-b border-border-color hover:bg-primary-100  transition-colors duration-200"
                    >
                      <td className="py-3 px-4 font-semibold text-primary-500">
                        {size.size}
                      </td>
                      <td className="py-3 px-4">{size.bust}</td>
                      <td className="py-3 px-4">{size.waist}</td>
                      <td className="py-3 px-4">{size.hips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Shoe Sizes */}
        <div className="mb-10">
          <div className="card overflow-hidden">
            <div className="bg-primary-700 p-5 border-b border-border-color">
              <div className="flex items-center gap-4">
                <div className="surface flex h-12 w-12 items-center justify-center rounded-md text-primary-600">
                  <FaShoePrints className="text-2xl" />
                </div>
                <h2 className="text-lg lg:text-xl font-bold">
                  Shoe Size Conversion Chart
                </h2>
              </div>
            </div>
            <div className="p-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-color">
                    <th className="text-left py-3 px-4 font-bold">US</th>
                    <th className="text-left py-3 px-4 font-bold">UK</th>
                    <th className="text-left py-3 px-4 font-bold">EU</th>
                    <th className="text-left py-3 px-4 font-bold">CM</th>
                  </tr>
                </thead>
                <tbody>
                  {shoeSizes.map((size, index) => (
                    <tr
                      key={index}
                      className="border-b border-border-color hover:bg-primary-100  transition-colors duration-200"
                    >
                      <td className="py-3 px-4 font-semibold text-primary-500">
                        {size.us}
                      </td>
                      <td className="py-3 px-4">{size.uk}</td>
                      <td className="py-3 px-4">{size.eu}</td>
                      <td className="py-3 px-4">{size.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Kids Clothing Sizes */}
        <div className="mb-10">
          <div className="card overflow-hidden">
            <div className="bg-primary-700 p-5 border-b border-border-color">
              <div className="flex items-center gap-4">
                <div className="surface flex h-12 w-12 items-center justify-center rounded-md text-primary-600">
                  <FaChild className="text-2xl" />
                </div>
                <h2 className="text-lg lg:text-xl font-bold">
                  Kids Clothing Size Chart
                </h2>
              </div>
            </div>
            <div className="p-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-color">
                    <th className="text-left py-3 px-4 font-bold">Age</th>
                    <th className="text-left py-3 px-4 font-bold">
                      Height (cm)
                    </th>
                    <th className="text-left py-3 px-4 font-bold">
                      Chest (cm)
                    </th>
                    <th className="text-left py-3 px-4 font-bold">
                      Waist (cm)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {kidsClothingSizes.map((size, index) => (
                    <tr
                      key={index}
                      className="border-b border-border-color hover:bg-primary-100  transition-colors duration-200"
                    >
                      <td className="py-3 px-4 font-semibold text-primary-500">
                        {size.size}
                      </td>
                      <td className="py-3 px-4">{size.height}</td>
                      <td className="py-3 px-4">{size.chest}</td>
                      <td className="py-3 px-4">{size.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="card mt-8 px-5 py-10 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Need Help Finding Your Size?
          </h2>
          <p className="max-w-2xl mx-auto mb-6">
            Our customer service team is here to help you find the perfect fit.
            Contact us for personalized sizing assistance.
          </p>
          <Link to="/contact" className="btn primary-btn px-8 py-3">
            Contact Customer Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideline;
