import { useState, useEffect } from "react";
import axios from "axios";

const AdminNavbarCategory = () => {
  const [categories, setCategories] = useState([]);
  const [firstChoiceSelected, setFirstChoiceSelected] = useState([]);
  const [secondChoiceSelected, setSecondChoiceSelected] = useState([]);
  const [choiceType, setChoiceType] = useState("");

  // For showing saved data
  const [savedData, setSavedData] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  // Fetch saved navbar categories
  const fetchSavedData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/navbarcategory");
      setSavedData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch navbar category data:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSavedData();
  }, []);

  // Handle category selection
  const handleSelect = (e) => {
    const value = e.target.value;
    if (!value) return;

    if (choiceType === "first") {
      if (!firstChoiceSelected.includes(value)) {
        if (firstChoiceSelected.length < 7) {
          setFirstChoiceSelected((prev) => [...prev, value]);
        } else {
          alert("✅ First choice can only have max 7 categories");
        }
      }
    } else if (choiceType === "second") {
      if (!secondChoiceSelected.includes(value)) {
        setSecondChoiceSelected((prev) => [...prev, value]);
      }
    }
  };

  // Submit new selection
  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/navbarcategory/select", {
        firstChoiceSelected,
        secondChoiceSelected,
      });
      alert("✅ Categories saved successfully!");
      setFirstChoiceSelected([]);
      setSecondChoiceSelected([]);
      setChoiceType("");
      fetchSavedData();
    } catch (err) {
      console.error("Failed to save categories:", err);
      alert("❌ Failed to save categories");
    }
  };

  // Handle Edit modal open
  const handleEdit = (item) => {
    setEditingCategory(item);
    setUpdatedName(item.categoryName);
    setEditModal(true);
  };

  // Handle update submit
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/navbarcategory/update/${editingCategory._id}`,
        { categoryName: updatedName }
      );
      alert("✅ Category updated successfully!");
      setEditModal(false);
      fetchSavedData();
    } catch (err) {
      console.error("Failed to update category:", err);
      alert("❌ Failed to update category");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("🗑 Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/navbarcategory/delete/${id}`);
      alert("✅ Deleted successfully!");
      fetchSavedData();
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("❌ Failed to delete category");
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg max-w-5xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Select Categories</h2>

      {/* Choice Type */}
      <div className="mb-4 flex gap-4">
        <label>
          <input
            type="radio"
            value="first"
            checked={choiceType === "first"}
            onChange={(e) => setChoiceType(e.target.value)}
            className="mr-2"
          />
          First Choice (newCategories)
        </label>
        <label>
          <input
            type="radio"
            value="second"
            checked={choiceType === "second"}
            onChange={(e) => setChoiceType(e.target.value)}
            className="mr-2"
          />
          Second Choice (moreItems)
        </label>
      </div>

      {/* Category Dropdown */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Select Category:</label>
        <select
          className="w-full border rounded px-3 py-2"
          onChange={handleSelect}
        >
          <option value="">-- Select a Category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.categoryName}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Categories
      </button>

      {/* Selected Lists */}
      <div className="mt-4">
        <p className="font-medium">First Choice Selected (newCategories):</p>
        <ul className="list-disc ml-5">
          {firstChoiceSelected.map((cat) => (
            <li key={cat}>{cat}</li>
          ))}
        </ul>

        <p className="font-medium mt-2">Second Choice Selected (moreItems):</p>
        <ul className="list-disc ml-5">
          {secondChoiceSelected.map((cat) => (
            <li key={cat}>{cat}</li>
          ))}
        </ul>
      </div>

      {/* Saved Data Table */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-3">Saved Navbar Categories</h3>
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">#</th>
              <th className="border px-3 py-2 text-left">Category Name</th>
              <th className="border px-3 py-2 text-left">Type</th>
              <th className="border px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedData.map((item, index) => (
              <tr key={item._id}>
                <td className="border px-3 py-2">{index + 1}</td>
                <td className="border px-3 py-2">{item.categoryName}</td>
                <td className="border px-3 py-2 capitalize">{item.type}</td>
                <td className="border px-3 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-3">Edit Category</h3>
            <label className="block mb-2 font-medium">Select Category:</label>
            <select
              className="w-full border rounded px-3 py-2 mb-4"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNavbarCategory;
