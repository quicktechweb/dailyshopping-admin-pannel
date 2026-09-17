import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../../../Shared/Context/CartContext";

const PaymentSuccess = () => {
  const [cart, setCart] = useContext(CartContext); // global cart
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedSelected = JSON.parse(localStorage.getItem("selectedCart")) || [];
      if (savedSelected.length === 0) return; // nothing to remove

      console.log("savedSelected:", savedSelected);
      console.log("cart before filter:", cart);

      setCart(prevCart => {
        const updatedCart = prevCart.filter(cartItem =>
          !savedSelected.some(sel =>
            cartItem._id === sel._id || cartItem.id === sel.id || cartItem.productId === sel.productId
          )
        );
        console.log("updatedCart after filter:", updatedCart);
        return updatedCart;
      });

      localStorage.removeItem("selectedCart");
      console.log("Cart cleared successfully");
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  }, [setCart]);

  const params = new URLSearchParams(location.search);
  const paymentID = params.get("paymentID");
  const orderID = params.get("orderID");

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2 style={{ color: "#16a34a" }}>✅ Payment Successful!</h2>
      <p>Transaction ID: {paymentID}</p>
      <p>Order ID: {orderID}</p>
      <button
        style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#16a34a", color: "#fff", borderRadius: "8px" }}
        onClick={() => navigate("/")}
      >
        🏠 Go to Home
      </button>
    </div>
  );
};

export default PaymentSuccess;
