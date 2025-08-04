import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect } from "react";

function Payment() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
    useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate("/product", { replace: true });
    }
  }, [cartItems]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "expiry") {
      const cleaned = value.replace(/[^\d]/g, "");
      if (cleaned.length <= 4) {
        if (cleaned.length >= 3) {
          updatedValue = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
        } else {
          updatedValue = cleaned;
        }
      }
    }

    setFormData({ ...formData, [name]: updatedValue });

    if (!updatedValue.trim()) {
      setErrors((prev) => ({ ...prev, [name]: `${name} is required` }));
    } else {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    for (const key in formData) {
      if (!formData[key].trim()) {
        newErrors[key] = `${key} is required`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const shippingInfo = {
      fullName: formData.fullName,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.country,
    };

    const paymentInfo = {
      cardNumber: formData.cardNumber,
      expiry: formData.expiry,
      cvv: formData.cvv,
    };

    navigate("/confirm", {
      state: {
        shippingInfo,
        paymentInfo,
      },
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-20">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-8"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Payment Details
        </h2>

        
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Shipping Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
            <div>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            <div>
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
            </div>
            <div className="md:col-span-2">
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
            </div>
          </div>
        </div>

       
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Payment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={formData.cardNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
            </div>
            <div>
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
            </div>
            <div>
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
            </div>
          </div>
        </div>

       
        <div className="pt-6 border-t mt-4 flex flex-col sm:flex-row sm:justify-between items-center">
          <p className="text-lg font-semibold mb-4 sm:mb-0">
            Total Amount:{" "}
            <span className="text-green-600">${totalPrice.toFixed(2)}</span>
          </p>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Confirm & Pay
          </button>
        </div>
      </form>
    </div>
  );
}

export default Payment;
