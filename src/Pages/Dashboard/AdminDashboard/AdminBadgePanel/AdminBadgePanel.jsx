import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../../../utils/axiosInstance";

export default function AdminBadgePanel() {
  const [badges, setBadges] = useState([]);   // initially empty
  const [name, setName] = useState("");
  const [minCount, setMinCount] = useState("");
  const [maxCount, setMaxCount] = useState("");
  const [editId, setEditId] = useState(null);

  // -----------------------------
  // Fetch badges from backend
  // -----------------------------
  const fetchBadges = async () => {
    try {
      const res = await axiosInstance.get("/admin/badges");
      setBadges(res.data.badges);
    } catch (err) {
      console.error("Failed to fetch badges:", err);
    }
  };

  // Fetch badges on component mount
  useEffect(() => {
    fetchBadges();
  }, []);

  // -----------------------------
  // Add / Update badge
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update existing badge
        await axios.put(`http://localhost:5000/api/admin/badges/${editId}`, { name, minCount, maxCount });
        setEditId(null);
      } else {
        // Create new badge
        await axios.post("http://localhost:5000/api/admin/badges", { name, minCount, maxCount });
      }
      setName(""); setMinCount(""); setMaxCount("");
      fetchBadges(); // Refresh badges
    } catch (err) {
      console.error("Failed to add/update badge:", err);
    }
  };

  // -----------------------------
  // Edit badge
  // -----------------------------
  const handleEdit = (badge) => {
    setEditId(badge._id);
    setName(badge.name);
    setMinCount(badge.minCount);
    setMaxCount(badge.maxCount);
  };

  // -----------------------------
  // Delete badge
  // -----------------------------
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/badges/${id}`);
      fetchBadges();
    } catch (err) {
      console.error("Failed to delete badge:", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Badge Management</h2>

      {/* Badge Form */}
      <form className="mb-6 flex gap-2" onSubmit={handleSubmit}>
        <input className="border p-2 rounded" placeholder="Badge Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input type="number" className="border p-2 rounded" placeholder="Min Count" value={minCount} onChange={e=>setMinCount(e.target.value)} required />
        <input type="number" className="border p-2 rounded" placeholder="Max Count" value={maxCount} onChange={e=>setMaxCount(e.target.value)} required />
        <button type="submit" className="bg-green-600 text-white px-4 rounded">{editId ? "Update" : "Add"}</button>
      </form>

      {/* Badge Table */}
      {badges.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Badge Name</th>
              <th className="border p-2">Min Count</th>
              <th className="border p-2">Max Count</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {badges.map(badge => (
              <tr key={badge._id} className="text-center">
                <td className="border p-2">{badge.name}</td>
                <td className="border p-2">{badge.minCount}</td>
                <td className="border p-2">{badge.maxCount}</td>
                <td className="border p-2 flex justify-center gap-2">
                  <button onClick={()=>handleEdit(badge)} className="bg-yellow-500 text-white px-2 rounded">Edit</button>
                  <button onClick={()=>handleDelete(badge._id)} className="bg-red-500 text-white px-2 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}





