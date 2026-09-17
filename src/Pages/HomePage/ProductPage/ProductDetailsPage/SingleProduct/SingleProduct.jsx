import { useContext, useEffect, useState } from "react";
import { ShoppingCart, Minus, Plus, Star,   ChevronRight, ChevronLeft,X  } from "lucide-react";
import ScrollToTop from "../../ScrollToTop/ScrollToTop";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { CartContext } from "../../../Shared/Context/CartContext";
import CouponModal from "../../Home/TopSelling/CouponModal/CouponModal";

const products = [
  {
    id: 1,
    title: "24 Medium Square...",
    ProductPrice: 133,
    oldPrice: 521,
    discount: "−74%",
    rating: 4.9,
    sold: "3000+ sold",
    shop: "Dollar Express",
    totalcupon:100,
    remaining:90,
    solds:10,
    save: "Save $3.88",
    img: "https://ae-pic-a1.aliexpress-media.com/kf/S368ac380f4a9469fa055c4eb5ac393fdk.jpg_220x220q75.jpg_.avif",
  },
  {
    id: 2,
    title: "Airs Pro Wireless...",
    ProductPrice: 99,
    oldPrice: 62,
    discount: "−89%",
    rating: 4.3,
    totalcupon:200,
    remaining:10,
    solds:190,
    sold: "10,000+ sold",
    shop: "Tech Store",
    save: "New shoppers save $8.63",
    img: "https://ae-pic-a1.aliexpress-media.com/kf/S368ac380f4a9469fa055c4eb5ac393fdk.jpg_220x220q75.jpg_.avif",
  },
  {
    id: 3,
    title: "60D80D100D Thic...",
    ProductPrice: 226,
    oldPrice: 491,
    discount: "−54%",
    rating: 4.9,
    totalcupon:300,
    remaining:80,
    solds:220,
    sold: "2000+ sold",
    shop: "Beauty Hub",
    save: "Save $2.65",
    img: "https://ae-pic-a1.aliexpress-media.com/kf/S368ac380f4a9469fa055c4eb5ac393fdk.jpg_220x220q75.jpg_.avif",
  },
  {
    id: 4,
    title: "Continuous Fire Pistol...",
    ProductPrice: 99,
    oldPrice: 105,
    discount: "−90%",
    rating: 5.0,
    totalcupon:500,
    remaining:200,
    solds:300,
    sold: "160 sold",
    shop: "Toys World",
    save: "New shoppers save $9.59",
    img: "https://ae-pic-a1.aliexpress-media.com/kf/S368ac380f4a9469fa055c4eb5ac393fdk.jpg_220x220q75.jpg_.avif",
  },
  {
    id: 5,
    title: "Women Short Smart Wallet",
    ProductPrice: 133,
    oldPrice: 539,
    discount: "−75%",
    rating: 4.9,
    totalcupon:100,
    remaining:40,
    solds:60,
    sold: "4000+ sold",
    shop: "Dollar Express",
    save: "Save $4.06",
    img: "https://ae-pic-a1.aliexpress-media.com/kf/S368ac380f4a9469fa055c4eb5ac393fdk.jpg_220x220q75.jpg_.avif",
  },
  {
    id: 6,
    title: "Wireless Earbuds Pro",
    ProductPrice: 399,
    oldPrice: 125,
    discount: "−68%",
    rating: 4.7,
    totalcupon:600,
    remaining:200,
    solds:300,
    sold: "2500+ sold",
    shop: "Sound Hub",
    save: "Save $8.51",
    img: "https://ae-pic-a1.aliexpress-media.com/kf/S368ac380f4a9469fa055c4eb5ac393fdk.jpg_220x220q75.jpg_.avif",
  },
  {
    id: 7,
    title: "Wireless Earbuds Pro",
    ProductPrice: 399,
    oldPrice: 125,
    discount: "−68%",
    rating: 4.7,
    totalcupon:600,
    remaining:200,
    solds:300,
    sold: "2500+ sold",
    shop: "Sound Hub",
    save: "Save $8.51",
    img: "https://ae-pic-a1.aliexpress-media.com/kf/S368ac380f4a9469fa055c4eb5ac393fdk.jpg_220x220q75.jpg_.avif",
  },
  {
    id: 8,
    title: "Wireless Earbuds Pro",
    ProductPrice: 399,
    oldPrice: 125,
    discount: "−68%",
    rating: 4.7,
    totalcupon:600,
    remaining:200,
    solds:300,
    sold: "2500+ sold",
    shop: "Sound Hub",
    save: "Save $8.51",
    img: "https://ae-pic-a1.aliexpress-media.com/kf/S368ac380f4a9469fa055c4eb5ac393fdk.jpg_220x220q75.jpg_.avif",
  },
  {
    id: 9,
    title: "Wireless Earbuds Pro",
    ProductPrice: 399,
    oldPrice: 125,
    discount: "−68%",
    rating: 4.7,
    totalcupon:600,
    remaining:200,
    solds:300,
    sold: "2500+ sold",
    shop: "Sound Hub",
    save: "Save $8.51",
    img: "https://ae-pic-a1.aliexpress-media.com/kf/S368ac380f4a9469fa055c4eb5ac393fdk.jpg_220x220q75.jpg_.avif",
  },
  {
    id: 10,
    title: "Wireless Earbuds Pro",
    ProductPrice: 399,
    oldPrice: 125,
    discount: "−68%",
    rating: 4.7,
    totalcupon:600,
    remaining:200,
    solds:300,
    sold: "2500+ sold",
    shop: "Sound Hub",
    save: "Save $8.51",
    img: "https://ae-pic-a1.aliexpress-media.com/kf/S368ac380f4a9469fa055c4eb5ac393fdk.jpg_220x220q75.jpg_.avif",
  },
  {
    id: 11,
    title: "Wireless Earbuds Pro",
    ProductPrice: 399,
    oldPrice: 125,
    discount: "−68%",
    rating: 4.7,
    totalcupon:600,
    remaining:200,
    solds:300,
    sold: "2500+ sold",
    shop: "Sound Hub",
    save: "Save $8.51",
    img: "https://ae-pic-a1.aliexpress-media.com/kf/S368ac380f4a9469fa055c4eb5ac393fdk.jpg_220x220q75.jpg_.avif",
  },
  {
    id: 12,
    title: "Wireless Earbuds Pro",
    ProductPrice: 399,
    oldPrice: 125,
    discount: "−68%",
    rating: 4.7,
    totalcupon:600,
    remaining:200,
    solds:300,
    sold: "2500+ sold",
    shop: "Sound Hub",
    save: "Save $8.51",
    img: "https://ae-pic-a1.aliexpress-media.com/kf/S368ac380f4a9469fa055c4eb5ac393fdk.jpg_220x220q75.jpg_.avif",
  },
];

export default function ProductDetailsPage() {
  const [qty, setQty] = useState(1);
   const [isExpanded, setIsExpanded] = useState(false);
   
   const [selectedProduct, setSelectedProduct] = useState(null);
     const [couponOpen, setCouponOpen] = useState(false);
   
 


  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const total = 180;
  const sold = 8;
 
  const progress = (sold / total) * 100;

  // const thumbs = [
  //   "https://sellularr.netlify.app/images/11.jpg",
  //   "https://sellularr.netlify.app/images/guiter.jpg",
  //   "https://sellularr.netlify.app/images/pp1.jpg",
  //   "https://sellularr.netlify.app/images/pp1.jpg",
  //   "https://sellularr.netlify.app/images/guiter.jpg",
  //   "https://sellularr.netlify.app/images/pp1.jpg",
  //   "https://sellularr.netlify.app/images/pp1.jpg",
  //   "https://sellularr.netlify.app/images/guiter.jpg",
  // ];

// const images = [
//   "https://sellularr.netlify.app/images/11.jpg",
//   "https://sellularr.netlify.app/images/guiter.jpg",
//   "https://sellularr.netlify.app/images/pp1.jpg",
//   "https://sellularr.netlify.app/images/guiter.jpg",
//   "https://sellularr.netlify.app/images/guiter.jpg",
//   "https://sellularr.netlify.app/images/pp1.jpg",
//   "https://sellularr.netlify.app/images/guiter.jpg",
//   "https://sellularr.netlify.app/images/guiter.jpg"
// ];
  const [itemsPerView, setItemsPerView] = useState(2);
    const [openModal, setOpenModal] = useState(false);
      const [cart, setCart] = useContext(CartContext);
    

     const [indexs, setIndexs] = useState(0);
      const sizes = ["38mm","40mm","41mm","42mm","44mm","45mm","46mm","49mm"];
  const [showSizes, setShowSizes] = useState(false);

  const colors = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    img: "https://m.media-amazon.com/images/I/51QQROVVhyL._SS64_.jpg",
  }));

  const [showColors, setShowColors] = useState(false);
     const visibleCount = 6;
  const [startIndex, setStartIndex] = useState(0);
   const [counts, setCounts] = useState(6); 
  const [expandedvalue, setExpandedvalue] = useState(false); // toggle state

  //  const [cart, setCart] = useContext(CartContext);
   const [shuffledProducts, setShuffledProducts] = useState([]);
  const [couponData, setCouponData] = useState([]);


  useEffect(() => {
      const shuffleArray = (arr) => {
        let array = [...arr];
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };
  
      setShuffledProducts(shuffleArray(products));
    }, []); // only on mount
    
     
    const toggleSeeProducts = () => {
      if (expandedvalue) {
        setCounts(counts - 10);
      } else {
        setCounts(Math.min(counts + 10, shuffledProducts.length));
      }
      setExpandedvalue(!expandedvalue);
    };
  
    const showMore = () => {
      setCounts(shuffledProducts.length);
    };

  // const prevSlides = () => {
  //   if (startIndex > 0) {
  //     setStartIndex((prev) => prev - 1); // ১টা করে পেছনে যাবে
  //   }
  // };

  // const nextSlides = () => {
  //   if (startIndex < thumbs.length - visibleCount) {
  //     setStartIndex((prev) => prev + 1); // ১টা করে সামনে যাবে
  //   }
  // };

  // const visibleThumbs = thumbs.slice(startIndex, startIndex + visibleCount);

 


  // const nextImage = () => setIndexs((prev) => (prev + 1) % images.length);
  // const prevImage = () =>
  //   setIndexs((prev) => (prev - 1 + images.length) % images.length);


   // Detect screen width and adjust items per view
    useEffect(() => {
      const updateItemsPerView = () => {
        if (window.innerWidth < 768) {
          setItemsPerView(2); // Mobile/Tablet
        } else {
          setItemsPerView(5); // Desktop
        }
      };
      updateItemsPerView();
      window.addEventListener("resize", updateItemsPerView);
      return () => window.removeEventListener("resize", updateItemsPerView);
    }, []);
  
   
   // Define prices and discounts
  

 const reviewspart = [
    {
      country: "🇪🇸",
      name: "j***e",
      date: "17 Oct 2025",
      detail:
        "Band Color: Titanium Band Width: 42mm (Series 11 10) Ships From: CHINA",
      text: "Very good quality, just like in the photo.",
      img: "https://ae-pic-a1.aliexpress-media.com/kf/S4bddc2f52e0840d98531a68d17b401fbj.jpg_220x220q75.jpg_.avif",
    },
    {
      country: "🇮🇹",
      name: "R***i",
      date: "18 Oct 2025",
      detail:
        "Band Color: Silvery Band Width: 44 45 46mm 49mm Ships From: CHINA",
      text: "Excellent",
    },
    {
      country: "🇬🇧",
      name: "AliExpress Shopper",
      date: "17 Oct 2025",
      detail:
        "Band Color: Silver Band Width: 42mm Ships From: China",
      text: "Good quality band, pleased with it.",
    },
  ];

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  // const [indexs, setIndexs] = useState(0);
  // const [startIndex, setStartIndex] = useState(0);

 
    const nextImage = () => setIndexs((prev) => (prev + 1) % images.length);
    const prevImage = () =>
      setIndexs((prev) => (prev - 1 + images.length) % images.length);
  
    const thumbs = images;
    const visibleThumbs = thumbs.slice(startIndex, startIndex + visibleCount);
  
    const nextSlides = () => {
      if (startIndex + visibleCount < thumbs.length) setStartIndex(startIndex + 1);
    };
    const prevSlides = () => {
      if (startIndex > 0) setStartIndex(startIndex - 1);
    };
  
   
    useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/coupons");
        if (res.data.success) setCouponData(res.data.coupons);
      } catch (err) {
        console.error("❌ Error fetching coupons:", err);
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
    const totalcupon = product?.totalcupon || 0;
    const latestRound = getLatestRound(product?._id);
    const sold = couponData.filter(
      (c) => c.productId === product._id && c.round === latestRound
    ).length;
    const remaining = Math.max(totalcupon - sold, 0);
    return { sold, totalcupon, remaining };
  };


  const stats = getStats(product);

  const handleAddToCart = (product) => {
      const exists = cart.find((pd) => pd._id === product._id);
      let newCart = [];
  
      if (exists) {
        const rest = cart.filter((pd) => pd._id !== product._id);
        newCart = [...rest, { ...exists, quantity: exists.quantity + 1 }];
      } else {
        newCart = [...cart, { ...product, quantity: 1 }];
      }
  
      localStorage.setItem("productCart", JSON.stringify(newCart));
      setCart(newCart);
      Swal.fire("✅ Product added!");
    };

    const [reviews, setReviews] = useState([]);
   const [imagess, setImagess] = useState([]);
 console.log(imagess)
   // Fetch product details
   useEffect(() => {
     if (!id) return;
     const fetchProduct = async () => {
       try {
         const res = await axios.get(`http://localhost:5000/api/products/${id}`);
         setProduct(res.data);
         setReviews(res.data.reviews || []);
         setImages(res.data.images || []);
       } catch (err) {
         console.error("Failed to fetch product:", err);
       }
     };
     fetchProduct();
   }, [id]);
 
   // Toggle modal
 
   
 
   if (!product) return null;
 
   // Calculate average rating
   const totalReviews = reviews.length;
   const averageRating =
     totalReviews > 0
       ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
       : 0;
  

  return (
    <div className=" min-h-screen py-6 px-4 mt-20 md:mt-0">
      <ScrollToTop/>
      {/* ---------- OUTER GRID: (LEFT+MIDDLE) | RIGHT ---------- */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-8">

        
        {/* ================= LEFT + MIDDLE WRAPPER ================= */}
        <div className="space-y-8">
        <div className="md:hidden -mt-12">
       <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative max-w-md mx-auto mt-6 rounded-xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
    >
      {/* === Animated Gradient Border === */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_200%] opacity-80"
      />

      {/* === Inner Box === */}
      <div className="relative z-10 flex items-center justify-between bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 sm:px-6 sm:py-4 ">
        
        {/* Left Icon */}
        {/* <motion.div
          initial={{ rotate: -30, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
          className="text-pink-600"
        >
          <Ticket className="w-8 h-8 drop-shadow-[0_2px_6px_rgba(236,72,153,0.4)]" />
        </motion.div> */}

        {/* Animated Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-1 text-center"
        >
          <motion.h2
            animate={{
              scale: [1, 1.05, 1],
              textShadow: [
                "0px 0px 0px rgba(219,39,119,0)",
                "0px 0px 8px rgba(219,39,119,0.4)",
                "0px 0px 0px rgba(219,39,119,0)",
              ],
              color: ["#1f2937", "#db2777", "#1f2937"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut",
            }}
            className="text-[14px]  sm:text-base font-semibold text-gray-800 leading-tight "
          >
            এই <span className="text-pink-600 font-bold">পণ্যটি</span> আপনি{" "}
            <span className="text-indigo-600 font-bold">১০ টাকা কুপন দিয়ে</span>  জিতে নিতে পারেন  </motion.h2>

         
        </motion.div>
      </div>

      {/* === Shimmer Effect === */}
      {/* <motion.div
        className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      /> */}
    </motion.div>
        </div>
         
          {/* ---------- INNER GRID: LEFT | MIDDLE ---------- */}
          <div className="grid grid-cols-1 md:grid-cols-[3fr_4fr] gap-8">


            {/* ---------- LEFT: Image gallery ---------- */}
            <div className="">
             <div className="rounded-2xl p-4 flex items-center justify-center -mt-6 md:mt-0 overflow-hidden relative w-full max-w-md mx-auto">
                     <AnimatePresence mode="wait">
                       <motion.div
                         key={images[indexs]}
                         className="relative h-[300px] md:h-[300px] w-full flex items-center justify-center bg-white"
                         initial={{ opacity: 0, x: 50, scale: 0.98 }}
                         animate={{ opacity: 1, x: 0, scale: 1 }}
                         exit={{ opacity: 0, x: -50, scale: 0.98 }}
                         transition={{
                           x: { type: "tween", ease: [0.25, 0.1, 0.25, 1], duration: 0.6 },
                           opacity: { duration: 0.4, ease: "easeInOut" },
                           scale: { duration: 0.5, ease: "easeOut" },
                         }}
                         drag="x"
                         dragConstraints={{ left: 0, right: 0 }}
                         dragElastic={0.8}
                         onDragEnd={(e, { offset, velocity }) => {
                           const swipe = offset.x * velocity.x;
                           if (swipe < -1000) nextImage();
                           else if (swipe > 1000) prevImage();
                         }}
                       >
                         <img
                           src={images[indexs]}
                           alt={`Product ${indexs + 1}`}
                           className="h-full w-auto object-contain rounded-lg select-none"
                         />
             
                         {/* Bottom Overlay */}
                         <div className="absolute bottom-1 left-0 right-0 flex justify-between items-center px-4">
                           <div className="bg-green-600/90 text-white text-sm md:text-base font-semibold px-4 py-1.5 rounded-full shadow-md md:py-1">
                             Item {indexs + 1}/{images.length}
                           </div>
                           <button
                             className="bg-green-600 md:py-1 md:px-1 text-white rounded-full p-2 shadow-md hover:text-red-500 transition"
                             aria-label="Add to wishlist"
                           >
                             <svg
                               xmlns="http://www.w3.org/2000/svg"
                               fill="none"
                               viewBox="0 0 24 24"
                               strokeWidth={2}
                               stroke="currentColor"
                               className="w-7 h-7"
                             >
                               <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M21 8.25c0-2.485-2.014-4.5-4.5-4.5-1.74 0-3.223 1.004-3.938 2.465a4.501 4.501 0 00-3.938-2.465c-2.486 0-4.5 2.015-4.5 4.5 0 7.22 8.438 11.69 8.438 11.69S21 15.47 21 8.25z"
                               />
                             </svg>
                           </button>
                         </div>
                       </motion.div>
                     </AnimatePresence>
                   </div>
             
                   {/* Thumbnails */}
                   <div className="relative flex items-center justify-center w-full max-w-md mx-auto mt-2">
                     <button
                       onClick={prevSlides}
                       disabled={startIndex === 0}
                       className={`absolute left-0 z-10 bg-white border border-gray-200 rounded-full p-2 shadow transition ${
                         startIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50"
                       }`}
                     >
                       <ChevronLeft className="w-5 h-5 text-gray-700" />
                     </button>
             
                     <div className="grid grid-cols-6 md:grid-cols-6 gap-1 w-full px-8 -mt-2 md:mt-0">
                       {visibleThumbs.map((src, i) => (
                         <button
                           key={startIndex + i}
                           onClick={() => setIndexs(startIndex + i)}
                           className={`border rounded-xl p-1 transition-all ${
                             indexs === startIndex + i
                               ? "border-green-600 shadow-md"
                               : "border-gray-200 hover:border-emerald-600 hover:shadow"
                           }`}
                         >
                           <img
                             src={src}
                             alt={`thumb-${startIndex + i}`}
                             className="object-contain h-8 w-12 md:h-8 md:w-full rounded-lg"
                           />
                         </button>
                       ))}
                     </div>
             
                     <button
                       onClick={nextSlides}
                       disabled={startIndex >= thumbs.length - visibleCount}
                       className={`absolute right-0 z-10 bg-white border border-gray-200 rounded-full p-2 shadow transition ${
                         startIndex >= thumbs.length - visibleCount
                           ? "opacity-40 cursor-not-allowed"
                           : "hover:bg-gray-50"
                       }`}
                     >
                       <ChevronRight className="w-5 h-5 text-gray-700" />
                     </button>
                   </div>


          <h1 className="product-title">
  {product?.title} 
</h1>



              <div className="flex justify-between items-center text-sm px-2 text-gray-500 md:hidden -ms-2">
  {/* Left: Ratings */}
  <div className="flex items-center gap-1">
      {/* Stars */}
      <div className="flex items-center">
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <span className="ml-2 font-semibold text-gray-900 text-sm">4.3</span>
      </div>

      {/* Rating Text */}
      
      <span className="text-gray-500 text-sm">| {stats.sold}+ sold</span>
    </div>

  {/* Right: Stock Info */}
  {/* <div className="text-green-600 font-medium">
    4K+ bought · In stock
  </div> */}
</div>

              <div className="md:hidden block ">
                  <div className="flex items-center gap-2 ">
                               <p className="price-default--current--F8OlYIo text-red-600">
  <span className="price-container">
    <span className="main-price">
      <span className="currency">BDT</span>
      <span className="amount -ms-1">{product?.ProductPrice}</span>
    </span>
  </span>
</p>


                                <p className="main-symbol mt-2 text-gray-400 ">
                                 
                                 <span className="text-sm  text-red-600">
                                  {/* {product.oldPrice} */}
                                     {product?.discount}%off
                                 </span>
                               </p>

                               <p className="main-symbol line-through text-gray-400 mt-2 -ms-1">
                                 <span className="text-sm">BDT</span>
                                 <span className="text-sm">
                                  {product?.oldPrice}
                                     {/* 600.99 */}
                                 </span>
                               </p>

                                
                               
           
                              
                             </div>
                           <p className="import-note">
  Import Charges included; Extra 1% off with coins
</p>


                              <div className="flex items-center text-xs text-gray-600 mt-1">
                               {/* Progress Bar */}
                               <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                 <div
                                   className="h-2 rounded-full bg-[#19745B] transition-all duration-500"
                                   style={{ width: `${(stats.sold / stats.totalcupon) * 100}%` }}
                                 ></div>
                               </div>
                             </div>
                           <div className="rounded-lg w-full bg-gray-50 border border-gray-100 p-1">
  <div className="flex justify-between text-center">
    {/* Sold */}
    <div className="flex-1 flex flex-col items-center border-r border-gray-200 px-1">
      <span className="text-sm font-bold text-green-600">{stats?.sold}</span>
      <span className="text-xs text-gray-500">Sold</span>
    </div>

    {/* Total Coupon */}
    <div className="flex-1 flex flex-col items-center border-r border-gray-200 px-1">
      <span className="text-sm font-bold text-yellow-600">{stats?.totalcupon}</span>
      <span className="text-xs text-gray-500">Total Coupon</span>
    </div>

    {/* Remaining */}
    <div className="flex-1 flex flex-col items-center px-1">
      <span className="text-sm font-bold text-gray-800">{stats?.remaining}</span>
      <span className="text-xs text-gray-500">Remaining</span>
    </div>
  </div>
</div>



{/* ---------------- Mobile screen ---------------- */}
      <div className="sm:hidden flex gap-2">
        {/* Size toggle */}
       <div className="-mt-1">
         <span
          onClick={() => setShowSizes(!showSizes)}
          className="flex-1 px-3 py-2 text-[#19745B] text-left    rounded-lg text-md font-semibold  hover:border-emerald-600  transition flex justify-center items-center"
        >
          Size ▼
        </span>
       </div>

        {/* Color toggle */}
        <div className="">
          <span
          onClick={() => setShowColors(!showColors)}
          className="flex-1 px-3 py-2   rounded-lg text-sm font-semibold text-gray-700 hover:border-emerald-600 text-md  transition flex justify-center items-center"
        >
          
           Color ▼
        </span>
        </div>
      </div>


      {/* Mobile toggle content */}
      <div className="sm:hidden space-y-2 mt-2">
        {showSizes && (
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:border-emerald-600 transition"
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {showColors && (
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.id}
                className="w-12 h-12 border border-gray-300 rounded-lg hover:border-emerald-600 transition"
              >
                <img
                  src={color.img}
                  alt="color"
                  className="object-contain mx-auto"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Review part design  start */}

      <div className="bg-white text-gray-800 w-full max-w-md mx-auto p-3">
      {/* Review Gallery */}
      <div className="pb-3 border-b mb-2">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-sm">Review gallery</p>
          <button className="text-xs text-blue-600">See all (79)</button>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            "https://ae-pic-a1.aliexpress-media.com/kf/S4bddc2f52e0840d98531a68d17b401fbj.jpg_220x220q75.jpg_.avif",
            "https://ae-pic-a1.aliexpress-media.com/kf/S4bddc2f52e0840d98531a68d17b401fbj.jpg_220x220q75.jpg_.avif",
            "https://ae-pic-a1.aliexpress-media.com/kf/S4bddc2f52e0840d98531a68d17b401fbj.jpg_220x220q75.jpg_.avif",
            "https://ae-pic-a1.aliexpress-media.com/kf/S4bddc2f52e0840d98531a68d17b401fbj.jpg_220x220q75.jpg_.avif",
            "https://ae-pic-a1.aliexpress-media.com/kf/S4bddc2f52e0840d98531a68d17b401fbj.jpg_220x220q75.jpg_.avif",
          ].map((img, i) => (
            <div key={i} className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
              <img src={img} alt="review" className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Header */}
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-sm">Reviews</p>
        <button
          onClick={() => setOpenModal(true)}
          className="text-xs text-gray-500 hover:text-blue-600 transition"
        >
          ✓ All from verified <span className="text-blue-600">purchases</span>
        </button>
      </div>

      {/* Rating Summary */}
      <div className="flex items-center gap-1 mb-3">
        <span className="text-lg font-bold">4.6</span>
        <div className="flex text-yellow-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
        </div>
        <span className="text-xs text-gray-500 ml-1">(638 ratings)</span>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2 mb-3 text-xs">
        <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-700">
          positive (59)
        </span>
        <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-700">
          excellent perfect good protective displayed well (58)
        </span>
      </div>

      {/* Review Item 1 */}
      <div className="border-t pt-3 mt-2">
        <div className="flex items-center gap-1 mb-1">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} fill="currentColor" />
            ))}
          </div>
          <p className="text-xs text-gray-500">🇪🇸 j***e, 17 Oct 2025</p>
        </div>
        <p className="text-xs text-gray-500 mb-1">
          Band Color: Titanium Band Width: 42mm (Series 11 10) Ships From: CHINA
        </p>
        <p className="text-sm">Very good quality, just like in the photo.</p>
      </div>

      {/* Review Item 2 */}
      <div className="border-t pt-3 mt-2">
        <div className="flex items-center gap-1 mb-1">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} fill="currentColor" />
            ))}
          </div>
          <p className="text-xs text-gray-500">🇮🇹 R***i, 18 Oct 2025</p>
        </div>
        <p className="text-xs text-gray-500 mb-1">
          Band Color: Silvery Band Width: 44 45 46mm 49mm Ships From: CHINA
        </p>
        <p className="text-sm">Excellent</p>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-slide-up">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b p-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Reviews</h2>
            <button onClick={() => setOpenModal(false)}>
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="p-3">
            {/* Rating Summary */}
            <div className="flex items-center gap-1 mb-3">
              <span className="text-lg font-bold">4.6</span>
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">(638 ratings)</span>
            </div>

            {/* Tag Filters */}
            <div className="flex flex-wrap gap-2 mb-3 text-xs">
              <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                positive (59)
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                excellent perfect good protective displayed well (58)
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                disappointing (32)
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                very satisfied (21)
              </span>
            </div>

            {/* Reviews List */}
            {reviewspart.map((r, i) => (
              <div key={i} className="border-t pt-3 mt-2">
                <div className="flex items-center gap-1 mb-1">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {r.country} {r.name}, {r.date}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mb-1">{r.detail}</p>
                <p className="text-sm mb-2">{r.text}</p>
                {r.img && (
                  <img
                    src={r.img}
                    alt="review"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

      {/* Review part design  end */}


              </div>

                <div className="max-w-xl mx-auto p-4  rounded-xl ">
        <h3 className="text-xl font-bold">Description</h3>

        <p className={`text-sm text-gray-600 mt-3 md:block leading-relaxed transition-all duration-300 ${isExpanded ? "max-h-full" : "line-clamp-4"}`}>
        <span className="font-semibold ">Efficient protection:</span> {product?.description}
      </p>

     

      <button
        onClick={toggleExpand}
        className="mt-2 text-sm text-green-600 font-semibold hover:text-green-800 transition-colors"
      >
        {isExpanded ? "Read Less ▲" : "Read More ▼"}
      </button>

    </div>
 
    
            </div>

            {/* ---------- MIDDLE: Product details ---------- */}
            <div className="space-y-4">
              <h1 className="text-xl md:block hidden md:text-2xl font-semibold text-gray-900">
                {product?.title}
              </h1>

              {/* <p className="text-gray-600 md:block hidden ">
                Thin protective case with built-in screen protector, shock-resistant frame, Black.
              </p> */}
              
              {/* <div className="flex items-center gap-2  md:block">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gray-300 -mt-16 md:mt-0" />
                ))}
                <span className="text-sm text-gray-500 -mt-16 md:mt-0">(No Ratings)</span>
                
              </div> */}

              <div className="text-2xl md:text-3xl font-bold text-emerald-600 md:block hidden ">BDT {product?.ProductPrice}</div>
           <div className="hidden md:block">
               <div className="flex items-center gap-1">
      {/* Stars */}
      <div className="flex items-center">
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <span className="ml-2 font-semibold text-gray-900 text-sm">4.3</span>
      </div>

      {/* Rating Text */}
      
      <span className="text-gray-500 text-sm">| {stats.sold}+ sold</span>
    </div>
           </div>
              <p className="text-sm text-gray-500 hidden md:block">
                {product?.stock}+ bought · <span className="text-green-600 font-medium ">In stock</span>
              </p>

              {/* Size */}
            <div className="md:space-y-4">
      {/* ---------------- Large screen ---------------- */}
      <div className="hidden sm:block space-y-4">
        {/* Sizes */}
        <div>
          <h2 className="font-semibold">Size</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {sizes.map((size) => (
              <button
                key={size}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:border-emerald-600 transition"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <h2 className="font-semibold">Color : Black (2-Pack)</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {colors.map((color) => (
              <button
                key={color.id}
                className="w-12 h-12 border border-gray-300 rounded-lg hover:border-emerald-600 transition"
              >
                <img
                  src={color.img}
                  alt="color"
                  className="object-contain mx-auto"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      

      
    </div>

              <ul className="list-disc list-inside text-gray-700 hidden md:block space-y-1 text-sm">
                <li>9H tempered glass for premium scratch protection</li>
                <li>Shockproof PC frame with precise cutouts</li>
                <li>Thin, lightweight design for comfort</li>
              </ul>
            </div>
          </div>

          {/* ================= REVIEW SECTION spans both left + middle ================= */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 max-w-4xl mx-auto my-6">
              {/* Header: Average rating + total reviews */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(averageRating) ? "text-emerald-500" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.91c.969 0 1.371 1.24.588 1.81l-3.973 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.973 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L1.67 10.1c-.783-.57-.38-1.81.588-1.81h4.91a1 1 0 00.95-.69l1.518-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm">({totalReviews} reviews)</span>
                </div>
              
              </div>
        
              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="flex gap-4 p-4 rounded-xl shadow-sm border border-gray-100 bg-white"
                  >
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      <img
                        src={
                          r.avatar ||
                          "https://static.vecteezy.com/system/resources/previews/046/035/385/non_2x/business-man-silhouette-man-with-suit-standing-illustration-business-man-logo-vector.jpg"
                        }
                        alt="avatar"
                        className="w-12 h-12 rounded-full border border-gray-300 object-cover"
                      />
                    </div>
        
                    {/* Review Content */}
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-gray-800 text-sm">
                          {r.username}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {new Date(r.date).toLocaleDateString()}
                        </span>
                        {r.verified && (
                          <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
        
                      {/* Star Rating */}
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < r.rating ? "text-emerald-500" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.91c.969 0 1.371 1.24.588 1.81l-3.973 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.973 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L1.67 10.1c-.783-.57-.38-1.81.588-1.81h4.91a1 1 0 00.95-.69l1.518-4.674z" />
                          </svg>
                        ))}
                      </div>
        
                      {/* Comment */}
                      <p className="text-gray-700 text-sm">{r.text}</p>
        
                      {/* Photos */}
                      {r.photos && r.photos.length > 0 && (
                        <div className="flex gap-2 mt-2 overflow-x-auto">
                          {r.photos.map((p, idx) => (
                            <img
                              key={idx}
                              src={p}
                              alt="review photo"
                              className="w-16 h-16 rounded-md object-cover border"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
        
             
            </div>
        </div>

        {/* ================= RIGHT: Purchase & shipping ================= */}
       <div>
        <div className="mb-2 hidden md:block">
       <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative max-w-md mx-auto mt-6 rounded-xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
    >
      {/* === Animated Gradient Border === */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_200%] opacity-80"
      />

      {/* === Inner Box === */}
      <div className="relative z-10 flex items-center justify-between bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 sm:px-6 sm:py-4">
        
        {/* Left Icon */}
      

        {/* Animated Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-1 text-center"
        >
          <motion.h2
            animate={{
              scale: [1, 1.05, 1],
              textShadow: [
                "0px 0px 0px rgba(219,39,119,0)",
                "0px 0px 8px rgba(219,39,119,0.4)",
                "0px 0px 0px rgba(219,39,119,0)",
              ],
              color: ["#1f2937", "#db2777", "#1f2937"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut",
            }}
            className="text-[15px] sm:text-base font-semibold text-gray-800 leading-tight"
          >
            এই <span className="text-pink-600 font-bold">পর্ণটি</span> আপনি{" "}
            <span className="text-indigo-600 font-bold">১০ টাকা কুপন</span> দিয়ে জিতে নিতে পারেন 
          </motion.h2>

         
        </motion.div>
      </div>

      {/* === Shimmer Effect === */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
        </div>
         <div className="md:bg-white rounded-2xl  border border-gray-100  md:h-[865px] md:shadow-xl p-6 md:space-y-6">
          {/* Price card */}
          <div className="rounded-xl hidden md:block  border border-gray-200 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-inner">
            <div className="grid grid-cols-2 text-center text-sm font-medium">
              <div>
                <p className="text-2xl font-bold text-emerald-700">৳ {product?.ProductPrice}</p>
                <p className="text-gray-500">Product Price</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-500">৳ {product?.couponPrice}</p>
                <p className="text-gray-500">Coupon Price</p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-center text-sm hidden md:block">
            Order now and get it around{" "}
            <span className="font-semibold text-gray-800">Thursday, September 11</span>
          </p>

          {/* Quantity */}
          <div className="flex items-center justify-center md:justify-start hidden md:block">
            <span className="text-sm font-semibold text-gray-700">Quantity:</span>
            <div className="flex ms-2 items-center p-2 border border-gray-300 rounded-lg w-32 overflow-hidden shadow-sm">
              <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)} className="px-3 py-1 hover:bg-gray-100 transition">
                <Minus size={16} />
              </button>
              <span className="flex-1 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-1 hover:bg-gray-100 transition">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Coupon progress */}
          <div className="rounded-xl border hidden md:block border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 shadow-inner">
            <div className="grid grid-cols-2 sm:grid-cols-3 text-center text-sm font-medium gap-y-2">
              <div><p className="text-lg font-semibold text-green-600">{stats.sold}</p><p className="text-gray-500">SOLD</p></div>
              <div><p className="text-lg font-semibold text-orange-500">{stats.remaining}</p><p className="text-gray-500">REMAINING</p></div>
              <div><p className="text-lg font-semibold text-blue-600">{stats.totalcupon}</p><p className="text-gray-500">Total</p></div>
              <div><p className="text-lg font-semibold text-purple-600">{progress.toFixed(1)}%</p><p className="text-gray-500">PROGRESS</p></div>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500" style={{ width: `${(stats.sold / stats.totalcupon) * 100}%` }} />
            </div>
            <p className="mt-2 text-center text-xs text-gray-600">
              {stats.sold} of {stats.totalcupon} coupons sold
            </p>
          </div>

          {/* Action Buttons */}
       {/* Action Buttons */}
  <div
  className="
    fixed -bottom-1 left-1/2 -translate-x-1/2 z-50 w-[95%] 
    sm:static sm:translate-x-0 sm:w-auto sm:mt-6
  "
>
  {/* --- Mobile View --- */}
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 sm:hidden z-50">
      <div className="flex items-stretch justify-between px-2 py-2 gap-2">
        {/* --- Left Icons --- */}
        <div className="flex items-center gap-3">
          {/* Chat Icon */}
        

          {/* Cart Icon with Badge */}
          <button  onClick={() => {
                         
                          handleAddToCart(product);
                        }}
                         className="relative flex flex-col items-center justify-center text-gray-700 hover:text-emerald-700 transition">
            <span className="text-3xl">🛒</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full px-1.5">
              +
            </span>
          </button>
        </div>

        {/* --- Action Buttons --- */}
        <div className="flex flex-1 gap-2">
          {/* Buy Coupon (Styled like Add to Cart) */}
          <button
           onClick={() => {
                         
                          setSelectedProduct(product);
                          setCouponOpen(true);
                        }}
                         className="flex-1 flex flex-col items-center justify-center gap-1  py-1  font-medium  transition min-h-[40px] relative bg-white border border-emerald-800 rounded-full shadow-sm hover:bg-green-500 hover:text-white  duration-300  text-gray-800">
            {/* Price Badge */}
            <span className="absolute -top-2 right-3 bg-emerald-800 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
              ৳10
            </span>
            <span className="text-sm font-semibold">Buy Coupon</span>
          </button>

          {/* Buy Now */}
          <button className="flex-1 bg-emerald-800 text-white rounded-full py-1 text-sm font-semibold hover:bg-red-700 transition min-h-[40px]">
            Buy Now
          </button>
        </div>
      </div>
    </div>





  {/* --- Large Device Layout --- */}
  <div className="hidden sm:grid grid-cols-2 gap-3 bg-white border-t border-gray-200 p-3">
    <button  onClick={() => {
                         
                          setSelectedProduct(product);
                          setCouponOpen(true);
                        }}
                         className="bg-emerald-800 text-white py-2 rounded-xl font-medium hover:bg-emerald-700 transition">
      Buy Coupon
    </button>

    <button 
     onClick={() => {
                          // e.preventDefault();
                          // e.stopPropagation();
                          handleAddToCart(product);
                        }}
                         className="flex items-center justify-center gap-2  bg-gradient-to-r from-[#8CD005] to-[#19745B] text-white py-2 rounded-xl font-medium hover:opacity-90 transition">
      <ShoppingCart size={18} /> Add to Cart
    </button>

    <button className="col-span-2 bg-emerald-800 text-white py-2 rounded-xl font-medium hover:bg-emerald-700 transition">
      Buy Now
    </button>
  </div>
</div>






          {/* Extra Info */}
          <div className="text-sm text-gray-600 space-y-2 hidden md:block">
            <p className="flex items-center gap-1">
              <span role="img" aria-label="lock">🔒</span> Secured transaction
            </p>
            <div className="flex items-center gap-4 mt-2">
              <img src="https://sellularr.netlify.app/images/fedex.svg" alt="FedEx" className="h-5" />
              <img src="https://sellularr.netlify.app/images/dhl.svg" alt="DHL" className="h-5" />
            </div>
            <p className="font-semibold mt-3">Features & Benefits</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Compatible with Apple Watch Ultra 49 mm</li>
              <li>9H tempered glass for scratch protection</li>
              <li>Button cover included for full protection</li>
              <li>Precise design allows access to all features</li>
            </ul>
          </div>
        </div>

          <div className=" -mt-32 md:mt-2 md:mb-0  text-xl font-bold">
            <h1>Related Products For You</h1>
            <div className="relative flex items-center">
           
                
        
                <div className="overflow-hidden w-full">
                  <div
                    className={`grid -mt-3   mb-10 items-start transition-transform duration-700 ease-in-out ${
                      itemsPerView === 2 ? "grid-cols-2" : "grid-cols-2"
                    }`}
                  >
                    {shuffledProducts.slice(0, counts).map((product) => (
                      <Link
                        to="/productdetails"
                        key={product.id}
                        className="group ms-1 me-1 mt-5  rounded-md overflow-hidden  hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col"
                      >
                        {/* Product Image */}
                        {/* Product Image */}
                          <div className="relative w-full h-44 bg-white overflow-hidden">
  {/* Product Image */}
  <img
    src={product.img}
    alt={product.title}
    className="w-full h-full object-cover"
  />

  {/* Discount Price - Top Right */}
  <div className="absolute top-2 right-2 bg-[#19745B] text-white font-semibold px-2 py-1 rounded-full shadow">
    -90%
  </div>
</div>
        
                        {/* Product Info */}
                        <div className="p-2 flex-grow">
                          <div className="flex gap-1 mb-1 text-xs font-semibold">
                            <span className="bg-yellow-300 text-black px-1 rounded">
                              Choice
                            </span>
                            <span className="bg-red-500 text-white px-1 rounded">
                              Sale
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {product.title}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-red-600 font-bold">
                              <span className="price-container">
                                <span className="main-price">
                                  <span className="symbol">৳</span>
                                  <span className="quicktectaka">
                                    {product.ProductPrice}
                                  </span>
                                </span>
                              </span>
                            </p>
        
                            <p className="main-symbol line-through text-gray-400 text-xs">
                              <span className="symbols">৳</span>
                              <span className="quicktectakas">{product.oldPrice}</span>
                            </p>
        
                            <p className="text-red-500 text-xs">{product.discount}</p>
                          </div>
                          <div className="flex items-center text-xs text-gray-600 mt-1">
                            {/* <FaStar className="text-yellow-400 mr-1" />
                            {product.rating}
                            <span className="ml-1">| {product.sold}</span> */}
                             {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div
                      className="h-1 rounded-full bg-[#19745B] transition-all duration-500"
                      style={{
                        width: `${(product.solds / product.totalcupon) * 100}%`,
                      }}
                    ></div>
                  </div>
                          </div>
        
                          <div className="   mt-2 w-full">
  <div className="flex justify-between items-center text-center gap-1">
    
    {/* Sold */}
    <div className="flex flex-col items-center flex-1">
      <span className="text-sm font-bold text-green-600 ">
        200
      </span>
      <span className="text-[11px] text-gray-500 ">
        Sold
      </span>
    </div>

    {/* Divider */}
    <div className="w-px h-8 bg-gray-200"></div>

    {/* Coupon */}
    <div className="flex flex-col items-center flex-1">
      <span className="text-sm font-bold text-yellow-600 whitespace-nowrap">
        500
      </span>
      <span className="text-[11px] text-gray-500 whitespace-nowrap">
        Coupon
      </span>
    </div>

    {/* Divider */}
    <div className="w-px h-8 bg-gray-200"></div>

    {/* Remaining */}
    <div className="flex flex-col items-center flex-1">
      <span className="text-sm font-bold text-gray-800 whitespace-nowrap">
        300
      </span>
      <span className="text-[11px] text-gray-500 whitespace-nowrap">
        Remaining
      </span>
    </div>
  </div>
</div>
</div>
                      </Link>
                    ))}
                    
                  </div>
                    
                  
                </div>
        
               
              </div>


              {/* Toggle Button */}
      {counts < shuffledProducts.length ? (
        <div className="flex justify-center -mt-6  mb-20">
          <button
            onClick={toggleSeeProducts}
            className="bg-gradient-to-r from-[#8CD005] to-[#19745B] text-white font-semibold px-6 py-2 rounded shadow hover:opacity-90 transition"
          >
            {expandedvalue ? "Hide Products" : "See More"}
          </button>
        </div>
      ) : (
        <div className="flex justify-center mb-10">
          <button
            onClick={showMore}
            className="bg-gradient-to-r from-[#8CD005] to-[#19745B] text-white font-semibold px-6 py-2 rounded shadow hover:opacity-90 transition"
          >
            Show More
          </button>
        </div>
      )}
          </div>



         
       </div>
          
        
      </div>

       <CouponModal
              open={couponOpen}
              product={selectedProduct}
              onClose={() => setCouponOpen(false)}
              onSuccess={(purchase) => console.log("✅ Coupon saved:", purchase)}
            />
    </div>
  );
}

