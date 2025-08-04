import { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ManageOrders() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/users").then((res) => {
      const userData = res.data || [];
      setUsers(userData);

      const allOrders = userData
        .filter((u) => u.role === "User")
        .flatMap((user) =>
          (user.orders || []).flatMap((order, orderIndex) =>
            (order.items || []).map((item, itemIndex) => ({
              ...item,
              userName: user.name,
              userEmail: user.email,
              orderId: `${user.id}-${orderIndex}-${itemIndex}`,
              userId: user.id,
              orderIndex,
              status: order.status || "pending",
            }))
          )
        );

      setOrders(allOrders);
    });
  }, []);

  const handleStatusChange = (order, newStatus) => {
    axios.get(`http://localhost:3000/users/${order.userId}`).then((res) => {
      const user = res.data;
      const updatedOrders = [...user.orders];

      if (updatedOrders[order.orderIndex]) {
        updatedOrders[order.orderIndex].status = newStatus;

        axios
          .patch(`http://localhost:3000/users/${order.userId}`, {
            orders: updatedOrders,
          })
          .then(() => {
            setOrders((prevOrders) =>
              prevOrders.map((o) =>
                o.orderId === order.orderId ? { ...o, status: newStatus } : o
              )
            );
          })
          .catch((err) => console.error("Error updating order status:", err));
      }
    });
  };

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      (order.name && order.name.toLowerCase().includes(term)) ||
      (order.userName && order.userName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
       
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-rose-700">Manage Orders</h1>
          <button
            onClick={() => navigate("/admin")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>

       
        <div className="flex items-center mb-4 gap-2">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by user or product..."
            className="border px-3 py-2 rounded-md w-full max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

       
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Qty</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order.orderId}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{order.userName}</div>
                        <div className="text-xs text-gray-500">
                          {order.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{order.name}</td>
                    <td className="px-4 py-3">{order.qty}</td>
                    <td className="px-4 py-3">${order.price}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">
                      ${order.qty * order.price}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order, e.target.value)
                        }
                        className="border rounded px-2 py-1 bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-6">No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default ManageOrders;
