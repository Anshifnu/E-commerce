import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";


import Login from './auth/Login.jsx';
import Registration from "./auth/Registration.jsx";
import Home from "./Pages/Home.jsx";
import Navbar from "./Components/Navbar.jsx";


import Product from "./Pages/Product.jsx";
import Cart from "./Pages/Cart.jsx";
import ProductDetails from "./Pages/productDetails.jsx";
import Wishlist from './Pages/WishList.jsx';
import Payment from './Pages/Payment.jsx';
import Confirm from "./Pages/Confirm.jsx";
import Orders from "./Pages/Orders.jsx";
import ProtectedRoute from './ProtectedRoute.jsx';


import AdminDashboard from "./Admin/AdminDashboard.jsx";
import ManageUsers from "./Admin/ManageUsers.jsx";
import ManageProducts from "./Admin/ManageProducts.jsx";
import ManageOrders from "./Admin/ManageOrders.jsx";
import AdminRouter from "./AdminRouter.jsx";
import PublicRouter from "./PublicRouter.jsx";

function AppRoutes() {
  const location = useLocation();

 
  const hideNavbar =
    ["/login", "/register", "/confirm"].includes(location.pathname) ||
    location.pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        <Route element={<PublicRouter />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        </Route>

       
        <Route element={<ProtectedRoute />}>
          
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/orders" element={<Orders />} />
        </Route>

       
        <Route path="/admin" element={<AdminRouter />}>
          <Route index element={<AdminDashboard />} />
          <Route path="ManageUsers" element={<ManageUsers />} />
          <Route path="ManageProducts" element={<ManageProducts />} />
          <Route path="ManageOrders" element={<ManageOrders />} />
        </Route>
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
