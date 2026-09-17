import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const SuperAdmin = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  // Fetch all roles
  const fetchRoles = async () => {
    try {
      const res = await axios.get("https://dailyshopping-backend.onrender.com/roles");
      setRoles(res.data.roles);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch roles", "error");
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("https://dailyshopping-backend.onrender.com/api/auth/alluser");
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error(err);
    }
  };

  // Assign role → sync permissions automatically
 const handleRoleChange = async (user, roleName) => {
  console.log("Selected role:", roleName, "for user:", user.displayName); // debug

  const role = roles.find(r => r.name === roleName);
  if (!role) {
    console.log("Role not found!");
    return;
  }

  // Merge permissions
  const newPermissions = {
    ...user.permissions, // preserve any extra keys user may have
    ...role.permissions, // override/add role permissions
  };

  try {
    console.log("Sending update request with permissions:", newPermissions);

    const res = await fetch(`https://dailyshopping-backend.onrender.com/api/auth/update-user/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newpartroles: role.name,
        permissions: newPermissions
      }),
    });

    const data = await res.json();
    console.log("Response from server:", data);

    if (data.success) {
      Swal.fire("Updated", `User assigned to role "${role.name}"`, "success");
      setUsers(prev =>
        prev.map(u =>
          u._id === user._id
            ? { ...u, newpartroles: role.name, permissions: newPermissions }
            : u
        )
      );
    }
  } catch (err) {
    console.error("Error updating user:", err);
    Swal.fire("Error", "Failed to assign role", "error");
  }
};


  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Super Admin – Assign Roles</h2>

      <div className="overflow-x-auto mb-5">
        <table className="table-auto w-full border border-gray-300 bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="text-black">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="hover:bg-gray-200 cursor-pointer">
                <td className="border px-4 py-1">{user.displayName}</td>
                <td className="border px-4 py-1">{user.phoneNumber}</td>
                <td className="border px-4 py-1">{user.email}</td>
                <td className="border px-4 py-1">
                  <select
                    value={user.newpartroles || ""}
                    onChange={(e) => handleRoleChange(user, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="">-- Select Role --</option>
                    {roles.map(role => (
                      <option key={role._id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdmin;
