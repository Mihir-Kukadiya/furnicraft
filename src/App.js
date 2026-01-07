import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Favorites from "./components/Favorites";
import ExpensiveProducts from "./components/ExpensiveProducts";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Address from "./components/Address";
import Payment from "./components/Payment";
import Orders from "./components/Orders";
import CompleteOrders from "./components/completeOrders";
import MyOrders from "./components/MyOrders";

import BubbleCursor from "./components/BubbleCursos";

import CartProvider from "./components/CartProvider";
import FavoritesProvider from "./components/FavoritesProvider";
import { FiltersProvider } from "./components/FiltersContext";
import ThemeContextProvider from "./theme/ThemeContext";

const App = () => {
  return (
    <ThemeContextProvider>
      <CartProvider>
        <FavoritesProvider>
          <FiltersProvider>
            <BrowserRouter>
              <BubbleCursor />
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
                <Route path="/address" element={<Address />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/completed-orders" element={<CompleteOrders />} />
                <Route path="/my-orders" element={<MyOrders />} />
              </Routes>
            </BrowserRouter>
          </FiltersProvider>
        </FavoritesProvider>
      </CartProvider>
    </ThemeContextProvider>
  );
};

export default App;
