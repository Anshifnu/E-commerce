import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaSearch, FaArrowRight } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import api from "../API/axios";


const Product = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Fetch products + wishlist
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await api.get("/products/");
        setProducts(productRes.data);

        if (user) {
          const wishlistRes = await api.get(`/wishlist/`);
          setWishlist(wishlistRes.data);
        } else {
          setWishlist([]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // 🔹 Add/remove wishlist item
  const toggleWishlist = async (productId) => {
    if (!user) {
      alert("Please login to manage wishlist.");
      navigate("/login");
      return;
    }

    try {
      const isInWishlist = wishlist.some((item) => item.product.id === productId);

      if (isInWishlist) {
        // remove from wishlist
        await api.delete(`/wishlist/${productId}/`);
        setWishlist(wishlist.filter((item) => item.product.id !== productId));
      } else {
        // add to wishlist
        await api.post("/wishlist/", { product_id: productId });
        setWishlist([...wishlist, { product: { id: productId } }]);
      }
    } catch (err) {
      console.error("Wishlist update failed:", err);
    }
  };

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.product.id === productId);

  // 🔹 Filter products
  const uniqueBrands = [...new Set(products.map((p) => p.brand?.name))];

  // Filter products
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedBrand === "" || product.brand?.name === selectedBrand)
  );
  // 🔹 Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-2xl text-gray-600">
          Loading fragrances...
        </div>
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
            backgroundImage: `url('https://in.ajmal.com/cdn/shop/files/category-banner-1-_5_9bb14966-243d-48e6-9d9a-b620a476e974.jpg?v=1753787194')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center px-6">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                Discover Your Signature Scent
              </h1>
              <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
                Curated collection of the world’s finest fragrances
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-amber-400 focus:border-transparent shadow-sm"
              placeholder="Search by product name..."
            />
          </div>

          <div className="w-full md:w-auto">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-amber-400 focus:border-transparent shadow-sm appearance-none bg-white"
            >
              <option value="">All Brands</option>
              {uniqueBrands.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
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
                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-full ${
                    isInWishlist(product.id)
                      ? "text-red-500 bg-white shadow-md"
                      : "text-gray-400 bg-white shadow-md hover:text-red-500"
                  } transition-colors duration-200`}
                  title={
                    isInWishlist(product.id)
                      ? "In Wishlist"
                      : "Add to Wishlist"
                  }
                >
                  <FaHeart className="text-lg" />
                </button>

                {/* Product Image */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={product.images?.[0]?.image || "/no-image.jpg"}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Product Info */}
                <div className="p-5 flex-grow flex flex-col">
                  <div className="mb-3">
                  <span className="text-xs font-medium text-amber-600">
                       {product.brand?.name}
                  </span>
                    <h3 className="text-xl font-serif font-medium text-gray-800 mt-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-auto flex justify-between items-center">
                    <p className="text-lg font-bold text-gray-800">
                      ₹{product.price}
                    </p>
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200"
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
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No fragrances found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
