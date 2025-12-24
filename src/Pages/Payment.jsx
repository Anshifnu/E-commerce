import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../API/axios";


function Payment() {
  const navigate = useNavigate();
  const { cartItems } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate("/product", { replace: true });
    }
  }, [cartItems]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
}, []);

  

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

  // ✅ Validate shipping fields only
  const shippingFields = ["fullName", "address", "city", "postalCode", "country"];
  const newErrors = {};

  shippingFields.forEach((field) => {
    if (!formData[field].trim()) {
      newErrors[field] = `${field} is required`;
    }
  });

  // ❌ Stop if shipping invalid
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // ✅ Razorpay flow
  if (paymentMethod === "razorpay") {
    handleRazorpayPayment();
    return;
  }

  // ✅ Card validation ONLY for card payment
  ["cardNumber", "expiry", "cvv"].forEach((field) => {
    const error = validateCardFields(field, formData[field]);
    if (error) newErrors[field] = error;
  });

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  navigate("/confirm", {
    state: {
      shippingInfo: {
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
     paymentInfo: {
  method: "card",
  cardNumber: formData.cardNumber,
  expiry: formData.expiry,
  cvv: formData.cvv
},
    },
    replace: true,
  });
};

 const handleRazorpayPayment = async () => {
  try {
    // 1️⃣ Create razorpay order (backend)
    const res = await api.post("create/", {
      amount: totalPrice,
    });

    const { order_id, amount, currency } = res.data;

    // 2️⃣ Open Razorpay checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount,
      currency,
      name: "My Ecommerce Store",
      description: "Order Payment",
      order_id,

      handler: async function (response) {
        // 3️⃣ Verify payment
        await api.post("verify/", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        // 4️⃣ Go to confirm page
        navigate("/confirm", {
          state: {
            shippingInfo: {
              fullName: formData.fullName,
              address: formData.address,
              city: formData.city,
              postalCode: formData.postalCode,
              country: formData.country,
            },
            paymentInfo: {
              method: "razorpay",
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
            },
          },
          replace: true,
        });
      },

      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Razorpay error:", error);
    alert("Payment failed. Try again.");
  }
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
        {/* Payment Method */}
<div>
  <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
    Payment Method
  </h3>

  <div className="flex gap-6 mb-6">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        value="card"
        checked={paymentMethod === "card"}
        onChange={() => setPaymentMethod("card")}
      />
      <span>Card Payment</span>
    </label>

    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        value="razorpay"
        checked={paymentMethod === "razorpay"}
        onChange={() => setPaymentMethod("razorpay")}
      />
      <span>Razorpay (UPI / Wallet / Card)</span>
    </label>
  </div>

  {paymentMethod === "card" && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {["cardNumber", "expiry", "cvv"].map((field) => (
        <div key={field}>
          <input
            type="text"
            name={field}
            placeholder={
              field === "cvv"
                ? "CVV"
                : field === "expiry"
                ? "MM/YY"
                : "Card Number"
            }
            value={formData[field]}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
          )}
        </div>
      ))}
    </div>
  )}
</div>


        <div className="pt-6 border-t mt-4 flex flex-col sm:flex-row sm:justify-between items-center">
          <p className="text-lg font-semibold mb-4 sm:mb-0">
            Total Amount: <span className="text-green-600">₹{totalPrice.toFixed(2)}</span>
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
