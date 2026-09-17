import { useState } from "react";
import axios from "axios";

const ImageHashUpdate = () => {
  const [productId, setProductId] = useState("");
  const [hashInput, setHashInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    if (!productId || !hashInput) {
      setMessage("❌ Product ID and Image Hash required");
      return;
    }

    const imagesHash = hashInput
      .split(",")
      .map(h => h.trim())
      .filter(Boolean);

    try {
      setLoading(true);
      setMessage("");

      await axios.patch(
        `https://dailyshopping-backend.onrender.com/api/products/${productId}/images-hash`,
        { imagesHash }
      );

      setMessage("✅ Image hash updated successfully");
      setHashInput("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update image hash");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Update Image Hash
        </h2>

        {/* Product ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Product ID
          </label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="6986df16ba826e67509fb3bd"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
          />
        </div>

        {/* Image Hash */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Image Hash
          </label>
          <textarea
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
            placeholder="hash1, hash2, hash3"
            rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
          />
          <p className="text-xs text-gray-500 mt-1">
            Multiple hash হলে comma (,) দিয়ে আলাদা করো
          </p>
        </div>

        {/* Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Image Hash"}
        </button>

        {/* Message */}
        {message && (
          <p className="mt-4 text-sm text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageHashUpdate;
