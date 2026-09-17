"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function PurchaseInvoicePage() {
  const params = useParams();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const res = await axios.get(`https://dailyshopping-backend.onrender.com/api/purchases/${params.id}`);
        setPurchase(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchase();
  }, [params.id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!purchase) return <div className="p-6 text-center text-red-600">Purchase not found</div>;

  const totalAmount = purchase.items.reduce((sum, i) => sum + (i.qty ?? 0) * (i.unitPrice ?? 0), 0);

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-md mt-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">INVOICE</h1>
          <p className="text-gray-600">Invoice No: <b>{purchase.invoiceNo}</b></p>
          <p className="text-gray-600">Date: {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold">Supplier</h2>
          <p>{purchase.supplier}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-left">#</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Product</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Qty</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Unit Price</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {purchase.items.map((item, i) => (
            <tr key={i}>
              <td className="border border-gray-300 px-3 py-2">{i + 1}</td>
              <td className="border border-gray-300 px-3 py-2">{item.product}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{item.qty}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{item.unitPrice.toFixed(2)}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{(item.qty * item.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-6 space-y-1 flex-col text-right">
        <p>Total Amount: <b>{totalAmount.toFixed(2)}</b></p>
        <p>Paid Amount: <b>{purchase.paidAmount.toFixed(2)}</b></p>
        <p>Due Amount: <b>{purchase.dueAmount.toFixed(2)}</b></p>
      </div>

      {/* Note */}
      {purchase.note && (
        <div className="mb-6">
          <h3 className="font-semibold">Note:</h3>
          <p>{purchase.note}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-12 text-gray-500">
        Thank you for your business!
      </div>

      {/* Print Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
}
