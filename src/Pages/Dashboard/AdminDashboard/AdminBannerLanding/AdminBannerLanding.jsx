"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, UploadCloud, X, Loader2 } from "lucide-react";


const AdminBannerLandingUpload = () => {
  const [banners, setBanners] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [link, setLink] = useState("/");
  const [uploading, setUploading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // 🔹 Fetch existing banners
  const fetchBanners = async () => {
    try {
      setLoadingList(true);
      const res = await axios.get(`https://dailyshopping-backend.onrender.com/api/bannerlanding/banners`);
      setBanners(res.data.banners || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // 🔹 Handle file select + preview generate
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setSelectedFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // 🔹 Remove a selected preview before upload
  const removeSelected = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 Upload to backend
  const handleUpload = async () => {
    if (!selectedFiles.length) {
      alert("প্রথমে অন্তত একটা image select করো");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("images", file));
    formData.append("link", link);

    try {
      setUploading(true);
      await axios.post(`https://dailyshopping-backend.onrender.com/api/bannerlanding/banners`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // reset
      setSelectedFiles([]);
      setPreviews([]);
      setLink("/");
      await fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Upload failed, আবার try করো");
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Delete banner
  const handleDelete = async (id) => {
    if (!confirm("এই banner টা delete করতে চাও?")) return;
    try {
      setDeletingId(id);
      await axios.delete(`https://dailyshopping-backend.onrender.com/api/bannerlanding/banners/${id}`);
      setBanners((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-semibold mb-6">Banner Manage</h1>

      {/* 🔹 Upload Box */}
      <div className="border border-gray-200 rounded-xl p-4 md:p-6 mb-8 bg-white shadow-sm">
        <label className="block text-sm font-medium mb-2">Redirect Link</label>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="/products/some-item"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/80"
        />

        <label
          htmlFor="bannerFiles"
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-8 cursor-pointer hover:border-black/60 transition"
        >
          <UploadCloud size={32} className="text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">
            Image select করতে এখানে click করো (multiple select করা যাবে)
          </span>
          <input
            id="bannerFiles"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* 🔹 Preview Grid */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {previews.map((p, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border">
                <img src={p.url} alt={p.name} className="w-full h-28 object-cover" />
                <button
                  onClick={() => removeSelected(i)}
                  className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFiles.length}
          className="mt-5 w-full md:w-auto px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/85 transition"
        >
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Uploading...
            </>
          ) : (
            `Upload ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}`
          )}
        </button>
      </div>

      {/* 🔹 Existing Banners List */}
      <h2 className="text-lg font-semibold mb-4">Existing Banners</h2>

      {loadingList ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <p className="text-sm text-gray-500">এখনো কোনো banner add করা হয়নি।</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="relative group rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={banner.images?.[0]?.url}
                alt="banner"
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                <button
                  onClick={() => handleDelete(banner._id)}
                  disabled={deletingId === banner._id}
                  className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full transition"
                >
                  {deletingId === banner._id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 px-2 py-1 truncate">
                Link: {banner.link}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBannerLandingUpload;