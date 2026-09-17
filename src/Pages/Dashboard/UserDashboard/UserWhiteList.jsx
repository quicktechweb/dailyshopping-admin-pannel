import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";

export default function UserWhiteList() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const email = user?.email || "";
  const phone = user?.phoneNumber || "";

    const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/&/g, "-and-")
      .replace(/[\s\W-]+/g, "-");
  // 🔥 Load Wishlist
  useEffect(() => {
    if (!email && !phone) return;

    const fetchWishlist = async () => {
      try {
        const res = await axios.get("https://dailyshopping-backend.onrender.com/api/wishlist", {
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

  // ❌ Delete item from wishlist
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://dailyshopping-backend.onrender.com/api/wishlist/${id}`);
      setWishlist(wishlist.filter(item => item._id !== id)); // UI থেকে রিমুভ
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };


  
  // Loading animation
  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  // No wishlist found
  if (!wishlist.length)
    return (
      <div className="text-center text-gray-500 py-16">
        <Heart className="w-10 h-10 mx-auto text-gray-300 mb-3" />
        <p className="text-lg">No wishlist items yet 💔</p>
        <p className="text-sm text-gray-400 mt-1">
          Start adding your favorite products!
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
          ❤️ Your Wishlist
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {wishlist.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="relative bg-white/80 backdrop-blur-lg border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden group"
            >
              {/* CLICK to go Product Details */}
              <Link   to={`/productdetails/${item.productData._id}/${slugify(item.productData.title)}`} className="block">
                <div className="relative">
                  <img
                    src={item?.productImg}
                    alt={item?.productTitle}
                    className="h-48 w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* ❤️ Remove wishlist button */}
                  <button
                    onClick={(e) => { e.preventDefault(); handleDelete(item._id); }}
                    className="absolute top-3 right-3 bg-white/90 text-red-500 rounded-full p-2 shadow hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Info */}
                <div className="px-4 pb-4">
                  <h3 className="font-semibold text-gray-800 line-clamp-1">
                    {item.productTitle}
                  </h3>
                  <p className="text-green-600 font-semibold mt-1">
                    ৳ {item.productPrice}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Added: {new Date(item.addedAt).toLocaleString()}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
