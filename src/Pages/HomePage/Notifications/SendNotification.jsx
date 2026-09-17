import { useState } from "react";
import axios from "axios";
import useFirebase from "../../Hooks/useFirebase";
import { useNotifications } from "../../Shared/Context/NotificationContext";

const SendNotification = () => {
  const { user } = useFirebase();
  const { notifications, setNotifications } = useNotifications();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return alert("Login first!");

    console.log("Sending notification for user:", user);
    console.log("Title:", title, "Message:", message);

    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://dailyshopping-backend.onrender.com/api/notification/create",
        { userId: user._id, title, message }
      );

      console.log("Backend response:", data);

      if (data.success) {
        // ⚡ Live update state
        setNotifications(prev => {
          const newState = [data.notification, ...prev];
          console.log("Updated notifications state:", newState);
          return newState;
        });

        setTitle("");
        setMessage("");
      } else {
        console.error("Notification not saved:", data.message);
        alert("Error sending notification: " + data.message);
      }
    } catch (err) {
      console.error("Error sending notification:", err.response?.data || err.message);
      alert("Error sending notification");
    } finally {
      setLoading(false);
    }
  };

  console.log("Current notifications:", notifications);

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <input
        className="border p-2 w-full mb-2"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? "Sending..." : "Upload & Notify"}
      </button>
    </form>
  );
};

export default SendNotification;
