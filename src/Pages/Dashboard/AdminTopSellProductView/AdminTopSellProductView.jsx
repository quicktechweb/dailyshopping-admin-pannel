import { Fragment, useEffect, useState } from "react";
import axios from "axios";

export default function AdminTopSellProductView() {
  const [orders, setOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Pagination states
  const [perPage, setPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  // Calculate Top Products
  const calculateTopProducts = (ordersData) => {
    const productMap = {};

    ordersData.forEach((order) => {
      order.products.forEach((p) => {
        const name = p.title;
        if (!productMap[name]) {
          productMap[name] = {
            name: p.title,
            img: p.img,
            price: p.ProductPrice,
            count: 0,
            buyers: [],
          };
        }
        productMap[name].count += p.quantity;
        productMap[name].buyers.push({
          customer: order.customer?.name || "Unknown",
          phone: order.customer?.phone || "N/A",
          paymentId: order.paymentId,
          date: new Date(order.createdAt).toLocaleString(),
        });
      });
    });

    const sorted = Object.values(productMap).sort((a, b) => b.count - a.count);
    setTopProducts(sorted);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      calculateTopProducts(orders);
    }
  }, [orders]);

  const toggleViewBuyers = (productName) => {
    setSelectedProduct(selectedProduct === productName ? null : productName);
  };

  // Pagination Logic
  const totalPages = Math.ceil(topProducts.length / perPage);
  const paginatedProducts = topProducts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          🏆 Top Selling Products
        </h1>
        <p className="text-gray-500 mt-1">
          View top performing products & buyer details in real-time.
        </p>
      </div>

      {/* 🔽 Pagination Settings */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-600">
            Show Products:
          </label>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded-lg px-3 py-1.5 bg-white shadow-sm text-sm"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={250}>250</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm font-semibold text-gray-700">
            Page {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Product</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Total Sold</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300">
            {paginatedProducts.map((product, i) => (
              <Fragment key={product.name}>
                <tr
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50 transition`}
                >
                  <td className="px-4 py-3 font-medium">
                    {(currentPage - 1) * perPage + i + 1}
                  </td>

                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {product.name}
                  </td>

                  <td className="px-4 py-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-700">
                    ৳ {product.price}
                  </td>

                  <td className="px-4 py-3 font-bold text-green-600 text-lg">
                    {product.count}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleViewBuyers(product.name)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium shadow transition ${
                        selectedProduct === product.name
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {selectedProduct === product.name ? "Hide Buyers" : "View Buyers"}
                    </button>
                  </td>
                </tr>

                {/* Buyers List */}
                {selectedProduct === product.name && (
                  <tr className="table-row bg-gray-50">
                    <td colSpan="6" className="px-4 py-4">
                      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-inner">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-3 py-2 text-left text-sm font-semibold text-gray-600">#</th>
                              <th className="px-3 py-2 text-left text-sm font-semibold text-gray-600">Customer</th>
                              <th className="px-3 py-2 text-left text-sm font-semibold text-gray-600">Phone</th>
                              <th className="px-3 py-2 text-left text-sm font-semibold text-gray-600">Payment ID</th>
                              <th className="px-3 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-100 bg-white">
                            {product.buyers.map((buyer, idx) => (
                              <tr key={idx} className="hover:bg-indigo-50 transition">
                                <td className="px-3 py-2 text-sm">{idx + 1}</td>
                                <td className="px-3 py-2 text-sm">{buyer.customer}</td>
                                <td className="px-3 py-2 text-sm">{buyer.phone}</td>
                                <td className="px-3 py-2 text-sm">{buyer.paymentId}</td>
                                <td className="px-3 py-2 text-sm">{buyer.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bottom */}
      <div className="flex items-center justify-center mt-6 gap-3">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm font-semibold text-gray-700">
          Page {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
