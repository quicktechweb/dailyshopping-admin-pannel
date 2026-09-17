import { useEffect, useState } from "react";
import axios from "axios";
import TextEditor from "../../../TextEditor/TextEditor";

export default function ContactAdmin() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setError("");
    try {
      const res = await axios.get("https://dailyshopping-backend.onrender.com/api/contactus");
      if (res.data && res.data.data) setData(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    }
  };

  const handleFieldChange = (path, value) => {
    const copy = JSON.parse(JSON.stringify(data));
    const parts = path.split(".");
    let cur = copy;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (!cur[p]) cur[p] = {};
      cur = cur[p];
    }
    cur[parts[parts.length - 1]] = value;
    setData(copy);
  };

  const handleAddOption = (cardIdx) => {
    const copy = JSON.parse(JSON.stringify(data));
    copy.cards[cardIdx].form.options.push("");
    setData(copy);
  };

  const handleDeleteOption = (cardIdx, optionIdx) => {
    const copy = JSON.parse(JSON.stringify(data));
    copy.cards[cardIdx].form.options.splice(optionIdx, 1);
    setData(copy);
  };

  const handleSave = async () => {
    if (!data || !data._id) {
      setError("No document to update.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await axios.put(
        `https://dailyshopping-backend.onrender.com/api/contactus/${data._id}`,
        data
      );
      if (res.data.success) {
        setData(res.data.data);
        alert("✅ Saved successfully");
        setEditing(false);
      } else {
        setError("Save failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Save error");
    } finally {
      setSaving(false);
    }
  };

  // Imgbb image upload
  const handleImageUpload = async (file, path) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(
        "https://api.imgbb.com/1/upload?key=ab454291ebee91b49b021ecac51be17c",
        formData
      );
      const url = res.data.data.url;
      handleFieldChange(path, url);
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Image upload failed");
    }
  };

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contact Us — Admin Panel</h1>

      {/* PAGE HEADER */}
      <div className="bg-white shadow rounded p-4 mb-4">
        <label className="block text-sm font-medium text-gray-700">Page Title</label>
        <input
          disabled={!editing}
          className={`mt-1 block w-full border rounded p-2 ${!editing ? "bg-gray-100" : ""}`}
          value={data.pageTitle || ""}
          onChange={(e) => handleFieldChange("pageTitle", e.target.value)}
        />

        <label className="block text-sm font-medium text-gray-700 mt-3">Subtitle</label>
        <input
          disabled={!editing}
          className={`mt-1 block w-full border rounded p-2 ${!editing ? "bg-gray-100" : ""}`}
          value={data.subtitle || ""}
          onChange={(e) => handleFieldChange("subtitle", e.target.value)}
        />

        <label className="block text-sm font-medium text-gray-700 mt-3">Background Image</label>
        {data.backgroundImage && (
          <img src={data.backgroundImage} alt="Background" className="w-64 h-32 object-cover mb-2 border rounded" />
        )}
        {editing && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0], "backgroundImage")}
          />
        )}
      </div>

      {/* CARDS */}
      {data.cards &&
        data.cards.map((card, idx) => {
          const isFormCard = !!card.form;
          return (
            <div key={idx} className="bg-white shadow rounded p-4 mb-4">
              <h2 className="font-semibold text-lg mb-2">
                Card #{idx + 1} {card.title && `(${card.title})`}
              </h2>

              {/* Card 1 */}
              {!isFormCard && (
                <>
                  <label className="block text-sm mt-2">Title</label>
                  <input
                    disabled={!editing}
                    className={`mt-1 block w-full border rounded p-2 ${!editing ? "bg-gray-100" : ""}`}
                    value={card.title || ""}
                    onChange={(e) => handleFieldChange(`cards.${idx}.title`, e.target.value)}
                  />

                  <label className="block text-sm mt-2">Icon</label>
                  {card.icon && <img src={card.icon} className="w-16 h-16 mb-2 object-cover border rounded" />}
                  {editing && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0], `cards.${idx}.icon`)}
                    />
                  )}

                  <label className="block text-sm mt-2">Description</label>
                 <TextEditor
  value={card.description || ""}
  onChange={(val) => handleFieldChange(`cards.${idx}.description`, val)}
  readOnly={!editing}
/>


                  {card.linkText && (
                    <>
                      <label className="block text-sm mt-2">Link Text</label>
                      <input
                        disabled={!editing}
                        className={`mt-1 block w-full border rounded p-2 ${!editing ? "bg-gray-100" : ""}`}
                        value={card.linkText}
                        onChange={(e) => handleFieldChange(`cards.${idx}.linkText`, e.target.value)}
                      />
                    </>
                  )}

                  {card.linkUrl && (
                    <>
                      <label className="block text-sm mt-2">Link URL</label>
                      <input
                        disabled={!editing}
                        className={`mt-1 block w-full border rounded p-2 ${!editing ? "bg-gray-100" : ""}`}
                        value={card.linkUrl}
                        onChange={(e) => handleFieldChange(`cards.${idx}.linkUrl`, e.target.value)}
                      />
                    </>
                  )}
                </>
              )}

              {/* Card 2 */}
              {isFormCard && (
                <>
                  {/* Banner */}
                  {card.banner && (
                    <>
                      <h3 className="mt-3 font-medium">Banner</h3>
                      <label className="block text-sm mt-2">Main Text</label>
                      <input
                        disabled={!editing}
                        className={`mt-1 block w-full border rounded p-2 ${!editing ? "bg-gray-100" : ""}`}
                        value={card.banner.textMain || ""}
                        onChange={(e) => handleFieldChange(`cards.${idx}.banner.textMain`, e.target.value)}
                      />

                      <label className="block text-sm mt-2">Sub Text</label>
                      <input
                        disabled={!editing}
                        className={`mt-1 block w-full border rounded p-2 ${!editing ? "bg-gray-100" : ""}`}
                        value={card.banner.textSub || ""}
                        onChange={(e) => handleFieldChange(`cards.${idx}.banner.textSub`, e.target.value)}
                      />

                      <label className="block text-sm mt-2">Banner Image</label>
                      {card.banner.image && (
                        <img src={card.banner.image} alt="Banner" className="w-48 h-32 object-cover mb-2 border rounded" />
                      )}
                      {editing && (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files[0], `cards.${idx}.banner.image`)}
                        />
                      )}
                    </>
                  )}

                  {/* Form */}
                  {card.form && (
                    <>
                      <h3 className="mt-3 font-medium">Form</h3>
                      <label className="block text-sm mt-2">Title</label>
                      <input
                        disabled={!editing}
                        className={`mt-1 block w-full border rounded p-2 ${!editing ? "bg-gray-100" : ""}`}
                        value={card.form.title || ""}
                        onChange={(e) => handleFieldChange(`cards.${idx}.form.title`, e.target.value)}
                      />

                      <label className="block text-sm mt-2">Options</label>
                      {card.form.options?.map((opt, i) => (
                        <div key={i} className="flex gap-2 mt-2">
                          <input
                            disabled={!editing}
                            className={`flex-1 border rounded p-2 ${!editing ? "bg-gray-100" : ""}`}
                            value={opt}
                            onChange={(e) => handleFieldChange(`cards.${idx}.form.options.${i}`, e.target.value)}
                          />
                          {editing && (
                            <button
                              onClick={() => handleDeleteOption(idx, i)}
                              className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      {editing && (
                        <button
                          onClick={() => handleAddOption(idx)}
                          className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          + Add Option
                        </button>
                      )}

                      <label className="block text-sm mt-2">Button Text</label>
                      <input
                        disabled={!editing}
                        className={`mt-1 block w-full border rounded p-2 ${!editing ? "bg-gray-100" : ""}`}
                        value={card.form.buttonText || ""}
                        onChange={(e) => handleFieldChange(`cards.${idx}.form.buttonText`, e.target.value)}
                      />
                    </>
                  )}

                  {/* Contact Info */}
                  {card.contactInfo && (
                    <>
                      <h3 className="mt-3 font-medium">Contact Info</h3>
                      <label className="block text-sm mt-2">Phone Note</label>
                      <input
                        disabled={!editing}
                        className={`mt-1 block w-full border rounded p-2 ${!editing ? "bg-gray-100" : ""}`}
                        value={card.contactInfo.phoneNote || ""}
                        onChange={(e) => handleFieldChange(`cards.${idx}.contactInfo.phoneNote`, e.target.value)}
                      />

                      <label className="block text-sm mt-2">Email</label>
                      <input
                        disabled={!editing}
                        className={`mt-1 block w-full border rounded p-2 ${!editing ? "bg-gray-100" : ""}`}
                        value={card.contactInfo.email || ""}
                        onChange={(e) => handleFieldChange(`cards.${idx}.contactInfo.email`, e.target.value)}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          );
        })}

      {error && <div className="text-red-600 mb-2">{error}</div>}

      {/* BUTTONS */}
      <div className="flex gap-2">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ✎ Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "💾 Save Changes"}
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
