import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();
const API = "http://localhost:3000/api/cart";   // << Your backend route

const CartProvider = ({ children }) => {

  const parsePriceToNumber = (p) => {
    if (typeof p === "number") return p;
    if (typeof p === "string") {
      const n = parseInt(p.replace(/[^\d.]/g, ""), 10);
      return isNaN(n) ? 0 : n;
    }
    return 0;
  };

  const email = sessionStorage.getItem("email");

  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");

  // 🔥 Load cart from MongoDB when user exists
  useEffect(() => {
    if (!email) return;                  // no user → no cart fetch
    axios.get(`${API}/${email}`)
      .then((res) => setCartItems(res.data))
      .catch(() => setCartItems([]));
  }, [email]);

  // ===================== CLEAR CART =======================
  const clearCart = async () => {
    if (!email) return setCartItems([]);   // guest cart fallback
    await axios.delete(`${API}/clear/${email}`);
    setCartItems([]);
  };

  // ===================== ADD TO CART =======================
  const addToCart = async (product) => {

    const idToCheck = product._id || product.name;
    const exists = cartItems.some(item => (item._id || item.name) === idToCheck);

    if (exists) {
      setMessage("Product is already in the cart!");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    const normalized = {
      ...product,
      productId: product._id,               // 🆕 required for DB
      price: parsePriceToNumber(product.price),
      image: product.image || product.img || product.imgUrl || "",
      quantity: 1,
    };

    // 🔥 Save to MongoDB
    if (email) {
      await axios.post(`${API}/add`, { email, product: normalized })
        .then(res => setCartItems(res.data.cart));
    } else {
      setCartItems(prev => [...prev, normalized]);  // guest fallback
    }

    setMessage("Product added to cart!");
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
