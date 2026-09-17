import { useEffect, useState } from "react";
import axios from "axios";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null); 

  const [form, setForm] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    birthday: "",
    gender: "",
    address: "",          // ✅ new state field
  });

  // Load user from localStorage & API

   // Upload image (same as banner upload)
const uploadToImgBB = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("https://dailyshopping-backend.onrender.com/upload", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();

    if (!json?.success) {
      throw new Error(json.message || "Image upload failed");
    }

    return json.url;

  } catch (err) {
    alert(err.message);
    throw err;
  }
};

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    if (!stored?._id) return;
    axios
      .get(`https://dailyshopping-backend.onrender.com/api/auth/me/${stored._id}`)
      .then((res) => {
        const u = res.data.user;
        setUser(u);
        setForm({
          displayName: u.displayName || "",
          email: u.email || "",
          phoneNumber: u.phoneNumber || "",
          birthday: u.birthday || "",
          gender: u.gender || "",
          address: u.address || "",   // ✅ populate
        });
      })
      .catch((err) => console.error("Profile load error:", err));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

 const handleSave = async () => {
  if (!user?._id) return;

  try {
    let avatarURL = user.avatar;

    // ✅ upload image same as banner upload
    if (newAvatar) {
      avatarURL = await uploadToImgBB(newAvatar);
    }

    const updatedData = {
      displayName: form.displayName,
      birthday: form.birthday,
      gender: form.gender,
      address: form.address,
      avatar: avatarURL,
    };

    const res = await axios.put(
      `https://dailyshopping-backend.onrender.com/api/auth/update/${user._id}`,
      updatedData
    );

    // update state
    setUser(res.data.user);

    // update localStorage
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setEditing(false);
    setNewAvatar(null);

    alert("✅ Profile updated successfully");

  } catch (err) {
    console.error(err);
    alert("❌ Profile update failed");
  }
};


  if (!user) return <p className="text-center mt-10">Loading…</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden md:flex">
        {/* Left panel */}
        {/* LEFT PANEL */}
<div className="md:w-1/3 bg-[#19745B] flex flex-col items-center justify-center p-8 relative">

  <img
    src={
      newAvatar
        ? URL.createObjectURL(newAvatar)
        : user.avatar ||
          "https://e7.pngegg.com/pngimages/348/800/png-clipart-man-wearing-blue-shirt-illustration-computer-icons-avatar-user-login-avatar-blue-child-thumbnail.png"
    }
    alt="Avatar"
    className="w-32 h-32 rounded-full border-4 border-white shadow-md mb-4 object-cover"
  />

  {editing && (
    <label className="mt-3 cursor-pointer bg-white text-[#19745B] px-4 py-1 rounded-xl shadow hover:bg-gray-100 transition">
      Change Photo
     <input
  type="file"
  accept="image/*"
  className="hidden"
  onChange={(e) => setNewAvatar(e.target.files[0])}
/>
    </label>
  )}

  <h2 className="text-white text-2xl font-bold mt-4">
    {user.displayName || "Your Name"}
  </h2>
</div>

        {/* Right panel */}
        <div className="md:w-2/3 p-8 space-y-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            My Profile
          </h1>

          {[
            "displayName",
           
           
            "birthday",
            "gender",
            "address",      // ✅ show in loop
          ].map((field) => (
            <div
              key={field}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4"
            >
              <span className="font-medium text-gray-700 capitalize">
                {field === "displayName"
                  ? "Full Name"
                  : field === "phoneNumber"
                  ? "Mobile"
                  : field}
              </span>

             


              {editing ? (
                field === "gender" ? (
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="mt-2 sm:mt-0 border rounded px-3 py-1 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <input
                    type={field === "birthday" ? "date" : "text"}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="mt-2 sm:mt-0 border rounded px-3 py-1 focus:ring-2 focus:ring-indigo-500"
                  />
                )
              ) : (
                <span className="mt-2 sm:mt-0 text-gray-600">
                  {user[field] || `Add ${field}`}
                </span>
              )}
            </div>
          ))}

          <div className="flex space-x-4 pt-6">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
