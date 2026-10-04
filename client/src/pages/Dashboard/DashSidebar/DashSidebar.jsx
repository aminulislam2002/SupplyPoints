/* eslint-disable no-unused-vars */
import { AiOutlineClose } from "react-icons/ai";
import { Link, NavLink } from "react-router";
import { useContext } from "react";
import { GoHome } from "react-icons/go";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { TbCategory2, TbShoppingCartDollar } from "react-icons/tb";
import { BsCartCheck } from "react-icons/bs";
import { TfiLayoutSlider } from "react-icons/tfi";
import { VscGraphLine } from "react-icons/vsc";
import {
  FaQuestionCircle,
  FaShoppingBag,
  FaMoneyBillWave,
  FaUserFriends,
} from "react-icons/fa";
import { MdOutlineCampaign } from "react-icons/md";
import { MdRule } from "react-icons/md";
import { PiWallet } from "react-icons/pi";
import { GrSteps } from "react-icons/gr";
import {
  MdDashboard,
  MdOutlinePayment,
  MdOutlineTaskAlt,
} from "react-icons/md";
import { BiSupport } from "react-icons/bi";

import { SidebarContext } from "../../../providers/SidebarProvider/SidebarProvider";
import useAuth from "../../../hooks/useAuth/useAuth";
import useRole from "../../../hooks/useRole/useRole";
import Loader from "../../../components/Loader/Loader";

const DashSidebar = () => {
  const { toggleSidebar } = useContext(SidebarContext);
  const { user, loggedOut, isUserPending } = useAuth();
  const { isRolePending, isAdmin, isSeller, isUser } = useRole();

  const adminLinks = [
    {
      to: "/dashboard/admin/overview",
      icon: MdDashboard,
      label: "Dashboard",
    },
    {
      to: "/dashboard/admin/all-users",
      icon: LuUsers,
      label: "All Users",
    },
    {
      to: "/dashboard/admin/orders",
      icon: TbShoppingCartDollar,
      label: "All Orders",
    },
    {
      to: "/dashboard/admin/products",
      icon: BsCartCheck,
      label: "Products",
    },
    {
      to: "/dashboard/admin/categories",
      icon: TbCategory2,
      label: "Categories",
    },
    {
      to: "/dashboard/admin/sub-categories",
      icon: TbCategory2,
      label: "Sub Categories",
    },
    {
      to: "/dashboard/admin/promotion-categories",
      icon: TbCategory2,
      label: "Promotion Categories",
    },
    {
      to: "/dashboard/admin/promotion-packs",
      icon: BsCartCheck,
      label: "Promotion Packs",
    },
    {
      to: "/dashboard/admin/marketing-packs",
      icon: BsCartCheck,
      label: "Marketing Packs",
    },
    {
      to: "/dashboard/admin/task-manager",
      icon: MdOutlineTaskAlt,
      label: "Task Manager",
    },
    {
      to: "/dashboard/admin/submitted-tasks",
      icon: MdOutlineTaskAlt,
      label: "Submitted Tasks",
    },
    {
      to: "/dashboard/admin/promotion-purchases",
      icon: MdOutlineCampaign,
      label: "Promotion Purchases",
    },
    {
      to: "/dashboard/admin/marketing-purchases",
      icon: MdOutlineCampaign,
      label: "Marketing Purchases",
    },
    {
      to: "/dashboard/admin/add-funds",
      icon: MdOutlinePayment,
      label: "All Payments",
    },
    {
      to: "/dashboard/admin/withdrawals",
      icon: FaMoneyBillWave,
      label: "Withdrawals",
    },
    {
      to: "/dashboard/admin/post-submissions",
      icon: MdOutlineCampaign,
      label: "Post Submissions",
    },
    {
      to: "/dashboard/admin/platform-profit",
      icon: VscGraphLine,
      label: "Platform Profit",
    },
    {
      to: "/dashboard/admin/all-sliders",
      icon: TfiLayoutSlider,
      label: "All Sliders",
    },
    {
      to: "/dashboard/admin/faq-management",
      icon: FaQuestionCircle,
      label: "FAQ's",
    },
    {
      to: "/dashboard/admin/rules-management",
      icon: MdRule,
      label: "Seller Rules",
    },
    {
      to: "/dashboard/admin/milestones",
      icon: GrSteps,
      label: "Milestones",
    },
  ];

  const customerLinks = [
    {
      to: "/dashboard/seller/overview",
      icon: MdDashboard,
      label: "Dashboard",
    },
    {
      to: "/dashboard/seller/my-orders",
      icon: FaShoppingBag,
      label: "My Orders",
    },
    {
      to: "/dashboard/seller/add-funds",
      icon: FaMoneyBillWave,
      label: "Add Funds",
    },
    {
      to: "/dashboard/seller/todo-list",
      icon: MdOutlineTaskAlt,
      label: "TODO List",
    },
    // {
    //   to: "/dashboard/seller/wishlist",
    //   icon: FaHeart,
    //   label: "Wishlist Items",
    // },
    {
      to: "/dashboard/seller/digital-wallet",
      icon: PiWallet,
      label: "Digital Wallet",
    },

    {
      to: "/dashboard/seller/my-refer",
      icon: FaUserFriends,
      label: "My Referrals",
    },
    {
      to: "/dashboard/seller/my-purchases",
      icon: MdOutlineCampaign,
      label: "Promotion Purchases",
    },
    {
      to: "/dashboard/seller/submit-posts",
      icon: MdOutlineCampaign,
      label: "Earn by Review",
    },
    {
      to: "/dashboard/seller/my-marketing-purchases",
      icon: MdOutlineCampaign,
      label: "Marketing Purchases",
    },
    {
      to: "/dashboard/seller/rules",
      icon: MdRule,
      label: "Seller Rules",
    },
    {
      to: "/support",
      icon: BiSupport,
      label: "Support Center",
    },
  ];

  const links = isAdmin ? adminLinks : isSeller || isUser ? customerLinks : [];

  if (isRolePending || isUserPending) {
    return <Loader />;
  }

  return (
    <div className="relative h-full w-full border-r border-border-color bg-card-bg">
      {/* Sidebar Header */}
      <div className="h-[10vh] border-b border-border-color">
        {/* Mobile & Tablet Devices */}
        <Link
          to={
            isAdmin
              ? "/dashboard/admin/overview"
              : isSeller || isUser
                ? "/dashboard/seller/overview"
                : "/"
          }
          onClick={toggleSidebar}
          className="flex h-full w-full items-center justify-center bg-primary-700 px-3.5 text-base font-bold uppercase text-primary-50 transition-colors duration-300 lg:hidden"
        >
          Dashboard
        </Link>

        {/* Large Screen Devices */}
        <Link
          to={
            isAdmin
              ? "/dashboard/admin/overview"
              : isSeller || isUser
                ? "/dashboard/seller/overview"
                : "/"
          }
          className="hidden h-full w-full items-center justify-center bg-primary-700 px-3.5 text-base font-bold uppercase text-primary-50 transition-colors duration-300 lg:flex"
        >
          Dashboard
        </Link>

        {/* Close button */}
        <div className="lg:hidden h-[10vh] w-1/3 fixed top-0 right-0 z-50 flex justify-start items-center">
          <button onClick={toggleSidebar} className="p-2">
            <AiOutlineClose
              size={24}
              className="text-primary-100"
            ></AiOutlineClose>
          </button>
        </div>
      </div>

      {/* Sidebar navigation */}
      <div className="h-[93vh] lg:h-[90vh] overflow-hidden">
        {/* Home, Profile, Settings, Logout */}
        <div className="flex h-14 w-full items-center justify-center gap-2 border-b border-border-color px-3">
          {/* Home Navigation */}
          <Link
            to="/"
            className="btn-icon hover:bg-primary-50 dark:hover:bg-primary-950"
          >
            <GoHome size={18} />
          </Link>

          {/* Mobile & Tablet Devices */}
          <NavLink
            to={
              isAdmin
                ? "/dashboard/admin/profile"
                : isSeller
                  ? "/dashboard/seller/profile"
                  : "/"
            }
            className={({ isActive }) =>
              "btn-icon lg:hidden" +
              (isActive
                ? " border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                : "")
            }
          >
            <FaRegCircleUser size={18} />
          </NavLink>

          <NavLink
            to={
              isAdmin
                ? "/dashboard/admin/settings"
                : isSeller
                  ? "/dashboard/seller/settings"
                  : "/"
            }
            onClick={toggleSidebar}
            className={({ isActive }) =>
              "btn-icon lg:hidden" +
              (isActive
                ? " border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                : "")
            }
          >
            <IoSettingsOutline size={18} />
          </NavLink>

          {/* Desktop Devices */}
          <NavLink
            to={
              isAdmin
                ? "/dashboard/seller/settings"
                : isSeller
                  ? "/dashboard/seller/profile"
                  : "/"
            }
            className={({ isActive }) =>
              "btn-icon hidden lg:flex" +
              (isActive
                ? " border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                : "")
            }
          >
            <FaRegCircleUser size={18} />
          </NavLink>

          <NavLink
            to={
              isAdmin
                ? "/dashboard/admin/settings"
                : isSeller
                  ? "/dashboard/seller/settings"
                  : "/"
            }
            className={({ isActive }) =>
              "btn-icon hidden lg:flex" +
              (isActive
                ? " border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                : "")
            }
          >
            <IoSettingsOutline size={18} />
          </NavLink>

          {/* Logout Button */}
          <button
            onClick={loggedOut}
            className="btn-icon border-red-200 bg-red-50 text-danger hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/30 dark:hover:bg-red-950/60"
          >
            <RiLogoutCircleLine size={18} />
          </button>
        </div>

        {/* Mobile & Tablet Devices, Admin Links & User Links */}
        <ul className="w-full h-[calc(93vh-3.5rem)] overflow-y-auto lg:hidden">
          {links.map(({ to, icon: Icon, label }) => (
            <li key={to} onClick={toggleSidebar}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  "flex h-11 items-center justify-start gap-3 border-b border-border-color px-4 text-sm font-medium text-text-secondary transition-colors duration-200" +
                  (isActive
                    ? " border-l-2 border-l-primary-600 bg-primary-50 font-semibold text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                    : "hover:bg-page-bg hover:text-text-primary")
                }
              >
                <Icon size={18} className="shrink-0" />{" "}
                <span className="truncate">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Large Screen Devices, Admin Links & User Links */}
        <ul className="w-full h-[calc(90vh-3.5rem)] overflow-y-auto hidden lg:block">
          {links.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  "flex h-11 items-center justify-start gap-3 border-b border-border-color px-4 text-sm font-medium text-text-secondary transition-colors duration-200" +
                  (isActive
                    ? " border-l-2 border-l-primary-600 bg-primary-50 font-semibold text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                    : "hover:bg-page-bg hover:text-text-primary")
                }
              >
                <Icon size={18} className="shrink-0" />{" "}
                <span className="truncate">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logged User Info */}
        <div></div>
      </div>
    </div>
  );
};

export default DashSidebar;
