import { useState, useEffect } from "react";
import axios from "axios";

const BulkSMSSender = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/message/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  const handleSend = async () => {
    if (!selectedUsers.length || !message) {
      alert("Select users & enter message");
      return;
    }

    await axios.post("http://localhost:5000/api/message/send", {
      userIds: selectedUsers,
      message,
      type: "sms",
    });

    alert("SMS sent successfully!");

    setSelectedUsers([]);
    setMessage("");
    setSearch("");
  };

  const filteredUsers = users.filter((u) =>
    (u.phoneNumber || "").includes(search)
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-xl font-bold mb-4">Send Bulk SMS</h2>

      <input
        type="text"
        placeholder="Search by Phone"
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
            {u.displayName} — {u.phoneNumber}
          </option>
        ))}
      </select>

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
        Send SMS
      </button>
    </div>
  );
};

export default BulkSMSSender;
