import { CreditCard } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
// import {
//   CheckCircle2,
//   Clock,
//   Loader2,
//   XCircle,
//   PackageCheck,
//   Truck,
//   RefreshCw,
//   AlertCircle,
//   CreditCard,
// } from "lucide-react";

const MyAddress = ({ order }) => {
  // const [status, setStatus] = useState(order.status || "pending");
  const navigate = useNavigate();
  // const { setNotifications } = useNotifications();
  // const { user } = useAuth();

  // const handleUpdate = async (id) => {
  //   try {
  //     console.log(`Updating status for order: ${id} to status: ${status}`);

  //     // 1️⃣ Update order status in backend
  //     const res = await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status });
  //     console.log("Order status update response:", res.data);

  //     alert("Status updated: " + res.data.status);
  //     onStatusUpdate({ ...order, status: res.data.status });

  //     // 2️⃣ Send notification to user
  //     try {
  //       const notifPayload = {
  //         userId: user._id,
  //         title: "Order Status Updated",
  //         message: `Your order for "${order.products.map(p => p.title).join(", ")}" is now "${res.data.status}"`,
  //       };

  //       const notifRes = await axios.post(
  //         "http://localhost:5000/api/notification/create",
  //         notifPayload
  //       );

  //       if (notifRes.data.success) {
  //         setNotifications(prev => [notifRes.data.notification, ...prev]);
  //       }
  //     } catch (notifErr) {
  //       console.error("Notification error:", notifErr);
  //     }

  //   } catch (err) {
  //     console.error("Failed to update status or send notification:", err);
  //     alert("Failed to update status or send notification");
  //   }
  // };

  if (!order?.statusHistory || order.statusHistory.length === 0) {
    return null;
  }

  // const statusMap = {
  //   pending: { color: "text-amber-500", icon: <Clock className="w-5 h-5" /> },
  //   approved: { color: "text-green-500", icon: <CheckCircle2 className="w-5 h-5" /> },
  //   processing: { color: "text-blue-500", icon: <Loader2 className="w-5 h-5 animate-spin" /> },
  //   shipped: { color: "text-indigo-500", icon: <Truck className="w-5 h-5" /> },
  //   delivered: { color: "text-emerald-600", icon: <PackageCheck className="w-5 h-5" /> },
  //   cancelled: { color: "text-red-500", icon: <XCircle className="w-5 h-5" /> },
  //   refunded: { color: "text-purple-500", icon: <RefreshCw className="w-5 h-5" /> },
  //   failed: { color: "text-rose-500", icon: <AlertCircle className="w-5 h-5" /> },
  // };

  // const getStatusDetails = (status) => {
  //   const key = Object.keys(statusMap).find((k) => status.toLowerCase().includes(k));
  //   return statusMap[key] || { color: "text-gray-400", icon: <CheckCircle2 className="w-5 h-5" /> };
  // };

  return (
    <div className="  rounded-xl  border border-gray-100 space-y-5 p-3">
      {/* 🧍 Customer Info */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Customer Info</h2>
        <div className="flex justify-between text-sm"><span>Name:</span><span>{order.customer.name}</span></div>
        <div className="flex justify-between text-sm"><span>Phone:</span><span>{order.customer.phone}</span></div>
        <div className="flex justify-between text-sm"><span>Address:</span><span>{order.customer.address}</span></div>
      </div>

      {/* 💳 Payment Info */}
      {order.paymentInfo && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-500" /> Payment Info
          </h2>

          <div className="flex justify-between text-sm">
            <span>Transaction ID:</span>
            <span className="font-medium">{order.paymentInfo.trxID}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Payment Method:</span>
            <span className="capitalize">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>consignment_id:</span>
            <span className="capitalize">{order.consignment_id}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Payment Status:</span>
            <span
              className={`capitalize font-medium ${
                order.orderPayment === "paid"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {order.orderPayment}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Amount:</span>
            <span>{order.paymentInfo.amount} BDT</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Payment Date:</span>
            <span>
              {new Date(order.paymentInfo.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      )}

      {/* 🛒 Order Summary */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Order Summary</h2>
        <div className="flex justify-between text-sm"><span>Status:</span><span className="capitalize">{status}</span></div>
        <div className="flex justify-between text-sm"><span>Total Quantity:</span><span>{order.totals.quantity}</span></div>
        <div className="flex justify-between text-sm"><span>Subtotal:</span><span>{order.totals.subtotal} BDT</span></div>
        <div className="flex justify-between text-sm"><span>Shipping:</span><span>{order.totals.shipping} BDT</span></div>
        <div className="flex justify-between font-semibold text-gray-800 border-t pt-1 text-sm">
          <span>Grand Total:</span>
          <span>{order.totals.grandtotal} BDT</span>
        </div>
      </div>

      {/* 🧾 Invoice Button */}
      <button
      onClick={() => navigate(`/dashboard/invoice/${order._id}`)}
        className="bg-blue-500 text-white px-10 py-2 rounded-md hover:bg-blue-600 transition-all"
      >
        View Invoice
      </button>
    </div>
  );
};

MyAddress.propTypes = {
  order: PropTypes.object.isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
};

export default MyAddress;


