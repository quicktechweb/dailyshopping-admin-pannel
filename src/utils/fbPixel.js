import ReactPixel from "react-facebook-pixel";

// Pixel ইনিশিয়ালাইজেশন
export const initFacebookPixel = (pixelId) => {
  if (!pixelId) return; // Pixel ID না থাকলে skip
  ReactPixel.init(pixelId);
  ReactPixel.pageView(); // page load
};

// Event ট্র্যাকিং
export const trackEvent = (eventName, data) => {
  ReactPixel.track(eventName, data);
};
