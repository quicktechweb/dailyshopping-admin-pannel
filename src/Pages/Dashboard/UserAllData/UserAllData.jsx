"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const UserAllData = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedUserOrders, setSelectedUserOrders] = useState(null);
   // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  

  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`https://dailyshopping-backend.onrender.com/api/auth/alluser`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`https://dailyshopping-backend.onrender.com/api/orders`);
      const data = await res.json();
      setAllOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!searchEmail.trim()) setFilteredUsers(users);
    else {
      const term = searchEmail.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            (u.email || "").toLowerCase().includes(term) ||
            (u.phoneNumber || "").includes(term)
        )
      );
       setCurrentPage(1); // reset page on search
    }
  }, [searchEmail, users]);

  // --- Pagination Helper ---
  const paginateData = (data) => {
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  };

  const totalPages = (data) => Math.ceil(data.length / rowsPerPage);

 const handleBlockUser = async (user) => {
  // Check if user has balance
  if (user.walletBalance && user.walletBalance > 0) {
    alert(
      `Cannot block this user. User has ৳${user.walletBalance} in wallet. Blocking users with balance is not allowed.`
    );
    return;
  }

  if (!window.confirm("Are you sure you want to block this user?")) return;

  setLoading(true);
  try {
    const res = await fetch(
      `https://dailyshopping-backend.onrender.com/api/auth/blockuser/${user.phoneNumber}`,
      { method: "PATCH" }
    );
    const data = await res.json();
    if (data.success) {
      alert("User blocked successfully!");
      fetchUsers();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Error blocking user");
  }
  setLoading(false);
};


  const handleUnblockUser = async (phoneNumber) => {
    if (!window.confirm("Are you sure you want to unblock this user?")) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://dailyshopping-backend.onrender.com/api/auth/unblockuser/${phoneNumber}`,
        { method: "PATCH" }
      );
      const data = await res.json();
      if (data.success) {
        alert("User unblocked successfully!");
        fetchUsers();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error unblocking user");
    }
    setLoading(false);
  };

  const handleViewOrders = (userAuth) => {
    const userOrders = allOrders.filter((o) => o.userAuth === userAuth);
    setSelectedUserOrders({ userAuth, orders: userOrders });
  };

  /* --------------------------
        EXPORT EXCEL
  --------------------------- */
 /* --------------------------
    EXPORT PDF
--------------------------- */
const exportPDF = (ordersData = null) => {
  const doc = new jsPDF();

  if (!ordersData) {
    // Users Table
    doc.text("All Users", 14, 10);

    const tableRows = filteredUsers.map(u => [
      u.displayName || "N/A",
      u.phoneNumber || "N/A",
      u.email || "N/A",
      u.role || "User",
      u.status || "active",
    ]);

    autoTable(doc, {
      head: [["Name", "Phone", "Email", "Role", "Status"]],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
    });

    doc.save("users.pdf");
  } else {
    // Orders Table
    doc.text(`${ordersData.userAuth} Orders`, 14, 10);

    const tableRows = ordersData.orders.map(o => [
      o.phoneNumber || ordersData.userAuth,
      o.email || ordersData.userAuth,
      o.products.map(p => p.title).join(", "),
      o.totals.quantity,
      o.totals.grandtotal,
      o.orderPayment || "unpaid",
      o.status,
      new Date(o.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [["Phone", "Email", "Product", "Qty", "Price", "Payment Status", "Order Status", "Date"]],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
    });

    doc.save(`${ordersData.userAuth}_orders.pdf`);
  }
};

/* --------------------------
    EXPORT EXCEL
--------------------------- */
const exportExcel = (ordersData = null) => {
  if (!ordersData) {
    const worksheetData = filteredUsers.map(u => ({
      Name: u.displayName || "N/A",
      Phone: u.phoneNumber || "N/A",
      Email: u.email || "N/A",
      Role: u.role || "User",
      Status: u.status || "active",
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  } else {
    const worksheetData = ordersData.orders.map(o => ({
      Phone: o.phoneNumber || ordersData.userAuth,
      Email: o.email || ordersData.userAuth,
      Product: o.products.map(p => p.title).join(", "),
      Qty: o.totals.quantity,
      Price: o.totals.grandtotal,
      Payment_Status: o.orderPayment || "unpaid",
      Order_Status: o.status,
      Date: new Date(o.createdAt).toLocaleDateString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, `${ordersData.userAuth}_orders.xlsx`);
  }
};

/* --------------------------
    EXPORT CSV
--------------------------- */
const exportCSV = (ordersData = null) => {
  if (!ordersData) {
    const worksheetData = filteredUsers.map(u => ({
      Name: u.displayName || "N/A",
      Phone: u.phoneNumber || "N/A",
      Email: u.email || "N/A",
      Role: u.role || "User",
      Status: u.status || "active",
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  } else {
    const worksheetData = ordersData.orders.map(o => ({
      Phone: o.phoneNumber || ordersData.userAuth,
      Email: o.email || ordersData.userAuth,
      Product: o.products.map(p => p.title).join(", "),
      Qty: o.totals.quantity,
      Price: o.totals.grandtotal,
      Payment_Status: o.orderPayment || "unpaid",
      Order_Status: o.status,
      Date: new Date(o.createdAt).toLocaleDateString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ordersData.userAuth}_orders.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

/* --------------------------
    PRINT TABLE
--------------------------- */
const printTable = (ordersData = null) => {
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;

  let html = "<html><head><title>Print</title><style>table{width:100%;border-collapse:collapse;}th,td{border:1px solid black;padding:5px;text-align:left;}th{background:#f2f2f2;}</style></head><body>";

  if (!ordersData) {
    html += "<h2>All Users</h2>";
    html += "<table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Role</th><th>Status</th></tr></thead><tbody>";
    filteredUsers.forEach(u => {
      html += `<tr>
        <td>${u.displayName || "N/A"}</td>
        <td>${u.phoneNumber || "N/A"}</td>
        <td>${u.email || "N/A"}</td>
        <td>${u.role || "User"}</td>
        <td>${u.status || "active"}</td>
      </tr>`;
    });
    html += "</tbody></table>";
  } else {
    html += `<h2>${ordersData.userAuth} Orders</h2>`;
    html += "<table><thead><tr><th>Phone</th><th>Email</th><th>Product</th><th>Qty</th><th>Price</th><th>Payment Status</th><th>Order Status</th><th>Date</th></tr></thead><tbody>";
    ordersData.orders.forEach(o => {
      html += `<tr>
        <td>${o.phoneNumber || ordersData.userAuth}</td>
        <td>${o.email || ordersData.userAuth}</td>
        <td>${o.products.map(p => p.title).join(", ")}</td>
        <td>${o.totals.quantity}</td>
        <td>৳ ${o.totals.grandtotal}</td>
        <td>${o.orderPayment || "unpaid"}</td>
        <td>${o.status}</td>
        <td>${new Date(o.createdAt).toLocaleDateString()}</td>
      </tr>`;
    });
    html += "</tbody></table>";
  }

  html += "</body></html>";

  doc.open();
  doc.write(html);
  doc.close();

  iframe.contentWindow.focus();
  iframe.contentWindow.print();
  document.body.removeChild(iframe);
};



 /* --------------------------
    EXPORT CSV (UPDATED)
--------------------------- */



  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h2 className="text-2xl font-bold text-center mb-6">All Users</h2>

      {/* TOP BUTTONS */}
  <div className="flex flex-wrap gap-3 mb-4">
  <button onClick={() => exportPDF()} className="bg-red-600 text-white px-4 py-2 rounded">PDF</button>
  <button onClick={() => exportExcel()} className="bg-green-600 text-white px-4 py-2 rounded">Excel</button>
  <button onClick={() => exportCSV()} className="bg-yellow-600 text-white px-4 py-2 rounded">CSV</button>
  <button onClick={() => printTable()} className="bg-blue-600 text-white px-4 py-2 rounded">Print</button>
</div>



      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email or phone"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="flex items-center gap-2 mb-2">
  <label className="text-sm font-medium text-gray-700">Rows per page:</label>
  <select
    className="border rounded px-2 py-1"
    value={rowsPerPage}
    onChange={(e) => {
      setRowsPerPage(Number(e.target.value));
      setCurrentPage(1); // page reset on change
    }}
  >
    <option value={50}>50</option>
    <option value={70}>70</option>
    <option value={90}>90</option>
    <option value={100}>100</option>
    <option value={150}>150</option>
  </select>
</div>


      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300 bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="text-black">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginateData(filteredUsers).length > 0 ? (
              paginateData(filteredUsers).map((user) =>(
                <tr
                  key={user._id}
                  className="hover:bg-gray-700 hover:text-white transition-all"
                >
                  <td className="border px-4 py-2">{user.displayName || "N/A"}</td>
                  <td className="border px-4 py-2">{user.phoneNumber}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role || "User"}</td>
                  <td className="border px-4 py-2">{user.status || "active"}</td>

                  <td className="border px-4 py-2 space-x-2 flex flex-wrap">
                    <button
                      onClick={() => handleViewOrders(user.email)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                    >
                      View Orders
                    </button>

                   {user.status === "blocked" ? (
  <button
    onClick={() => handleUnblockUser(user.phoneNumber)}
    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
    disabled={loading}
  >
    Unblock
  </button>
) : (
  <button
    onClick={() => handleBlockUser(user)}
    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
    disabled={loading}
  >
    Block
  </button>
)}

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {totalPages(filteredUsers) > 1 && (
  <div className="flex justify-center items-center gap-2 mt-2 py-2">
    <button
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(prev => prev - 1)}
    >
      Prev
    </button>
    <span>
      Page {currentPage} of {totalPages(filteredUsers)}
    </span>
    <button
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      disabled={currentPage === totalPages(filteredUsers)}
      onClick={() => setCurrentPage(prev => prev + 1)}
    >
      Next
    </button>
  </div>
)}

      </div>

      {/* Modal */}
   {/* Modal */}
{selectedUserOrders && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black bg-opacity-50"
      onClick={() => setSelectedUserOrders(null)}
    />
    <div className="relative bg-white p-6 w-11/12 max-w-4xl rounded-lg overflow-y-auto max-h-[90vh]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          {selectedUserOrders.userAuth} Orders
        </h3>
        <button
          className="text-red-500 font-bold text-2xl hover:text-red-700"
          onClick={() => setSelectedUserOrders(null)}
        >
          &times;
        </button>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => exportPDF(selectedUserOrders)}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          PDF
        </button>
        <button
          onClick={() => exportExcel(selectedUserOrders)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Excel
        </button>
        <button
          onClick={() => exportCSV(selectedUserOrders)}
          className="bg-yellow-600 text-white px-4 py-2 rounded"
        >
          CSV
        </button>
        <button
          onClick={() => printTable(selectedUserOrders)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Print
        </button>
      </div>

      {/* Orders Table */}
      <table className="table-auto w-full border border-gray-300 bg-white rounded-lg shadow-lg">
        <thead>
          <tr>
            <th className="px-3 py-2 border">Phone</th>
            <th className="px-3 py-2 border">Email</th>
            <th className="px-3 py-2 border">Product</th>
            <th className="px-3 py-2 border">Qty</th>
            <th className="px-3 py-2 border">Price</th>
            <th className="px-3 py-2 border">Payment Status</th>
            <th className="px-3 py-2 border">Order Status</th>
            <th className="px-3 py-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {selectedUserOrders.orders.length > 0 ? (
            selectedUserOrders.orders.map((order) => (
              <tr key={order._id}>
                <td className="px-3 py-2 border">{order.phoneNumber || selectedUserOrders.userAuth}</td>
                <td className="px-3 py-2 border">{order.email || selectedUserOrders.userAuth}</td>
                <td className="px-3 py-2 border">{order.products.map((p) => p.title).join(", ")}</td>
                <td className="px-3 py-2 border">{order.totals.quantity}</td>
                <td className="px-3 py-2 border">৳ {order.totals.grandtotal}</td>
                <td className="px-3 py-2 border">{order.orderPayment || "unpaid"}</td>
                <td className="px-3 py-2 border">{order.status}</td>
                <td className="px-3 py-2 border">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-2">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}


    </div>
  );
};

export default UserAllData;
