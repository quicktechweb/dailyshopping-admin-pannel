import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaStore, FaSearch } from "react-icons/fa";

export default function AdminSellerOrderList() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://dailyshopping-backend.onrender.com/api/orders-seller-list"
      );
      setSellers(data?.sellers || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load seller order list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const filtered = sellers.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.shopName?.toLowerCase().includes(q) ||
      s.sellerId?.toLowerCase().includes(q) ||
      s.mobileNumber?.toLowerCase().includes(q)
    );
  });

  const goToSeller = (sellerId) => {
    navigate(
      `/dashboard-admin-dailyshopping/dashboard/sellerorders/${sellerId}`
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-1 flex items-center gap-2">
        <FaStore className="text-emerald-600" /> Seller Orders
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        Sellers who have received at least one order. Click a seller to view
        their order list.
      </p>

      <div className="relative mb-4 max-w-sm">
        <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by shop name, seller ID or mobile..."
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No sellers with orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 bg-white">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="px-4 py-2 border">Shop Name</th>
                <th className="px-4 py-2 border">Seller ID</th>
                <th className="px-4 py-2 border">Mobile</th>
                <th className="px-4 py-2 border">Total Orders</th>
                <th className="px-4 py-2 border">Total Products</th>
                <th className="px-4 py-2 border">Total Revenue</th>
                <th className="px-4 py-2 border">Last Order</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.sellerId}
                  className="hover:bg-gray-50 text-sm cursor-pointer"
                  onClick={() => goToSeller(s.sellerId)}
                >
                  <td className="px-4 py-2 border font-medium">
                    {s.shopName}
                  </td>
                  <td className="px-4 py-2 border">{s.sellerId}</td>
                  <td className="px-4 py-2 border">{s.mobileNumber}</td>
                  <td className="px-4 py-2 border">{s.totalOrders}</td>
                  <td className="px-4 py-2 border">{s.totalProducts}</td>
                  <td className="px-4 py-2 border font-semibold text-emerald-700">
                    ৳{Number(s.totalRevenue || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border text-xs text-gray-500">
                    {s.lastOrderDate
                      ? new Date(s.lastOrderDate).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToSeller(s.sellerId);
                      }}
                      className="px-3 py-1 rounded-md text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      View Orders
                    </button>
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
