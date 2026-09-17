import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import CustomerAddress from './UserAddress';
import CartOrder from './UserBooking';
import { FaCheck, FaEye, FaSyncAlt, FaTrashAlt } from "react-icons/fa";
import { useNotifications } from '../../Shared/Context/NotificationContext';
const AllUserOrder = () => {
  const [ordering, setOrder] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
const [statusMap, setStatusMap] = useState({});
    const { setNotifications } = useNotifications();
  const ordersPerPage = 50;
  const [statusFilter, setStatusFilter] = useState("");
const [dateFilter, setDateFilter] = useState("");
const API_KEY = 'hcpm2ucs22epe7q0j4qqaqagqf2y4yx7';
  const SECRET_KEY = '56onyth1a4rwfceproj6ao1o';
  const STEADFAST_URL = 'https://portal.packzy.com/api/v1';
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

   // ---------------- Fetch all orders from backend ----------------
 // ---------------- Fetch all orders from backend ----------------
// Main Fetch Orders
// Unified status fetch
const getUnifiedStatus = async (invoice, tracking_code, consignment_id) => {
  try {
    if (consignment_id) {
      console.log("🔍 Checking by Consignment ID:", consignment_id);
      const res = await axios.get(`${STEADFAST_URL}/status_by_cid/${consignment_id}`, {
        headers: { "Api-Key": API_KEY, "Secret-Key": SECRET_KEY }
      });
      console.log("📦 Consignment Response:", res.data);
      if (res.data?.delivery_status) return res.data.delivery_status;
    }

    if (invoice) {
      console.log("🔍 Checking by Invoice:", invoice);
      const res = await axios.get(`${STEADFAST_URL}/status_by_invoice/${invoice}`, {
        headers: { "Api-Key": API_KEY, "Secret-Key": SECRET_KEY }
      });
      console.log("🧾 Invoice Response:", res.data);
      if (res.data?.delivery_status) return res.data.delivery_status;
    }

    if (tracking_code) {
      console.log("🔍 Checking by Tracking Code:", tracking_code);
      const res = await axios.get(`${STEADFAST_URL}/status_by_trackingcode/${tracking_code}`, {
        headers: { "Api-Key": API_KEY, "Secret-Key": SECRET_KEY }
      });
      console.log("🚚 Tracking Response:", res.data);
      if (res.data?.delivery_status) return res.data.delivery_status;
    }

    return "Unknown";
  } catch (err) {
    console.error("❌ Status fetch failed:", err.response?.data || err);
    return "Unknown";
  }
};


const getConsignment = async (invoice) => {
  try {
    const url = `${STEADFAST_URL}/order_by_invoice/${invoice}`;
    console.log("📦 Fetching Consignment URL:", url);

    const res = await axios.get(url, {
      headers: { "Api-Key": API_KEY, "Secret-Key": SECRET_KEY }
    });

    console.log("🧾 Consignment Response:", res.data);

    if (!res.data?.consignment) {
      console.warn(`❌ No consignment found for invoice ${invoice}`);
      return null;
    }

    return res.data.consignment;

  } catch (err) {
    console.error("❌ Consignment Fetch Error:", err.response?.data || err.message || err);
    return null;
  }
};





// Fetch all orders
const fetchOrders = async () => {
  try {
    const res = await axios.get(
      "https://dailyshopping-backend.onrender.com/api/orders"
    );

    const fullOrders = await Promise.all(
      res.data.map(async (order) => {
        const invoice = `ORD-${order._id}`;

        const consignment = await getConsignment(invoice);

        const consignment_id = consignment?.cid || null;
        const tracking_code =
          consignment?.tracking_code || consignment?.consignment_no || null;

        const delivery_status = await getUnifiedStatus(
          invoice,
          tracking_code,
          consignment_id
        );

        return {
          ...order,
          tracking_code,
          consignment_id,
          delivery_status,
        };
      })
    );

    // ✅ SET ORDERS
    setOrders(fullOrders);

    // ✅ INIT STATUS MAP (IMPORTANT)
    const statusObj = {};
    fullOrders.forEach((order) => {
      statusObj[order._id] = order.status;
    });
    setStatusMap(statusObj);

  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    Swal.fire("Error", "Failed to fetch orders", "error");
  }
};








 const handleUpdate = async (id, newStatus) => {
  try {
    await axios.put(
      `https://dailyshopping-backend.onrender.com/api/orders/${id}/status`,
      { status: newStatus }
    );

    Swal.fire({
      icon: "success",
      title: "Status Updated",
      text: `Order status updated to ${newStatus}`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });

  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to update status", "error");
  }
};



















// ---------------- Get Courier Info (invoice -> consignment) ----------------


// ---------------- Get Courier Status by invoice ----------------
const getCourierStatus = async (orderId) => {
  try {
    const invoice = `ORD-${orderId}`;
    const res = await axios.get(`${STEADFAST_URL}/status_by_invoice/${invoice}`, {
      headers: {
        'Api-Key': API_KEY,
        'Secret-Key': SECRET_KEY
      }
    });
    return res.data?.delivery_status || 'unknown';
  } catch (err) {
    console.error(`Error fetching status for ${orderId}:`, err.response?.data || err);
    return 'unknown';
  }
};

// ---------------- Get Courier Status by tracking code ----------------


  const handleCheckbox = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };


    const handleSelectAll = () => {
    if (selectedOrders.length === displayedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(displayedOrders.map(o => o._id));
    }
  };

  // ---------------- Send selected orders to Steadfast ----------------
 const sendToSteadfast = async () => {
  if (!selectedOrders.length)
    return Swal.fire("No orders selected", "", "warning");

  const ordersToSend = orders.filter(o => selectedOrders.includes(o._id));

  const payload = ordersToSend.map(order => {
    const phone = order.customer?.phone?.replace(/\D/g, "").slice(-11) || "01700000000";
    return {
      invoice: `ORD-${order._id}`,
      recipient_name: order.customer?.name || "N/A",
      recipient_phone: phone,
      recipient_address: order.customer?.address || "Address Missing",
      recipient_city: "Dhaka",
      recipient_state: "Dhaka",
      recipient_postcode: "1200",
      recipient_email: "test@example.com",
      cod_amount: Number(order.totals?.grandtotal) || 0,
      note: order.note || "",
      delivery_type: 0,
    };
  });

  try {
    // STEP 1: Create bulk order in Steadfast
    const res = await axios.post(`${STEADFAST_URL}/create_order/bulk-order`, {
      data: JSON.stringify(payload)
    },{
      headers: {
        "Api-Key": API_KEY,
        "Secret-Key": SECRET_KEY,
        "Content-Type": "application/json"
      }
    });

    console.log("Courier Response:", res.data);

    // STEP 2: Create update payload for DB
    const updates = res.data.data.map(item => ({
      id: item.invoice.replace("ORD-", ""),
      consignment_id: item.consignment_id,
      tracking_code: item.tracking_code,
    }));

    // STEP 3: 🔥 Bulk update to your backend
    const dbUpdate = await axios.put(
      "https://dailyshopping-backend.onrender.com/api/bulk-consignment",
      { orders: updates }
    );

    console.log("DB Update Response:", dbUpdate.data);

    Swal.fire("Success", "Consignment ID saved to orders 🎉", "success");
    fetchOrders();
    setSelectedOrders([]);

  } catch (err) {
    console.error("Error sending:", err.response?.data || err);
    Swal.fire("Error", "Something went wrong", "error");
  }
};



   // ---------------- Refresh single order status ----------------
  const refreshStatus = async (orderId) => {
    const status = await getCourierStatus(orderId);
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, delivery_status: status } : o));
  };

  const filteredOrders = orders
    .filter(order => order.customer?.phone?.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(order => statusFilter ? order.delivery_status?.toLowerCase() === statusFilter.toLowerCase() : true)
    .filter(order => dateFilter ? order.createdAt?.split('T')[0] === dateFilter : true);

  const pageCount = Math.ceil(filteredOrders.length / ordersPerPage);
  const displayedOrders = filteredOrders.slice(currentPage * ordersPerPage, (currentPage + 1) * ordersPerPage);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://dailyshopping-backend.onrender.com/api/ordersdata/${id}`);
          setOrder(ordering.filter(order => order._id !== id));
          Swal.fire('Deleted!', 'Order has been deleted.', 'success');
          if (selectedOrder?._id === id) setSelectedOrder(null);
        } catch (err) {
          Swal.fire('Error!', 'Failed to delete the order.', 'error');
        }
      }
    });
  };

//  const filteredOrders = ordering
//   .filter(order =>
//     order.customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
//   )
//   .filter(order =>
//     statusFilter ? order.status.toLowerCase() === statusFilter.toLowerCase() : true
//   )
//   .filter(order =>
//     dateFilter ? order.createdAt.split('T')[0] === dateFilter : true
//   );


//   const pageCount = Math.ceil(filteredOrders.length / ordersPerPage);
//   const displayedOrders = filteredOrders.slice(currentPage * ordersPerPage, (currentPage + 1) * ordersPerPage);

  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  return (
    <div className="container mx-auto p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
   <div className="mb-4 flex items-center gap-2">
        <button
          onClick={sendToSteadfast}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Send Selected to Steadfast
        </button>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1"
        >
          <FaSyncAlt /> Refresh All Status
        </button>
      </div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="text-center md:text-left flex items-center gap-3">
          <span className={`px-5 py-2.5 rounded-full text-white font-medium shadow-md ${ordering.length === 0 ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-green-500 to-emerald-600'}`}>
            {ordering.length === 0 ? 'Customer' : 'Customer Orders'}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Total Orders <span className="text-blue-600">{filteredOrders.length}</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 md:mt-0">

  {/* Status Filter */}
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">All Status</option>
    <option value="pending">Pending</option>
    <option value="accepted">Accepted</option>
    <option value="intransit">In Transit</option>
    <option value="outfordelivery">Out for delivery</option>
    <option value="delivered">Delivered</option>
    <option value="returned">Returned</option>
    <option value="canceled">Canceled</option>
    <option value="hold">Hold</option>
    <option value="damage">Damage</option>
  </select>

  {/* Date Filter */}
  <input
    type="date"
    value={dateFilter}
    onChange={(e) => setDateFilter(e.target.value)}
    className="px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>


        {/* Search */}
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search by phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"/>
          </svg>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto shadow-md border border-gray-200 bg-white/95 backdrop-blur-sm rounded-lg">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 uppercase text-xs">
            <tr>
               <th className="px-4 py-3 border">
                <input type="checkbox" onChange={handleSelectAll} checked={selectedOrders.length === displayedOrders.length && displayedOrders.length > 0} />
              </th>
              {/* <th className="px-4 py-3 border">Invoice ID</th> */}
              <th className="px-4 py-3 border">Customer</th>
              <th className="px-4 py-3 border">Total Price</th>
              <th className="px-4 py-3 border">CourierStatus</th>
              <th className="px-4 py-3 border">Phone</th>
              <th className="px-4 py-3 border">Date</th>
              <th className="px-4 py-3 border">Update</th>
              <th className="px-4 py-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedOrders.map((order, idx) => (
              <tr key={order._id} className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-all`}>
                  <td className="px-4 py-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={() => handleCheckbox(order._id)}
                  />
                </td>
           {/* <td className="border p-2">
  {order.tracking_code && order.tracking_code !== "Not Found" ? (
    <a 
      href={`https://steadfast.com.bd/t/${order.tracking_code}`} 
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      {order.tracking_code}
    </a>
  ) : (
    "Not Available"
  )}
</td> */}



                <td className="px-4 py-2 border font-medium">{order.customer.name}</td>
                <td className="px-4 py-2 border text-blue-600 font-semibold">৳ {order.totals.grandtotal}</td>
               {/* <td className="px-4 py-2 border">
  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
    order.status === "pending" ? "bg-red-100 text-red-700" :
    order.status === "accepted" ? "bg-green-100 text-green-700" :
    order.status === "intransit" ? "bg-blue-100 text-blue-700" :
    order.status === "outfordelivery" ? "bg-indigo-100 text-indigo-700" :
    order.status === "delivered" ? "bg-emerald-100 text-emerald-700" :
    order.status === "returned" ? "bg-yellow-100 text-yellow-700" :
    order.status === "canceled" ? "bg-gray-100 text-gray-700" :
    order.status === "hold" ? "bg-purple-100 text-purple-700" :
    order.status === "damage" ? "bg-pink-100 text-pink-700" :
    "bg-gray-100 text-gray-700"
  }`}>
    {order.status}
  </span>
</td> */}
 <td className="px-4 py-2 border">
                  {order.delivery_status || 'unknown'}
                  <button className="ml-2 text-sm text-green-600" onClick={() => refreshStatus(order._id)}>Refresh</button>
                </td>

                <td className="px-4 py-2 border">{order.customer.phone}</td>
               <td className="px-4 py-2 border">
  {new Date(order.createdAt).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</td>
<td className="px-2 py-2">
  <div className="flex items-center gap-2 w-[130px]">
    {/* Status Select */}
    <select
      value={statusMap[order._id] || order.status}
      onChange={(e) =>
        setStatusMap((prev) => ({
          ...prev,
          [order._id]: e.target.value,
        }))
      }
      className="
        w-full 
        text-xs 
        px-2 
        py-1.5 
        border 
        rounded-md 
        bg-white 
        focus:outline-none 
        focus:ring-1 
        focus:ring-[#19745B]
      "
    >
      <option value="pending">Pending</option>
      <option value="accepted">Accepted</option>
      <option value="intransit">In Transit</option>
      <option value="outfordelivery">Out</option>
      <option value="delivered">Delivered</option>
      <option value="returned">Returned</option>
      <option value="canceled">Canceled</option>
      <option value="hold">Hold</option>
      <option value="damage">Damage</option>
    </select>

    {/* Update Button */}
    <button
      onClick={() =>
        handleUpdate(order._id, statusMap[order._id])
      }
      title="Update Status"
      className="
        p-2 
        rounded-md 
        bg-[#19745B] 
        text-white 
        hover:bg-green-700 
        transition 
        flex 
        items-center 
        justify-center
      "
    >
      <FaCheck size={16} />
    </button>
  </div>
</td>


                <td className="px-4 py-2 border text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => setSelectedOrder(order)} className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-110 transition"><FaEye size={14} /></button>
                     <button onClick={() => handleDelete(order._id)} className="p-2 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white hover:scale-110 transition"><FaTrashAlt size={14} /></button> 
                  </div>
                </td>
              </tr>
            ))}
            {displayedOrders.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">No orders match your search.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
<div className="mt-4 p-4 bg-gray-50 border-t border-gray-200 rounded-b-md flex justify-start gap-6">
  <span className="font-semibold text-gray-700">
    Total Quantity:{" "}
    <span className="text-blue-600">
      {filteredOrders.reduce(
        (totalQty, order) =>
          totalQty + order.products.reduce((q, p) => q + (p.quantity || 0), 0),
        0
      )}
    </span>
  </span>
  <span className="font-semibold text-gray-700">
    Total Price:{" "}
    <span className="text-green-600">
      BDT{" "}
      {filteredOrders.reduce(
        (totalPrice, order) => totalPrice + (order.totals?.grandtotal || 0),
        0
      )}
    </span>
  </span>
</div>

      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-6 flex justify-center">
          <ReactPaginate
            previousLabel={"← Prev"}
            nextLabel={"Next →"}
            pageCount={pageCount}
            onPageChange={handlePageChange}
            containerClassName="flex items-center gap-2"
            previousClassName="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
            nextClassName="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
            activeClassName="bg-blue-500 text-white px-3 py-1 rounded-lg"
            pageLinkClassName="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100"
          />
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white shadow-2xl w-11/12 max-w-3xl p-8 rounded-xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-semibold text-gray-800">Order Details</h2>
              <button className="text-red-500 font-bold text-2xl hover:text-red-700" onClick={() => setSelectedOrder(null)}>&times;</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomerAddress order={selectedOrder} onStatusUpdate={(updatedOrder) => {
                setOrder(ordering.map(o => o._id === updatedOrder._id ? updatedOrder : o));
                setSelectedOrder({ ...selectedOrder, status: updatedOrder.status });
              }} />
              <CartOrder cart={selectedOrder.products} />
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AllUserOrder;
