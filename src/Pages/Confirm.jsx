import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../API/axios";
import { useRef } from "react";


function Confirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { shippingInfo, paymentInfo } = location.state || {};
  const { cartItems, setCartItems } = useCart();
  const [status, setStatus] = useState("confirming");
  const hasSubmitted = useRef(false);

  useEffect(() => {
    // ✅ Redirect if info missing
    if (!shippingInfo || !paymentInfo || !cartItems || cartItems.length === 0) {
      navigate("/", { replace: true });
      return;
    }

      if (hasSubmitted.current) return;
  hasSubmitted.current = true;

const confirmOrder = async () => {
  try {
const orderData = {
  shipping_info: {
    full_name: shippingInfo.fullName,
    address: shippingInfo.address,
    city: shippingInfo.city,
    postal_code: shippingInfo.postalCode,
    country: shippingInfo.country,
  },
  payment_method: paymentInfo?.method.toLowerCase(), // always lowercase!
  ...(paymentInfo?.method === "card" && {
    payment_info: {
      card_number: paymentInfo.cardNumber,
      expiry: paymentInfo.expiry,
      cvv: paymentInfo.cvv,
    }
  }),
  razorpay_payment_id: paymentInfo?.razorpay_payment_id || null,
  items: cartItems.map((item) => ({
    product_id: item.product.id,
    qty: item.qty,
    price: item.product.price,
  })),
};


    const res = await api.post("orders/", orderData, { withCredentials: true });
    console.log("✅ Order created:", res.data);

    // Clear backend cart
    await api.delete("clear/cart/", { withCredentials: true });
    if (setCartItems) setCartItems([]);

    setStatus("success");
    setTimeout(() => navigate("/orders", { replace: true }), 2000);
  } catch (error) {
    console.error("❌ Error confirming order:", error.response?.data || error.message);
    setStatus("error");
  }
};


    confirmOrder();
  }, [shippingInfo, paymentInfo, cartItems, navigate, setCartItems]);

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center">
        {status === "confirming" && (
          <>
            <div className="animate-spin inline-block w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">
              Confirming your order...
            </h2>
          </>
        )}

        {status === "success" && (
          <>
            <img
              src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
              alt="Success"
              className="w-16 h-16 mx-auto mb-4 animate-bounce"
            />
            <h2 className="text-xl font-semibold text-green-600">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-500 mt-2">Redirecting to your orders...</p>
          </>
        )}

        {status === "error" && (
          <>
            <img
              src="https://cdn-icons-png.flaticon.com/512/463/463612.png"
              alt="Error"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-red-600">
              Something went wrong!
            </h2>
            <p className="text-gray-500 mt-2">Please try again later.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Confirm;
