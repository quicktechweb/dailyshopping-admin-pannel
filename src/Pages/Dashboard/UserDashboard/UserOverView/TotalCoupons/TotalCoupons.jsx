import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaTrash } from "react-icons/fa";
import axios from "axios";
import useAuth from "../../../../Hooks/useAuth";
import Swal from "sweetalert2";
import PageWrapper from "../PageWrapper/PageWrapper";

const TotalCoupons = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🧩 Grouping coupons by productId
  const groupedCoupons = coupons.reduce((acc, c) => {
    const key = c.productId;
    if (!acc[key]) {
      acc[key] = {
        productId: c.productId,
        productName: c.productName,
        productImage: c.productImage,
        price: c.price,
        quantity: 0,
        couponIds: [],
        userPhones: [],
        paymentMethods: [],
        createdAt: c.createdAt,
      };
    }
     acc[key].quantity += c.quantity || 1;
    acc[key].couponIds.push(c.couponId);
    if (!acc[key].userPhones.includes(c.userPhone)) acc[key].userPhones.push(c.userPhone);
    if (!acc[key].paymentMethods.includes(c.paymentMethod)) acc[key].paymentMethods.push(c.paymentMethod);
    return acc;
  }, {});

  const groupedList = Object.values(groupedCoupons);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axios.get(`https://dailyshopping-backend.onrender.com/api/coupons/my`, {
          params: { email: user?.email || "", phone: user?.phoneNumber || "" },
        });
        if (data.success) setCoupons(data.coupons);
      } catch (err) {
        console.error("Failed to fetch coupons", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchCoupons();
  }, [user]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Coupon?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#2563eb",
      confirmButtonText: "Yes, Delete",
    });

    if (confirm.isConfirmed) {
      try {
        const { data } = await axios.delete(`https://dailyshopping-backend.onrender.com/api/coupons/${id}`);
        if (data.success) {
          setCoupons((prev) => prev.filter((c) => c._id !== id));
          Swal.fire("Deleted!", "Coupon removed successfully.", "success");
        }
      } catch (err) {
        Swal.fire("Error", "Failed to delete coupon", "error");
      }
    }
  };

  const totalPages = Math.ceil(groupedList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = groupedList.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <PageWrapper>
      <section className="pt-10 pb-20 px-3 md:px-8 bg-gradient-to-br from-gray-50 to-emerald-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition font-medium"
          >
            <FaArrowLeft /> Back
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4 sm:mt-0">
            🎟️ My Coupons
          </h2>
        </div>

        {/* Coupon Table Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-gray-400 animate-pulse text-lg">
              Loading coupons...
            </div>
          ) : groupedList.length === 0 ? (
            <div className="py-16 text-center text-gray-500 text-lg font-medium">
              No coupons found yet.
            </div>
          ) : (
            <>
              {/* 🖥️ Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gradient-to-r from-emerald-100 to-emerald-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-700">#</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Product</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Qty</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Price</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                    <>
      <tbody className="divide-y divide-gray-100">
        {paginatedList.map((c, i) => (
          <Fragment key={c.productId}>
            <tr className="hover:bg-emerald-50 transition-all duration-300">
              <td className="px-4 py-3 text-gray-600">{startIndex + i + 1}</td>
              <td className="px-4 py-3 text-gray-900 font-semibold truncate max-w-[160px]">
                {c.productName}
              </td>
              <td className="px-4 py-3 text-gray-700">{c.quantity}</td>
              <td className="px-4 py-3 font-semibold text-emerald-600">৳{c.price}</td>
              <td className="px-4 py-3">
                <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                  Active
                </span>
              </td>
              <td className="px-4 py-3 flex justify-end gap-2">
                <button
                  onClick={() =>
                    setExpandedRow(expandedRow === c.productId ? null : c.productId)
                  }
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg shadow transition"
                >
                  <FaEye /> View
                </button>
              </td>
            </tr>

            {expandedRow === c.productId && (
              <tr>
                <td colSpan="6" className="bg-white border-t border-emerald-100 px-6 py-1">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 p-3 flex items-center justify-center">
                      <img
                        src={c.productImage}
                        alt={c.productName}
                        className="w-full max-h-36 object-contain rounded-lg transition-transform duration-500 hover:scale-105"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/400x300?text=No+Image")
                        }
                      />
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Coupon Details
                      </h3>
                      <p><strong>Product:</strong> {c.productName}</p>
                      <p><strong>Coupons:</strong> {c.couponIds.join(", ")}</p>
                      <p><strong>Payment Numbers:</strong> {c.userPhones.join(", ")}</p>
                      <p><strong>Payment Methods:</strong> {c.paymentMethods.join(", ")}</p>
                      <p><strong>Purchased At:</strong> {new Date(c.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </Fragment>
        ))}
      </tbody>

      {/* Centered Pagination */}
    
    </>
                </table>
                  <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
              </div>

              {/* 📱 Mobile View */}
              <div className="md:hidden space-y-4 p-2">
                {groupedList.map((c) => (
                  <div
                    key={c.productId}
                    className="bg-white border border-gray-100 rounded-xl shadow p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 text-sm">{c.productName}</h3>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>Qty: {c.quantity}</span>
                      <span>৳{c.price}</span>
                    </div>

                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() =>
                          setExpandedRow(expandedRow === c.productId ? null : c.productId)
                        }
                        className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {expandedRow === c.productId && (
                      <div className="mt-3 border-t pt-2 text-xs text-gray-700 space-y-1">
                        <img
                          src={c.productImage}
                          alt={c.productName}
                          className="w-full max-h-24 object-contain rounded-lg mt-2"
                        />
                        <p><strong>Coupons:</strong> {c.couponIds.join(", ")}</p>
                        <p><strong>Numbers:</strong> {c.userPhones.join(", ")}</p>
                        <p><strong>Methods:</strong> {c.paymentMethods.join(", ")}</p>
                        <p><strong>Date:</strong> {new Date(c.createdAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </PageWrapper>
  );
};

export default TotalCoupons;
