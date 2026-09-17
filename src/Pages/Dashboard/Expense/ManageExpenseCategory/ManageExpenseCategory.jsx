import { useEffect, useState } from "react";
import axios from "axios";
import ExpenseCategoryTable from "./ExpenseCategoryTable";

const ManageExpenseCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active"); // default active
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false); // form initially hidden

  const fetchCategories = async () => {
    const res = await axios.get("https://dailyshopping-backend.onrender.com/api/expense-categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    if (editing) {
      await axios.put(
        `https://dailyshopping-backend.onrender.com/api/expense-categories/${editing._id}`,
        { name, status }
      );
      setEditing(null);
    } else {
      await axios.post("https://dailyshopping-backend.onrender.com/api/expense-categories", { name, status });
    }

    setName("");
    setStatus("Active");
    setShowForm(false); // hide form after submit
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setName(cat.name);
    setStatus(cat.status || "Active");
    setShowForm(true); // show form when editing
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await axios.delete(`https://dailyshopping-backend.onrender.com/api/expense-categories/${id}`);
      fetchCategories();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Manage Expense Category</h2>
        <button
          className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Category"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-1 rounded border focus:outline-none text-black"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-2 py-1 rounded border focus:outline-none text-black"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 px-4 py-1 rounded hover:bg-green-700"
          >
            {editing ? "Update" : "Add"}
          </button>
        </form>
      )}

      <ExpenseCategoryTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ManageExpenseCategory;
