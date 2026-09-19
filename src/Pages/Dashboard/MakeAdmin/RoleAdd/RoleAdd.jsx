import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const features = [
  { key: "Admin", label: "Admin" },
  { key: "LandingPage", label: "LandingPage" },
  { key: "UserList", label: "UserList" },
  { key: "UserOrder", label: "UserOrder" },
  { key: "Coupon", label: "Coupon" },
  { key: "TopSell", label: "Top Sell" },
  { key: "CompanyAccount", label: "CompanyAccount" },
  { key: "CompanySettings", label: "CompanySettings" },
  { key: "Category", label: "Category" },
  { key: "Inventory", label: "Inventory" },
  { key: "Supplier", label: "Supplier" },
  { key: "Purchase", label: "Purchase" },
  { key: "Notification", label: "Notification" },
  { key: "SocialMedia", label: "SocialMedia" },
];

export default function RoleManager() {
  const [roles, setRoles] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/roles");
      setRoles(res.data.roles);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch roles", "error");
    }
  };

  const toggleFeature = (featureKey) => {
    setPermissions(prev => {
      const prevFeature = prev[featureKey] || { enabled: false };
      return { ...prev, [featureKey]: { enabled: !prevFeature.enabled } };
    });
  };

  const editRole = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setPermissions(role.permissions || {});
  };

  const saveRole = async () => {
    if (!roleName.trim()) return Swal.fire("Warning", "Role name cannot be empty", "warning");
    try {
      if (editingRole) {
        const res = await axios.put(`http://localhost:5000/roles/${editingRole._id}`, {
          name: roleName,
          permissions
        });
        setRoles(prev => prev.map(r => r._id === editingRole._id ? res.data.role : r));
        Swal.fire("Updated", "Role updated successfully", "success");
      } else {
        const res = await axios.post("http://localhost:5000/roles", {
          name: roleName,
          permissions
        });
        setRoles(prev => [...prev, res.data.role]);
        Swal.fire("Added", "Role added successfully", "success");
      }
      setEditingRole(null);
      setRoleName("");
      setPermissions({});
    } catch (err) {
      Swal.fire("Error", "Failed to save role", "error");
    }
  };

  const deleteRole = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This role will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!"
    });
    if (confirm.isConfirmed) {
      await axios.delete(`http://localhost:5000/roles/${id}`);
      setRoles(prev => prev.filter(r => r._id !== id));
      Swal.fire("Deleted!", "Role has been deleted.", "success");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Role & Permissions Manager</h2>

      {/* Role Form */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={roleName}
          onChange={e => setRoleName(e.target.value)}
          placeholder="Enter role name"
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          className={`px-6 py-2 rounded-lg text-white ${editingRole ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"}`}
          onClick={saveRole}
        >
          {editingRole ? "Update" : "Add"}
        </button>
        {editingRole && <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={() => { setEditingRole(null); setRoleName(""); setPermissions({}); }}>Cancel</button>}
      </div>

      {/* Permission Editor */}
      {editingRole && (
        <div className="mb-6 grid gap-4">
          <h3 className="text-xl font-semibold">Permissions for {editingRole.name}</h3>
          {features.map(f => {
            const featureData = permissions[f.key] || { enabled: false };
            return (
              <div key={f.key} className="border p-3 rounded shadow flex items-center gap-3">
                <input type="checkbox" checked={featureData.enabled} onChange={() => toggleFeature(f.key)} />
                <span className="font-semibold">{f.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Role List */}
      <ul className="space-y-3">
        {roles.map(role => (
          <li key={role._id} className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-lg shadow-sm">
            <span className="font-medium text-gray-700">{role.name}</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-[#19745B] text-white rounded-lg" onClick={() => editRole(role)}>Role Permission</button>
              <button className="px-3 py-1 bg-red-500 text-white rounded-lg" onClick={() => deleteRole(role._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
