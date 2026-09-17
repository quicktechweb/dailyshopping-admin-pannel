import { useState, useEffect } from "react";

/**
 * AdminReferralSettings
 * Admin panel component - referral er point rate & point-to-taka rate set korar jonno
 *
 * Backend API expected:
 *   GET  /api/admin/referral-settings
 *   PUT  /api/admin/referral-settings   body: { pointsPerReferral, takaPerPoint }
 *
 * tomar app e jodi axios/fetch wrapper thake seta use korte paro,
 * ekhane simple fetch() diye dekhano hoyeche.
 */
export default function AdminReferralSystem() {
  const [pointsPerReferral, setPointsPerReferral] = useState("");
  const [takaPerPoint, setTakaPerPoint] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const API_BASE = "https://dailyshopping-backend.onrender.com/api/refferalsystem/referral-settings";

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setPointsPerReferral(data.data.pointsPerReferral);
        setTakaPerPoint(data.data.takaPerPoint);
      } else {
        setMessage({ type: "error", text: data.message || "Settings load kora jayni" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server e connect kora jaচ্ছে না" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(API_BASE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          pointsPerReferral: Number(pointsPerReferral),
          takaPerPoint: Number(takaPerPoint),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: "Referral settings shofolvabe update hoyeche!" });
      } else {
        setMessage({ type: "error", text: data.message || "Update kora jayni" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Kono ekta error hoyeche, abar try koro" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-1">Referral Settings</h2>
      <p className="text-sm text-gray-500 mb-6">
        Referral point rate ar point-to-taka rate ekhane set koro
      </p>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            1 Referral e koto Point?
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={pointsPerReferral}
            onChange={(e) => setPointsPerReferral(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="ex: 10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            1 Point e koto Taka?
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={takaPerPoint}
            onChange={(e) => setTakaPerPoint(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="ex: 1"
          />
        </div>

        {pointsPerReferral && takaPerPoint && (
          <div className="rounded-lg bg-indigo-50 text-indigo-700 text-sm px-4 py-2">
            1 Referral = {pointsPerReferral} Point = {(pointsPerReferral * takaPerPoint).toFixed(2)} Taka
          </div>
        )}

        {message.text && (
          <div
            className={`text-sm px-4 py-2 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
