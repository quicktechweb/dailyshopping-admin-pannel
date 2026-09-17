import { Link } from "react-router-dom"; // ✅ ঠিক ইমপোর্ট
import { useState } from "react";
import { FaQrcode } from "react-icons/fa";

const DetailsNavbar = () => {
  const [appOpen, setAppOpen] = useState(false);

  return (
    <div>
      <div className="sm:hidden fixed top-0 left-0 w-full bg-white p-2 flex flex-col items-center z-50 shadow-md">
        {/* Logo and Location */}
        <div className="w-full flex items-center justify-between mb-2 px-2">
          <Link to="/">
            <img
              className="h-10 object-contain"
              src="https://i.ibb.co/VY92LX2H/Logo-Lucky-Shop1.png" // ✅ URL ঠিক করে দিয়েছি
              alt="Lucky Shop Logo"
            />
          </Link>

          <div className="relative">
            {/* Main Button */}
            <div
              onClick={() => setAppOpen(!appOpen)}
              className="flex items-center gap-2 bg-white rounded-xl shadow-sm px-3 py-2 cursor-pointer active:scale-[0.98] transition"
            >
              <FaQrcode className="text-3xl text-emerald-700 shrink-0" />
              <div className="flex flex-col leading-tight">
                <p className="text-[11px] text-gray-600 font-medium">Download the</p>
                <p className="text-[13px] font-semibold text-gray-900 tracking-wide">
                  Lucky Shop App
                </p>
              </div>
            </div>

            {/* Dropdown (Toggle on click) */}
            {appOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-50 flex p-4 w-[320px] sm:w-[360px] animate-fade-in">
                {/* QR Code */}
                <div className="w-24 h-24 border border-gray-300 flex items-center justify-center rounded-md">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://play.google.com/store"
                    alt="QR Code"
                    className="w-20 h-20"
                  />
                </div>

                {/* Text & Buttons */}
                <div className="ml-4 flex flex-col justify-between">
                  <p className="text-sm font-semibold text-gray-800">
                    Download the Lucky Shop app
                  </p>
                  <p className="text-xs text-gray-500">Scan the QR code to download</p>

                  <div className="flex gap-2 mt-3">
                    <a
                      href="https://apps.apple.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="h-8"
                    >
                      <img
                        src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                        alt="App Store"
                        className="h-8"
                      />
                    </a>
                    <a
                      href="https://play.google.com/store"
                      target="_blank"
                      rel="noreferrer"
                      className="h-8"
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                        alt="Google Play"
                        className="h-8"
                      />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsNavbar;
