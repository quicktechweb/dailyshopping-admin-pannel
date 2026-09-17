import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const AdminReferral = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

 const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/auth/admin/referrals");
        if (res.data.success) {
          setData(res.data.referrals);
        }
      } catch (err) {
        console.error("Failed to fetch referrals", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  const getBadge = (count) => {
    if (count <= 500) return "Silver";
    if (count <= 1000) return "Gold";
    if (count <= 2000) return "Diamond";
    return "Diamond+";
  };

  const openModal = (user) => setModalData(user);
  const closeModal = () => setModalData(null);


  
   /* -------------------------- EXPORT PDF -------------------------- */
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Admin Referral Report", 14, 10);

    const tableRows = data.map((user, index) => [
      index + 1,
      user.name,
      user.phone,
      user.myReferralCode,
      user.totalReferrals,
      user.referredUsers.map(
        (r) => `${r.name} (${r.phone}) - ${new Date(r.joinedAt).toLocaleDateString()}`
      ).join(", "),
    ]);

    autoTable(doc, {
      head: [
        ["#", "User", "Phone", "Referral Code", "Total Referrals", "Referred Users"],
      ],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10, halign: "left" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    doc.save("admin_referral_report.pdf");
  };

  /* -------------------------- EXPORT EXCEL -------------------------- */
  const exportToExcel = () => {
    const worksheetData = data.map((user, index) => ({
      "#": index + 1,
      User: user.name,
      Phone: user.phone,
      "Referral Code": user.myReferralCode,
      "Total Referrals": user.totalReferrals,
      "Referred Users": user.referredUsers
        .map(
          (r) => `${r.name} (${r.phone}) - ${new Date(r.joinedAt).toLocaleDateString()}`
        )
        .join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admin Referrals");
    XLSX.writeFile(workbook, "admin_referral_report.xlsx");
  };

  /* -------------------------- EXPORT CSV -------------------------- */
  const exportToCSV = () => {
    const worksheetData = data.map((user, index) => ({
      "#": index + 1,
      User: user.name,
      Phone: user.phone,
      "Referral Code": user.myReferralCode,
      "Total Referrals": user.totalReferrals,
      "Referred Users": user.referredUsers
        .map(
          (r) => `${r.name} (${r.phone}) - ${new Date(r.joinedAt).toLocaleDateString()}`
        )
        .join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "admin_referral_report.csv";
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
      <h2>Admin Referral Report</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr>
            <th style="border:1px solid black; padding:5px;">#</th>
            <th style="border:1px solid black; padding:5px;">User</th>
            <th style="border:1px solid black; padding:5px;">Phone</th>
            <th style="border:1px solid black; padding:5px;">Referral Code</th>
            <th style="border:1px solid black; padding:5px;">Total Referrals</th>
            <th style="border:1px solid black; padding:5px;">Referred Users</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach((user, index) => {
      html += `
        <tr>
          <td style="border:1px solid black; padding:5px;">${index + 1}</td>
          <td style="border:1px solid black; padding:5px;">${user.name}</td>
          <td style="border:1px solid black; padding:5px;">${user.phone}</td>
          <td style="border:1px solid black; padding:5px;">${user.myReferralCode}</td>
          <td style="border:1px solid black; padding:5px;">${user.totalReferrals}</td>
          <td style="border:1px solid black; padding:5px;">
            ${user.referredUsers.length > 0 ? user.referredUsers
              .map(
                (r) => `${r.name} (${r.phone}) - ${new Date(r.joinedAt).toLocaleDateString()}`
              )
              .join(", ") : "None"}
          </td>
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
    

  // 🔹 Pagination States
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(50);

// 🔹 Total pages
const totalPages = Math.ceil(data.length / pageSize);

// 🔹 Paginated data
const paginatedData = data.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

// 🔹 Page size change
const handlePageSizeChange = (e) => {
  setPageSize(Number(e.target.value));
  setCurrentPage(1);
};

  return (
    <div className="p-6 min-h-screen bg-gray-50">

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

      </div>

      <h1 className="text-2xl font-bold mb-4">Admin Referral Dashboard</h1>

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

      {loading && <p>Loading referral data...</p>}

      {!loading && data.length === 0 && <p>No referral data found.</p>}

      {!loading && paginatedData.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200 p-4">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border">User</th>
                <th className="px-3 py-2 border">Phone</th>
                <th className="px-3 py-2 border">Referral Code</th>
                <th className="px-3 py-2 border">Total Referrals</th>
                <th className="px-3 py-2 border">Referred Users</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((user) => (
                <tr key={user.userId} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border">{user.name}</td>
                  <td className="px-3 py-2 border">{user.phone}</td>
                  <td className="px-3 py-2 border">{user.myReferralCode}</td>
                  <td className="px-3 py-2 border">{user.totalReferrals}</td>
                  <td className="px-3 py-2 border">
                    {user.referredUsers.length > 0 ? (
                      <button
                        onClick={() => openModal(user)}
                        className={`px-3 py-1 rounded text-white ${
                          getBadge(user.totalReferrals) === "Silver"
                            ? "bg-gray-400"
                            : getBadge(user.totalReferrals) === "Gold"
                            ? "bg-yellow-500"
                            : "bg-purple-600"
                        }`}
                      >
                        {getBadge(user.totalReferrals)}
                      </button>
                    ) : (
                      "None"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      )}

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

      
        {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg relative">
            <h2 className="text-xl font-bold mb-4">
              {modalData.name} Referred Users
            </h2>
            <button
              className="absolute top-2 right-2 text-red-500 text-lg font-bold"
              onClick={closeModal}
            >
              ×
            </button>
            <div className="max-h-96 overflow-y-auto">
              {modalData.referredUsers.length > 0 ? (
                <ul className="list-disc pl-5">
                  {modalData.referredUsers.map((r, i) => (
                    <li key={i}>
                      {r.name} ({r.phone}) - {new Date(r.joinedAt).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No referred users.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReferral;
