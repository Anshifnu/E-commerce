import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaHeart, FaShoppingCart, FaUserCircle } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const { cartItems, user, setUser } = useCart();
  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white/60 backdrop-blur-md shadow-lg px-8 py-4 rounded-b-2xl">
      <div
        className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-rose-600 text-transparent bg-clip-text cursor-pointer"
        onClick={() => navigate("/")}
      >
        Scentify
      </div>

      <div className="flex items-center gap-6 sm:gap-8 text-2xl text-gray-700 relative">
        <div
          onClick={() => navigate("/Wishlist")}
          className="hover:text-red-500 transition-transform duration-200 hover:scale-110 cursor-pointer"
          title="Wishlist"
        >
          <FaHeart />
        </div>

        <div
          className="relative hover:text-green-600 transition-transform duration-200 hover:scale-110 cursor-pointer"
          onClick={() => navigate("/cart")}
          title="Cart"
        >
          <FaShoppingCart />
          {totalQty > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {totalQty}
            </span>
          )}
        </div>

        {!user ? (
          <div
            className="hover:text-blue-600 transition-transform duration-200 hover:scale-110 cursor-pointer"
            onClick={() => navigate("/login")}
            title="Login"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16">
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          </div>
        ) : (
          <div className="relative flex items-center gap-2 text-black cursor-pointer" ref={dropdownRef}>
            <FaUserCircle
              size={24}
              className="hover:text-blue-600 transition-transform duration-200 hover:scale-110"
              onClick={() => setShowDropdown(!showDropdown)}
              title="User Menu"
            />
            <span
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-sm font-semibold hidden sm:inline"
            >
              Hi, {user.name.split(" ")[0]}
            </span>
            {showDropdown && (
              <div className="absolute top-8 right-0 bg-white border rounded-md shadow-md py-2 w-32 z-50">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/orders");
                  }}
                >
                  Your Orders
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
