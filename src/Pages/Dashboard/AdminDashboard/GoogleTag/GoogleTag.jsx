import { useState, useEffect } from "react";
import axios from "axios";

export default function GoogleTagAdmin() {
  const [gtmId, setGtmId] = useState("");
  const [savedGtmId, setSavedGtmId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load existing GTM ID
  useEffect(() => {
    const fetchGtm = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/settings/gtm");
        if (res.data && res.data.gtmId) {
          setGtmId(res.data.gtmId);
          setSavedGtmId(res.data.gtmId);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchGtm();
  }, []);

  // Save / Update GTM ID
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gtmId.trim()) {
      setMessage("GTM ID cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/settings/gtm", { gtmId });
      setSavedGtmId(res.data.gtm.gtmId); // Update savedGtmId
      setMessage("GTM ID saved successfully!");
    } catch (err) {
      console.log(err);
      setMessage("Failed to save GTM ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Google Tag Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Google Tag Manager ID</label>
          <input
            type="text"
            value={gtmId}
            onChange={(e) => setGtmId(e.target.value)}
            placeholder="Enter GTM ID (e.g. GTM-XXXXXXX)"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded font-semibold text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Saving..." : "Save GTM ID"}
        </button>
      </form>

      {message && <p className="mt-3 text-sm text-green-600">{message}</p>}

      {savedGtmId && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
          <h3 className="text-gray-800 font-semibold mb-2">Current GTM ID:</h3>
          <p className="text-gray-700">{savedGtmId}</p>
        </div>
      )}
    </div>
  );
}