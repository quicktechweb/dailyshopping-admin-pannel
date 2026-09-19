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

  // ===== 🆕 Parent Banner (shared across ALL campaigns) =====
  const [parentBannerImages, setParentBannerImages] = useState([]);
  const [parentBannerFile, setParentBannerFile] = useState(null);
  const [parentBannerPreview, setParentBannerPreview] = useState(null);
  const [isSavingBanner, setIsSavingBanner] = useState(false);

  // Fetch parent banner images on load
  useEffect(() => {
    axios.get("http://localhost:5000/api/campaign-parent-banner")
      .then((res) => setParentBannerImages(res.data?.images || []))
      .catch((err) => console.log(err));
  }, []);

  const handleParentBannerFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setParentBannerFile(file);
    setParentBannerPreview(URL.createObjectURL(file));
  };

  const handleAddParentBannerImage = async () => {
    if (!parentBannerFile) return alert("Select an image first!");

    setIsSavingBanner(true);
    try {
      const imageUrl = await uploadImage(parentBannerFile);
      if (!imageUrl) return;

      const res = await axios.post(
        "http://localhost:5000/api/campaign-parent-banner/add-image",
        { imageUrl }
      );

      setParentBannerImages(res.data.images || []);
      setParentBannerFile(null);
      setParentBannerPreview(null);
      alert("Banner image added!");
    } catch (err) {
      console.log(err);
      alert("Failed to add banner image");
    } finally {
      setIsSavingBanner(false);
    }
  };

  const handleRemoveParentBannerImage = async (imageUrl) => {
    if (!confirm("Remove this banner image?")) return;

    try {
      const res = await axios.delete(
        "http://localhost:5000/api/campaign-parent-banner/remove-image",
        { data: { imageUrl } }
      );
      setParentBannerImages(res.data.images || []);
    } catch (err) {
      console.log(err);
      alert("Failed to remove image");
    }
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

      {/* ====== 🆕 PARENT BANNER (shared for ALL campaigns) ====== */}
      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-bold mb-1">
          Parent Banner Images
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          These images are not tied to any single campaign — they show up as
          the common banner across every campaign/promo section on the site.
          You can upload as many as you want.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleParentBannerFileChange}
            className="border p-2 flex-1 rounded"
          />
          <button
            type="button"
            onClick={handleAddParentBannerImage}
            disabled={isSavingBanner}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {isSavingBanner ? "Uploading..." : "Add Image"}
          </button>
        </div>

        {parentBannerPreview && (
          <img
            src={parentBannerPreview}
            className="w-32 h-20 object-cover rounded border mb-4"
            alt="preview"
          />
        )}

        <div className="flex flex-wrap gap-3">
          {parentBannerImages.map((img) => (
            <div key={img} className="relative">
              <img
                src={img}
                className="w-32 h-20 object-cover rounded border"
                alt="banner"
              />
              <button
                type="button"
                onClick={() => handleRemoveParentBannerImage(img)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {parentBannerImages.length === 0 && (
          <p className="text-gray-400 text-sm">No banner images yet.</p>
        )}
      </div>

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
