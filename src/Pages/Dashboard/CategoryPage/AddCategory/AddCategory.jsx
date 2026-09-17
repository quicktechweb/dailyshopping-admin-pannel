import { useEffect, useState } from "react";

// const IMGBB_API_KEY = "ab454291ebee91b49b021ecac51be17c"; 

export default function AddCategory() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [status, setStatus] = useState("Inactive");
  const [categoryImgFile, setCategoryImgFile] = useState(null);
  const [adminCommission, setAdminCommission] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch categories
  useEffect(() => {
    fetch("https://dailyshopping-backend.onrender.com/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  // Upload image to imgbb
  const uploadImage = async (file) => {
    if (!file) return "";

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("https://dailyshopping-backend.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data?.success) {
        throw new Error(data.message || "Image upload failed");
      }

      return data.url;
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.message || "Image upload failed");
      throw err;
    }
  };

  // Add or Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let categoryImgUrl = "";

      if (categoryImgFile) {
        categoryImgUrl = await uploadImage(categoryImgFile);
      }

      const newCategory = {
        categoryName,
        status,
        adminCommission: adminCommission === "" ? 0 : Number(adminCommission),
        ...(categoryImgUrl && { categoryImg: categoryImgUrl }),
      };

      let res, data;
      if (editId) {
        res = await fetch(`https://dailyshopping-backend.onrender.com/api/categories/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCategory),
        });
        data = await res.json();
        setCategories(categories.map((c) => (c._id === data._id ? data : c)));
        setEditId(null);
      } else {
        res = await fetch("https://dailyshopping-backend.onrender.com/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCategory),
        });
        data = await res.json();
        setCategories([...categories, data]);
      }

      setCategoryName("");
      setStatus("Inactive");
      setCategoryImgFile(null);
      setAdminCommission("");
      document.getElementById("addForm").classList.add("hidden");
    } catch (err) {
      console.error("❌ Failed to upload image or save category", err);
      alert("Failed to upload image or save category.");
    }
  };

  // Delete Category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    await fetch(`https://dailyshopping-backend.onrender.com/api/categories/${id}`, { method: "DELETE" });
    setCategories(categories.filter((c) => c._id !== id));
  };

  // Edit Category
  const handleEdit = (cat) => {
    setEditId(cat._id);
    setCategoryName(cat.categoryName);
    setStatus(cat.status);
    setAdminCommission(cat.adminCommission ?? "");
    setCategoryImgFile(null);
    document.getElementById("addForm").classList.remove("hidden");
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">
              Inventory
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Manage Category Information
            </h2>
          </div>
          <button
            onClick={() => document.getElementById("addForm").classList.toggle("hidden")}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 px-5 py-2.5 rounded-xl shadow-sm hover:bg-indigo-700 transition-colors"
          >
            + Add
          </button>
        </div>

        {/* Form */}
        <form
          id="addForm"
          onSubmit={handleSubmit}
          className="hidden mb-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Category Name
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Electronics"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 focus:bg-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 focus:bg-white transition-colors"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Admin Commission (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={adminCommission}
                onChange={(e) => setAdminCommission(e.target.value)}
                placeholder="e.g. 10"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 focus:bg-white transition-colors"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Category Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCategoryImgFile(e.target.files[0])}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 px-5 py-2.5 rounded-xl shadow-sm hover:bg-indigo-700 transition-colors"
          >
            {editId ? "Update" : "Save"}
          </button>
        </form>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sl</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category Name</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Commission</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Image</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-sm text-slate-400">
                      No categories found.
                    </td>
                  </tr>
                )}
                {categories.map((cat, i) => (
                  <tr key={cat._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 text-sm text-slate-400 font-medium">{i + 1}</td>
                    <td className="p-4 text-sm font-semibold text-slate-800">{cat.categoryName}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                          cat.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cat.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {cat.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-700">{cat.adminCommission ?? 0}%</td>
                    <td className="p-4">
                      {cat.categoryImg && (
                        <img
                          src={cat.categoryImg}
                          alt={cat.categoryName}
                          className="w-12 h-12 object-cover rounded-xl border border-slate-100"
                        />
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}