import { useEffect, useState } from "react";
import axios from "axios";

// const IMGBB_KEY = "746adaf1da9a1a48b000bec014639aeb";

export default function CarouselManager() {
  const [carouselData, setCarouselData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", buttonText: "", img1: "" });
  const [uploading, setUploading] = useState(false);
  const fetchCarousel = async () => {
    const res = await axios.get("https://dailyshopping-backend.onrender.com/api/carousel");
    setCarouselData(res.data);
  };

  useEffect(() => {
    fetchCarousel();
  }, []);

  const handleEdit = (item) => {
    setEditing(item._id);
    setForm({
      title: item.title,
      buttonText: item.buttonText,
      img1: item.img1,
    });
  };

  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   setUploading(true);
  //   const formData = new FormData();
  //   formData.append("image", file);

  //   try {
  //     const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
  //       method: "POST",
  //       body: formData,
  //     });
  //     const data = await res.json();
  //     if (data?.data?.url) {
  //       setForm((prev) => ({ ...prev, img1: data.data.url }));
  //     }
  //   } catch (error) {
  //     console.error("Image upload failed:", error);
  //   } finally {
  //     setUploading(false);
  //   }
  // };

   const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setUploading(true);

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(
      "https://dailyshopping-backend.onrender.com/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    const data = res.data;

    // ❌ Check if backend returned success
    if (!data.success) {
      // Show backend error message
      alert(data.message || "Image upload failed");
      return;
    }

    // ✅ Upload successful, set state
    if (data.url) {
      setForm((prev) => ({ ...prev, img1: data.url }));
    }

  } catch (error) {
    console.error("Image upload failed:", error);

    // ❌ Show proper message if backend message exists
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("Image upload failed. Please try again.");
    }

  } finally {
    setUploading(false);
  }
};


  const handleSave = async (id) => {
    await axios.put(`https://dailyshopping-backend.onrender.com/api/carousel/${id}`, form);
    setEditing(null);
    fetchCarousel();
  };

  return (
   <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">🎠 Carousel Management</h2>

      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border text-left">Preview</th>
            <th className="p-2 border text-left">Title</th>
            <th className="p-2 border text-left">Button Text</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {carouselData.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50">
              <td className="p-2 border">
                <img
                  src={editing === item._id ? form.img1 : item.img1}
                  alt={item.title}
                  className="w-28 h-16 object-cover rounded border"
                />
              </td>
              {editing === item._id ? (
                <>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="border px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={form.buttonText}
                      onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                      className="border px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <div className="flex flex-col gap-2 items-center">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="border px-2 py-1 rounded w-full"
                        accept="image/*"
                      />
                      {uploading && (
                        <p className="text-blue-500 text-xs">Uploading...</p>
                      )}
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => handleSave(item._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="px-3 py-1 bg-gray-300 text-xs rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2 border">{item.title}</td>
                  <td className="p-2 border">{item.buttonText}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                    >
                      Edit
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
