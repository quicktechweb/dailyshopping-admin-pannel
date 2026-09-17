import { useEffect, useState } from "react";
import axios from "axios";

// 🔥 Reusable image upload field: shows current image + file input + upload progress
const ImageUploadField = ({ value, onUploaded, placeholder }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data?.success && res.data?.url) {
        onUploaded(res.data.url);
      } else {
        alert("Upload failed: " + (res.data?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Image upload error:", err);
      alert(
        err.response?.data?.message || "Image upload failed. Try again."
      );
    } finally {
      setUploading(false);
      e.target.value = ""; // same file আবার select করা যাবে
    }
  };

  return (
    <div className="flex items-center gap-2 border rounded p-2 bg-gray-50">
      {/* Preview */}
      {value ? (
        <img
          src={value}
          alt="preview"
          className="w-10 h-10 object-cover rounded border bg-white flex-shrink-0"
          onError={(e) => (e.target.style.display = "none")}
        />
      ) : (
        <div className="w-10 h-10 rounded border bg-white flex items-center justify-center text-[10px] text-gray-400 flex-shrink-0">
          No img
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 truncate">
          {placeholder || "Image"}
        </p>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition">
            {uploading ? "Uploading..." : "Choose Image"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={handleFileChange}
          />
        </label>
      </div>

      {uploading && (
        <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
      )}
    </div>
  );
};

const FooterDashboard = () => {
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch footer data
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/footer")
      .then((res) => {
        const data = res.data.footer;

        const safeFooter = {
          _id: data?._id || "",
          quickLinks: data?.quickLinks || [],
          luckyShop: data?.luckyShop || [],
          payment: data?.payment || [],
          shipping: data?.shipping || [],
          citiesCovered: data?.citiesCovered || [],
          support: data?.support || { title: "" },
          boxed: data?.boxed || {
            title: "",
            note: "",
            servicesLabel: "",
            phone: "",
            downloadAppLabel: "",
            appImages: { apple: "", google: "" },
          },
          certifications: data?.certifications || [],
          copyright: data?.copyright || "",
          bottomLinks: data?.bottomLinks || [],
          followUsLabel: data?.followUsLabel || "",
          social: data?.social || [],
          headings: data?.headings || {},
          smallText: data?.smallText || {},
        };

        setFooter(safeFooter);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e, field, index = null, subField = null) => {
    const value = e.target.value;
    setFooter((prev) => {
      const copy = { ...prev };
      if (index !== null && subField !== null) {
        if (!copy[field][index]) copy[field][index] = {};
        copy[field][index][subField] = value;
      } else if (index !== null) {
        copy[field][index] = value;
      } else if (subField) {
        if (!copy[field]) copy[field] = {};
        copy[field][subField] = value;
      } else {
        copy[field] = value;
      }
      return copy;
    });
  };

  // 🔥 Direct value setter (image upload callbacks use this — no event object)
  const setFieldValue = (field, index, subField, value) => {
    setFooter((prev) => {
      const copy = { ...prev };
      if (index !== null && subField) {
        if (!copy[field][index]) copy[field][index] = {};
        copy[field][index][subField] = value;
      } else if (subField) {
        if (!copy[field]) copy[field] = {};
        copy[field][subField] = value;
      } else if (index !== null) {
        copy[field][index] = value;
      }
      return copy;
    });
  };

  const handleSave = () => {
    setSaving(true);
    axios
      .put(`http://localhost:5000/api/footer/${footer._id}`, footer)
      .then(() => alert("Footer updated successfully!"))
      .catch((err) => console.log(err))
      .finally(() => setSaving(false));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Footer Dashboard</h1>

      {/* Generic Section Renderer */}
      {[
        { title: "Quick Links", field: "quickLinks" },
        { title: "LuckyShop", field: "luckyShop" },
        { title: "Cities Covered", field: "citiesCovered" },
        { title: "Bottom Links", field: "bottomLinks" },
      ].map(({ title, field }) => (
        <section className="mb-8" key={field}>
          <h2 className="text-2xl font-semibold mb-4">{title}</h2>
          <div className="grid grid-cols-3 gap-4">
            {footer[field].map((item, i) => (
              <input
                key={i}
                value={item || ""}
                onChange={(e) => handleChange(e, field, i)}
                className="p-2 border rounded"
                placeholder={`${title} ${i + 1}`}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Payment */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Payment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {footer.payment.map((p, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 border p-3 rounded bg-white">
              <input
                value={p?.name || ""}
                placeholder="Name"
                onChange={(e) => handleChange(e, "payment", i, "name")}
                className="p-2 border rounded"
              />
              {/* 🔥 Icon upload instead of URL text */}
              <ImageUploadField
                value={p?.icon}
                placeholder="Payment Icon"
                onUploaded={(url) => setFieldValue("payment", i, "icon", url)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Shipping */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
        <div className="grid grid-cols-3 gap-4">
          {footer.shipping.map((s, i) => (
            <>
              <input
                key={`label-${i}`}
                value={s?.label || ""}
                placeholder="Label"
                onChange={(e) => handleChange(e, "shipping", i, "label")}
                className="p-2 border rounded"
              />
              <input
                key={`emoji-${i}`}
                value={s?.emoji || ""}
                placeholder="Emoji"
                onChange={(e) => handleChange(e, "shipping", i, "emoji")}
                className="p-2 border rounded"
              />
              <input
                key={`subtitle-${i}`}
                value={s?.subtitle || ""}
                placeholder="Subtitle"
                onChange={(e) => handleChange(e, "shipping", i, "subtitle")}
                className="p-2 border rounded"
              />
            </>
          ))}
        </div>
      </section>

      {/* Support */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Support</h2>
        <input
          value={footer.support?.title || ""}
          placeholder="Support Title"
          onChange={(e) => handleChange(e, "support", null, "title")}
          className="p-2 border rounded w-full"
        />
      </section>

      {/* Boxed Info */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Boxed Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={footer.boxed?.title || ""}
            placeholder="Title"
            onChange={(e) => handleChange(e, "boxed", null, "title")}
            className="p-2 border rounded"
          />
          <input
            value={footer.boxed?.note || ""}
            placeholder="Note"
            onChange={(e) => handleChange(e, "boxed", null, "note")}
            className="p-2 border rounded"
          />
          <input
            value={footer.boxed?.servicesLabel || ""}
            placeholder="Services Label"
            onChange={(e) => handleChange(e, "boxed", null, "servicesLabel")}
            className="p-2 border rounded"
          />
          <input
            value={footer.boxed?.phone || ""}
            placeholder="Phone"
            onChange={(e) => handleChange(e, "boxed", null, "phone")}
            className="p-2 border rounded"
          />
          <input
            value={footer.boxed?.downloadAppLabel || ""}
            placeholder="Download App Label"
            onChange={(e) => handleChange(e, "boxed", null, "downloadAppLabel")}
            className="p-2 border rounded"
          />

          {/* 🔥 Apple app image upload */}
          <ImageUploadField
            value={footer.boxed?.appImages?.apple}
            placeholder="Apple App Image"
            onUploaded={(url) =>
              setFooter((prev) => ({
                ...prev,
                boxed: {
                  ...prev.boxed,
                  appImages: { ...prev.boxed.appImages, apple: url },
                },
              }))
            }
          />

          {/* 🔥 Google app image upload */}
          <ImageUploadField
            value={footer.boxed?.appImages?.google}
            placeholder="Google App Image"
            onUploaded={(url) =>
              setFooter((prev) => ({
                ...prev,
                boxed: {
                  ...prev.boxed,
                  appImages: { ...prev.boxed.appImages, google: url },
                },
              }))
            }
          />
        </div>
      </section>

      {/* Certifications */}
      <section className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mb-4">Certifications</h2>

          {/* ➕ Add New Certification */}
          <button
            onClick={() =>
              setFooter((prev) => ({
                ...prev,
                certifications: [...prev.certifications, { alt: "", img: "" }],
              }))
            }
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            + Add
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {footer.certifications.map((c, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 border p-3 rounded bg-white relative">
              <input
                value={c?.alt || ""}
                placeholder="Alt Text"
                onChange={(e) => handleChange(e, "certifications", i, "alt")}
                className="p-2 border rounded"
              />

              {/* 🔥 Certification image upload */}
              <ImageUploadField
                value={c?.img}
                placeholder="Certification Image"
                onUploaded={(url) => setFieldValue("certifications", i, "img", url)}
              />

              {/* ❌ Remove Certification */}
              <button
                onClick={() =>
                  setFooter((prev) => ({
                    ...prev,
                    certifications: prev.certifications.filter((_, index) => index !== i),
                  }))
                }
                className="self-end px-2 py-1 bg-red-500 text-white rounded text-xs w-fit"
              >
                ✕ Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Social */}
      <section className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mb-4">Social Links</h2>

          {/* ➕ Add New Social */}
          <button
            onClick={() =>
              setFooter((prev) => ({
                ...prev,
                social: [
                  ...prev.social,
                  {
                    name: "",
                    icon: "",
                    url: "",
                    status: "active",
                    order: prev.social.length + 1,
                  },
                ],
              }))
            }
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            + Add
          </button>
        </div>

        <div className="space-y-3">
          {[...footer.social]
            .map((s, originalIndex) => ({ ...s, originalIndex }))
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((s) => {
              const i = s.originalIndex;
              return (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-5 gap-3 items-start bg-white p-3 rounded border"
                >
                  {/* Name */}
                  <input
                    value={s?.name || ""}
                    placeholder="Name (Facebook, YouTube)"
                    onChange={(e) => handleChange(e, "social", i, "name")}
                    className="p-2 border rounded h-fit"
                  />

                  {/* 🔥 Icon upload instead of URL text */}
                  <ImageUploadField
                    value={s?.icon}
                    placeholder="Social Icon"
                    onUploaded={(url) => setFieldValue("social", i, "icon", url)}
                  />

                  {/* 🔥 Social Media Profile URL (real link, not image) */}
                  <input
                    value={s?.url || ""}
                    placeholder="Profile URL (https://...)"
                    onChange={(e) => handleChange(e, "social", i, "url")}
                    className="p-2 border rounded h-fit"
                  />

                  {/* 🔥 Status */}
                  <select
                    value={s?.status || "active"}
                    onChange={(e) => handleChange(e, "social", i, "status")}
                    className="p-2 border rounded h-fit"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <div className="flex gap-2 items-center">
                    {/* 🔥 Display Order */}
                    <input
                      type="number"
                      value={s?.order ?? 0}
                      placeholder="Order"
                      onChange={(e) => handleChange(e, "social", i, "order")}
                      className="p-2 border rounded w-20"
                    />

                    {/* ❌ Remove Social Link */}
                    <button
                      onClick={() =>
                        setFooter((prev) => ({
                          ...prev,
                          social: prev.social.filter((_, index) => index !== i),
                        }))
                      }
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2"
      >
        {saving && (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default FooterDashboard;
