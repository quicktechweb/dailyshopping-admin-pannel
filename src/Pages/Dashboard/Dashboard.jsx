import { useEffect, useState } from "react";
import { FaBars, FaTimes, FaUserCog, FaSignOutAlt, FaBell, FaChevronDown } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import DashboardSideBar from "./DashboardSideBar/DashboardSideBar";
import axios from "axios";
import useAuth from "../Hooks/useAuth";

const Dashboard = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [isOpens, setIsOpens]             = useState(false);
  const [user, setUser]                   = useState(null);
  const [newAvatar, setNewAvatar]         = useState(null);
  const [form, setForm]                   = useState({
    displayName: "", email: "", phoneNumber: "",
    birthday: "", gender: "", address: "",
  });
  const { userLogOut } = useAuth();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    if (!stored?._id) return;
    axios
      .get(`https://dailyshopping-backend.onrender.com/api/auth/me/${stored._id}`)
      .then((res) => {
        const u = res.data.user;
        setUser(u);
        setForm({
          displayName: u.displayName || "",
          email:       u.email       || "",
          phoneNumber: u.phoneNumber || "",
          birthday:    u.birthday    || "",
          gender:      u.gender      || "",
          address:     u.address     || "",
        });
      })
      .catch((err) => console.error("Profile load error:", err));
  }, []);

  const avatarSrc = newAvatar
    ? URL.createObjectURL(newAvatar)
    : user?.avatar
    ? user.avatar
    : "https://e7.pngegg.com/pngimages/348/800/png-clipart-man-wearing-blue-shirt-illustration-computer-icons-avatar-user-login-avatar-blue-child-thumbnail.png";

  return (
    <div className="relative flex min-h-screen flex-row-reverse bg-[#F7F8FA]">

      {/* ── Mobile overlay ── */}
      {isOpenSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpenSidebar(false)}
        />
      )}

      {/* ══════════════ SIDEBAR ══════════════ */}
      <div
        className={`
          fixed left-0 top-0 z-50 h-screen overflow-y-auto bg-white
          border-r border-slate-100
          shadow-[4px_0_24px_-4px_rgba(15,23,42,0.08)]
          transition-all duration-300 ease-in-out
          ${isOpenSidebar ? "w-[72%] sm:w-[52%]" : "w-0 md:w-[20%]"}
        `}
      >
        {/* Mobile close */}
        <div className="flex justify-end p-3 md:hidden">
          <button
            onClick={() => setIsOpenSidebar(false)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100"
          >
            <FaTimes className="text-[13px]" />
          </button>
        </div>

        {/* Logo */}
        <div className="hidden md:flex items-center gap-3 px-5 pb-3 pt-5 border-b border-slate-100">
          <img
            src="https://i.ibb.co.com/CKCp8K3q/Daily-Shopping-Logo-2.png"
            alt="Lucky Shop"
            className="h-10 w-auto object-contain"
          />
          <div>
            <p className="text-[14px] font-bold text-slate-800 leading-tight">DailyShopping</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Admin Panel</p>
          </div>
        </div>

        <DashboardSideBar setIsOpenSidebar={setIsOpenSidebar} />
      </div>

      {/* ══════════════ MAIN AREA ══════════════ */}
      <div
        className={`
          flex flex-col flex-1
          transition-all duration-300 ease-in-out
          md:ml-[20%]
          w-full md:w-[80%]
        `}
      >

        {/* ── TOPBAR ── */}
        <div className="sticky top-0 z-40 px-3 pt-3 print:hidden">
          <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-[0_8px_30px_-10px_rgba(15,23,42,0.10)] ring-1 ring-slate-100 md:px-6 md:py-3.5">

            {/* Left */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpenSidebar(!isOpenSidebar)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-orange-600 hover:bg-orange-50 transition-colors md:hidden"
              >
                {isOpenSidebar
                  ? <FaTimes className="text-[14px]" />
                  : <FaBars  className="text-[14px]" />
                }
              </button>
              <div>
                <p className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:block">
                  Overview
                </p>
                <h2 className="text-[17px] font-extrabold tracking-tight text-slate-900 md:text-[22px]">
                  Dashboard
                </h2>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2.5">

              {/* Notification bell */}
              <button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                <FaBell className="text-[14px]" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>

              {/* Profile dropdown */}
              <div className="relative print:hidden">
                <button
                  onClick={() => setIsOpens(!isOpens)}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm hover:border-orange-300 hover:shadow-orange-50 transition-all duration-200"
                >
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    className="h-8 w-8 rounded-lg object-cover ring-2 ring-slate-100 md:h-9 md:w-9"
                  />
                  <div className="hidden flex-col items-start sm:flex">
                    <span className="max-w-[110px] truncate text-[12.5px] font-semibold leading-tight text-slate-800">
                      {user?.displayName || user?.phoneNumber || "Admin"}
                    </span>
                    <span className="text-[10.5px] font-medium text-slate-400">Administrator</span>
                  </div>
                  <FaChevronDown
                    className={`text-[10px] text-slate-400 transition-transform duration-200 ${isOpens ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown */}
                {isOpens && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl bg-white shadow-[0_16px_40px_-8px_rgba(15,23,42,0.16)] ring-1 ring-slate-200/60">
                    {/* User info header */}
                    <div className="border-b border-slate-100 px-4 py-3.5">
                      <p className="truncate text-[13px] font-semibold text-slate-800">
                        {user?.displayName || "Admin User"}
                      </p>
                      <p className="truncate text-[11.5px] text-slate-400 mt-0.5">
                        {user?.email || user?.phoneNumber || ""}
                      </p>
                    </div>

                    <div className="py-1.5">
                      <Link
                        to="/dashboard/myprofile"
                        onClick={() => setIsOpens(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition-colors"
                      >
                        <FaUserCog className="text-[12px] text-slate-400" />
                        Profile Settings
                      </Link>

                      <div className="mx-3 my-1 h-px bg-slate-100" />

                      <button
                        onClick={async () => {
                          try {
                            await userLogOut();
                            window.location.href = "/";
                          } catch (err) {
                            console.error("Logout failed:", err);
                          }
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <FaSignOutAlt className="text-[12px]" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── PAGE CONTENT ── */}
        <div className="flex-1 px-3 pb-6 pt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;