import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../API/axios";

function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async () => {
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await api.post(`/user/reset-password/${uid}/${token}/`, {
        password: password,
      });

      setSuccess("Password reset successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Reset link invalid or expired.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/60 backdrop-blur-md p-8 rounded-xl max-w-md w-full shadow-xl">

        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>

        {success && <p className="text-green-600 mb-3">{success}</p>}
        {error && <p className="text-red-600 mb-3">{error}</p>}

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border mb-4 rounded-lg"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full p-3 border mb-4 rounded-lg"
        />

        <button
          onClick={handleReset}
          className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700"
        >
          Reset Password
        </button>

      </div>
    </div>
  );
}

export default ResetPassword;
