import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Registration() {
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
    isBlock: false,
    cart: [],
    orders: [],
    wishlist: [],
    created_at: new Date().toISOString(),
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formdata.name.trim()) {
      newErrors.name = "Name is required";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formdata.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(formdata.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formdata.password) {
      newErrors.password = "Password is required";
    } else if (formdata.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formdata.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formdata.password !== formdata.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerUser = async () => {
    try {
      await axios.post("http://localhost:3000/users", formdata);
         navigate("/login",{ replace: true })
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      registerUser();
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center  flex items-center justify-between px-12 bg-[url('https://jaguar-fragrances.com/_next/image?url=https%3A%2F%2Ffra1.digitaloceanspaces.com%2Flng-production%2Fjaguar-fragrances%2FJF_ForMenEvolution_visual_landscape.jpg&w=1920&q=75')]">
      {/* Left Side Text */}
      <div className="text-white max-w-md">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-md">Explore Premium Fragrances</h1>
        <p className="text-lg font-medium leading-relaxed drop-shadow-sm">
          Discover luxurious scents crafted for elegance and lasting impressions.
          Whether you seek floral, woody, or oriental - we have the perfect fragrance for every moment.
        </p>
      </div>

      {/* Registration Form */}
      <div className="bg-blue bg-opacity-60 text-white p-8 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-white hover:ring-offset-2 hover:ring-offset-blue-200">
        <h2 className="text-2xl font-semibold text-center mb-6">Buy Quality Perfumes</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-white">Name:</label>
            <input
              type="text"
              name="name"
              value={formdata.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-white/20 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-sm text-red-300 mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-white">Email:</label>
            <input
              type="email"
              name="email"
              value={formdata.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-white/20 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-sm text-red-300 mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-white">Password:</label>
            <input
              type="password"
              name="password"
              value={formdata.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-white/20 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter password"
            />
            {errors.password && <p className="text-sm text-red-300 mt-1">{errors.password}</p>}
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-medium text-white">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formdata.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-white/20 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm password"
            />
            {errors.confirmPassword && <p className="text-sm text-red-300 mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-white via-blue-200 to-white text-blue-700 font-semibold py-2 rounded-md hover:from-blue-100 hover:to-blue-300 transition-colors"
          >
            Submit
          </button>

          <p className="mt-4 text-center text-white">
            Already have an account?{" "}
            <Link to="/login" className="text-white underline hover:text-blue-300">
              LogIn
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registration;
