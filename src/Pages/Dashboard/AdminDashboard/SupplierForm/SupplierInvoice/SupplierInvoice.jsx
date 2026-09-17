import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";

export default function SupplierInvoice() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [invoiceData, setInvoiceData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Supplier Info
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/suppliers/${id}`);
        setSupplier(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch supplier:", err);
      }
    };
    fetchSupplier();
  }, [id]);

  // ✅ Fetch Supplier Invoice Data
  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/suppliers/${id}/invoice`
        );
        setInvoiceData(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch invoice:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  // ✅ Filtered Data (Search)
  const filteredData = Array.isArray(invoiceData)
    ? invoiceData.filter(
        (item) =>
          item.invoiceNo?.toLowerCase().includes(search.toLowerCase()) ||
          item.note?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // ✅ Totals
  const totalDebit = filteredData.reduce((sum, i) => sum + (i.debit || 0), 0);
  const totalCredit = filteredData.reduce((sum, i) => sum + (i.credit || 0), 0);
  const totalDueAmount = filteredData.reduce((sum, i) => sum + (i.due || 0), 0);

  // ✅ Export Excel
  const exportExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data available to export!");
      return;
    }

    const dataToExport = filteredData.map((item, index) => ({
      SL: index + 1,
      Date: item.date || "",
      "Invoice No": item.invoiceNo || "",
      "Debit (Purchase)": item.debit || 0,
      "Credit (Payment)": item.credit || 0,
      Note: item.note || "",
      "Remaining Balance (Due)": item.due || 0,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoice");

    // ✅ Proper Excel export that opens correctly
    XLSX.writeFile(wb, `${supplier?.name || "invoice"}.xlsx`);
  };

  const handlePrint = () => window.print();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
       <div className="hidden print:flex justify-center mb-4">
        <img
          src="https://i.ibb.co.com/VY92LX2H/Logo-Lucky-Shop1.png"
          alt="Company Logo"
          className="h-20 object-contain"
        />
      </div>
      {/* Supplier Info */}
      <div className="mb-4 bg-white p-4 rounded shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Supplier Invoice — {supplier?.name || "Loading..."}
        </h2>
        {supplier && (
          <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Email:</span> {supplier.email || "N/A"}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {supplier.phoneNumber || "N/A"}
            </p>
            <p>
              <span className="font-medium">Trade Name:</span>{" "}
              {supplier.tradeName || "N/A"}
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 print:hidden">
        <div className="flex items-center gap-2 mb-3 md:mb-0">
          {/* CSV Export */}
          <CSVLink
            data={filteredData.map((item, index) => ({
              SL: index + 1,
              Date: item.date || "",
              "Invoice No": item.invoiceNo || "",
              "Debit (Purchase)": item.debit || 0,
              "Credit (Payment)": item.credit || 0,
              Note: item.note || "",
              "Remaining Balance (Due)": item.due || 0,
            }))}
            filename={`${supplier?.name || "supplier"}-invoice.csv`}
            className="px-3 py-1.5 bg-gray-200 text-gray-800 border border-gray-300 rounded hover:bg-gray-300 text-sm font-medium"
          >
            Export CSV
          </CSVLink>

          {/* Excel Export */}
          <button
            onClick={exportExcel}
            className="px-3 py-1.5 bg-gray-200 text-gray-800 border border-gray-300 rounded hover:bg-gray-300 text-sm font-medium"
          >
            Export Excel
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-gray-200 text-gray-800 border border-gray-300 rounded hover:bg-gray-300 text-sm font-medium"
          >
            Print
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 font-medium">Search:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            placeholder="Invoice No or Note"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto bg-white border border-gray-300 rounded shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr className="text-left text-gray-700 font-semibold text-xs uppercase">
              <th className="px-3 py-2 border-r">Date</th>
              <th className="px-3 py-2 border-r">Invoice No</th>
              <th className="px-3 py-2 border-r">Debit (Purchase)</th>
              <th className="px-3 py-2 border-r">Credit (Payment)</th>
              <th className="px-3 py-2 border-r">Note</th>
              <th className="px-3 py-2 border-r">Remaining Balance (Due)</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 font-medium">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50 border-b">
                  <td className="px-3 py-2 border-r">{item.date}</td>
                  <td className="px-3 py-2 border-r">{item.invoiceNo}</td>
                  <td className="px-3 py-2 border-r text-green-600 font-medium">
                    {item.debit?.toLocaleString() || 0}
                  </td>
                  <td className="px-3 py-2 border-r text-red-600 font-medium">
                    {item.credit?.toLocaleString() || 0}
                  </td>
                  <td className="px-3 py-2 border-r">{item.note}</td>
                  <td className="px-3 py-2 border-r text-purple-700 font-semibold">
                    {item.due?.toLocaleString() || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 font-medium">
                  No data available
                </td>
              </tr>
            )}
          </tbody>

          {!loading && filteredData.length > 0 && (
            <tfoot className="bg-gray-100 font-semibold text-gray-800">
              <tr>
                <td colSpan="2" className="px-3 py-2 text-right">Total:</td>
                <td className="px-3 py-2 border-r text-green-600">{totalDebit.toLocaleString()}</td>
                <td className="px-3 py-2 border-r text-red-600">{totalCredit.toLocaleString()}</td>
                <td className="px-3 py-2 border-r">—</td>
                <td className="px-3 py-2 border-r text-purple-700">{totalDueAmount.toLocaleString()}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
