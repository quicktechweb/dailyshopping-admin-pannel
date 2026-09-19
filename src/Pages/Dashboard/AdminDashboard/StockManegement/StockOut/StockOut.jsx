import { useState, useEffect } from "react";
import axios from "axios";

const StockOut = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate ordered quantity only for approved orders
  const getOrderedQuantity = (product) => {
    return orders.reduce((acc, order) => {
      if (order.status === "approved") {
        order.products.forEach((p) => {
          if (p.title === product.title) {
            acc += p.quantity || 1;
          }
        });
      }
      return acc;
    }, 0);
  };

  // Remaining stock calculation
  const getRemainingStock = (product) => (product.stock || 0) - getOrderedQuantity(product);

  // Filter products which are fully out of stock (remaining stock <= 0)
  const stockOutProducts = products.filter((product) => getRemainingStock(product) <= 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">❌ Stock Out Products</h1>

      {stockOutProducts.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stockOutProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 bg-red-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{product.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product.categoryName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">${product.ProductPrice || product.productPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-600 font-bold">0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 font-semibold">All products have stock available.</p>
      )}
    </div>
  );
};

export default StockOut;
