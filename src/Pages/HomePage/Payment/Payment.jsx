import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import { CartContext } from "../../Shared/Context/CartContext";
import useAuth from "../../Hooks/useAuth";
import ReactPixel from "react-facebook-pixel";
import { pushToDataLayer } from "../../../utils/gtm";
export default function Payment() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cart, setCart] = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [shippingOption, setShippingOption] = useState("");
   const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  // const [appliedCode, setAppliedCode] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState([]); // applied promos array
const [discountAmount, setDiscountAmount] = useState(0);

  const [error, setError] = useState("");
const [users, setUsers] = useState(null); // local state to track wallet
  const { user, setUser } = useAuth();
  // const { notifications, setNotifications } = useNotifications();
    const [shippingData, setShippingData] = useState({ option: "", cost: 0 });

  const useremail=user?.email
  const userphone=user?.phoneNumber
  console.log(useremail,userphone,users,shippingData,setDiscountPercent)


  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("selectedCart")) || [];
    setSelectedItems(saved);
    const data = localStorage.getItem("shippingData");
    if (data) setShippingData(JSON.parse(data));
  }, []);
 
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("selectedCart")) || [];
    
    // 🔹 Ensure each item has `img` field from database
    const updatedSaved = saved.map(item => ({
      ...item,
      img: item.img || item.images?.[0] || item.productimg || ""
    }));

    setSelectedItems(updatedSaved);
  }, []);


  useEffect(() => {
    document.title = "Payment";

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
  

  // 🔹 Calculate subtotal
const itemsTotal = selectedItems.reduce(
  (acc, item) => acc + item.ProductPrice * item.quantity,
  0
);

// Subtotal after discount
const subtotalAfterDiscount = selectedItems.reduce(
  (acc, item) => acc + (item.ProductPrice * item.quantity - (item.itemDiscount || 0)),
  0
);





const shipping =
  shippingOption === "dhaka"
    ? 60
    : shippingOption === "outside"
    ? 120
    : 0;

const grandtotal = subtotalAfterDiscount + shipping;

const totalQuantity = selectedItems.reduce(
  (acc, item) => acc + item.quantity,
  0
);


  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!shippingOption) {
    Swal.fire({
      icon: "warning",
      title: "⚠️ Shipping option required",
      text: "Please select a shipping option.",
    });
    return;
  }
    // if (!user?._id) return alert("Login first!");
    if (!selectedItems.length) return alert("Cart is empty!");

    const orderData = {
      customer: {
        name: e.target.name.value,
        phone: e.target.phone.value,
        address: e.target.address.value,
      },
      products: selectedItems,
      totals: {
        quantity: totalQuantity,
        subtotal: itemsTotal,
        shipping: shipping,
        grandtotal,
      },
      userAuth: user?.email || user?.phoneNumber,
    };

     // ✅ Pixel Tracking on submit
  try {
    ReactPixel.track("InitiateCheckout", {
      value: grandtotal,
      currency: "BDT",
      num_items: totalQuantity,
    });
  } catch (err) {
    console.error("Pixel tracking error:", err);
  }

  // Helper function - Pixel style Google Tag
// Helper function - Pixel style Google Tag (safe)
// Safe GTM / Pixel push
const pushGtmPurchase = (orderResp) => {
  if (!orderResp) return;

  const items = Array.isArray(orderResp.products) ? orderResp.products : [];

  const amount = Number(orderResp.totals?.grandtotal) || 0;
  const shipping = Number(orderResp.totals?.shipping) || 0;
  const transactionId = orderResp._id || "unknown";

  pushToDataLayer({
    event: "purchase",
    ecommerce: {
      transaction_id: transactionId,
      value: amount,
      tax: 0,
      shipping: shipping,
      coupon: orderResp.coupon_code || "",
      currency: "BDT", // ✅ Must be valid ISO code
      items: items.map((item) => ({
        item_id: item._id || "unknown",
        item_name: item.title || "unknown",
        item_variant: item.selectedColor || "",
        price: Number(item.ProductPrice || 0),
        quantity: Number(item.quantity || 0),
        currency: "BDT",
      })),
    },
  });

  console.log("✅ GTM purchase event fired safely", transactionId, "amount:", amount);
};


    // ✅ Bkash Payment
    // ✅ Bkash Payment
// Remove the polling part completely, just open the Bkash popup and wait for redirect
if (paymentMethod === "bkash") {
  try {
    setLoading(true);

    const res = await axios.post("http://localhost:5000/api/orders/bkash/create", {
      ...orderData,
      amount: grandtotal,
      userPhone: e.target.phone.value,
    });

    const { bkashURL } = res.data;

    // ✅ Save current cart items BEFORE opening Bkash popup
    localStorage.setItem("selectedCart", JSON.stringify(cart));

    // Open Bkash popup
    window.location.href = bkashURL;

    // ⚡ Do NOT remove cart here, remove it in PaymentSuccess page after backend confirms success

  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Bkash payment failed. Try again.", "error");
  } finally {
    setLoading(false);
  }
  return;
}


// wallet 

// ✅ WALLET PAYMENT
// WALLET PAYMENT
// wallet payment part
 if (paymentMethod === "wallet") {
      try {
        setLoading(true);

        if (!user) {
          Swal.fire(
            "Login Required",
            "Please login first to use wallet.",
            "warning"
          );
          setLoading(false);
          return;
        }

        const auth = user?.phoneNumber || user?.email;

        // get wallet balance
        const walletRes = await axios.post(
          "http://localhost:5000/api/auth/users/get-wallet",
          { auth }
        );

        const walletBalance = walletRes.data.walletBalance;

        if (walletBalance < grandtotal) {
          Swal.fire({
            icon: "error",
            title: "Insufficient Wallet Balance",
            text: `Your balance is only ৳${walletBalance}`,
          });
          setLoading(false);
          return;
        }

        const payRes = await axios.post(
          "http://localhost:5000/api/orders/wallet-pay",
          {
            ...orderData,
            amount: grandtotal,
            auth,
          }
        );

        if (payRes.data.success) {
          Swal.fire("Success", "Order placed using Wallet!", "success");
          setSuccess(true);

          // 🔥 Instant wallet update in both local and auth state
          setUsers((prev) => ({
            ...prev,
            walletBalance: payRes.data.updatedWalletBalance,
          }));

          setUser((prev) => ({
            ...prev,
            walletBalance: payRes.data.updatedWalletBalance,
          }));

          // Remove purchased items from cart
          const updatedCart = cart.filter(
            (cartItem) =>
              !selectedItems.some((s) => s._id === cartItem._id)
          );
          setCart(updatedCart);
          localStorage.setItem("productCart", JSON.stringify(updatedCart));
          localStorage.removeItem("selectedCart");
          setSelectedItems([]);
        } else {
          Swal.fire("Error", payRes.data.message, "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Wallet payment failed.", "error");
      } finally {
        setLoading(false);
      }
      return;
    }









    // ✅ Cash on Delivery
   // ✅ Cash on Delivery
// ✅ Cash on Delivery
try {
  setLoading(true);

  const res = await axios.post("http://localhost:5000/api/orders/cod", orderData);
  setSuccess(true);

  // Clear cart
  const updatedCart = cart.filter(
    (cartItem) => !selectedItems.some((selected) => selected._id === cartItem._id)
  );
  setCart(updatedCart);
  localStorage.setItem("productCart", JSON.stringify(updatedCart));
  localStorage.removeItem("selectedCart");
  setSelectedItems([]);

  const orderResp = res.data.order;

  // ✅ Push to GTM (Pixel-style)
  pushGtmPurchase(orderResp);

  // ✅ Meta Pixel Purchase
  try {
    const items = Array.isArray(orderResp.products) ? orderResp.products : [];
    const totalAmount = Number(orderResp.totals?.grandtotal) || 0;

    ReactPixel.track("Purchase", {
      value: totalAmount,
      currency: "BDT", // Must be valid ISO code
      content_ids: items.map((i) => i._id),
      content_type: "product",
      contents: items.map((i) => ({
        id: i._id,
        quantity: i.quantity,
        item_price: Number(i.ProductPrice || i.purchasePrice || 0),
        title: i.title || "Unknown Product",
      })),
      num_items: items.reduce((sum, i) => sum + Number(i.quantity || 0), 0),
    });

    console.log("✅ Meta Pixel purchase event fired safely", orderResp._id, "amount:", totalAmount);
  } catch (pixelErr) {
    console.error("Pixel tracking error:", pixelErr);
  }

} catch (err) {
  console.error(err);
  Swal.fire("Error", "Order submission failed.", "error");
} finally {
  setLoading(false);
}
  };

  useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("selectedCart")) || [];

  const updatedSaved = saved.map(item => ({
    ...item,
    img: item.img || item.images?.[0] || item.productimg
  }));

  setSelectedItems(updatedSaved);
}, []);


 // -------------------- Remove Promo --------------------
// -------------------- Apply Promo Code --------------------
// -------------------- Apply Promo Code --------------------
// -------------------- Apply Promo Code --------------------
const handleApplyPromo = () => {
  setError("");
  if (!promoCode) {
    setError("Please enter a promo code");
    return;
  }

  const code = promoCode.trim(); // single code per apply
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let found = false;

  const updatedSelectedItems = selectedItems.map(item => {
    let itemDiscount = item.itemDiscount || 0; // keep existing discount

    // Category/Product promo
    if (item.promoCode === code && !appliedPromo.includes(code)) {
      const start = new Date(item.promoStartDate || 0);
      const end = new Date(item.promoEndDate || 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      if (today >= start && today <= end) {
        found = true;
        itemDiscount += item.promoType === "percent"
          ? (item.ProductPrice * item.quantity * item.promoValue) / 100
          : item.promoValue;
      }
    }

    // All-product promo
    if (item.allProductPromoCode === code && !appliedPromo.includes(code)) {
      const start = new Date(item.allProductPromoStartDate || 0);
      const end = new Date(item.allProductPromoEndDate || 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      if (today >= start && today <= end) {
        found = true;
        itemDiscount += item.allProductPromoType === "percent"
          ? (item.ProductPrice * item.quantity * item.allProductPromoValue) / 100
          : item.allProductPromoValue;
      }
    }

    return { ...item, itemDiscount };
  });

  if (!found) {
    setError("Invalid or expired promo code or already used");
    return;
  }

  setSelectedItems(updatedSelectedItems);
  setAppliedPromo(prev => [...prev, code]); // store applied promo

  // ✅ recalc total discount
  const totalDiscount = updatedSelectedItems.reduce(
    (acc, item) => acc + (item.itemDiscount || 0),
    0
  );
  setDiscountAmount(totalDiscount);
  setPromoCode(""); // clear input after applying
};





// -------------------- Subtotal after discounts --------------------





  // -------------------- Remove Promo --------------------
 const handleRemovePromo = (code) => {
  const today = new Date();
  let newDiscount = 0;

  const updatedItems = selectedItems.map(item => {
    let itemDiscount = 0;

    if (item.promoCode !== code && item.allProductPromoCode !== code) {
      if (item.promoCode && new Date(item.promoStartDate) <= today && new Date(item.promoEndDate) >= today) {
        if (item.promoType === "percent") itemDiscount += (item.ProductPrice * item.quantity * item.promoValue) / 100;
        else itemDiscount += item.promoValue;
      }

      if (item.allProductPromoCode && new Date(item.allProductPromoStartDate) <= today && new Date(item.allProductPromoEndDate) >= today) {
        if (item.allProductPromoType === "percent") itemDiscount += (item.ProductPrice * item.quantity * item.allProductPromoValue) / 100;
        else itemDiscount += item.allProductPromoValue;
      }
    }

    newDiscount += itemDiscount;
    return { ...item, itemDiscount };
  });

  setSelectedItems(updatedItems);
  setAppliedPromo(prev => prev.filter(c => c !== code));
  setDiscountAmount(newDiscount);
  setPromoCode("");
};



  return (
    <div className="mx-auto max-w-6xl p-6 bg-gray-50 min-h-screen mt-24 md:mt-0">
      <ScrollToTop />
      {success ? (
        <div className="text-center p-10 bg-white rounded-2xl shadow-[0_2px_18px_rgba(0,0,0,0.15)]">
          <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Your order has been received.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="md:col-span-2 bg-white p-6 mt-5 md:mt-0 rounded-2xl border border-gray-200 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 ">Contact Information</h2>
            <input type="text" name="name" placeholder="Full Name" required className="w-full border border-gray-300 rounded-xl px-5 py-2 mb-4" />
            <div className="flex mb-4">
              {/* <input type="text" value="+880" readOnly className="w-24 border rounded-l-xl px-5 py-2 bg-gray-100" /> */}
              <input type="tel" name="phone" placeholder="Phone number" required className="flex-1 w-full border border-gray-300 rounded-xl px-5 py-2 mb-1" />
            </div>
            
            <textarea name="address" placeholder="Street Address, City, State, Postal Code" required className="w-full border rounded-2xl px-5 py-4 resize-none h-24" />

             <div className="mt-3">
      <span className="block text-gray-700 font-medium text-sm mb-2"> Shipping Area</span>
      <div className="flex gap-3">
        <label
          className={`flex-1 p-3 rounded-xl cursor-pointer border text-xs transition-all flex flex-col items-center justify-center ${
            shippingOption === "dhaka"
              ? "border-green-500 bg-green-50 shadow-md"
              : "border-gray-200 hover:shadow-sm"
          }`}
        >
          <input
            type="radio"
            name="shipping"
            value="dhaka"
            checked={shippingOption === "dhaka"}
            onChange={(e) => setShippingOption(e.target.value)}
            className="hidden"
          />
          <span className="text-gray-800 font-medium text-sm">Inside Dhaka</span>
          <span className="text-green-700 font-bold text-sm mt-1">৳60</span>
        </label>

        <label
          className={`flex-1 p-3 rounded-xl cursor-pointer border text-xs transition-all flex flex-col items-center justify-center ${
            shippingOption === "outside"
              ? "border-green-500 bg-green-50 shadow-md"
              : "border-gray-200 hover:shadow-sm"
          }`}
        >
          <input
            type="radio"
            name="shipping"
            value="outside"
            checked={shippingOption === "outside"}
            onChange={(e) => setShippingOption(e.target.value)}
            className="hidden"
          />
          <span className="text-gray-800 font-medium text-sm">Outside Dhaka</span>
          <span className="text-green-700 font-bold text-sm mt-1">৳120</span>
        </label>
      </div>
      
    </div>

            <h2 className="mt-4 font-semibold text-gray-800 mb-2">Payment Method</h2>
            <div className="flex md:items-center md:flex-row flex-col gap-6">
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" value="bkash" checked={paymentMethod === "bkash"} onChange={(e) => setPaymentMethod(e.target.value)} />
                Bkash
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} />
                Cash on Delivery
              </label>

              <label className="flex items-center gap-2">
  <input
    type="radio"
    name="payment"
    value="wallet"
    checked={paymentMethod === "wallet"}
    onChange={(e) => setPaymentMethod(e.target.value)}
  />
  Wallet Balance
</label>

            </div>
            <div className="flex gap-4 mt-6">
              <button type="submit" disabled={loading || selectedItems.length === 0} className={`${loading || selectedItems.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} text-white px-8 py-3 rounded-full font-semibold transition`}>
                {loading ? "Processing..." : "Confirm Order"}
              </button>
            </div>
          </div>


    
          {/* RIGHT */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mb-52">
               {/* promo code  */}
   <div className="flex items-center gap-2">
  <input
    type="text"
    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
    placeholder="Enter promo code"
    value={promoCode}
    onChange={(e) => setPromoCode(e.target.value)}
  />

  <button
    type="button"   // ✅ VERY IMPORTANT
    onClick={handleApplyPromo}
    className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
  >
    Apply
  </button>
</div>

{appliedPromo.length > 0 && (
  <div className="mt-2 space-y-1">
    {appliedPromo.map(code => (
      <div key={code} className="flex justify-between items-center bg-green-50 p-2 rounded">
        <span className="text-green-700 text-sm">Applied: {code}</span>
        <button
          onClick={() => handleRemovePromo(code)}
          className="text-red-600 text-sm"
        >
          Remove
        </button>
      </div>
    ))}
  </div>
)}

{error && <p className="text-red-500 text-sm mt-2">{error}</p>}



          {/* end promo code  */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 mt-2">Order Summary</h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between"><span>Total Quantity:</span> <span>{totalQuantity}</span></div>
              <div className="flex justify-between"><span>Subtotal:</span> <span>{itemsTotal.toFixed(2)} Taka</span></div>
              {/* Discount Row */}
        {discountPercent > 0 && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Discount ({discountPercent}%):</span>
            <span>- {discountAmount.toFixed(2)} Taka</span>
          </div>
        )}
        <div className="flex justify-between text-red-600 font-semibold">
  <span>Discount:</span>
  <span>- {discountAmount.toFixed(2)} Taka</span>
</div>

<div className="flex justify-between text-green-600">
  <span>Subtotal After Discount:</span>
  <span>{subtotalAfterDiscount.toFixed(2)} Taka</span>
</div>

             
              <hr className="border-gray-200 my-2" />
               <div className="flex justify-between items-center pt-2">
      <span className="text-gray-600 font-medium text-sm">Shipping cost</span>
      <span className="bg-gradient-to-r from-green-200 to-green-400 text-green-900 font-bold px-3 py-1.5 rounded-full text-sm flex items-center gap-1 shadow-inner">
        <span className="text-xs">৳</span>
        {shipping.toLocaleString()}
      </span>
    </div>
              <div className="flex justify-between items-center font-bold text-lg mt-2">
                <span>Total</span>
                <span className="bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-full text-sm flex items-center gap-1">
                  <span className="text-xs">৳</span>{grandtotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Products */}
            <div className="mt-6 space-y-4 ">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border p-2 rounded-lg">
                  <img src={item.img} className="w-16 h-16 object-cover rounded" alt={item.title} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × {item.ProductPrice} Taka</p>
                  </div>
                  <span className="font-semibold">{item.ProductPrice * item.quantity} Taka</span>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

