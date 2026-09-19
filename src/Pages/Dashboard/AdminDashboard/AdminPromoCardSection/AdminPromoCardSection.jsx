import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:5000/api/promocardsection";

// Upload to ImgBB


const uploadToImgBB = async (file) => {
  if (!file) return "";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch("http://localhost:5000/upload", {
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

export default function AdminPromoCardSection() {
  const [data, setData] = useState({ left: {}, middle: [], right: {} });
  const [loading, setLoading] = useState(false);

  // Selected files and links
  const [selectedLeftFile, setSelectedLeftFile] = useState(null);
  const [selectedLeftLink, setSelectedLeftLink] = useState("");

  const [selectedRightFile, setSelectedRightFile] = useState(null);
  const [selectedRightLink, setSelectedRightLink] = useState("");

  const [selectedMiddleFile, setSelectedMiddleFile] = useState(null);
  const [selectedMiddleLink, setSelectedMiddleLink] = useState("");

  const [editMiddleIndex, setEditMiddleIndex] = useState(null);
  const [editMiddleFile, setEditMiddleFile] = useState(null);
  const [editMiddleLink, setEditMiddleLink] = useState("");

  // Fetch data
  const fetchData = async () => {
    try {
      const res = await axios.get(BASE_URL);
      const apiData = res.data;

      const left = apiData.promoCards.find((c) => c.position === "left") || {};
      const right = apiData.promoCards.find((c) => c.position === "right") || {};
      const middle = apiData.promoCards.find((c) => c.position === "middle")?.images || [];

      setData({ left, right, middle });

      // Set default links
      setSelectedLeftLink(left.link || "");
      setSelectedRightLink(right.link || "");
    } catch {
      Swal.fire("Error", "Failed to load data", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------- Left ----------
  const updateLeft = async () => {
    if (!selectedLeftFile && !selectedLeftLink)
      return Swal.fire("Error", "Select image or enter link", "error");

    setLoading(true);
    try {
      const url = selectedLeftFile ? await uploadToImgBB(selectedLeftFile) : data.left.image;
      await axios.put(`${BASE_URL}/left`, { image: url, link: selectedLeftLink });
      Swal.fire("Success", "Left promo card updated", "success");
      setSelectedLeftFile(null);
      fetchData();
    } catch {
      Swal.fire("Error", "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Right ----------
  const updateRight = async () => {
    if (!selectedRightFile && !selectedRightLink)
      return Swal.fire("Error", "Select image or enter link", "error");

    setLoading(true);
    try {
      const url = selectedRightFile ? await uploadToImgBB(selectedRightFile) : data.right.image;
      await axios.put(`${BASE_URL}/right`, { image: url, link: selectedRightLink });
      Swal.fire("Success", "Right promo card updated", "success");
      setSelectedRightFile(null);
      fetchData();
    } catch {
      Swal.fire("Error", "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Middle ----------
  const addMiddle = async () => {
    if (!selectedMiddleFile && !selectedMiddleLink)
      return Swal.fire("Error", "Select image or enter link", "error");

    setLoading(true);
    try {
      const url = selectedMiddleFile ? await uploadToImgBB(selectedMiddleFile) : "";
      await axios.post(`${BASE_URL}/middle`, { image: url, link: selectedMiddleLink });
      Swal.fire("Success", "Middle promo card added", "success");
      setSelectedMiddleFile(null);
      setSelectedMiddleLink("");
      fetchData();
    } catch {
      Swal.fire("Error", "Add failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateMiddle = async () => {
    if (editMiddleIndex === null) return;

    setLoading(true);
    try {
      const url = editMiddleFile ? await uploadToImgBB(editMiddleFile) : data.middle[editMiddleIndex].image;
      await axios.put(`${BASE_URL}/middle/${editMiddleIndex}`, { image: url, link: editMiddleLink });
      Swal.fire("Success", "Middle promo card updated", "success");
      setEditMiddleFile(null);
      setEditMiddleLink("");
      setEditMiddleIndex(null);
      fetchData();
    } catch {
      Swal.fire("Error", "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteMiddle = async (index) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Delete this middle card?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmResult.isConfirmed) return;

    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/middle/${index}`);
      Swal.fire("Deleted!", "Middle promo card deleted.", "success");
      fetchData();
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Promo Card Section Admin</h1>

      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-2 border text-left">Position</th>
            <th className="p-2 border text-left">Preview</th>
            <th className="p-2 border text-left">Upload New / Link</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Left */}
          <tr className="hover:bg-gray-50">
            <td className="p-2 border">Left</td>
            <td className="p-2 border">
              {data.left.image ? (
                <a href={data.left.link || "#"} target="_blank" rel="noreferrer">
                  <img src={data.left.image} alt={data.left.alt || "Left"} className="w-28 h-12 object-cover rounded" />
                </a>
              ) : (
                <span className="text-gray-400">No image</span>
              )}
            </td>
            <td className="p-2 border flex flex-col gap-2">
              <input type="file" onChange={(e) => setSelectedLeftFile(e.target.files[0])} />
              <input type="text" placeholder="Enter link" value={selectedLeftLink} onChange={(e) => setSelectedLeftLink(e.target.value)} className="border px-2 py-1 rounded"/>
            </td>
            <td className="p-2 border text-center">
              <button onClick={updateLeft} disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                {loading ? "Updating..." : "Update"}
              </button>
            </td>
          </tr>

          {/* Right */}
          <tr className="hover:bg-gray-50">
            <td className="p-2 border">Right</td>
            <td className="p-2 border">
              {data.right.image ? (
                <a href={data.right.link || "#"} target="_blank" rel="noreferrer">
                  <img src={data.right.image} alt={data.right.alt || "Right"} className="w-28 h-12 object-cover rounded" />
                </a>
              ) : (
                <span className="text-gray-400">No image</span>
              )}
            </td>
            <td className="p-2 border flex flex-col gap-2">
              <input type="file" onChange={(e) => setSelectedRightFile(e.target.files[0])} />
              <input type="text" placeholder="Enter link" value={selectedRightLink} onChange={(e) => setSelectedRightLink(e.target.value)} className="border px-2 py-1 rounded"/>
            </td>
            <td className="p-2 border text-center">
              <button onClick={updateRight} disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                {loading ? "Updating..." : "Update"}
              </button>
            </td>
          </tr>

          {/* Middle */}
          {data.middle.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border">Middle {index + 1}</td>
              <td className="p-2 border">
                {item.image && (
                  <a href={item.link || "#"} target="_blank" rel="noreferrer">
                    <img src={item.image} alt={`Middle ${index}`} className="w-28 h-12 object-cover rounded" />
                  </a>
                )}
              </td>
              <td className="p-2 border flex flex-col gap-2">
                {editMiddleIndex === index ? (
                  <>
                    <input type="file" onChange={(e) => setEditMiddleFile(e.target.files[0])} />
                    <input type="text" placeholder="Enter link" value={editMiddleLink} onChange={(e) => setEditMiddleLink(e.target.value)} className="border px-2 py-1 rounded"/>
                  </>
                ) : null}
              </td>
              <td className="p-5 border text-center flex gap-2 justify-center">
                {editMiddleIndex === index ? (
                  <>
                    <button onClick={updateMiddle} className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Save</button>
                    <button onClick={() => setEditMiddleIndex(null)} className="px-2 py-1 bg-gray-300 rounded text-sm">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditMiddleIndex(index); setEditMiddleLink(item.link || ""); }} className="px-2 py-1 bg-[#19745B] text-white rounded hover:bg-yellow-700 text-sm">Edit</button>
                    <button onClick={() => deleteMiddle(index)} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}

          {/* Add new Middle */}
          <tr className="hover:bg-gray-50">
            <td className="p-2 border" colSpan={2}></td>
            <td className="p-2 border flex flex-col gap-2">
              <input type="file" onChange={(e) => setSelectedMiddleFile(e.target.files[0])} />
              <input type="text" placeholder="Enter link" value={selectedMiddleLink} onChange={(e) => setSelectedMiddleLink(e.target.value)} className="border px-2 py-1 rounded"/>
            </td>
            <td className="p-2 border">
              <button onClick={addMiddle} disabled={loading} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
                {loading ? "Adding..." : "Add Middle Card"}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
