const CuponPart = () => {
  return (
    <div className="relative w-full   px-6 md:px-20 ">
        <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-5">Gift Cupon</h1>
      {/* 🔹 Background Image */}
      <div className="relative">
        <img
          src="https://sellularr.netlify.app/images/bann.webp"
          alt="Special Offer Banner"
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
        />

        {/* 🔹 Overlay */}
        <div className="absolute inset-0 bg-black/50 rounded-lg"></div>

        {/* 🔹 Text on Image */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
            Special Gift Coupons 🎁
          </h1>
          <p className="mt-3 text-sm md:text-lg text-gray-200 max-w-xl">
            Grab exciting discounts on top-rated products. Limited time offer!
          </p>
          <button className="mt-5 bg-gradient-to-r from-[#8CD005] to-[#19745B] text-black font-semibold px-6 py-2 rounded-md shadow hover:bg-yellow-500 transition">
            Claim Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CuponPart;
