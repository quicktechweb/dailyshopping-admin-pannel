import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageWrapper from "../PageWrapper/PageWrapper";
import useAuth from "../../../../Hooks/useAuth";
const ITEMS_PER_PAGE = 5;
const ActiveCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [winners, setWinners] = useState({});
  const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const {user}=useAuth();

  // Fetch user's coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/coupons/my", {
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

  // Fetch winners
  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/coupons/winners");
        const data = await res.json();
        if (data.success) {
          const winnerMap = {};
          data.winners.forEach((w) => {
            winnerMap[w.productId] = w;
          });
          setWinners(winnerMap);
        }
      } catch (err) {
        console.error("Error fetching winners:", err);
      }
    };
    fetchWinners();
  }, []);

  // Filter only active coupons (not yet won)
  const activeCoupons = coupons.filter((c) => !winners[c.productId]);

   // Pagination
  const totalPages = Math.ceil(activeCoupons.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCoupons = activeCoupons.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <PageWrapper>
      <section className="pt-6 pb-6 px-4">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 font-medium gap-2"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          🎟️ Active Coupons
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          These coupons are still active — winners haven’t been announced yet.
        </p>

        {/* Loading */}
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : paginatedCoupons.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No active coupons found.
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedCoupons.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-between p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.productImage}
                    alt={c.productName}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-800 text-sm truncate max-w-[180px]">
                      {c.productName}
                    </div>
                    <div className="text-xs text-gray-500">
                      Coupon ID: {c.couponId}
                    </div>
                    <div className="text-xs text-gray-500">
                      Price: ৳{c.price}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-emerald-600 font-semibold">
                    Active
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">
                    Bought on:{" "}
                    {new Date(c.createdAt).toLocaleDateString("en-GB")}
                  </div>
                </div>
              </div>
            ))}

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
        )}
      </section>
    </PageWrapper>
  );
};

export default ActiveCoupons;




  