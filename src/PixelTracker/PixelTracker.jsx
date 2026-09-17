import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactPixel from "react-facebook-pixel";
import axios from "axios";

export default function PixelTracker() {
  const location = useLocation();
  const [pixelId, setPixelId] = useState(null);

  // Backend থেকে pixel ID fetch করা
  useEffect(() => {
    const fetchPixel = async () => {
      try {
        const res = await axios.get("https://dailyshopping-backend.onrender.com/api/pixel");
        if (res.data && res.data.pixelId) {
          setPixelId(res.data.pixelId);
        }
      } catch (err) {
        console.error("Pixel fetch error:", err);
      }
    };

    fetchPixel();
  }, []);

  // Pixel init এবং pageView track করা
  useEffect(() => {
    if (!pixelId) return; // যদি pixelId না আসে, কিছু করা হবে না
    ReactPixel.init(pixelId);
    ReactPixel.pageView();
  }, [pixelId]);

  // Route change এর জন্য pageView track
  useEffect(() => {
    if (!pixelId) return;
    ReactPixel.pageView();
  }, [location.pathname, pixelId]);

  return null;
}
