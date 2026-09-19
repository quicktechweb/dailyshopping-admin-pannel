"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";


export default function AdminPopularSection() {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    sectionTitle: "",
    bannerLink: "",
    downloadHeadingText: "",
    downloadHeadingLink: "",
    downloadTitle: "",
    downloadSubtitle: "",
    appStoreLink: "",
    playStoreLink: "",
  });

  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [qrImageFile, setQrImageFile] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const [appStoreImageFile, setAppStoreImageFile] = useState(null);
  const [appStorePreview, setAppStorePreview] = useState(null);
  const [playStoreImageFile, setPlayStoreImageFile] = useState(null);
  const [playStorePreview, setPlayStorePreview] = useState(null);

  const fetchSection = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/popular/section`);
      const s = res.data.section;
      setSection(s);
      setForm({
        sectionTitle: s?.sectionTitle || "",
        bannerLink: s?.bannerLink || "",
        downloadHeadingText: s?.downloadHeadingText || "",
        downloadHeadingLink: s?.downloadHeadingLink || "",
        downloadTitle: s?.downloadTitle || "",
        downloadSubtitle: s?.downloadSubtitle || "",
        appStoreLink: s?.appStoreLink || "",
        playStoreLink: s?.playStoreLink || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSection();
  }, []);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleFilePick = (setFile, setPreview) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => formData.append(key, value));

      if (bannerImageFile) formData.append("bannerImage", bannerImageFile);
      if (qrImageFile) formData.append("qrImage", qrImageFile);
      if (appStoreImageFile) formData.append("appStoreImage", appStoreImageFile);
      if (playStoreImageFile) formData.append("playStoreImage", playStoreImageFile);

      const res = await axios.put(`http://localhost:5000/api/popular/section`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSection(res.data.section);
      setBannerImageFile(null);
      setBannerPreview(null);
      setQrImageFile(null);
      setQrPreview(null);
      setAppStoreImageFile(null);
      setAppStorePreview(null);
      setPlayStoreImageFile(null);
      setPlayStorePreview(null);
      alert("Section updated ✅");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-8">
      <h1 className="text-xl md:text-2xl font-semibold">
        Popular Category Section — Manage
      </h1>

      {/* ===== Section Title ===== */}
      <div className="border border-gray-200 rounded-xl p-4 md:p-6 bg-white shadow-sm">
        <h2 className="text-sm font-semibold mb-3">Section Title</h2>
        <label className="block text-sm font-medium mb-1">Popular Category Title</label>
        <input
          type="text"
          value={form.sectionTitle}
          onChange={(e) => updateField("sectionTitle", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* ===== Banner ===== */}
      <div className="border border-gray-200 rounded-xl p-4 md:p-6 bg-white shadow-sm">
        <h2 className="text-sm font-semibold mb-3">Banner (Black Friday image)</h2>

        <label className="block text-sm font-medium mb-1">Banner Image</label>
        <img
          src={bannerPreview || section?.bannerImage}
          className="w-full h-28 object-cover rounded-lg mb-2 border bg-gray-50"
          onError={(e) => (e.target.style.display = "none")}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFilePick(setBannerImageFile, setBannerPreview)}
          className="text-sm mb-3"
        />

        <label className="block text-sm font-medium mb-1">Banner Click Link</label>
        <input
          type="text"
          value={form.bannerLink}
          onChange={(e) => updateField("bannerLink", e.target.value)}
          placeholder="/products/black-friday"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* ===== "Download Daily Shopping App" heading ===== */}
      <div className="border border-gray-200 rounded-xl p-4 md:p-6 bg-white shadow-sm">
        <h2 className="text-sm font-semibold mb-3">
          Top Heading (Download <span className="text-green-600">Daily Shopping App</span>)
        </h2>

        <label className="block text-sm font-medium mb-1">
          "Daily Shopping App" text (link part)
        </label>
        <input
          type="text"
          value={form.downloadHeadingText}
          onChange={(e) => updateField("downloadHeadingText", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
        />

        {/* <label className="block text-sm font-medium mb-1">Heading Link</label>
        <input
          type="text"
          value={form.downloadHeadingLink}
          onChange={(e) => updateField("downloadHeadingLink", e.target.value)}
          placeholder="/download-app"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        /> */}
      </div>

      {/* ===== QR + Download card text ===== */}
      <div className="border border-gray-200 rounded-xl p-4 md:p-6 bg-white shadow-sm">
        <h2 className="text-sm font-semibold mb-3">Download Card</h2>

        <label className="block text-sm font-medium mb-1">QR Image</label>
        <img
          src={qrPreview || section?.qrImage}
          className="w-24 h-24 object-contain rounded-lg mb-2 border bg-gray-50"
          onError={(e) => (e.target.style.display = "none")}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFilePick(setQrImageFile, setQrPreview)}
          className="text-sm mb-4"
        />

        <label className="block text-sm font-medium mb-1">Download Title</label>
        <input
          type="text"
          value={form.downloadTitle}
          onChange={(e) => updateField("downloadTitle", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
        />

        <label className="block text-sm font-medium mb-1">Download Subtitle</label>
        <input
          type="text"
          value={form.downloadSubtitle}
          onChange={(e) => updateField("downloadSubtitle", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* ===== App Store ===== */}
      <div className="border border-gray-200 rounded-xl p-4 md:p-6 bg-white shadow-sm">
        <h2 className="text-sm font-semibold mb-3">App Store Badge</h2>

        <label className="block text-sm font-medium mb-1">Badge Image</label>
        <img
          src={appStorePreview || section?.appStoreImage}
          className="h-12 object-contain rounded mb-2 border bg-gray-50 px-2"
          onError={(e) => (e.target.style.display = "none")}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFilePick(setAppStoreImageFile, setAppStorePreview)}
          className="text-sm mb-3"
        />

        <label className="block text-sm font-medium mb-1">App Store Link</label>
        <input
          type="text"
          value={form.appStoreLink}
          onChange={(e) => updateField("appStoreLink", e.target.value)}
          placeholder="https://apps.apple.com/..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* ===== Play Store ===== */}
      <div className="border border-gray-200 rounded-xl p-4 md:p-6 bg-white shadow-sm">
        <h2 className="text-sm font-semibold mb-3">Play Store Badge</h2>

        <label className="block text-sm font-medium mb-1">Badge Image</label>
        <img
          src={playStorePreview || section?.playStoreImage}
          className="h-12 object-contain rounded mb-2 border bg-gray-50 px-2"
          onError={(e) => (e.target.style.display = "none")}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFilePick(setPlayStoreImageFile, setPlayStorePreview)}
          className="text-sm mb-3"
        />

        <label className="block text-sm font-medium mb-1">Play Store Link</label>
        <input
          type="text"
          value={form.playStoreLink}
          onChange={(e) => updateField("playStoreLink", e.target.value)}
          placeholder="https://play.google.com/..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full md:w-auto px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {saving && <Loader2 size={16} className="animate-spin" />}
        Save Everything
      </button>
    </div>
  );
}