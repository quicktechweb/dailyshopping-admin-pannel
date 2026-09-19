import { useState, useEffect } from "react";
import axios from "axios";

export default function FAQAdmin() {
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/faq");
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFieldChange = (path, value) => {
    const copy = { ...data };
    const keys = path.split(".");
    let obj = copy;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = value;
    setData(copy);
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/faq/${data._id}`, data);
      alert("Saved successfully!");
      setEditing(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    }
  };

  const handleAddFAQ = () => {
    const copy = [...data.faqs];
    copy.push({ question: "", answer: "" });
    setData({ ...data, faqs: copy });
  };

  const handleDeleteFAQ = (idx) => {
    const copy = [...data.faqs];
    copy.splice(idx, 1);
    setData({ ...data, faqs: copy });
  };

  if (!data) return <div className="text-center text-gray-600 mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-10 px-4">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            FAQ Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage frequently asked questions easily and beautifully.
          </p>
        </div>

        <button
          onClick={() => setEditing(!editing)}
          className={`px-5 py-2.5 rounded-full text-white font-semibold shadow-md transition duration-300 ${
            editing
              ? "bg-red-500 hover:bg-red-600"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {editing ? "Cancel Edit" : "Edit Mode"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Inputs */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Header Content
          </h2>

          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            disabled={!editing}
            value={data.header.title}
            onChange={(e) => handleFieldChange("header.title", e.target.value)}
            placeholder="Enter FAQ section title..."
            className={`mt-1 block w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition ${
              !editing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
            }`}
          />

          <label className="block text-gray-700 font-medium mt-4 mb-1">
            Subtitle
          </label>
          <input
            disabled={!editing}
            value={data.header.subtitle}
            onChange={(e) => handleFieldChange("header.subtitle", e.target.value)}
            placeholder="Enter subtitle..."
            className={`mt-1 block w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition ${
              !editing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
            }`}
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {data.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">
                  FAQ #{idx + 1}
                </h3>
                {editing && (
                  <button
                    onClick={() => handleDeleteFAQ(idx)}
                    className="text-red-500 text-sm font-medium hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>

              <label className="block text-gray-700 font-medium mb-1">
                Question
              </label>
              <input
                disabled={!editing}
                value={faq.question}
                onChange={(e) =>
                  handleFieldChange(`faqs.${idx}.question`, e.target.value)
                }
                placeholder="Enter question..."
                className={`mt-1 block w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition ${
                  !editing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                }`}
              />

              <label className="block text-gray-700 font-medium mt-4 mb-1">
                Answer
              </label>
              <textarea
                disabled={!editing}
                value={faq.answer}
                onChange={(e) =>
                  handleFieldChange(`faqs.${idx}.answer`, e.target.value)
                }
                placeholder="Enter answer..."
                rows={3}
                className={`mt-1 block w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition ${
                  !editing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {editing && (
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={handleAddFAQ}
              className="bg-green-500 text-white px-5 py-2 rounded-full font-medium shadow hover:bg-green-600 transition"
            >
              + Add FAQ
            </button>
            <button
              onClick={handleSave}
              className="bg-emerald-600 text-white px-5 py-2 rounded-full font-medium shadow hover:bg-emerald-700 transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
