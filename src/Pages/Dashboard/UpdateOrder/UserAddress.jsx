import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../Shared/Context/NotificationContext";
import { CreditCard } from "lucide-react";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";

const CustomerAddress = ({ order, onStatusUpdate }) => {
  const [status, setStatus] = useState(order.status || "pending");
  const navigate = useNavigate();
  const { setNotifications } = useNotifications();
  const { user } = useAuth();

  const handleUpdate = async (id) => {
  try {
    console.log(`Updating status for order: ${id} to status: ${status}`);

    // 1️⃣ Update order status in backend
    const res = await axios.put(`https://dailyshopping-backend.onrender.com/api/orders/${id}/status`, { status });
    console.log("Order status update response:", res.data);

    // alert("Status updated: " + res.data.status);
    Swal.fire({
      icon: 'success',
      title: 'Status Updated',
      text: `Status updated: ${res.data.status}`,
      timer: 2500,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
    });
    onStatusUpdate({ ...order, status: res.data.status });

    // 2️⃣ Send notification to that user
    try {
      const notifPayload = {
        userId: user._id, // ObjectId or email/phone
        title: "Order Status Updated",
        message: `Your order for "${order.products.map(p => p.title).join(", ")}" is now "${res.data.status}"`,
      };

      console.log("Sending notification payload:", notifPayload);

      const notifRes = await axios.post(
        "https://dailyshopping-backend.onrender.com/api/notification/create",
        notifPayload
      );

      if (notifRes.data.success) {
        setNotifications(prev => [notifRes.data.notification, ...prev]);
        console.log("Notification sent successfully:", notifRes.data.notification);
      } else {
        console.error("Notification failed:", notifRes.data.message);
      }
    } catch (notifErr) {
      console.error("Notification error:", notifErr);
    }

  } catch (err) {
    console.error("Failed to update status or send notification:", err);
    alert("Failed to update status or send notification");
  }
};

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">Order Details</h2>

      {/* Customer Info */}
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

      {/* Order Summary */}
   

      {/* Update Status */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Update Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="intransit">In Transit</option>
          <option value="outfordelivery">Out for delivery</option>
          <option value="delivered">Delivered</option>
          <option value="returned">Returned</option>
          <option value="canceled">Canceled</option>
          <option value="hold">Hold</option>
          <option value="damage">Damage</option>
        </select>

        <button
          onClick={() => handleUpdate(order._id)}
          className="mt-2 w-full bg-[#19745B] text-white py-2 rounded-md hover:bg-green-700"
        >
          Update Status
        </button>
      </div>

      {/* View Invoice */}
      <button
      onClick={() => navigate(`/dashboard-admin-dailyshopping/dashboard/invoice/${order._id}`)}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        View Invoice
      </button>
    </div>
  );
};

CustomerAddress.propTypes = {
  order: PropTypes.object.isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
};

export default CustomerAddress;
