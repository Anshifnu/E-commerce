import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { LogOut } from "lucide-react";
import { URL } from "../apiEndpoint";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "Admin") {
      navigate("/login", { replace: true });
    }
  }, []);

  useEffect(() => {
    axios.get(`${URL}/users"`).then((res) => {
      setUsers(res.data || []);
    });
  }, []);

  const totalUsers = users.filter((u) => u.role === "User").length;

  const userOrders = users
    .filter((u) => u.role === "User")
    .flatMap((user) => user.orders || []);

  const totalOrders = userOrders.length;

  const totalRevenue = userOrders.reduce((sum, order) => {
    const orderTotal = (order.items || []).reduce(
      (itemSum, item) => itemSum + (item.price || 0) * (item.qty || 0),
      0
    );
    return sum + orderTotal;
  }, 0);

  
  const getLast7DaysSales = () => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const key = date.toISOString().split("T")[0]; 
      return key;
    });

    return days.map((dateStr) => {
      const sales = userOrders.reduce((sum, order) => {
        const orderDate = order.date?.split("T")[0];
        if (orderDate === dateStr) {
          return sum + (order.items || []).reduce(
            (itemSum, item) => itemSum + (item.price || 0) * (item.qty || 0),
            0
          );
        }
        return sum;
      }, 0);
      return { day: dateStr.slice(5), sales };
    });
  };

  const weeklyData = getLast7DaysSales();

 
  const getTopProductsData = () => {
    const map = {};

    userOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        if (!map[item.id]) {
          map[item.id] = { name: item.name, qty: 0 };
        }
        map[item.id].qty += item.qty;
      });
    });

    return Object.values(map)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 3)
      .map((item) => ({ name: item.name, value: item.qty }));
  };

  const topProductsData = getTopProductsData();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto relative">
        <button
          onClick={handleLogout}
          className="absolute top-0 right-0 flex items-center gap-2 text-red-500 hover:text-red-700 font-semibold"
        >
          <LogOut size={20} />
          Logout
        </button>

        <h1 className="text-4xl font-bold text-rose-700 mb-8">Admin Dashboard</h1>

       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">{totalUsers}</h2>
            <p className="text-gray-500 mt-2">Total Users</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">{totalOrders}</h2>
            <p className="text-gray-500 mt-2">Total Orders</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              $ {totalRevenue.toFixed(2)}
            </h2>
            <p className="text-gray-500 mt-2">Total Revenue</p>
          </div>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            onClick={() => navigate("/ManageUsers")}
            className="bg-white cursor-pointer rounded-xl shadow p-6 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-gray-700">Manage Users</h2>
            <p className="text-sm text-gray-500 mt-2">
              View, block, or delete user accounts.
            </p>
          </div>

          <div
            onClick={() => navigate("/ManageProducts")}
            className="bg-white cursor-pointer rounded-xl shadow p-6 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-gray-700">Manage Products</h2>
            <p className="text-sm text-gray-500 mt-2">
              Add, update, or remove perfumes.
            </p>
          </div>

          <div
            onClick={() => navigate("/ManageOrders")}
            className="bg-white cursor-pointer rounded-xl shadow p-6 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-gray-700">Manage Orders</h2>
            <p className="text-sm text-gray-500 mt-2">
              Track and process customer orders.
            </p>
          </div>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Weekly Sales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#f43f5e" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Top Selling Products
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProductsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  label
                >
                  {topProductsData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
