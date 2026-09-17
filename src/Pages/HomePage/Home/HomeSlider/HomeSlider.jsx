import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const brandImg = "https://i.ibb.co/chK619v/service-Hero-Section-Home.png";

const headlines =[
  "We upgrade your shopping experience.",
  "We protect your payments & privacy.",
  "Reliable eCommerce for modern business.",
];


const images = [
  "https://i.ibb.co/fxD4Kw3/hero-Section-Home.gif",
  "https://i.ibb.co/fxD4Kw3/hero-Section-Home.gif",
  "https://i.ibb.co/fxD4Kw3/hero-Section-Home.gif",
];

const products = [
  { id: 1, title: "24 Medium Square...", ProductPrice: 133,
    img: "https://luckyshop.com.bd/storage/media/1755612936_0720751_vivo-topping-whipping-cream-11-ltr.webp" },
  { id: 2, title: "Airs Pro Wireless...", ProductPrice: 99,
    img: "https://luckyshop.com.bd/storage/media/1755612794_0251747_kazi-farms-chicken-strips-250gm.jpeg" },
  { id: 3, title: "60D80D100D Thic...", ProductPrice: 226,
    img: "https://luckyshop.com.bd/storage/media/1755612590_0720823_kelloggs-froot-loops-285gm.webp" },
  { id: 4, title: "Continuous Fire Pistol...", ProductPrice: 99,
    img: "https://luckyshop.com.bd/storage/media/1755612458_0732214_mr-noodles-magic-masala-28-pcs-box.webp" },
  { id: 6, title: "Wireless Earbuds Pro", ProductPrice: 399,
    img: "https://luckyshop.com.bd/storage/media/1755612590_0720823_kelloggs-froot-loops-285gm.webp" },
];

export default function HeroSlider() {
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setHeadlineIndex((i) => (i + 1) % headlines.length),
      3500
    );
    return () => clearInterval(t);
  }, []);

  const sliderSettings = {
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    pauseOnHover: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-4 md:px-16 py-1 md:min-h-[350px]">
      {/* LEFT SIDE */}
      <div className="md:w-1/2 w-full flex flex-col justify-center space-y-6 md:space-y-8">
        <div className="flex items-center gap-3">
          <img
            src={brandImg}
            alt="brand"
            className="w-14 h-14 object-contain drop-shadow-md"
          />
          <p className="text-sm tracking-wide text-gray-600 uppercase">
           Next-Gen Shopping Experience, Anytime, Anywhere
          </p>
        </div>

        <div className="relative h-24">
          <AnimatePresence mode="wait">
            <motion.h1
              key={headlineIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl -mt-6 font-extrabold text-gray-900 leading-snug"
            >
              {headlines[headlineIndex]}
            </motion.h1>
          </AnimatePresence>
        </div>

        <div className="overflow-hidden">
          <div className="flex w-max animate-marquee gap-2">
            {[...products, ...products].map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 border border-orange-300 bg-white shadow-md rounded-xl px-4 py-3 min-w-[210px] hover:shadow-lg transition"
              >
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  draggable="false"
                />
                <div className="flex flex-col justify-center">
                  <span className="font-medium text-gray-800 line-clamp-1">
                    {p.title}
                  </span>
                  <span className="text-orange-600 font-semibold text-sm">
                    ${p.ProductPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE – wider & taller */}
      <div className="md:w-1/2 w-full mt-10 md:mt-0 max-w-xl relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-80 h-80 md:w-[650px] md:h-[420px] rounded-full 
                          bg-gradient-to-tr from-orange-200 via-pink-200 to-purple-200 
                          blur-3xl opacity-60" />
        </div>

        <Slider {...sliderSettings}>
          {images.map((src, i) => (
            <div key={i}>
              <img
                src={src}
                alt={`slide-${i}`}
                className="relative w-full h-[350px] object-contain rounded-2xl"
                draggable="false"
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
