import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const AllStockManagementTable = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate ordered quantity only for approved orders
  const getOrderedQuantity = (product) => {
    return orders.reduce((acc, order) => {
      if (order.status === "approved") {
        order.products.forEach((p) => {
          if (p.title === product.title) {
            acc += p.quantity || 1;
          }
        });
      }
      return acc;
    }, 0);
  };

  // PAGINATION STATES
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(50);

// TOTAL pages
const totalPages = Math.ceil(products.length / pageSize);

// Handle page-size change
const handlePageSizeChange = (e) => {
  setPageSize(Number(e.target.value));
  setCurrentPage(1);
};

// Paginated Data
const paginatedProducts = products.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);



  // Helper to truncate title
const truncateTitle = (title, maxWords = 5) => {
  const words = title.split(" ");
  if (words.length <= maxWords) return title;
  return words.slice(0, maxWords).join(" ") + "...";
};

  /* --------------------------
       EXPORT PDF
    --------------------------- */
   /* --------------------------
   EXPORT PDF
--------------------------- */
const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text("Stock Management Report", 14, 10);

  const tableRows = products.map((product, index) => [
    index + 1,
    product.categoryName,
    truncateTitle(product.title, 5),
    product.ProductPrice || product.productPrice,
    product.stock,
    getOrderedQuantity(product),
    (product.stock || 0) - getOrderedQuantity(product),
  ]);

  autoTable(doc, {
    head: [["Id", "Category", "Title", "Price", "Total Stock", "Approved Orders", "Remaining Stock"]],
    body: tableRows,
    startY: 20,
    styles: { fontSize: 10, halign: "left" },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    columnStyles: { 2: { cellWidth: 60 } }, // title column width
  });

  doc.save("stock_management_report.pdf");
};

/* --------------------------
   EXPORT EXCEL
--------------------------- */
const exportToExcel = () => {
  const worksheetData = products.map((product, index) => ({
    Id: index + 1,
    Category: product.categoryName,
    Title: truncateTitle(product.title, 5),
    Price: product.ProductPrice || product.productPrice,
    "Total Stock": product.stock,
    "Approved Orders": getOrderedQuantity(product),
    "Remaining Stock": (product.stock || 0) - getOrderedQuantity(product),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  worksheet["!cols"] = [
    { wpx: 50 }, { wpx: 150 }, { wpx: 200 }, { wpx: 80 }, { wpx: 80 }, { wpx: 100 }, { wpx: 100 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Management");
  XLSX.writeFile(workbook, "stock_management_report.xlsx", { compression: true });
};

/* --------------------------
   EXPORT CSV
--------------------------- */
const exportToCSV = () => {
  const worksheetData = products.map((product, index) => ({
    Id: index + 1,
    Category: product.categoryName,
    Title: truncateTitle(product.title, 5),
    Price: product.ProductPrice || product.productPrice,
    "Total Stock": product.stock,
    "Approved Orders": getOrderedQuantity(product),
    "Remaining Stock": (product.stock || 0) - getOrderedQuantity(product),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "stock_management_report.csv";
  a.click();

  URL.revokeObjectURL(url);
};

/* --------------------------
   PRINT TABLE
--------------------------- */
const printAllUsersTable = () => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  let html = `
    <h2>Stock Management Report</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
      <thead>
        <tr>
          <th style="border: 1px solid black; padding: 5px; background-color: #f2f2f2;">Id</th>
          <th style="border: 1px solid black; padding: 5px; background-color: #f2f2f2;">Category</th>
          <th style="border: 1px solid black; padding: 5px; background-color: #f2f2f2;">Title</th>
          <th style="border: 1px solid black; padding: 5px; background-color: #f2f2f2;">Price</th>
          <th style="border: 1px solid black; padding: 5px; background-color: #f2f2f2;">Total Stock</th>
          <th style="border: 1px solid black; padding: 5px; background-color: #f2f2f2;">Approved Orders</th>
          <th style="border: 1px solid black; padding: 5px; background-color: #f2f2f2;">Remaining Stock</th>
        </tr>
      </thead>
      <tbody>
  `;

  products.forEach((product, index) => {
    const orderedQty = getOrderedQuantity(product);
    const remainingStock = (product.stock || 0) - orderedQty;

    html += `
      <tr>
        <td style="border: 1px solid black; padding: 5px;">${index + 1}</td>
        <td style="border: 1px solid black; padding: 5px;">${product.categoryName}</td>
        <td style="border: 1px solid black; padding: 5px;">${truncateTitle(product.title, 5)}</td>
        <td style="border: 1px solid black; padding: 5px;">${product.ProductPrice || product.productPrice}</td>
        <td style="border: 1px solid black; padding: 5px;">${product.stock}</td>
        <td style="border: 1px solid black; padding: 5px;">${orderedQty}</td>
        <td style="border: 1px solid black; padding: 5px;">${remainingStock}</td>
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
    <div className="p-6 bg-gray-50 min-h-screen">

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

      
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Stock Management</h1>

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

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved Orders</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Warning</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProducts.map((product) => {
              const orderedQty = getOrderedQuantity(product);
              const remainingStock = (product.stock || 0) - orderedQty;
              const isLowStock = remainingStock <= 5;

              return (
                <tr
                  key={product._id}
                  className={`hover:bg-gray-50 ${isLowStock ? "bg-red-100" : ""}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{product.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product.categoryName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">${product.ProductPrice || product.productPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{orderedQty}</td>
                  <td className={`px-6 py-4 whitespace-nowrap font-semibold ${remainingStock > 0 ? "text-green-600" : "text-red-600"}`}>
                    {remainingStock >= 0 ? remainingStock : 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-600 font-bold">
                    {isLowStock ? "⚠️ Low Stock" : ""}
                  </td>
                </tr>
              );
            })}
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
    </div>
  );
};

export default AllStockManagementTable;
