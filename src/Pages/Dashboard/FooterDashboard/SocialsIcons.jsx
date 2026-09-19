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
export const SOCIAL_ICONS = {
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

export const DEFAULT_SOCIAL_LINKS = [
  { platform: "facebook", url: "#" },
  { platform: "twitter", url: "#" },
  { platform: "pinterest", url: "#" },
  { platform: "instagram", url: "#" },
];
