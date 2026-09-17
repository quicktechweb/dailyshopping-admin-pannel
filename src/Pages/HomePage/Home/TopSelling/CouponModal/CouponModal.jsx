import { useState } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import useAuth from "../../../../Hooks/useAuth";
import axios from "axios";

const CouponModal = ({ open, onClose, product }) => {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuth();
  const username = user?.displayName || "Guest";
  const useremail = user?.email || "";
  const userPhone = user?.phoneNumber || "";

  if (!open || !product) return null;

  // ⭐ Wallet payment handler
 const handleWalletPay = async () => {
  if (!user) {
    Swal.fire("Login Required", "Please login to use wallet.", "warning");
    return;
  }

  try {
    setLoading(true);
    const quantity = product.quantity || 1;
    const unitPrice = product.couponPrice || product.ProductPrice;

    const payload = {
      auth: userPhone || useremail,
      productId: product._id,
      productName: product.title,
      productImage: product.images?.[0] || "",
      price: unitPrice * quantity,
      quantity,
      username,
      useremail,
      userPhone,
      couponlimit: product.totalcupon || 0
    };

    const res = await axios.post(
      "http://localhost:5000/api/coupons/walletcoupon", // <-- use POST
      payload // <-- send as body
    );

    if (!res.data.success) {
      Swal.fire("Error", res.data.message, "error");
      return;
    }

    Swal.fire("Success", "Coupon purchased via wallet!", "success");

    // Update wallet in local auth state
    setUser((prev) => ({ ...prev, walletBalance: res.data.newBalance }));

    onClose();
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Wallet payment failed.", "error");
  } finally {
    setLoading(false);
  }
};



  // ⭐ bKash payment handler
  const handleBkashPay = async () => {
    try {
      setLoading(true);
      const quantity = product.quantity || 1;
      const unitPrice = product.couponPrice || product.ProductPrice;

      const payload = {
        productId: product._id,
        productName: product.title,
        productImage: product.images?.[0] || "",
        price: unitPrice * quantity,
        quantity,
        username,
        useremail,
        userPhone,
        userRegPhone: userPhone,
        couponlimit: product.totalcupon || 0,
        isSandbox: true
      };

      const res = await axios.post(
        "http://localhost:5000/api/coupons/purchase",
        payload
      );

      const { bkashURL } = res.data;
      if (!bkashURL) throw new Error("Failed to get bKash URL");

      window.location.href = bkashURL;
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to initiate payment", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Confirm Coupon Purchase</h3>
        <div className="flex gap-3 items-center mb-4">
          <img 
            src={product.images?.[0] || product.categoryImg || product.img || ""} 
            alt={product.title} 
            className="w-20 h-20 object-contain rounded border" 
          />
          <div>
            <p className="font-medium text-gray-800">{product.title}</p>
            <p className="text-sm text-gray-600">
              ৳ {(product.couponPrice || product.ProductPrice) * (product.quantity || 1)} 
              {product.quantity > 1 && ` (${product.quantity} pcs)`}
            </p>
            <p className="text-xs text-gray-500">Total Coupons: {product.totalcupon || 0}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleWalletPay} 
            disabled={loading} 
            className="flex-1 bg-[#19745B] text-white rounded py-2 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay with Wallet"}
          </button>
          <button 
            onClick={handleBkashPay} 
            disabled={loading} 
            className="flex-1 bg-[#19745B] text-white rounded py-2 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay with bKash"}
          </button>
          <button 
            onClick={onClose} 
            className="flex-1 border rounded py-2 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

CouponModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
};

export default CouponModal;
