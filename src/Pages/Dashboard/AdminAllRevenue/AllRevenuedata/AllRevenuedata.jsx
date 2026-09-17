import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { FaCashRegister, FaChartLine, FaMoneyBillWave, FaShoppingCart, FaTicketAlt } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import axiosInstance from "../../../../utils/axiosInstance";
const AllRevenuedata = () => {
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showTable, setShowTable] = useState(null);
 console.log(loading)
  // New filter states
  // const [filterType, setFilterType] = useState("daily"); 
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Raw data state
  const [rawOrders, setRawOrders] = useState([]);
  const [rawCoupons, setRawCoupons] = useState([]);
  const [rawExpenses, setRawExpenses] = useState([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [rowsPerPage, setRowsPerPage] = useState(50);

  // const rowsPerPage = 50;

  // Helper function to paginate any data array
  const paginateData = (data) => {
  const start = (currentPage - 1) * rowsPerPage;
  return data.slice(start, start + rowsPerPage);
};


  // Helper to get total pages
  const totalPages = (data) => Math.ceil(data.length / rowsPerPage);

  // Reset page when table changes
  // const handleTableChange = () => setCurrentPage(1);

  // // Get active data for pagination controls
  // const getActiveDatas = () => {
  //   if (showTable === "orders") return orders;
  //   if (showTable === "coupons") return coupons;
  //   if (showTable === "profit") return allProfits;
  //   if (showTable === "expenses") return expenses;
  //   return [];
  // };



  
  
  


  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/orders");
      setOrders(res.data || []);
      setRawOrders(res.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch orders", "error");
    }
  };

  // Fetch Coupons
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://dailyshopping-backend.onrender.com/api/coupons");
      const data = await res.json();
      if (data.success) {
        const sorted = (data.coupons || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCoupons(sorted);
        setRawCoupons(sorted);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // Fetch Expenses
  const fetchExpenses = async () => {
    try {
      const res = await axiosInstance.get("/expenses");
      setExpenses(res.data || []);
      setRawExpenses(res.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch expenses", "error");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCoupons();
    fetchExpenses();
  }, []);

   // -------------------------
  // Filtering Logic
  // -------------------------
 // -------------------------
// Filtering Logic (Updated)
// -------------------------
// -------------------------
// Filtering Logic (UPDATED)
// -------------------------
useEffect(() => {
  // Auto load only today's data initially
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const formatted = `${yyyy}-${mm}-${dd}`;

  setStartDate(formatted);
  setEndDate(formatted);

  applyFilter(formatted, formatted);
}, [rawOrders, rawCoupons, rawExpenses]);


// Main Filter Function
const applyFilter = () => {
  // কোনো date সিলেক্ট না করলে error
  if (!startDate && !endDate) {
    // Swal.fire("Please select a start or end date");
    return;
  }

  // যদি শুধু Start date দেওয়া হয় → End date = Start date হবে
  const start = new Date(startDate || endDate);
  start.setHours(0, 0, 0, 0);

  // যদি শুধু End date দেওয়া হয় → Start date = End date হবে
  const end = new Date(endDate || startDate);
  end.setHours(23, 59, 59, 999);

  // Filter function
  const filterByDate = (data, field) => {
    return data.filter((item) => {
      const dt = new Date(item[field]);
      return dt >= start && dt <= end;
    });
  };

  // Apply filters
  setOrders(filterByDate(rawOrders, "createdAt"));
  setCoupons(filterByDate(rawCoupons, "createdAt"));
  setExpenses(filterByDate(rawExpenses, "date"));

  // Pagination reset
  setCurrentPage(1);
};



const showAllData = () => {
  setOrders(rawOrders);
  setCoupons(rawCoupons);
  setExpenses(rawExpenses);

  // Date fields clear
  setStartDate("");
  setEndDate("");

  setCurrentPage(1);
};




  // -------------------------
  // Totals
  // -------------------------
  const totalProductCount = orders.reduce((acc, o) => acc + o?.totals?.quantity, 0);
  const totalProductPrice = orders.reduce((acc, o) => acc + o?.totals?.grandtotal, 0);

  const totalCouponCount = coupons.length;
  const totalCouponPrice = coupons.reduce((acc, c) => acc + c.price, 0);

  const grandTotal = totalProductPrice + totalCouponPrice;

  // Profit calculation
  const allProfits = [];
  orders.forEach((order) => {
    order.products.forEach((p) => {
      if (p.purchasePrice != null) {
        const profitAmount = p.ProductPrice - parseFloat(p.purchasePrice);
        const profitPercent = (
          (profitAmount / parseFloat(p.purchasePrice)) *
          100
        ).toFixed(2);
        allProfits.push({
          product: p.title,
          purchasePrice: parseFloat(p.purchasePrice),
          salePrice: p.ProductPrice,
          img: p.img,
          profitAmount,
          profitPercent,
          date: order.createdAt,
        });
      }
    });
  });

  const totalProfit = allProfits.reduce((acc, p) => acc + p.profitAmount, 0);

  // Expense total
  const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Net Revenue
  const netRevenue = totalProfit - totalExpense;


    // --------------------------
  // Export Summary Functions
  // --------------------------
  // ------------------ Individual Card Data ------------------
// Products
const productData = orders.map((o, i) => ({
  "#": i + 1,
  Customer: o.customer?.name,
  Phone: o.customer?.phone,
  Quantity: o?.totals?.quantity,
  "Grand Total": o?.totals?.grandtotal,
  "Payment ID": o.paymentId,
  Date: new Date(o.createdAt).toLocaleString(),
}));

const couponData = coupons.map((c, i) => ({
  "#": i + 1,
  Product: c.productName,
  Price: c.price,
  "User Phone": c.userPhone,
  "Coupon ID": c.couponId,
  Date: new Date(c.createdAt).toLocaleString(),
}));

const profitData = allProfits.map((p, i) => ({
  "#": i + 1,
  Product: p.product,
  Image: p.img,
  "Purchase Price": p.purchasePrice,
  "Sale Price": p.salePrice,
  Profit: p.profitAmount,
  "Profit %": p.profitPercent,
  Date: new Date(p.date).toLocaleString(),
}));

const expenseData = expenses.map((e, i) => ({
  "#": i + 1,
  Category: e.category,
  Title: e.title,
  Amount: e.amount,
  Date: new Date(e.date).toLocaleDateString(),
}));


const getActiveData = () => {
  switch (showTable) {
    case "orders":
      return { data: productData, title: "Products Report" };
    case "coupons":
      return { data: couponData, title: "Coupons Report" };
    case "profit":
      return { data: profitData, title: "Profit Report" };
    case "expenses":
      return { data: expenseData, title: "Expenses Report" };
    default:
      return { data: [], title: "Report" };
  }
};



 // Generic Export Functions
const exportToPDF = () => {
  const { data, title } = getActiveData();
  if (!data.length) return;
  const doc = new jsPDF();
  doc.text(title, 14, 10);
  autoTable(doc, {
    head: [Object.keys(data[0])],
    body: data.map((d) => Object.values(d)),
    startY: 20,
  });
  doc.save(`${title}.pdf`);
};

const exportToExcel = () => {
  const { data, title } = getActiveData();
  if (!data.length) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title);
  XLSX.writeFile(workbook, `${title}.xlsx`);
};

const exportToCSV = () => {
  const { data, title } = getActiveData();
  if (!data.length) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const printData = () => {
  const { data, title } = getActiveData();
  if (!data.length) return;
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  let html = `<h2>${title}</h2><table border="1" style="border-collapse: collapse; width: 100%;"><thead><tr>`;
  Object.keys(data[0] || {}).forEach((k) => {
    html += `<th style="padding:5px">${k}</th>`;
  });
  html += "</tr></thead><tbody>";
  data.forEach((row) => {
    html += "<tr>";
    Object.values(row).forEach((val) => {
      html += `<td style="padding:5px">${val}</td>`;
    });
    html += "</tr>";
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
    <div className="p-6 bg-gray-50  ">
      {/* <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Revenue & Profit Dashboard
      </h1> */}
       <div className="mb-10">
        {showTable && (
  <div className="flex flex-wrap gap-2 mb-3">
    <button
      onClick={exportToPDF}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      PDF
    </button>
    <button
      onClick={exportToExcel}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Excel
    </button>
    <button
      onClick={exportToCSV}
      className="bg-yellow-600 text-white px-4 py-2 rounded"
    >
      CSV
    </button>
    <button
      onClick={printData}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Print
    </button>
  </div>
)}

       </div>


       {/* ---------------- Filter Section ---------------- */}
      <div className=" p-4 rounded-xl -mt-10  mb-6 flex flex-wrap items-end gap-4">
  {/* Dropdown */}
  {/* <div>
    <label className="text-sm font-medium text-gray-700">Filter Type</label>
    <select
      className="ml-2 border rounded-lg px-3 py-2"
      value={filterType}
      onChange={(e) => setFilterType(e.target.value)}
    >
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
    </select>
  </div> */}

  {/* Start Date */}
  <div>
    <label className="text-sm font-medium text-gray-700">Start Date</label>
    <input
      type="date"
      className="ml-2 border rounded-lg px-3 py-2"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
    />
  </div>

  {/* End Date */}
  <div>
    <label className="text-sm font-medium text-gray-700">End Date</label>
    <input
      type="date"
      className="ml-2 border rounded-lg px-3 py-2"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
    />
  </div>

  {/* Apply Button */}
  <button
    onClick={applyFilter}
    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
  >
    Apply Filter
  </button>

  <button
  className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-3"
  onClick={showAllData}
>
  All
</button>

</div>


      {/* Top Cards: Sales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 -mt-4">
        {/* Orders */}
       <div
  className="bg-white p-6 rounded-2xl shadow-[0_2px_18px_rgba(0,0,0,0.15)] border border-gray-100
             hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
  onClick={() => setShowTable(showTable === "orders" ? null : "orders")}
>
  <div className="flex items-center gap-4">
    {/* Icon Box */}
    <div className="p-3 rounded-xl bg-green-100 text-green-600">
      <FaShoppingCart className="text-2xl" />
    </div>

    {/* Text Info */}
    <div className="flex-1 text-left">
      <p className="text-gray-500 text-sm font-medium">Total Products Sold</p>
      <p className="text-2xl font-extrabold text-gray-900">{totalProductCount}</p>
      <p className="text-green-600 text-xl font-extrabold">
        ৳ {totalProductPrice.toFixed(2)}
      </p>
    </div>
  </div>

  {/* Bottom Progress Bar */}
  <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-2 bg-green-500 rounded-full transition-all duration-500"
      style={{ width: `${Math.min((totalProductCount / 100) * 100, 100)}%` }}
    ></div>
  </div>
</div>

        {/* Coupons */}
       <div
  className="bg-white p-6 rounded-2xl shadow-[0_2px_18px_rgba(0,0,0,0.15)] border border-gray-100
             hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
  onClick={() => setShowTable(showTable === "coupons" ? null : "coupons")}
>
  <div className="flex items-center gap-4">
    {/* Icon Box */}
    <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
      <FaTicketAlt className="text-2xl" />
    </div>

    {/* Text Info */}
    <div className="flex-1 text-left">
      <p className="text-gray-500 text-sm font-medium">Total Coupons Sold</p>
      <p className="text-2xl font-extrabold text-gray-900">{totalCouponCount}</p>
      <p className="text-green-600 text-xl font-extrabold ">
        ৳ {totalCouponPrice.toFixed(2)}
      </p>
    </div>
  </div>

  {/* Bottom Progress Bar */}
  <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-2 bg-blue-500 rounded-full transition-all duration-500"
      style={{ width: `${Math.min((totalCouponCount / 100) * 100, 100)}%` }}
    ></div>
  </div>
</div>

        {/* Grand Total */}
       <div
  className="bg-white p-6 rounded-2xl shadow-[0_2px_18px_rgba(0,0,0,0.15)] border border-gray-100
             hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
>
  <div className="flex items-center gap-4">
    {/* Icon Box */}
    <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
      <FaMoneyBillWave className="text-2xl" />
    </div>

    {/* Text Info */}
    <div className="flex-1 text-left">
      <p className="text-gray-500 text-sm font-medium">Grand Total Sell</p>
      <p className="text-2xl font-extrabold text-gray-900">
        ৳ {grandTotal?.toFixed(2)}
      </p>
    </div>
  </div>

  {/* Bottom Progress Bar */}
  <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-2 bg-purple-500 rounded-full transition-all duration-500"
      style={{ width: "100%" }} // Grand total ke full progress bar diye highlight
    ></div>
  </div>
</div>
      </div>

      {/* Bottom Cards: Profit, Expense, Net Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Profit */}
     <div
  className="bg-white p-6 rounded-2xl shadow-[0_2px_18px_rgba(0,0,0,0.15)] border border-gray-100
             hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
  onClick={() => setShowTable(showTable === "profit" ? null : "profit")}
>
  <div className="flex items-center gap-4">
    {/* Icon Box */}
    <div className="p-3 rounded-xl bg-green-100 text-green-600">
      <FaChartLine className="text-2xl" />
    </div>

    {/* Text Info */}
    <div className="flex-1 text-left">
      <p className="text-gray-500 text-sm font-medium">Total Profit</p>
      <p className="text-xl font-bold text-gray-900">{allProfits.length}</p>
      <p className="text-green-600 text-xl font-extrabold">
        ৳ {totalProfit.toFixed(2)}
      </p>
    </div>
  </div>

  {/* Bottom Progress Bar */}
  <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-2 bg-green-500 rounded-full transition-all duration-500"
      style={{ width: "100%" }} // Full width highlight
    ></div>
  </div>
</div>
        {/* Expense */}
       <div
  className="bg-white p-6 rounded-2xl shadow-[0_2px_18px_rgba(0,0,0,0.15)] border border-gray-100
             hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
  onClick={() =>
    setShowTable(showTable === "expenses" ? null : "expenses")
  }
>
  <div className="flex items-center gap-4">
    {/* Icon Box */}
    <div className="p-3 rounded-xl bg-red-100 text-red-600">
      <FaMoneyBillWave className="text-2xl" />
    </div>

    {/* Text Info */}
    <div className="flex-1 text-left">
      <p className="text-gray-500 text-sm font-medium">Total Expenses</p>
      <p className="text-xl font-bold text-gray-900">{expenses.length}</p>
      <p className="text-red-600  text-xl font-extrabold">
        ৳ {totalExpense.toFixed(2)}
      </p>
    </div>
  </div>

  {/* Bottom Progress Bar */}
  <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-2 bg-red-500 rounded-full transition-all duration-500"
      style={{ width: "100%" }} // Full width highlight
    ></div>
  </div>
</div>

        {/* Net Revenue */}
       <div
  className="bg-white p-6 rounded-2xl shadow-[0_2px_18px_rgba(0,0,0,0.15)] border border-gray-100
             hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
  onClick={() => setShowTable(showTable === "revenue" ? null : "revenue")}
>
  <div className="flex items-center gap-4">
    {/* Icon Box */}
    <div className="p-3 rounded-xl bg-green-100 text-green-600">
      <FaCashRegister className="text-2xl" />
    </div>

    {/* Text Info */}
    <div className="flex-1 text-left">
      <p className="text-gray-500 text-sm font-medium">Net Revenue</p>
      <p className="text-green-600 text-xl font-extrabold">
        ৳ {netRevenue.toFixed(2)}
      </p>
    </div>
  </div>

  {/* Bottom Progress Bar */}
  <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-2 bg-green-500 rounded-full transition-all duration-500"
      style={{ width: "100%" }}
    ></div>
  </div>
</div>

      </div>

      {/* Orders Table */}
    {showTable === "orders" && (
  <div className="mb-40">
    <h2 className="text-xl font-bold text-gray-800 mb-2">Orders</h2>

    {/* Rows per page dropdown */}
    <div className="flex items-center gap-2 mb-2">
      <label className="text-sm font-medium text-gray-700">Rows per page:</label>
      <select
        className="border rounded px-2 py-1"
        value={rowsPerPage}
        onChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setCurrentPage(1); // page reset
        }}
      >
        <option value={50}>50</option>
        <option value={70}>70</option>
        <option value={90}>90</option>
        <option value={100}>100</option>
        <option value={150}>150</option>
      </select>
    </div>

    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Customer</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Grand Total</th>
            <th className="px-4 py-2">Payment ID</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {paginateData(orders).map((order, i) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{(currentPage - 1) * rowsPerPage + i + 1}</td>
              <td className="px-4 py-2">{order.customer?.name}</td>
              <td className="px-4 py-2">{order.customer?.phone}</td>
              <td className="px-4 py-2">{order?.totals?.quantity}</td>
              <td className="px-4 py-2">৳ {order?.totals?.grandtotal}</td>
              <td className="px-4 py-2">{order.paymentId}</td>
              <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages(orders) > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2 py-2 border-t border-gray-200">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>Page {currentPage} of {totalPages(orders)}</span>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages(orders)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  </div>
)}



      {/* Coupons Table */}
     {/* Coupons Table */}
{showTable === "coupons" && (
  <div className="mb-40">
    <h2 className="text-xl font-bold text-gray-800 mb-2">Coupon Purchases</h2>

    {/* Rows per page dropdown */}
    <div className="flex items-center gap-2 mb-2">
      <label className="text-sm font-medium text-gray-700">Rows per page:</label>
      <select
        className="border rounded px-2 py-1"
        value={rowsPerPage}
        onChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setCurrentPage(1); // page reset
        }}
      >
        <option value={50}>50</option>
        <option value={70}>70</option>
        <option value={90}>90</option>
        <option value={100}>100</option>
        <option value={150}>150</option>
      </select>
    </div>

    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">User Phone</th>
            <th className="px-4 py-2">Coupon ID</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {paginateData(coupons).map((coupon, i) => (
            <tr key={coupon._id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{(currentPage - 1) * rowsPerPage + i + 1}</td>
              <td className="px-4 py-2">{coupon.productName}</td>
              <td className="px-4 py-2">৳ {coupon.price}</td>
              <td className="px-4 py-2">{coupon.userPhone}</td>
              <td className="px-4 py-2">{coupon.couponId}</td>
              <td className="px-4 py-2">{new Date(coupon.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages(coupons) > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2 py-2 border-t border-gray-200">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>Page {currentPage} of {totalPages(coupons)}</span>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages(coupons)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  </div>
)}


{/* Profit Table */}
{showTable === "profit" && (
  <div className="mb-40">
    <h2 className="text-xl font-bold text-gray-800 mb-2">Profit Details</h2>

    {/* Rows per page dropdown */}
    <div className="flex items-center gap-2 mb-2">
      <label className="text-sm font-medium text-gray-700">Rows per page:</label>
      <select
        className="border rounded px-2 py-1"
        value={rowsPerPage}
        onChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setCurrentPage(1); // Reset page
        }}
      >
        <option value={50}>50</option>
        <option value={70}>70</option>
        <option value={90}>90</option>
        <option value={100}>100</option>
        <option value={150}>150</option>
      </select>
    </div>

    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Purchase Price</th>
            <th className="px-4 py-2">Sale Price</th>
            <th className="px-4 py-2">Profit</th>
            <th className="px-4 py-2">Profit %</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {paginateData(allProfits).map((p, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-4 py-2">{(currentPage - 1) * rowsPerPage + i + 1}</td>
              <td className="px-4 py-2">{p.product}</td>
              <td className="px-4 py-2">
                <img className="h-10 w-10" src={p.img} alt={p.product} />
              </td>
              <td className="px-4 py-2">৳ {p.purchasePrice}</td>
              <td className="px-4 py-2">৳ {p.salePrice}</td>
              <td className="px-4 py-2">৳ {p.profitAmount}</td>
              <td className="px-4 py-2">{p.profitPercent}%</td>
              <td className="px-4 py-2">{new Date(p.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages(allProfits) > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2 py-2 border-t border-gray-200">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>Page {currentPage} of {totalPages(allProfits)}</span>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages(allProfits)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  </div>
)}


{/* Expenses Table */}
{showTable === "expenses" && (
  <div className="mb-40">
    <h2 className="text-xl font-bold text-gray-800 mb-2">Expenses</h2>

    {/* Rows per page dropdown */}
    <div className="flex items-center gap-2 mb-2">
      <label className="text-sm font-medium text-gray-700">Rows per page:</label>
      <select
        className="border rounded px-2 py-1"
        value={rowsPerPage}
        onChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setCurrentPage(1); // Reset page
        }}
      >
        <option value={50}>50</option>
        <option value={70}>70</option>
        <option value={90}>90</option>
        <option value={100}>100</option>
        <option value={150}>150</option>
      </select>
    </div>

    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {paginateData(expenses).map((exp, i) => (
            <tr key={exp._id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{(currentPage - 1) * rowsPerPage + i + 1}</td>
              <td className="px-4 py-2">{exp.category}</td>
              <td className="px-4 py-2">{exp.title}</td>
              <td className="px-4 py-2">৳ {exp.amount}</td>
              <td className="px-4 py-2">{new Date(exp.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages(expenses) > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2 py-2 border-t border-gray-200">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>Page {currentPage} of {totalPages(expenses)}</span>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages(expenses)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  </div>
)}



      {/* Pagination Controls */}
     
    </div>
  );
};

export default AllRevenuedata;
