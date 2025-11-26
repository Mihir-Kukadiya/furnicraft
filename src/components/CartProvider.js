import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  // ============================ convert price to number =============================

  const parsePriceToNumber = (p) => {
    if (typeof p === "number") return p;
    if (typeof p === "string") {
      const n = parseInt(p.replace(/[^\d.]/g, ""), 10);
      return isNaN(n) ? 0 : n;
    }
    return 0;
  };

  // ============================ manage cart items =============================

  const email = sessionStorage.getItem("email");
  const storageKey = email ? `cartItems_${email}` : "cartItems_guest";

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(storageKey);
    return savedCart ? JSON.parse(savedCart) : [];
  });

 useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ============================== clear cart =============================

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(storageKey);
  };

  // ============================= products add to cart ============================

  const [message, setMessage] = useState("");

  const addToCart = (product) => {
    const idToCheck = product._id || product.name;
    const exists = cartItems.some(
      (item) => (item._id || item.name) === idToCheck
    );
    if (exists) {
      setMessage("Product is already in the cart!");
    } else {
      const normalized = {
        ...product,
        price: parsePriceToNumber(product.price),
        image: product.image || product.img || product.imgUrl || "",
        quantity: 1,
      };
      setCartItems((prev) => [...prev, normalized]);
      setMessage("Product added to cart!");
    }

    setTimeout(() => setMessage(""), 2000);
  };

  // ================================================================

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, addToCart, clearCart, message }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartProvider;
