import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();
const API = "http://localhost:3000/api/cart";

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

  useEffect(() => {
    if (!email) return;
    axios.get(`${API}/${email}`)
      .then((res) => setCartItems(res.data))
      .catch(() => setCartItems([]));
  }, [email]);


  // ===================== clear cart =======================

  const clearCart = async () => {
    if (!email) return setCartItems([]);
    await axios.delete(`${API}/clear/${email}`);
    setCartItems([]);
  };

  // ===================== add to cart =======================

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
      productId: product._id,
      price: parsePriceToNumber(product.price),
      image: product.image || product.img || product.imgUrl || "",
      quantity: 1,
    };

    if (email) {
      await axios.post(`${API}/add`, { email, product: normalized })
        .then(res => setCartItems(res.data.cart));
    } else {
      setCartItems(prev => [...prev, normalized]);
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
