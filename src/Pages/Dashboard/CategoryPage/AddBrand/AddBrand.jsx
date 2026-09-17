import { useEffect, useState } from "react";

const IMGBB_API_KEY = "ab454291ebee91b49b021ecac51be17c";

export default function AddBrand() {
  const [brands, setBrands] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [status, setStatus] = useState("Inactive");
  const [brandImgFile, setBrandImgFile] = useState(null); // File object
  const [editId, setEditId] = useState(null);

  // Fetch brands from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data));
  }, []);

  // Upload image to imgbb
  const uploadImage = async (file) => {
    if (!file) return ""; // No file, skip upload
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    if (data.success) return data.data.url;
    throw new Error(data.error?.message || "Failed to upload image");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    let brandImgUrl = "";

    // Case 1: New image uploaded
    if (brandImgFile) {
      brandImgUrl = await uploadImage(brandImgFile);
    }
    // Case 2: No new image, keep the old one
    else if (editId) {
      const oldBrand = brands.find((b) => b._id === editId);
      brandImgUrl = oldBrand?.brandImg || "";
    }

    const newBrand = { brandName, status, brandImg: brandImgUrl };

    let res, data;
    if (editId) {
      // UPDATE existing brand
      res = await fetch(`http://localhost:5000/api/brands/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBrand),
      });
      data = await res.json();

      setBrands(brands.map((b) => (b._id === data._id ? data : b)));
      setEditId(null);
    } else {
      // ADD new brand
      res = await fetch("http://localhost:5000/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBrand),
      });
      data = await res.json();

      setBrands([...brands, data]);
    }

    // Reset form
    setBrandName("");
    setStatus("Inactive");
    setBrandImgFile(null);
    document.getElementById("addForm").classList.add("hidden");
  } catch (error) {
    console.error("Failed to upload image or save brand.", error);
    alert("Failed to upload image or save brand. Check console for details.");
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    await fetch(`http://localhost:5000/api/brands/${id}`, { method: "DELETE" });
    setBrands(brands.filter((b) => b._id !== id));
  };

  const handleEdit = (brand) => {
    setEditId(brand._id);
    setBrandName(brand.brandName);
    setStatus(brand.status);
    setBrandImgFile(null); // clear file input
    document.getElementById("addForm").classList.remove("hidden");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Brand Information</h2>
        <button
          onClick={() =>
            document.getElementById("addForm").classList.toggle("hidden")
          }
          className="bg-purple-700 text-white px-4 py-2 rounded"
        >
          + Add
        </button>
      </div>

      <form
        id="addForm"
        onSubmit={handleSubmit}
        className="hidden mb-6 p-4 border rounded bg-gray-50"
      >
        <div className="mb-2">
          <label className="block mb-1">Brand Name</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1">Brand Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBrandImgFile(e.target.files[0])}
            className="border p-2 w-full rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? "Update" : "Save"}
        </button>
      </form>

      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Sl</th>
            <th className="p-2 border">Brand Name</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Brand Image</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white text-black">
          {brands.map((b, i) => (
            <tr key={b._id} className="border">
              <td className="p-2 border">{i + 1}</td>
              <td className="p-2 border">{b.brandName}</td>
              <td className="p-2 border">{b.status}</td>
              <td className="p-2 border">
                {b.brandImg && (
                  <img
                    src={b.brandImg}
                    className="w-16 h-16 object-cover rounded"
                    alt={b.brandName}
                  />
                )}
              </td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleEdit(b)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
