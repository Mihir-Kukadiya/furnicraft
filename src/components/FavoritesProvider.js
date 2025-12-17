import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const FavoritesContext = createContext();
const API = "http://localhost:3000/api/favorites";

const FavoritesProvider = ({ children }) => {
  const email = sessionStorage.getItem("email");
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!email) return;
    axios.get(`${API}/${email}`).then((res) => setFavorites(res.data));
  }, [email]);

  const toggleFavorite = async (product) => {
    const formatted = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.img || product.image,
    };

    if (email) {
      const res = await axios.post(`${API}/toggle`, {
        email,
        product: formatted,
      });
      setFavorites(res.data.favorites);
      setMessage(
        res.data.message === "added"
          ? "Product added to favorites!"
          : "Product removed!"
      );
    } else {
      setFavorites((prev) =>
        prev.find((i) => i.name === product.name)
          ? prev.filter((i) => i.name !== product.name)
          : [...prev, product]
      );
    }

    setTimeout(() => setMessage(""), 2000);
  };

  const isFavorite = (p) => favorites.some((i) => i.name === p.name);

  const removeFavorite = async (product) => {
    if (email) {
      const res = await axios.delete(`${API}/remove`, {
        data: { email, productId: product._id },
      });
      setFavorites(res.data);
    } else {
      setFavorites((prev) => prev.filter((i) => i.name !== product.name));
    }

    setMessage("Product removed from favorites!");
    setTimeout(() => setMessage(""), 2000);
  };

  const clearFavorites = async () => {
    await axios.delete(`${API}/clear/${email}`);
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
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
