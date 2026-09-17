import { useEffect, useState } from "react";
import axios from "axios";

const UpdatePackage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products with specific package names
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/newproductss`); // Adjust endpoint
      const filteredProducts = response.data.filter((product) =>
        ["Top Adds", "Bump Ups", "Urgents"].includes(product.boostingDetails?.packageName)
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
    setLoading(false);
  };

  // Update packageName based on selected action
  const handleUpdate = async (productId, newPackageName) => {
    try {
      const updatedPackage = { packageName: newPackageName };
      const response = await axios.put(
        `http://localhost:5000/api/products/update-package/${productId}`,
        updatedPackage
      );

      if (response.status === 200) {
        alert(`Package name updated to "${newPackageName}" successfully!`);
        fetchProducts(); // Refresh the product list
      }
    } catch (error) {
      console.error("Failed to update package:", error);
      alert("Failed to update package. Please try again.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Update Package Name (Top Adds, Bump Ups, Urgents)
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found with the specified packages.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gradient-to-r from-[#01c0c9] to-[#007cde] text-white">
                <th className="border px-4 py-2 text-left">Image</th>
                <th className="border px-4 py-2 text-left">Model</th>
                <th className="border px-4 py-2 text-left">Bkash Number</th>
                <th className="border px-4 py-2 text-left">Boosting Days</th>
                <th className="border px-4 py-2 text-left">Amount</th>
                <th className="border px-4 py-2 text-left">Current Package</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/150"}
                      alt={product.model}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="border px-4 py-2">{product.model}</td>
                  <td className="border px-4 py-2">{product.boostingDetails.bkashNumber}</td>
                  <td className="border px-4 py-2 text-center">
                    {product.boostingDetails.boostingDays}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {product.boostingDetails.amount}
                  </td>
                  <td className="border px-4 py-2">{product.boostingDetails.packageName}</td>
                  <td className="border px-4 py-2 text-center">
                    {/* Dynamically Render the Correct Button */}
                    <div className="flex flex-col gap-2">
                      {product.boostingDetails.packageName === "Top Adds" && (
                        <button
                          onClick={() => handleUpdate(product._id, "Top Ad")}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Update to Top Ad
                        </button>
                      )}
                      {product.boostingDetails.packageName === "Bump Ups" && (
                        <button
                          onClick={() => handleUpdate(product._id, "Bump Up")}
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                          Update to Bump Up
                        </button>
                      )}
                      {product.boostingDetails.packageName === "Urgents" && (
                        <button
                          onClick={() => handleUpdate(product._id, "Urgent")}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          Update to Urgent
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UpdatePackage;
