import { useState } from "react";
import {
  FaHome, FaUsers, FaChartLine, FaBell, FaTags, FaBoxOpen, FaCog, FaShoppingCart, FaDollarSign,
  FaGift, FaWarehouse, FaClipboardList, FaMedal,
  FaLayerGroup, FaDesktop, FaMobileAlt, FaHeart, FaUserShield, FaFileAlt, FaPenFancy, FaChartPie,
  FaMoneyBillWave, FaPaperPlane, FaSellcast, FaSignOutAlt, FaCertificate, FaStarHalfAlt,
  FaFileInvoiceDollar, FaChartBar, FaTasks, FaClock, FaDatabase, FaInfoCircle, FaPhone, FaEnvelope,
  FaShippingFast, FaQuestionCircle, FaShoppingBag, FaAward, FaBox, FaStore, FaBullhorn, FaRocket,
  FaHandshake, FaTruck, FaClipboard, FaExternalLinkAlt,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../../Hooks/useAuth";
import { ChevronRight } from "lucide-react";

const DashboardSideBar = ({ setIsOpenSidebar }) => {
  const { user, userLogOut } = useAuth();
  const role     = user?.newpartroles;
  const newroles = user?.newpartuser;

  const [openSections, setOpenSections] = useState({});
  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const sidebarItems = [
    {
      key: "Role Management",
      title: "Role Management",
      icon: FaHome,
      roles: ["SUPERadmin"],
      links: [
        { title: "Super Admin", icon: FaDesktop, path: "/dashboard-admin-dailyshopping/dashboard/rolemanagement" },
        { title: "Add Role",    icon: FaDesktop, path: "/dashboard-admin-dailyshopping/dashboard/rolemanager" },
      ],
    },
    {
      key: "LandingPage",
      title: "Landing Page",
      icon: FaChartLine,
      roles: ["SUPERadmin"],
      links: [
        // { title: "CategorySelect",  icon: FaDesktop,   path: "/dashboard-admin-dailyshopping/dashboard/homecategorynavbar" },
        // { title: "Advertisment",    icon: FaDesktop,   path: "/dashboard-admin-dailyshopping/dashboard/homebanneradvertis" },
        { title: "Home-Banner",    icon: FaDesktop,   path: "/dashboard-admin-dailyshopping/dashboard/adminbannerlanding" },
        { title: "Popular Section",    icon: FaMobileAlt, path: "/dashboard-admin-dailyshopping/dashboard/adminpopularsection" },
        // { title: "PopularCategory", icon: FaMedal,     path: "/dashboard-admin-dailyshopping/dashboard/adminpopularcategory" },
        // { title: "Home-Banner3",    icon: FaFileAlt,   path: "/dashboard-admin-dailyshopping/dashboard/adminshowcategory" },
        // { title: "Home-Banner4",    icon: FaGift,      path: "/dashboard-admin-dailyshopping/dashboard/adminproductcarousel" },
        // { title: "Hottest-Brands",  icon: FaPenFancy,  path: "/dashboard-admin-dailyshopping/dashboard/adminbarnd" },
      ],
    },
    {
      key: "Seller Pannel",
      title: "Seller Withdraw",
      icon: FaChartLine,
      roles: ["SUPERadmin"],
      links: [
        { title: "Seller Withdraw",  icon: FaDesktop,   path: "/dashboard-admin-dailyshopping/dashboard/sellerwithdraw-data" },
        { title: "Admin Commsion",  icon: FaDesktop,   path: "/dashboard-admin-dailyshopping/dashboard/admin-commsion" },
        { title: "Delivery Commison",  icon: FaDesktop,   path: "/dashboard-admin-dailyshopping/dashboard/admincommsionreport" },
       
      ],
    },
    {
      key: "Order Management",
      title: "Order Management",
      icon: FaShoppingCart,
      permissionKey: "Order Management",
      links: [
        { title: "Pending Order", icon: FaClipboardList, path: "/dashboard-admin-dailyshopping/dashboard/updateorder" },
        { title: "All Order",     icon: FaLayerGroup,    path: "/dashboard-admin-dailyshopping/dashboard/AllUserorder" },
        { title: "Track Order",   icon: FaLayerGroup,    path: "/dashboard-admin-dailyshopping/dashboard/trackorder" },
        { title: "Fraudcheck",    icon: FaLayerGroup,    path: "/dashboard-admin-dailyshopping/dashboard/fraudcheck" },
        { title: "Return Management",    icon: FaLayerGroup,    path: "/dashboard-admin-dailyshopping/dashboard/adminreturnmanage" },
      ],
    },
  
    {
      key: "CompanySettings",
      title: "Company Settings",
      icon: FaCog,
      permissionKey: "Settings",
      links: [
        { title: "Footer",          icon: FaDatabase,       path: "/dashboard-admin-dailyshopping/dashboard/footerdashboard" },
        { title: "About",           icon: FaInfoCircle,     path: "/dashboard-admin-dailyshopping/dashboard/aboutadmin" },
        { title: "Contact",         icon: FaPhone,          path: "/dashboard-admin-dailyshopping/dashboard/contactadmin" },
        { title: "Terms Condition", icon: FaEnvelope,       path: "/dashboard-admin-dailyshopping/dashboard/admintermcondition" },
        { title: "Shippings",       icon: FaShippingFast,   path: "/dashboard-admin-dailyshopping/dashboard/adminshippingpolicys" },
        { title: "Faq",             icon: FaQuestionCircle, path: "/dashboard-admin-dailyshopping/dashboard/faqadmin" },
        { title: "Refferal",             icon: FaQuestionCircle, path: "/dashboard-admin-dailyshopping/dashboard/refferalsystem" },
      ],
    },
    {
      key: "Sellerverification",
      title: "Sellerverification",
      icon: FaCog,
      permissionKey: "Sellerverification",
      links: [
        { title: "Sellerverification",          icon: FaDatabase,       path: "/dashboard-admin-dailyshopping/dashboard/sellervarificationRequest" },
        { title: "Seller ListProduct",          icon: FaDatabase,       path: "/dashboard-admin-dailyshopping/dashboard/selllistproduct" },
        { title: "Seller OrderList",          icon: FaDatabase,       path: "/dashboard-admin-dailyshopping/dashboard/adminsellerorderlist" },
      
      ],
    },
    {
      key: "Reports",
      title: "Reports",
      icon: FaUsers,
      permissionKey: "Reports",
      links: [
        { title: "All User",       icon: FaClipboardList,     path: "/dashboard-admin-dailyshopping/dashboard/useralldata" },
        { title: "Top-Sell-view",  icon: FaStarHalfAlt,       path: "/dashboard-admin-dailyshopping/dashboard/topsellproductview" },
        { title: "View Expense",   icon: FaClock,             path: "/dashboard-admin-dailyshopping/dashboard/expensemanager" },
        { title: "All Stock",      icon: FaWarehouse,         path: "/dashboard-admin-dailyshopping/dashboard/allstockmanagement" },
        { title: "View Supplier",  icon: FaTruck,             path: "/dashboard-admin-dailyshopping/dashboard/supplier" },
        { title: "Purchase List",  icon: FaClipboardList,     path: "/dashboard-admin-dailyshopping/dashboard/purchaselist" },
        { title: "Withdraw",       icon: FaDesktop,           path: "/dashboard-admin-dailyshopping/dashboard/adminalldatawithdraw" },
        { title: "RefferalList",   icon: FaDesktop,           path: "/dashboard-admin-dailyshopping/dashboard/adminrefferallist" },
        { title: "All Revenue",    icon: FaFileInvoiceDollar, path: "/dashboard-admin-dailyshopping/dashboard/allrevenue" },
        { title: "All WinnerData", icon: FaFileInvoiceDollar, path: "/dashboard-admin-dailyshopping/dashboard/adminwinnerdata" },
      ],
    },
    {
      key: "MyOrder",
      title: "My Order",
      roles: ["user"],
      icon: FaClipboardList,
      permissionKey: "MyOrder",
      links: [
        { title: "My Order",     icon: FaShoppingBag,   path: "/dashboard/myorder" },
        { title: "Track Orders", icon: FaMoneyBillWave, path: "/dashboard/trackorders" },
      ],
    },
    {
      key: "WishList",
      title: "Wish List",
      roles: ["user"],
      icon: FaHeart,
      permissionKey: "WishList",
      links: [{ title: "Show", icon: FaAward, path: "/dashboard/userwhitelist" }],
    },
    {
      key: "Inventory Management",
      title: "Inventory Management",
      icon: FaBoxOpen,
      permissionKey: "Inventory",
      links: [
        { title: "Add Brand",          icon: FaBullhorn,   path: "/dashboard-admin-dailyshopping/dashboard/addbrand" },
        { title: "All Upload Product", icon: FaRocket,     path: "/dashboard-admin-dailyshopping/dashboard/alluploadproduct" },
        { title: "Show All Product",   icon: FaRocket,     path: "/dashboard-admin-dailyshopping/dashboard/showallproduct" },
        { title: "Seller Pending Product",   icon: FaRocket,     path: "/dashboard-admin-dailyshopping/dashboard/sellerpendigproduct" },
        { title: "Stock Warning",      icon: FaAward,      path: "/dashboard-admin-dailyshopping/dashboard/lowstock" },
        { title: "Stock Out",          icon: FaCertificate,path: "/dashboard-admin-dailyshopping/dashboard/stockout" },
        { title: "Add Expense",        icon: FaTasks,      path: "/dashboard-admin-dailyshopping/dashboard/manageexpense" },
        { title: "Add category",       icon: FaBox,        path: "/dashboard-admin-dailyshopping/dashboard/addcategory" },
        { title: "Sub Category",       icon: FaBoxOpen,    path: "/dashboard-admin-dailyshopping/dashboard/subcategory" },
        { title: "Child Category",     icon: FaStore,      path: "/dashboard-admin-dailyshopping/dashboard/childcategory" },
        { title: "Add Supplier",       icon: FaHandshake,  path: "/dashboard-admin-dailyshopping/dashboard/addsupplier" },
        { title: "Add Campain",        icon: FaHandshake,  path: "/dashboard-admin-dailyshopping/dashboard/campain" },
        { title: "Purchase Entry",     icon: FaHandshake,  path: "/dashboard-admin-dailyshopping/dashboard/purchaseentry" },
        { title: "Category Discount",  icon: FaHandshake,  path: "/dashboard-admin-dailyshopping/dashboard/categorydiscount" },
        { title: "AdminBedge",         icon: FaHandshake,  path: "/dashboard-admin-dailyshopping/dashboard/adminbadge" },
        { title: "Promocode",          icon: FaHandshake,  path: "/dashboard-admin-dailyshopping/dashboard/promocode" },
      ],
    },
    {
      key: "profile",
      title: "Profile",
      roles: ["user"],
      icon: FaUserShield,
      permissionKey: "profile",
      links: [{ title: "My Profile", icon: FaChartPie, path: "/dashboard/myprofile" }],
    },
    {
      key: "UserOverview",
      title: "User Overview",
      roles: ["user"],
      icon: FaChartPie,
      permissionKey: "UserOverview",
      links: [{ title: "Overview", icon: FaChartLine, path: "/dashboard/useroverview" }],
    },
    {
      key: "Notification",
      title: "Notification",
      icon: FaBell,
      permissionKey: "navber",
      links: [
        { title: "Send",       icon: FaBullhorn, path: "/dashboard-admin-dailyshopping/dashboard/sendnotifications" },
        { title: "BulkSms",    icon: FaBullhorn, path: "/dashboard-admin-dailyshopping/dashboard/bulksms" },
        { title: "BulkEmail",  icon: FaBullhorn, path: "/dashboard-admin-dailyshopping/dashboard/bulkemail" },
      ],
    },
    {
      key: "SocialMedia",
      title: "Social Media",
      icon: FaPaperPlane,
      permissionKey: "Pixel",
      links: [
        { title: "Facebook",   icon: FaRocket, path: "/dashboard-admin-dailyshopping/dashboard/pixel" },
        { title: "Google Tag", icon: FaRocket, path: "/dashboard-admin-dailyshopping/dashboard/googletag" },
      ],
    },
  ];

  const canSee = (item) => {
    if (!user || !user.newpartroles) return false;

    const roles = Array.isArray(user.newpartroles) ? user.newpartroles : [user.newpartroles];
    const permissions = user.permissions || {};

    if (roles.includes("SUPERadmin")) {
      if (item.roles?.includes("user")) return false;
      return true;
    }

    const isUserRole = roles.includes("user");
    if (isUserRole) {
      return item.roles?.includes("user") || false;
    }

    if (!item.permissionKey) return true;
    if (permissions[item.permissionKey]?.enabled) return true;

    return false;
  };

  const accountName = user?.displayName || user?.name || user?.email?.split("@")[0] || "Admin";
  const accountRole = role || newroles || "Member";
  const initial     = accountName.charAt(0).toUpperCase();

  return (
    <div className="h-full w-full bg-white p-2.5 md:p-3">
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_-8px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/70">

        {/* ── Brand mark ── */}
        <div className="relative px-4 pt-5 pb-4">
          <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-orange-100 via-amber-50 to-transparent blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 text-[15px] font-bold text-white shadow-lg shadow-orange-500/30">
              D
            </div>
            <div className="hidden md:block">
              <p className="text-[14.5px] font-extrabold leading-tight tracking-tight text-slate-900">
                DailyShopping
              </p>
              <p className="text-[10.5px] mt-1 font-semibold uppercase tracking-[0.14em] text-slate-400">
                Control Center
              </p>
            </div>
          </div>
        </div>

        {/* ── Visit Site button ── */}
        <div className="px-4 pb-3">
          <NavLink onClick={() => setIsOpenSidebar(false)} to={"https://dailyshopping.com.bd/"}>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-slate-500 shadow-sm transition-all duration-200 hover:border-orange-200 hover:bg-orange-50/60 hover:text-orange-600 active:scale-95">
              <FaExternalLinkAlt className="text-[10px]" />
              <span className="hidden text-[12px] font-bold md:block">Visit Site</span>
            </div>
          </NavLink>
        </div>

        {/* ── Scrollable nav ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-track]:bg-transparent">

          {/* Home */}
          <NavLink
            to="/dashboard-admin-dailyshopping/dashboard"
            onClick={() => setIsOpenSidebar(false)}
          >
            {({ isActive }) => (
              <div
                className={[
                  "mb-3 flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[13.5px] font-bold transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
                    : "text-slate-500 hover:bg-slate-50",
                ].join(" ")}
              >
                <FaSellcast className={`text-[15px] ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="hidden md:block">Home</span>
              </div>
            )}
          </NavLink>

          <p className="hidden px-3.5 pb-2 pt-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate-300 md:block">
            Workspace
          </p>

          {/* Dynamic items */}
          <div className="flex flex-col gap-1">
            {sidebarItems.map((item) => {
              if (!canSee(item)) return null;
              const isOpen = !!openSections[item.key];
              return (
                <div key={item.key}>
                  <button
                    type="button"
                    onClick={() => toggleSection(item.key)}
                    className={[
                      "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20",
                      isOpen
                        ? "bg-gradient-to-r from-orange-50/80 to-amber-50/50"
                        : "hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={[
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                          isOpen
                            ? "bg-white text-orange-600 shadow-sm"
                            : "bg-slate-50 text-slate-400",
                        ].join(" ")}
                      >
                        <item.icon className="text-[13px]" />
                      </span>
                      <span
                        className={[
                          "hidden truncate text-[13.5px] font-bold md:block",
                          isOpen ? "text-orange-700" : "text-slate-600",
                        ].join(" ")}
                      >
                        {item.title}
                      </span>
                    </span>
                    <ChevronRight
                      size={14}
                      className={`hidden shrink-0 transition-transform duration-300 md:block ${
                        isOpen ? "rotate-90 text-orange-500" : "text-slate-300"
                      }`}
                    />
                  </button>

                  {/* Sub-links */}
                  <div
                    className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="relative ml-[19px] mt-1 flex flex-col gap-0.5 border-l-2 border-orange-100 py-1 pl-3.5">
                        {item.links.map((link) => (
                          <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpenSidebar(false)}
                          >
                            {({ isActive }) => (
                              <div
                                className={[
                                  "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-all duration-200",
                                  isActive
                                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/30"
                                    : "text-slate-500 hover:translate-x-0.5 hover:bg-slate-50 hover:text-slate-800",
                                ].join(" ")}
                              >
                                {link.icon && (
                                  <link.icon
                                    className={`text-[13px] ${isActive ? "text-white" : "text-slate-400"}`}
                                  />
                                )}
                                <span className="hidden truncate text-[13px] md:block">
                                  {link.title}
                                </span>
                              </div>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* ── Footer: account + logout ── */}
        <div className="border-t border-slate-100 p-3">
          <div className="mb-2 hidden items-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50/60 px-3 py-2.5 md:flex">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-[12px] font-bold text-white shadow-sm">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-bold text-slate-900">{accountName}</p>
              <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-orange-400">
                {accountRole}
              </p>
            </div>
          </div>

          <button
            onClick={async () => {
              try {
                await userLogOut();
                window.location.href = "/";
              } catch (error) {
                console.error("Logout failed:", error);
              }
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12.5px] font-bold text-slate-500 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 active:scale-[0.98]"
          >
            <FaSignOutAlt className="text-[13px]" />
            <span className="hidden md:block">Log Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};

DashboardSideBar.propTypes = {
  setIsOpenSidebar: PropTypes.func.isRequired,
};

export default DashboardSideBar;