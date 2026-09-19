import  { useEffect, useState, Fragment } from "react";

const AllCouponDataShow = () => {
  const [coupons, setCoupons] = useState([]);
  const [winners, setWinners] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  // --- Fetch all coupons ---
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/coupons");
      const data = await res.json();
      if (data.success) setCoupons(data.coupons);
    } catch (err) {
      console.error("Error fetching coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch all winners ---
 const fetchWinners = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/coupons/winners");
    const data = await res.json();
    if (data.success) {
      const winnerMap = {};
      data.winners.forEach((w) => {
        // convert productId and round to string
        const key = `${w.productId.toString()}_R${w.round.toString()}`;
        winnerMap[key] = w; 
      });
      setWinners(winnerMap);
    }
  } catch (err) {
    console.error("Error fetching winners:", err);
  }
};

  useEffect(() => {
    fetchCoupons();
    fetchWinners();
    const interval = setInterval(fetchWinners, 10000); // refresh winners every 10s
    return () => clearInterval(interval);
  }, []);

  // --- Build rounds per product dynamically ---
  const productRounds = {};
  const sortedCoupons = [...coupons].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  sortedCoupons.forEach((c) => {
    const productId = c.productId;
    const limit = c.couponlimit ?? 5; // default 5 if missing

    if (!productRounds[productId]) productRounds[productId] = [];

    const rounds = productRounds[productId];
    let currentRound = rounds[rounds.length - 1];

    if (!currentRound || currentRound.coupons.length >= limit) {
      currentRound = { round: rounds.length + 1, coupons: [], product: c, couponlimit: limit };
      rounds.push(currentRound);
    }

    currentRound.coupons.push(c);
  });

  // Flatten rounds for rendering
  const allRounds = [];
  Object.values(productRounds).forEach((rounds) =>
    rounds.forEach((r) => allRounds.push(r))
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        All Coupon Purchases
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : allRounds.length === 0 ? (
        <div className="py-20 text-center text-gray-500 text-lg font-medium">
          No coupon purchases found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase">#</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase">Product</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase">Round</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase">Total Buys</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase">Winner</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allRounds.map((r, index) => {
                const product = r.product;
                const key = `${product.productId.toString()}_R${r.round.toString()}`;
const winner = winners[key];
                const isLimitReached = r.coupons.length >= r.couponlimit;

                return (
                  <Fragment key={key}>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="w-12 h-12 object-contain rounded border"
                        />
                        <span className="font-medium text-gray-800">{product.productName}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-medium">Round {r.round}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {r.coupons.length} / {r.couponlimit}{" "}
                        {isLimitReached && <span className="text-green-600 font-semibold">✅</span>}
                      </td>
                      <td className="px-4 py-3 text-green-600 font-semibold">
                        {winner ? (
                          <div>
                            {winner.username} ({winner.userPhone}) - {winner.couponId}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setExpanded(expanded === key ? null : key)}
                          className="px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          {expanded === key ? "Hide Users" : "View Users"}
                        </button>
                      </td>
                    </tr>

                    {expanded === key && (
                      <tr>
                        <td colSpan="6" className="px-4 py-3 bg-gray-50">
                          <table className="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-3 py-2 font-semibold">Username</th>
                                <th className="px-3 py-2 font-semibold">Phone</th>
                                <th className="px-3 py-2 font-semibold">Coupon ID</th>
                                <th className="px-3 py-2 font-semibold">Purchased At</th>
                              </tr>
                            </thead>
                            <tbody>
                              {r.coupons.map((c) => (
                                <tr key={c._id} className="hover:bg-gray-50">
                                  <td className="px-3 py-2">{c.username || "-"}</td>
                                  <td className="px-3 py-2">{c.userPhone}</td>
                                  <td className="px-3 py-2">{c.couponId}</td>
                                  <td className="px-3 py-2">{new Date(c.createdAt).toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllCouponDataShow;
