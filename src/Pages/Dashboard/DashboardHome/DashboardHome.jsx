import { useState } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import Modal from "react-modal";
import useAuth from "../../Hooks/useAuth";
import UserOverView from "../UserDashboard/UserOverView/UserOverView";
import AdminOverview from "../AdminDashboard/AdminOverview/AdminOverview";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "16px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 20px 60px -12px rgba(15,23,42,0.25)",
  },
  overlay: {
    backgroundColor: "rgba(15,23,42,0.45)",
    backdropFilter: "blur(2px)",
    zIndex: 60,
  },
};

const DashboardHome = () => {
  const [loader, setLoader] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  const { user } = useAuth();
  const role = user?.newpartroles;
  const username = user?.displayName || "User";

  const isPasswordValid = (password) => {
    if (password.length < 8) return false;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLetter && hasNumber;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoader(true);
    const newPass = e.target.newPassword.value;
    if (!isPasswordValid(newPass)) {
      toast.error("Password not valid!");
      setLoader(false);
      return;
    }
    toast.success("Password changed successfully!");
    setLoader(false);
  };

  const closeModal = () => setIsOpen(false);

  const roleBadge = (label, tone) => (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${tone}`}>
      {label}
    </span>
  );

  // ROLE-BASED VIEW
  const renderDashboardByRole = () => {
    switch (role) {
      case "SUPERadmin":
        return (
          <div className="w-full">
            <AdminOverview />
          </div>
        );

      case "Moderator":
        return (
          <div className="w-full rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-2">{roleBadge("Moderator", "bg-emerald-50 text-emerald-700")}</div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Moderator dashboard</h2>
            <p className="text-slate-500 text-sm">
              Review and approve user orders or content.
            </p>
          </div>
        );

      case "Support":
        return (
          <div className="w-full rounded-3xl border border-amber-100 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-2">{roleBadge("Support", "bg-amber-50 text-amber-700")}</div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Support dashboard</h2>
            <p className="text-slate-500 text-sm">
              Assist users and resolve their issues.
            </p>
          </div>
        );

      default:
        return (
          <div className="w-full">
            <UserOverView />
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">

      {role !== "SUPERadmin" && (
        <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-3xl border border-slate-100 bg-white px-6 py-5 shadow-sm md:flex-row md:items-center md:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-1">
              Overview
            </p>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">
              Welcome, <span className="text-orange-500">{username}</span>
            </h1>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-2.5 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Role</p>
            <p className="text-sm font-bold text-orange-600">{role || "user"}</p>
          </div>
        </div>
      )}

      {/* ROLE VIEW */}
      <div className="w-full">{renderDashboardByRole()}</div>

      {/* Password Modal */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
        <form onSubmit={handleChangePassword} className="p-8 w-[320px]">
          <h3 className="text-lg font-extrabold text-slate-900 mb-4">Change password</h3>
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
            type="password"
            placeholder="Enter new password"
            required
            name="newPassword"
          />
          <p className="text-xs my-3 text-rose-500 font-medium">
            * Must be at least 8 characters and include both letters and numbers
          </p>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-transform active:scale-95"
            >
              {loader ? <FaSpinner className="animate-spin" /> : "Change Password"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardHome;