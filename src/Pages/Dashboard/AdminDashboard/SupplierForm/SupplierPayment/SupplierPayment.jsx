import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SupplierPayment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    dueAmount: "",
    paymentDate: "",
    amount: "",
    note: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`https://dailyshopping-backend.onrender.com/api/suppliers/${id}/payment`, form);
    navigate("/supplier");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-4">Add Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="number"
          name="dueAmount"
          placeholder="Due Amount"
          value={form.dueAmount}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded"
        />
        <input
          type="date"
          name="paymentDate"
          value={form.paymentDate}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded"
        />
        <input
          type="number"
          name="amount"
          placeholder="Payment Amount"
          value={form.amount}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded"
        />
        <textarea
          name="note"
          placeholder="Note"
          value={form.note}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Payment
        </button>
      </form>
    </div>
  );
}
