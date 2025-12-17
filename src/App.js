import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Products from "./components/Products";
import Cart from "./components/Cart";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CartProvider from "./components/CartProvider";
import FavoritesProvider from "./components/FavoritesProvider";
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
            <Route path="/address" element={<Address />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/completed-orders" element={<CompleteOrders />} />
            <Route path="/my-orders" element={<MyOrders />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </CartProvider>
  );
};

export default App;
