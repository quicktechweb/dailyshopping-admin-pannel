import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import CustomerAddress from './UserAddress';
import CartOrder from './UserBooking';
import { FaEye, FaTrashAlt } from "react-icons/fa";

const UpdateOrder = () => {
    const [ordering, setOrder] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const ordersPerPage = 50;
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = ordering
  .filter(order =>
    order.customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  .filter(order =>
    dateFilter ? order.createdAt.split('T')[0] === dateFilter : true
  );

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders');
            const pendingOrders = res.data.filter(order => order.status === "pending");
            setOrder(pendingOrders);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };


    const [fraudData, setFraudData] = useState({});
const calculateRate = (delivered, total) => {
  if (!total || total === 0) return "0%";
  return ((delivered / total) * 100).toFixed(0) + "%";
};

const getFraudCheck = async (phone) => {
  if (fraudData[phone]) return; // ক্যাশ করা থাকলে আবার কল হবে না 🔥

  try {
    const res = await axios.post("http://localhost:5000/api/fraudcheck", { phone });
    setFraudData(prev => ({
      ...prev,
      [phone]: calculateRate(res.data.total_delivered, res.data.total_parcels)
    }));
  } catch (err) {
    setFraudData(prev => ({ ...prev, [phone]: "N/A" }));
  }
};

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/api/ordersdata/${id}`);
                    setOrder(ordering.filter(order => order._id !== id));
                    Swal.fire('Deleted!', 'Order has been deleted.', 'success');
                    if (selectedOrder?._id === id) setSelectedOrder(null);
                } catch (err) {
                    Swal.fire('Error!', 'Failed to delete the order.', 'error');
                }
            }
        });
    };

    const pageCount = Math.ceil(filteredOrders.length / ordersPerPage);
const displayedOrders = filteredOrders.slice(
  currentPage * ordersPerPage,
  (currentPage + 1) * ordersPerPage
);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className="container mx-auto p-6">
            
           <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
  {/* 🟢 Left: Status Badge */}
  <div className="text-center md:text-left">
    <span
      className={`px-5 py-2.5 text-white rounded-full shadow-md font-medium ${
        ordering.length === 0
          ? 'bg-gradient-to-r from-red-500 to-pink-500'
          : 'bg-gradient-to-r from-green-500 to-emerald-600'
      }`}
    >
      {ordering.length === 0 ? 'My Order Not Found' : 'Customer'}
    </span>
  </div>

  <div className="flex flex-wrap items-center gap-3 mt-3 md:mt-0">

  {/* Status Filter */}
  

  {/* Date Filter */}
  <input
    type="date"
    value={dateFilter}
    onChange={(e) => setDateFilter(e.target.value)}
    className="px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

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

  {/* 🔵 Right: Total Orders */}
  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-right">
    Total Orders <span className="text-blue-600">{ordering.length}</span>
  </h1>
</div>


          
            {/* Premium Table */}
         <div className="overflow-x-auto  shadow-md border border-gray-200 bg-white/95 backdrop-blur-sm">
  <table className="w-full text-sm text-left border-collapse">
    <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 uppercase tracking-wide">
      <tr>
        <th className="px-4 py-3 border font-semibold text-xs">Customer</th>
        <th className="px-4 py-3 border font-semibold text-xs">Total Price</th>
        <th className="px-4 py-3 border font-semibold text-xs">Phone</th>
        <th className="px-4 py-3 border font-semibold text-xs">Status</th>
        <th className="px-4 py-3 border font-semibold text-xs">Address</th>
        <th className="px-4 py-3 border font-semibold text-xs">Date</th>
        <th className="px-4 py-3 border font-semibold text-xs text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {displayedOrders.map((order, index) => (
        <tr
          key={order._id}
          className={`border-b ${
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          } hover:bg-blue-50 transition-all duration-200`}
        >
          <td className="px-4 py-2 border font-medium text-gray-800 whitespace-nowrap">
            {order.customer.name}
          </td>
          <td className="px-4 py-2 border text-gray-700 whitespace-nowrap">
            BDT {order.totals.grandtotal}
          </td>
         <td className="px-4 py-2 border text-gray-700 whitespace-nowrap">
  <div className="flex items-center gap-2">
    {order.customer.phone}

    {/* 🔥 FraudCheck Button */}
    <button
      className="px-2 py-0.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
      onClick={() => getFraudCheck(order.customer.phone)}
    >
      Check
    </button>

    {/* 📊 Delivery Rate Show */}
    {fraudData[order.customer.phone] && (
      <span className="text-green-600 font-bold ml-1">
        {fraudData[order.customer.phone]}
      </span>
    )}
  </div>
</td>

       <td className="px-4 py-2 border">
  <span className={`px-3 py-1 rounded-full text-xs font-semibold 
    ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
      order.status === 'pending' ? 'bg-amber-100 text-red-600' : 
      'bg-gray-100 text-gray-700'}`}>
    {order.status}
  </span>
</td>



          <td className="px-4 py-2 border text-gray-700 truncate max-w-[180px]">
            {order.customer.address}
          </td>
           <td className="px-4 py-2 border">
  {new Date(order.createdAt).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</td>
          <td className="px-4 py-2 border text-center">
            <div className="flex justify-center gap-2">
              {/* 👁️ View */}
              <button
                onClick={() => setSelectedOrder(order)}
                className="p-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-110 hover:shadow-md transition-transform"
                title="View Order"
              >
                <FaEye size={13} />
              </button>

              {/* 🗑️ Delete */}
              <button
                onClick={() => handleDelete(order._id)}
                className="p-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white hover:scale-110 hover:shadow-md transition-transform"
                title="Delete Order"
              >
                <FaTrashAlt size={13} />
              </button>
            </div>
          </td>
        </tr>
      ))}
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


            {/* Pagination Controls */}
            <div className="mt-6 flex justify-center">
                <ReactPaginate
                    previousLabel={"← Previous"}
                    nextLabel={"Next →"}
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    containerClassName={"flex items-center space-x-2"}
                    previousClassName={
                        "px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-sm font-medium transition"
                    }
                    nextClassName={
                        "px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-sm font-medium transition"
                    }
                    activeClassName={"bg-blue-500 text-white !px-4 !py-2 rounded-md"}
                    pageLinkClassName={
                        "px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition text-sm"
                    }
                />
            </div>

            {/* Modal for Order Details */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                        onClick={() => setSelectedOrder(null)}
                    />
                    <div className="relative bg-white shadow-2xl w-11/12 max-w-3xl p-8 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6 border-b pb-3">
                            <h2 className="text-2xl font-semibold text-gray-800">Order Details</h2>
                            <button
                                className="text-red-500 font-bold text-2xl hover:text-red-700"
                                onClick={() => setSelectedOrder(null)}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomerAddress
                                order={selectedOrder}
                                handleDelete={handleDelete}
                                onStatusUpdate={(updatedOrder) => {
                                    if (updatedOrder.status !== "pending") {
                                        setOrder(ordering.filter(o => o._id !== updatedOrder._id));
                                        setSelectedOrder(null);
                                    } else {
                                        setOrder(ordering.map(o => o._id === updatedOrder._id ? updatedOrder : o));
                                    }
                                }}
                            />
                            <CartOrder cart={selectedOrder.products} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateOrder;
