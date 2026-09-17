import { useContext, useEffect, useRef, useState } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaChevronDown,
  FaQrcode,
  FaBars,
  FaRegHeart,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import Noti from "../../HomePage/Notifications/Noti";
import useAuth from "../../Hooks/useAuth";
import axios from "axios";
import { ScanSearch } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";

const cache = {};
window.myCache = cache; // Expose for easy inspection in DevTools

const CACHE_DURATION = 3 * 60 * 1000;

export default function LuckyShopNavbar() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [active, setActive] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategories, setNewCategories] = useState([]);
  const [moreItems, setMoreItems] = useState([]);
  const navigate = useNavigate();
  const timer = useRef(null);
  const [appOpen, setAppOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const cartProducts = useContext(CartContext)[0];

  let totalQuantity = cartProducts.reduce(
    (acc, product) => acc + (product.quantity || 1),
    0,
  );
  const { user } = useAuth();
  // const role = user?.newpartroles;
  const username = user?.displayName || "User";

  const [wishlist, setWishlist] = useState([]);
  const email = user?.email || "";
  const phone = user?.phoneNumber || "";

  const [opens, setOpens] = useState(false);
  const closeTimers = useRef(null);

  const handleEnters = () => {
    clearTimeout(closeTimers.current);
    setOpens(true);
  };

  const handleLeaves = () => {
    closeTimers.current = setTimeout(() => {
      setOpens(false);
    }, 200); //  professional delay
  };

  const slugify = (text = "") =>
    text
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  // 🔥 Load Wishlist
  useEffect(() => {
    if (!email && !phone) return;

    const fetchWishlist = async () => {
      try {
        const res = await axiosInstance.get("/wishlist", {
          params: { email, phone },
        });
        setWishlist(res.data);
      } catch (error) {
        console.error("Wishlist load failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [email, phone]);

  // fetch all products
  const cacheKey = "filter_category_products";
  const cacheTimerRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      // 🔹 Check if cached & not expired
      const cached = cache[cacheKey];
      if (cached && Date.now() < cached.expiry) {
        // console.log("Using cached data:", cached);
        setProducts(cached.data);
        setLoading(false);
        return;
      }

      try {
        // ✅ axiosInstance instead of fetch
        const res = await axios.get(
          "https://dailyshopping-backend.onrender.com/api/products/filterapidata",
        );
        const data = res.data;
        setProducts(data);

        //  Set in-memory cache with expiry
        cache[cacheKey] = {
          data,
          expiry: Date.now() + CACHE_DURATION,
        };
        // console.log("Cache updated:", cache);

        // 🔹 Auto clear cache after expiry
        if (cacheTimerRef.current) clearTimeout(cacheTimerRef.current);
        cacheTimerRef.current = setTimeout(() => {
          delete cache[cacheKey];
          // console.log("Cache expired:", cache);
        }, CACHE_DURATION);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Build category → subcategory → childcategory structure
  useEffect(() => {
    const catMap = {};
    products.forEach((product) => {
      if (!product.categoryName) return;

      if (!catMap[product.categoryName]) {
        catMap[product.categoryName] = {
          name: product.categoryName,
          image: product.categoryImg || "",
          sub: [],
        };
      }

      if (product.subcategoryName) {
        let subcat = catMap[product.categoryName].sub.find(
          (s) => s.title === product.subcategoryName,
        );
        if (!subcat) {
          subcat = {
            title: product.subcategoryName,
            image: product.subcategoryImg || "",
            children: [],
          };
          catMap[product.categoryName].sub.push(subcat);
        }

        if (product.childcategoryName) {
          const exists = subcat.children.find(
            (c) => c.name === product.childcategoryName,
          );
          if (!exists) {
            subcat.children.push({
              name: product.childcategoryName,
              image: product.childcategoryImg || product.images?.[0] || "",
            });
          }
        }
      }
    });
    setCategories(Object.values(catMap));
  }, [products]);

  const handleEnter = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timer.current = setTimeout(() => setOpen(false), 150);
    setActive(null);
  };

  // Close mega menu on click
  const closeMegaMenu = () => {
    setOpen(false);
    setActive(null);
  };

  // 🔍 Text Search Logic
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const lowerSearch = search.toLowerCase();
    const matched = [];

    products.forEach((product) => {
      // ✅ CATEGORY
      if (product.categoryName?.toLowerCase().includes(lowerSearch)) {
        matched.push({
          type: "Category",
          label: product.categoryName,
          link: `/category/${slugify(product.categoryName, { lower: true })}`,
          image: product.categoryImg,
        });
      }

      // ✅ SUB CATEGORY
      if (product.subcategoryName?.toLowerCase().includes(lowerSearch)) {
        matched.push({
          type: "Subcategory",
          label: product.subcategoryName,
          link: `/category/${slugify(product.categoryName, {
            lower: true,
          })}/${slugify(product.subcategoryName, { lower: true })}`,
          image: product.subcategoryImg,
        });
      }

      // ✅ CHILD CATEGORY
      if (product.childcategoryName?.toLowerCase().includes(lowerSearch)) {
        matched.push({
          type: "Childcategory",
          label: product.childcategoryName,
          link: `/category/${slugify(product.categoryName, {
            lower: true,
          })}/${slugify(product.subcategoryName, {
            lower: true,
          })}/${slugify(product.childcategoryName, { lower: true })}`,
          image: product.childcategoryImg,
        });
      }

      // ✅ BRAND
      if (product.brandName?.toLowerCase().includes(lowerSearch)) {
        matched.push({
          type: "Brand",
          label: product.brandName,
          link: `/brand/${slugify(product.brandName, { lower: true })}`,
          image: product.brandImg,
        });
      }

      // ✅ PRODUCT TITLE
      if (product.title?.toLowerCase().includes(lowerSearch)) {
        matched.push({
          type: "Product",
          label: product.title,
          link: `/product-search/${slugify(product.title, { lower: true })}`,
          image: product.images?.[0] || product.childcategoryImg || "",
        });
      }
    });

    //  remove duplicate by label
    const unique = Array.from(
      new Map(matched.map((m) => [m.label, m])).values(),
    );

    setSuggestions(unique.slice(0, 10));
  }, [search, products]);

  //  Image Search Logic

  useEffect(() => {
    setSuggestions([]);
    // setSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const handleImageSearch = async (file) => {
    if (!file) return;
    setLoadings(true);
    setSuggestions([]);
    // setSearch("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "https://dailyshopping-backend.onrender.com/api/products/image-search",
        formData,
      );
      if (res.data && res.data.length > 0) {
        // Smooth transition effect before navigation
        document.body.style.opacity = "0.7";
        setTimeout(() => {
          document.body.style.opacity = "1";
        }, 400);

        navigate(res.data[0].link);
      } else {
        alert("No related results found!");
      }
    } catch (err) {
      console.error("❌ Image search error:", err);
      alert("No related results found!");
    } finally {
      setLoadings(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://dailyshopping-backend.onrender.com/api/navbarcategory",
      );
      const data = res.data;

      // Filter by type
      setNewCategories(data.filter((cat) => cat.type === "newCategory"));
      setMoreItems(data.filter((cat) => cat.type === "moreItem"));
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <header className="w-full bg-white shadow-sm hidden sm:block border-gray-200">
        {/* ===== Top Section ===== */}
        <div className="flex justify-center">
          <div className="w-[95%] md:w-[90%] lg:w-[1200px] flex items-center justify-between py-3">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://i.ibb.co.com/VY92LX2H/Logo-Lucky-Shop1.png"
                alt="Lucky Shop"
                className="h-12 w-auto object-contain"
              />
            </Link>

            {/* Search Bar */}
            <div className="flex-1 mx-10 max-w-2xl relative transition-all duration-500">
              {/*  Text Input */}
              <input
                type="text"
                placeholder="Search for category, product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
               onKeyDown={(e) => {
  if (e.key === "Enter") {
    if (!search.trim()) return;

    const keyword = search.toLowerCase().trim();

    // 1️⃣ CATEGORY / SUB / CHILD (আগের মতোই)
    const found = products.find(
      (p) =>
        p.childcategoryName?.toLowerCase() === keyword ||
        p.subcategoryName?.toLowerCase() === keyword ||
        p.categoryName?.toLowerCase() === keyword
    );

    if (found) {
      if (found.childcategoryName?.toLowerCase() === keyword) {
        navigate(
          `/category/${slugify(found.categoryName)}/${slugify(
            found.subcategoryName
          )}/${slugify(found.childcategoryName)}`
        );
      } else if (found.subcategoryName?.toLowerCase() === keyword) {
        navigate(
          `/category/${slugify(found.categoryName)}/${slugify(
            found.subcategoryName
          )}`
        );
      } else {
        navigate(`/category/${slugify(found.categoryName)}`);
      }
    }

    // 2️⃣ BRAND SEARCH (⭐ NEW)
    else if (
      products.some((p) =>
        p.brandName?.toLowerCase().includes(keyword)
      )
    ) {
      navigate(`/brand/${slugify(search, { lower: true })}`);
    }

    // 3️⃣ TITLE SEARCH (⭐ NEW)
    else if (
      products.some((p) =>
        p.title?.toLowerCase().includes(keyword)
      )
    ) {
      navigate(`/product-search/${slugify(search, { lower: true })}`);
    }

    // 4️⃣ FALLBACK
    else {
      navigate(`/product-search/${slugify(search, { lower: true })}`);
    }

    // setSearch("");
    setSuggestions([]);
  }
}}

                className="w-full border border-gray-300 rounded-full py-2.5 pl-4 pr-20 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
              />

              {/* 🔍 Search Button */}
              <button
                onClick={() => {
                  if (suggestions.length > 0) {
                    navigate(suggestions[0].link);
                    // setSearch("");
                    setSuggestions([]);
                  }
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-black text-white rounded-full p-2.5 flex items-center justify-center hover:bg-gray-900 transition"
              >
                <FaSearch className="text-sm" />
              </button>

              {/* 📷 Image Upload Button */}
              <label className="absolute right-12 top-1/2 -translate-y-1/2 cursor-pointer">
                <ScanSearch className="w-6 h-6 text-gray-600 hover:text-black transition" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageSearch(e.target.files[0])}
                />
              </label>

              {/* 🔽 Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 transition-all duration-300">
                  <ul className="max-h-72 overflow-y-auto">
                    {suggestions.map((s, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 transition-colors duration-200"
                        onClick={() => {
                          navigate(s.link);
                          // setSearch("");
                          setSuggestions([]);
                        }}
                      >
                        {s.image ? (
                          <img
                            src={s.image}
                            alt={s.label}
                            className="w-10 h-10 object-cover rounded-md border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 text-xs">
                            N/A
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">{s.label}</p>
                          <p className="text-gray-400 text-xs">{s.type}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {loadings && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-lg z-50 p-4 flex flex-col items-center justify-center animate-fade-in">
                  {/* Spinner */}
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mb-2"></div>

                  {/* Text */}
                  <p className="text-gray-700 text-sm font-medium tracking-wide">
                    Searching by image...
                  </p>

                  {/* Subtext shimmer */}
                  <p className="text-gray-400 text-xs mt-1 animate-pulse">
                    Please wait a moment
                  </p>
                </div>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-10">
              <div
                className="relative hidden lg:block"
                onMouseEnter={() => setAppOpen(true)}
                onMouseLeave={() => setAppOpen(false)}
              >
                {/* Small Right Section */}
                <div className="flex items-center gap-2 cursor-pointer">
                  <FaQrcode className="text-3xl text-gray-700" />
                  <div className="leading-tight">
                    <p className="text-sm font-medium">Download the</p>
                    <p className="text-sm font-semibold text-gray-900">
                      Lucky Shop App
                    </p>
                  </div>
                </div>

                {/* Hover Dropdown */}
                {appOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-50 flex p-4 w-[360px]">
                    <div className="w-28 h-28 border border-gray-300 flex items-center justify-center rounded-md">
                      <img
                        src="https://i.ibb.co.com/zhnzR7d4/Playstore-Lucky.png"
                        alt="QR Code"
                        className="w-24 h-24"
                      />
                    </div>
                    <div className="ml-4 flex flex-col justify-between">
                      <p className="text-sm font-semibold text-gray-800">
                        Download the Lucky Shop app
                      </p>
                      <p className="text-xs text-gray-500">
                        Scan the QR code to download
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Link
                          to="https://apps.apple.com/ua/app/luckyshop-online-shopping-app/id6755921284"
                          target="_blank"
                          rel="noreferrer"
                          className="h-10"
                        >
                          <img
                            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                            alt="App Store"
                            className="h-10"
                          />
                        </Link>
                        <Link
                          to="https://play.google.com/store/apps/details?id=com.lkshop.ecom&hl=en"
                          target="_blank"
                          rel="noreferrer"
                          className="h-10"
                        >
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                            alt="Google Play"
                            className="h-10"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Account */}
              <div className="flex flex-col items-start leading-tight">
                {user ? (
                  <>
                    <p className="text-sm font-medium text-gray-700">
                      Welcome Back
                    </p>
                    <div className="text-xs text-gray-600 flex items-center gap-2">
                      <Link to="/dashboard">
                        <span className="font-semibold text-gray-800">
                          {username}
                        </span>
                      </Link>
                      {/* {role && (
              <span className="bg-blue-100 text-blue-600 text-[10px] font-medium px-2 py-[2px] rounded-md">
                {role}
              </span>
            )} */}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-700">Welcome</p>
                    <div className="text-xs text-gray-500 flex gap-1">
                      <Link
                        to="/login"
                        className="hover:text-black transition font-medium"
                      >
                        Sign in
                      </Link>
                      /
                      <Link
                        to="/registration"
                        className="hover:text-black transition font-medium"
                      >
                        Register
                      </Link>
                    </div>
                  </>
                )}
              </div>

              <Noti />
              <div className="relative inline-block">
                {/* Count Badge */}
                {wishlist.length > 0 && (
                  <span className="absolute -top-3 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {wishlist.length}
                  </span>
                )}

                {/* Heart Icon */}
                <Link to="/dashboard/userwhitelist">
                  <FaRegHeart className="text-black-500 text-2xl" />
                </Link>
              </div>

              {/* Cart */}
              <Link to="/orderreview">
                <div className="flex flex-col items-center relative">
                  <div className="relative">
                    <FaShoppingCart className="text-2xl text-gray-800" />
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                      {totalQuantity || 0}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-700 mt-1">Cart</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* ===== Bottom Menu Section ===== */}
        <nav className="bg-white border-t border-gray-100">
          <div className="flex justify-center">
            <div className="w-[95%] md:w-[95%] lg:w-[1100px] xl:w-[1200px] flex items-center justify-between">
              {/* Left: All Categories */}
              <div
                className="relative hidden md:block ms-4"
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
              >
                <button className="flex items-center gap-2 font-semibold text-gray-800 hover:text-black transition">
                  <FaBars /> <span>All Categories</span>
                </button>

                {/* Mega Menu */}
                <div
                  className={`absolute left-0 top-full mt-4 bg-white shadow-2xl border border-gray-200 rounded-2xl overflow-hidden
                transition-all duration-300 ease-out
                ${
                  open
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                    : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                }`}
                  style={{ zIndex: 9999 }}
                >
                  <div className="flex  w-[95%] md:w-[95vw] lg:w-[1000px] xl:w-[1200px] h-[500px]  relative">
                    {/* Left Column: Categories */}
                    <ul className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                      {categories.map((cat, idx) => (
                        <li
                          key={cat.name}
                          onMouseEnter={() => setActive(idx)}
                          className={`flex items-center px-4 py-4 text-sm cursor-pointer transition-colors duration-200 rounded-r-lg
                        ${
                          active === idx
                            ? "bg-white text-black font-semibold shadow-inner"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                        >
                          <Link
                            to={`/category/${cat.name
                              .toLowerCase()
                              .replace(/&/g, "and")
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/(^-|-$)/g, "")}`}
                            className="flex items-center w-full"
                            onClick={closeMegaMenu}
                          >
                            {cat.image && (
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-6 h-6 mr-2 object-cover rounded"
                              />
                            )}
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* Right Column: Active Category Details */}
                    {active !== null && categories[active] && (
                      <div className="flex-1 bg-white p-6 overflow-y-auto z-50">
                        <h3 className="text-xl font-semibold text-gray-800 mb-5 border-b border-gray-200 pb-3">
                          {categories[active].name}
                        </h3>

                        {/* Childcategory Images */}
                        <div className="flex flex-wrap gap-4 mb-6">
                          {categories[active].sub.flatMap((sub) =>
                            sub.children.map((child) => (
                              <Link
                                key={child.name}
                                to={`/category/${slugify(
                                  categories[active].name,
                                )}/${slugify(sub.title)}/${slugify(child.name)}`}
                                className="flex flex-col items-center w-20 hover:scale-105 transition-transform"
                                onClick={closeMegaMenu}
                              >
                                {child.image && (
                                  <img
                                    src={child.image}
                                    alt={child.name}
                                    className="w-16 h-16 object-contain rounded-lg border p-1 shadow-sm"
                                  />
                                )}
                                <h5 className="text-xs mt-2 text-gray-700 font-medium text-center">
                                  {child.name}
                                </h5>
                              </Link>
                            )),
                          )}
                        </div>

                        {/* Subcategory List */}
                        <div className="grid grid-cols-2 gap-6">
                          {categories[active].sub.map((subItem) => (
                            <div key={subItem.title}>
                              <h4 className="font-semibold text-gray-700 mb-3">
                                <Link
                                  to={`/category/${slugify(categories[active].name)}/${slugify(
                                    subItem.title,
                                  )}`}
                                  className="hover:text-red-600 transition-colors"
                                  onClick={closeMegaMenu}
                                >
                                  {subItem.title}
                                </Link>
                              </h4>
                              <ul className="space-y-2">
                                {subItem.children.map((child) => (
                                  <li key={child.name}>
                                    <Link
                                      to={`/category/${slugify(categories[active].name)}/${slugify(
                                        subItem.title,
                                      )}/${slugify(child.name)}`}
                                      className="text-sm text-gray-600 hover:text-black transition-colors duration-200"
                                      onClick={closeMegaMenu}
                                    >
                                      {child.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Center Links */}
              <div className="flex items-center gap-10 justify-center flex-1">
                {/* Fixed Campaign item */}
                <Link to="/campain">
                  <div className="relative py-3 -ms-3 px-3 text-sm font-semibold cursor-pointer select-none">
                    <span className="animate-[textPulse_2s_ease-in-out_infinite]">
                      Campaign
                    </span>
                  </div>
                </Link>
                <Link to="/winnerstatics">
                  <div className="relative py-3 px-2 text-sm font-semibold cursor-pointer select-none">
                    <span className="">Winnerslist</span>
                  </div>
                </Link>

                {/* Show up to 5 categories with same color as Campaign */}
               {/* Large device (lg) → 4 items */}
{newCategories.slice(0, 4).map((cat, index) => (
  <Link
    key={cat._id}
    to={`/category/${cat.categoryName
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}`}
    className={`
      py-3 text-sm -ms-4 font-medium whitespace-nowrap
      text-gray-700 hover:text-black
      ${index >= 1 ? "hidden lg:block" : ""}
    `}
  >
    {cat.categoryName}
  </Link>
))}



                <div
                  className="relative z-[30]" // ensure dropdown is above bannersec
                  onMouseEnter={handleEnters}
                  onMouseLeave={handleLeaves}
                >
                  {/* Trigger – SINGLE hover target */}
                  <div
                    className="
      flex items-center justify-center gap-1
      px-4 py-4
      text-sm font-medium text-gray-700
      hover:text-black cursor-pointer
    "
                  >
                    <span className="pointer-events-none -ms-9">More</span>
                    <FaChevronDown
                      className={`pointer-events-none text-xs transition-transform duration-300 ${
                        opens ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Dropdown */}
                  <div
                    className={`
      absolute top-full left-1/2 -translate-x-1/2
      mt-1 // slight margin so hover triggers properly
      w-44 z-[40] // above everything in bannersec
      bg-white border border-gray-200 shadow-xl rounded-md
      transition-all duration-300 ease-out
      ${
        opens
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-2 pointer-events-none"
      }
    `}
                  >
                   <ul className="py-2 text-sm text-gray-700">
  {moreItems.map((item) => (
    <li
      key={item._id}
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
    >
      <Link
        to={`/category/${item.categoryName}`}
        className="block w-full h-full"
      >
        {item.categoryName}
      </Link>
    </li>
  ))}
</ul>
                  </div>
                </div>
              </div>

              {/* Right Dropdown */}
            </div>
          </div>
        </nav>
      </header>

      {/* mobile responsive  */}
      <div className="sm:hidden fixed top-0 left-0 w-full bg-white p-2 flex flex-col items-center  z-50">
        {/* Logo and Location */}
        <div className="w-full flex items-center justify-between mb-2 px-2">
          <Link to="/">
            <img
              className="h-10"
              src="https://i.ibb.co.com/VY92LX2H/Logo-Lucky-Shop1.png"
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
                <p className="text-[11px] text-gray-600 font-medium">
                  Download the
                </p>
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
                  <p className="text-xs text-gray-500">
                    Scan the QR code to download
                  </p>

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

        {/* Search Bar mobile  */}
        <div className="relative w-full max-w-md mx-auto mt-4">
          {/* 🔍 Search Bar */}
          <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden border border-gray-200">
            {/* Input */}
            <input
              type="text"
              placeholder="Search for category, product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  if (!search.trim()) return;

                  try {
                    const res = await axios.get(
                      `https://dailyshopping-backend.onrender.com/api/products/searchvalue?q=${search}`,
                    );

                    const products = res.data.data;

                    navigate(`/search/${encodeURIComponent(search)}`, {
                      state: { results: products, keyword: search },
                    });

                    // setSearch("");
                    setSuggestions([]);
                  } catch (err) {
                    console.error(err);
                    alert("Search failed!");
                  }
                }
              }}
              className="flex-grow px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
            />

            {/* 📷 Image Upload */}
            <label className="px-3 cursor-pointer flex items-center border-l border-gray-200 hover:bg-gray-50 transition">
              <ScanSearch className="w-5 h-5 text-gray-600 hover:text-[#19745B] transition" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageSearch(e.target.files[0])}
              />
            </label>

            {/* 🔍 Button */}
            <button
              onClick={() => {
                if (suggestions.length > 0) {
                  navigate(suggestions[0].link);
                  // setSearch("");
                  setSuggestions([]);
                }
              }}
              className="bg-[#19745B] hover:bg-[#145a44] transition px-4 py-3 flex items-center justify-center"
            >
              <FaSearch className="text-white text-lg" />
            </button>
          </div>

          {/* 🧠 Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 transition-all duration-300">
              <ul className="max-h-72 overflow-y-auto">
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 transition"
                    onClick={() => {
                      navigate(s.link);
                      // setSearch("");
                      setSuggestions([]);
                    }}
                  >
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.label}
                        className="w-10 h-10 object-cover rounded-md border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 text-xs">
                        N/A
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{s.label}</p>
                      <p className="text-gray-400 text-xs">{s.type}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ⏳ Loading Animation */}
          {loadings && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-lg z-50 p-4 flex flex-col items-center justify-center animate-fade-in">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-[#19745B] rounded-full animate-spin mb-2"></div>
              <p className="text-gray-700 text-sm font-medium tracking-wide">
                Searching by image...
              </p>
              <p className="text-gray-400 text-xs mt-1 animate-pulse">
                Please wait a moment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
