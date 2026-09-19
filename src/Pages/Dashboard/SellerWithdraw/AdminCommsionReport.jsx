import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

const API_URL = "http://localhost:5000/api/admin-commission";
const PAGE_SIZE = 25;

const money = (n) =>
  `৳${Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const emptySummary = {
  totalOrders: 0,
  totalSales: 0,
  adminCommission: 0,
  referralDeduction: 0,
  netAdminEarning: 0,
  sellerPayout: 0,
};

function SummaryCard({ label, value, note, className }) {
  return (
    <div className={`p-5 rounded-2xl text-white shadow min-w-0 ${className}`}>
      <p className="text-[11px] uppercase tracking-widest font-semibold opacity-80">{label}</p>
      <h2 className="text-2xl font-extrabold mt-1 break-words">{value}</h2>
      {note && <p className="text-xs mt-1 opacity-80">{note}</p>}
    </div>
  );
}

export default function AdminCommissionReport() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(emptySummary);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalRows: 0 });

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  // Search: taipa thamle 0.4s por request jabe
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Data load
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(API_URL, {
          params: { page, limit: PAGE_SIZE, search },
          signal: controller.signal,
        });

        if (!res.data?.success) {
          throw new Error(res.data?.message || "Failed to load commission data");
        }

        setRows(res.data.rows || []);
        setSummary(res.data.summary || emptySummary);
        setPagination(res.data.pagination || { page: 1, totalPages: 1, totalRows: 0 });
        setExpanded(null);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Commission report error:", err);
        setError(err.response?.data?.message || err.message || "Failed to load commission data");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [page, search]);

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl font-semibold mb-1">Commission Overview</h1>
      <p className="text-sm text-gray-500 mb-6">
        Every delivered order — how much commission the admin earned, the referral discount given,
        and what the seller earned.
      </p>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <SummaryCard
          label="Delivered Sales"
          value={money(summary.totalSales)}
          note={`${summary.totalOrders} delivered orders`}
          className="bg-gradient-to-br from-orange-500 to-orange-700"
        />
        <SummaryCard
          label="Admin Commission"
          value={money(summary.adminCommission)}
          note="Before referral discount"
          className="bg-gradient-to-br from-emerald-600 to-emerald-800"
        />
        <SummaryCard
          label="Referral Discount"
          value={`−${money(summary.referralDeduction)}`}
          note="Paid by admin"
          className="bg-gradient-to-br from-rose-500 to-rose-700"
        />
        <SummaryCard
          label="Net Admin Earning"
          value={money(summary.netAdminEarning)}
          note="Commission − Referral"
          className="bg-gradient-to-br from-emerald-700 to-emerald-900"
        />
        <SummaryCard
          label="Seller Payout"
          value={money(summary.sellerPayout)}
          className="bg-gradient-to-br from-slate-700 to-slate-900"
        />
      </div>

      {/* Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold">Order-wise Details</h2>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search order, product, shop, seller ID..."
            className="border border-gray-300 rounded-lg pl-9 pr-3 py-1.5 text-sm w-80 max-w-full"
          />
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-2">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 py-6">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="text-gray-500 py-6">No delivered orders found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Products</th>
                  <th className="px-4 py-3 font-semibold">Shop</th>
                  <th className="px-4 py-3 font-semibold text-right">Sales</th>
                  <th className="px-4 py-3 font-semibold text-right">Commission</th>
                  <th className="px-4 py-3 font-semibold text-right">Referral</th>
                  <th className="px-4 py-3 font-semibold text-right">Net Admin</th>
                  <th className="px-4 py-3 font-semibold text-right">Seller</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((o) => {
                  const isOpen = expanded === o._id;
                  const first = o.products?.[0] || {};
                  const extra = (o.products?.length || 0) - 1;
                  const shops = [...new Set((o.products || []).map((p) => p.shopName).filter(Boolean))];

                  return (
                    <Fragment key={o._id}>
                      <tr className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setExpanded(isOpen ? null : o._id)}
                            className="flex items-center gap-1 font-semibold text-slate-800"
                          >
                            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}#
                            {o.paymentId || String(o._id).slice(-6)}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 max-w-[220px] truncate">
                          {first.title}
                          {extra > 0 && <span className="text-gray-400"> +{extra} more</span>}
                        </td>
                        <td className="px-4 py-3">{shops.join(", ") || "—"}</td>
                        <td className="px-4 py-3 text-right">{money(o.totalSales)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-emerald-700">
                          {money(o.adminCommission)}
                          {o.products?.length === 1 && (
                            <span className="block text-xs font-normal text-gray-400">
                              {first.commissionPercent}%
                            </span>
                          )}
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-semibold ${
                            o.referralDeduction > 0 ? "text-red-600" : "text-gray-400"
                          }`}
                        >
                          {o.referralDeduction > 0 ? `−${money(o.referralDeduction)}` : money(0)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-800">
                          {money(o.netAdminEarning)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-700">
                          {money(o.sellerEarning)}
                        </td>
                      </tr>

                      {/* Product wise details */}
                      {isOpen && (
                        <tr className="bg-gray-50 border-t">
                          <td colSpan={9} className="px-4 py-3">
                            <table className="w-full text-xs">
                              <thead className="text-gray-500 text-left">
                                <tr>
                                  <th className="py-1 pr-3 font-semibold">Product</th>
                                  <th className="py-1 pr-3 font-semibold">Shop</th>
                                  <th className="py-1 pr-3 font-semibold">Seller ID</th>
                                  <th className="py-1 pr-3 font-semibold text-right">Qty</th>
                                  <th className="py-1 pr-3 font-semibold text-right">Price</th>
                                  <th className="py-1 pr-3 font-semibold text-right">Comm. %</th>
                                  <th className="py-1 pr-3 font-semibold text-right">Admin</th>
                                  <th className="py-1 font-semibold text-right">Seller</th>
                                </tr>
                              </thead>
                              <tbody>
                                {o.products.map((p, i) => (
                                  <tr key={i} className="border-t border-gray-200">
                                    <td className="py-1.5 pr-3">{p.title}</td>
                                    <td className="py-1.5 pr-3">{p.shopName || "—"}</td>
                                    <td className="py-1.5 pr-3">{p.sellerId || "—"}</td>
                                    <td className="py-1.5 pr-3 text-right">{p.quantity}</td>
                                    <td className="py-1.5 pr-3 text-right">{money(p.price)}</td>
                                    <td className="py-1.5 pr-3 text-right">{p.commissionPercent}%</td>
                                    <td className="py-1.5 pr-3 text-right text-emerald-700">
                                      {money(p.adminEarning)}
                                    </td>
                                    <td className="py-1.5 text-right">{money(p.sellerEarning)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {o.customerName && (
                              <p className="text-xs text-gray-500 mt-2">Customer: {o.customerName}</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-3 justify-center mt-5">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
            <span className="font-semibold text-sm">
              Page {pagination.page} / {pagination.totalPages}
              <span className="text-gray-400 font-normal"> · {pagination.totalRows} orders</span>
            </span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
