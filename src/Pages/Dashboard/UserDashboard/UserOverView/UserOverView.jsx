import {
  FaShoppingCart,
  FaTicketAlt,
  FaCheckCircle,
  FaWallet,
  FaMoneyBillWave,
  FaCheck,
  FaCopy,
  FaUserFriends,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";

const UserOverView = () => {
  const navigate = useNavigate();
  const { user, refetchUser } = useAuth();
  const refferalid = user?.myrefferalcode;
const [totalCoupons, setTotalCoupons] = useState(0);
  const [requests, setRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [wins, setWins] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [copied, setCopied] = useState(false);
  const [winners, setWinners] = useState({});
  const [referrals, setReferrals] = useState([]);
const [totalReferrals, setTotalReferrals] = useState(0);


const fetchReferrals = async () => {
  if (!user?.myrefferalcode) return;

  try {
    const res = await axios.get("http://localhost:5000/api/auth/alluser");
    if (res.data.success) {
      // Filter users whose referralCode matches this user's myrefferalcode
      const myReferrals = res.data.users.filter(
        (u) => u.referralCode === user.myrefferalcode
      );
      setReferrals(myReferrals);
      setTotalReferrals(myReferrals.length);
    }
  } catch (err) {
    console.error("Failed to fetch referrals", err);
  }
};


  // -------------------- Fetch API data --------------------
  const fetchRequests = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/wallet/my-requests/${user._id}`);
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/wallet/add-history/${user._id}`);
      setTransactions(res.data.history || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyOrders = async () => {
    if (!user) return;
    try {
      const res = await axios.get("http://localhost:5000/api/my-orders", {
        params: { userAuth: user?.email || user?.phoneNumber },
      });
      setMyOrders(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

 const fetchCoupons = async () => {
  if (!user) return;
  try {
    const res = await axios.get("http://localhost:5000/api/coupons/my", {
      params: { email: user?.email || "", phone: user?.phoneNumber || "" },
    });
    if (res.data.success) {
      const fetchedCoupons = res.data.coupons || [];
      setCoupons(fetchedCoupons);

      // ✅ Sum the quantities for the dashboard card
      const totalQty = fetchedCoupons.reduce((sum, c) => sum + (c.quantity || 1), 0);
      setTotalCoupons(totalQty); // create a state to store total quantity
    }
  } catch (err) {
    console.error("Failed to fetch coupons", err);
  }
};


  const fetchWins = async () => {
    if (!user) return;
    try {
      const res = await axios.get("http://localhost:5000/api/coupons/winners");
      const data = res.data;
      if (data.success) {
        // Create a winners map
        const winnerMap = {};
        data.winners.forEach((w) => {
          winnerMap[w.productId] = w;
        });
        setWinners(winnerMap);

        // Filter user's wins
        const myWins = data.winners.filter(
          (w) =>
            w.userPhone === user?.phoneNumber ||
            w.username?.toLowerCase() === user?.name?.toLowerCase() ||
            w.useremail?.toLowerCase() === user?.email?.toLowerCase()
        );
        setWins(myWins || []);
      }
    } catch (err) {
      console.error("Failed to fetch wins", err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchTransactions();
    fetchMyOrders();
    fetchCoupons();
    fetchWins();
    fetchReferrals();
  }, [user]);

  // -------------------- Copy Referral --------------------
    const referralLink = `${window.location.origin}/newregister?ref=${refferalid}`;

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Active coupons = user coupons which are not yet won
  const activeCoupons = coupons.filter((c) => !winners[c.productId]);

  // -------------------- Stats --------------------
  const stats = [
    {
      title: "My Orders",
      value: myOrders.length,
      icon: <FaShoppingCart />,
      color: "from-[#4ade80] to-[#16a34a]",
      path: "/dashboard/myorder",
    },
    {
  title: "Total Coupons",
  value: totalCoupons, // use summed quantity
  icon: <FaTicketAlt />,
  color: "from-[#38bdf8] to-[#0284c7]",
  path: "/dashboard/totalcoupon",
},

    {
      title: "Active Coupon Result",
      value: activeCoupons.length,
      icon: <FaCheckCircle />,
      color: "from-[#facc15] to-[#ca8a04]",
      path: "/dashboard/activecoupon",
    },
    {
      title: "Total Wins",
      value: wins.length,
      icon: <FaCheckCircle />,
      color: "from-[#a855f7] to-[#7e22ce]",
      path: "/dashboard/totalwins",
    },
    {
      title: "Wallet Balance",
      value: `$${user?.walletBalance?.toFixed(2) || 0}`,
      icon: <FaWallet />,
      color: "from-[#fb7185] to-[#e11d48]",
      path: "/dashboard/wallet",
    },
    {
      title: "Withdraw",
      value: requests.length,
      icon: <FaMoneyBillWave />,
      color: "from-[#14b8a6] to-[#0d9488]",
      path: "/dashboard/withdraw",
    },
    {
  title: "My Referrals",
  value: totalReferrals,
  icon: <FaUserFriends/>,
  color: "from-[#f472b6] to-[#d946ef]",
  path: "/dashboard/refferallist", // page to see details
}

  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight mb-1">
            Welcome Back 👋
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base">
            Here’s an overview of your activity and wallet summary
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              onClick={() => navigate(stat.path)}
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white/80 backdrop-blur-md shadow-md border border-white/40 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${stat.color}`}></div>
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <p className="text-[11px] sm:text-sm text-gray-500 font-medium">{stat.title}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-tr ${stat.color} text-white shadow-md`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* order + withdraw part start  */}
       {/* Orders + Wallet Section */}
<div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
  {/* Orders Section */}
  <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border border-white/40 p-4 sm:p-6">
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
      🛍️ My Orders
    </h2>
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="min-w-full text-left text-xs sm:text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="py-3 px-3 sm:px-4">Order ID</th>
            {/* <th className="py-3 px-3 sm:px-4">Product</th> */}
            <th className="py-3 px-3 sm:px-4">Status</th>
            <th className="py-3 px-3 sm:px-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {myOrders.slice(0, 5).map((order, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition duration-200">
              <td className="py-3 px-3 sm:px-4 font-medium text-gray-700">
                {order?.paymentId}
              </td>
              {/* <td className="py-3 px-3 sm:px-4">{order.productName || order.product}</td> */}
              <td
                className={`py-3 px-3 sm:px-4 font-semibold ${
                  order.status === "Delivered" ? "text-emerald-600" : "text-yellow-600"
                }`}
              >
                {order.status}
              </td>
              <td className="py-3 px-3 sm:px-4 text-gray-600">
                {new Date(order.createdAt || order.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
          {myOrders.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-center text-gray-500">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  

  {/* Wallet Section */}
 <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border border-white/40 p-4 sm:p-6 flex flex-col">
  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5">
    💰 Wallet Overview
  </h2>

  <div className="flex justify-between items-center mb-4">
    <span className="text-gray-600 text-sm font-medium">Balance</span>
    <span className="text-2xl sm:text-3xl font-bold text-emerald-600">
      ${user?.walletBalance?.toFixed(2) || 0}
    </span>
  </div>

  <div className="flex flex-col gap-3">
    <Link to="/dashboard/wallet">
    <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all text-sm sm:text-base">
      Add Funds
    </button>
    </Link>
    
    <Link to="/dashboard/withdraw">
    <button className="w-full bg-white border border-emerald-600 text-emerald-700 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-sm hover:shadow-md text-sm sm:text-base">
      Withdraw
    </button>
    </Link>
  </div>
</div>

</div>


        {/* Referral Code */}
        <div className="mt-4 space-y-4">
      {/* Referral Link Box */}
    

      {/* Display referral code */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-center justify-between">
        <div>
          <h2 className="text-gray-700 text-sm font-medium">My Referral Code</h2>
          <p className="text-sm font-semibold text-emerald-600 mt-1 tracking-wide">
            {refferalid || "—"}
          </p>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(refferalid);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
            copied ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 hover:bg-gray-200 text-gray-600"
          }`}
        >
          {copied ? (
            <>
              <FaCheck className="text-emerald-600" /> Copied
            </>
          ) : (
            <>
              <FaCopy /> Copy
            </>
          )}
        </button>
      </div>

        <div className="flex flex-col  sm:flex-row items-center justify-between gap-2">
        <div className="flex-1 bg-white text-black rounded-lg p-4 break-words">
          <a
            href={referralLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline hover:text-gray-200"
          >
            {referralLink}
          </a>
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            copied ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 hover:bg-gray-200 text-gray-600"
          }`}
        >
          {copied ? (
            <>
              <FaCheck /> Copied
            </>
          ) : (
            <>
              <FaCopy /> Copy Link
            </>
          )}
        </button>
      </div>
    </div>
      </div>
    </div>
  );
};

export default UserOverView;
