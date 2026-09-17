import { useState, useEffect } from "react";
import axios from "axios";

const LowStock = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://dailyshopping-backend.onrender.com/api/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://dailyshopping-backend.onrender.com/api/orders");
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

  // Filter low stock products (≤5)
   const lowStockProducts = products.filter((product) => {
    const remainingStock = (product.stock || 0) - getOrderedQuantity(product);
    const warningLimit = product.stockWarning; // default 5 if stockWarning not set
    return remainingStock <= warningLimit;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Low Stock Products (≤ 5)</h1>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved Orders</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Warning</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lowStockProducts.map((product) => {
              const orderedQty = getOrderedQuantity(product);
              const remainingStock = (product.stock || 0) - orderedQty;

              return (
                <tr key={product._id} className="hover:bg-gray-50 bg-red-100">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{product.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product.categoryName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">${product.ProductPrice || product.productPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{orderedQty}</td>
                  <td className={`px-6 py-4 whitespace-nowrap font-semibold ${remainingStock > 0 ? "text-green-600" : "text-red-600"}`}>
                    {remainingStock >= 0 ? remainingStock : 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-600 font-bold">⚠️ Low Stock</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStock;
