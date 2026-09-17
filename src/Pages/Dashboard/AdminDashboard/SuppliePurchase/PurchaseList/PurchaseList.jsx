"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [editItems, setEditItems] = useState([]);

  // 🔹 Fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/purchases");
        setPurchases(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch purchases:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  // 🔹 Delete purchase
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This purchase will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/purchases/${id}`);
      setPurchases((prev) => prev.filter((p) => p._id !== id));
      Swal.fire("Deleted!", "Purchase deleted successfully.", "success");
    } catch (err) {
      console.error("❌ Delete failed:", err);
      Swal.fire("Error", "Failed to delete purchase!", "error");
    }
  };

  // 🔹 Pagination States
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(50);

// Total pages
const totalPages = Math.ceil(purchases.length / pageSize);

// 🔹 Handle Dropdown Change
const handlePageSizeChange = (e) => {
  setPageSize(Number(e.target.value));
  setCurrentPage(1);
};

// 🔹 Slice Data for Pagination
const paginatedPurchases = purchases.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);


  // 🔹 View purchase
  const handleView = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/purchases/${id}`);
      const purchase = res.data;
      Swal.fire({
        title: `🧾 Purchase: ${purchase.invoiceNo}`,
        html: `
          <p><b>Supplier:</b> ${purchase.supplier}</p>
          <p><b>Date:</b> ${new Date(purchase.purchaseDate).toLocaleDateString()}</p>
          <p><b>Total:</b> ${purchase.totalAmount}</p>
          <p><b>Paid:</b> ${purchase.paidAmount}</p>
          <p><b>Due:</b> ${purchase.dueAmount}</p>
          <hr/>
          <p><b>Note:</b> ${purchase.note || "N/A"}</p>
        `,
        icon: "info",
      });
    } catch (err) {
      console.error("❌ View error:", err);
      Swal.fire("Error", "Could not load purchase details!", "error");
    }
  };

  // 🔹 Start editing
  const handleEdit = (purchase) => {
    setEditingPurchase(purchase);
    setEditItems(purchase.items.map((item) => ({ ...item })));
  };

  // 🔹 Save edit
  const handleSaveEdit = async () => {
    try {
      const paidAmount = Number(editingPurchase.paidAmount || 0);
      const totalAmount = editItems.reduce(
        (sum, item) => sum + (item.qty ?? 0) * (item.unitPrice ?? 0),
        0
      );
      const dueAmount = Math.max(totalAmount - paidAmount, 0);
      const updatedData = { ...editingPurchase, totalAmount, dueAmount, paidAmount, items: editItems };

      const res = await axios.put(
        `http://localhost:5000/api/purchases/${editingPurchase._id}`,
        updatedData
      );

      setPurchases((prev) =>
        prev.map((p) => (p._id === editingPurchase._id ? res.data : p))
      );
      Swal.fire("Success!", "Purchase updated successfully.", "success");
      setEditingPurchase(null);
    } catch (err) {
      console.error("❌ Update failed:", err);
      Swal.fire("Error", "Failed to update purchase!", "error");
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading...</div>;

  // 🔹 Export PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Purchase List", 14, 10);

    const tableRows = purchases.map((p, i) => [
      i + 1,
      p.invoiceNo,
      p.supplier,
      new Date(p.purchaseDate).toLocaleDateString(),
      p.totalAmount,
      p.paidAmount,
      p.dueAmount,
      p.note || "-",
    ]);

    autoTable(doc, {
      head: [["#", "Invoice No", "Supplier", "Date", "Total", "Paid", "Due", "Note"]],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10, halign: "left" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    doc.save("purchase_list.pdf");
  };

  // 🔹 Export Excel
  const exportToExcel = () => {
    const data = purchases.map((p, i) => ({
      "#": i + 1,
      "Invoice No": p.invoiceNo,
      Supplier: p.supplier,
      Date: new Date(p.purchaseDate).toLocaleDateString(),
      Total: p.totalAmount,
      Paid: p.paidAmount,
      Due: p.dueAmount,
      Note: p.note || "-",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Purchases");
    XLSX.writeFile(wb, "purchase_list.xlsx");
  };

  // 🔹 Export CSV
  const exportToCSV = () => {
    const data = purchases.map((p, i) => ({
      "#": i + 1,
      "Invoice No": p.invoiceNo,
      Supplier: p.supplier,
      Date: new Date(p.purchaseDate).toLocaleDateString(),
      Total: p.totalAmount,
      Paid: p.paidAmount,
      Due: p.dueAmount,
      Note: p.note || "-",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "purchase_list.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // 🔹 Print table
  const printTable = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    let html = `
      <h2>Purchase List</h2>
      <table style="width:100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr>
            <th style="border:1px solid black; padding:4px;">#</th>
            <th style="border:1px solid black; padding:4px;">Invoice No</th>
            <th style="border:1px solid black; padding:4px;">Supplier</th>
            <th style="border:1px solid black; padding:4px;">Date</th>
            <th style="border:1px solid black; padding:4px;">Total</th>
            <th style="border:1px solid black; padding:4px;">Paid</th>
            <th style="border:1px solid black; padding:4px;">Due</th>
            <th style="border:1px solid black; padding:4px;">Note</th>
          </tr>
        </thead>
        <tbody>
    `;
    purchases.forEach((p, i) => {
      html += `<tr>
        <td style="border:1px solid black; padding:4px;">${i+1}</td>
        <td style="border:1px solid black; padding:4px;">${p.invoiceNo}</td>
        <td style="border:1px solid black; padding:4px;">${p.supplier}</td>
        <td style="border:1px solid black; padding:4px;">${new Date(p.purchaseDate).toLocaleDateString()}</td>
        <td style="border:1px solid black; padding:4px;">${p.totalAmount}</td>
        <td style="border:1px solid black; padding:4px;">${p.paidAmount}</td>
        <td style="border:1px solid black; padding:4px;">${p.dueAmount}</td>
        <td style="border:1px solid black; padding:4px;">${p.note || "-"}</td>
      </tr>`;
    });
    html += "</tbody></table>";
    doc.open();
    doc.write(html);
    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Purchase List</h2>
        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
          Add New Purchase
        </button>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button onClick={exportToPDF} className="bg-red-600 text-white px-4 py-2 rounded">
          Export PDF
        </button>
        <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded">
          Export Excel
        </button>
        <button onClick={exportToCSV} className="bg-yellow-600 text-white px-4 py-2 rounded">
          Export CSV
        </button>
        <button onClick={printTable} className="bg-blue-600 text-white px-4 py-2 rounded">
          Print
        </button>
      </div>


 <div className="flex items-center gap-2">
    <span className="font-semibold">Show:</span>
    <select
      value={pageSize}
      onChange={handlePageSizeChange}
      className="border px-2 py-1 rounded"
    >
      <option value="50">50</option>
      <option value="100">100</option>
      <option value="200">200</option>
      <option value="250">250</option>
    </select>
  </div>
      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Invoice No</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Supplier</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Purchase Date</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Total Amount</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Paid Amount</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Due Amount</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Note</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedPurchases.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-gray-500">No purchases found.</td>
              </tr>
            ) : (
              paginatedPurchases.map((purchase) => (
                <tr key={purchase._id}>
                  <td className="px-4 py-2 text-sm">{purchase.invoiceNo}</td>
                  <td className="px-4 py-2 text-sm">{purchase.supplier}</td>
                  <td className="px-4 py-2 text-sm">{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-sm text-right">{(purchase.totalAmount ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-right">{(purchase.paidAmount ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-right">{(purchase.dueAmount ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm">{purchase.note || "-"}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button  className="text-blue-600 hover:underline"><Link to={`/admin/dashboard/purchase/${purchase._id}`} className="text-blue-600 hover:underline">
    View
  </Link></button>
                    <button onClick={() => handleEdit(purchase)} className="text-green-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(purchase._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

<div className="flex items-center gap-3 justify-center mt-5">
    <button
      className="px-3 py-1 border rounded disabled:opacity-50"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
    >
      Prev
    </button>

    <span className="font-semibold">
      Page {currentPage} / {totalPages}
    </span>

    <button
      className="px-3 py-1 border rounded disabled:opacity-50"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(currentPage + 1)}
    >
      Next
    </button>
  </div>


      {/* === Edit Modal === */}
      {editingPurchase && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Purchase</h3>

            {/* Supplier & Paid Amount */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium">Supplier</label>
                <input
                  type="text"
                  value={editingPurchase.supplier}
                  onChange={(e) => setEditingPurchase((prev) => ({ ...prev, supplier: e.target.value }))}
                  className="border px-2 py-1 w-full rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Paid Amount</label>
                <input
                  type="number"
                  min={0}
                  value={editingPurchase.paidAmount ?? 0}
                  onChange={(e) => setEditingPurchase((prev) => ({ ...prev, paidAmount: Number(e.target.value) }))}
                  className="border px-2 py-1 w-full rounded"
                />
              </div>
            </div>

            {/* Products Table */}
            <table className="min-w-full divide-y divide-gray-200 mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-1 text-left text-sm">Product</th>
                  <th className="px-2 py-1 text-left text-sm">Qty</th>
                  <th className="px-2 py-1 text-left text-sm">Unit Price</th>
                  <th className="px-2 py-1 text-left text-sm">Total</th>
                  <th className="px-2 py-1 text-left text-sm">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {editItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-2 py-1 text-sm">
                      <input
                        type="text"
                        value={item.product}
                        onChange={(e) => {
                          const updated = [...editItems];
                          updated[index].product = e.target.value;
                          setEditItems(updated);
                        }}
                        className="border px-1 py-0.5 w-full rounded"
                      />
                    </td>
                    <td className="px-2 py-1 text-sm">
                      <input
                        type="number"
                        min={0}
                        value={item.qty ?? 0}
                        onChange={(e) => {
                          const updated = [...editItems];
                          updated[index].qty = Number(e.target.value);
                          setEditItems(updated);
                        }}
                        className="border px-1 py-0.5 w-16 rounded"
                      />
                    </td>
                    <td className="px-2 py-1 text-sm">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.unitPrice ?? 0}
                        onChange={(e) => {
                          const updated = [...editItems];
                          updated[index].unitPrice = Number(e.target.value);
                          setEditItems(updated);
                        }}
                        className="border px-1 py-0.5 w-20 rounded"
                      />
                    </td>
                    <td className="px-2 py-1 text-sm">{((item.qty ?? 0) * (item.unitPrice ?? 0)).toFixed(2)}</td>
                    <td className="px-2 py-1 text-sm">
                      <button onClick={() => setEditItems(editItems.filter((_, i) => i !== index))} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} className="px-2 py-1">
                    <button onClick={() => setEditItems([...editItems, { product: "", qty: 0, unitPrice: 0 }])} className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700">Add Product</button>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Note */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Note</label>
              <textarea
                value={editingPurchase.note || ""}
                onChange={(e) => setEditingPurchase((prev) => ({ ...prev, note: e.target.value }))}
                className="border px-2 py-1 w-full rounded"
              />
            </div>

            {/* Totals */}
            <div className="flex justify-end space-x-4 mb-4">
              <p><b>Total Amount:</b> {editItems.reduce((sum,i)=>sum+(i.qty??0)*(i.unitPrice??0),0).toFixed(2)}</p>
              <p><b>Due Amount:</b> {(editItems.reduce((sum,i)=>sum+(i.qty??0)*(i.unitPrice??0),0) - (editingPurchase.paidAmount??0)).toFixed(2)}</p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button onClick={() => setEditingPurchase(null)} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleSaveEdit} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseList;
