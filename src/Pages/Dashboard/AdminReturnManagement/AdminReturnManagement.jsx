import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaPhoneAlt } from "react-icons/fa";
import QRCode from "react-qr-code";

const statusOptions = [
  { value: "requested", label: "Requested" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
  { value: "picked_up", label: "Picked Up" },
  { value: "received", label: "Received" },
  { value: "refunded", label: "Refunded" },
];

const statusColor = {
  requested: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  declined: "bg-red-100 text-red-700",
  picked_up: "bg-indigo-100 text-indigo-700",
  received: "bg-purple-100 text-purple-700",
  refunded: "bg-green-100 text-green-700",
};

const AdminReturnManagement = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedReturn, setSelectedReturn] = useState(null);

  // 🔵 Invoice modal এর জন্য নতুন state
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://dailyshopping-backend.onrender.com/api/returns");
      setReturns(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch returns", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`https://dailyshopping-backend.onrender.com/api/orders/${id}/return-status`, {
        returnStatus: newStatus,
      });

      setReturns((prev) =>
        prev.map((r) => (r._id === id ? { ...r, returnStatus: newStatus } : r))
      );

      setSelectedReturn((prev) =>
        prev && prev._id === id ? { ...prev, returnStatus: newStatus } : prev
      );

      Swal.fire({
        icon: "success",
        title: "Return status updated",
        text: `Updated to ${newStatus}`,
        timer: 1800,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update return status", "error");
    }
  };

  // 🔵 Invoice fetch + open — এই order এর পূর্ণাঙ্গ data আনা হচ্ছে (return record এ totals/payment info থাকে না)
  const openInvoice = async (orderId) => {
    setInvoiceLoading(true);
    setInvoiceOrder({}); // modal খুলে দাও, ভেতরে loading state দেখাবে
    try {
      const res = await axios.get(`https://dailyshopping-backend.onrender.com/api/orders/${orderId}`);
      setInvoiceOrder(res.data);
    } catch (err) {
      console.error(err);
      setInvoiceOrder(null);
      Swal.fire("Error", "Invoice load করা যায়নি", "error");
    } finally {
      setInvoiceLoading(false);
    }
  };

  const closeInvoice = () => setInvoiceOrder(null);

  const filteredReturns = returns.filter((r) => {
    const matchesStatus = statusFilter ? r.returnStatus === statusFilter : true;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r._id.toLowerCase().includes(q) ||
      r.raCode?.toLowerCase().includes(q) ||
      r.shopName?.toLowerCase().includes(q) ||
      r.customer?.name?.toLowerCase().includes(q) ||
      r.customer?.phone?.includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Return Management</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by order ID, RA code, customer name/phone, shop"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-3 py-2 text-sm flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : filteredReturns.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No return requests found</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Product</th>
                <th className="p-3">RA Code</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Requested At</th>
                <th className="p-3">Status</th>
                <th className="p-3">Update</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((r) => (
                <tr key={r._id} className="border-t align-top">
                  <td className="p-3 text-blue-600">#{r._id.slice(-8)}</td>
                  <td className="p-3">
                    <div>{r.customer?.name}</div>
                    <div className="text-gray-400 text-xs">{r.customer?.phone}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={r.products?.[0]?.img}
                        className="w-10 h-10 rounded object-cover border"
                      />
                      <span className="max-w-[160px] truncate">
                        {r.products?.[0]?.title}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">{r.raCode}</td>
                  <td className="p-3 max-w-[180px]">
                    <div>{r.returnReason}</div>
                    {r.returnNote && (
                      <div className="text-gray-400 text-xs">{r.returnNote}</div>
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {r.returnRequestedAt
                      ? new Date(r.returnRequestedAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs capitalize ${
                        statusColor[r.returnStatus] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {r.returnStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={r.returnStatus}
                      onChange={(e) => handleStatusChange(r._id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => setSelectedReturn(r)}
                        className="text-blue-600 underline text-xs text-left"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openInvoice(r._id)}
                        className="text-emerald-600 underline text-xs text-left"
                      >
                        Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔵 Return Details Modal */}
      {selectedReturn && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReturn(null)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <h2 className="text-lg font-semibold">Return Details</h2>
              <button
                onClick={() => setSelectedReturn(null)}
                className="text-gray-400 hover:text-gray-700 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="text-blue-600">#{selectedReturn._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">RA Code</span>
                <span>{selectedReturn.raCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Requested At</span>
                <span>
                  {selectedReturn.returnRequestedAt
                    ? new Date(selectedReturn.returnRequestedAt).toLocaleString()
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs capitalize ${
                    statusColor[selectedReturn.returnStatus] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedReturn.returnStatus}
                </span>
              </div>

              <hr />

              <div>
                <span className="text-gray-500 block mb-1">Customer</span>
                <p className="font-medium">{selectedReturn.customer?.name}</p>
                <p className="text-gray-500 text-xs">{selectedReturn.customer?.phone}</p>
                <p className="text-gray-500 text-xs">{selectedReturn.customer?.address}</p>
              </div>

              <hr />

              <div>
                <span className="text-gray-500 block mb-2">Product(s)</span>
                <div className="space-y-3">
                  {selectedReturn.products?.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src={p.img}
                        className="w-14 h-14 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <p className="text-sm">{p.title}</p>
                        <p className="text-xs text-gray-400">Qty: {p.quantity}</p>
                      </div>
                      <p className="text-sm">৳ {p.ProductPrice}</p>
                    </div>
                  ))}
                </div>
              </div>

              <hr />

              <div>
                <span className="text-gray-500 block mb-1">Reason</span>
                <p>{selectedReturn.returnReason}</p>
                {selectedReturn.returnNote && (
                  <p className="text-gray-400 text-xs mt-1">
                    Note: {selectedReturn.returnNote}
                  </p>
                )}
              </div>

              <hr />

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Update Status</span>
                <select
                  value={selectedReturn.returnStatus}
                  onChange={(e) =>
                    handleStatusChange(selectedReturn._id, e.target.value)
                  }
                  className="border rounded px-2 py-1 text-xs"
                >
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-5 py-3 border-t flex justify-between">
              <button
                onClick={() => openInvoice(selectedReturn._id)}
                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                View Invoice
              </button>
              <button
                onClick={() => setSelectedReturn(null)}
                className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 Invoice Modal — আলাদা page এ navigate না করে এখানেই দেখাচ্ছে */}
      {invoiceOrder && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 print:static print:bg-white print:p-0"
          onClick={closeInvoice}
        >
          <div
            className="bg-gray-100 rounded-lg w-full max-w-3xl max-h-[92vh] overflow-y-auto print:max-h-none print:overflow-visible print:bg-white print:rounded-none print:w-full print:max-w-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal top bar — print এর সময় হাইড হয়ে যাবে */}
            <div className="flex justify-between items-center px-5 py-3 bg-white border-b sticky top-0 z-10 print:hidden">
              <h2 className="text-base font-semibold text-gray-800">Invoice</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  disabled={invoiceLoading || !invoiceOrder?._id}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 px-4 py-1.5 rounded-md text-white text-sm font-medium transition"
                >
                  🖨 Print
                </button>
                <button
                  onClick={closeInvoice}
                  className="text-gray-400 hover:text-gray-700 text-xl leading-none px-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {invoiceLoading || !invoiceOrder?._id ? (
              <div className="text-center text-gray-500 py-16">Loading invoice...</div>
            ) : (
              <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 print:shadow-none print:border-none print:rounded-none p-6 m-4 print:m-0">
                {/* Header */}
                <div className="border-b border-gray-300 pb-3 mb-4 flex justify-between items-start">
                  <div>
                    <img
                      src="https://i.ibb.co.com/CKCp8K3q/Daily-Shopping-Logo-2.png"
                      alt="DailyShopping"
                      className="h-14 mb-2"
                    />
                    <p className="text-sm text-gray-600">Dhaka, Bangladesh</p>
                    <p className="text-sm text-gray-600">DailyShopping@gmail.com</p>
                    <p className="flex items-center gap-1 text-sm text-gray-600">
                      <FaPhoneAlt className="text-blue-600" /> 01316-360000
                    </p>
                  </div>

                  <div className="text-right">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Invoice #{invoiceOrder.paymentId || invoiceOrder._id}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Date: {invoiceOrder.createdAt ? new Date(invoiceOrder.createdAt).toLocaleDateString() : "-"}
                    </p>
                    <div className="mt-2 flex justify-end">
                      <QRCode value={invoiceOrder.paymentId || invoiceOrder._id} size={80} />
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Bill To:</h3>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <p className="font-medium text-gray-900">{invoiceOrder.customer?.name}</p>
                    <p className="text-sm text-gray-700">{invoiceOrder.customer?.address}</p>
                    <p className="text-sm flex items-center gap-1 text-gray-700">
                      <FaPhoneAlt className="text-blue-600" /> {invoiceOrder.customer?.phone}
                    </p>
                    {invoiceOrder.customer?.deliveryArea && (
                      <p className="text-sm text-gray-600 mt-1">
                        Delivery Area: {invoiceOrder.customer.deliveryArea}
                      </p>
                    )}
                  </div>
                </div>

                {/* Product Table */}
                <table className="w-full text-sm border border-gray-300 mb-4">
                  <thead className="bg-blue-50 text-gray-800">
                    <tr>
                      <th className="border border-gray-300 p-2 text-left">Item</th>
                      <th className="border border-gray-300 p-2 text-center">Qty</th>
                      <th className="border border-gray-300 p-2 text-center">Unit Price</th>
                      <th className="border border-gray-300 p-2 text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceOrder.products?.map((p, i) => (
                      <tr
                        key={p.productId || i}
                        className={`border border-gray-300 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                      >
                        <td className="border border-gray-300 p-2 flex items-center gap-2">
                          <img
                            src={p.img}
                            alt={p.title}
                            className="w-10 h-10 rounded-md object-cover border border-gray-200"
                          />
                          <p className="font-medium text-gray-800">{p.title}</p>
                        </td>
                        <td className="border border-gray-300 p-2 text-center">{p.quantity}</td>
                        <td className="border border-gray-300 p-2 text-center">{p.ProductPrice} BDT</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold">
                          {p.ProductPrice * p.quantity} BDT
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="text-right text-sm mb-4">
                  <p>Subtotal: <span className="font-medium">{invoiceOrder.totals?.subtotal ?? 0} BDT</span></p>
                  <p>Shipping Fee: <span className="font-medium">{invoiceOrder.totals?.shipping ?? 0} BDT</span></p>
                  <p>Discount: <span className="font-medium">{invoiceOrder.totals?.discount || 0} BDT</span></p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    Grand Total: {invoiceOrder.totals?.grandtotal ?? 0} BDT
                  </p>
                </div>

                {/* Payment Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Payment Info</h3>
                  <table className="w-full text-sm border border-gray-300">
                    <thead className="bg-blue-50 text-gray-800">
                      <tr>
                        <th className="border border-gray-300 p-2">Method</th>
                        <th className="border border-gray-300 p-2">Sender No.</th>
                        <th className="border border-gray-300 p-2">Trx ID</th>
                        <th className="border border-gray-300 p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border border-gray-300">
                        <td className="border border-gray-300 p-2">{invoiceOrder.paymentType || "Cash"}</td>
                        <td className="border border-gray-300 p-2">{invoiceOrder.senderNumber || "-"}</td>
                        <td className="border border-gray-300 p-2">{invoiceOrder.trxId || "N/A"}</td>
                        <td className="border border-gray-300 p-2 font-semibold text-green-600">
                          {invoiceOrder.status}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-gray-600 text-sm italic border-t border-gray-200 pt-3">
                  Thank you for shopping with{" "}
                  <span className="font-semibold text-blue-600">DailyShopping</span> ✨
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReturnManagement;