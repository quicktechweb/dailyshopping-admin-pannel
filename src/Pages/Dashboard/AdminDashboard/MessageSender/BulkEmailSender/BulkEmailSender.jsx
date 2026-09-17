import { useState, useEffect } from "react";
import axios from "axios";

const BulkEmailSender = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("https://dailyshopping-backend.onrender.com/api/message/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  const handleSend = async () => {
    if (!selectedUsers.length || !message || !title) {
      alert("Select users & enter title and message");
      return;
    }

    await axios.post("https://dailyshopping-backend.onrender.com/api/message/send", {
      userIds: selectedUsers,
      title,
      message,
      type: "email",
    });

    alert("Email sent successfully!");

    setSelectedUsers([]);
    setTitle("");
    setMessage("");
    setSearch("");
  };

  const filteredUsers = users.filter((u) =>
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-xl font-bold mb-4">Send Bulk Email</h2>

      <input
        type="text"
        placeholder="Search by Email"
        className="w-full border p-2 rounded mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

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
            {u.displayName} — {u.email}
          </option>
        ))}
      </select>

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Email Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border p-2 rounded mb-4 h-32"
        placeholder="Write your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSend}
        className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
      >
        Send Email
      </button>
    </div>
  );
};

export default BulkEmailSender;
