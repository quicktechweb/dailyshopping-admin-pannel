import { useState, useEffect } from "react";
import axios from "axios";

const MessageSender = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [type, setType] = useState("sms");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("https://dailyshopping-backend.onrender.com/api/message/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  const handleSend = async () => {
    if (!selectedUsers.length || !message) {
      alert("Select users & enter message");
      return;
    }

    if (type === "email" && !title) {
      alert("Please enter email title");
      return;
    }

    await axios.post("https://dailyshopping-backend.onrender.com/api/message/send", {
      userIds: selectedUsers,
      title,
      message,
      type,
    });

    alert("Message sent successfully!");

    // Reset all fields
    setSelectedUsers([]);
    setType("sms");
    setTitle("");
    setMessage("");
    setSearch("");
  };

  // Filter users safely
  const filteredUsers = users.filter((u) => {
    const email = u.email || "";
    const phone = u.phoneNumber || "";
    return email.toLowerCase().includes(search.toLowerCase()) || phone.includes(search);
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-xl font-bold mb-4">Send Bulk SMS / Email</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by Email or Phone"
        className="w-full border p-2 rounded mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Select Users */}
      <label className="font-semibold">Select Users</label>
      <select
        multiple
        className="w-full border p-2 rounded mb-3 h-40"
        value={selectedUsers}
        onChange={(e) =>
          setSelectedUsers([...e.target.selectedOptions].map((o) => o.value))
        }
      >
        {filteredUsers.map((u) => (
          <option key={u._id} value={u._id}>
            {u.displayName} — {u.email} — {u.phoneNumber}
          </option>
        ))}
      </select>

      {/* Type */}
      <label className="font-semibold mt-3 block">Send as</label>
      <select
        className="w-full border p-2 rounded mb-4"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="sms">SMS</option>
        <option value="email">Email</option>
      </select>

      {/* Email Title */}
      {type === "email" && (
        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Email Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      )}

      {/* Message */}
      <textarea
        className="w-full border p-2 rounded mb-4 h-32"
        placeholder="Write your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
      >
        Send Now
      </button>
    </div>
  );
};

export default MessageSender;
