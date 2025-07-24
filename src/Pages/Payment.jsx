import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Payment() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    zip: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    for (let key in formData) {
      if (!formData[key].trim()) {
        newErrors[key] = "This field is required";
      }
    }
    if (formData.cardNumber && !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }
    if (formData.cvv && !/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
    }
    if (formData.zip && !/^\d{5,6}$/.test(formData.zip)) {
      newErrors.zip = "ZIP code must be 5 or 6 digits";
    }
    return newErrors;
  };

  const handlePayment = () => {
    const foundErrors = validate();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
    } else {
      setErrors({});
      navigate("/confirm", { state: { fromPayment: true }, replace: true });

    }
  };

  return (
    <div className="min-h-screen pt-20 px-0 flex flex-col md:flex-row items-center justify-start bg-gray-50 gap-10">
      {/* Left Image */}
      <div className="w-full md:w-2/4 flex justify-start items-center overflow-hidden">
        <img
          src="https://i.pinimg.com/1200x/04/14/9a/04149ada85f72a5d8d76172bfd674404.jpg"
          alt="Payment Illustration"
          className="w-full h-[620px] object-cover rounded-none"
        />
      </div>

      {/* Right Form Container */}
      <div className="w-full md:w-1/2 max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Shipping & Payment</h2>

        {/* Address Section */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Shipping Address</h3>

          <div>
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <input
              name="street"
              type="text"
              placeholder="Street Address"
              value={formData.street}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <input
                name="city"
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            <div className="w-1/2">
              <input
                name="zip"
                type="text"
                placeholder="ZIP"
                value={formData.zip}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Credit Card Details</h3>

          <div>
            <label className="block text-gray-700 mb-1">Cardholder Name</label>
            <input
              name="cardName"
              type="text"
              placeholder="John Doe"
              value={formData.cardName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Card Number</label>
            <input
              name="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 mb-1">Expiry Date</label>
              <input
                name="expiry"
                type="text"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 mb-1">CVV</label>
              <input
                name="cvv"
                type="password"
                placeholder="123"
                value={formData.cvv}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
            </div>
          </div>

          <div className="flex justify-between items-center border-t pt-4 mt-4">
            <span className="text-lg font-semibold text-gray-700">
              Total: ${totalPrice.toFixed(2)}
            </span>
            <button
              type="button"
              onClick={handlePayment}
              className="bg-black text-white px-5 py-2 rounded hover:bg-yellow-300 hover:text-black transition"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
