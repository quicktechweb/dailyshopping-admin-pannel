import { FaMoneyBillWave, FaUniversity, FaWallet, FaHistory, FaArrowLeft } from "react-icons/fa";
import PageWrapper from "../PageWrapper/PageWrapper";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../../../../Hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";
import { useNotifications } from "../../../../Shared/Context/NotificationContext";
const ITEMS_PER_PAGE = 5;
const Withdraw = () => {
  const navigate = useNavigate();
  const { user, refetchUser } = useAuth();

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bKash");
  const [withdrawPhone, setWithdrawPhone] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [requests, setRequests] = useState([]);
         const {  setNotifications } = useNotifications(); 
         const [currentPage, setCurrentPage] = useState(1);
  

  // Fetch user's withdraw requests
  const fetchRequests = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/wallet/my-requests/${user._id}`);
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  // Handle withdraw submit
 const handleWithdrawSubmit = async () => {
  if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0)
    return Swal.fire("Invalid amount!", "Enter a valid positive number.", "warning");

  if (!withdrawPhone || !/^\d{11}$/.test(withdrawPhone))
    return Swal.fire("Invalid phone!", "Enter a valid 11-digit phone number.", "warning");

  try {
    setWithdrawing(true);

    // 1️⃣ Submit withdraw request
    const res = await axios.post("http://localhost:5000/api/wallet/withdraw-requestdata", {
      userId: user._id,
      amount: parseFloat(withdrawAmount),
      method: withdrawMethod,
      paymentNumber: withdrawPhone,
    });

    // 2️⃣ Show success
    Swal.fire("Success!", res.data.message, "success");

    // 3️⃣ Reset form
    setWithdrawAmount("");
    setWithdrawPhone("");
    setWithdrawMethod("bKash");
    fetchRequests();
    refetchUser && refetchUser();

    // 4️⃣ Send notification to user
    try {
      const notifPayload = {
        userId: user._id,
        title: "Withdraw Request Submitted!",
        message: `You requested ৳${parseFloat(withdrawAmount).toFixed(2)} via ${withdrawMethod}.`,
      };

      const notifRes = await axios.post(
        "http://localhost:5000/api/notification/create",
        notifPayload
      );

      if (notifRes.data.success) {
        // Live update notification context
        setNotifications(prev => [notifRes.data.notification, ...prev]);
      }
    } catch (notifErr) {
      console.error("Notification error:", notifErr);
    }

  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
  } finally {
    setWithdrawing(false);
  }
};

  // Pagination logic
  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRequests = requests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <PageWrapper>
      <section className="pt-6 pb-10 px-4 sm:px-6 lg:px-10">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 font-medium gap-2"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full shadow-md mb-3">
            <FaMoneyBillWave className="text-2xl" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Withdraw Funds</h2>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Manage your wallet balance and review transaction history
          </p>
        </div>

        {/* Form + History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Withdraw Form */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border border-white/40 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
                <FaWallet className="text-emerald-600" /> Bkash Balance:{" "}
                <span className="text-emerald-600">{user?.addBkashAmount ?.toFixed(2) || "0.00"}</span>
              </h3>

              <div className="mb-5">
                <label className="block text-sm text-gray-600 mb-1">Amount</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={withdrawPhone}
                  onChange={(e) => setWithdrawPhone(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-600 mb-1">Withdraw Method</label>
                <div className="relative">
                  <FaUniversity className="absolute left-3 top-3.5 text-gray-400" />
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="bKash">bKash</option>
                    <option value="Rocket">Rocket</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleWithdrawSubmit}
              disabled={withdrawing}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {withdrawing ? "Processing..." : "Request Withdraw"}
            </button>
          </div>

          {/* Withdraw History */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border border-white/40 p-6 sm:p-8 overflow-x-auto scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <FaHistory className="text-emerald-600" /> Withdraw History
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-gray-100 scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-emerald-600">
              <table className="w-full text-sm min-w-[400px]">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Amount</th>
                    <th className="py-3 px-4 text-left">Method</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRequests.map((item, i) => (
                    <tr
                      key={item._id || i}
                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >
                      {/* Serial number */}
                      <td className="py-3 px-4 font-medium text-gray-700">{i + 1}</td>
                      <td className="py-3 px-4 text-gray-800 font-semibold">{item.amount}</td>
                      <td className="py-3 px-4 text-gray-600">{item.method}</td>
                      <td
                        className={`py-3 px-4 font-semibold ${
                          item.status === "approved"
                            ? "text-emerald-600"
                            : item.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-500"
                        }`}
                      >
                        {item.status}
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                    </tr>
                  ))}

                     {/* Pagination Controls */}
         
                </tbody>

                
              </table>
                 {totalPages > 1 && (
              <div className="flex justify-center items-center mt-4 space-x-4">
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
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Withdraw;
