import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import ScrollToTop from "../HomePage/ScrollToTop/ScrollToTop";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([
    {
      name: "Sarah Williams",
      rating: 5,
      review:
        "Absolutely love LuckyShop! The products are top-notch and delivery was super fast. The customer service team is very responsive!",
      date: "August 2025",
      image: "https://i.ibb.co/S7yrChz/profile1.jpg",
    },
    {
      name: "Michael Brown",
      rating: 4,
      review:
        "Great shopping experience overall. The design is sleek and modern. Got my order on time and in perfect condition.",
      date: "September 2025",
      image: "https://i.ibb.co/FV3yRxL/profile2.jpg",
    },
    {
      name: "Emily Johnson",
      rating: 5,
      review:
        "I’m in love with the premium packaging and the quality of the product. Definitely shopping again soon!",
      date: "October 2025",
      image: "https://i.ibb.co/3CwTTdP/profile3.jpg",
    },
    {
      name: "Daniel Smith",
      rating: 4,
      review:
        "Products are worth the price. Quality, packaging, and delivery were all impressive.",
      date: "October 2025",
      image: "https://i.ibb.co/JcKxY3Y/profile4.jpg",
    },
    {
      name: "Sophia Miller",
      rating: 5,
      review:
        "LuckyShop has become my go-to for gifts. Premium feel and quick service!",
      date: "November 2025",
      image: "https://i.ibb.co/dGTpjXb/profile5.jpg",
    },
    {
      name: "James Wilson",
      rating: 5,
      review:
        "Everything from order to delivery was smooth. Customer care is outstanding!",
      date: "November 2025",
      image: "https://i.ibb.co/qn2hPhX/profile6.jpg",
    },
  ]);

  const [form, setForm] = useState({ name: "", rating: 5, review: "" });
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);

  // Auto slider logic (responsive to screen width)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      if (containerRef.current) {
        const screenWidth = window.innerWidth;
        const scrollAmount =
          screenWidth < 768
            ? containerRef.current.offsetWidth // mobile: 1 card
            : containerRef.current.offsetWidth / 2; // desktop: 2 cards

        containerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });

        if (
          containerRef.current.scrollLeft + containerRef.current.offsetWidth >=
          containerRef.current.scrollWidth
        ) {
          containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.review) return;
    setReviews([
      ...reviews,
      {
        ...form,
        date: "Just now",
        image: "https://i.ibb.co/S7yrChz/profile1.jpg",
      },
    ]);
    setForm({ name: "", rating: 5, review: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b md:mb-10 mb-24 from-white via-gray-50 to-white text-gray-900 overflow-hidden">
      {/* Header */}
      <ScrollToTop/>
      <div className="text-center py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-emerald-600 text-transparent bg-clip-text">
          Customer Reviews
        </h1>
        <p className="text-gray-600 mt-2 md:mt-3 text-base md:text-lg">
          Hear what our valued customers say about their LuckyShop experience.
        </p>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 px-4 md:px-6">
        {/* Left: Review Form */}
        <div className="lg:w-1/3 bg-white rounded-2xl shadow-lg p-6 md:p-8 border hover:shadow-2xl transition-all">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-5 text-center">
            Leave Your Review
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <select
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: Number(e.target.value) })
                }
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{`${r} Stars`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Review
              </label>
              <textarea
                value={form.review}
                onChange={(e) =>
                  setForm({ ...form, review: e.target.value })
                }
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="4"
                placeholder="Share your experience..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition text-sm md:text-base"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Right: Review Cards Slider */}
        <div className="lg:w-2/3">
          <div
            ref={containerRef}
            className="flex overflow-x-auto gap-6 scroll-smooth no-scrollbar"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="min-w-[90%] sm:min-w-[70%] md:min-w-[48%] md:mt-32 bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between border hover:shadow-xl transition-all"
              >
                <div className="flex justify-center mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-yellow-400 fill-yellow-400"
                      size={20}
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-5 text-sm md:text-base">
                  “{review.review}”
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover shadow"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                      {review.name}
                    </h3>
                    <span className="text-xs md:text-sm text-gray-500">
                      {review.date}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
