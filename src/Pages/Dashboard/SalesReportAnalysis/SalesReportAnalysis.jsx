import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import {
  FaCashRegister,
  FaChartLine,
  FaMoneyBillWave,
} from "react-icons/fa";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const gradientColors = [
  "#4caf50",
  "#2196f3",
  "#ff9800",
  "#f44336",
  "#9c27b0",
  "#00bcd4",
  "#ff5722",
];
const getGradientColor = (index) => gradientColors[index % gradientColors.length];

//  Fixed color map for order statuses — each status always gets its own unique color
const STATUS_COLORS = {
  pending: "#facc15",       // yellow
  accepted: "#3b82f6",      // blue
  delivered: "#22c55e",     // green
  intransit: "#f97316",     // orange
  returned: "#a855f7",      // purple
  hold: "#06b6d4",          // cyan
  approved: "#14b8a6",      // teal
  canceled: "#ef4444",      // red
  outfordelivery: "#ec4899",// pink
  Unknown: "#9ca3af",       // gray fallback
};

const FALLBACK_COLORS = [
  "#8b5cf6", "#eab308", "#0ea5e9", "#f43f5e", "#10b981", "#6366f1",
];

//  Generates N visually distinct colors using the golden-angle HSL technique
// No matter how many items (5, 20, 50...), colors will never repeat/clash
// 🆕 Generates N visually distinct colors using the golden-angle HSL technique
// No matter how many items (5, 20, 50...), colors will never repeat/clash
  // Evenly spreads hues across 360° based on exact count — guarantees max separation between colors
const generateDistinctColors = (count) => {
  if (count <= 0) return [];
  const colors = [];
  const hueStep = 360 / count;

  for (let i = 0; i < count; i++) {
    const hue = Math.round(i * hueStep);
    const saturation = i % 2 === 0 ? 75 : 62;
    const lightness = i % 3 === 0 ? 45 : i % 3 === 1 ? 55 : 62;
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
};


const getStatusColor = (status, fallbackIdx) =>
  STATUS_COLORS[status] || FALLBACK_COLORS[fallbackIdx % FALLBACK_COLORS.length];

const SalesReportCharts = () => {
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [winners, setWinners] = useState({});
  const [expenses, setExpenses] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [rawOrders, setRawOrders] = useState([]);
  const [rawCoupons, setRawCoupons] = useState([]);
  const [rawExpenses, setRawExpenses] = useState([]);
  const [users, setUsers] = useState([]);
   const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchCoupons();
    fetchExpenses();
    fetchUserData();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://dailyshopping-backend.onrender.com/api/orders");
      setOrders(res.data || []);
      setRawOrders(res.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch orders", "error");
    }
  };

 useEffect(() => {
    fetchCoupons();
    fetchWinners();
  }, []);


  const fetchCoupons = async () => {
    try {
      const res = await axios.get("https://dailyshopping-backend.onrender.com/api/coupons");
      setCoupons(res.data.coupons || []); // Make sure this is an array
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch coupons", "error");
    }
  };

  // 🆕 Fetch Users for Growth Chart
  const fetchUserData = async () => {
    try {
      const res = await axios.get("https://dailyshopping-backend.onrender.com/api/auth/alluser");

      let userArray = [];
      if (Array.isArray(res.data)) {
        userArray = res.data;
      } else if (Array.isArray(res.data.users)) {
        userArray = res.data.users;
      }

      const monthCount = {};
      userArray.forEach((u) => {
        const createdAt = new Date(u.createdAt);
        const monthKey = createdAt.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        monthCount[monthKey] = (monthCount[monthKey] || 0) + 1;
      });

      const sortedMonths = Object.keys(monthCount).sort(
        (a, b) => new Date(a) - new Date(b)
      );

      const monthlyArr = sortedMonths.map((m) => ({
        month: m,
        count: monthCount[m],
      }));

      setMonthlyData(monthlyArr);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // 📊 Bar Chart Data
  const barData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "New Users",
        data: monthlyData.map((d) => d.count),
        backgroundColor: "#4f46e5",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // ❗ height control এর জন্য এটা important
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "User Growth Analysis (Monthly)",
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };


  const fetchWinners = async () => {
    try {
      const res = await fetch("https://dailyshopping-backend.onrender.com/api/coupons/winners");
      const data = await res.json();
      if (data.success) {
        const winnerMap = {};
        data.winners.forEach((w) => {
          winnerMap[w.productId] = w.username; // store winner name
        });
        setWinners(winnerMap);
      }
    } catch (err) {
      console.error("Error fetching winners:", err);
    }
  };

    const couponPieData = () => {
  if (!Array.isArray(coupons) || coupons.length === 0) return { labels: [], datasets: [] };

  const productStats = {};

  coupons.forEach((c) => {
    if (!productStats[c.productId]) {
      productStats[c.productId] = {
        name: c.productName,
        limit: c.couponlimit || 0,
        sold: 1,
        winner: winners[c.productId] || null,
      };
    } else {
      productStats[c.productId].sold += 1;
    }
  });

  const entries = Object.values(productStats);
  const labels = entries.map((p) => `${p.name} (Sold: ${p.sold}/${p.limit})`);
  const data = entries.map((p) => p.sold);
  const backgroundColor = generateDistinctColors(entries.length); // ✅ এখন আসলেই ইউজ হচ্ছে

  return {
    labels,
    datasets: [
      {
        label: "Coupons Sold",
        data,
        backgroundColor,
        borderWidth: 1,
        borderColor: "#ffffff",
      },
    ],
  };
};


  

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("https://dailyshopping-backend.onrender.com/api/expenses");
      setExpenses(res.data || []);
      setRawExpenses(res.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch expenses", "error");
    }
  };

  const applyFilter = () => {
    if (!startDate && !endDate) {
      Swal.fire("Please select a start and end date");
      return;
    }
    const start = new Date(startDate || endDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate || startDate);
    end.setHours(23, 59, 59, 999);

    const filterByDate = (data, field) =>
      data.filter((item) => {
        const dt = new Date(item[field]);
        return dt >= start && dt <= end;
      });

    setOrders(filterByDate(rawOrders, "createdAt"));
    setCoupons(filterByDate(rawCoupons, "createdAt"));
    setExpenses(filterByDate(rawExpenses, "date"));
  };

   // 🆕 User Growth Chart Data
   // 🔸 Chart Data
 
  // --------------------------
  // Chart Data
  // --------------------------
//   const productPieData = {
//     labels: orders.map((o) => o.customer?.name || "Unknown"),
//     datasets: [
//       {
//         label: "Total Product Quantity",
//         data: orders.map((o) => o.totals.quantity),
//         backgroundColor: orders.map((_, idx) => getGradientColor(idx)),
//         borderWidth: 1,
//       },
//     ],
//   };

//   const couponPieData = {
//     labels: coupons.map((c) => c.productName),
//     datasets: [
//       {
//         label: "Coupon Price",
//         data: coupons.map((c) => c.price),
//         backgroundColor: coupons.map((_, idx) => getGradientColor(idx)),
//         borderWidth: 1,
//       },
//     ],
//   };

const profitBarData = () => {
  const profitByProduct = {};

  orders.forEach((order) => {
    order.products.forEach((p) => {
      if (p.purchasePrice != null) {
        const profit = p.ProductPrice - parseFloat(p.purchasePrice);

        if (!profitByProduct[p.title]) {
          profitByProduct[p.title] = 0;
        }
        profitByProduct[p.title] += profit;
      }
    });
  });

  return {
    labels: Object.keys(profitByProduct), // product name
    datasets: [
      {
        label: "Total Profit per Product",
        data: Object.values(profitByProduct), // total profit
        backgroundColor: Object.keys(profitByProduct).map((_, idx) =>
          getGradientColor(idx)
        ),
        borderWidth: 1,
      },
    ],
  };
};

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      callbacks: {
        label: function (context) {
          let value = context.raw;
          return `${context.label}: ${value.toLocaleString()}`;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: { display: false }, // নিচের text hide
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 500, // প্রতি 500 করে number দেখাবে
      },
      grid: {
        drawBorder: false,
      },
    },
  },
};


// chart options




  
  const expenseBarData = {
    labels: expenses.map((e) => e.category),
    datasets: [
      {
        label: "Expense Amount",
        data: expenses.map((e) => e.amount),
        backgroundColor: expenses.map((_, idx) => getGradientColor(idx)),
      },
    ],
  };

  const grandTotalBarData = {
    labels: ["Products", "Coupons"],
    datasets: [
      {
        label: "Grand Total",
        data: [
          orders.reduce((acc, o) => acc + o?.totals?.grandtotal, 0),
          coupons.reduce((acc, c) => acc + c.price, 0),
        ],
        backgroundColor: ["#6b5b95", "#feb236"],
      },
    ],
  };

 const netRevenueBarData = () => {
  const totalProfit = orders.reduce((acc, o) => {
    let profit = 0;
    o.products.forEach((p) => {
      if (p.purchasePrice != null) {
        profit += p.ProductPrice - parseFloat(p.purchasePrice);
      }
    });
    return acc + profit;
  }, 0);

  const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);

  const netRevenue = totalProfit - totalExpense; // ✅ Profit - Expense

  return {
    labels: ["Profit", "Expense", "Net Revenue"],
    datasets: [
      {
        label: "Amount",
        data: [totalProfit, totalExpense, netRevenue],
        backgroundColor: [
          "#4caf50", // Profit = Green
          "#f44336", // Expense = Red
          netRevenue >= 0 ? "#2196f3" : "#9c27b0", // Net Revenue (নীল, আর নেগেটিভ হলে বেগুনি)
        ],
        borderWidth: 1,
      },
    ],
  };
};




  // Add this inside your component, after fetching orders
  const statusPieData = () => {
  if (!orders.length) return { labels: [], datasets: [] };

  const statusCounts = {};
  orders.forEach((o) => {
    const status = o.status || "Unknown";
    if (!statusCounts[status]) statusCounts[status] = 1;
    else statusCounts[status] += 1;
  });

  const totalOrders = orders.length;
  const statusKeys = Object.keys(statusCounts);

  return {
    labels: statusKeys,
    datasets: [
      {
        label: "Order Status %",
        data: Object.values(statusCounts).map(
          (count) => ((count / totalOrders) * 100).toFixed(2)
        ),
        backgroundColor: statusKeys.map((status, idx) =>
          getStatusColor(status, idx)
        ),
        borderWidth: 1,
      },
    ],
  };
};


 


  return (
    <div className="p-6 bg-gray-50 -mt-10">
      <h1 className="text-3xl font-bold mb-6 mt-16 text-gray-800 flex items-center gap-3">
        <FaChartLine /> Revenue & Profit Dashboard
      </h1>

      {/* Filter Section */}
      <div className=" p-5 rounded-2xl -mt-7 mb-6 flex flex-wrap items-end gap-4 sticky top-0 z-10">
        <div>
          <label className="text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            className="ml-2 border rounded-lg px-3 py-2 hover:border-blue-400 transition"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            className="ml-2 border rounded-lg px-3 py-2 hover:border-blue-400 transition"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          onClick={applyFilter}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl hover:from-green-600 hover:to-green-800 transition shadow-md"
        >
          Apply Filter
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 -mt-8">
        {/* Pie Charts */}
       <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all h-[360px]">
  <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">
    <FaChartLine />Product Order Status
  </h2>
  <Pie data={statusPieData()} />
</div>


      {/* coupon status  */}
   <div className="p-6 h-[360px] bg-white rounded-xl shadow-md">
  {/* Title visible */}
  <h2 className="text-xl font-bold mb-4 text-gray-700">Coupon Sold Summary</h2>
  
  <div className="w-full h-52 mt-16">
    <Pie 
      data={couponPieData()} 
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }, // hide legend/text under chart
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const idx = tooltipItem.dataIndex;
                const product = Object.values(coupons.reduce((acc, c) => {
                  acc[c.productId] = c;
                  return acc;
                }, {}))[idx];
                const winnerName = winners[product.productId];
                return winnerName 
                  ? `${tooltipItem.label} - Winner: ${winnerName}` 
                  : tooltipItem.label;
              },
            },
          },
        },
      }}
    />
  </div>
</div>




   <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all h-[360px]">
  <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-700">
    <FaMoneyBillWave /> Product Wise Profit
  </h2>
  <div className="h-[250px]">
    <Bar data={profitBarData()} options={chartOptions} />
  </div>
</div>




        {/* Bar Charts */}
        <div className="bg-white p-6 rounded-2xl h-[350px] shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">
            <FaCashRegister /> Expenses
          </h2>
          <div className="h-[280px]">
            <Bar data={expenseBarData} options={chartOptions}/>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl h-[350px] shadow-lg hover:shadow-xl transition-all">
  <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">
    <FaChartLine /> Grand Total
  </h2>
  <div className="h-[280px]"> {/* chart container বড় করা হলো */}
    <Bar data={grandTotalBarData} options={chartOptions} />
  </div>
</div>


       <div className="bg-white p-6 rounded-2xl h-[350px] shadow-lg hover:shadow-xl transition-all">
  <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">
    <FaChartLine /> Net Revenue
  </h2>
  <div className="h-[250px]">
    <Bar data={netRevenueBarData()} options={chartOptions} />
  </div>
</div>

  <div className="bg-white p-6 rounded-2xl shadow-md h-[350px]">
   <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">
    <FaChartLine /> User Growth Analysis
  </h2>
      <div className="h-[270px]">
        <Bar data={barData} options={barOptions} />
      </div>
    </div>


      </div>
    </div>
  );
};

export default SalesReportCharts;
