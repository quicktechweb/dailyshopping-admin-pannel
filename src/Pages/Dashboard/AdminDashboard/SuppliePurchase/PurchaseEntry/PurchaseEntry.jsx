import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const PurchaseEntry = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [form, setForm] = useState({
    supplier: "",
    invoiceNo: "",
    purchaseDate: "",
    items: [{ product: "", qty: 1, unitPrice: 0, total: 0 }],
    totalAmount: 0,
    paidAmount: 0,
    dueAmount: 0,
    note: "",
  });

  // ✅ Fetch suppliers
  useEffect(() => {
    axios.get("https://dailyshopping-backend.onrender.com/api/suppliers").then((res) => {
      setSuppliers(res.data);
    });
  }, []);

  // ✅ Fetch products
  useEffect(() => {
    axios.get("https://dailyshopping-backend.onrender.com/api/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  // ✅ When supplier changes → filter products
  const handleSupplierChange = (supplierId) => {
    const selectedSupplier = suppliers.find((s) => s._id === supplierId);
    const supplierName = selectedSupplier?.name || "";

    const filtered = products.filter(
      (p) => p.supplier?.toLowerCase() === supplierName.toLowerCase()
    );

    setFilteredProducts(filtered);

    setForm({
      ...form,
      supplier: supplierName, // ✅ Save supplier name instead of ID
      items: [{ product: "", qty: 1, unitPrice: 0, total: 0 }],
    });
  };

  // ✅ Handle item changes (product, qty, price)
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];

    updatedItems[index][field] =
      field === "qty" || field === "unitPrice"
        ? value === ""
          ? ""
          : Number(value)
        : value;

    // ✅ Auto-fill unit price if product selected
    if (field === "product") {
      const selectedProduct = filteredProducts.find((p) => p.title === value);
      updatedItems[index].unitPrice = selectedProduct
        ? selectedProduct.purchasePrice
        : 0;
    }

    // ✅ Update total for each row
    const qty = Number(updatedItems[index].qty) || 0;
    const price = Number(updatedItems[index].unitPrice) || 0;
    updatedItems[index].total = qty * price;

    // ✅ Update grand totals
    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + (Number(item.total) || 0),
      0
    );

    setForm({
      ...form,
      items: updatedItems,
      totalAmount,
      dueAmount: totalAmount - Number(form.paidAmount || 0),
    });
  };

  // ✅ Add new product row
  const handleAddItem = () => {
    setForm({
      ...form,
      items: [...form.items, { product: "", qty: 1, unitPrice: 0, total: 0 }],
    });
  };

  // ✅ Remove product row
  const handleRemoveItem = (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + (Number(item.total) || 0),
      0
    );

    setForm({
      ...form,
      items: updatedItems,
      totalAmount,
      dueAmount: totalAmount - Number(form.paidAmount || 0),
    });
  };

  // ✅ Paid amount change
 const handlePaidChange = (value) => {
  // if input is empty string, treat as 0 internally
  const paid = value === "" ? 0 : Number(value);
  setForm((prev) => ({
    ...prev,
    paidAmount: paid,
    dueAmount: prev.totalAmount - paid,
  }));
};


  // ✅ Submit purchase
  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("🧾 Final form before posting:", JSON.stringify(form, null, 2));

  try {
    await axios.post("https://dailyshopping-backend.onrender.com/api/purchases", form);
    Swal.fire("✅ Success!", "Purchase created successfully!", "success");

    // ✅ Reset form after successful submission
    setForm({
      supplier: "",
      invoiceNo: "",
      purchaseDate: "",
      items: [{ product: "", qty: 1, unitPrice: 0, total: 0 }],
      totalAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
      note: "",
    });

    setFilteredProducts([]); // reset filtered products for supplier
  } catch (err) {
    console.error("❌ Purchase create error:", err);
    Swal.fire("❌ Failed!", "Could not create purchase!", "error");
  }
};


  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-xl mt-8">
      <h2 className="text-2xl font-semibold mb-6">🧾 Create Purchase</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Supplier */}
        <div>
          <label className="block mb-1 font-medium">Supplier</label>
          <select
            className="border p-2 rounded w-full"
            value={
              suppliers.find((s) => s.name === form.supplier)?._id || ""
            }
            onChange={(e) => handleSupplierChange(e.target.value)}
            required
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Invoice No & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Invoice No</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={form.invoiceNo}
              onChange={(e) =>
                setForm({ ...form, invoiceNo: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Purchase Date</label>
            <input
              type="date"
              className="border p-2 rounded w-full"
              value={form.purchaseDate}
              onChange={(e) =>
                setForm({ ...form, purchaseDate: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="border rounded-lg p-3">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="border p-2 text-left">Product</th>
                <th className="border p-2 text-center w-20">Qty</th>
                <th className="border p-2 text-center w-24">Unit Price</th>
                <th className="border p-2 text-center w-24">Total</th>
                <th className="border p-2 text-center w-12">❌</th>
              </tr>
            </thead>
           <tbody>
  {form.items.map((item, index) => {
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredSuggestions = filteredProducts.filter((p) =>
      p.title.toLowerCase().includes(item.product.toLowerCase())
    );

    return (
      <tr key={index} className="text-sm relative">
        <td className="border p-2 relative">
          {/* Search input */}
          <input
            type="text"
            className="border p-1 rounded w-full mb-1"
            placeholder="Search product..."
            value={item.product}
            onChange={(e) => {
              handleItemChange(index, "product", e.target.value);
              setShowSuggestions(true); // show suggestions while typing
            }}
            disabled={!form.supplier}
            autoComplete="off"
          />

          {/* Dropdown select */}
          <select
            className="border p-1 rounded w-full"
            value={item.product}
            onChange={(e) => {
              handleItemChange(index, "product", e.target.value);
              setShowSuggestions(false); // hide suggestions after select
            }}
            disabled={!form.supplier}
            required
          >
            <option value="">Select Product</option>
            {filteredProducts.map((p) => (
              <option key={p._id} value={p.title}>
                {p.title}
              </option>
            ))}
          </select>

          {/* Suggestions dropdown */}
          {showSuggestions && item.product && filteredSuggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto mt-1 shadow-lg rounded">
              {filteredSuggestions.map((p) => (
                <li
                  key={p._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    handleItemChange(index, "product", p.title);
                    setShowSuggestions(false); // hide after select
                  }}
                >
                  {p.title}
                </li>
              ))}
            </ul>
          )}
        </td>

        {/* Quantity */}
        <td className="border p-2 text-center">
          <input
            type="number"
            className="border p-1 rounded w-full text-center"
            value={item.qty}
            onChange={(e) => handleItemChange(index, "qty", e.target.value)}
            min="1"
            required
          />
        </td>

        {/* Unit Price */}
        <td className="border p-2 text-center">
          <input
            type="number"
            className="border p-1 rounded w-full text-center"
            value={item.unitPrice}
            onChange={(e) =>
              handleItemChange(index, "unitPrice", e.target.value)
            }
            min="0"
            required
          />
        </td>

        {/* Total */}
        <td className="border p-2 text-center">{item.total.toFixed(2)}</td>

        {/* Remove Item */}
        <td className="border p-2 text-center">
          {form.items.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="text-red-500 font-bold"
            >
              ✕
            </button>
          )}
        </td>
      </tr>
    );
  })}
</tbody>

          </table>

          <button
            type="button"
            onClick={handleAddItem}
            className="mt-3 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
          >
            + Add Product
          </button>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Total Amount</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={form.totalAmount}
              readOnly
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Paid Amount</label>
          <input
  type="number"
  className="border p-2 rounded w-full"
  value={form.paidAmount === 0 ? "" : form.paidAmount} // ✅ show empty if 0
  onChange={(e) => handlePaidChange(e.target.value)}
  min="0"
/>

          </div>
          <div>
            <label className="block mb-1 font-medium">Due Amount</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={form.dueAmount}
              readOnly
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block mb-1 font-medium">Note</label>
          <textarea
            className="border p-2 rounded w-full"
            rows="2"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg text-lg mt-4 hover:bg-green-700"
        >
          Save Purchase
        </button>
      </form>
    </div>
  );
};

export default PurchaseEntry;
