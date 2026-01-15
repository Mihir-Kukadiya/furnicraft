import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const CartContext = createContext();

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

  // ===================== Fetch Cart =====================

  useEffect(() => {
    if (!email) return;
    axiosInstance
      .get(`/cart/${email}`)
      .then((res) => setCartItems(res.data))
      .catch(() => setCartItems([]));
  }, [email]);

  // ===================== Clear Cart =====================

  const clearCart = async () => {
    if (!email) {
      setCartItems([]);
      return;
    }
    await axiosInstance.delete(`/cart/clear/${email}`);
    setCartItems([]);
  };

  // ===================== Add To Cart =====================

  const addToCart = async (product) => {
    const idToCheck = product._id || product.name;
    const exists = cartItems.some(
      (item) => (item.productId || item.name) === idToCheck
    );

    if (exists) {
      setMessage("Product is already in the cart!");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    const normalized = {
      productId: product._id,
      name: product.name,
      price: parsePriceToNumber(product.price),
      image: product.image || product.img || product.imgUrl || "",
      quantity: 1,
    };

    if (email) {
      const res = await axiosInstance.post(`/cart/add`, {
        email,
        product: normalized,
      });
      setCartItems(res.data.cart);
    } else {
      setCartItems((prev) => [...prev, normalized]);
    }

    setMessage("Product added to cart!");
    setTimeout(() => setMessage(""), 2000);
  };

  // ===================== Remove From Cart (FIXED) =====================

  const removeFromCart = async (productId) => {
    if (!email) {
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
      return;
    }

    const res = await axiosInstance.delete(`/cart/remove`, {
      data: { email, productId },
    });

    setCartItems(res.data);
  };

  // ===================== Update Quantity (SYNCED) =====================

  const updateQuantity = async (productId, quantity) => {
    if (!email) return;

    const res = await axiosInstance.put(`/cart/quantity`, {
      email,
      productId,
      quantity,
    });

    setCartItems(res.data);
  };

  // =====================================================

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        message,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartProvider;
