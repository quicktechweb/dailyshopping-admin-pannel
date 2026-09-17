

import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../../Hooks/useAuth";
import { X } from "lucide-react";
import CartOrder from "./CartOrder";
import MyAddress from "./MyAddress";
import Swal from "sweetalert2";

const IMGBB_KEY = "746adaf1da9a1a48b000bec014639aeb";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openReview, setOpenReview] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const API_KEY = 'hcpm2ucs22epe7q0j4qqaqagqf2y4yx7';
    const SECRET_KEY = '56onyth1a4rwfceproj6ao1o';
    const STEADFAST_URL = 'https://portal.packzy.com/api/v1';
    const [orders, setOrders] = useState([]);
console.log(user.displayName)
  // 🧠 Fetch orders
  useEffect(() => {
    if (user?.email || user?.phoneNumber) fetchMyOrders();
  }, [user]);

  
 const fetchMyOrders = async () => {
  try {
    const normalizePhone = (phone) =>
      phone?.startsWith("+88") ? phone.replace("+88", "") : phone || "";
    const userAuth = normalizePhone(user?.phoneNumber) || user?.email;
    if (!userAuth) return;

    const res = await axios.get(
      "https://dailyshopping-backend.onrender.com/api/my-orders",
      { params: { userAuth } }
    );

    // Fetch courier status for orders that have consignment_id
    const fullOrders = await Promise.all(
      res.data.map(async (order) => {
        let delivery_status = null;
        if (order.consignment_id) {
          delivery_status = await getUnifiedStatus(
            `ORD-${order._id}`,
            order.tracking_code,
            order.consignment_id
          );
        }
        return { ...order, delivery_status };
      })
    );

    setMyOrders(fullOrders);

    // ❌ Remove this line so modal doesn't open automatically
    // if (fullOrders.length > 0) setSelectedOrder(fullOrders[0]);
  } catch (err) {
    console.error("Error fetching my orders:", err);
  }
};


  // --- Refresh courier status for single order ---
  const refreshStatus = async (orderId) => {
    try {
      const order = myOrders.find((o) => o._id === orderId);
      if (!order?.consignment_id) return;

      const invoice = `ORD-${order._id}`;
      const latestStatus = await getUnifiedStatus(invoice, order.tracking_code, order.consignment_id);

      setMyOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, delivery_status: latestStatus || o.statusHistory[o.statusHistory.length - 1] }
            : o
        )
      );

      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          delivery_status: latestStatus || prev.statusHistory[prev.statusHistory.length - 1],
        }));
      }
    } catch (err) {
      console.error("Failed to refresh status:", err);
      Swal.fire("Error", "Failed to fetch latest status", "error");
    }
  };

  // --- Unified courier status fetch ---
  const getUnifiedStatus = async (invoice, tracking_code, consignment_id) => {
    try {
      if (consignment_id) {
        const res = await axios.get(`${STEADFAST_URL}/status_by_cid/${consignment_id}`, {
          headers: { "Api-Key": API_KEY, "Secret-Key": SECRET_KEY },
        });
        if (res.data?.delivery_status) return res.data.delivery_status;
      }

      if (invoice) {
        const res = await axios.get(`${STEADFAST_URL}/status_by_invoice/${invoice}`, {
          headers: { "Api-Key": API_KEY, "Secret-Key": SECRET_KEY },
        });
        if (res.data?.delivery_status) return res.data.delivery_status;
      }

      if (tracking_code) {
        const res = await axios.get(`${STEADFAST_URL}/status_by_trackingcode/${tracking_code}`, {
          headers: { "Api-Key": API_KEY, "Secret-Key": SECRET_KEY },
        });
        if (res.data?.delivery_status) return res.data.delivery_status;
      }

      return "pending"; // fallback
    } catch (err) {
      console.error("❌ Status fetch failed:", err.response?.data || err);
      return "pending";
    }
  };

  const handleOpenReview = (product) => {
    setSelectedProduct(product);
    setOpenReview(true);
  };

  // const handlePhotoUpload = (e) => {
  //   const files = Array.from(e.target.files).slice(0, 6); // limit 6 files
  //   setPhotoFiles(files);
  // };

  // 🧩 Upload image(s) to IMGBB and then submit review
  const handleSubmitReview = async () => {
  if (!selectedProduct?._id) return;
  if (!reviewText.trim()) return alert("Please write a review first!");

  try {
    setUploading(true);
    let uploadedUrls = [];

    // Upload each image to IMGBB
    for (const file of photoFiles) {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        formData
      );
      uploadedUrls.push(res.data.data.url);
    }

    // Send review to backend
    await axios.post(
      `https://dailyshopping-backend.onrender.com/api/products/${selectedProduct._id}/review`,
      {
        userAuth: user?.email || user?.phoneNumber,
        username: user?.displayName , // <-- store displayName
        rating,
        comment: reviewText,
        photos: uploadedUrls,
      }
    );

    alert("✅ Review added successfully!");
    setOpenReview(false);
    setReviewText("");
    setPhotoFiles([]);
    fetchMyOrders(); // optional: refresh orders
  } catch (error) {
    console.error("Error adding review:", error);
    alert("❌ Failed to add review");
  } finally {
    setUploading(false);
  }
};




const handleDeleteOrder = async (orderId) => {
  if (!window.confirm("Are you sure you want to delete this order?")) return;

  try {
    await axios.delete(`https://dailyshopping-backend.onrender.com/api/orders/${orderId}`, {
      params: { userAuth: user?.email || user?.phoneNumber },
    });

    alert("✅ Order deleted successfully!");
    // Update the UI after deletion
    setMyOrders((prev) => prev.filter((order) => order._id !== orderId));
    if (selectedOrder?._id === orderId) setSelectedOrder(null);
  } catch (error) {
    console.error("Failed to delete order:", error);
    alert("❌ Failed to delete order");
  }
};

 const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = myOrders.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(myOrders.length / ordersPerPage);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        My Orders{" "}
        <span className="text-gray-500 text-base">({myOrders.length})</span>
      </h1>

      {/* ===== Orders Table ===== */}
 <div className="space-y-6">
      {/* SHOW Orders (5 per page) */}
      {currentOrders.map((order) => (
        <div
          key={order._id}
          className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 p-5"
        >
          {/* Left Section */}
          <div className="flex flex-col md:flex-row md:items-center gap-5 flex-1">
            <div className="flex flex-col gap-2 min-w-[140px] md:flex-row md:items-center md:gap-4">
              <div>
                <p className="text-gray-600 font-medium text-sm truncate">
                  Order ID:{" "}
                  <span className="font-semibold text-gray-800">
                    {order.paymentId}
                  </span>
                </p>

                <p className="text-red-600 font-bold">
                  <span className="price-container">
                    <span className="main-price">
                      <span className="symbol">৳</span>
                      <span className="quicktectaka">
                        {order.totals.grandtotal}
                      </span>
                    </span>
                  </span>
                </p>

                <span
                  className={`mt-1 px-4 py-1.5 rounded-full text-sm font-semibold w-max bg-gradient-to-r ${
                    order.status === "delivered"
                      ? "from-green-100 to-green-200 text-green-800"
                      : order.status === "pending"
                      ? "from-yellow-100 to-yellow-200 text-yellow-800"
                      : "from-gray-100 to-gray-200 text-gray-600"
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>

              {/* Mobile buttons */}
              <div className="flex flex-row gap-2 -mt-12 md:hidden ml-auto">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="bg-gray-800 text-white px-3 py-2 rounded-xl text-xs"
                >
                  Details
                </button>

                <button
                  onClick={() => handleOpenReview(order.products[0])}
                  className="bg-blue-600 text-white px-3 py-2 rounded-xl text-xs"
                >
                  Review
                </button>

                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="bg-red-600 text-white px-3 py-2 rounded-xl text-xs"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Product images */}
            <div className="flex gap-3 overflow-x-auto mt-3 md:mt-0">
              {order.products.map((p, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 rounded-xl border shadow-sm overflow-hidden"
                >
                  <img
                    src={p.img || p.images}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex flex-row gap-3">
            <button
              onClick={() => setSelectedOrder(order)}
              className="bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm"
            >
              Details
            </button>

            <button
              onClick={() => handleOpenReview(order.products[0])}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm"
            >
              Review
            </button>
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-semibold">
            Page {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>




      {/* ===== ORDER DETAILS SECTION ===== */}
     {selectedOrder && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative p-6 md:p-8 max-h-[90vh] overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={() => setSelectedOrder(null)}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition"
      >
        <X size={22} />
      </button>

      {/* তোমার আগের পুরো অংশটা 그대로 রাখো */}
      <div className="mt-8 bg-white p-6 shadow rounded-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Order Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MyAddress order={selectedOrder} />
          <CartOrder cart={selectedOrder.products} />
        </div>

        <div className="mt-5">
    {/* Status Timeline */}
      <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center sm:text-left">Status Timeline</h3>
      <div className="relative flex flex-wrap justify-center sm:justify-between w-full">
        {selectedOrder.statusHistory?.map((stat, index) => {
          const lastIndex = selectedOrder.statusHistory.length - 1;
          const isCompleted = index < lastIndex;
          const isCurrent = index === lastIndex;

          const displayStatus =
            isCurrent && selectedOrder.consignment_id
              ? selectedOrder.delivery_status || stat
              : stat;

          return (
            <div key={index} className="relative flex flex-col items-center flex-1 mb-6 sm:mb-0">
              {/* Connecting Line */}
              {index !== 0 && (
                <div
                  className={`hidden sm:block absolute top-4 left-[-50%] w-full h-1 z-0 ${
                    isCompleted ? "bg-green-500" : isCurrent ? "bg-orange-400" : "bg-gray-300"
                  }`}
                ></div>
              )}

              {/* Status Circle */}
              <div
                className={`z-10 w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isCurrent
                    ? "bg-orange-500 border-orange-500 text-white ring-4 ring-orange-200"
                    : "bg-gray-200 border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? "✓" : isCurrent ? "★" : ""}
              </div>

              {/* Status Label */}
              <p
                className={`text-xs font-medium mt-1 text-center ${
                  isCompleted
                    ? "text-green-600"
                    : isCurrent
                    ? "text-orange-600 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {displayStatus}
              </p>
            </div>
          );
        })}
      </div>

      {/* Refresh Button */}
      {selectedOrder.consignment_id && (
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => refreshStatus(selectedOrder._id)}
          >
            Refresh Courier Status
          </button>
        </div>
      )}
</div>

  

      </div>
    </div>
  </div>
)}


      {/* ===== REVIEW MODAL ===== */}
      {openReview && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setOpenReview(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition"
            >
              <X size={22} />
            </button>

            {/* Header */}
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              Write a Review
            </h2>
            {/* <p className="text-sm text-gray-500 mb-5">
              Delivered on{" "}
              <span className="font-medium text-gray-700">13 Sep 2025</span>
            </p> */}

            {/* Product Info */}
            <div className="flex items-center gap-4 border rounded-lg p-3 mb-5 bg-gray-50">
              <img
                src={selectedProduct?.img || selectedProduct?.images}
                alt={selectedProduct?.title || "Product"}
                className="w-16 h-16 rounded-md object-cover border"
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm md:text-base">
                  {selectedProduct?.title}
                </p>
                {selectedProduct?.size && (
                  <p className="text-xs text-gray-500 mt-1">
                    Size: {selectedProduct.size}
                  </p>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="text-gray-700 text-sm ml-2 font-medium">
                {rating === 5
                  ? "Excellent"
                  : rating === 4
                  ? "Good"
                  : rating === 3
                  ? "Average"
                  : rating === 2
                  ? "Poor"
                  : "Terrible"}
              </span>
            </div>

            {/* Review Textarea */}
            <div className="mb-5">
              <div className="flex justify-between text-sm mb-1">
                <label className="font-medium text-gray-700">
                  Review Detail
                </label>
                <a href="#" className="text-blue-600 hover:underline">
                  Writing Tips
                </a>
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience about this product..."
                className="w-full border rounded-md p-3 h-28 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Upload Section */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos</label>
        <input
          type="file"
          id="upload"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files).slice(0, 6); // max 6 files
            setPhotoFiles(files);
          }}
          className="hidden"
        />
        <label
          htmlFor="upload"
          className="border-2 border-dashed border-gray-300 rounded-md p-6 flex justify-center items-center hover:border-blue-500 transition cursor-pointer"
        >
          <div className="text-center">
            <div className="text-gray-400 mb-2 text-xl">📷</div>
            <p className="text-sm text-gray-500">Click to select up to 6 images</p>
          </div>
        </label>
            
          

              {/* Preview Thumbnails */}
              {photoFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {photoFiles.map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-gray-50 border rounded-md p-3 text-xs text-gray-600 space-y-1">
              <p>
                <strong>Important:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Maximum 6 images can be uploaded</li>
                <li>Image size limit: 5MB each</li>
                <li>Images are reviewed within 24 hours</li>
                <li>
                  Follow{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Community Guidelines
                  </a>{" "}
                  before uploading
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmitReview}
                disabled={uploading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md font-medium transition-all shadow-sm disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
