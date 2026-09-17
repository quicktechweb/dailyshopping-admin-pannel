import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
const AdminWithdraw = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);

 const fetchSummary = async () => {
  setLoading(true);
  try {
    const withdrawRes = await axios.get("http://localhost:5000/api/wallet/withdraw-summary");
    console.log("Withdraw summary response:", withdrawRes.data);

    const usersRes = await axios.get("http://localhost:5000/api/auth/alluser");
    console.log("Users response:", usersRes.data);

    const withdraws = withdrawRes.data.data; // array of withdraw summary
    const users = usersRes.data.users;      // array of all users

    // Merge user data into withdraw summary
    const merged = withdraws.map((w) => {
      const user = users.find(
        (u) => u.email === w.email || u.phoneNumber === w.phoneNumber
      );

      return {
        ...w,
        walletBalance: user?.walletBalance ?? 0,
        addBkashAmount: user?.addBkashAmount ?? 0,
        referralBalance: user?.referralBalance ?? 0,
      };
    });

    // Sort requests if needed (latest first)
    const sorted = merged.map((user) => ({
      ...user,
      requests: user.requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    }));

    setSummary(sorted);
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Failed to fetch data");
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchSummary();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this withdraw request?")) return;
    try {
      await axios.post(`http://localhost:5000/api/wallet/withdraw-approve/${id}`, { adminName: "Admin" });
      fetchSummary();
    } catch (err) {
      console.error(err);
      alert("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this withdraw request?")) return;
    try {
      await axios.post(`http://localhost:5000/api/wallet/withdraw-reject/${id}`);
      fetchSummary();
    } catch (err) {
      console.error(err);
      alert("Failed to reject");
    }
  };


  // 🔹 Pagination States
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(50);

// 🔹 Flatten all requests into one list for pagination
const flatRequests = summary
  .flatMap((user) =>
    (user.requests || []).map((req) => ({
      ...req,
      userPhone: user.phoneNumber,
      userEmail: user.email,
      walletBalance: user.walletBalance,
      addBkashAmount: user.addBkashAmount
    }))
  )
  .reverse(); // latest first

// 🔹 Total pages
const totalPages = Math.ceil(flatRequests.length / pageSize);

// 🔹 Paginated Data
const paginatedRequests = flatRequests.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

// 🔹 Page Size Change
const handlePageSizeChange = (e) => {
  setPageSize(Number(e.target.value));
  setCurrentPage(1);
};

 
  
   /* -------------------------- EXPORT PDF -------------------------- */
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Withdraw Summary Report", 14, 10);

    const tableRows = summary.flatMap((user) =>
      user.requests.map((req) => [
        req.paymentNumber,
        req.amount,
        req.status,
        new Date(req.createdAt).toLocaleDateString(),
      ])
    );

    autoTable(doc, {
      head: [["Payment Number", "Amount", "Status", "Date"]],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10, halign: "left" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    doc.save("withdraw_summary.pdf");
  };

  /* -------------------------- EXPORT EXCEL -------------------------- */
  const exportToExcel = () => {
    const worksheetData = summary.flatMap((user) =>
      user.requests.map((req) => ({
        "Payment Number": req.paymentNumber,
        Amount: req.amount,
        Status: req.status,
        Date: new Date(req.createdAt).toLocaleDateString(),
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    worksheet["!cols"] = [{ wpx: 150 }, { wpx: 100 }, { wpx: 100 }, { wpx: 120 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Withdraw Summary");
    XLSX.writeFile(workbook, "withdraw_summary.xlsx");
  };

  /* -------------------------- EXPORT CSV -------------------------- */
  const exportToCSV = () => {
    const worksheetData = summary.flatMap((user) =>
      user.requests.map((req) => ({
        "Payment Number": req.paymentNumber,
        Amount: req.amount,
        Status: req.status,
        Date: new Date(req.createdAt).toLocaleDateString(),
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "withdraw_summary.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* -------------------------- PRINT TABLE -------------------------- */
  const printAllUsersTable = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    let html = `
      <h2>Withdraw Summary Report</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr>
            <th style="border: 1px solid black; padding: 5px;">Payment Number</th>
            <th style="border: 1px solid black; padding: 5px;">Amount</th>
            <th style="border: 1px solid black; padding: 5px;">Status</th>
            <th style="border: 1px solid black; padding: 5px;">Date</th>
          </tr>
        </thead>
        <tbody>
    `;

    summary.forEach((user) => {
      user.requests.forEach((req) => {
        html += `
          <tr>
            <td style="border:1px solid black; padding:5px;">${req.paymentNumber}</td>
            <td style="border:1px solid black; padding:5px;">৳${req.amount}</td>
            <td style="border:1px solid black; padding:5px;">${req.status}</td>
            <td style="border:1px solid black; padding:5px;">${new Date(
              req.createdAt
            ).toLocaleDateString()}</td>
          </tr>
        `;
      });
    });

    html += `</tbody></table>`;
    doc.open();
    doc.write(html);
    doc.close();

    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };
  

  if (loading) return <p className="p-4 text-gray-700">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={exportToPDF}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Export PDF
        </button>

        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>

        <button
           onClick={() => printAllUsersTable()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Print
        </button>
        <button
  onClick={exportToCSV}
  className="bg-yellow-600 text-white px-4 py-2 rounded"
>
  Export CSV
</button>

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

      </div>
      <h1 className="text-xl font-semibold mb-4">Withdraw Request</h1>

      {paginatedRequests.length === 0 ? (
        <p>No withdraw requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="px-4 py-2 border">User</th>
                {/* <th className="px-4 py-2 border">Total Request</th> */}
                {/* <th className="px-4 py-2 border">Pending</th> */}
                {/* <th className="px-4 py-2 border">Approved</th> */}
                {/* <th className="px-4 py-2 border">Rejected</th> */}
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Method</th>
                <th className="px-4 py-2 border">Bkash</th>
                <th className="px-4 py-2 border">WalletBalance</th>
                {/* <th className="px-4 py-2 border">refferal</th> */}
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>

        <tbody>
  {paginatedRequests.length === 0 ? (
    <tr>
      <td colSpan="7" className="text-center py-4">
        No withdraw requests yet.
      </td>
    </tr>
  ) : (
    paginatedRequests.map((req) => (
      <tr key={req._id} className="hover:bg-gray-50 text-sm">
        <td className="px-4 py-2 border">
          {req.userPhone || req.userEmail || "N/A"}
        </td>
        <td className="px-4 py-2 border font-medium">৳{req.amount}</td>
        <td className="px-4 py-2 border font-medium">{req.method}</td>
        <td className="px-4 py-2 border font-medium text-green-600">
          ৳{req.addBkashAmount ?? 0}
        </td>
        <td className="px-4 py-2 border font-medium text-green-600">
          ৳{req.walletBalance ?? 0}
        </td>
        <td className="px-4 py-2 border">
          <span
            className={
              req.status === "pending"
                ? "text-yellow-600"
                : req.status === "approved"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {req.status}
          </span>
        </td>
        <td className="px-4 py-2 border flex gap-2">
          {req.status === "pending" ? (
            <>
              <button
                onClick={() => handleApprove(req._id)}
                className="px-2 py-1 bg-green-500 text-white rounded text-xs"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(req._id)}
                className="px-2 py-1 bg-red-500 text-white rounded text-xs"
              >
                Reject
              </button>
            </>
          ) : (
            <span className="text-gray-500 text-xs">{req.status}</span>
          )}
        </td>
      </tr>
    ))
  )}
</tbody>

          </table>
        </div>
      )}

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
    </div>
  );
};

export default AdminWithdraw;
