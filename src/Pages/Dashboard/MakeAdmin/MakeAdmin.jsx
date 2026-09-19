import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const MakeAdmin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [admins, setAdmins] = useState([]);

  // Fetch admin list
  useEffect(() => {
    fetch(`http://localhost:5000/getadminlist`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const adminList = data.filter((user) => user.role === "admin");
          setAdmins(adminList);
        } else {
          console.error("Expected an array but got:", data);
        }
      })
      .catch((error) => console.error("Error fetching admins:", error));
  }, []);

  const handleOnBlur = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleAdmin = (e) => {
    e.preventDefault();
    const user = { phoneNumber };

    fetch(`http://localhost:5000/userLogin/admin`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount) {
          Swal.fire("Success", "Admin added successfully!", "success");
          setAdmins([...admins, { phoneNumber, role: "admin" }]);
          setPhoneNumber("");
        }
      })
      .catch((error) => {
        Swal.fire("Error", "Failed to add admin.", "error");
        console.error("Error adding admin:", error);
      });
  };

  const handleDeleteAdmin = (phoneNumber) => {
    fetch(`http://localhost:5000/userLogin/admin/${phoneNumber}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }, // Ensure JSON communication
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deletedCount > 0) {
          Swal.fire("Deleted", "Admin removed successfully!", "success");
          setAdmins((prevAdmins) =>
            prevAdmins.filter((admin) => admin.phoneNumber !== phoneNumber)
          );
        } else {
          Swal.fire("Error", "Admin not found!", "error");
        }
      })
      .catch((error) => {
        console.error("Error deleting admin:", error);
        Swal.fire("Error", "Failed to delete admin!", "error");
      });
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 mt-20 text-white rounded-lg shadow-md">
      <h2 className="text-2xl text-black font-bold mb-4">Make an Admin</h2>

      <form onSubmit={handleAdmin} className="flex gap-4 mb-6">
        <input
          type="text"
          name="phoneNumber"
          placeholder="Enter phone number to make admin"
          value={phoneNumber}
          onBlur={handleOnBlur}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          className="flex-1 p-2 text-black border border-gray-600 rounded"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded">
          Make Admin
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-3 text-black">Admin List</h3>

      <table className="w-full table-auto border border-gray-700">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="border px-4 py-2">Phone Number</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.phoneNumber} className="bg-gray-100 hover:bg-gray-200">
              <td className="border px-4 py-2 text-black">{admin.phoneNumber}</td>
              <td className="border px-4 py-2 text-black">Admin</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDeleteAdmin(admin.phoneNumber)}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MakeAdmin;
