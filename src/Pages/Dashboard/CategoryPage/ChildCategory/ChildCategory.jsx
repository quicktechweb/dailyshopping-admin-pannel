import { useEffect, useState } from "react";

const ChildCategory = () => {
  const [childCategories, setChildCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    categoryName: "",
    subcategoryName: "",
    status: "Active",
    childCategoryImg: "", // new field
  });
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);

  // Fetch data
  const fetchChildCategories = () => {
    fetch("https://dailyshopping-backend.onrender.com/api/childcategories")
      .then((res) => res.json())
      .then((data) => setChildCategories(data));
  };

  const fetchCategories = () => {
    fetch("https://dailyshopping-backend.onrender.com/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  };

  const fetchSubcategories = () => {
    fetch("https://dailyshopping-backend.onrender.com/api/subcategories")
      .then((res) => res.json())
      .then((data) => setSubcategories(data));
  };

  useEffect(() => {
    fetchChildCategories();
    fetchCategories();
    fetchSubcategories();
  }, []);

  // Filter subcategories by selected category
  const filteredSubcategories = subcategories.filter(
    (sub) => sub.categoryName === form.categoryName
  );

  // Upload image to imgbb
  const uploadImageToImgbb = async (file) => {
    if (!file) return "";

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("https://dailyshopping-backend.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // ❌ যদি backend success false হয়, message দেখাও
      if (!data?.success) {
        throw new Error(data.message || "Image upload failed");
      }

      // ✅ Upload successful, return URL
      return data.url;

    } catch (err) {
      console.error("Image upload error:", err);

      // ❌ Frontend alert backend message
      alert(err.message || "Image upload failed");
      throw err; // outer catch handle করতে পারবে
    }
  };


  // Handle Add/Edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let childCategoryImg = form.childCategoryImg;
    if (imageFile) {
      childCategoryImg = await uploadImageToImgbb(imageFile);
    }

    const newChild = { ...form, childCategoryImg };
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `https://dailyshopping-backend.onrender.com/api/childcategories/${editId}`
      : "https://dailyshopping-backend.onrender.com/api/childcategories";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newChild),
    });
    const data = await res.json();

    if (editId) {
      setChildCategories((prev) =>
        prev.map((item) => (item._id === data._id ? data : item))
      );
    } else {
      setChildCategories((prev) => [...prev, data]);
    }

    setForm({ name: "", categoryName: "", subcategoryName: "", status: "Active", childCategoryImg: "" });
    setImageFile(null);
    setEditId(null);
  };

  // Delete
  const handleDelete = (id) => {
    fetch(`https://dailyshopping-backend.onrender.com/api/childcategories/${id}`, { method: "DELETE" }).then(() =>
      fetchChildCategories()
    );
  };

  // Edit
  const handleEdit = (child) => {
    setForm({
      name: child.name,
      categoryName: child.categoryName,
      subcategoryName: child.subcategoryName,
      status: child.status,
      childCategoryImg: child.childCategoryImg,
    });
    setEditId(child._id);
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
            Manage Child Categories
          </h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Child Category Name
              </label>
              <input
                type="text"
                placeholder="e.g. iPhone Cases"
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
                onChange={(e) => setForm({ ...form, categoryName: e.target.value, subcategoryName: "" })}
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
                Subcategory
              </label>
              <select
                value={form.subcategoryName}
                onChange={(e) => setForm({ ...form, subcategoryName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 focus:bg-white transition-colors"
                required
              >
                <option value="">Select Subcategory</option>
                {filteredSubcategories.map((sub) => (
                  <option key={sub._id} value={sub.name}>
                    {sub.name}
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

            <div className="md:col-span-2 lg:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Child Category Image
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
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subcategory</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Child Category</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Image</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {childCategories.map((child, index) => (
                  <tr key={child._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 text-sm text-slate-400 font-medium">{index + 1}</td>
                    <td className="p-4 text-sm text-slate-600">{child.categoryName}</td>
                    <td className="p-4 text-sm text-slate-600">{child.subcategoryName}</td>
                    <td className="p-4 text-sm font-semibold text-slate-800">{child.name}</td>
                    <td className="p-4">
                      <img
                        src={child.childCategoryImg}
                        alt="child category"
                        className="w-12 h-12 object-cover rounded-xl border border-slate-100"
                      />
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                          child.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${child.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {child.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
                          onClick={() => handleEdit(child)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                          onClick={() => handleDelete(child._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {childCategories.length === 0 && (
                  <tr>
                    <td className="p-10 text-center text-sm text-slate-400" colSpan={7}>
                      No child categories found.
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

export default ChildCategory;