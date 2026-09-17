import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = "https://dailyshopping-backend.onrender.com/api/promosection";

// UPLOAD HELPER


const uploadToImgBB = async (file) => {
  if (!file) return "";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch("https://dailyshopping-backend.onrender.com/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    // ❌ Check backend success
    if (!data?.success) {
      throw new Error(data.message || "Image upload failed");
    }

    // ✅ Upload successful
    return data.url;

  } catch (err) {
    console.error("Upload error:", err);

    // ❌ Show backend message if available
    alert(err.message || "Image upload failed");
    throw err; // চাইলে outer catch handle করতে পারবে
  }
};

export default function AdminPromoSection() {
  const [data, setData] = useState({ bannerImages: [], sidePromo: {} });
  const [loading, setLoading] = useState(false);

  const [newBanner, setNewBanner] = useState(null);
  const [newBannerLink, setNewBannerLink] = useState("");

  const [editIndex, setEditIndex] = useState(null);
  const [editBannerFile, setEditBannerFile] = useState(null);
  const [editBannerLink, setEditBannerLink] = useState("");

  const [sidePromoFile, setSidePromoFile] = useState(null);
  const [sideAlt, setSideAlt] = useState("");
  const [sideLink, setSideLink] = useState(""); // <-- new for link

  // FETCH DATA
  const fetchData = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setData(res.data);
      setSideAlt(res.data?.sidePromo?.alt || "");
      setSideLink(res.data?.sidePromo?.link || ""); // <-- set link
    } catch {
      alert("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ADD BANNER
  const addBanner = async () => {
    // if (!newBanner) return alert("Select an image");

    setLoading(true);
    try {
      const url = await uploadToImgBB(newBanner);

      await axios.post(`${BASE_URL}/banner`, {
        image: url,
        link: newBannerLink,
      });

      setNewBanner(null);
      setNewBannerLink("");
      fetchData();
    } catch {
      alert("Add failed");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE BANNER



  // DELETE BANNER
  const deleteBanner = async (index) => {
    if (!confirm("Delete this banner?")) return;

    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/banner/${index}`);
      fetchData();
    } catch {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE SIDE PROMO
 // UPDATE SIDE PROMO (image optional)
 // UPDATE SIDE PROMO (image optional)
const updateSidePromo = async () => {
  setLoading(true);
  try {
    const url = sidePromoFile ? await uploadToImgBB(sidePromoFile) : data.sidePromo?.image;

    await axios.put(`${BASE_URL}/sidepromo`, {
      image: url,
      alt: sideAlt,
      link: sideLink,
    });

    setSidePromoFile(null);
    fetchData();

    // ✅ SweetAlert success
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Side promo updated successfully",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch {
    alert("Side promo update failed");
  } finally {
    setLoading(false);
  }
};

// UPDATE BANNER
const updateBanner = async () => {
  setLoading(true);
  try {
    const url = editBannerFile ? await uploadToImgBB(editBannerFile) : data.bannerImages[editIndex].image;

    await axios.put(`${BASE_URL}/banner/${editIndex}`, {
      image: url,
      link: editBannerLink,
    });

    setEditIndex(null);
    setEditBannerFile(null);
    setEditBannerLink("");
    fetchData();

    // ✅ SweetAlert success
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Banner updated successfully",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch {
    alert("Update failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">🏷️ Promo Section Management</h1>

      {/* BANNER TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Banner Images</h2>
        <h5>128px width</h5>
        <h5>48px height</h5>

        <table className="min-w-full border border-gray-200 text-sm mt-5">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border text-center">#</th>
              <th className="p-2 border">Preview</th>
              <th className="p-2 border">Link</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.bannerImages?.map((item, index) => (
              <>
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border">
                    <img src={item.image} className="w-32 h-12 object-cover rounded" />
                  </td>
                 <td className="p-2 border max-w-[200px] truncate">
  <a
    href={item.link}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline block truncate"
    title={item.link}
  >
    {item.link}
  </a>
</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => {
                        setEditIndex(index);
                        setEditBannerLink(item.link);
                      }}
                      className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBanner(index)}
                      className="ml-2 px-3 py-1 bg-red-500 text-white rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {/* EDIT ROW */}
                {editIndex === index && (
                  <tr className="bg-gray-50">
                    <td colSpan="4" className="p-3 border">
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="text"
                          value={editBannerLink}
                          onChange={(e) => setEditBannerLink(e.target.value)}
                          className="border px-3 py-1 rounded w-64"
                          placeholder="Banner Link"
                        />
                        <input
                          type="file"
                          onChange={(e) => setEditBannerFile(e.target.files[0])}
                        />
                        <button
                          onClick={updateBanner}
                          className="px-4 py-1 bg-blue-600 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditIndex(null)}
                          className="px-4 py-1 bg-gray-300 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}

            {/* ADD NEW BANNER */}
            <tr>
              <td colSpan="4" className="p-3 border bg-gray-50">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={newBannerLink}
                    onChange={(e) => setNewBannerLink(e.target.value)}
                    className="border px-3 py-1 rounded w-64"
                    placeholder="Banner link"
                  />
                  <input type="file" onChange={(e) => setNewBanner(e.target.files[0])} />
                  <button
                    onClick={addBanner}
                    className="px-4 py-2 bg-indigo-600 text-white rounded"
                  >
                    Add Banner
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SIDE PROMO */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Side Promo</h2>

        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">Preview</th>
              <th className="p-2 border">Alt Text</th>
              <th className="p-2 border">Link</th> {/* <-- added */}
              <th className="p-2 border">Upload New</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="p-2 border">
                {data.sidePromo?.image ? (
                  <img src={data.sidePromo.image} className="w-24 h-12 object-cover rounded" />
                ) : (
                  "No image"
                )}
              </td>

              <td className="p-2 border">
                <input
                  type="text"
                  value={sideAlt}
                  onChange={(e) => setSideAlt(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
              </td>

              <td className="p-2 border">
                <input
                  type="text"
                  value={sideLink}
                  onChange={(e) => setSideLink(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                  placeholder="Side promo link"
                />
              </td>

              <td className="p-2 border">
                <input type="file" onChange={(e) => setSidePromoFile(e.target.files[0])} />
              </td>

              <td className="p-2 border text-center">
                <button
                  onClick={updateSidePromo}
                  className="px-4 py-1 bg-purple-600 text-white rounded"
                >
                  Update
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
