import { createBrowserRouter } from "react-router";
import RootLayout from "../../layouts/RootLayout/RootLayout";
import Home from "../../pages/HomePage/Home/Home";
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";
import SignUp from "../../pages/AuthPages/SignUp/SignUp";
import SignIn from "../../pages/AuthPages/SignIn/SignIn";
import Forgot from "../../pages/AuthPages/Forgot/Forgot";
import Reset from "../../pages/AuthPages/Reset/Reset";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import AdminOverview from "../../pages/Dashboard/AdminPages/AdminOverview/AdminOverview";
import AllUsers from "../../pages/Dashboard/AdminPages/Users/AllUsers";
import AdminRoute from "../AdminRoute/AdminRoute";
import UserDetails from "../../pages/Dashboard/AdminPages/Users/UserDetails";
import AllCategory from "../../pages/Dashboard/AdminPages/Categories/AllCategory";
import PrivacyPolicy from "../../pages/PolicyPages/PrivacyPolicy/PrivacyPolicy";
import TermsConditions from "../../pages/PolicyPages/TermsConditions/TermsConditions";
import ReturnsPolicy from "../../pages/PolicyPages/ReturnsPolicy/ReturnsPolicy";
import SupportCenter from "../../pages/SupportCenter/SupportCenter";
import AboutUs from "../../pages/AboutUs/AboutUs";
import ContactUs from "../../pages/ContactUs/ContactUs";
import SizeGuide from "../../pages/SizeGuideline/SizeGuideline";
import AllFaq from "../../pages/Dashboard/AdminPages/FAQ/AllFaq";
import AllRule from "../../pages/Dashboard/AdminPages/Rules/AllRule";
import AllWithdrawals from "../../pages/Dashboard/AdminPages/AllWithdrawals/AllWithdrawals";
import Shop from "../../pages/Shop/Shop";
import ProductsByCategory from "../../pages/Products/ProductsByCategory/ProductsByCategory";
import NewProduct from "../../pages/Products/NewProduct/NewProduct";
import AllSlider from "../../pages/Dashboard/AdminPages/Sliders/AllSlider";
import AddSlider from "../../pages/Dashboard/AdminPages/Sliders/AddSlider";
import UpdateSlider from "../../pages/Dashboard/AdminPages/Sliders/UpdateSlider";
import CartPage from "../../pages/Products/CartPage/CartPage";
import AllOrders from "../../pages/Dashboard/AdminPages/Orders/AllOrders";
import OrderDetails from "../../pages/Dashboard/AdminPages/Orders/OrderDetails";
import OurJourney from "../../pages/Dashboard/AdminPages/Milestones/Milestones";
import AdminSettings from "../../pages/Dashboard/AdminPages/AdminSettings/AdminSettings";
import TrackOrder from "../../pages/OrderPages/TrackOrder/TrackOrder";
import AllProducts from "../../pages/Dashboard/AdminPages/Products/AllProducts";
import AddProduct from "../../pages/Dashboard/AdminPages/Products/AddProduct";
import UpdateProduct from "../../pages/Dashboard/AdminPages/Products/UpdateProduct";
import DashLayout from "../../layouts/DashLayout/DashLayout";
import MyOrders from "../../pages/Dashboard/SellerPages/MyOrders/MyOrders";
import Wishlist from "../../pages/Dashboard/SellerPages/Wishlist/Wishlist";
import SellerProfile from "../../pages/Dashboard/SellerPages/SellerProfile/SellerProfile";
import SellerOverview from "../../pages/Dashboard/SellerPages/SellerOverview/SellerOverview";
import SellerSettings from "../../pages/Dashboard/SellerPages/SellerSettings/SellerSettings";
import BalanceStatement from "../../pages/Dashboard/SellerPages/BalanceStatement/BalanceStatement";
import DigitalWallet from "../../pages/Dashboard/SellerPages/DigitalWallet/DigitalWallet";
import MyRefer from "../../pages/Dashboard/SellerPages/MyRefer/MyRefer";
import ViewRules from "../../pages/Dashboard/SellerPages/ViewRules/ViewRules";
import CreateWithdrawal from "../../pages/Dashboard/SellerPages/CreateWithdrawal/CreateWithdrawal";
import MyWithdrawals from "../../pages/Dashboard/SellerPages/MyWithdrawals/MyWithdrawals";
import Invoice from "../../pages/Dashboard/CommonPages/Invoice/Invoice";
import NotFound from "../../components/NotFound/NotFound";
import AllSubCategory from "../../pages/Dashboard/AdminPages/SubCategories/AllSubCategory";
import Checkout from "../../pages/Products/CheckoutPage/Checkout";
import ProductDetails from "../../pages/Products/ProductDetails/ProductDetails";
import DeliveryPayment from "../../pages/PaymentPages/DeliveryPayment";
import SubscriptionPayment from "../../pages/PaymentPages/SubscriptionPayment";
import AddFundsPayment from "../../pages/PaymentPages/ManualPayment";
import ProfitStatement from "../../pages/Dashboard/SellerPages/ProfitStatement/ProfitStatement";
import PlatformProfit from "../../pages/Dashboard/AdminPages/PlatformProfit/PlatformProfit";
import Reselling from "../../pages/Reselling/Reselling";
import Promotion from "../../pages/Promotion/Promotion";
import Marketing from "../../pages/Marketing/Marketing";
import AllPromotionCategory from "../../pages/Dashboard/AdminPages/PromotionCategories/AllPromotionCategory";
import AllPromotionPack from "../../pages/Dashboard/AdminPages/PromotionPacks/AllPromotionPack";
import AllMarketingPack from "../../pages/Dashboard/AdminPages/MarketingPacks/AllMarketingPack";
import AllTaskManager from "../../pages/Dashboard/AdminPages/TaskManager/AllTaskManager";
import AllPromotionPurchases from "../../pages/Dashboard/AdminPages/Purchases/AllPromotionPurchases";
import AllMarketingPurchases from "../../pages/Dashboard/AdminPages/Purchases/AllMarketingPurchases";
import MyPromotionPurchases from "../../pages/Dashboard/SellerPages/MyPromotionPurchases/MyPromotionPurchases";
import MyMarketingPurchases from "../../pages/Dashboard/SellerPages/MyMarketingPurchases/MyMarketingPurchases";
import SubmitPost from "../../pages/Dashboard/SellerPages/SubmitPost/SubmitPost";
import AdminPostSubmissions from "../../pages/Dashboard/AdminPages/PostSubmissions/AdminPostSubmissions";
import AddFunds from "../../pages/Dashboard/SellerPages/AddFunds/AddFunds";
import MyAddFunds from "../../pages/Dashboard/SellerPages/MyAddFunds/MyAddFunds";
import AllAddFunds from "../../pages/Dashboard/AdminPages/AddFunds/AllAddFunds";
import TodoList from "../../pages/Dashboard/SellerPages/TodoList/TodoList";
import TodoSubmit from "../../pages/Dashboard/SellerPages/TodoSubmit/TodoSubmit";
import AllSubmittedTasks from "../../pages/Dashboard/AdminPages/SubmittedTasks/AllSubmittedTasks";
import ManualPayment from "../../pages/PaymentPages/ManualPayment";
import StarPaySuccess from "../../pages/PaymentPages/StarPaySuccess";
import ReqFreeActivation from "../../components/ReqFreeActivation/ReqFreeActivation";
import SubCategoriesByCategory from "../../pages/SubCategoriesByCategory/SubCategoriesByCategory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "reselling",
        element: <Reselling />,
      },
      {
        path: "promotion",
        element: <Promotion />,
      },
      {
        path: "marketing",
        element: <Marketing />,
      },
      {
        path: "products",
        element: <Shop />,
      },
      {
        path: "category/new-product",
        element: <NewProduct />,
      },
      {
        path: "category/:category",
        element: <SubCategoriesByCategory />,
      },
      {
        path: "category/:category/sub/:subCategory",
        element: <ProductsByCategory />,
      },
      {
        path: "products/:id",
        element: <ProductDetails />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "track-order",
        element: <TrackOrder />,
      },
      {
        path: "req-free-activation",
        element: <ReqFreeActivation />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms-conditions",
        element: <TermsConditions />,
      },
      {
        path: "returns-policy",
        element: <ReturnsPolicy />,
      },
      {
        path: "support",
        element: <SupportCenter />,
      },
      {
        path: "about",
        element: <AboutUs />,
      },
      {
        path: "contact",
        element: <ContactUs />,
      },
      {
        path: "size-guide",
        element: <SizeGuide />,
      },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "sign-up",
            element: <SignUp />,
          },
          {
            path: "sign-in",
            element: <SignIn />,
          },
          {
            path: "forgot-pass",
            element: <Forgot />,
          },
          {
            path: "reset-pass",
            element: <Reset />,
          },
        ],
      },
    ],
  },

  {
    path: "/payment/success",
    errorElement: <NotFound />,
    element: <StarPaySuccess />,
  },

  {
    path: "/add-funds-payment",
    errorElement: <NotFound />,
    element: (
      <PrivateRoute>
        <AddFundsPayment />
      </PrivateRoute>
    ),
  },

  {
    path: "/payment/:purpose/:amount",
    errorElement: <NotFound />,
    element: <ManualPayment />,
  },

  {
    path: "delivery-payment",
    errorElement: <NotFound />,
    element: <DeliveryPayment />,
  },

  {
    path: "/invoice/order/:id",
    errorElement: <NotFound />,
    element: (
      <PrivateRoute>
        <Invoice />
      </PrivateRoute>
    ),
  },

  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashLayout />
      </PrivateRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: "admin/overview",
        element: (
          <AdminRoute>
            <AdminOverview />
          </AdminRoute>
        ),
      },
      {
        path: "admin/all-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
      {
        path: "admin/all-users/user-details/:id",
        element: (
          <AdminRoute>
            <UserDetails />
          </AdminRoute>
        ),
      },

      // Categories Management Routes
      {
        path: "admin/categories",
        element: (
          <AdminRoute>
            <AllCategory />
          </AdminRoute>
        ),
      },

      // Product Management Routes
      {
        path: "admin/products",
        element: (
          <AdminRoute>
            <AllProducts />
          </AdminRoute>
        ),
      },
      {
        path: "admin/products/add-new",
        element: (
          <AdminRoute>
            <AddProduct />
          </AdminRoute>
        ),
      },
      {
        path: "admin/products/update/:id",
        element: (
          <AdminRoute>
            <UpdateProduct />
          </AdminRoute>
        ),
      },

      // SubCategory Management Routes
      {
        path: "admin/sub-categories",
        element: (
          <AdminRoute>
            <AllSubCategory />
          </AdminRoute>
        ),
      },

      // Promotion Management Routes
      {
        path: "admin/promotion-categories",
        element: (
          <AdminRoute>
            <AllPromotionCategory />
          </AdminRoute>
        ),
      },
      {
        path: "admin/promotion-packs",
        element: (
          <AdminRoute>
            <AllPromotionPack />
          </AdminRoute>
        ),
      },
      {
        path: "admin/marketing-packs",
        element: (
          <AdminRoute>
            <AllMarketingPack />
          </AdminRoute>
        ),
      },
      {
        path: "admin/task-manager",
        element: (
          <AdminRoute>
            <AllTaskManager />
          </AdminRoute>
        ),
      },
      {
        path: "admin/submitted-tasks",
        element: (
          <AdminRoute>
            <AllSubmittedTasks />
          </AdminRoute>
        ),
      },
      {
        path: "admin/promotion-purchases",
        element: (
          <AdminRoute>
            <AllPromotionPurchases />
          </AdminRoute>
        ),
      },
      {
        path: "admin/marketing-purchases",
        element: (
          <AdminRoute>
            <AllMarketingPurchases />
          </AdminRoute>
        ),
      },
      {
        path: "admin/add-funds",
        element: (
          <AdminRoute>
            <AllAddFunds />
          </AdminRoute>
        ),
      },

      // Orders Management Routes
      {
        path: "admin/orders",
        element: (
          <AdminRoute>
            <AllOrders />
          </AdminRoute>
        ),
      },

      {
        path: "order-details/:id",
        element: <OrderDetails />,
      },

      // Platform Profit Routes
      {
        path: "admin/platform-profit",
        element: (
          <AdminRoute>
            <PlatformProfit />
          </AdminRoute>
        ),
      },

      // Sliders Management Routes
      {
        path: "admin/all-sliders",
        element: (
          <AdminRoute>
            <AllSlider />
          </AdminRoute>
        ),
      },
      {
        path: "admin/all-sliders/add-new",
        element: (
          <AdminRoute>
            <AddSlider />
          </AdminRoute>
        ),
      },
      {
        path: "admin/all-sliders/update/:id",
        element: (
          <AdminRoute>
            <UpdateSlider />
          </AdminRoute>
        ),
      },

      // FAQ Management Routes
      {
        path: "admin/faq-management",
        element: (
          <AdminRoute>
            <AllFaq />
          </AdminRoute>
        ),
      },
      // Rules Management Routes
      {
        path: "admin/rules-management",
        element: (
          <AdminRoute>
            <AllRule />
          </AdminRoute>
        ),
      },
      // Withdrawals Management Routes
      {
        path: "admin/withdrawals",
        element: (
          <AdminRoute>
            <AllWithdrawals />
          </AdminRoute>
        ),
      },

      // Our Journey Management Routes
      {
        path: "admin/milestones",
        element: (
          <AdminRoute>
            <OurJourney />
          </AdminRoute>
        ),
      },

      // Settings Management Route
      {
        path: "admin/settings",
        element: (
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        ),
      },
      {
        path: "admin/post-submissions",
        element: (
          <AdminRoute>
            <AdminPostSubmissions />
          </AdminRoute>
        ),
      },

      // ---------------- Seller Dashboard Routes ----------------
      {
        path: "seller/subscription",
        element: (
          <PrivateRoute>
            <SubscriptionPayment />
          </PrivateRoute>
        ),
      },
      {
        path: "seller/overview",
        element: <SellerOverview />,
      },
      {
        path: "seller/profile",
        element: <SellerProfile />,
      },
      {
        path: "seller/settings",
        element: <SellerSettings />,
      },
      {
        path: "seller/my-orders",
        element: <MyOrders />,
      },
      {
        path: "seller/add-funds",
        element: <AddFunds />,
      },
      {
        path: "seller/my-add-funds",
        element: <MyAddFunds />,
      },
      {
        path: "seller/my-purchases",
        element: <MyPromotionPurchases />,
      },
      {
        path: "seller/submit-posts",
        element: <SubmitPost />,
      },
      {
        path: "seller/my-marketing-purchases",
        element: <MyMarketingPurchases />,
      },
      {
        path: "seller/todo-list",
        element: <TodoList />,
      },
      {
        path: "seller/todo-submit/:taskId",
        element: <TodoSubmit />,
      },
      {
        path: "seller/wishlist",
        element: <Wishlist />,
      },
      {
        path: "seller/digital-wallet",
        element: <DigitalWallet />,
      },
      {
        path: "seller/my-refer",
        element: <MyRefer />,
      },
      {
        path: "seller/balance-statement",
        element: <BalanceStatement />,
      },
      {
        path: "seller/create-withdrawal",
        element: <CreateWithdrawal />,
      },
      {
        path: "seller/my-withdrawals",
        element: <MyWithdrawals />,
      },

      {
        path: "seller/profit-statement",
        element: <ProfitStatement />,
      },
      {
        path: "seller/rules",
        element: <ViewRules />,
      },
    ],
  },
]);

export default router;
