import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Trash2, Plus, Upload, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
  FaTelegramPlane,
} from "react-icons/fa";

// Keys must match SOCIAL_PLATFORMS in backend/models/Footer.js
const SOCIAL_ICONS = {
  facebook: { label: "Facebook", Icon: FaFacebookF },
  twitter: { label: "Twitter / X", Icon: FaTwitter },
  pinterest: { label: "Pinterest", Icon: FaPinterestP },
  instagram: { label: "Instagram", Icon: FaInstagram },
  youtube: { label: "YouTube", Icon: FaYoutube },
  linkedin: { label: "LinkedIn", Icon: FaLinkedinIn },
  tiktok: { label: "TikTok", Icon: FaTiktok },
  whatsapp: { label: "WhatsApp", Icon: FaWhatsapp },
  telegram: { label: "Telegram", Icon: FaTelegramPlane },
};

const DEFAULT_SOCIAL_LINKS = [
  { platform: "facebook", url: "#" },
  { platform: "twitter", url: "#" },
  { platform: "pinterest", url: "#" },
  { platform: "instagram", url: "#" },
];

// ⚠️ Don't hardcode the key in source. Put it in .env:
//    Vite  → VITE_IMGBB_API_KEY=xxxx
//    CRA   → REACT_APP_IMGBB_API_KEY=xxxx (and use process.env.REACT_APP_IMGBB_API_KEY)
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const API_URL = "http://localhost:5000/api/footer";

// 🔹 Upload a single file to imgbb, returns the hosted image URL
const uploadToImgbb = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    formData
  );

  return res.data?.data?.url;
};

const ICON_OPTIONS = [
  { value: "tag", label: "Tag (discount)" },
  { value: "gift", label: "Gift (promotions)" },
  { value: "truck", label: "Truck (shipping)" },
];

export default function AdminFooterManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [appPromo, setAppPromo] = useState({
    heading: "",
    benefits: [],
    qrCodeText: "",
    qrCodeImg: "",
    storeBadges: [],
    learnMoreText: "",
    learnMoreLink: "#",
  });
  const [followUs, setFollowUs] = useState({ heading: "Follow Us", links: [] });

  // Track which specific image slot is currently uploading (for spinners)
  const [uploadingKey, setUploadingKey] = useState(null);

  const fetchFooterData = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data?.success) {
        setPaymentMethods(res.data.data.paymentMethods || []);
        setAppPromo(res.data.data.appPromo || {});
        setFollowUs(res.data.data.followUs || { heading: "Follow Us", links: [] });
      }
    } catch (err) {
      console.error("Footer fetch error:", err);
      Swal.fire("Error", "Could not load footer data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterData();
  }, []);

  // ================= PAYMENT METHODS =================

  const handleAddPaymentMethod = () => {
    setPaymentMethods((prev) => [...prev, { img: "", alt: "" }]);
  };

  const handleRemovePaymentMethod = (index) => {
    setPaymentMethods((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePaymentAltChange = (index, value) => {
    setPaymentMethods((prev) =>
      prev.map((pm, i) => (i === index ? { ...pm, alt: value } : pm))
    );
  };

  const handlePaymentImageUpload = async (index, file) => {
    if (!file) return;
    const key = `payment-${index}`;
    setUploadingKey(key);
    try {
      const url = await uploadToImgbb(file);
      setPaymentMethods((prev) =>
        prev.map((pm, i) => (i === index ? { ...pm, img: url } : pm))
      );
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire("Error", "Image upload failed. Try again.", "error");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSavePaymentMethods = async () => {
    setSaving(true);
    try {
      const res = await axios.patch(`${API_URL}/payment-methods`, {
        paymentMethods,
      });
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Saved",
          text: "Payment methods updated successfully.",
          timer: 1800,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire("Error", "Could not save payment methods.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ================= APP PROMO =================

  const handlePromoFieldChange = (field, value) => {
    setAppPromo((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddBenefit = () => {
    setAppPromo((prev) => ({
      ...prev,
      benefits: [...(prev.benefits || []), { icon: "tag", text: "" }],
    }));
  };

  const handleRemoveBenefit = (index) => {
    setAppPromo((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const handleBenefitChange = (index, field, value) => {
    setAppPromo((prev) => ({
      ...prev,
      benefits: prev.benefits.map((b, i) =>
        i === index ? { ...b, [field]: value } : b
      ),
    }));
  };

  const handleQrCodeUpload = async (file) => {
    if (!file) return;
    setUploadingKey("qrcode");
    try {
      const url = await uploadToImgbb(file);
      setAppPromo((prev) => ({ ...prev, qrCodeImg: url }));
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire("Error", "QR code upload failed. Try again.", "error");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleAddStoreBadge = () => {
    setAppPromo((prev) => ({
      ...prev,
      storeBadges: [...(prev.storeBadges || []), { img: "", alt: "" }],
    }));
  };

  const handleRemoveStoreBadge = (index) => {
    setAppPromo((prev) => ({
      ...prev,
      storeBadges: prev.storeBadges.filter((_, i) => i !== index),
    }));
  };

  const handleStoreBadgeAltChange = (index, value) => {
    setAppPromo((prev) => ({
      ...prev,
      storeBadges: prev.storeBadges.map((b, i) =>
        i === index ? { ...b, alt: value } : b
      ),
    }));
  };

  const handleStoreBadgeUpload = async (index, file) => {
    if (!file) return;
    const key = `badge-${index}`;
    setUploadingKey(key);
    try {
      const url = await uploadToImgbb(file);
      setAppPromo((prev) => ({
        ...prev,
        storeBadges: prev.storeBadges.map((b, i) =>
          i === index ? { ...b, img: url } : b
        ),
      }));
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire("Error", "Image upload failed. Try again.", "error");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSaveAppPromo = async () => {
    setSaving(true);
    try {
      const res = await axios.patch(`${API_URL}/app-promo`, { appPromo });
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Saved",
          text: "App promo section updated successfully.",
          timer: 1800,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire("Error", "Could not save app promo section.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ================= FOLLOW US =================

  const handleFollowHeadingChange = (value) => {
    setFollowUs((prev) => ({ ...prev, heading: value }));
  };

  const handleAddSocialLink = () => {
    // Pick the first platform that isn't used yet, otherwise fall back to facebook
    const used = (followUs.links || []).map((l) => l.platform);
    const next = Object.keys(SOCIAL_ICONS).find((p) => !used.includes(p)) || "facebook";
    setFollowUs((prev) => ({
      ...prev,
      links: [...(prev.links || []), { platform: next, url: "" }],
    }));
  };

  const handleLoadDefaultSocialLinks = () => {
    setFollowUs((prev) => ({ ...prev, links: DEFAULT_SOCIAL_LINKS }));
  };

  const handleRemoveSocialLink = (index) => {
    setFollowUs((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const handleSocialLinkChange = (index, field, value) => {
    setFollowUs((prev) => ({
      ...prev,
      links: prev.links.map((l, i) => (i === index ? { ...l, [field]: value } : l)),
    }));
  };

  const handleMoveSocialLink = (index, direction) => {
    setFollowUs((prev) => {
      const links = [...prev.links];
      const target = index + direction;
      if (target < 0 || target >= links.length) return prev;
      [links[index], links[target]] = [links[target], links[index]];
      return { ...prev, links };
    });
  };

  const handleSaveFollowUs = async () => {
    setSaving(true);
    try {
      const res = await axios.patch(`${API_URL}/follow-us`, { followUs });
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Saved",
          text: "Follow Us section updated successfully.",
          timer: 1800,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Save error:", err);
      const status = err.response?.status;
      Swal.fire(
        "Error",
        status === 404
          ? "Backend route /follow-us not found. Update footerRoutes.js and restart the server."
          : err.response?.data?.message || "Could not save Follow Us section.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        <Loader2 className="animate-spin inline-block mr-2" />
        Loading footer settings...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold text-gray-800">Footer Management</h1>
      <p className="text-sm text-gray-500 -mt-6">
        Edit the footer sections: Payment Method logos, the App Promo block, and Follow Us social links.
      </p>

      {/* ================= PAYMENT METHOD SECTION ================= */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Payment Method Logos</h2>
          <button
            onClick={handleAddPaymentMethod}
            className="flex items-center gap-1 text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700"
          >
            <Plus size={16} /> Add Logo
          </button>
        </div>

        <div className="space-y-4">
          {paymentMethods.length === 0 && (
            <p className="text-sm text-gray-400">No payment method logos added yet.</p>
          )}

          {paymentMethods.map((pm, index) => {
            const key = `payment-${index}`;
            return (
              <div
                key={index}
                className="flex items-center gap-4 border rounded-lg p-3"
              >
                <div className="w-24 h-16 flex items-center justify-center border rounded bg-gray-50 shrink-0 overflow-hidden">
                  {uploadingKey === key ? (
                    <Loader2 className="animate-spin text-gray-400" size={20} />
                  ) : pm.img ? (
                    <img src={pm.img} alt={pm.alt} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="text-xs text-gray-400">No image</span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Alt text (e.g. PCI DSS)"
                    value={pm.alt}
                    onChange={(e) => handlePaymentAltChange(index, e.target.value)}
                    className="w-full border rounded px-3 py-1.5 text-sm"
                  />
                  <label className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer w-fit">
                    <Upload size={14} />
                    Upload image
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handlePaymentImageUpload(index, e.target.files[0])}
                    />
                  </label>
                </div>

                <button
                  onClick={() => handleRemovePaymentMethod(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSavePaymentMethods}
          disabled={saving}
          className="mt-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-semibold"
        >
          {saving ? "Saving..." : "Save Payment Methods"}
        </button>
      </section>

      {/* ================= APP PROMO SECTION ================= */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">App Promo Section</h2>

        {/* Heading */}
        <div className="mb-5">
          <label className="block text-sm text-gray-600 mb-1">Heading</label>
          <input
            type="text"
            value={appPromo.heading || ""}
            onChange={(e) => handlePromoFieldChange("heading", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Enjoy special benefits on the app:"
          />
        </div>

        {/* Benefits */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-600">Benefit List</label>
            <button
              onClick={handleAddBenefit}
              className="flex items-center gap-1 text-xs bg-green-600 text-white px-2.5 py-1 rounded hover:bg-green-700"
            >
              <Plus size={14} /> Add Benefit
            </button>
          </div>

          <div className="space-y-2">
            {(appPromo.benefits || []).map((b, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={b.icon}
                  onChange={(e) => handleBenefitChange(index, "icon", e.target.value)}
                  className="border rounded px-2 py-1.5 text-sm"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={b.text}
                  onChange={(e) => handleBenefitChange(index, "text", e.target.value)}
                  placeholder="Benefit text"
                  className="flex-1 border rounded px-3 py-1.5 text-sm"
                />
                <button
                  onClick={() => handleRemoveBenefit(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* QR code text */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">QR Code Description</label>
          <input
            type="text"
            value={appPromo.qrCodeText || ""}
            onChange={(e) => handlePromoFieldChange("qrCodeText", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* QR code image */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">QR Code Image</label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-28 border rounded bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
              {uploadingKey === "qrcode" ? (
                <Loader2 className="animate-spin text-gray-400" size={20} />
              ) : appPromo.qrCodeImg ? (
                <img src={appPromo.qrCodeImg} alt="QR" className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-xs text-gray-400">No QR</span>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer">
              <Upload size={14} />
              Upload QR code
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleQrCodeUpload(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* Store badges */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-600">Store Badges (Google Play / App Store / AppGallery)</label>
            <button
              onClick={handleAddStoreBadge}
              className="flex items-center gap-1 text-xs bg-green-600 text-white px-2.5 py-1 rounded hover:bg-green-700"
            >
              <Plus size={14} /> Add Badge
            </button>
          </div>

          <div className="space-y-3">
            {(appPromo.storeBadges || []).map((badge, index) => {
              const key = `badge-${index}`;
              return (
                <div key={index} className="flex items-center gap-4 border rounded-lg p-3">
                  <div className="w-28 h-12 border rounded bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                    {uploadingKey === key ? (
                      <Loader2 className="animate-spin text-gray-400" size={18} />
                    ) : badge.img ? (
                      <img src={badge.img} alt={badge.alt} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="text-xs text-gray-400">No image</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Alt text (e.g. Google Play)"
                      value={badge.alt}
                      onChange={(e) => handleStoreBadgeAltChange(index, e.target.value)}
                      className="w-full border rounded px-3 py-1.5 text-sm"
                    />
                    <label className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer w-fit">
                      <Upload size={14} />
                      Upload image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleStoreBadgeUpload(index, e.target.files[0])}
                      />
                    </label>
                  </div>

                  <button
                    onClick={() => handleRemoveStoreBadge(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learn More link */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Learn More Text</label>
            <input
              type="text"
              value={appPromo.learnMoreText || ""}
              onChange={(e) => handlePromoFieldChange("learnMoreText", e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Learn More Link</label>
            <input
              type="text"
              value={appPromo.learnMoreLink || ""}
              onChange={(e) => handlePromoFieldChange("learnMoreLink", e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="https://..."
            />
          </div>
        </div>

        <button
          onClick={handleSaveAppPromo}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-semibold"
        >
          {saving ? "Saving..." : "Save App Promo"}
        </button>
      </section>

      {/* ================= FOLLOW US SECTION ================= */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Follow Us (Social Links)</h2>
          <button
            onClick={handleAddSocialLink}
            className="flex items-center gap-1 text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700"
          >
            <Plus size={16} /> Add Icon
          </button>
        </div>

        {/* Heading */}
        <div className="mb-5">
          <label className="block text-sm text-gray-600 mb-1">Heading</label>
          <input
            type="text"
            value={followUs.heading || ""}
            onChange={(e) => handleFollowHeadingChange(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Follow Us"
          />
        </div>

        {/* Links */}
        <div className="space-y-3">
          {(followUs.links || []).length === 0 && (
            <div className="text-sm text-gray-400 flex items-center gap-3">
              <span>No social links yet.</span>
              <button
                onClick={handleLoadDefaultSocialLinks}
                className="text-blue-600 hover:underline"
              >
                Load Facebook, Twitter, Pinterest, Instagram
              </button>
            </div>
          )}

          {(followUs.links || []).map((link, index) => {
            const meta = SOCIAL_ICONS[link.platform];
            const Icon = meta?.Icon;
            const total = followUs.links.length;

            return (
              <div key={index} className="flex items-center gap-3 border rounded-lg p-3">
                {/* Icon preview */}
                <div className="w-11 h-11 rounded-full bg-gray-100 text-slate-700 flex items-center justify-center shrink-0 text-lg">
                  {Icon ? <Icon /> : null}
                </div>

                {/* Platform */}
                <select
                  value={link.platform}
                  onChange={(e) => handleSocialLinkChange(index, "platform", e.target.value)}
                  className="border rounded px-2 py-1.5 text-sm"
                  aria-label="Platform"
                >
                  {Object.entries(SOCIAL_ICONS).map(([value, { label }]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>

                {/* URL */}
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(index, "url", e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                  className="flex-1 border rounded px-3 py-1.5 text-sm"
                  aria-label="Link URL"
                />

                {/* Reorder */}
                <div className="flex flex-col">
                  <button
                    onClick={() => handleMoveSocialLink(index, -1)}
                    disabled={index === 0}
                    className="text-gray-500 hover:text-gray-800 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => handleMoveSocialLink(index, 1)}
                    disabled={index === total - 1}
                    className="text-gray-500 hover:text-gray-800 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveSocialLink(index)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSaveFollowUs}
          disabled={saving}
          className="mt-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-semibold"
        >
          {saving ? "Saving..." : "Save Follow Us"}
        </button>
      </section>
    </div>
  );
}
