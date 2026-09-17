import { useState, useEffect } from "react";
import axios from "axios";

export default function HomeBannerAdvertis() {
  const [banner, setBanner] = useState(null);
  const [editing, setEditing] = useState({ left: false, right: false });
  const [uploading, setUploading] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [newMiddleText, setNewMiddleText] = useState("");

  // const IMG_BB_KEY = "ab454291ebee91b49b021ecac51be17c";

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    const { data } = await axios.get("http://localhost:5000/api/bannersadvertis");
    setBanner(data[0]);
  };

  const updateBanner = async (updated) => {
    await axios.put(`http://localhost:5000/api/bannersadvertis/${banner._id}`, updated);
    fetchBanner();
  };

  // 🔼 Upload Image to imgbb
 const handleImageUpload = async (e, side) => {
  const file = e.target.files[0];
  if (!file) return;
  setUploading(true);

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(
      "http://localhost:5000/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // Backend থেকে response
    const data = res.data;

    // ❌ Check if upload failed
    if (!data.success) {
      // backend message show
      throw new Error(data.message || "Image upload failed");
    }

    // ✅ Update banner depending on side
    const imageUrl = data.url;
    if (side === "left") {
      const updated = { ...banner, leftBanner: { ...banner.leftBanner, image: imageUrl } };
      await updateBanner(updated);
    } else if (side === "right") {
      const updated = { ...banner, rightBanner: { ...banner.rightBanner, image: imageUrl } };
      await updateBanner(updated);
    }

  } catch (err) {
    console.error("Upload failed:", err);
    // ❌ Show backend message
    alert(err.message);
  } finally {
    setUploading(false);
  }
};


  // ➕ Add middle text
  const handleAddMiddle = async () => {
    if (!newMiddleText.trim()) return alert("Please write a text before adding!");
    const updated = {
      ...banner,
      middleBanner: {
        texts: [...banner.middleBanner.texts, { text: newMiddleText }],
      },
    };
    await updateBanner(updated);
    setNewMiddleText("");
  };

  // ❌ Delete middle text
  const handleDeleteMiddle = async (index) => {
    const updated = {
      ...banner,
      middleBanner: {
        texts: banner.middleBanner.texts.filter((_, i) => i !== index),
      },
    };
    await updateBanner(updated);
  };

  // ✏️ Save edit modal
  const handleSaveEditModal = async () => {
    const updatedTexts = [...banner.middleBanner.texts];
    updatedTexts[editModal.index] = { text: editModal.data };
    await updateBanner({ ...banner, middleBanner: { texts: updatedTexts } });
    setEditModal(null);
  };

  if (!banner) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-xl font-semibold mb-4">🎯 Manage Banner Sections</h2>

      {/* LEFT BANNER */}
      <div className="border rounded-xl p-4 bg-white shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-2">🖼 Left Banner</h3>
        {!editing.left ? (
          <div className="flex justify-between items-center">
            <img
              src={banner.leftBanner.image}
              alt={banner.leftBanner.alt}
              className="h-16 rounded-md"
            />
            <button
              onClick={() => setEditing({ ...editing, left: true })}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "left")}
              />
              {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
            </div>
            <button
              onClick={() => setEditing({ ...editing, left: false })}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* MIDDLE BANNER */}
      <div className="border rounded-xl p-4 bg-white shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-2">🏷 Middle Banner Texts</h3>

        {banner.middleBanner.texts.map((t, i) => (
          <div
            key={i}
            className="flex items-center justify-between border p-2 rounded mb-2 bg-gray-50"
          >
            <p className="text-gray-700 font-medium">{t.text}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setEditModal({ index: i, data: t.text })}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteMiddle(i)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        <div className="mt-4 flex gap-2">
          <input
            className="border p-2 flex-grow rounded"
            placeholder="Enter new banner text (e.g. Winner coupon name Tamal Sarkar)"
            value={newMiddleText}
            onChange={(e) => setNewMiddleText(e.target.value)}
          />
          <button
            onClick={handleAddMiddle}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            ➕ Add
          </button>
        </div>
      </div>

      {/* RIGHT BANNER */}
      <div className="border rounded-xl p-4 bg-white shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-2">🎬 Right Banner</h3>
        {!editing.right ? (
          <div className="flex justify-between items-center">
            <img
              src={banner.rightBanner.image}
              alt={banner.rightBanner.alt}
              className="h-16 rounded-md"
            />
            <button
              onClick={() => setEditing({ ...editing, right: true })}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "right")}
              />
              {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
            </div>
            <button
              onClick={() => setEditing({ ...editing, right: false })}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* ✨ Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Edit Middle Banner Text
            </h3>
            <input
              className="border p-2 w-full rounded"
              value={editModal.data}
              onChange={(e) =>
                setEditModal({ ...editModal, data: e.target.value })
              }
              placeholder="Enter banner text"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleSaveEditModal}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditModal(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
