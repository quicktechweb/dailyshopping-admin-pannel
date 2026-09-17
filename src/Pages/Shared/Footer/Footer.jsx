import { useEffect, useState, useContext } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaPhoneAlt,
  FaMobileAlt,
  FaDownload,
  FaRocket,
  FaBoxOpen,
  FaHome,
  FaShoppingCart,
  FaUser,
  FaList,
  FaGift,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";

const Footer = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path;
  const cartProducts = useContext(CartContext)[0];
  const { user } = useAuth();

  let totalQuantity = cartProducts.reduce(
    (acc, product) => acc + (product.quantity || 1),
    0
  );

  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/footer")
      .then((res) => {
        if (res.data.success && res.data.footer) {
          setFooterData(res.data.footer);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  if (!footerData) return null;

  return (
    <div>
      <footer className="bg-white hidden sm:block text-sm text-gray-700 mt-5">
        {/* Top Footer Grid */}
        <div className="max-w-[1280px] md:max-w-[1380px] sm:max-w-[95%] mx-auto lg:px-20 px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* QUICK LINKS */}
          <div>
            <h4 className="text-gray-800 font-semibold text-base mb-4">
              {footerData.headings?.quickLinks || "Quick Links"}
            </h4>
            <ul className="space-y-2 text-gray-600">
              {/* {footerData.quickLinks?.map((link) => ( */}
              <li>
                <Link
                  to={`/about`}
                  className="hover:text-blue-600 cursor-pointer transition block"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  to={`/contactus`}
                  className="hover:text-blue-600 cursor-pointer transition block"
                >
                  Contact Us
                </Link>
              </li>
              <li>
               <a
  href="https://luckyshop.com.bd/sitemap.xml"
  target="_blank"
  rel="noopener noreferrer"
  className="hover:text-blue-600 cursor-pointer transition block"
>
  Sitemap
</a>

              </li>
              <li>
                <Link
                  to={`/shippingpolicy`}
                  className="hover:text-blue-600 cursor-pointer transition block"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to={`/warrantypolicy`}
                  className="hover:text-blue-600 cursor-pointer transition block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to={`/termsconditions`}
                  className="hover:text-blue-600 cursor-pointer transition block"
                >
                  Terms Conditions
                </Link>
              </li>
              {/* ))} */}
            </ul>
          </div>

          {/* LUCKYSHOP */}
          <div>
            <h4 className="text-gray-800 font-semibold text-base mb-4">
              {footerData.headings?.luckyShop || "LuckyShop"}
            </h4>
            <ul className="space-y-2 text-gray-600">
              {/* {footerData.luckyShop?.map((link) => ( */}
              <li>
                <Link
                  to={`/`}
                  className="hover:text-blue-600 cursor-pointer transition block"
                >
                  Download App
                </Link>
              </li>
              <li>
                <Link
                  to={`/brandlist`}
                  className="hover:text-blue-600 cursor-pointer transition block"
                >
                  Brand List
                </Link>
              </li>
              <li>
                <Link
                  to={`/blog`}
                  className="hover:text-blue-600 cursor-pointer transition block"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to={`/faq`}
                  className="hover:text-blue-600 cursor-pointer transition block"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to={`/customerreview`}
                  className="hover:text-blue-600 cursor-pointer transition block"
                >
                  Customer Review
                </Link>
              </li>
              <li>
                <Link
                  to={`/dashboard/trackorders`}
                  className="hover:text-blue-600 cursor-pointer transition block"
                >
                  Track Order
                </Link>
              </li>
              {/* ))} */}
            </ul>
          </div>

          {/* PAYMENT METHODS */}
          <div>
            <h4 className="text-gray-800 font-semibold text-base mb-4">
              {footerData.headings?.payment || "Payment"}
            </h4>
            <div className="space-y-3">
              {footerData.payment?.map((p) => (
                <div key={p._id} className="flex items-center space-x-2">
                  <img src={p.icon} alt={p.name} className="w-6 h-6" />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SHIPPING OPTIONS */}
          <div>
            <h4 className="text-gray-800 font-semibold text-base mb-4">
              {footerData.headings?.shipping || "Shipping"}
            </h4>
            <div className="space-y-4">
              {footerData.shipping?.map((s) => (
                <div key={s._id} className="flex items-start space-x-3">
                  <span className="bg-gray-400 px-2 py-1 rounded text-white font-semibold text-sm flex items-center justify-center">
                    {s.label === "Express Shipping" && <FaRocket />}
                    {s.label === "Standard Shipping" && <FaBoxOpen />}
                  </span>
                  <div>
                    <p className="font-semibold">{s.label}</p>
                    <p className="text-xs text-gray-500">{s.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CITIES COVERED */}
          <div>
            <h4 className="text-gray-800 font-semibold text-base mb-4">
              {footerData.headings?.citiesCovered || "Cities Covered"}
            </h4>
            <ul className="space-y-2 text-gray-600">
              {footerData.citiesCovered?.map((city, i) => (
                <li key={i}>{city}</li>
              ))}
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="text-gray-800 font-semibold text-base mb-4">
              {footerData.headings?.support || "24/7 Support"}
            </h4>
            <div className="-ms-3 rounded-md p-3 mb-3 ">
              <p className="font-semibold text-gray-700 flex items-center gap-2">
                <FaPhoneAlt /> {footerData.boxed?.title || "Customer Support"}
              </p>
              <p className="text-xs text-gray-500">{footerData.boxed?.note}</p>
            </div>
            <div className="mb-3 flex items-center gap-2">
              <FaMobileAlt className="text-base" />
              <span>{footerData.boxed?.servicesLabel}</span>
              <span>{footerData.boxed?.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaDownload />
              <p className="font-semibold">{footerData.boxed?.downloadAppLabel}</p>
            </div>
            <div className="grid grid-cols-2 space-x-3 mt-2">
              <img
                src={footerData.boxed?.appImages?.apple}
                alt="Apple"
                className="h-8"
              />
              <img
                src={footerData.boxed?.appImages?.google}
                alt="Google Play"
                className="h-8 "
              />
            </div>
          </div>
        </div>

      

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 mt-6 pt-4 border-t flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        
          <div className="flex items-center space-x-4 text-[20px]">
            <span>{footerData.followUsLabel}</span>
            {footerData.social?.map((s) => {
              const Icon = { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn }[s.icon];
              return Icon ? <Icon key={s._id} className="hover:text-blue-600 cursor-pointer" /> : null;
            })}
          </div>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 md:hidden">
        {" "}
        <div className="relative flex justify-between items-center px-6 py-2">
          {" "}
          {/* === Home === */}{" "}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center text-[11px] transition-all duration-300 ${isActive("/") ? "text-[#19745B] font-semibold" : "text-gray-500"
              }`}
          >
            {" "}
            <span className="text-xl mb-1">
              {" "}
              <FaHome />{" "}
            </span>{" "}
            <span className="mt-1">Home</span>{" "}
          </Link>{" "}
          {/* === Category === */}{" "}
          <Link
            to="/categorypartmobile"
            className={`flex flex-col items-center justify-center text-[11px] transition-all duration-300 ${isActive("/categorypartmobile")
                ? "text-[#19745B] font-semibold"
                : "text-gray-500"
              }`}
          >
            {" "}
            <span className="text-xl mb-1">
              {" "}
              <FaList />{" "}
            </span>{" "}
            <span className="mt-1">Category</span>{" "}
          </Link>{" "}
          {/* === Cart (center floating button) === */}{" "}
          <Link
            to="/orderreview"
            className={`relative flex flex-col items-center  justify-center text-[11px] transition-all duration-300 ${isActive("/orderreview") ? "text-[#19745B]" : "text-gray-500"
              }`}
          >
            <div className="absolute -top-12 left-1/3 transform -translate-x-1/2 bg-gradient-to-t from-[#19745B] to-[#1B9C7E] text-white rounded-full w-16 h-16 shadow-xl border-[5px] border-white flex items-center justify-center">
              <FaShoppingCart className="text-2xl" />
              {/* Quantity number on top-right corner of cart icon */}
              <span className="absolute top-1 right-2 bg-[#19745B] text-white w-5 h-5 text-xs rounded-full flex items-center justify-center font-bold">
                {totalQuantity || 0}
              </span>
            </div>
          </Link>

          {/* === Offers === */}{" "}
          <Link
            to="/winnerstatics"
            className={`flex flex-col items-center justify-center text-[11px] transition-all duration-300 ${isActive("/winnerstatics")
                ? "text-[#19745B] font-semibold"
                : "text-gray-500"
              }`}
          >
            {" "}
            <span className="text-xl mb-1">
              {" "}
              <FaGift />{" "}
            </span>{" "}
            <span className="mt-1">Winner</span>{" "}
          </Link>{" "}
          {/* === Account === */}{" "}
          <Link
            to={user ? "/dashboard" : "/registration"} // ✅ redirect logic
            className={`flex flex-col items-center justify-center text-[11px] transition-all duration-300 ${isActive(user ? "/dashboard" : "/registration")
                ? "text-[#19745B] font-semibold"
                : "text-gray-500"
              }`}
          >
            <span className="text-xl mb-1">
              <FaUser />
            </span>
            <span className="mt-1">{user ? "Dashboard" : "Account"}</span>
          </Link>
        </div>{" "}
      </div>
    </div>
  );
};

export default Footer;
