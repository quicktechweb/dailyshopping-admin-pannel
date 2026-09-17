import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";

export default function CampaignProducts() {
  const { campaignId } = useParams();
  const [products, setProducts] = useState([]);
  const [shuffledProducts, setShuffledProducts] = useState([]);
  const [couponData, setCouponData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [expanded, setExpanded] = useState(false);
  const [campaignName, setCampaignName] = useState("");

  // 🔹 Fetch campaign products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get(`/products/${campaignId}/products`);
        if (res.data.success) {
          setProducts(res.data.products);
          if (res.data.products.length > 0) {
            setCampaignName(res.data.products[0].campaignName);
          }
        }
      } catch (err) {
        console.error("Error fetching campaign products:", err);
      }
    };
    fetchProducts();
  }, [campaignId]);

  // 🔹 Shuffle products
  useEffect(() => {
    if (!products.length) return;
    const shuffleArray = (arr) => {
      let array = [...arr];
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    setShuffledProducts(shuffleArray(products));
  }, [products]);

  // 🔹 Fetch coupon data
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axiosInstance.get("/coupons");
        if (res.data.success) setCouponData(res.data.coupons);
      } catch (err) {
        console.error("Error fetching coupons:", err);
      }
    };
    fetchCoupons();
  }, []);

  // 🔹 Helper functions
  const getLatestRound = (productId) => {
    const productCoupons = couponData.filter((c) => c.productId === productId);
    if (!productCoupons.length) return 1;
    return Math.max(...productCoupons.map((c) => c.round || 1));
  };

  const getStats = (product) => {
    const totalcupon = product.totalcupon || 0;
    const latestRound = getLatestRound(product._id);
    const sold = couponData.filter(
      (c) => c.productId === product._id && c.round === latestRound
    ).length;
    const remaining = Math.max(totalcupon - sold, 0);
    return { sold, totalcupon, remaining };
  };

  // 🔹 Show more / hide products
  const handleSeeMore = () => {
    const nextCount = visibleCount + 12;
    setVisibleCount(nextCount > shuffledProducts.length ? shuffledProducts.length : nextCount);
    setExpanded(true);
  };
  const handleHide = () => {
    setVisibleCount(12);
    setExpanded(false);
  };

   const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/&/g, "-and-")
      .replace(/[\s\W-]+/g, "-");

  return (
    <div className=" py-6 px-4 max-w-[1280px] md:max-w-[1380px] sm:max-w-[95%] mx-auto lg:px-20">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">{campaignName}</h1>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {shuffledProducts.slice(0, visibleCount).map((product) => {
          const { sold, totalcupon, remaining } = getStats(product);
          return (
            <Link
               to={`/productdetails/${product._id}/${slugify(product.title)}`}
              key={product._id}
              className="group rounded-xl overflow-hidden  hover:shadow-2xl transition-transform transform hover:scale-105 flex flex-col"
            >
              {/* Product Image */}
              <div className="relative w-full h-44 bg-white overflow-hidden">
                <img
                  src={product.images?.[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-[#19745B] text-white font-semibold px-2 py-1 rounded-full shadow">
                    -{product.discount}%
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-2 flex-grow">
                <div className="flex gap-1 mb-1 text-xs font-semibold">
                  <span className="bg-yellow-300 text-black px-1 rounded">Choice</span>
                  <span className="bg-red-500 text-white px-1 rounded">Sale</span>
                </div>

                <p className="text-sm font-medium text-gray-700 truncate">{product.title}</p>

                <div className="flex items-center gap-2">
                  <p className="text-red-600 font-bold">৳{product.ProductPrice}</p>
                  <p className="line-through text-gray-400 text-xs">৳{product.oldPrice}</p>
                  <p className="text-red-500 text-xs">-{product.discount}%</p>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <div
                    className="h-1 rounded-full bg-[#19745B] transition-all duration-500"
                    style={{ width: `${(sold / (totalcupon || 1)) * 100}%` }}
                  ></div>
                </div>

                <div className="mt-2 w-full">
                  <div className="flex justify-between items-center text-center gap-1">
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-sm font-bold text-green-600">{sold}</span>
                      <span className="text-[11px] text-gray-500">Sold</span>
                    </div>

                    <div className="w-px h-8 bg-gray-200"></div>

                    <div className="flex flex-col items-center flex-1">
                      <span className="text-sm font-bold text-yellow-600">{totalcupon}</span>
                      <span className="text-[11px] text-gray-500">Coupon</span>
                    </div>

                    <div className="w-px h-8 bg-gray-200"></div>

                    <div className="flex flex-col items-center flex-1">
                      <span className="text-sm font-bold text-gray-800">{remaining}</span>
                      <span className="text-[11px] text-gray-500">Remaining</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* See More / Hide Button */}
      {visibleCount < shuffledProducts.length ? (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSeeMore}
            className="bg-gradient-to-r from-[#8CD005] to-[#19745B] text-white font-semibold px-6 py-2 rounded shadow hover:opacity-90 transition"
          >
            See Products
          </button>
        </div>
      ) : expanded ? (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleHide}
            className="bg-gray-400 text-white font-semibold px-6 py-2 rounded shadow hover:opacity-90 transition"
          >
            Hide Products
          </button>
        </div>
      ) : null}
    </div>
  );
}
