import { useEffect, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const productData = [
  {
    id: 1,
    image: "https://sellularr.netlify.app/images/pp1.webp",
    title: "Buy Imported Products From Japan",
  },
  {
    id: 2,
    image: "https://sellularr.netlify.app/images/pp1.webp",
    title: "Buy Imported Products From Japan",
  },
  {
    id: 3,
    image: "https://sellularr.netlify.app/images/pp1.webp",
    title: "Buy Imported Products From Japan",
  },
  {
    id: 4,
    image: "https://sellularr.netlify.app/images/pp1.webp",
    title: "Buy Imported Products From Japan",
  },
  {
    id: 5,
    image: "https://sellularr.netlify.app/images/pp1.webp",
    title: "Buy Imported Products From Japan",
  },
];

const PremiumProduct = () => {
  const scrollRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const visibleCards = 2;

  useEffect(() => {
    const interval = setInterval(() => {
      scrollToIndex((scrollIndex + 1) % productData.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [scrollIndex]);

  const scrollToIndex = (index) => {
    const container = scrollRef.current;
    if (container) {
      const cardWidth = container.offsetWidth / visibleCards;
      container.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
      });
      setScrollIndex(index);
    }
  };

  const scrollLeft = () => {
    const newIndex = scrollIndex === 0 ? productData.length - 1 : scrollIndex - 1;
    scrollToIndex(newIndex);
  };

  const scrollRight = () => {
    const newIndex = (scrollIndex + 1) % productData.length;
    scrollToIndex(newIndex);
  };

  return (
    <div className="w-full bg-gray-50 py-10 mt-10">
      <h2 className="text-left text-lg md:text-2xl font-bold mb-6 ms-6 md:ms-24">
        PREMIUM PRODUCTS FROM WORLDWIDE STORES IN{" "}
        <span className="text-indigo-600">Bangladesh</span>
      </h2>
      <div className="relative max-w-6xl mx-auto">
        {/* Left arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-[0_2px_18px_rgba(0,0,0,0.15)] hover:bg-gray-100"
        >
          <MdChevronLeft className="text-2xl" />
        </button>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth no-scrollbar gap-4 px-8"
        >
          {productData.map((product) => (
            <div
              key={product.id}
              className="min-w-[220px] bg-white rounded-2xl overflow-hidden shadow-[0_2px_18px_rgba(0,0,0,0.15)] hover:shadow-xl transition duration-300 mb-10 mt-8"
            >
              {/* Full-width top image */}
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              {/* Text Section */}
              <div className="text-center px-4 py-4 font-medium text-gray-800 text-sm md:text-base">
                Buy Imported Products From{" "}
                <span className="font-bold text-black">Japan</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <MdChevronRight className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default PremiumProduct;
