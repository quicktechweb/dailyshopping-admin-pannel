import { useState } from "react";
import axios from "axios";

const FraudCheck = () => {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!phone) return alert("Please enter a phone number");

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post("https://dailyshopping-backend.onrender.com/api/fraudcheck", { phone });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const calculateRate = (delivered, total) => {
    if (!total || total === 0) return "N/A";
    return ((delivered / total) * 100).toFixed(0) + "%";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg">

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">📦 Fraud Checker</h2>

      {/* Input */}
      <div className="flex gap-3 justify-center">
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-3 rounded-lg w-72 text-center text-lg"
        />
        <button
          onClick={handleCheck}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {error && <p className="text-center text-red-500 mt-3">{error}</p>}

      {/* Result UI */}
      {result && (
        <div className="mt-8">

          {/* Delivery Success Ratio */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-700">Delivery Success Ratio</h3>

            <div className="w-40 h-40 mx-auto mt-3 rounded-full border-[10px] border-green-500 flex items-center justify-center text-3xl font-bold text-green-600">
              {calculateRate(result.total_delivered, result.total_parcels)}
            </div>

            <p className="mt-2 text-gray-600 font-medium">এটি একটি নিরাপদ ডেলিভারি।</p>
            <p className="font-bold text-lg text-gray-700">Excellent</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 text-center mt-8">

            <div className="shadow-md p-5 rounded-xl bg-gray-50">
              <p className="text-blue-600 text-3xl font-bold">{result.total_parcels}</p>
              <p className="text-gray-600 font-semibold">মোট অর্ডার</p>
            </div>

            <div className="shadow-md p-5 rounded-xl bg-gray-50">
              <p className="text-green-600 text-3xl font-bold">{result.total_delivered}</p>
              <p className="text-gray-600 font-semibold">মোট ডেলিভারি</p>
            </div>

            <div className="shadow-md p-5 rounded-xl bg-gray-50">
              <p className="text-red-600 text-3xl font-bold">{result.total_cancel}</p>
              <p className="text-gray-600 font-semibold">মোট বাতিল</p>
            </div>

          </div>

          {/* Courier Wise Table */}
          <div className="mt-10 border rounded-lg overflow-hidden shadow-md">
            <table className="w-full text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 border">Courier Name</th>
                  <th className="p-3 border">Orders</th>
                  <th className="p-3 border">Delivered</th>
                  <th className="p-3 border">Cancelled</th>
                  <th className="p-3 border">Delivery Rate</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(result.apis || {}).map(([name, data]) => {
                  const rate = calculateRate(data.total_delivered_parcels, data.total_parcels);
                  return (
                    <tr key={name} className="border hover:bg-gray-50">
                      <td className="p-3 border font-medium">{name}</td>
                      <td className="p-3 border">{data.total_parcels}</td>
                      <td className="p-3 border text-green-600 font-semibold">{data.total_delivered_parcels}</td>
                      <td className="p-3 border text-red-600 font-semibold">{data.total_cancelled_parcels}</td>
                      <td className="p-3 border font-bold">{rate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
};

export default FraudCheck;
