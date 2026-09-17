import { useState, useEffect } from "react";
import axios from "axios";

export default function PixelAdmin() {
  const [pixelId, setPixelId] = useState("");
  const [savedPixelId, setSavedPixelId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load existing Pixel ID
  useEffect(() => {
    const fetchPixel = async () => {
      try {
        const res = await axios.get("https://dailyshopping-backend.onrender.com/api/pixel");
        if (res.data && res.data.pixelId) {
          setPixelId(res.data.pixelId);
          setSavedPixelId(res.data.pixelId);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchPixel();
  }, []);

  // Save / Update Pixel ID
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pixelId.trim()) {
      setMessage("Pixel ID cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://dailyshopping-backend.onrender.com/api/pixel", { pixelId });
      setSavedPixelId(res.data.pixel.pixelId); // Update savedPixelId
      setMessage("Pixel ID saved successfully!");
    } catch (err) {
      console.log(err);
      setMessage("Failed to save Pixel ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Facebook Pixel Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Pixel ID</label>
          <input
            type="text"
            value={pixelId}
            onChange={(e) => setPixelId(e.target.value)}
            placeholder="Enter Pixel ID"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded font-semibold text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Saving..." : "Save Pixel ID"}
        </button>
      </form>

      {message && <p className="mt-3 text-sm text-green-600">{message}</p>}

      {savedPixelId && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
          <h3 className="text-gray-800 font-semibold mb-2">Current Pixel ID:</h3>
          <p className="text-gray-700">{savedPixelId}</p>
        </div>
      )}
    </div>
  );
}
