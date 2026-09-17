import { useState } from "react";
import axios from "axios";

const IMGBB_API_KEY = "ab454291ebee91b49b021ecac51be17c";

export default function SupplierForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    tradeName: "",
    tradeNumber: "",
    openingBalance: 0,
    mainBalance: 0,
    dueBalance: 0,
    status: "Active",
  });
  const [imageFile, setImageFile] = useState(null);

  // Handle text/number/radio input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Upload image to ImgBB and return the URL
  const uploadImage = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (data.success) return data.data.url;
    throw new Error(data.error?.message || "Image upload failed");
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = { ...form, image: imageUrl };

      await axios.post("https://dailyshopping-backend.onrender.com/api/suppliers", payload);
      alert("✅ Supplier added successfully!");

      // Reset form
      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        tradeName: "",
        tradeNumber: "",
        openingBalance: 0,
        mainBalance: 0,
        dueBalance: 0,
        status: "Active",
      });
      setImageFile(null);
    } catch (err) {
      alert("❌ Failed to add supplier: " + err.message);
    }
  };

  const handleClear = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      tradeName: "",
      tradeNumber: "",
      openingBalance: 0,
      mainBalance: 0,
      dueBalance: 0,
      status: "Active",
    });
    setImageFile(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow space-y-5"
    >
      {/* === Grid Inputs === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Trade Name</label>
          <input
            name="tradeName"
            value={form.tradeName}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Trade Number</label>
          <input
            name="tradeNumber"
            value={form.tradeNumber}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Opening Balance</label>
          <input
            name="openingBalance"
            type="number"
            value={form.openingBalance}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Main Balance</label>
          <input
            name="mainBalance"
            type="number"
            value={form.mainBalance}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Due Balance</label>
          <input
            name="dueBalance"
            type="number"
            value={form.dueBalance}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>
      </div>

      {/* Address */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Address</label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />
      </div>

      {/* Image Upload */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Image</label>
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="border rounded p-2 w-full"
        />
      </div>

      {/* Status */}
      <div className="flex space-x-6">
        <label className="flex items-center space-x-1">
          <input
            type="radio"
            name="status"
            value="Active"
            checked={form.status === "Active"}
            onChange={handleChange}
          />
          <span>Active</span>
        </label>
        <label className="flex items-center space-x-1">
          <input
            type="radio"
            name="status"
            value="Inactive"
            checked={form.status === "Inactive"}
            onChange={handleChange}
          />
          <span>Inactive</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
