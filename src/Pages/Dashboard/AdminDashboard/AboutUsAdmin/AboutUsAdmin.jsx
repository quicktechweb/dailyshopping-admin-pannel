import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../../../utils/axiosInstance";

const AboutUsAdmin = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  // Fetch AboutUs Data
  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/aboutus");
      setData(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle nested field updates
  const handleChange = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split(".");
      let temp = newData;
      keys.forEach((k, i) => {
        if (i === keys.length - 1) temp[k] = value;
        else if (!temp[k]) temp[k] = {};
        temp = temp[k];
      });
      return newData;
    });
  };

  // Image Upload via imgbb
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
      handleChange(path, imageUrl);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  // Save changes
  const handleSave = async () => {
    try {
      const res = await axiosInstance.put("/aboutus", formData);
      setData(res.data);
      setEditMode(false);
      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">AboutUs Admin</h1>
      <button
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setEditMode(!editMode)}
      >
        {editMode ? "Cancel" : "Edit"}
      </button>

      {/* Hero Section */}
      <section className="mb-8">
        <h2 className="font-semibold text-xl">Hero Section</h2>
        {editMode ? (
          <div className="flex flex-col gap-2 mt-2">
            <input
              className="border p-2 rounded"
              value={formData.hero?.title || ""}
              onChange={e => handleChange("hero.title", e.target.value)}
            />
            <textarea
              className="border p-2 rounded"
              value={formData.hero?.description || ""}
              onChange={e => handleChange("hero.description", e.target.value)}
            />
            <input
              className="border p-2 rounded"
              value={formData.hero?.image || ""}
              onChange={e => handleChange("hero.image", e.target.value)}
            />
            <label className="mt-2">
              Upload Image:
              <input
                type="file"
                accept="image/*"
                className="block mt-1"
                onChange={e => handleImageUpload("hero.image", e.target.files[0])}
              />
            </label>
            {uploading && <p className="text-gray-500 text-sm">Uploading...</p>}
            {formData.hero?.image && (
              <img src={formData.hero.image} alt="hero" className="w-64 mt-2" />
            )}
          </div>
        ) : (
          <div className="mt-2">
            <h3 className="font-medium">{data.hero?.title}</h3>
            <p>{data.hero?.description}</p>
            <img src={data.hero?.image} alt="hero" className="w-64 mt-2" />
          </div>
        )}
      </section>

      {/* Features */}
      <section className="mb-8">
        <h2 className="font-semibold text-xl mb-2">Features</h2>
        {(data.features || []).map((f, i) => (
          <div key={i} className="border p-2 rounded my-2">
            {editMode ? (
              <div className="flex flex-col gap-2">
                <input
                  className="border p-1 rounded"
                  value={formData.features?.[i]?.title || ""}
                  onChange={e => handleChange(`features.${i}.title`, e.target.value)}
                />
                <textarea
                  className="border p-1 rounded"
                  value={formData.features?.[i]?.description || ""}
                  onChange={e => handleChange(`features.${i}.description`, e.target.value)}
                />
                <input
                  className="border p-1 rounded"
                  value={formData.features?.[i]?.icon || ""}
                  onChange={e => handleChange(`features.${i}.icon`, e.target.value)}
                />
                <label>
                  Upload Icon:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e =>
                      handleImageUpload(`features.${i}.icon`, e.target.files[0])
                    }
                    className="block mt-1"
                  />
                </label>
                {formData.features?.[i]?.icon && (
                  <img src={formData.features[i].icon} alt="icon" className="w-10 h-10 mt-1" />
                )}
                <input
                  className="border p-1 rounded"
                  value={formData.features?.[i]?.color || ""}
                  onChange={e => handleChange(`features.${i}.color`, e.target.value)}
                />
              </div>
            ) : (
              <div>
                <p className="font-medium">{f.title}</p>
                <p>{f.description}</p>
                <img src={f.icon} alt="icon" className="w-6 h-6" />
                <p>Color: {f.color}</p>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Divider */}
      <section className="mb-8">
        <h2 className="font-semibold text-xl">Divider</h2>
        {editMode ? (
          <>
            <textarea
              className="border p-2 rounded w-full"
              value={formData.divider?.text || ""}
              onChange={e => handleChange("divider.text", e.target.value)}
            />
            <input
              className="border p-2 rounded w-full mt-2"
              value={formData.divider?.faqLink || ""}
              onChange={e => handleChange("divider.faqLink", e.target.value)}
            />
          </>
        ) : (
          <p>{data.divider?.text}</p>
        )}
      </section>

      {/* Contact */}
      <section className="mb-8">
        <h2 className="font-semibold text-xl">Contact Section</h2>
        {editMode ? (
          <div className="flex flex-col gap-3">
            <input
              className="border p-2 rounded"
              value={formData.contact?.title || ""}
              onChange={e => handleChange("contact.title", e.target.value)}
            />
            <input
              className="border p-2 rounded"
              value={formData.contact?.subtitle || ""}
              onChange={e => handleChange("contact.subtitle", e.target.value)}
            />
            <h3 className="font-medium mt-2">Methods</h3>
            {(formData.contact.methods || []).map((m, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  className="border p-1 rounded flex-1"
                  value={m.type}
                  placeholder="Type"
                  onChange={e => handleChange(`contact.methods.${idx}.type`, e.target.value)}
                />
                <input
                  className="border p-1 rounded flex-1"
                  value={m.label}
                  placeholder="Label"
                  onChange={e => handleChange(`contact.methods.${idx}.label`, e.target.value)}
                />
                <input
                  className="border p-1 rounded flex-1"
                  value={m.value}
                  placeholder="Value"
                  onChange={e => handleChange(`contact.methods.${idx}.value`, e.target.value)}
                />
              </div>
            ))}
            <button
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
              onClick={() =>
                setFormData(prev => ({
                  ...prev,
                  contact: {
                    ...prev.contact,
                    methods: [
                      ...prev.contact.methods,
                      { type: "", label: "", value: "" },
                    ],
                  },
                }))
              }
            >
              Add Method
            </button>
          </div>
        ) : (
          <>
            <p>{data.contact?.title}</p>
            <p>{data.contact?.subtitle}</p>
            <ul>
            {(data.contact?.methods || []).map((m, i) => (
  <li key={i} className="flex justify-between border-b py-1">
    <span>{m.label}</span>
    <span>{m.value} ({m.type})</span>
  </li>
))}

            </ul>
          </>
        )}
      </section>

      {/* Save Button */}
      {editMode && (
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={handleSave}
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default AboutUsAdmin;
