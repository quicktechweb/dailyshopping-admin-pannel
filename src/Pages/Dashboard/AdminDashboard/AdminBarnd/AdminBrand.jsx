"use client";
import { useEffect, useState } from "react";
import axios from "axios";


export default function AdminHomeBrand() {
  const [brands, setBrands] = useState([]);
  const [editingBrand, setEditingBrand] = useState(null);
  // const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    brandName: "",
    brandImg: "",
    // category: "",
    _id: "",
  });

  // Fetch existing brands
  const fetchBrands = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/brands");
      setBrands(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch categories
  // const fetchCategories = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:5000/api/categories");
  //     setCategories(res.data || []);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  useEffect(() => {
    fetchBrands();
    // fetchCategories();
  }, []);

  // Form input change
  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  // Upload image
 const handleImgUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setLoading(true);

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
      alert(data.message || "Image upload failed");
      return;
    }

    // ✅ Upload successful, set state
    setForm({ ...form, brandImg: data.url });

  } catch (err) {
    console.error("Upload error:", err);

    // ❌ Show proper message
    if (err.message) {
      alert(err.message);
    } else {
      alert("Image upload failed. Please try again.");
    }

  } finally {
    setLoading(false);
  }
};


  // Save (Add or Update)
  const handleSubmit = async () => {
    if (!form.brandName) return alert("Please fill all fields!");

    const payload = {
      brandName: form.brandName,
      brandImg: form.brandImg,
      // category: form.category,
    };

    try {
      if (form._id) {
        await axios.put(`http://localhost:5000/api/brands/${form._id}`, payload);
        alert("✅ Brand updated!");
      } else {
        await axios.post("http://localhost:5000/api/brands", payload);
        alert("✅ Brand added!");
      }
      setForm({ brandName: "", brandImg: "", category: "", _id: "" });
      setEditingBrand(null);
      setModalOpen(false);
      fetchBrands();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit click
  const handleEdit = (b) => {
    setEditingBrand(b);
    setForm({
      brandName: b.brandName,
      brandImg: b.brandImg,
      // category: b.category || "",
      _id: b._id,
    });
    setModalOpen(true);
  };

  // Delete brand
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/brands/${id}`);
      alert("🗑️ Brand deleted");
      fetchBrands();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🏷️ Home Brand Management</h2>
        <button
          onClick={() => {
            setEditingBrand(null);
            setForm({ brandName: "", brandImg: "", category: "", _id: "" });
            setModalOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          ➕ Add New Brand
        </button>
      </div>

      {/* Brand Table */}
      <table className="min-w-full border text-sm text-gray-700">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="py-2 px-3">#</th>
            <th className="py-2 px-3">Image</th>
            <th className="py-2 px-3">Brand Name</th>
            {/* <th className="py-2 px-3">Category</th> */}
            <th className="py-2 px-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((b, i) => (
            <tr key={b._id} className="border-b hover:bg-gray-50">
              <td className="py-1 px-3">{i + 1}</td>
              <td className="py-1 px-3">
                {b.brandImg && (
                  <img
                    src={b.brandImg}
                    alt={b.brandName}
                    className="w-16 h-16 object-contain border rounded-lg"
                  />
                )}
              </td>
              <td className="py-1 px-3 font-medium">{b.brandName}</td>
              {/* <td className="py-1 px-3">{b.category || "—"}</td> */}
              <td className="py-1 px-3 mt-5 text-center flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(b)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <h3 className="text-lg font-semibold mb-4">
              {editingBrand ? "✏️ Edit Brand" : "➕ Add New Brand"}
            </h3>

            <div className="flex flex-col gap-3">
              <label className="font-semibold">Brand Name</label>
              <input
                type="text"
                name="brandName"
                value={form.brandName}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                placeholder="Enter brand name"
                className="border rounded-lg p-2"
              />

              {/* <label className="font-semibold">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.categoryName}>
                    {cat.categoryName}
                  </option>
                ))}
              </select> */}

              <label className="font-semibold">Brand Image</label>
              {form.brandImg && (
                <img
                  src={form.brandImg}
                  alt="brand"
                  className="w-32 h-32 object-contain border rounded-lg mb-2"
                />
              )}
              <input type="file" onChange={handleImgUpload} />
              {loading && <p className="text-blue-600 text-sm">Uploading image...</p>}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex-1"
                >
                  {editingBrand ? "Update" : "Add Brand"}
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
