import { useRef, useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotifications } from "../../Shared/Context/NotificationContext";

const Noti = () => {
  const { notifications, setNotifications } = useNotifications();
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`https://dailyshopping-backend.onrender.com/api/notification/read/${id}`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const userId = notifications[0]?.userId;
      if (!userId) return;

      await axios.put(
        `https://dailyshopping-backend.onrender.com/api/notification/read-all/${userId}`
      );

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Click notification to mark as read & navigate
  const handleNotificationClick = (n) => {
    markAsRead(n._id); // mark as read
    navigate("/winnerstatics"); // go to winnerstatics page
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
      >
        <FiBell className="text-2xl text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full animate-pulse shadow">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-xl max-h-96 overflow-y-auto z-50 border border-gray-100">

          {unreadCount > 0 && (
            <div
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium text-blue-600 cursor-pointer hover:bg-gray-50 border-b"
            >
              Mark all as read
            </div>
          )}

          {notifications.length === 0 && (
            <p className="p-4 text-gray-400 text-center">
              No notifications
            </p>
          )}

          {notifications.map(n => (
            <div
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className={`p-3 cursor-pointer ${!n.read ? "bg-gray-50 border-l-4 border-blue-500" : ""}`}
            >
              <p className="font-medium text-gray-800">{n.title}</p>
              <p className="text-gray-600 text-sm truncate">{n.message}</p>
              <span className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Noti;