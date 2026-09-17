import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  // ✅ Fetch Supplier Data
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/suppliers");
        setSuppliers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSuppliers();
  }, []);

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };


   // Truncate long text to 5 words max
  const truncateText = (text, maxWords = 5) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : text;
  };

  /* -------------------------- EXPORT PDF -------------------------- */
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Supplier List Report", 14, 10);

    const tableRows = suppliers.map((s, i) => [
      i + 1,
      s._id,
      truncateText(s.name),
      s.phone,
      s.email,
      truncateText(s.tradeName),
      s.status,
    ]);

    autoTable(doc, {
      head: [["Sl", "ID", "Supplier Name", "Phone", "Email", "Trade Name", "Status"]],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10, halign: "left" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    doc.save("supplier_list_report.pdf");
  };

  /* -------------------------- EXPORT EXCEL -------------------------- */
  const exportToExcel = () => {
    const worksheetData = suppliers.map((s, i) => ({
      Sl: i + 1,
      ID: s._id,
      "Supplier Name": truncateText(s.name),
      Phone: s.phone,
      Email: s.email,
      "Trade Name": truncateText(s.tradeName),
      Status: s.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    worksheet["!cols"] = [
      { wpx: 40 }, { wpx: 150 }, { wpx: 150 }, { wpx: 100 }, { wpx: 200 }, { wpx: 150 }, { wpx: 80 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");
    XLSX.writeFile(workbook, "supplier_list.xlsx");
  };

  /* -------------------------- EXPORT CSV -------------------------- */
  const exportToCSV = () => {
    const worksheetData = suppliers.map((s, i) => ({
      Sl: i + 1,
      ID: s._id,
      "Supplier Name": truncateText(s.name),
      Phone: s.phone,
      Email: s.email,
      "Trade Name": truncateText(s.tradeName),
      Status: s.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "supplier_list.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* -------------------------- PRINT -------------------------- */
  const printSuppliersTable = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    let html = `
      <h2>Supplier List Report</h2>
      <table style="width:100%; border-collapse: collapse; font-size:12px;">
        <thead>
          <tr>
            <th style="border:1px solid black; padding:5px;">Sl</th>
            <th style="border:1px solid black; padding:5px;">ID</th>
            <th style="border:1px solid black; padding:5px;">Supplier Name</th>
            <th style="border:1px solid black; padding:5px;">Phone</th>
            <th style="border:1px solid black; padding:5px;">Email</th>
            <th style="border:1px solid black; padding:5px;">Trade Name</th>
            <th style="border:1px solid black; padding:5px;">Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    suppliers.forEach((s, i) => {
      html += `
        <tr>
          <td style="border:1px solid black; padding:5px;">${i + 1}</td>
          <td style="border:1px solid black; padding:5px;">${s._id}</td>
          <td style="border:1px solid black; padding:5px;">${truncateText(s.name)}</td>
          <td style="border:1px solid black; padding:5px;">${s.phone}</td>
          <td style="border:1px solid black; padding:5px;">${s.email}</td>
          <td style="border:1px solid black; padding:5px;">${truncateText(s.tradeName)}</td>
          <td style="border:1px solid black; padding:5px;">${s.status}</td>
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
    <div className="p-4">

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
           onClick={() => printSuppliersTable()}
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Supplier Information</h2>
        <Link
          to="/supplier/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-indigo-700"
        >
          <span className="text-xl">+</span> Add
        </Link>
      </div>

      <div className="overflow-x-auto min-h-screen bg-white shadow rounded">
        <table className="min-w-full  text-sm border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-3 py-2 border">Sl</th>
              <th className="px-3 py-2 border">ID</th>
              <th className="px-3 py-2 border">Supplier Name</th>
              <th className="px-3 py-2 border">Phone</th>
              <th className="px-3 py-2 border">Email</th>
              <th className="px-3 py-2 border">Trade Name</th>
              <th className="px-3 py-2 border">Status</th>
              <th className="px-3 py-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s, i) => (
              <tr key={s._id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2 border">{i + 1}</td>
                <td className="px-3 py-2 border">{s._id}</td>
                <td className="px-3 py-2 border font-medium">{s.name}</td>
                <td className="px-3 py-2 border">{s.phone}</td>
                <td className="px-3 py-2 border">{s.email}</td>
                <td className="px-3 py-2 border">{s.tradeName}</td>
                <td className="px-3 py-2 border">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      s.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-3 py-2 border text-center relative">
                  <button
                    onClick={() => toggleDropdown(s._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Action ▾
                  </button>

                  {openDropdown === s._id && (
                    <div className="absolute right-0 mt-1 w-40 bg-white border rounded shadow-md z-10">
                      <Link
                        to={`/dashboard/supplier/edit/${s._id}`}
                        className="block px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        ✏️ Edit
                      </Link>
                      <Link
                        to={`/dashboard/supplier/payment/${s._id}`}
                        className="block px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        💰 Add Payment
                      </Link>
                      <Link
                        to={`/dashboard/supplier/invoice/${s._id}`}
                        className="block px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        🧾 Invoice
                      </Link>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
