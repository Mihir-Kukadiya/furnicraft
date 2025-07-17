import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");

  const addToCart = (product) => {
    const exists = cartItems.some((item) => item.name === product.name);
    if (exists) {
      setMessage("Product is already in the cart!");
    } else {
      setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
      setMessage("Product added to cart!");
    }

    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, addToCart, message }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartProvider;
