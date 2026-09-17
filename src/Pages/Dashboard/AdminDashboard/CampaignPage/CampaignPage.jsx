"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function CampaignPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [campaignName, setCampaignName] = useState("");
  const [status, setStatus] = useState("active");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editId, setEditId] = useState(null);

  // Fetch campaigns
  useEffect(() => {
    axios.get("http://localhost:5000/api/campaigns")
      .then(res => setCampaigns(res.data))
      .catch(err => console.log(err));
  }, []);

  // Image upload function
  const uploadImage = async (file) => {
    if (!file) return "";

    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post("http://localhost:5000/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (!res.data.success) {
      alert("Image upload failed");
      return "";
    }

    return res.data.url;
  };

  // Submit form (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const body = {
        campaignName,
        status,
        ...(imageUrl && { campaignImg: imageUrl })
      };

      let res;

      if (editId) {
        // UPDATE CAMPAIGN
        res = await axios.put(
          `http://localhost:5000/api/campaigns/${editId}`,
          body
        );

        setCampaigns(
          campaigns.map((c) => (c._id === editId ? res.data : c))
        );
        setEditId(null);

      } else {
        // ADD NEW CAMPAIGN
        res = await axios.post("http://localhost:5000/api/campaigns", body);
        setCampaigns([...campaigns, res.data]);
      }

      // RESET FORM
      setCampaignName("");
      setStatus("active");
      setImageFile(null);
      setPreviewImage(null);

      alert("Saved successfully!");

    } catch (err) {
      console.log(err);
      alert("Error saving campaign.");
    }
  };

  // Edit handler
  const handleEdit = (c) => {
    setEditId(c._id);
    setCampaignName(c.campaignName);
    setStatus(c.status);
    setPreviewImage(c.campaignImg);
    setImageFile(null);
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete?")) return;

    await axios.delete(`http://localhost:5000/api/campaigns/${id}`);
    setCampaigns(campaigns.filter((c) => c._id !== id));
  };

  return (
    <div className="p-6">

      {/* ====== TITLE ====== */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Manage Campaigns</h2>
      </div>

      {/* ====== FORM ====== */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 border rounded bg-gray-50 space-y-4"
      >
        {/* Name */}
        <input
          type="text"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="Campaign Name"
          className="border p-2 w-full rounded"
          required
        />

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setImageFile(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
          }}
          className="border p-2 w-full rounded"
        />

        {/* Preview */}
        {previewImage && (
          <img
            src={previewImage}
            className="w-32 h-32 object-cover rounded border"
          />
        )}

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {editId ? "Update Campaign" : "Add Campaign"}
        </button>
      </form>

      {/* ====== CAMPAIGN TABLE ====== */}
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Sl</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody className="bg-white text-black">
          {campaigns.map((c, i) => (
            <tr key={c._id} className="border">
              <td className="p-2 border">{i + 1}</td>
              <td className="p-2 border">{c.campaignName}</td>
              <td className="p-2 border">{c.status}</td>

              <td className="p-2 border">
                {c.campaignImg && (
                  <img
                    src={c.campaignImg}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
              </td>

              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(c._id)}
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
