"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/categoryBannersparts";

export default function AdminBannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    img: "",
    category: "",
    subCategory: "",
  });
  // const [addingItem, setAddingItem] = useState(false);
  const [addingItem, setAddingItem] = useState(null); 
// { bannerId, cardId }

const [addForm, setAddForm] = useState({
  title: "",
  img: "",
  category: "",
  subCategory: "",
});

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const [backgroundImages, setBackgroundImages] = useState([]);
  const [editingBgIndex, setEditingBgIndex] = useState(null);
  const [bgFile, setBgFile] = useState(null);

  const [bannerDocId, setBannerDocId] = useState(null);

  // 🔹 Upload image to ImgBB
  const uploadToImgBB = async (file) => {
  try {
    const form = new FormData();
    form.append("image", file);

    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: form,
    });

    const json = await res.json();

    // ❌ Check backend success
    if (!json?.success) {
      // backend message show
      throw new Error(json.message || "Image upload failed");
    }

    // ✅ Success হলে URL return
    return json.url;

  } catch (err) {
    // ❌ Frontend alert দেখাবে backend message
    alert(err.message);
    throw err; // চাইলে outer catch handle করতে পারবে
  }
};


  // 🔹 Fetch banners
  const fetchBanners = async () => {
    try {
      const res = await axios.get(API_URL);
      const fetched = Array.isArray(res.data) ? res.data[0] : res.data;
      setBannerDocId(fetched?._id);
      setBanners(fetched?.data || []);
      setBackgroundImages(fetched?.backgroundData || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch categories/subcategories
  useEffect(() => {
    axios.get("http://localhost:5000/api/categories").then((r) => setCategories(r.data));
    axios.get("http://localhost:5000/api/subcategories").then((r) => setSubcategories(r.data));
  }, []);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (editForm.category) {
      setFilteredSubcategories(subcategories.filter((s) => s.categoryName === editForm.category));
    } else {
      setFilteredSubcategories([]);
    }
  }, [editForm.category, subcategories]);

  // 🔹 Update background image
  const handleBgUpdate = async (index) => {
    try {
      if (!bgFile) return alert("Select an image first!");
      const url = await uploadToImgBB(bgFile);
      const updatedImages = [...backgroundImages];
      updatedImages[index] = url;
      await axios.put(`${API_URL}/${bannerDocId}/update-background`, { backgroundData: updatedImages });
      setBackgroundImages(updatedImages);
      setEditingBgIndex(null);
      setBgFile(null);
      alert("✅ Background updated!");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  const handleAddItem = async (bannerId, cardId) => {
  try {
    await axios.post(
      `${API_URL}/${bannerDocId}/data/${bannerId}/card/${cardId}/item`,
      addForm
    );

    await fetchBanners();

    setAddingItem(null);
    setAddForm({
      title: "",
      img: "",
      category: "",
      subCategory: "",
    });

    alert("✅ Item added successfully");
  } catch (err) {
    console.error(err);
    alert("❌ Add failed");
  }
};

  // 🔹 Add new background image
  const handleAddBg = async (file) => {
    try {
      const url = await uploadToImgBB(file);
      const updated = [...backgroundImages, url];
      await axios.put(`${API_URL}/${bannerDocId}/update-background`, { backgroundData: updated });
      setBackgroundImages(updated);
      alert("✅ Background added!");
    } catch {
      alert("❌ Add failed");
    }
  };

  // 🔹 Delete background image
  const handleDeleteBg = async (index) => {
    try {
      const updated = backgroundImages.filter((_, i) => i !== index);
      await axios.put(`${API_URL}/${bannerDocId}/update-background`, { backgroundData: updated });
      setBackgroundImages(updated);
      alert("🗑️ Background deleted!");
    } catch {
      alert("❌ Delete failed");
    }
  };

  // 🔹 Update banner item
  const handleUpdateItem = async (bannerId, cardId, itemId, updates) => {
    try {
      await axios.put(`${API_URL}/${bannerDocId}/data/${bannerId}/card/${cardId}/item/${itemId}`, updates);
      await fetchBanners();
      setEditingItem(null);
      alert("✅ Item updated successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  // 🔹 Delete item
  const handleDeleteItem = async (bannerId, cardId, itemId) => {
    try {
      await axios.delete(`${API_URL}/${bannerDocId}/data/${bannerId}/card/${cardId}/item/${itemId}`);
      await fetchBanners();
      alert("🗑️ Item deleted!");
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  // 🔹 Add new item
  // const handleAddItem = async (bannerId, cardId) => {
  //   try {
  //     await axios.post(`${API_URL}/${bannerDocId}/data/${bannerId}/card/${cardId}/item`, editForm);
  //     await fetchBanners();
  //     setAddingItem(false);
  //     alert("✅ Item added!");
  //   } catch (err) {
  //     console.error(err);
  //     alert("❌ Add failed");
  //   }
  // };

  // 🔹 Start editing
  const startEditItem = (bannerId, cardId, item) => {
    setEditingItem({ bannerId, cardId, item });
    setEditForm({
      title: item.title,
      img: item.img,
      category: item.category,
      subCategory: item.subCategory,
    });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  // 🔹 Flatten all items
  const allItems = banners.flatMap((banner) =>
    banner.cardsData.flatMap((card) =>
      card.items.map((item) => ({
        ...item,
        bannerId: banner._id,
        cardId: card._id,
      }))
    )
  );

  const groupedByCategory = allItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">🛠 Admin Banner Manager</h1>

      {/* ---------- Background Images ---------- */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold border-b pb-2 mb-4">Background Images</h2>
        <div className="flex gap-4 flex-wrap">
          {backgroundImages.map((img, index) => (
            <div key={index} className="relative border rounded-lg p-2 shadow">
              <img src={img} className="w-40 h-20 object-cover rounded" />
              <div className="flex justify-center gap-2 mt-2">
                {editingBgIndex === index ? (
                  <>
                    <input type="file" onChange={(e) => setBgFile(e.target.files[0])} />
                    <button onClick={() => handleBgUpdate(index)} className="px-2 py-1 bg-green-600 text-white rounded">
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingBgIndex(index)} className="px-2 py-1 bg-blue-600 text-white rounded">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDeleteBg(index)} className="px-2 py-1 bg-red-600 text-white rounded">
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
            <input type="file" onChange={(e) => handleAddBg(e.target.files[0])} />
            <p className="text-xs text-gray-500 mt-2">Add new background</p>
          </div>
        </div>
      </div>

      {/* ---------- Items by Category ---------- */}
    {/* ---------- Items by Category ---------- */}
{Object.entries(groupedByCategory).map(([category, items]) => (
  <div key={category}>

    {/* Category Header */}
    <div className="flex justify-between items-center mb-4 border-b pb-2">
      <h2 className="text-xl font-bold">{category}</h2>

      {/* ✅ Add Button (Correct Position) */}
      <button
        onClick={() =>
          setAddingItem({
            bannerId: items[0].bannerId,
            cardId: items[0].cardId,
          })
        }
        className="px-3 py-1 bg-green-600 text-white rounded"
      >
        ➕ Add Item
      </button>
    </div>

    <table className="min-w-full border border-gray-200 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border text-left">Preview</th>
          <th className="p-2 border text-left">Title</th>
          <th className="p-2 border text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr key={item._id} className="hover:bg-gray-50">
            <td className="p-2 border">
              <img
                src={item.img}
                className="w-28 h-14 object-cover rounded"
              />
            </td>

            <td className="p-2 border">{item.title}</td>

            <td className="p-2 border text-center space-x-2">
              <button
                onClick={() =>
                  startEditItem(item.bannerId, item.cardId, item)
                }
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                ✏️ Edit
              </button>

              <button
                onClick={() =>
                  handleDeleteItem(
                    item.bannerId,
                    item.cardId,
                    item._id
                  )
                }
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                🗑️ Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
))}

      {/* ---------- Edit Modal ---------- */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Item</h2>

            {/* form */}
            <div className="space-y-3">
              <input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Title"
                className="border w-full px-3 py-2 rounded"
              />
              <input
                type="file"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const url = await uploadToImgBB(file);
                  setEditForm({ ...editForm, img: url });
                }}
              />
              {editForm.img && <img src={editForm.img} className="w-24 h-20 object-cover mt-2 rounded" />}
            </div>

            {/* category fields */}
            <select
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              className="border w-full px-3 py-2 mt-3 rounded"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>

            <select
              value={editForm.subCategory}
              onChange={(e) => setEditForm({ ...editForm, subCategory: e.target.value })}
              className="border w-full px-3 py-2 mt-3 rounded"
            >
              <option value="">-- Select SubCategory --</option>
              {filteredSubcategories.map((sub) => (
                <option key={sub._id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditingItem(null)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                onClick={() =>
                  handleUpdateItem(editingItem.bannerId, editingItem.cardId, editingItem.item._id, editForm)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                💾 Save
              </button>
            </div>
          </div>
        </div>
      )}

      {addingItem && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg w-full max-w-md p-6">
      <h2 className="text-lg font-semibold mb-4">Add Item</h2>

      <div className="space-y-3">
        <input
          value={addForm.title}
          onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
          placeholder="Title"
          className="border w-full px-3 py-2 rounded"
        />

        <input
          type="file"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const url = await uploadToImgBB(file);
            setAddForm({ ...addForm, img: url });
          }}
        />

        {addForm.img && (
          <img src={addForm.img} className="w-24 h-20 object-cover rounded" />
        )}
      </div>

      {/* Category */}
      <select
        value={addForm.category}
        onChange={(e) =>
          setAddForm({ ...addForm, category: e.target.value })
        }
        className="border w-full px-3 py-2 mt-3 rounded"
      >
        <option value="">-- Select Category --</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.categoryName}>
            {cat.categoryName}
          </option>
        ))}
      </select>

      {/* SubCategory */}
      <select
        value={addForm.subCategory}
        onChange={(e) =>
          setAddForm({ ...addForm, subCategory: e.target.value })
        }
        className="border w-full px-3 py-2 mt-3 rounded"
      >
        <option value="">-- Select SubCategory --</option>
        {subcategories
          .filter((s) => s.categoryName === addForm.category)
          .map((sub) => (
            <option key={sub._id} value={sub.name}>
              {sub.name}
            </option>
          ))}
      </select>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setAddingItem(null)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={() =>
            handleAddItem(
              addingItem.bannerId,
              addingItem.cardId
            )
          }
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          ✅ Add
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
