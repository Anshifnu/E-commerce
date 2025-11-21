// src/Pages/Wishlist.jsx
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../apiEndpoint";
import api from "../API/axios";

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

const fetchWishlist = async () => {
  try {
    const res = await api.get("wishlist/");
    const mappedWishlist = res.data.map((item) => ({
      wishlistId: item.id,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: parseFloat(item.product.price),
        description: item.product.description,
        brand: item.product.brand,
        stock: item.product.stock,
        images: item.product.images || [],
      },
    }));
    setWishlist(mappedWishlist);
  } catch (err) {
    console.error("Failed to fetch wishlist:", err);
    setWishlist([]);
  }
};



const removeFromWishlist = async (wishlistId) => {
  try {
    await api.delete(`wishlist/${wishlistId}/`); // ✅ delete correct item
    setWishlist((prev) => prev.filter((item) => item.wishlistId !== wishlistId));
  } catch (err) {
    console.error("Error removing wishlist item:", err);
  }
};

const handleMoveToCart = (item) => {
  if (!item.product.stock) {
    alert("This product is out of stock.");
    return;
  }
  addToCart(item.product); // ✅ pass product like in CartContext
  removeFromWishlist(item.wishlistId);
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
  <div key={item.wishlistId} className="bg-white p-4 rounded-lg shadow-md flex flex-col">
    <img
      src={item.product.images[0].image}
      alt={item.product.name}
      className="w-full h-40 object-contain mb-3"
    />
    <h3 className="text-lg font-semibold">{item.product.name}</h3>
    <p className="text-gray-600 text-sm line-clamp-2">{item.product.description}</p>
    <p className="text-blue-600 font-bold mt-1">₹{item.product.price}</p>

    <div className="flex justify-between mt-auto gap-2 mt-4">
      <button
        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
        onClick={() => removeFromWishlist(item.wishlistId)}
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
