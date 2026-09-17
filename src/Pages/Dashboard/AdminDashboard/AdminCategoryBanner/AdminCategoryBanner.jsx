"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const IMGBB_KEY = "746adaf1da9a1a48b000bec014639aeb";
const BASE_URL = "https://dailyshopping-backend.onrender.com/api/categorybanner";

const uploadToImgBB = async (file) => {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: "POST",
    body: form,
  });
  const json = await res.json();
  if (!json?.data?.url) throw new Error("Image upload failed");
  return json.data.url;
};

export default function AdminCategoryBanner() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subCategory: "",
    file: null,
  });

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setBanners(res.data);
    } catch (err) {
      console.error("Failed to fetch banners:", err);
    }
  };

  // Fetch categories and subcategories
  const fetchCategories = async () => {
    try {
      const catRes = await axios.get("https://dailyshopping-backend.onrender.com/api/categories");
      setCategories(catRes.data || []);
      const subRes = await axios.get(
        "https://dailyshopping-backend.onrender.com/api/subcategories"
      );
      setSubcategories(subRes.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setLoading(true);

    try {
      const { bannerId, cardId, itemId } = editing;

      let imageUrl = null;
      if (formData.file) {
        imageUrl = await uploadToImgBB(formData.file);
      }

      await axios.put(`${BASE_URL}/update-item`, {
        bannerId,
        cardId,
        itemId,
        title: formData.title,
        img: imageUrl,
        category: formData.category,
        subCategory: formData.subCategory,
      });

      await fetchBanners();
      setEditing(null);
      setFormData({ title: "", category: "", subCategory: "", file: null });
      alert("✅ Product updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🛠 Manage Category Banners
      </h1>

      {banners.map((banner) => (
        <div
          key={banner._id}
          className="border p-5 rounded-xl mb-8 bg-white shadow"
        >
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            {banner.category} → {banner.subCategory}
          </h2>

          {banner.cardsData.map((card) => (
            <div key={card._id} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {card.title || card.footer}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {card.items.map((item) => {
                  const isEditing =
                    editing &&
                    editing.bannerId === banner._id &&
                    editing.cardId === card._id &&
                    editing.itemId === item._id;

                  return (
                    <div
                      key={item._id}
                      className="border rounded-lg p-3 bg-gray-50 text-center"
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-28 object-cover rounded"
                      />
                      <p className="text-sm font-medium mt-2">{item.title}</p>

                      {isEditing ? (
                        <div className="mt-3 space-y-2">
                          <input
                            type="text"
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                title: e.target.value,
                              })
                            }
                            className="border p-1 rounded w-full"
                          />

                          <input
                            type="file"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                file: e.target.files[0],
                              })
                            }
                            className="w-full"
                          />

                          <select
                            value={formData.category}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                category: e.target.value,
                                subCategory: "",
                              })
                            }
                            className="border p-1 rounded w-full"
                          >
                            <option value="">-- Select Category --</option>
                            {categories.map((c) => (
                              <option key={c._id} value={c.categoryName}>
                                {c.categoryName}
                              </option>
                            ))}
                          </select>

                          <select
                            value={formData.subCategory}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                subCategory: e.target.value,
                              })
                            }
                            disabled={!formData.category}
                            className="border p-1 rounded w-full"
                          >
                            <option value="">-- Select Subcategory --</option>
                            {subcategories
                              .filter(
                                (s) => s.categoryName === formData.category
                              )
                              .map((s) => (
                                <option key={s._id} value={s.name}>
                                  {s.name}
                                </option>
                              ))}
                          </select>

                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={handleSave}
                              disabled={loading}
                              className="bg-green-600 text-white px-3 py-1 rounded flex-1"
                            >
                              {loading ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="bg-gray-400 text-white px-3 py-1 rounded flex-1"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditing({
                              bannerId: banner._id,
                              cardId: card._id,
                              itemId: item._id,
                            });
                            setFormData({
                              title: item.title,
                              category: item.category || "",
                              subCategory: item.subCategory || "",
                              file: null,
                            });
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded mt-2 w-full"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
