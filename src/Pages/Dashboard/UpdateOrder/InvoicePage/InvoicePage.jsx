import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaPhoneAlt } from "react-icons/fa";
import QRCode from "react-qr-code";

const InvoicePage = () => {
  const { paymentId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios
      .get(`https://dailyshopping-backend.onrender.com/api/orders/${paymentId}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error(err));
  }, [paymentId]);

  const handlePrint = () => {
    window.print();
  };

  if (!order) return <div className="text-center text-gray-700 py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 text-gray-800 print:bg-white print:text-black">
      {/* Top Print Button */}
      <div className="flex justify-center mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md text-white font-medium shadow-md transition-all"
        >
          🖨 Print Invoice
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 print:shadow-none print:border-gray-300 print:rounded-none p-6">
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
              Invoice #{order.paymentId || order._id}
            </h2>
            <p className="text-sm text-gray-500">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>

            {/* ✅ QR Code under date */}
            <div className="mt-2 flex justify-end">
           <QRCode value={order.paymentId || order._id} size={80} />

            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Bill To:</h3>
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <p className="font-medium text-gray-900">{order.customer.name}</p>
            <p className="text-sm text-gray-700">{order.customer.address}</p>
            <p className="text-sm flex items-center gap-1 text-gray-700">
              <FaPhoneAlt className="text-blue-600" /> {order.customer.phone}
            </p>
            {order.customer.deliveryArea && (
              <p className="text-sm text-gray-600 mt-1">
                Delivery Area: {order.customer.deliveryArea}
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
            {order.products.map((p, i) => (
              <tr
                key={p.productId}
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
          <p>
            Subtotal: <span className="font-medium">{order.totals.subtotal} BDT</span>
          </p>
          <p>
            Shipping Fee: <span className="font-medium">{order.totals.shipping} BDT</span>
          </p>
          <p>
            Discount: <span className="font-medium">{order.totals.discount || 0} BDT</span>
          </p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            Grand Total: {order.totals.grandtotal} BDT
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
                <td className="border border-gray-300 p-2">{order.paymentType || "Cash"}</td>
                <td className="border border-gray-300 p-2">{order.senderNumber || "-"}</td>
                <td className="border border-gray-300 p-2">{order.trxId || "N/A"}</td>
                <td className="border border-gray-300 p-2 font-semibold text-green-600">{order.status}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600 text-sm italic border-t border-gray-200 pt-3">
          Thank you for shopping with <span className="font-semibold text-blue-600">DailyShopping</span> ✨
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
