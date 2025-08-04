import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

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

  const validateCardFields = (name, value) => {
    if (name === "cardNumber" && (!/^\d{16}$/.test(value))) {
      return "Card number must be 16 digits";
    }
    if (name === "cvv" && (!/^\d{3}$/.test(value))) {
      return "CVV must be 3 digits";
    }
    if (name === "expiry") {
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
        return "Expiry must be in MM/YY format";
      }
      const [month, year] = value.split("/").map(Number);
      const now = new Date();
      const expiryDate = new Date(`20${year}`, month - 1);
      if (expiryDate < now) {
        return "Card is expired";
      }
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

 if (name === "expiry") {
  let cleaned = value.replace(/[^\d]/g, "").slice(0, 4);

  if (cleaned.length >= 3) {
    const month = cleaned.slice(0, 2);
    const year = cleaned.slice(2);

   
    if (parseInt(month) < 1 || parseInt(month) > 12) {
      setErrors((prev) => ({ ...prev, expiry: "Invalid month (01–12)" }));
    } else {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.expiry;
        return updated;
      });
    }

    updatedValue = `${month}/${year}`;
  } else {
    updatedValue = cleaned;
  }
}


    setFormData((prev) => ({ ...prev, [name]: updatedValue }));

    const errorMsg =
      !updatedValue.trim()
        ? `${name} is required`
        : validateCardFields(name, updatedValue);

    setErrors((prev) => {
      const updated = { ...prev };
      if (errorMsg) {
        updated[name] = errorMsg;
      } else {
        delete updated[name];
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    for (const key in formData) {
      if (!formData[key].trim()) {
        newErrors[key] = `${key} is required`;
      } else {
        const specificError = validateCardFields(key, formData[key]);
        if (specificError) {
          newErrors[key] = specificError;
        }
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

  // JSX content remains unchanged
  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-20">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-8"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Payment Details
        </h2>

        {/* Shipping Fields */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Shipping Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["fullName", "address", "city", "postalCode", "country"].map((field, index) => (
              <div key={field} className={field === "country" ? "md:col-span-2" : ""}>
                <input
                  type="text"
                  name={field}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Fields */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Payment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["cardNumber", "expiry", "cvv"].map((field) => (
              <div key={field}>
                <input
                  type="text"
                  name={field}
                  placeholder={field === "cvv" ? "CVV" : field === "expiry" ? "MM/YY" : "Card Number"}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t mt-4 flex flex-col sm:flex-row sm:justify-between items-center">
          <p className="text-lg font-semibold mb-4 sm:mb-0">
            Total Amount: <span className="text-green-600">${totalPrice.toFixed(2)}</span>
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
