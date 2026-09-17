import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BadgeCheck, Clock, XCircle, ImageOff } from "lucide-react";

export default function SellerVerification() {
  const [sellers, setSellers] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/sellers/verification/requests?status=${filter}`
      );
      setSellers(data.sellers || []);
    } catch (err) {
      console.error("Failed to fetch verification requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, [filter]);

  const handleAction = async (id, action) => {
    let reason = "";
    if (action === "reject") {
      const { value } = await Swal.fire({
        title: "Reject Reason",
        input: "text",
        inputPlaceholder: "e.g. NID image not clear",
        showCancelButton: true,
      });
      if (value === undefined) return; // cancelled
      reason = value;
    } else {
      const confirm = await Swal.fire({
        title: "Approve this seller?",
        text: "সব product এ verified badge বসে যাবে।",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Approve",
      });
      if (!confirm.isConfirmed) return;
    }

    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/sellers/${id}/verification`,
        { action, reason }
      );
      if (data.success) {
        Swal.fire({ icon: "success", title: `Seller ${action}d`, timer: 2000, showConfirmButton: false });
        fetchRequests();
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.message || "Something went wrong" });
    }
  };

  const tabs = ["Pending", "Approved", "Rejected"];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-black text-slate-900 mb-6">Seller Verification Requests</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === t ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : sellers.length === 0 ? (
        <p className="text-slate-400">No {filter.toLowerCase()} requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sellers.map((s) => (
            <div key={s._id} className="bg-white rounded-2xl shadow p-5 border border-slate-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-900">{s.shopName}</h3>
                  <p className="text-xs text-slate-400">{s.sellerId} · {s.mobileNumber}</p>
                  <p className="text-xs text-slate-400">{s.email} · {s.city}</p>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1 ${
                    s.verificationStatus === "Approved"
                      ? "bg-emerald-50 text-emerald-600"
                      : s.verificationStatus === "Rejected"
                      ? "bg-rose-50 text-rose-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {s.verificationStatus === "Approved" && <BadgeCheck size={12} />}
                  {s.verificationStatus === "Pending" && <Clock size={12} />}
                  {s.verificationStatus === "Rejected" && <XCircle size={12} />}
                  {s.verificationStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-slate-500">
                <p><b>NID:</b> {s.nidNumber}</p>
                <p><b>Trade License:</b> {s.tradeLicenseNumber || "N/A"}</p>
                <p><b>TIN:</b> {s.tinNumber || "N/A"}</p>
              </div>

              {/* Documents */}
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {[s.nidFrontImg, s.nidBackImg, s.tradeLicenseImg, s.tinCertificateImg]
                  .filter(Boolean)
                  .map((img, i) => (
                    <img key={i} src={img} alt="doc" className="w-16 h-16 object-cover rounded-lg border" />
                  ))}
                {[s.nidFrontImg, s.nidBackImg, s.tradeLicenseImg, s.tinCertificateImg].filter(Boolean).length === 0 && (
                  <div className="w-16 h-16 flex items-center justify-center rounded-lg border text-slate-300">
                    <ImageOff size={20} />
                  </div>
                )}
              </div>

              {s.verificationStatus === "Rejected" && s.verificationRejectReason && (
                <p className="text-xs text-rose-500 mb-3"><b>Reason:</b> {s.verificationRejectReason}</p>
              )}

              {s.verificationStatus === "Pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(s._id, "approve")}
                    className="flex-1 bg-emerald-600 text-white text-sm font-bold py-2 rounded-xl hover:bg-emerald-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(s._id, "reject")}
                    className="flex-1 bg-rose-500 text-white text-sm font-bold py-2 rounded-xl hover:bg-rose-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}