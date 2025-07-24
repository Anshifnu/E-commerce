import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from './auth/Login.jsx';
import Registration from "./auth/Registration.jsx";
import Home from "./Pages/Home.jsx";
import Navbar from "./Components/Navbar.jsx";
import Product from "./Pages/Product.jsx";
import Cart from "./Pages/Cart.jsx";
import ProductDetails from "./Pages/productDetails.jsx";
import Wishlist from './Pages/WishList.jsx'
import Payment from './Pages/Payment.jsx'
import Confirm from "./Pages/Confirm.jsx";
import Orders from "./Pages/Orders.jsx";





import { useEffect } from "react";

function AppRoutes() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/confirm" ;

  useEffect(() => {
    window.scrollTo(0, 0); // optional: scroll to top on route change
  }, [location]);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Registration />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/orders" element={<Orders />} />


      </Routes>
    </>
  );
}

function Router() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default Router;
