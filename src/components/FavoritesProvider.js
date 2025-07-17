import React, { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");

  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.name === product.name);
      if (exists) {
        setMessage("Product removed from favorites!");
        return prev.filter((item) => item.name !== product.name);
      } else {
        setMessage("Product added to favorites!");
        return [...prev, product];
      }
    });

    setTimeout(() => setMessage(""), 2000);
  };

  const isFavorite = (product) =>
    favorites.some((item) => item.name === product.name);

  const removeFavorite = (product) => {
    setFavorites((prev) => prev.filter((item) => item.name !== product.name));
    setMessage("Product removed from favorites!");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, removeFavorite, message }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
