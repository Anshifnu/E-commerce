// src/Pages/Confirm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from '../context/CartContext'

function Confirm() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("confirming");
  const { user, setCartItems } = useCart(); // ✅ Use user from context

  useEffect(() => {
    const confirmOrder = async () => {
      try {
        if (!user || !user.id) {
          console.error("User not logged in");
          return;
        }

        // ✅ Step 1: Fetch fresh user data from backend
        const res = await axios.get(`http://localhost:3000/users/${user.id}`);
        const currentUser = res.data;

        const currentCart = currentUser.cart || [];

        if (currentCart.length > 0) {
          // ✅ Step 2: Merge cart into orders
          const updatedOrders = [...(currentUser.orders || []), ...currentCart];

          // ✅ Step 3: Clear the cart and update the backend
          await axios.patch(`http://localhost:3000/users/${user.id}`, {
            cart: [],
            orders: updatedOrders,
          });

          // ✅ Step 4: Clear the frontend cart state
          setCartItems([]);
        }

        // ✅ Step 5: Update status after success
        setStatus("success");

        // ✅ Step 6: Navigate home after delay
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } catch (error) {
        console.error("Error confirming order:", error);
      }
    };

    confirmOrder();
  }, [navigate, user, setCartItems]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center">
        {status === "confirming" ? (
          <>
            <div className="animate-spin inline-block w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">
              Confirming your order...
            </h2>
          </>
        ) : (
          <>
            <img
              src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
              alt="Success"
              className="w-16 h-16 mx-auto mb-4 animate-bounce"
            />
            <h2 className="text-xl font-semibold text-green-600">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-500 mt-2">Redirecting to home...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Confirm;
