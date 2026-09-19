import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";

const BASE_URL = "http://localhost:5000/api/popularcategory";
const CATEGORY_URL = "http://localhost:5000/api/categories";

// ✅ Upload to ImgBB
const uploadToImgBB = async (file) => {
  try {
    const form = new FormData();
    form.append("image", file);

    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: form,
    });

    const json = await res.json();

    // ❌ যদি success false হয়, backend message দেখাও
    if (!json?.success) {
      throw new Error(json.message || "Image upload failed");
    }

    // ✅ success হলে URL return কর
    return json.url;

  } catch (err) {
    // Frontend-এ error message show করার জন্য
    alert(err.message);
    throw err; // চাইলে catch block বাইরে handle করতে পারেন
  }
};


export default function AdminPopularCategories() {
  const [popularCategories, setPopularCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [editIndex, setEditIndex] = useState(null); // ✅ use index not _id
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // ✅ Fetch all categories
  const fetchAllCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_URL);
      setAllCategories(res.data);
    } catch {
      alert("Failed to fetch categories");
    }
  };

  // ✅ Fetch popular categories
  const fetchPopularCategories = async () => {
    try {
      const res = await axios.get(BASE_URL);
      if (res.data.length > 0) setPopularCategories(res.data[0].categories || []);
    } catch {
      alert("Failed to fetch popular categories");
    }
  };

  useEffect(() => {
    fetchAllCategories();
    fetchPopularCategories();
  }, []);

  // ✅ Add new category
  const handleAdd = async () => {
    if (!selectedCategory || !iconFile) return alert("Select category and icon required");
    setLoading(true);
    try {
      const iconUrl = await uploadToImgBB(iconFile);
      await axios.post(BASE_URL, {
        name: selectedCategory,
        icon: iconUrl,
      });
      setSelectedCategory("");
      setIconFile(null);
      setOpenModal(false);
      fetchPopularCategories();
    } catch {
      alert("Add failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update category (by index)
  const handleUpdate = async () => {
    if (editIndex === null) return alert("No category selected for edit");
    if (!selectedCategory) return alert("Select category name");
    setLoading(true);
    try {
      let iconUrl = popularCategories[editIndex]?.icon;
      if (iconFile) iconUrl = await uploadToImgBB(iconFile);

      await axios.put(`${BASE_URL}/${editIndex}`, {
        name: selectedCategory,
        icon: iconUrl,
      });

      setEditIndex(null);
      setSelectedCategory("");
      setIconFile(null);
      setOpenModal(false);
      fetchPopularCategories();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete category (by index)
  const deleteCategory = async (index) => {
    if (!confirm("Delete this category?")) return;
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/${index}`);
      fetchPopularCategories();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Open modal for Add or Edit
  const openAddModal = () => {
    setSelectedCategory("");
    setIconFile(null);
    setEditIndex(null);
    setOpenModal(true);
  };

  const openEditModal = (cat, index) => {
    setEditIndex(index);
    setSelectedCategory(cat.name);
    setIconFile(null);
    setOpenModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Popular Categories Admin</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      {/* --- Table --- */}
      <div className="bg-white shadow rounded overflow-hidden mt-4">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-1 border text-center">#</th>
              <th className="p-1 border text-left">Icon</th>
              <th className="p-1 border text-left">Name</th>
              <th className="p-1 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {popularCategories.map((cat, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-1 border text-center">{i + 1}</td>
                <td className="p-1 border">
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    className="w-10 h-10 object-contain mx-auto"
                  />
                </td>
                <td className="p-1 border font-medium text-gray-800">{cat.name}</td>
                <td className="p-3 border text-center flex justify-center gap-2">
                  <button
                    onClick={() => openEditModal(cat, i)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-1 text-xs"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(i)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1 text-xs"
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {popularCategories.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Modal --- */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">
              {editIndex !== null ? "Edit Category" : "Add Category"}
            </h2>

            <div className="space-y-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border w-full px-3 py-2 rounded"
              >
                <option value="">-- Select Category --</option>
                {allCategories.map((cat) => (
                  <option key={cat._id} value={cat.categoryName}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setIconFile(e.target.files[0])}
                className="border w-full p-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={editIndex !== null ? handleUpdate : handleAdd}
                disabled={loading}
                className={`px-4 py-2 text-white rounded flex items-center gap-2 ${
                  editIndex !== null
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {editIndex !== null ? <FaEdit /> : <FaPlus />}
                {loading
                  ? "Saving..."
                  : editIndex !== null
                  ? "Update"
                  : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
