import { useContext, useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import {  Link, useNavigate } from "react-router-dom";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import { CartContext } from "../../Shared/Context/CartContext";
import ReactPixel from "react-facebook-pixel";
import Swal from "sweetalert2";

export default function OrderReview() {
  const [cart, setCart] = useContext(CartContext);
  const [selectedItems, setSelectedItems] = useState([]);
   // "" | "dhaka" | "outside"
 const navigate = useNavigate();
  // Default select all
  useEffect(() => {
    setSelectedItems(cart.map((item) => item));
  }, [cart]);


  useEffect(() => {
    document.title = "Order Review";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Buy amazing products at LuckyShop"
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Buy amazing products at LuckyShop";
      document.head.appendChild(meta);
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute("content", "");
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:image");
      meta.content = "";
      document.head.appendChild(meta);
    }
  }, []);
  // Save selected items
  useEffect(() => {
    if (selectedItems.length > 0) {
      localStorage.setItem("selectedCart", JSON.stringify(selectedItems));
    } else {
      localStorage.removeItem("selectedCart");
    }
  }, [selectedItems]);

  const isSelected = (item) => selectedItems.some((s) => s._id === item._id);

  const handleSelect = (item) => {
    if (isSelected(item)) {
      setSelectedItems((prev) => prev.filter((s) => s._id !== item._id));
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  const handleCheckout = () => {
   

    if (selectedItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ No items selected",
        text: "Please select at least one item to proceed.",
        confirmButtonColor: "#19745B",
      });
      return;
    }
 // ✅ Pixel set here
  try {
    ReactPixel.track("InitiateCheckout", {
      value: grandtotal,
      currency: "BDT",
      num_items: totalQuantity,
    });
  } catch (err) {
    console.error("Pixel tracking error:", err);
  }
    // ✅ Navigate to payment page WITHOUT refreshing
     
    navigate("/payment");
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cart.length) setSelectedItems([]);
    else setSelectedItems(cart);
  };

  const handleRemoveToCart = (item) => {
    const updatedCart = cart.filter((p) => p._id !== item._id);
    setCart(updatedCart);
    localStorage.setItem("productCart", JSON.stringify(updatedCart));

    const updatedSelected = selectedItems.filter((s) => s._id !== item._id);
    setSelectedItems(updatedSelected);
  };

  const handleUpdateQuantity = (cartItem, action) => {
    const updatedCart = cart.map((item) => {
      if (item._id === cartItem._id) {
        const newQty =
          action === "increase"
            ? item.quantity + 1
            : Math.max(1, item.quantity - 1);
        return { ...item, quantity: newQty };
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem("productCart", JSON.stringify(updatedCart));

    const updatedSelected = updatedCart.filter((i) => isSelected(i));
    setSelectedItems(updatedSelected);
  };

  // --- Calculation ---
  const itemsTotal = selectedItems.reduce(
    (acc, item) => acc + item.ProductPrice * item.quantity,
    0
  );

  

  const grandtotal = itemsTotal 
  const totalQuantity = selectedItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // Save shipping whenever it changes
const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/&/g, "-and-")
      .replace(/[\s\W-]+/g, "-");

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-20 md:mt-0">
      <ScrollToTop />
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2 bg-white p-6 mt-8 md:mt-0 rounded-2xl shadow-md border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            🛒 Cart ({totalQuantity})
          </h1>

          <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedItems.length === cart.length}
                onChange={handleSelectAll}
                className="w-5 h-5 accent-red-600"
              />
              <span className="text-sm text-gray-700 cursor-pointer hover:underline">
                Select all items
              </span>
              <button
                onClick={() => setSelectedItems([])}
                className="text-sm text-red-500 hover:underline"
              >
                Delete selected
              </button>
            </div>
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              Your cart is empty 😔
            </p>
          ) : (
            cart.map((cartItem) => (
              <div
                key={cartItem._id}
                className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition p-4 mb-4"
              >
                <div className="flex items-start sm:items-center mb-3 sm:mb-0">
                  <input
                    type="checkbox"
                    checked={isSelected(cartItem)}
                    onChange={() => handleSelect(cartItem)}
                    className="w-5 h-5 mt-1 sm:mt-2 accent-red-600 mr-3"
                  />
                    <Link to={`/productdetails/${cartItem._id}/${slugify(cartItem.title)}`}>
        <img
          src={cartItem?.images?.[0] || cartItem?.productimg}
          alt={cartItem?.title}
          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border"
        />
      </Link>
                </div>

                <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div>
                    <Link
  to={`/productdetails/${cartItem._id}/${slugify(cartItem.title)}`}
  className="text-sm text-gray-800 font-semibold mb-1 block 
             cursor-pointer 
             hover:text-red-600 
             hover:underline 
             transition duration-200"
>
  {cartItem?.title}
</Link>
                    <div className="flex items-center mt-2 space-x-3">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(cartItem, "decrease")
                        }
                        className="p-1.5 border rounded-lg hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-medium">{cartItem?.quantity}</span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(cartItem, "increase")
                        }
                        className="p-1.5 border rounded-lg hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex sm:flex-col justify-between sm:items-end mt-3 sm:mt-0">
                    <div className="flex flex-col items-start sm:items-end">
                      <span className="text-red-600 font-bold text-lg flex items-center gap-1">
                        <span className="text-sm">৳</span>
                        {cartItem?.ProductPrice.toLocaleString()}
                      </span>
                      {cartItem?.oldPrice && (
                        <span className="line-through text-gray-400 text-sm">
                          ৳{cartItem?.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveToCart(cartItem)}
                      className="bg-green-800 text-white px-3 py-1.5 rounded mt-2 sm:mt-2 hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Summary */}
    <div className="bg-white p-5 mb-16 md:mb-0 rounded-3xl shadow-lg border border-gray-100 h-fit sticky top-6">
  <h2 className="text-2xl font-bold text-gray-800 mb-5">🧾 Order Summary</h2>

  <div className="space-y-4">
    {/* Items Total */}
    <div className="flex justify-between items-center">
      <span className="text-gray-600 font-medium text-sm">Items total</span>
      <span className="bg-gradient-to-r from-green-200 to-green-400 text-green-900 font-bold px-3 py-1.5 rounded-full text-sm flex items-center gap-1 shadow-inner">
        <span className="text-xs">৳</span>
        {itemsTotal.toLocaleString()}
      </span>
    </div>

    {/* Shipping Selector */}
   

    {/* Shipping Cost */}
   

    {/* Estimated Total */}
    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
      <span className="text-gray-800 font-bold text-lg">Total</span>
      <span className="bg-gradient-to-r from-red-200 to-red-400 text-red-700 font-bold px-4 py-2 rounded-full text-sm flex items-center gap-1 shadow-lg">
        <span className="text-xs">৳</span>
        {grandtotal.toLocaleString()}
      </span>
    </div>
  </div>

   <button
      onClick={handleCheckout}
      className="w-full mt-5 py-3 rounded-2xl text-sm font-semibold shadow-md transition
                 bg-gradient-to-r from-[#19745B] to-[#8CD005] hover:from-red-600 hover:to-red-400 text-white"
    >
      Checkout ({totalQuantity})
    </button>

</div>


      </div>
    </div>
  );
}
