import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../Hooks/useAuth";

const ITEMS_PER_PAGE = 5;

// PREMIUM badge color scheme
// const badgeColors = {
//   Silver: "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800",
//   Gold: "bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900",
//   Diamond: "bg-gradient-to-r from-blue-300 to-blue-500 text-white",
//   None: "bg-gray-200 text-gray-500"
// };
const badgeColors = {
  Silver: "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800",
  Gold: "bg-gradient-to-r from-gray-300 to-gray-500 text-black-900",
  Diamond: "bg-gradient-to-r from-gray-300 to-gray-500 text-black-900",
  None: "bg-gray-200 text-gray-500"
};

const ReferralDashboard = () => {
  const { user } = useAuth();
  const myReferralCode = user?.myrefferalcode;
  const navigate = useNavigate();

  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!myReferralCode) return;
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/auth/alluser");
        if (res.data.success) {
          const myReferrals = res.data.users.filter(
            (u) => u.referralCode === myReferralCode
          );
          setReferrals(myReferrals);
        }
      } catch (err) {
        console.error("Failed to fetch referrals", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, [myReferralCode]);

  const totalPages = Math.ceil(referrals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReferrals = referrals.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const allBadges = ["Silver", "Gold", "Diamond"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] to-[#f0f0f0] p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 mb-6 hover:text-black font-medium"
        >
          <FaArrowLeft /> Back
        </button>

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            My Referral Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            View all users who joined using your referral code.
          </p>
        </div>

        {/* BADGE SECTION */}
      {/* BADGE SECTION */}
{/* BADGE SECTION */}
{/* BADGE SECTION */}
<div className="flex items-center justify-center gap-2 mb-8 relative flex-nowrap overflow-x-auto py-2 px-1">

  {allBadges.map((b, index) => {
    const isActive = user?.badge === b;

    return (
      <div key={b} className="flex items-center gap-2 md:gap-4">

        {/* Badge */}
        <span
          className={`
            px-4 py-2 rounded-full font-bold text-xs md:text-sm shadow-md cursor-pointer transition-all duration-300
            ${badgeColors[b]}
            ${isActive
              ? "scale-125 shadow-[0_0_20px_rgba(255,255,0,0.7)] ring-4 ring-yellow-400 animate-pulse"
              : "opacity-70 hover:opacity-100 hover:scale-105"
            }
          `}
        >
          {b} {/* Always show badge name */}
        </span>

        {/* Horizontal line except last badge */}
        {index < allBadges.length - 1 && (
          <div className={`h-[3px] rounded-full w-10 md:w-20
            ${user?.badge === allBadges[index] ? 'bg-yellow-400' : 'bg-gray-300'}`}>
          </div>
        )}
      </div>
    );
  })}
</div>




        {/* LOADING */}
        {loading && <p className="text-gray-600">Loading referrals...</p>}

        {/* EMPTY STATE */}
        {!loading && referrals.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-lg">
            You haven’t referred any users yet.
          </div>
        )}

        {/* TABLE */}
        {!loading && referrals.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              My Referred Users
            </h2>

            <table className="min-w-full text-sm border rounded overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 border">Name / Display</th>
                  <th className="px-4 py-3 border">Phone</th>
                  <th className="px-4 py-3 border">Joined</th>
                </tr>
              </thead>

              <tbody>
                {paginatedReferrals.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 border font-medium">
                      {u.displayName || u.phoneNumber}
                    </td>
                    <td className="px-4 py-3 border">{u.phoneNumber}</td>
                    <td className="px-4 py-3 border">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-3 text-gray-600">
              Total Referrals: <b>{referrals.length}</b>
            </p>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-gray-800 font-semibold">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralDashboard;
