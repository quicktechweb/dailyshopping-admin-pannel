import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave, FaChevronDown, FaChevronUp } from "react-icons/fa";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
  "failed",
];

const statusPill = (status) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-indigo-100 text-indigo-700",
    shipped: "bg-purple-100 text-purple-700",
    out_for_delivery: "bg-cyan-100 text-cyan-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    returned: "bg-orange-100 text-orange-700",
    refunded: "bg-gray-200 text-gray-700",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
        map[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status?.replace(/_/g, " ")}
    </span>
  );
};

const paymentPill = (payment) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
      payment === "paid"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {payment}
  </span>
);

const money = (v) => `৳${Number(v || 0).toFixed(2)}`;

export default function AdminSellerOrderDetails() {
  const { sellerId } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMap, setStatusMap] = useState({}); // { orderId: selectedStatus }
  const [savingId, setSavingId] = useState(null);
  const [expanded, setExpanded] = useState({}); // { orderId: bool }

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://dailyshopping-backend.onrender.com/api/seller-orders/${sellerId}`
      );
      const list = data?.orders || [];
      setOrders(list);
      const initialMap = {};
      list.forEach((o) => (initialMap[o._id] = o.status));
      setStatusMap(initialMap);
    } catch (err) {
      console.error(err);
      alert("Failed to load seller orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerId]);

  const handleStatusChange = (orderId, value) => {
    setStatusMap((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleSaveStatus = async (orderId) => {
    setSavingId(orderId);
    try {
      await axios.put(`https://dailyshopping-backend.onrender.com/api/orders/${orderId}/status`, {
        status: statusMap[orderId],
      });
      alert("Order status updated");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setSavingId(null);
    }
  };

  const toggleExpand = (orderId) => {
    setExpanded((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const shopName = orders[0]?.shopName || "";

  return (
    <div className="p-6">
      <button
        onClick={() =>
          navigate("/dashboard-admin-dailyshopping/dashboard/sellerorders")
        }
        className="flex items-center gap-2 text-sm text-emerald-700 hover:underline mb-3"
      >
        <FaArrowLeft /> Back to sellers
      </button>

      <h1 className="text-xl font-semibold mb-1">
        {shopName ? `${shopName} — Orders` : "Seller Orders"}
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        Seller ID: <span className="font-medium">{sellerId}</span>
      </p>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found for this seller.</p>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const isOpen = expanded[order._id] ?? true;

            // seller-side totals for THIS order (sum across its product lines)
            const sellerTotalEarning = (order.products || []).reduce(
              (sum, p) => sum + Number(p.sellerEarning || 0),
              0
            );
            const adminTotalCommission = (order.products || []).reduce(
              (sum, p) => sum + Number(p.adminCommission || 0),
              0
            );
            const adminTotalEarning = (order.products || []).reduce(
              (sum, p) => sum + Number(p.adminEarning || 0),
              0
            );

            return (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                {/* ---------- Order header ---------- */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-b">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    <div className="text-sm">
                      <span className="font-semibold">Order ID:</span>{" "}
                      {order.paymentId || order._id}
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="font-semibold">Placed:</span>{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {statusPill(order.status)}
                    {paymentPill(order.orderPayment)}
                    <select
                      value={statusMap[order._id] || order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border border-gray-300 rounded-md text-sm px-2 py-1 capitalize focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="capitalize">
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                    <button
                      disabled={
                        savingId === order._id ||
                        statusMap[order._id] === order.status
                      }
                      onClick={() => handleSaveStatus(order._id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <FaSave />
                      {savingId === order._id ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <>
                    {/* ---------- Customer / Payment / Shipping info ---------- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-3 border-b text-sm">
                      <div>
                        <p className="font-semibold text-gray-700 mb-1">
                          Customer
                        </p>
                        <p>{order.customer?.name}</p>
                        <p>{order.customer?.phone}</p>
                        <p className="text-gray-500">
                          {order.customer?.address}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-700 mb-1">
                          Payment
                        </p>
                        <p>Method: {order.paymentMethod}</p>
                        <p>Status: {order.orderPayment}</p>
                        {order.paymentInfo?.trxID && (
                          <p>TrxID: {order.paymentInfo.trxID}</p>
                        )}
                        {order.paymentInfo?.amount != null && (
                          <p>Paid Amount: {money(order.paymentInfo.amount)}</p>
                        )}
                        {order.paymentInfo?.phone && (
                          <p>Payment Phone: {order.paymentInfo.phone}</p>
                        )}
                        {order.paymentInfo?.walletBefore != null && (
                          <p>
                            Wallet: {money(order.paymentInfo.walletBefore)} →{" "}
                            {money(order.paymentInfo.walletAfter)}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-700 mb-1">
                          Shipping / Tracking
                        </p>
                        <p>Consignment ID: {order.consignment_id || "-"}</p>
                        <p>Tracking Code: {order.tracking_code || "-"}</p>
                        <p>
                          Status History:{" "}
                          {(order.statusHistory || []).join(" → ")}
                        </p>
                      </div>
                    </div>

                    {/* ---------- Cancel / Return info (only if present) ---------- */}
                    {(order.cancelReason || order.returnStatus) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-3 border-b text-sm bg-red-50">
                        {order.cancelReason && (
                          <div>
                            <p className="font-semibold text-red-700 mb-1">
                              Cancellation
                            </p>
                            <p>Reason: {order.cancelReason}</p>
                            {order.cancelNote && (
                              <p>Note: {order.cancelNote}</p>
                            )}
                          </div>
                        )}
                        {order.returnStatus && (
                          <div>
                            <p className="font-semibold text-orange-700 mb-1">
                              Return
                            </p>
                            <p>Status: {order.returnStatus}</p>
                            <p>Reason: {order.returnReason || "-"}</p>
                            {order.returnNote && (
                              <p>Note: {order.returnNote}</p>
                            )}
                            {order.raCode && <p>RA Code: {order.raCode}</p>}
                            {order.returnRequestedAt && (
                              <p>
                                Requested:{" "}
                                {new Date(
                                  order.returnRequestedAt
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ---------- Products table with full commission breakdown ---------- */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                          <tr>
                            <th className="px-3 py-2 text-left">Product</th>
                            <th className="px-3 py-2 text-left">Variant</th>
                            <th className="px-3 py-2 text-right">Qty</th>
                            <th className="px-3 py-2 text-right">Sale Price</th>
                            <th className="px-3 py-2 text-right">
                              Purchase Price
                            </th>
                            <th className="px-3 py-2 text-right">Discount</th>
                            <th className="px-3 py-2 text-right">
                              Line Subtotal
                            </th>
                            <th className="px-3 py-2 text-right">
                              Admin Commission
                            </th>
                            <th className="px-3 py-2 text-right">
                              Admin Earning
                            </th>
                            <th className="px-3 py-2 text-right bg-emerald-50">
                              Seller Gets
                            </th>
                            <th className="px-3 py-2 text-center">
                              Settled
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.products?.map((p, idx) => {
                            const lineSubtotal =
                              Number(p.ProductPrice || 0) *
                                Number(p.quantity || 0) -
                              Number(p.productwiseDiscount || 0);
                            return (
                              <tr key={idx} className="border-t">
                                <td className="px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    {p.img && (
                                      <img
                                        src={p.img}
                                        alt={p.title}
                                        className="w-10 h-10 object-cover rounded border"
                                        onError={(e) => {
                                          e.target.style.display = "none";
                                        }}
                                      />
                                    )}
                                    <span className="font-medium">
                                      {p.title}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-gray-500">
                                  {[p.selectedSize, p.selectedColor]
                                    .filter(Boolean)
                                    .join(" / ") || "-"}
                                </td>
                                <td className="px-3 py-2 text-right">
                                  {p.quantity}
                                </td>
                                <td className="px-3 py-2 text-right">
                                  {money(p.ProductPrice)}
                                </td>
                                <td className="px-3 py-2 text-right text-gray-500">
                                  {money(p.purchasePrice)}
                                </td>
                                <td className="px-3 py-2 text-right text-red-600">
                                  {money(p.productwiseDiscount)}
                                </td>
                                <td className="px-3 py-2 text-right font-medium">
                                  {money(lineSubtotal)}
                                </td>
                                <td className="px-3 py-2 text-right text-gray-600">
                                  {money(p.adminCommission)}
                                </td>
                                <td className="px-3 py-2 text-right text-blue-700">
                                  {money(p.adminEarning)}
                                </td>
                                <td className="px-3 py-2 text-right font-semibold text-emerald-700 bg-emerald-50">
                                  {money(p.sellerEarning)}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {p.commissionSettled ? (
                                    <span className="text-green-600 text-xs font-semibold">
                                      Settled
                                    </span>
                                  ) : (
                                    <span className="text-yellow-600 text-xs font-semibold">
                                      Pending
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* ---------- Order totals + commission summary ---------- */}
                    <div className="flex flex-wrap justify-end gap-x-6 gap-y-1 px-4 py-3 bg-gray-50 border-t text-sm">
                      <span>
                        Subtotal:{" "}
                        <span className="font-medium">
                          {money(order.totals?.subtotal)}
                        </span>
                      </span>
                      <span>
                        Tax:{" "}
                        <span className="font-medium">
                          {money(order.totals?.tax)}
                        </span>
                      </span>
                      <span>
                        Shipping:{" "}
                        <span className="font-medium">
                          {money(order.totals?.shipping)}
                        </span>
                      </span>
                      <span>
                        Grand Total:{" "}
                        <span className="font-semibold">
                          {money(order.totals?.grandtotal)}
                        </span>
                      </span>
                      <span className="text-gray-400">|</span>
                      <span>
                        Admin Commission:{" "}
                        <span className="font-medium text-gray-700">
                          {money(adminTotalCommission)}
                        </span>
                      </span>
                      <span>
                        Admin Earning:{" "}
                        <span className="font-medium text-blue-700">
                          {money(adminTotalEarning)}
                        </span>
                      </span>
                      <span>
                        Seller Gets (after commission):{" "}
                        <span className="font-bold text-emerald-700">
                          {money(sellerTotalEarning)}
                        </span>
                      </span>
                      <span>
                        Order Settled:{" "}
                        <span
                          className={
                            order.commissionSettled
                              ? "text-green-600 font-semibold"
                              : "text-yellow-600 font-semibold"
                          }
                        >
                          {order.commissionSettled ? "Yes" : "No"}
                        </span>
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
