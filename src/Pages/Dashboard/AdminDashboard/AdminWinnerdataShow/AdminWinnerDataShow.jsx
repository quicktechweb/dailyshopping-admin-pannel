"use client";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const AdminWinnerDataShow = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch all winners
  const fetchWinners = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/winners");
      const data = await res.json();
      if (data.success) setWinners(data.winners);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, []);


  // 🔹 Pagination States
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(50);

// 🔹 Total pages
const totalPages = Math.ceil(winners.length / pageSize);

// 🔹 Paginated winners
const paginatedWinners = winners.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

// 🔹 Handle page size change
const handlePageSizeChange = (e) => {
  setPageSize(Number(e.target.value));
  setCurrentPage(1);
};


  // 🔹 Update winner status
  const updateWinnerStatus = async (winnerId, status) => {
  const res = await fetch(`http://localhost:5000/api/winners/${winnerId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (data.success) {
    setWinners(prev =>
      prev.map(w => (w._id === winnerId ? { ...w, status } : w))
    );
  }
};


  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading winners...</div>;
  }

  // 🔹 Export functions
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Winners Report", 14, 10);

    const tableRows = winners.map((w, index) => [
      index + 1,
      w.productName,
      w.couponId,
      w.username || "Anonymous",
      w.useremail,
      w.userPhone || w.userRegPhone || "N/A",
      w.round,
      w.status,
    ]);

    autoTable(doc, {
      head: [
        ["ID", "Product Name", "Coupon ID", "Username", "Email", "Phone", "Round", "Status"],
      ],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10, halign: "left" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    doc.save("winners_report.pdf");
  };

  const exportToExcel = () => {
    const worksheetData = winners.map((w, index) => ({
      ID: index + 1,
      "Product Name": w.productName,
      "Coupon ID": w.couponId,
      Username: w.username || "Anonymous",
      Email: w.useremail,
      Phone: w.userPhone || w.userRegPhone || "N/A",
      Round: w.round,
      Status: w.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    worksheet["!cols"] = [
      { wpx: 40 },
      { wpx: 150 },
      { wpx: 100 },
      { wpx: 120 },
      { wpx: 180 },
      { wpx: 120 },
      { wpx: 60 },
      { wpx: 80 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Winners");
    XLSX.writeFile(workbook, "winners_report.xlsx", { compression: true });
  };

  const exportToCSV = () => {
    const worksheetData = winners.map((w, index) => ({
      ID: index + 1,
      "Product Name": w.productName,
      "Coupon ID": w.couponId,
      Username: w.username || "Anonymous",
      Email: w.useremail,
      Phone: w.userPhone || w.userRegPhone || "N/A",
      Round: w.round,
      Status: w.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "winners_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const printWinnersTable = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    let html = `
      <h2>Winners Report</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr>
            <th style="border: 1px solid black; padding: 5px;">ID</th>
            <th style="border: 1px solid black; padding: 5px;">Product Name</th>
            <th style="border: 1px solid black; padding: 5px;">Coupon ID</th>
            <th style="border: 1px solid black; padding: 5px;">Username</th>
            <th style="border: 1px solid black; padding: 5px;">Email</th>
            <th style="border: 1px solid black; padding: 5px;">Phone</th>
            <th style="border: 1px solid black; padding: 5px;">Round</th>
            <th style="border: 1px solid black; padding: 5px;">Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    winners.forEach((w, index) => {
      html += `
        <tr>
          <td style="border: 1px solid black; padding: 5px;">${index + 1}</td>
          <td style="border: 1px solid black; padding: 5px;">${w.productName}</td>
          <td style="border: 1px solid black; padding: 5px;">${w.couponId}</td>
          <td style="border: 1px solid black; padding: 5px;">${w.username || "Anonymous"}</td>
          <td style="border: 1px solid black; padding: 5px;">${w.useremail}</td>
          <td style="border: 1px solid black; padding: 5px;">${w.userPhone || w.userRegPhone || "N/A"}</td>
          <td style="border: 1px solid black; padding: 5px;">${w.round}</td>
          <td style="border: 1px solid black; padding: 5px;">${w.status}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    doc.open();
    doc.write(html);
    doc.close();

    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };

  

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
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
        <button onClick={printWinnersTable} className="bg-blue-600 text-white px-4 py-2 rounded">
          Print
        </button>
      </div>

      <h1 className="text-2xl font-bold">Winner Management</h1>

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

      <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Product Image</th>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Coupon ID</th>
              <th className="border p-2">Username</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Round</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedWinners.map((w) => (
              <tr key={w._id} className="hover:bg-gray-50">
                <td className="border p-2">
                  {w.productImage ? (
                    <img
                      src={w.productImage}
                      alt={w.productName}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="border p-2 truncate max-w-[120px]" title={w.productName}>
                  {w.productName}
                </td>
                <td className="border p-2">{w.couponId}</td>
                <td className="border p-2">{w.username || "Anonymous"}</td>
                <td className="border p-2 truncate max-w-[150px]" title={w.useremail}>
                  {w.useremail}
                </td>
                <td className="border p-2">{w.userPhone || w.userRegPhone || "N/A"}</td>
                <td className="border p-2">{w.round}</td>
                <td className="border p-2">
                  <select
                    value={w.status}
                    onChange={(e) => updateWinnerStatus(w._id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="hold">Hold</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3 mt-5 justify-center">
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
    </div>
  );
};

export default AdminWinnerDataShow;
