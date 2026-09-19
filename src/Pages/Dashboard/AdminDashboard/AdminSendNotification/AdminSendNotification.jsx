import { useState } from "react";
import axios from "axios";
import { useNotifications } from "../../../Shared/Context/NotificationContext";

const AdminSendNotification = () => {
  const { notifications, setNotifications } = useNotifications();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
console.log(notifications)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !message) return alert("Please enter title and message!");

    setLoading(true);
    try {
      // 1️⃣ Get all active users
      const usersRes = await axios.get("http://localhost:5000/api/auth/active-users");
      const users = usersRes.data.users || [];

      if (users.length === 0) {
        alert("No active users found!");
        return;
      }

      // 2️⃣ Send notification to each user
      const promises = users.map((u) =>
        axios.post("http://localhost:5000/api/notification/create", {
          userId: u._id,
          title,
          message,
        })
      );

      const results = await Promise.all(promises);

      // 3️⃣ Update frontend notifications state (optional)
      const newNotifications = results
        .filter(res => res.data.success)
        .map(res => res.data.notification);

      setNotifications(prev => [...newNotifications, ...prev]);

      alert("Notification sent to all active users!");

      setTitle("");
      setMessage("");
    } catch (err) {
      console.error("Error sending notification:", err.response?.data || err.message);
      alert("Failed to send notification!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Send Notification
        </h2>

        <div className="flex flex-col space-y-1">
          <label className="text-gray-600 font-medium">Title</label>
          <input
            type="text"
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none"
            placeholder="Enter notification title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-gray-600 font-medium">Message</label>
          <textarea
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none resize-none h-32"
            placeholder="Enter notification message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send to All Users"}
        </button>

       
      </form>
    </div>
  );
};

export default AdminSendNotification;
