import { useState } from "react";
import api from "../API/axios";


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    try {
      await api.post("/user/password-reset/", { email });
      setMessage("Reset link has been sent to your email.");
    } catch (err) {
      setError("Failed to send reset link.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/60 backdrop-blur-md p-8 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>

        {message && <p className="text-green-600 mb-3">{message}</p>}
        {error && <p className="text-red-600 mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border mb-4 rounded-lg"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
