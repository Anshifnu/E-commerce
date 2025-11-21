import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../API/axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Get logged-in user ID from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.user_id) {
      setUserId(storedUser.user_id);
    }
  }, []);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      try {
        const res = await api.get(`orders/?user=${userId}`);
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    try {
      await api.patch(`orders/${orderId}/`, { status: "Cancelled" });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
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

  // Flatten items with order info
  const flatItems = orders.flatMap((order) =>
    order.items.map((item) => ({
      ...item,
      orderId: order.id,
      status: order.status,
      date: order.date,
      shipping_info: order.shipping_info,
      payment_info: order.payment_info,
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
                  item.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : item.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.status}
              </span>
              <div className="text-sm text-gray-500">
                Ordered on: {new Date(item.date).toLocaleDateString()}
              </div>
            </div>

            {item.status === "Pending" && (
              <div className="mb-3">
                <button
                  onClick={() => handleCancelOrder(item.orderId)}
                  className="bg-red-500 text-white px-4 py-1 rounded-md text-sm hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            )}

            {item.status === "Pending" && (
              <p className="text-gray-500 text-sm italic mb-3">
                Expected in 3–4 business days.
              </p>
            )}

            <div className="flex flex-col md:flex-row gap-4 items-center">
              <img
                src={item.image || "/placeholder.png"}
                alt={item.product_name || "Product"}
                className="h-32 w-32 object-contain rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.product_name || "Product Name"}
                </h3>
                <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                <p className="text-sm text-green-700 font-semibold">
                  Price: ${item.price} × {item.qty} ={" "}
                  <span className="text-green-800 font-bold">
                    ${(item.price * item.qty).toFixed(2)}
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
