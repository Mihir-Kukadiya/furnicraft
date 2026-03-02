import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Navbar from "./global/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import ExpensiveProducts from "./pages/ExpensiveProducts";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Footer from "./global/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Address from "./pages/Address";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import CompleteOrders from "./pages/completeOrders";
import MyOrders from "./pages/MyOrders";

// import BubbleCursor from "./components/BubbleCursos";

import CartProvider from "./components/CartProvider";
import FavoritesProvider from "./components/FavoritesProvider";
import { FiltersProvider } from "./components/FiltersContext";
import ThemeContextProvider from "./theme/ThemeContext";

const stripePromise = loadStripe(
  "pk_test_51SPyUyGxAER71LsTe8HHiMH0QyF957Kj4twIcCYcODflhUNrzNowcPSQFhCnZDhQRNKOo67SdY0DZYRBWGwqWlWE00ChuCzFHf",
);

const App = () => {
  return (
    <ThemeContextProvider>
      <CartProvider>
        <FavoritesProvider>
          <FiltersProvider>
            <BrowserRouter>
              {/* <BubbleCursor /> */}
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
                <Route
                  path="/payment"
                  element={
                    <Elements stripe={stripePromise}>
                      <Payment />
                    </Elements>
                  }
                />
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
