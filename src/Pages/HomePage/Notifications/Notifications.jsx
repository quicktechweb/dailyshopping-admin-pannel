// components/Notifications.js
import PropTypes from "prop-types";
import { useState } from "react";

const Notifications = ({ notifications, markAsRead }) => {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative bg-gray-200 p-2 rounded-full"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto z-50">
          {notifications.length === 0 && <p className="p-3">No notifications</p>}
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-3 border-b cursor-pointer ${!n.read ? "bg-gray-100" : ""}`}
            >
              <p className="font-semibold">{n.title}</p>
              <p className="text-sm">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      message: PropTypes.string,
      read: PropTypes.bool.isRequired,
    })
  ).isRequired,
  markAsRead: PropTypes.func.isRequired,
};

export default Notifications;
