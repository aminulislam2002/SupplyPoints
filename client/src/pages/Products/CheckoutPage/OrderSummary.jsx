import { RiCloseFill } from "react-icons/ri";

const OrderSummary = ({
  products,
  deliveryInfo,
  resellerPrice,
  totalProfit,
  platform,
  advanceAmount,
}) => {
  const codChargePer = Number(platform?.codCharge || 1);

  // Remaining Amount for COD calculation
  const remainingAmountForCOD =
    resellerPrice + deliveryInfo?.deliveryCharge - advanceAmount;
  const codCharge =
    remainingAmountForCOD > 0
      ? (remainingAmountForCOD * codChargePer) / 100
      : 0;

  const packagingCharge = Number(platform?.packagingCharge || 10);

  const netProfit = totalProfit - (packagingCharge + codCharge);

  return (
    <div className="surface col-span-12 p-5 sm:p-6 lg:col-span-5">
      {products.length > 0 &&
        products.map((product, index) => (
          <div key={index}>
            {/* Product Details */}
            <div className="relative w-full h-full flex justify-start items-start gap-2.5 mb-5">
              <img
                src={import.meta.env.VITE_IMAGE_URL + product?.thumbnail}
                alt={product?.title}
                className="h-28 w-24 rounded-lg object-cover"
              />

              <div className="relative w-full h-full space-y-1.5">
                {/* Product Title */}
                <h3 className="text-base font-primary font-medium line-clamp-1">
                  {product?.title}
                </h3>

                {/* Pricing Part */}
                <div className="flex justify-start items-center gap-2.5">
                  {/* Price */}
                  <div className="flex justify-center items-center gap-2.5">
                    <span className="flex items-center gap-1 italic">
                      {product?.selectedQuantity}
                      <RiCloseFill />৳{product?.resellerPrice}
                    </span>{" "}
                    ={" "}
                    <span className="font-bold">
                      ৳{product?.resellerPrice * product?.selectedQuantity}
                    </span>
                  </div>
                </div>

                {/* Select Color & Size */}
                {(product?.selectedColor || product?.selectedSize) && (
                  <div className="flex flex-wrap gap-2 text-sm font-primary">
                    {product?.selectedColor && (
                      <div className="badge badge-info rounded-md">
                        <span className="font-semibold">Color:</span>{" "}
                        {product?.selectedColor}
                      </div>
                    )}
                    {product?.selectedSize && (
                      <div className="badge badge-info rounded-md">
                        <span className="font-semibold">Size:</span>{" "}
                        {product?.selectedSize}
                      </div>
                    )}
                  </div>
                )}

                {/* Profit */}
                <div className="badge badge-success min-h-8 rounded-md">
                  Profit: ৳{product?.profit}
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Enhanced Reseller Price Breakdown */}
      <div className="surface-muted relative w-full space-y-3 p-4">
        {/* Selling Price */}
        <div className="flex justify-between items-center font-primary text-sm font-medium">
          <span>Sale Price</span>
          <span className="font-bold">৳{resellerPrice.toFixed(2)}</span>
        </div>

        {/* Delivery Charge */}
        <div className="flex justify-between items-center font-primary text-sm font-medium">
          <span>Delivery Charge</span>
          <span className="text-teal-500">
            ৳ {deliveryInfo?.deliveryCharge.toFixed(2)}
          </span>
        </div>
        {/* Packaging Charge */}
        {/* <div className="flex justify-between items-center font-primary text-sm font-medium">
          <span>Packaging Charge</span>
          <span className="text-red-500">
            - ৳{deliveryInfo?.packagingCharge.toFixed(2)}
          </span>
        </div> */}
        {/* COD Charge */}
        {/* <div className="flex justify-between items-center font-primary text-sm font-medium">
          <span>COD Charge</span>
          <span className="text-yellow-500"> - ৳{codCharge.toFixed(2)}</span>
        </div> */}

        {/* Profit */}
        {/* <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-green-500 ">Your Profit</span>
          <div className="text-right">
            <span className="text-green-500  font-semibold">
              ৳{netProfit.toFixed(2)}
            </span>
          </div>
        </div> */}

        {/* Advance Payment */}
        {advanceAmount > 0 && (
          <div className="flex justify-between items-center font-primary text-sm font-medium">
            <span className="text-green-500">Advance Payment</span>
            <span className="text-green-500 font-semibold">
              ৳{advanceAmount.toFixed(2)}
            </span>
          </div>
        )}

        <hr className="border-border-color" />
        {/* Final Total */}
        <div className="flex items-center justify-between rounded-lg bg-primary-100 p-3 text-lg font-bold">
          <span className="text-primary-800 ">
            {advanceAmount > 0 ? "Due at Delivery" : "Customer Pays"}
          </span>
          <span className="text-primary-800 ">
            ৳
            {(
              resellerPrice +
              deliveryInfo.deliveryCharge -
              advanceAmount
            ).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
