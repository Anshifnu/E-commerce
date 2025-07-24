// src/Pages/Product.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import db from '../data/db.json';
import { FaHeart } from "react-icons/fa";
import axios from 'axios';

const Product = () => {
  const navigate = useNavigate();
  const products = db.products;

  const [wishlist, setWishlist] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedBrand, setSelectedBrand] = useState("All");

  useEffect(() => {
    const fetchWishlist = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      try {
        const res = await axios.get(`http://localhost:3000/users/${user.id}`);
        const wishlistData = res.data.wishlist || [];
        setWishlist(wishlistData);
        localStorage.setItem("wishlist", JSON.stringify(wishlistData));
      } catch (err) {
        console.error("Error loading wishlist:", err);
      }
    };

    fetchWishlist();
  }, []);

  const addToWishlist = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to add items to wishlist.");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3000/users/${user.id}`);
      const existingWishlist = res.data.wishlist || [];

      const alreadyAdded = existingWishlist.some(item => item.id === product.id);
      if (alreadyAdded) {
        alert("Item already in wishlist!");
        return;
      }

      const updatedWishlist = [...existingWishlist, product];

      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        wishlist: updatedWishlist
      });

      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setWishlist(updatedWishlist);
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      alert("Failed to add to wishlist.");
    }
  };

  const handleBrandFilter = (brand) => {
    setSelectedBrand(brand);
    if (brand === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.name.toLowerCase() === brand.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.id === productId);

  return (
    <div className="p-8 bg-gray-100 min-h-screen pt-24">
      <div
        className="w-full h-64 bg-cover bg-center mb-10 rounded-lg shadow-lg"
        style={{
          backgroundImage: `url('https://mystikumfragrances.com/wp-content/uploads/2025/01/Signature-Collection-2-1536x616.jpg')`,
        }}
      ></div>

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Specify your brands
        </h2>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            className={`px-4 py-2 rounded ${
              selectedBrand === "All"
                ? "bg-black text-white"
                : "bg-white text-black border"
            } hover:bg-yellow-200`}
            onClick={() => handleBrandFilter("All")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedBrand === "marly paris"
                ? "bg-black text-white"
                : "bg-white text-black border"
            } hover:bg-yellow-200`}
            onClick={() => handleBrandFilter("marly paris")}
          >
            marly paris
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedBrand === "Mystikum"
                ? "bg-black text-white"
                : "bg-white text-black border"
            } hover:bg-yellow-200`}
            onClick={() => handleBrandFilter("Mystikum")}
          >
            Mystikum
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedBrand === "sahara"
                ? "bg-black text-white"
                : "bg-white text-black border"
            } hover:bg-yellow-200`}
            onClick={() => handleBrandFilter("sahara")}
          >
            sahara
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col relative"
          >
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={() => addToWishlist(product)}
              title="Add to Wishlist"
              style={{ color: isInWishlist(product.id) ? 'red' : 'black' }}
            >
              <FaHeart />
            </button>

            <img
              src={product.image}
              alt={product.category}
              className="w-full h-48 object-contain mb-4"
            />
            <h2 className="text-lg font-bold text-center mb-2 text-gray-800">
              {product.category}
            </h2>
            <p className="text-sm text-gray-600 mb-3">{product.description}</p>
            <div className="flex justify-between text-sm text-gray-800 mb-4">
              <span>{product.size}</span>
              <span className="font-semibold">${product.price}</span>
            </div>
            <button
              onClick={() => navigate(`/product/${product.id}`)}
              className="mt-auto bg-black text-white py-2 px-4 rounded hover:bg-yellow-200 hover:text-black"
            >
              Explore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
