import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { URL } from "../apiEndpoint";
import api from "../API/axios";


function Registration() {
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""

  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateLive = (name, value) => {
    let message = "";

    if (name === "name" && !value.trim()) {
      message = "Name is required";
    }

    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        message = "Email is required";
      } else if (!emailPattern.test(value)) {
        message = "Invalid email format";
      }
    }

    if (name === "password") {
      if (!value) {
        message = "Password is required";
      } else if (value.length < 6) {
        message = "Password must be at least 6 characters";
      }
    }

    if (name === "confirmPassword") {
      if (!value) {
        message = "Confirm your password";
      } else if (value !== formdata.password) {
        message = "Passwords do not match";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: message,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformdata({
      ...formdata,
      [name]: value,
    });
    validateLive(name, value);
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
    
    const payload = {
      username: formdata.name,  
      email: formdata.email,
      password: formdata.password,
      confirm_password: formdata.confirmPassword,
    };

    await api.post('user/register/', payload);
    navigate("/login", { replace: true });
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};





  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      registerUser();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-rose-200 flex items-center justify-center p-6">
      <div className="flex w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden">
       
        <div className="w-1/2 bg-[url('https://imgs.search.brave.com/qMLIm64cnR7xHOLS3q4WBqMoJ5kUngzyhCYyaoUODPs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvODYw/ODAxMzgyL3Bob3Rv/L3BlcmZ1bWUtc3By/YXlpbmctb24tcHVy/cGxlLWJhY2tncm91/bmQuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPUl1OHpyYlpj/eU9pUFNpOS1TbnEt/TEFCZ2NBUVdMSU12/NXhxUWx5R2x2TXM9')] bg-cover bg-center p-10 hidden md:block">
          <div className="text-white backdrop-blur-sm bg-black/30 p-6 rounded-xl">
            <h1 className="text-4xl font-extrabold mb-4 tracking-wide">Scentify Perfume Registration</h1>
            <p className="text-lg font-light leading-relaxed">
              Join a world of luxury, crafted with timeless scents. Create your account to explore and enjoy exclusive fragrances.
            </p>
          </div>
        </div>

       
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-gray-600 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formdata.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block mb-1 text-gray-600 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formdata.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block mb-1 text-gray-600 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formdata.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="Enter password"
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block mb-1 text-gray-600 font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formdata.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-400 to-pink-300 text-white font-semibold rounded-lg hover:from-rose-500 hover:to-pink-400 transition-all"
            >
              Register
            </button>

            <p className="text-center text-gray-600 text-sm mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-rose-500 font-medium hover:underline">
                Log in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Registration;


