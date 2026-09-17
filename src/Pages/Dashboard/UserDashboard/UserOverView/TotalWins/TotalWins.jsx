import { useEffect, useState } from "react";
import { FaArrowLeft, FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageWrapper from "../PageWrapper/PageWrapper";
import useAuth from "../../../../Hooks/useAuth";
const ITEMS_PER_PAGE = 5;
const TotalWins = () => {
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWins = async () => {
      try {
        const res = await axios.get("https://dailyshopping-backend.onrender.com/api/coupons/winners");
        const data = res.data;

        if (data.success && user) {
          // Filter wins by this user (phone or username)
          const myWins = data.winners.filter(
            (w) =>
              w.userPhone === user?.phoneNumber ||
              w.username?.toLowerCase() === user?.name?.toLowerCase() ||
              w.useremail?.toLowerCase() === user?.email?.toLowerCase()
          );
          setWins(myWins);
        }
      } catch (err) {
        console.error("Failed to fetch wins", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWins();
  }, [user]);

   // Pagination logic
  const totalPages = Math.ceil(wins.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedWins = wins.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <PageWrapper>
      <section className="pt-6 pb-8 px-4">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 font-medium gap-2"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">🏆 Total Wins</h2>
            <p className="text-sm text-gray-500">Your winning history</p>
          </div>
          <div className="flex items-center bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm">
            <FaTrophy className="mr-1" /> Total Wins: {wins.length}
          </div>
        </div>

        {/* Loading or Empty */}
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading your wins...</div>
        ) : paginatedWins.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <FaTrophy className="mx-auto text-4xl mb-3 text-gray-300" />
            <p>No wins yet. Keep trying! 🍀</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {paginatedWins.map((w) => (
              <div
                key={w._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm flex justify-between items-center p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={w.productImage}
                    alt={w.productName}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-800 text-sm truncate max-w-[160px]">
                      {w.productName} {w.round ? `(Round ${w.round})` : ""}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(w.createdAt).toLocaleDateString("en-GB")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-600 font-bold text-sm">Winner</div>
                  <div className="text-xs text-gray-500">{w.couponId}</div>
                </div>
              </div>
            ))}

             {/* Pagination Controls */}
            {totalPages > 1 && (
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
            )}
          </div>
        )}
      </section>
    </PageWrapper>
  );
};

export default TotalWins;




