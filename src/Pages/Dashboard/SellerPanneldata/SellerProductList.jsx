import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Store, Package, ChevronRight, Search } from "lucide-react";

const API_BASE = "http://localhost:5000/api";

export default function SellerProductsList() {
  const [sellers, setSellers] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sellersRes, countsRes] = await Promise.all([
        axios.get(`${API_BASE}/sellers`),
        axios.get(`${API_BASE}/products/seller-counts`),
      ]);
      setSellers(sellersRes.data || []);
      setCounts(countsRes.data?.counts || {});
    } catch (err) {
      console.error("Failed to load sellers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSellers = sellers.filter((s) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      s.shopName?.toLowerCase().includes(q) ||
      s.sellerId?.toLowerCase().includes(q) ||
      s.mobileNumber?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
            Inventory
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            Seller Product Upload List
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            একটা seller select করলে তার সব upload করা product দেখতে পারবে
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shop, seller ID, phone..."
            className="w-full border border-slate-200 rounded-2xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm">Loading sellers...</p>
      ) : filteredSellers.length === 0 ? (
        <p className="text-slate-400 text-sm">No sellers found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSellers.map((s) => (
            <Link
              key={s._id}
              to={`/dashboard-admin-dailyshopping/dashboard/sellerproducts/${s.sellerId}`}
              state={{ shopName: s.shopName, sellerId: s.sellerId }}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Store size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 truncate">{s.shopName}</h3>
                <p className="text-xs text-slate-400 truncate">
                  {s.sellerId} · {s.mobileNumber}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 w-fit px-2.5 py-1 rounded-full">
                  <Package size={12} />
                  {counts[s.sellerId] || 0} products
                </div>
              </div>

              <ChevronRight
                size={18}
                className="text-slate-300 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all shrink-0"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
