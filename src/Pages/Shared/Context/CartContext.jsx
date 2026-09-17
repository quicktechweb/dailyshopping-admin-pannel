import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

const CartContextProvider = ({ children }) => {
  // ✅ Initial state localStorage থেকে
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("productCart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
      console.error("Error reading cart from localStorage:", err);
      return [];
    }
  });

  // ✅ State update হলে LocalStorage update
  useEffect(() => {
    try {
      localStorage.setItem("productCart", JSON.stringify(cart));
    } catch (err) {
      console.error("Error saving cart to localStorage:", err);
    }
  }, [cart]);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

CartContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartContextProvider;
