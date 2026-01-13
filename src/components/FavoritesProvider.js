import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const FavoritesContext = createContext();

const FavoritesProvider = ({ children }) => {
  const email = sessionStorage.getItem("email");
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");

  // ======================= Fetch favorites =======================
  useEffect(() => {
    if (!email) return;

    axiosInstance
      .get(`/favorites/${email}`)
      .then((res) => setFavorites(res.data))
      .catch((err) =>
        console.error("Fetch favorites error:", err.response?.data || err.message)
      );
  }, [email]);

  // ======================= Add Favorite =======================
  const addFavorite = async (product) => {
    const formatted = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.img || product.image,
    };

    if (!email) {
      setMessage("Please login to add favorites");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    try {
      const res = await axiosInstance.post(`/favorites/add`, {
        email,
        product: formatted,
      });

      setFavorites(res.data.favorites);
      setMessage("Product added to favorites!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Add favorite error:", err.response?.data || err.message);
      setMessage("Failed to add favorite");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  // ======================= Check Favorite =======================
  const isFavorite = (p) => favorites.some((i) => i.productId === p._id);

  // ======================= Remove Favorite =======================
  const removeFavorite = async (product) => {
    if (!email) return;

    try {
      const res = await axiosInstance.delete(`/favorites/remove`, {
        data: { email, productId: product.productId },
      });
      setFavorites(res.data);
      setMessage("Product removed from favorites!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Remove favorite error:", err.response?.data || err.message);
      setMessage("Failed to remove favorite");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  // ======================= Clear Favorites =======================
  const clearFavorites = async () => {
    if (!email) return;

    try {
      await axiosInstance.delete(`/favorites/clear/${email}`);
      setFavorites([]);
    } catch (err) {
      console.error("Clear favorites error:", err.response?.data || err.message);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        isFavorite,
        removeFavorite,
        clearFavorites,
        message,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
export default FavoritesProvider;
