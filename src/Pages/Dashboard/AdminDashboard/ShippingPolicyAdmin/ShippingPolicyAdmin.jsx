import { useEffect, useState } from "react";
import axios from "axios";

const ShippingPolicyAdmin = () => {
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Fetch data from MongoDB
  const fetchData = async () => {
    try {
      const res = await axios.get("https://dailyshopping-backend.onrender.com/api/shippingpolicy");
      setData(res.data.data); // correct depth
    } catch (err) {
      console.error("Error fetching shipping policy:", err);
    }
  };

  // ✅ Generic field update handler
  const handleFieldChange = (path, value) => {
    const copy = { ...data };
    const keys = path.split(".");
    let obj = copy;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = value;
    setData(copy);
  };

  // ✅ Save updates
  const handleSave = async () => {
    try {
      await axios.put(`https://dailyshopping-backend.onrender.com/api/shippingpolicy/${data._id}`, data);
      alert("Saved successfully!");
      setEditing(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    }
  };

  // ✅ Add / delete sections
  const handleAddSection = (afterIndex) => {
    const copy = [...data.sections];
    copy.splice(afterIndex + 1, 0, { title: "", text: "" });
    setData({ ...data, sections: copy });
  };

  const handleDeleteSection = (idx) => {
    const copy = [...data.sections];
    copy.splice(idx, 1);
    setData({ ...data, sections: copy });
  };

  // ✅ Table handlers
  const handleAddTableHeader = (sectionIdx) => {
    const copy = { ...data };
    if (!copy.sections[sectionIdx].table.headers) copy.sections[sectionIdx].table.headers = [];
    copy.sections[sectionIdx].table.headers.push("New Header");
    setData(copy);
  };

  const handleAddTableRow = (sectionIdx) => {
    const copy = { ...data };
    const colCount = copy.sections[sectionIdx].table.headers.length;
    const newRow = Array(colCount).fill("");
    if (!copy.sections[sectionIdx].table.rows) copy.sections[sectionIdx].table.rows = [];
    copy.sections[sectionIdx].table.rows.push(newRow);
    setData(copy);
  };

  const handleDeleteTableRow = (sectionIdx, rowIdx) => {
    const copy = { ...data };
    copy.sections[sectionIdx].table.rows.splice(rowIdx, 1);
    setData(copy);
  };

  // ✅ Image upload to imgbb
  const handleImageUpload = async (path, file) => {
    if (!file) return;
    const form = new FormData();
    form.append("image", file);
    setUploading(true);

    try {
      const res = await axios.post(
        "https://api.imgbb.com/1/upload?key=ab454291ebee91b49b021ecac51be17c",
        form
      );
      const imageUrl = res.data.data.url;
      handleFieldChange(path, imageUrl);
      alert("Image uploaded successfully!");
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto py-6 px-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shipping Policy Admin</h1>
        <button
          onClick={() => setEditing(!editing)}
          className={`px-4 py-2 rounded text-white ${
            editing
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {editing ? "Cancel Edit" : "Edit"}
        </button>
      </div>

      {/* Page Info */}
      <div className="mb-6 bg-white p-4 shadow rounded">
        <label className="block font-semibold">Page Title</label>
        <input
          disabled={!editing}
          value={data.pageTitle}
          onChange={(e) => handleFieldChange("pageTitle", e.target.value)}
          className={`mt-1 block w-full border rounded p-2 ${
            !editing ? "bg-gray-100" : ""
          }`}
        />

        <label className="block font-semibold mt-2">Subtitle</label>
        <input
          disabled={!editing}
          value={data.subtitle}
          onChange={(e) => handleFieldChange("subtitle", e.target.value)}
          className={`mt-1 block w-full border rounded p-2 ${
            !editing ? "bg-gray-100" : ""
          }`}
        />

        <label className="block font-semibold mt-2">Background Image</label>
        <div className="flex items-center gap-3 mt-2">
          {data.backgroundImage && (
            <img
              src={data.backgroundImage}
              alt="Background"
              className="w-32 h-20 object-cover border rounded"
            />
          )}
          {editing && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload("backgroundImage", e.target.files[0])
                }
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-gray-500">Uploading image...</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sections */}
     {data.sections.map((section, idx) => (
  <div key={idx} className="bg-white shadow rounded p-4 mb-4">
    <h3 className="font-semibold text-lg mb-2">
      Section #{idx + 1} ({section.title})
    </h3>

    <label className="block text-sm mt-2">Title</label>
    <input
      disabled={!editing}
      value={section.title}
      onChange={(e) =>
        handleFieldChange(`sections.${idx}.title`, e.target.value)
      }
      className={`mt-1 block w-full border rounded p-2 ${
        !editing ? "bg-gray-100" : ""
      }`}
    />

    <label className="block text-sm mt-2">Text</label>
    <textarea
      disabled={!editing}
      value={section.text}
      onChange={(e) =>
        handleFieldChange(`sections.${idx}.text`, e.target.value)
      }
      className={`mt-1 block w-full border rounded p-2 ${
        !editing ? "bg-gray-100" : ""
      }`}
    />

    {/* Table */}
    {section.table && (
      <div className="mt-3">
        <h4 className="font-medium mb-2">Table Data</h4>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded mb-2">
            <thead className="bg-gray-100">
              <tr>
                {section.table.headers.map((header, hi) => (
                  <th key={hi} className="border px-2 py-1">
                    <input
                      disabled={!editing}
                      value={header}
                      onChange={(e) =>
                        handleFieldChange(
                          `sections.${idx}.table.headers.${hi}`,
                          e.target.value
                        )
                      }
                      className={`w-full border rounded p-1 ${
                        !editing ? "bg-gray-100" : ""
                      }`}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border px-2 py-1">
                      <input
                        disabled={!editing}
                        value={cell}
                        onChange={(e) =>
                          handleFieldChange(
                            `sections.${idx}.table.rows.${ri}.${ci}`,
                            e.target.value
                          )
                        }
                        className={`w-full border rounded p-1 ${
                          !editing ? "bg-gray-100" : ""
                        }`}
                      />
                    </td>
                  ))}
                  {editing && (
                    <td className="border px-2 py-1">
                      <button
                        onClick={() => handleDeleteTableRow(idx, ri)}
                        className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {editing && (
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleAddTableRow(idx)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                + Add Row
              </button>
              <button
                onClick={() => handleAddTableHeader(idx)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                + Add Header
              </button>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Delete button only for sections added after section 4 */}
    {editing && idx > 3 && (
      <button
        onClick={() => handleDeleteSection(idx)}
        className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete Section
      </button>
    )}
  </div>
))}

{/* Add Section button after section 4 */}
{editing && (
  <div className="mb-4">
    <button
      onClick={() => handleAddSection(3)} // Add new section after section 4
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      + Add Section
    </button>
  </div>
)}


      {/* Save Button */}
      {editing && (
        <button
          onClick={handleSave}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default ShippingPolicyAdmin;
