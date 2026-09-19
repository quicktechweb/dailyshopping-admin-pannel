import { useEffect, useState } from "react";

const SubCategory = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    categoryName: "",
    status: "Active",
    subcategoryImg: "", // renamed
  });
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);

  // Fetch subcategories
  const fetchSubcategories = () => {
    fetch("http://localhost:5000/api/subcategories")
      .then((res) => res.json())
      .then((data) => setSubcategories(data));
  };

  // Fetch categories
  const fetchCategories = () => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  };

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  // Upload image to imgbb
  const uploadImageToImgbb = async (file) => {
    if (!file) return "";

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // ❌ Check if backend returned success
      if (!data?.success) {
        // backend message show
        throw new Error(data.message || "Image upload failed");
      }

      // ✅ Upload successful, return URL
      return data.url;

    } catch (err) {
      console.error("Image upload error:", err);

      // ❌ Frontend alert for backend message
      alert(err.message || "Image upload failed");
      throw err; // outer catch handle করতে পারবে
    }
  };


  // Handle Add/Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    let subcategoryImg = form.subcategoryImg;
    if (imageFile) {
      subcategoryImg = await uploadImageToImgbb(imageFile);
    }

    const newSub = { ...form, subcategoryImg };
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:5000/api/subcategories/${editId}`
      : "http://localhost:5000/api/subcategories";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSub),
    });

    fetchSubcategories();
    setForm({ name: "", categoryName: "", status: "Active", subcategoryImg: "" });
    setImageFile(null);
    setEditId(null);
  };

  // Delete
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/subcategories/${id}`, { method: "DELETE" }).then(() =>
      fetchSubcategories()
    );
  };

  // Edit
  const handleEdit = (sub) => {
    setForm({
      name: sub.name,
      categoryName: sub.categoryName,
      status: sub.status,
      subcategoryImg: sub.subcategoryImg, // updated
    });
    setEditId(sub._id);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">
            Inventory
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Manage Subcategory Information
          </h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Subcategory Name
              </label>
              <input
                type="text"
                placeholder="e.g. Smartphones"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 focus:bg-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Category
              </label>
              <select
                value={form.categoryName}
                onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 focus:bg-white transition-colors"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.categoryName}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 focus:bg-white transition-colors"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Subcategory Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 transition-colors"
              />
            </div>
          </div>

          <button
            className="mt-5 flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 px-5 py-2.5 rounded-xl shadow-sm hover:bg-indigo-700 transition-colors"
          >
            {editId ? "Update" : "Add"}
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
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subcategory Name</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Image</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((sub, index) => (
                  <tr key={sub._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 text-sm text-slate-400 font-medium">{index + 1}</td>
                    <td className="p-4 text-sm font-semibold text-slate-800">{sub.categoryName}</td>
                    <td className="p-4 text-sm text-slate-600">{sub.name}</td>
                    <td className="p-4">
                      <img
                        src={sub.subcategoryImg}
                        alt="subcategory"
                        className="w-12 h-12 object-cover rounded-xl border border-slate-100"
                      />
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                          sub.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${sub.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
                          onClick={() => handleEdit(sub)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                          onClick={() => handleDelete(sub._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {subcategories.length === 0 && (
                  <tr>
                    <td className="p-10 text-center text-sm text-slate-400" colSpan={6}>
                      No subcategories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategory;