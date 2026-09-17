import { useEffect, useState } from "react";
import axios from "axios";

const STATUS_TABS = ["all", "pending", "approved", "rejected"];

export default function AdminSellerWithdraw() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("pending");
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const url =
        tab === "all"
          ? "https://dailyshopping-backend.onrender.com/api/wallet/admin/seller-withdraw-requests"
          : `https://dailyshopping-backend.onrender.com/api/wallet/admin/seller-withdraw-requests?status=${tab}`;
      const { data } = await axios.get(url);
      setRequests(data?.requests || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load withdraw requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleApprove = async (id) => {
    if (!window.confirm("এই withdraw request approve করবেন? Seller এর wallet থেকে টাকা কেটে নেওয়া হবে।"))
      return;
    setProcessingId(id);
    try {
      await axios.post(`https://dailyshopping-backend.onrender.com/api/wallet/admin/seller-withdraw-approve/${id}`, {
        adminName: "Admin",
      });
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reject করার কারণ লিখুন (optional):", "");
    if (reason === null) return; // cancelled
    setProcessingId(id);
    try {
      await axios.post(`https://dailyshopping-backend.onrender.com/api/wallet/admin/seller-withdraw-reject/${id}`, {
        adminName: "Admin",
        reason,
      });
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject");
    } finally {
      setProcessingId(null);
    }
  };

  const statusPill = (status) => {
    const cls =
      status === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : status === "approved"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>{status}</span>;
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-1">Seller Withdraw Requests</h1>
      <p className="text-sm text-gray-500 mb-4">
      Review sellers withdraw requests. Approving one will deduct the money from that seller wallet balance.
      </p>

      <div className="flex gap-2 mb-4">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize border ${
              tab === t
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No withdraw requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 bg-white">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="px-4 py-2 border">Shop</th>
                <th className="px-4 py-2 border">Seller ID</th>
                <th className="px-4 py-2 border">Mobile</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Method</th>
                <th className="px-4 py-2 border">Payment Number</th>
                <th className="px-4 py-2 border">Wallet (at request)</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 text-sm">
                  <td className="px-4 py-2 border font-medium">{r.shopName}</td>
                  <td className="px-4 py-2 border">{r.sellerId}</td>
                  <td className="px-4 py-2 border">{r.mobileNumber}</td>
                  <td className="px-4 py-2 border font-semibold">৳{Number(r.amount).toFixed(2)}</td>
                  <td className="px-4 py-2 border">{r.method}</td>
                  <td className="px-4 py-2 border">{r.paymentNumber}</td>
                  <td className="px-4 py-2 border text-emerald-700">
                    ৳{Number(r.walletBalanceAtRequest || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border">{statusPill(r.status)}</td>
                  <td className="px-4 py-2 border text-xs text-gray-500">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {r.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          disabled={processingId === r._id}
                          onClick={() => handleApprove(r._id)}
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          disabled={processingId === r._id}
                          onClick={() => handleReject(r._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs">
                        {r.adminActionBy ? `by ${r.adminActionBy}` : "-"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}