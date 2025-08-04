import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { URL } from "../apiEndpoint";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.id) {
      setUserId(storedUser.id);
    }
  }, []);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`${URL}/users/${userId}`);
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, [userId]);

  const handleCancelOrder = async (orderId) => {
    try {
      const userRes = await axios.get(`${URL}/users/${userId}`);
      const userData = userRes.data;

      const updatedOrders = userData.orders.filter(order => order.id !== orderId);

      await axios.put(`${URL}/users/${userId}`, {
        ...userData,
        orders: updatedOrders,
      });

      setOrders(updatedOrders);
    } catch (err) {
      console.error("Error cancelling order:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading your orders...</p>
      </div>
    );
  }

  const flatItems = orders.flatMap((order) =>
    order.items.map((item) => ({
      ...item,
      orderId: order.id,
      status: order.status,
      date: order.date,
    }))
  );

  if (flatItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Your Orders
      </h2>
      <div className="space-y-6 max-w-5xl mx-auto">
        {flatItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md p-5 border hover:shadow-lg transition duration-300"
          >
          
            <div className="flex justify-between items-center mb-2">
              <span
                className={`px-4 py-1 text-sm font-medium rounded-full shadow-sm ${
                  item.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : item.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
              <div className="text-sm text-gray-500">
                Ordered on: {new Date(item.date).toLocaleDateString()}
              </div>
            </div>

            
            {item.status === "pending" && (
              <div className="mb-3">
                <button
                  onClick={() => handleCancelOrder(item.orderId)}
                  className="bg-red-500 text-white px-4 py-1 rounded-md text-sm hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            )}

            {item.status === "pending" && (
              <p className="text-gray-500 text-sm italic mb-3">
                Expected in 3–4 business days.
              </p>
            )}

            
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <img
                src={item.image}
                alt={item.name}
                className="h-32 w-32 object-contain rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                <p className="text-sm text-green-700 font-semibold">
                  Price: ${item.price} × {item.qty} ={" "}
                  <span className="text-green-800 font-bold">
                    ${item.price * item.qty}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          to="/product"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition text-sm"
        >
          Shop More Products
        </Link>
      </div>
    </div>
  );
}

export default Orders;
