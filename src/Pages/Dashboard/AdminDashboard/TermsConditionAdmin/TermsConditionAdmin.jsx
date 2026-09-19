import { useEffect, useState } from "react";
import axios from "axios";

export default function TermsConditionAdmin() {
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/termscondition");
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFieldChange = (path, value) => {
    const copy = JSON.parse(JSON.stringify(data));
    const parts = path.split(".");
    let cur = copy;
    for (let i = 0; i < parts.length - 1; i++) {
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
    setData(copy);
  };

  const handleAddSection = () => {
    const copy = JSON.parse(JSON.stringify(data));
    copy.sections.push({ title: "", text: "" });
    setData(copy);
  };

  const handleDeleteSection = (idx) => {
    const copy = JSON.parse(JSON.stringify(data));
    copy.sections.splice(idx, 1);
    setData(copy);
  };

  const handleSave = async () => {
    if (!data?._id) return;
    setSaving(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/termscondition/${data._id}`, data);
      setData(res.data.data);
      setEditing(false);
      alert("Saved successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Save failed ❌");
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Terms & Conditions Admin</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Page Title</label>
        <input
          disabled={!editing}
          className="mt-1 block w-full border rounded p-2"
          value={data.pageTitle || ""}
          onChange={(e) => handleFieldChange("pageTitle", e.target.value)}
        />

        <label className="block text-sm font-medium text-gray-700 mt-3">Subtitle</label>
        <input
          disabled={!editing}
          className="mt-1 block w-full border rounded p-2"
          value={data.subtitle || ""}
          onChange={(e) => handleFieldChange("subtitle", e.target.value)}
        />
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {data.sections.map((section, idx) => (
          <div key={idx} className="border p-4 rounded">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">Section #{idx + 1}</h2>
              {editing && (
                <button
                  onClick={() => handleDeleteSection(idx)}
                  className="text-red-500 font-bold"
                >
                  Delete
                </button>
              )}
            </div>
            <label className="block text-sm">Title</label>
            <input
              disabled={!editing}
              className="mt-1 block w-full border rounded p-2"
              value={section.title}
              onChange={(e) => handleFieldChange(`sections.${idx}.title`, e.target.value)}
            />
            <label className="block text-sm mt-2">Text</label>
            <textarea
              disabled={!editing}
              className="mt-1 block w-full border rounded p-2"
              rows={4}
              value={section.text}
              onChange={(e) => handleFieldChange(`sections.${idx}.text`, e.target.value)}
            />
          </div>
        ))}
      </div>

      {editing && (
        <button
          onClick={handleAddSection}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add Section
        </button>
      )}

      {/* Buttons */}
      <div className="flex gap-2 mt-6">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        )}
        <button
          onClick={fetchData}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Reload
        </button>
        {editing && (
          <button
            onClick={() => setEditing(false)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
