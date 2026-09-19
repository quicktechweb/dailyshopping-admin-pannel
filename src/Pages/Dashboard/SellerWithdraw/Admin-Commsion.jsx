import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminSellerCommission() {
  const [totals, setTotals] = useState({ totalAdminEarning: 0, totalSellerPayout: 0 });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [earningsRes, detailsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/wallet/admin/earnings"),
        axios.get("http://localhost:5000/api/wallet/admin/commission-details"),
      ]);

      setTotals({
        totalAdminEarning: earningsRes.data?.totalAdminEarning || 0,
        totalSellerPayout: earningsRes.data?.totalSellerPayout || 0,
      });
      setRows(detailsRes.data?.rows || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load commission data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRows = rows.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.shopName?.toLowerCase().includes(q) ||
      r.sellerId?.toLowerCase().includes(q) ||
      r.title?.toLowerCase().includes(q) ||
      String(r.paymentId || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const grandTotal = totals.totalAdminEarning + totals.totalSellerPayout;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-1">Commission Overview</h1>
      <p className="text-sm text-gray-500 mb-6">
      A detailed breakdown of how much commission the admin earned and how much the seller earned from each delivered order
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white shadow">
          <p className="text-[11px] uppercase tracking-widest text-emerald-200 font-semibold">
            Total Admin Commission
          </p>
          <h2 className="text-2xl font-extrabold mt-1">৳{totals.totalAdminEarning.toFixed(2)}</h2>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow">
          <p className="text-[11px] uppercase tracking-widest text-slate-300 font-semibold">
            Total Seller Payout
          </p>
          <h2 className="text-2xl font-extrabold mt-1">৳{totals.totalSellerPayout.toFixed(2)}</h2>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow">
          <p className="text-[11px] uppercase tracking-widest text-orange-100 font-semibold">
            Total Delivered Sales (Settled)
          </p>
          <h2 className="text-2xl font-extrabold mt-1">৳{grandTotal.toFixed(2)}</h2>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold">Order-wise Commission Details</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by shop, seller ID, product, order..."
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-72 max-w-full"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : filteredRows.length === 0 ? (
        <p className="text-gray-500">No commission data found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200 bg-white">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="px-4 py-2 border">Order</th>
                  <th className="px-4 py-2 border">Product</th>
                  <th className="px-4 py-2 border">Shop</th>
                  <th className="px-4 py-2 border">Seller ID</th>
                  <th className="px-4 py-2 border">Qty</th>
                  <th className="px-4 py-2 border">Price</th>
                  <th className="px-4 py-2 border">Commission %</th>
                  <th className="px-4 py-2 border">Admin Earning</th>
                  <th className="px-4 py-2 border">Seller Earning</th>
                  <th className="px-4 py-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((r, idx) => (
                  <tr key={`${r.orderId}-${idx}`} className="hover:bg-gray-50 text-sm">
                    <td className="px-4 py-2 border">#{r.paymentId || r.orderId}</td>
                    <td className="px-4 py-2 border">{r.title}</td>
                    <td className="px-4 py-2 border">{r.shopName}</td>
                    <td className="px-4 py-2 border">{r.sellerId}</td>
                    <td className="px-4 py-2 border text-center">{r.quantity}</td>
                    <td className="px-4 py-2 border">৳{Number(r.productPrice || 0).toFixed(2)}</td>
                    <td className="px-4 py-2 border text-center">{r.commissionPercent || 0}%</td>
                    <td className="px-4 py-2 border font-semibold text-emerald-700">
                      ৳{Number(r.adminEarning || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border font-semibold text-slate-700">
                      ৳{Number(r.sellerEarning || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-3 justify-center mt-5">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            <span className="font-semibold text-sm">
              Page {currentPage} / {totalPages}
            </span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}