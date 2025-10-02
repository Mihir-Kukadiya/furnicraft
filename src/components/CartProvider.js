import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

// small helper to parse price into a number (rupees)
const parsePriceToNumber = (p) => {
  if (typeof p === "number") return p;
  if (typeof p === "string") {
    // keep only digits (removes ₹ and commas etc.)
    const n = parseInt(p.replace(/[^\d.]/g, ""), 10);
    return isNaN(n) ? 0 : n;
  }
  return 0;
};

const CartProvider = ({ children }) => {
  const email = sessionStorage.getItem("email");
  const storageKey = email ? `cartItems_${email}` : "cartItems_guest";

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(storageKey);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const clearCart = () => {
    setCartItems([]);
    // remove the correct per-user key
    localStorage.removeItem(storageKey);
  };

  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, storageKey]);

  const addToCart = (product) => {
    // prefer unique id if available, fallback to name
    const idToCheck = product._id || product.name;
    const exists = cartItems.some((item) => (item._id || item.name) === idToCheck);
    if (exists) {
      setMessage("Product is already in the cart!");
    } else {
      // normalize product before storing
      const normalized = {
        ...product,
        // normalized numeric price
        price: parsePriceToNumber(product.price),
        // unify image property (Payment UI checks image)
        image: product.image || product.img || product.imgUrl || "",
        quantity: 1,
      };
      setCartItems((prev) => [...prev, normalized]);
      setMessage("Product added to cart!");
    }

    setTimeout(() => setMessage(""), 2000);
  };

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
