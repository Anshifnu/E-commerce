import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaSearch, FaArrowRight } from "react-icons/fa";

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "Admin") {
      navigate("/admin", { replace: true });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, wishlistRes] = await Promise.all([
          axios.get('http://localhost:3000/products'),
          localStorage.getItem("user") ? 
            axios.get(`http://localhost:3000/users/${JSON.parse(localStorage.getItem("user")).id}`) 
            : Promise.resolve({ data: { wishlist: [] } })
        ]);
        
        setProducts(productsRes.data);
        setWishlist(wishlistRes.data.wishlist || []);
        localStorage.setItem("wishlist", JSON.stringify(wishlistRes.data.wishlist || []));
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

      if (existingWishlist.some(item => item.id === product.id)) {
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

  const isInWishlist = (productId) => wishlist.some((item) => item.id === productId);
  const uniqueNames = [...new Set(products.map(p => p.name))];
  const filteredProducts = products.filter(product =>
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedName === "" || product.name === selectedName)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-2xl text-gray-600">Loading exquisite fragrances...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen pt-24">
      {/* Hero Section */}
      <div className="relative h-96 w-full mb-16 rounded-3xl overflow-hidden shadow-xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1615228939091-4c8d7b45cc0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center px-6">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Discover Your Signature Scent</h1>
              <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
                Curated collection of the world's finest fragrances, each telling its own story
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-amber-400 focus:border-transparent shadow-sm"
              placeholder="Search by fragrance notes..."
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-auto">
            <select 
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-amber-400 focus:border-transparent shadow-sm appearance-none bg-white"
            >
              <option value="">All Collections</option>
              {uniqueNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedName("")}
            className={`px-5 py-2 rounded-full border-2 ${
              selectedName === ""
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-amber-50"
            } transition duration-200 shadow-sm`}
          >
            All
          </button>
          {uniqueNames.map((name) => (
            <button
              key={name}
              onClick={() => setSelectedName(name)}
              className={`px-5 py-2 rounded-full border-2 ${
                selectedName === name
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-amber-50"
              } transition duration-200 shadow-sm`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group relative"
              >
                {/* Stock Status Badge */}
                {!product.stock && (
                  <div className="absolute top-4 left-4 z-10 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                    Out of Stock
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => addToWishlist(product)}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-full ${
                    isInWishlist(product.id) 
                      ? 'text-red-500 bg-white shadow-md' 
                      : 'text-gray-400 bg-white shadow-md hover:text-red-500'
                  } transition-colors duration-200`}
                  title={isInWishlist(product.id) ? "In Wishlist" : "Add to Wishlist"}
                >
                  <FaHeart className="text-lg" />
                </button>

                {/* Product Image (always visible) */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.category}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Product Info */}
                <div className="p-5 flex-grow flex flex-col">
                  <div className="mb-3">
                    <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">
                      {product.name}
                    </span>
                    <h3 className="text-xl font-serif font-medium text-gray-800 mt-1">
                      {product.category}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-auto flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">{product.size}</span>
                      <p className="text-lg font-bold text-gray-800">${product.price}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 "

                    >
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-5xl mb-4">🧴</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No fragrances found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedName("");
              }}
              className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;