import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

function Login() {
  const [formdata, setFormdata] = useState({ email: "", password: "" });
  const [animate, setAnimate] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      const users = res.data;

      const matchedUser = users.find(
        (user) =>
          user.email === formdata.email &&
          user.password === formdata.password &&
          user.isBlock === false
      );

      if (matchedUser) {
        localStorage.setItem("user", JSON.stringify(matchedUser));
        setUser(matchedUser); // update context
        navigate("/",{ replace: true });
      } else {
        setError("Invalid Email or Password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-opacity duration-700 ${animate ? "opacity-100" : "opacity-0"}`}>
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-rose-600">Login</h2>

        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formdata.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formdata.password}
          onChange={handleChange}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-rose-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
