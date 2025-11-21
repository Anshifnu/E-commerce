// src/Pages/Cart.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  // 🧮 Decrease quantity
  const handleDecrease = async (item) => {
    if (item.qty <= 1) {
      alert("You can't decrease below 1");
      return;
    }
    await updateQuantity(item.cartItemId, item.qty - 1);
  };

  // 🧮 Increase quantity
  const handleIncrease = async (item) => {
    await addToCart(item.product); // uses context logic (PATCH or POST)
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-6 pt-28 text-center">
        <div className="max-w-6xl mx-auto px-6 mb-6">
          <div className="flex justify-end">
            <button
              onClick={() => navigate("/product")}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg shadow transition"
            >
              ← Explore More Products
            </button>
          </div>
        </div>
        <h2 className="text-2xl font-bold">Your Cart</h2>
        <p className="text-gray-500 mt-4">Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 pt-28">
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/product")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg shadow transition"
          >
            ← Explore More Products
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
        {/* 🛒 Cart Items Section */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h2>

          {cartItems.map((item) => (
            <div
              key={item.cartItemId}
              className="flex items-center border rounded-lg shadow-md p-4 mb-4 gap-4"
            >
              <img
                src={item.product.images[0]?.image || "/placeholder.jpg"}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.product.name}</h3>
                <p className="text-gray-500 text-sm">{item.product.brand}</p>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {item.product.description}
                </p>
                <p className="text-blue-600 font-bold mt-1">
                  ₹{item.product.price}
                </p>
                <p className="text-sm text-gray-500">
                  In stock: {item.product.stock}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center mt-2 space-x-3">
                  <button
                    onClick={() => handleDecrease(item)}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-gray-800 font-medium">{item.qty}</span>
                  <button
                    onClick={() => handleIncrease(item)}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => removeFromCart(item.cartItemId)}
                className="ml-4 text-red-500 hover:text-red-700"
                title="Remove item"
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>

        {/* 💰 Order Summary */}
        <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow-md h-fit self-center">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Total Items:</span>
            <span>{cartItems.length}</span>
          </div>
          <div className="flex justify-between mb-4 text-gray-700">
            <span>Total Price:</span>
            <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate("/payment")}
            className="w-full bg-black text-white py-2 rounded hover:bg-yellow-300 hover:text-black transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
