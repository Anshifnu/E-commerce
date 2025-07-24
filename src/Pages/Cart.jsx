// src/Pages/Cart.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, addToCart, setCartItems } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleDecrease = async (item) => {
    if (item.qty === 1) {
      removeFromCart(item.id);
    } else {
      const updatedQty = item.qty - 1;
      const updatedCart = cartItems.map((p) =>
        p.id === item.id ? { ...p, qty: updatedQty } : p
      );
      setCartItems(updatedCart);

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        await fetch(`http://localhost:3000/users/${user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart: updatedCart }),
        });
      } catch (err) {
        console.error("Failed to update cart quantity", err);
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-6 pt-24 text-center">
        <h2 className="text-2xl font-bold">Your Cart</h2>
        <p className="text-gray-500 mt-4">Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24 flex flex-col md:flex-row gap-8">
      {/* Left: Cart Items */}
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Cart</h2>

        {cartItems.map((product) => (
          <div
            key={product.id}
            className="flex items-center border rounded-lg shadow-md p-4 mb-4 gap-4"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {product.description}
              </p>
              <p className="text-blue-600 font-bold mt-1">${product.price}</p>

              <div className="flex items-center mt-2 space-x-3">
                <button
                  onClick={() => handleDecrease(product)}
                  className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                >
                  <Minus size={16} />
                </button>
                <span className="text-gray-800 font-medium">
                  {product.qty}
                </span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={() => removeFromCart(product.id)}
              className="ml-4 text-red-500 hover:text-red-700"
              title="Remove item"
            >
              <Trash2 />
            </button>
          </div>
        ))}
      </div>

      {/* Right: Summary */}
    <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow-md h-fit self-center">

        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <div className="flex justify-between mb-2 text-gray-700">
          <span>Total Items:</span>
          <span>{cartItems.length}</span>
        </div>
        <div className="flex justify-between mb-4 text-gray-700">
          <span>Total Price:</span>
          <span className="font-semibold">${totalPrice.toFixed(2)}</span>
        </div>

        <button
          onClick={() => navigate("/payment")}
          className="w-full bg-black text-white py-2 rounded hover:bg-yellow-300 hover:text-black transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
