import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart } from "react-icons/fa";

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedName, setSelectedName] = useState("");
   const user = localStorage.getItem("user")
    
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role === "Admin") {
        navigate("/admin", { replace: true });
      }
    }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Error loading products:", err);
      }
    };

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

    fetchProducts();
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

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.id === productId);

  
  const uniqueNames = [...new Set(products.map(p => p.name))];

  
  const filteredProducts = products.filter(product =>
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedName === "" || product.name === selectedName)
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen pt-24">
      <div
        className="w-full h-64 bg-cover bg-center mb-10 rounded-lg shadow-lg"
        style={{
          backgroundImage: `url('https://mystikumfragrances.com/wp-content/uploads/2025/01/Signature-Collection-2-1536x616.jpg')`,
        }}
      ></div>

    
      <div className="mb-6 flex justify-center">
        <div className="flex items-center w-full max-w-md bg-white border border-gray-300 rounded-full px-4 py-2 shadow">
          <span className="text-gray-600 text-sm mr-2 whitespace-nowrap">Search here:</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
            placeholder="Find your product"
          />
        </div>
      </div>

     
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button
          onClick={() => setSelectedName("")}
          className={`px-4 py-2 rounded-full border ${
            selectedName === ""
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-yellow-200"
          } transition duration-200 shadow`}
        >
          All
        </button>

        {uniqueNames.map((name) => (
          <button
            key={name}
            onClick={() => setSelectedName(name)}
            className={`px-4 py-2 rounded-full border ${
              selectedName === name
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-yellow-200"
            } transition duration-200 shadow`}
          >
            {name}
          </button>
        ))}
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

            
            <p className="text-sm text-gray-600 mb-2">{product.description}</p>

            
            <p className={`text-xs mb-2 font-medium ${
              product.stock ? 'text-green-600' : 'text-red-500'
            }`}>
              {product.stock ? "In Stock" : "Out of Stock"}
            </p>

           
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
