const TopRatedProduct = () => {
  // ✅ ৬টা প্রোডাক্ট data
  const products = [
    { name: "Kitchen Waffle Irons", image: "https://sellularr.netlify.app/images/ap1.webp" },
    { name: "Electric Blender", image: "https://sellularr.netlify.app/images/ap1.webp" },
    { name: "Rice Electric Blender", image: "https://sellularr.netlify.app/images/ap1.webp" },
    { name: "Ceiling Fan", image: "https://sellularr.netlify.app/images/ap1.webp" },
    { name: "Headphones", image: "https://sellularr.netlify.app/images/ap1.webp" },
    { name: "Table Lamp", image: "https://sellularr.netlify.app/images/ap1.webp" },
    { name: "Kitchen Waffle Irons", image: "https://sellularr.netlify.app/images/ap1.webp" },
    { name: "Electric Blender", image: "https://sellularr.netlify.app/images/ap1.webp" },
  ];

  return (
    <div className="w-full  mx-auto px-20  bg-gray-50">
      {/* 🔹 Header Part */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Row 1 */}
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">
            Small Kitchen Appliances
          </h2>
          <button className="bg-black text-white text-xs md:text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition">
            View All
          </button>
        </div>
        {/* Row 2 */}
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">
            Top-Rated Household Supplies
          </h2>
          <button className="bg-black text-white text-xs md:text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition">
            View All
          </button>
        </div>
      </div>

      {/* 🔹 Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow hover:shadow-md transition flex hover:-translate-y-1 hover:scale-[1.02] duration-200"
          >
            {/* Left Side Image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-1/2 h-28 object-cover rounded-l-lg"
            />

            {/* Right Side Text */}
            <div className="flex items-center justify-center w-1/2 p-2">
              <p className="text-md text-left font-medium text-center text-gray-700">
                {product.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRatedProduct;
