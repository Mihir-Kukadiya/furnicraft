import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Products from "./components/Products";
import Cart from "./components/Cart";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CartProvider from "./components/CartProvider";
import { FavoritesProvider } from './components/FavoritesProvider';
import Favorites from "./components/Favorites";
import ExpensiveProducts from "./components/ExpensiveProducts";
import { Box } from "@mui/material";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
  return (
    <CartProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Navbar />

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Home />
                  <Products />
                  <ExpensiveProducts />
                  <AboutUs />
                  <ContactUs />
                  <Footer />
                </>
              }
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </CartProvider>
  );
};

export default App;
