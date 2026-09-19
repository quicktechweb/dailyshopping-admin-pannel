import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaPhoneAlt } from "react-icons/fa";
import QRCode from "react-qr-code";

const InvoicePage = () => {
  const { paymentId } = useParams();
  const [order, setOrder] = useState(null);

  // ===== Edit mode state (frontend-only, nothing sent to backend) =====
  const [isEditing, setIsEditing] = useState(false);

  const [editCustomer, setEditCustomer] = useState({
    name: "",
    address: "",
    phone: "",
    deliveryArea: "",
  });
  const [editProducts, setEditProducts] = useState([]);
  const [editShipping, setEditShipping] = useState(0);
  const [editDiscount, setEditDiscount] = useState(0);
  const [editTax, setEditTax] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/orders/${paymentId}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error(err));
  }, [paymentId]);

  // ✅ Whenever the order loads, seed the editable copies from it
  useEffect(() => {
    if (!order) return;

    setEditCustomer({
      name: order.customer?.name || "",
      address: order.customer?.address || "",
      phone: order.customer?.phone || "",
      deliveryArea: order.customer?.deliveryArea || "",
    });

    setEditProducts(
      order.products.map((p) => ({
        productId: p.productId,
        title: p.title,
        img: p.img,
        quantity: p.quantity,
        ProductPrice: p.ProductPrice,
      }))
    );

    setEditShipping(order.totals?.shipping || 0);
    setEditDiscount(order.totals?.discount || 0);
    setEditTax(order.totals?.tax || 0);
  }, [order]);

  // ✅ Auto-calculated totals — recompute live as quantity/price/shipping/discount/tax change
  const subtotal = editProducts.reduce(
    (sum, p) => sum + (Number(p.ProductPrice) || 0) * (Number(p.quantity) || 0),
    0
  );
  const grandtotal =
    subtotal + Number(editShipping || 0) + Number(editTax || 0) - Number(editDiscount || 0);

  const handleProductFieldChange = (index, field, value) => {
    setEditProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const handlePrint = () => {
    window.print();
  };

  // ✅ "Done" just locks the values in and switches back to view mode —
  // nothing is sent to the server, it only affects what's shown/printed here.
  const handleDoneEditing = () => {
    setIsEditing(false);
  };

  // ✅ Discards edits and resets back to the originally-fetched order data
  const handleResetEdits = () => {
    setEditProducts(
      order.products.map((p) => ({
        productId: p.productId,
        title: p.title,
        img: p.img,
        quantity: p.quantity,
        ProductPrice: p.ProductPrice,
      }))
    );
    setEditCustomer({
      name: order.customer?.name || "",
      address: order.customer?.address || "",
      phone: order.customer?.phone || "",
      deliveryArea: order.customer?.deliveryArea || "",
    });
    setEditShipping(order.totals?.shipping || 0);
    setEditDiscount(order.totals?.discount || 0);
    setEditTax(order.totals?.tax || 0);
    setIsEditing(false);
  };

  if (!order) return <div className="text-center text-gray-700 py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 text-gray-800 print:bg-white print:text-black">
      {/* Top Buttons */}
      <div className="flex justify-center gap-3 mb-4 print:hidden">
        {!isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-amber-500 hover:bg-amber-600 px-6 py-2 rounded-md text-white font-medium shadow-md transition-all"
            >
              ✏️ Edit Invoice
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md text-white font-medium shadow-md transition-all"
            >
              🖨 Print Invoice
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleDoneEditing}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md text-white font-medium shadow-md transition-all"
            >
              ✅ Done Editing
            </button>
            <button
              onClick={handleResetEdits}
              className="bg-gray-400 hover:bg-gray-500 px-6 py-2 rounded-md text-white font-medium shadow-md transition-all"
            >
              ✕ Reset
            </button>
          </>
        )}
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
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 space-y-1">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editCustomer.name}
                  onChange={(e) =>
                    setEditCustomer((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Customer name"
                  className="border rounded px-2 py-1 w-full font-medium text-gray-900"
                />
                <input
                  type="text"
                  value={editCustomer.address}
                  onChange={(e) =>
                    setEditCustomer((prev) => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="Address"
                  className="border rounded px-2 py-1 w-full text-sm text-gray-700"
                />
                <input
                  type="text"
                  value={editCustomer.phone}
                  onChange={(e) =>
                    setEditCustomer((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Phone"
                  className="border rounded px-2 py-1 w-full text-sm text-gray-700"
                />
                <input
                  type="text"
                  value={editCustomer.deliveryArea}
                  onChange={(e) =>
                    setEditCustomer((prev) => ({ ...prev, deliveryArea: e.target.value }))
                  }
                  placeholder="Delivery area"
                  className="border rounded px-2 py-1 w-full text-sm text-gray-600"
                />
              </>
            ) : (
              <>
                <p className="font-medium text-gray-900">{editCustomer.name}</p>
                <p className="text-sm text-gray-700">{editCustomer.address}</p>
                <p className="text-sm flex items-center gap-1 text-gray-700">
                  <FaPhoneAlt className="text-blue-600" /> {editCustomer.phone}
                </p>
                {editCustomer.deliveryArea && (
                  <p className="text-sm text-gray-600 mt-1">
                    Delivery Area: {editCustomer.deliveryArea}
                  </p>
                )}
              </>
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
            {editProducts.map((p, i) => (
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

                <td className="border border-gray-300 p-2 text-center">
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={p.quantity}
                      onChange={(e) =>
                        handleProductFieldChange(i, "quantity", e.target.value)
                      }
                      className="border rounded w-16 text-center py-1"
                    />
                  ) : (
                    p.quantity
                  )}
                </td>

                <td className="border border-gray-300 p-2 text-center">
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={p.ProductPrice}
                      onChange={(e) =>
                        handleProductFieldChange(i, "ProductPrice", e.target.value)
                      }
                      className="border rounded w-20 text-center py-1"
                    />
                  ) : (
                    `${p.ProductPrice} BDT`
                  )}
                </td>

                <td className="border border-gray-300 p-2 text-center font-semibold">
                  {(Number(p.ProductPrice) || 0) * (Number(p.quantity) || 0)} BDT
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals — auto-calculated live, always in sync with the table above */}
        <div className="text-right text-sm mb-4 space-y-1">
          <p>
            Subtotal: <span className="font-medium">{subtotal} BDT</span>
          </p>

          <p className="flex justify-end items-center gap-2">
            Shipping Fee:{" "}
            {isEditing ? (
              <input
                type="number"
                min="0"
                value={editShipping}
                onChange={(e) => setEditShipping(e.target.value)}
                className="border rounded w-24 text-right px-2 py-0.5"
              />
            ) : (
              <span className="font-medium">{editShipping} BDT</span>
            )}
          </p>

          <p className="flex justify-end items-center gap-2">
            Tax:{" "}
            {isEditing ? (
              <input
                type="number"
                min="0"
                value={editTax}
                onChange={(e) => setEditTax(e.target.value)}
                className="border rounded w-24 text-right px-2 py-0.5"
              />
            ) : (
              <span className="font-medium">{editTax} BDT</span>
            )}
          </p>

          <p className="flex justify-end items-center gap-2">
            Discount:{" "}
            {isEditing ? (
              <input
                type="number"
                min="0"
                value={editDiscount}
                onChange={(e) => setEditDiscount(e.target.value)}
                className="border rounded w-24 text-right px-2 py-0.5"
              />
            ) : (
              <span className="font-medium">{editDiscount} BDT</span>
            )}
          </p>

          <p className="text-lg font-bold text-gray-900 mt-1">
            Grand Total: {grandtotal} BDT
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
