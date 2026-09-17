import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
const ExpenseManager = () => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
const [allExpenses, setAllExpenses] = useState([]);
  const [filters, setFilters] = useState({
    category: "All",
    dateFilter: "Current Month",
    start: "",
    end: "",
  });

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Fetch categories
  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/expense-categories");
    setCategories(res.data);
  };

  // Fetch expenses with filters
 const fetchExpenses = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/expenses");
    setAllExpenses(res.data); // Store all data
    setExpenses(res.data); // Show all data initially
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, []);


  // ADD THESE NEW STATES
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(50);

// TOTAL pages calculate
const totalPages = Math.ceil(expenses.length / pageSize);

// HANDLE page size change
const handlePageSizeChange = (e) => {
  setPageSize(Number(e.target.value));
  setCurrentPage(1); // reset to first page
};

// PAGINATED DATA
const paginatedExpenses = expenses.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

  const handleFilterChange = (e) => {
  const newFilters = { ...filters, [e.target.name]: e.target.value };
  setFilters(newFilters);

  let filtered = [...allExpenses]; // Start from all data

  // Category filter
  if (newFilters.category && newFilters.category !== "All") {
    filtered = filtered.filter((exp) => exp.category === newFilters.category);
  }

  // Date filter
  const now = new Date();
  if (newFilters.dateFilter === "Current Month") {
    filtered = filtered.filter(
      (exp) => {
        const d = new Date(exp.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
    );
  } else if (newFilters.dateFilter === "Current Year") {
    filtered = filtered.filter(
      (exp) => new Date(exp.date).getFullYear() === now.getFullYear()
    );
  }

  // Custom start/end date filter
  if (newFilters.start) {
    filtered = filtered.filter((exp) => new Date(exp.date) >= new Date(newFilters.start));
  }
  if (newFilters.end) {
    filtered = filtered.filter((exp) => new Date(exp.date) <= new Date(newFilters.end));
  }

  setExpenses(filtered); // Show filtered data
};

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.title || !formData.amount) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        category: formData.category,
        title: formData.title,
        amount: Number(formData.amount),
        date: new Date(formData.date),
      };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/expenses/${editingId}`, payload);
      } else {
        await axios.post("http://localhost:5000/api/expenses", payload);
      }

      setFormData({
        category: "",
        title: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
      setEditingId(null);
      setShowForm(false);
      fetchExpenses();
    } catch (error) {
      console.error("Error saving expense:", error.response?.data || error.message);
      alert("Something went wrong. Check console for details.");
    }
  };

  const handleEdit = (exp) => {
    setFormData({
      category: exp.category,
      title: exp.title,
      amount: exp.amount,
      date: exp.date.split("T")[0],
    });
    setEditingId(exp._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      fetchExpenses();
    }
  };

  /* --------------------------
     EXPORT PDF
  --------------------------- */
  const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text("Expenses Report", 14, 10);

  const tableRows = expenses.map((exp, index) => [
    index + 1,
    exp.category,
    exp.title,
    Number(exp.amount).toLocaleString("en-BD"), // formatted without extra alignment
    new Date(exp.date).toLocaleDateString(),
  ]);

  autoTable(doc, {
    head: [["Id", "Category", "Title", "Amount", "Date"]],
    body: tableRows,
    startY: 20,
    styles: { fontSize: 10, halign: "left" }, // all columns left-aligned by default
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    columnStyles: {
      3: { halign: "left" }, // Amount column left-aligned
    },
  });

  doc.save("expenses_report.pdf");
};



  /* --------------------------
     EXPORT EXCEL
  --------------------------- */
  const exportToExcel = () => {
    const worksheetData = expenses.map((exp, index) => ({
      Id: index + 1,
      Category: exp.category,
      Title: exp.title,
      Amount: exp.amount,
      Date: new Date(exp.date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    worksheet["!cols"] = [
      { wpx: 50 }, { wpx: 150 }, { wpx: 200 }, { wpx: 100 }, { wpx: 120 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    XLSX.writeFile(workbook, "expenses_report.xlsx", { compression: true });
  };

  /* --------------------------
     EXPORT CSV
  --------------------------- */
  const exportToCSV = () => {
    const worksheetData = expenses.map((exp, index) => ({
      Id: index + 1,
      Category: exp.category,
      Title: exp.title,
      Amount: exp.amount,
      Date: new Date(exp.date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses_report.csv";
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
    <h2>Expenses Report</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
      <thead>
        <tr>
          <th style="border: 1px solid black; padding: 5px; background-color: #f2f2f2;">Id</th>
          <th style="border: 1px solid black; padding: 5px; background-color: #f2f2f2;">Category</th>
          <th style="border: 1px solid black; padding: 5px; background-color: #f2f2f2;">Title</th>
          <th style="border: 1px solid black; padding: 5px; background-color: #f2f2f2;">Amount</th>
          <th style="border: 1px solid black; padding: 5px; background-color: #f2f2f2;">Date</th>
        </tr>
      </thead>
      <tbody>
  `;

  expenses.forEach((exp, index) => {
    html += `
      <tr>
        <td style="border: 1px solid black; padding: 5px;">${index + 1}</td>
        <td style="border: 1px solid black; padding: 5px;">${exp.category}</td>
        <td style="border: 1px solid black; padding: 5px;">${exp.title}</td>
        <td style="border: 1px solid black; padding: 5px;">৳ ${exp.amount}</td>
        <td style="border: 1px solid black; padding: 5px;">${new Date(exp.date).toLocaleDateString()}</td>
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
    <div className="p-8 bg-gray-100 min-h-screen">

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
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center bg-white p-4 rounded-lg shadow">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          name="dateFilter"
          value={filters.dateFilter}
          onChange={handleFilterChange}
          className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          <option value="Current Month">Current Month</option>
          <option value="Current Year">Current Year</option>
          <option value="All">All</option>
        </select>

        <input
          type="date"
          name="start"
          value={filters.start}
          onChange={handleFilterChange}
          className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <input
          type="date"
          name="end"
          value={filters.end}
          onChange={handleFilterChange}
          className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />

        <button
          className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 shadow"
          onClick={fetchExpenses}
        >
          Apply
        </button>
      </div>

      {/* Manage Expense Table */}

      <div>
    <label className="mr-2 font-semibold">Show:</label>
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



      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Manage Expense</h2>
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 shadow"
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                category: "",
                title: "",
                amount: "",
                date: new Date().toISOString().split("T")[0],
              });
            }}
          >
            {showForm ? "Cancel" : "+ Add"}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              {editingId ? "Edit Expense" : "Add Expense"}
            </h2>
            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Expense Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleFormChange}
                className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleFormChange}
                className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />

              <div className="col-span-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 shadow"
                >
                  {editingId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 border">Id</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedExpenses.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              paginatedExpenses.map((exp, index) => (
                <tr
                  key={exp._id}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border">{exp.category}</td>
                  <td className="px-4 py-2 border">{exp.title}</td>
                  <td className="px-4 py-2 border font-medium text-green-600">
                    ৳ {exp.amount}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 shadow"
                      onClick={() => handleEdit(exp)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 shadow"
                      onClick={() => handleDelete(exp._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

         <div className="flex gap-2 justify-center items-center mt-5">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Prev
    </button>

    <span className="px-3 py-1 font-semibold">
      Page {currentPage} / {totalPages}
    </span>

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((p) => p + 1)}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
      </div>
    </div>
  );
};

export default ExpenseManager;
