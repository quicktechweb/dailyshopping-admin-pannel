import { useEffect } from "react";
import axios from "axios";
import { initGtm } from "../utils/gtm";

const GtmTracker = () => {
  useEffect(() => {
    // Fetch GTM ID from backend
    const fetchGtmId = async () => {
      try {
        const res = await axios.get("https://dailyshopping-backend.onrender.com/api/settings/gtm");
        if (res.data && res.data.gtmId) {
          initGtm(res.data.gtmId); // initialize GTM directly
        }
      } catch (err) {
        console.error("Failed to fetch GTM ID:", err);
      }
    };

    fetchGtmId();
  }, []);

  return null; // nothing to render
};

export default GtmTracker;