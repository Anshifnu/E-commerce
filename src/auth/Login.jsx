import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

function Login() {
  const [formdata, setFormdata] = useState({ email: "", password: "" });
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");
  const { login } = useUser();
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
    const result = await login(formdata.email, formdata.password);
    if (result.success) {
      if(result.user.role =='admin'){
        navigate("/admin", { replace: true });
      }else{
      navigate("/", { replace: true });
      }  
    } else {
      setError(result.error);
      setShake(true);
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
          Scentify
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
  className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
/>

<p className="text-right text-sm mb-4">
  <Link to="/forgetpassword" className="text-yellow-700 hover:underline">
    Forgot Password?
  </Link>
</p>
        <button
          onClick={handleLogin}
          className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition-all font-semibold"
        >
          Login
        </button>

        <p className="mt-5 text-center text-gray-700 text-sm">
          Don't have an account?{" "}
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
