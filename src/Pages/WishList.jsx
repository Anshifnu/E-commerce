// src/Pages/Wishlist.jsx
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../apiEndpoint";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchWishlist(storedUser.id);
    }
  }, []);

  const fetchWishlist = async (userId) => {
    try {
      const res = await axios.get(`${URL}/users/${userId}`);
      setWishlist(res.data.wishlist || []);
      localStorage.setItem("wishlist", JSON.stringify(res.data.wishlist || []));
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  const updateWishlist = async (newWishlist) => {
    if (!user) return;
    try {
      await axios.patch(`${URL}/users/${user.id}`, {
        wishlist: newWishlist,
      });
      setWishlist(newWishlist);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    } catch (err) {
      console.error("Error updating wishlist in DB:", err);
    }
  };

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    updateWishlist(updated);
  };

  const handleMoveToCart = (item) => {
    if (!item.stock) {
      alert("This product is out of stock.");
      return;
    }
    addToCart(item);
    removeFromWishlist(item.id);
    navigate("/cart");
  };

  if (wishlist.length === 0) {
    return (
      <div className="pt-24 text-center">
        <h2 className="text-2xl font-bold">Wishlist</h2>
        <p className="text-gray-500 mt-4">Your wishlist is empty.</p>
        <button
          onClick={() => navigate("/product")}
          className="mt-6 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
        >
          Explore More
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24 relative">
      {/* Fixed top-right Explore More button */}
      <div className="fixed top-20 right-6 z-50">
        <button
          onClick={() => navigate("/product")}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition duration-200"
        >
          Explore More
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Your Wishlist</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-contain mb-3"
            />
            <h3 className="text-lg font-semibold">{item.category}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
            <p className="text-blue-600 font-bold mt-1">${item.price}</p>

            <div className="flex justify-between mt-auto gap-2 mt-4">
              <button
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                onClick={() => removeFromWishlist(item.id)}
              >
                Remove
              </button>
              <button
                className="bg-black text-white py-1 px-3 rounded hover:bg-yellow-300 hover:text-black"
                onClick={() => handleMoveToCart(item)}
              >
                Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
