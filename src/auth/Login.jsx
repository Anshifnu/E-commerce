import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

function Login() {
  const [formdata, setFormdata] = useState({ email: "", password: "" });
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");
  const { setUser,user } = useCart();
  const navigate = useNavigate();



  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
    setError("");
    setShake(false);
  };

  const validateForm = () => {
    const { email, password } = formdata;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields."); setShake(true); return false;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email."); setShake(true); return false;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters."); setShake(true); return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    try {
      const res = await axios.get("http://localhost:3000/users");
      const matchedUser = res.data.find(
        (u) => u.email === formdata.email && u.password === formdata.password
      );
      if (matchedUser) {
        if (matchedUser.isBlock) {
          setError("Your account has been blocked by the admin."); setShake(true); return;
        }
        localStorage.setItem("user", JSON.stringify(matchedUser));
        setUser(matchedUser);
        navigate(matchedUser.role === "Admin" ? "/admin" : "/", { replace: true });
      } else {
        setError("Invalid email or password."); setShake(true);
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later."); setShake(true);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "url('https://imgs.search.brave.com/J5GbCTfB6XKuAwRD-BpFNBiFOEBhWC6JsJugTD4BPYE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzExLzQyLzI3LzU4/LzM2MF9GXzExNDIy/NzU4MTFfMzMybUJB/cko4THVLZ3hsenB3/T2dDQ2dMWE0wb2Fu/OFQuanBn')",
      }}
    >
      <div
        className={`backdrop-blur-md bg-white/60 p-8 rounded-xl shadow-xl w-full max-w-md transition-all duration-300 ${
          shake ? "animate-shake" : ""
        }`}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 font-serif tracking-wide">
          Perfume Login
        </h2>

        {error && (
          <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formdata.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formdata.password}
          onChange={handleChange}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition-all font-semibold"
        >
          Login
        </button>

        <p className="mt-5 text-center text-gray-700 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-yellow-700 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>

      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}

export default Login;
