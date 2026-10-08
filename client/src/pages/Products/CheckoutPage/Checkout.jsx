import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth/useAuth";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import usePlatform from "../../../hooks/usePlatform/usePlatform";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";
import Loader from "../../../components/Loader/Loader";
import useAxiosSecure from "../../../hooks/useAxiosSecure/useAxiosSecure";
import CourierFraudCheck from "./CourierFraudCheck";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const Checkout = () => {
  const location = useLocation();
  const products = location?.state?.data || [];
  const axiosSecure = useAxiosSecure();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const { platform, isPlatformPending } = usePlatform();
  const { user } = useAuth();

  const params = {
    currentPage: 1,
    limitPerPage: 2,
  };

  // Fetch all orders
  const {
    isLoading: isOrdersLoading,
    data: allOrdersResponse = {}, // Default to an empty object
  } = useQuery({
    queryKey: ["orders", params],
    queryFn: async ({ queryKey }) => {
      const [, p] = queryKey;
      const res = await axiosSecure.get("/orders/my-orders", { params: p });

      return res.data;
    },

    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  // Destructure data and hasMore
  const { data: myOrders = [], totalOrders } = allOrdersResponse;

  let paymentMethod =
    user?.subscriptionType !== "Free" || totalOrders > 2
      ? "Cash On Delivery"
      : "Advanced Payment";

  const [deliveryInfo, setDeliveryInfo] = useState({
    deliveryArea: "",
    deliveryCharge: 0,
    packagingCharge: platform?.packagingCharge || 10,
    codCharge: 0,
    paymentMethod: paymentMethod,
  });

  // Delivery charge payment method state
  const [deliveryPaymentMethod, setDeliveryPaymentMethod] = useState(
    user?.balance >= 0 ? "Balance" : "Manual",
  );

  // Advance payment amount state
  const [advanceAmount, setAdvanceAmount] = useState(0);

  // Function to handle delivery location change
  const handleDeliveryLocationChange = (zilla, thana = "") => {
    const dhakaSubAreas = [
      "কেরাণীগঞ্জ",
      "কেরাণীগঞ্জ মডেল",
      "দোহার",
      "ধামরাই",
      "নবাবগঞ্জ",
      "সাভার",
    ];

    const charge =
      zilla !== "ঢাকা" ? 120 : dhakaSubAreas.includes(thana) ? 90 : 60;

    setShowWarning(false);
    setDeliveryInfo((prevData) => ({
      ...prevData,
      deliveryArea: zilla,
      deliveryCharge: charge,
    }));

    // Update advance amount if Advanced Payment is selected
    if (deliveryInfo.paymentMethod === "Advanced Payment") {
      setAdvanceAmount(charge);
    }
  };

  // Payment Method change
  const handlePaymentMethodChange = (value) => {
    setDeliveryInfo((prevData) => ({
      ...prevData,
      paymentMethod: value,
    }));

    if (value === "Cash On Delivery") {
      setAdvanceAmount(0);
    } else if (value === "Advanced Payment") {
      setAdvanceAmount(deliveryInfo.deliveryCharge || 0);
    }
  };

  // Calculate total price and reseller metrics
  const calculateTotals = () => {
    let productsPrice = 0; // Total products price (website price)
    let resellerPrice = 0; // Total selling price (what customers pay)
    let totalProfit = 0;

    products?.map((product) => {
      const costPrice = product?.price || 0;
      const sellPrice = product?.resellerPrice || 0;
      const selectedQuantity = product?.selectedQuantity || 0;

      // Calculate totals for the selected quantity
      const productsAmount = costPrice * selectedQuantity;
      const sellingAmount = sellPrice * selectedQuantity;
      const costAmount = costPrice * selectedQuantity;
      const profitAmount = sellingAmount - costAmount;

      productsPrice += productsAmount;
      resellerPrice += sellingAmount;
      totalProfit += profitAmount;
    });

    return { resellerPrice, totalProfit, productsPrice };
  };

  const { resellerPrice, totalProfit, productsPrice } = calculateTotals();
  const packagingCharge = Number(deliveryInfo?.packagingCharge || 0);
  const codChargePer = Number(platform?.codCharge || 1);

  // Updated COD Charge Logic based on remaining amount (Reseller Price - Advance Amount)
  const remainingAmountForCOD =
    resellerPrice +
    deliveryInfo?.deliveryCharge -
    (deliveryInfo?.paymentMethod === "Advanced Payment" ? advanceAmount : 0);

  const codCharge =
    remainingAmountForCOD > 0
      ? (remainingAmountForCOD * codChargePer) / 100
      : 0;

  const finalDeliveryInfo = {
    ...deliveryInfo,
    codCharge,
  };

  const charge = packagingCharge + codCharge;

  const netProfit = totalProfit - charge;

  const orderInfo = {
    // Products
    products,
    // Delivery Info
    deliveryInfo: finalDeliveryInfo,

    // Total amount from products price
    productsPrice,
    // Total amount from reseller price
    resellerPrice,
    // Reseller profit after packaging deduction (stored in backend)
    totalProfit: netProfit,
    // Advance payment amount
    advanceAmount:
      deliveryInfo.paymentMethod === "Advanced Payment" ? advanceAmount : 0,
  };

  // Order submit
  const onSubmit = async (data) => {
    if (!deliveryInfo?.deliveryArea) {
      setShowWarning(true);
      return;
    }

    // Cash On Delivery - no payment needed
    if (deliveryInfo.paymentMethod === "Cash On Delivery") {
      await processCODOrder(data);
      return;
    }

    // Advanced Payment
    if (deliveryPaymentMethod === "Balance") {
      if (!user?.balance || user.balance < advanceAmount) {
        Swal.fire({
          title: "Insufficient Balance!",
          text: `You need ৳${advanceAmount} for advance payment. Your current balance: ৳${user?.balance || 0}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Pay Manually",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            setDeliveryPaymentMethod("Manual");
            redirectToPayment(data);
          }
        });
        return;
      }

      await processBalancePayment(data);
    } else {
      redirectToPayment(data);
    }
  };

  // Cash On Delivery - place order directly
  const processCODOrder = async (data) => {
    setIsLoading(true);

    const orderData = {
      ...orderInfo,
      customerInfo: data,
      deliveryPaymentMethod: "COD",
      deliveryPaymentStatus: "Unpaid",
    };

    try {
      const res = await axiosSecure.post("/orders", orderData);
      const successMessage = res?.data?.message || "Order placed successfully!";

      Swal.fire({
        title: successMessage,
        text: "আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে!",
        icon: "success",
        draggable: true,
      });

      navigate("/");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      Swal.fire({
        title: errorMessage,
        icon: "error",
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Process payment from balance (Advanced Payment)
  const processBalancePayment = async (data) => {
    setIsLoading(true);

    const orderData = {
      ...orderInfo,
      customerInfo: data,
      deliveryPaymentMethod: "Balance",
      deliveryPaymentStatus: "Paid",
      balanceDeducted: advanceAmount,
    };

    try {
      const res = await axiosSecure.post("/orders", orderData);
      const successMessage = res?.data?.message || "Order placed successfully!";

      Swal.fire({
        title: successMessage,
        text: `৳${advanceAmount} deducted from your balance`,
        icon: "success",
        draggable: true,
      });

      navigate("/");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      Swal.fire({
        title: errorMessage,
        icon: "error",
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to payment page for manual payment (Advanced Payment)
  const redirectToPayment = (data) => {
    const paymentData = {
      orderInfo,
      customerInfo: data,
      deliveryCharge: advanceAmount,
      deliveryPaymentMethod: "Manual",
    };

    navigate("/delivery-payment", {
      state: {
        paymentData,
        returnUrl: "/checkout-confirmation",
      },
    });
  };

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Checkout", active: true },
  ];

  if ((isOrdersLoading && myOrders.length === 0) || isPlatformPending) {
    return <Loader />;
  }

  return (
    <div className="relative w-full min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <CourierFraudCheck />

        <div className="mb-8">
          <p className="caption mb-2 uppercase tracking-[0.18em] text-primary-600">
            Secure checkout
          </p>
          <h1 className="page-title">Checkout</h1>
          <p className="body-copy mt-2">
            Review your delivery details and place your order with confidence.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-5 lg:gap-10">
          {/* Checkout Form */}
          <CheckoutForm
            deliveryInfo={deliveryInfo}
            showWarning={showWarning}
            handleDeliveryLocationChange={handleDeliveryLocationChange}
            onSubmit={onSubmit}
          />

          {/* Order Details */}
          <OrderSummary
            products={products}
            deliveryInfo={deliveryInfo}
            resellerPrice={resellerPrice}
            advanceAmount={
              deliveryInfo.paymentMethod === "Advanced Payment"
                ? advanceAmount
                : 0
            }
            handlePaymentMethodChange={handlePaymentMethodChange}
            user={user}
            totalOrders={totalOrders}
            deliveryPaymentMethod={deliveryPaymentMethod}
            setDeliveryPaymentMethod={setDeliveryPaymentMethod}
            setAdvanceAmount={setAdvanceAmount}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
