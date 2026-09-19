import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import PageWrapper from "../PageWrapper/PageWrapper";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../../Shared/Context/AuthProvider";
import { useNotifications } from "../../../../Shared/Context/NotificationContext";

const Wallet = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(AuthContext);

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const [requests, setRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bKash");
  const [withdrawPhone, setWithdrawPhone] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
       const {  setNotifications } = useNotifications(); 
       
  

  // ------------------ Fetch Add Funds History ------------------
  const fetchTransactions = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/wallet/add-history/${user._id}`);
      setTransactions(res.data.history || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------ Fetch Withdraw Requests ------------------
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
    fetchTransactions();
    fetchRequests();
  }, [user]);

  // ------------------ Add Funds ------------------
//   const handleAddFunds = async () => {
//   if (!amount || isNaN(amount) || amount <= 0) {
//     return Swal.fire("Invalid amount!", "Enter a valid positive number.", "warning");
//   }

//   try {
//     setLoading(true);

//     // 1️⃣ Add funds
//     const res = await axios.post("http://localhost:5000/api/wallet/add", {
//       userId: user._id,
//       amount: parseFloat(amount),
//     });

//     // 2️⃣ Update user context + localStorage
//     updateUser({ walletBalance: res.data.walletBalance });

//     // 3️⃣ Show success alert
//     Swal.fire("Success!", res.data.message, "success");
//     setAmount("");

//     // 4️⃣ Fetch latest transactions (if applicable)
//     fetchTransactions();

//     // 5️⃣ Send notification to the user
//     try {
//       const notifPayload = {
//         userId: user._id,
//         title: "Wallet Updated!",
//         message: `Your wallet has been credited with ৳${parseFloat(amount).toFixed(2)}.`,
//       };

//       const notifRes = await axios.post(
//         "http://localhost:5000/api/notification/create",
//         notifPayload
//       );

//       if (notifRes.data.success) {
//         // Update notification context live
//         setNotifications(prev => [notifRes.data.notification, ...prev]);
//       }
//     } catch (notifErr) {
//       console.error("Notification error:", notifErr);
//     }

//   } catch (err) {
//     Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
//   } finally {
//     setLoading(false);
//   }
// };


// ------------------ Add Funds (bKash Integrated) ------------------
 // --- bKash Add Funds flow ---

  console.log(user._id)
  const handleAddFunds = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      return Swal.fire("Invalid amount!", "Enter a valid positive number.", "warning");
    }

    try {
      setLoading(true);

      // create bKash payment on backend
      const res = await axios.post("http://localhost:5000/api/wallet/wallet/create", {
        userId: user._id,
        amount: parseFloat(amount),
        isSandbox: true, // set false in production
      });

      if (!res.data.success) {
        return Swal.fire("Error", res.data.message || "Failed to create payment", "error");
      }

      const { bkashURL, paymentID } = res.data;

      // open bkashURL in a new window (popup)
      const win = window.open(bkashURL, "_blank", "width=450,height=700");

      if (!win) {
        // blocked popup fallback
        window.location.href = bkashURL;
      }

      // Swal.fire("Proceed to payment", "Complete bKash payment in new tab/window.", "info");

      // Listen for when user returns to page (window focus) and refresh wallet once
      const onFocus = async () => {
        // Poll backend for latest wallet balance or fetch user info
        try {
          const userRes = await axios.get(`http://localhost:5000/api/users/${user._id}`); // you should have this route
          if (userRes.data.success && userRes.data.user) {
            updateUser({ walletBalance: userRes.data.user.walletBalance });
            fetchTransactions();
            Swal.fire("Success", "Wallet updated (if payment completed).", "success");
          } else {
            // fallback: try transactions endpoint only
            fetchTransactions();
          }
        } catch (err) {
          console.error("Refresh error:", err);
        } finally {
          window.removeEventListener("focus", onFocus);
        }
      };

      window.addEventListener("focus", onFocus);

      setAmount("");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };


  // ------------------ Withdraw ------------------
  const handleWithdrawSubmit = async () => {
    if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0)
      return Swal.fire("Invalid amount!", "Enter a valid positive number.", "warning");

    if (!withdrawPhone || !/^\d{11}$/.test(withdrawPhone))
      return Swal.fire("Invalid phone!", "Enter a valid 11-digit phone number.", "warning");

    try {
      setWithdrawing(true);
      const res = await axios.post("http://localhost:5000/api/wallet/withdraw-request", {
        userId: user._id,
        amount: parseFloat(withdrawAmount),
        method: withdrawMethod,
        paymentNumber: withdrawPhone,
      });

      // Optionally, update walletBalance immediately if deducted on backend
      if (res.data.walletBalance) {
        updateUser({ walletBalance: res.data.walletBalance });
      }

      Swal.fire("Success!", res.data.message, "success");
      setWithdrawAmount("");
      setWithdrawPhone("");
      setWithdrawMethod("bKash");
      setShowWithdrawModal(false);
      fetchRequests();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setWithdrawing(false);
    }
  };

  // ------------------ Merge Transactions ------------------
  const mergedTransactions = [
    ...transactions.map(tx => ({ type: "add", amount: tx.amount, createdAt: tx.createdAt })),
    ...requests.map(tx => ({
      type: "withdraw",
      amount: tx.amount,
      method: tx.method,
      status: tx.status,
      createdAt: tx.createdAt,
    })),
    ...(user?.referralHistory?.map(ref => ({
      type: "referral",
      amount: ref.amount,
      referredUser: ref.referredUser,
      createdAt: ref.createdAt,
    })) || []),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <PageWrapper>
      <section className="pt-6 pb-6 relative">
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">💰 Wallet</h2>
            <p className="text-sm text-gray-500">Manage your balance and transactions</p>
          </div>
        </div>

        {/* Wallet Card */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
  {/* Total Balance */}
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-2xl transition-shadow duration-300">
    <p className="text-sm text-gray-500 uppercase tracking-wide">Total Balance</p>
    <p className="text-3xl font-bold text-emerald-600 mt-2">
      ৳{user?.walletBalance?.toFixed(2) || "0.00"}
    </p>
  </div>

  {/* Referral Balance */}
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-2xl transition-shadow duration-300">
    <p className="text-sm text-gray-500 uppercase tracking-wide">Referral Balance</p>
    <p className="text-3xl font-bold text-yellow-600 mt-2">
      ৳{user?.referralBalance?.toFixed(2) || "0.00"}
    </p>
  </div>

  {/* Add Balance */}
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-2xl transition-shadow duration-300">
    <p className="text-sm text-gray-500 uppercase tracking-wide">Add Balance</p>
    <p className="text-3xl font-bold text-blue-600 mt-2">
      ৳{user?.addBkashAmount?.toFixed(2) || "0.00"}
    </p>
  </div>
</div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-lg">
          {/* Balance + Add Funds */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
            

            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-32 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleAddFunds}
                disabled={loading}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-700 transition"
              >
                {loading ? "Processing..." : "Add"}
              </button>
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Transaction History</h3>
            {mergedTransactions.length === 0 ? (
              <p className="text-gray-500 text-sm">No transactions yet.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-gray-200">
                {mergedTransactions.map((tx, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center rounded-lg p-3 border ${
                      tx.type === "withdraw"
                        ? tx.status === "approved"
                          ? "border-green-500 bg-green-50"
                          : tx.status === "rejected"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 bg-white"
                        : tx.type === "referral"
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-blue-300 bg-blue-50"
                    }`}
                  >
                    <div className="text-sm font-medium">
                      {i + 1}.{" "}
                      {tx.type === "withdraw"
                        ? `${tx.method} - $${tx.amount}`
                        : tx.type === "referral"
                        ? `Referral Bonus from ${tx.referredUser} - $${tx.amount}`
                        : `Added Funds - $${tx.amount}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString()}{" "}
                      {tx.type === "withdraw" ? `- ${tx.status}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl w-[90%] max-w-md p-6 shadow-xl relative animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Withdraw Request</h2>

              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Enter Amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={withdrawPhone}
                  onChange={(e) => setWithdrawPhone(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdrawSubmit}
                  disabled={withdrawing}
                  className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  {withdrawing ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </PageWrapper>
  );
};

export default Wallet;
