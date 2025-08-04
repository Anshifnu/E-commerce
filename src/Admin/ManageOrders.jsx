import { useEffect, useState } from "react";
import axios from "axios";
import { Search, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Order Management</h1>
            <p className="text-gray-600">Track and update customer orders</p>
          </div>
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-blue-100 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by user or product..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Orders Table */}
        {filteredOrders.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order, index) => (
                    <tr key={order.orderId} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {order.userName?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                            <div className="text-xs text-gray-500">{order.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.qty}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        ${order.qty * order.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                          className={`block w-full pl-3 pr-8 py-2 text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 capitalize ${
                            order.status === 'pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                            order.status === 'processing' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                            order.status === 'shipped' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                            'bg-green-50 border-green-200 text-green-700'
                          }`}
                        >
                          <option value="pending" className="bg-white">Pending</option>
                          <option value="processing" className="bg-white">Processing</option>
                          <option value="shipped" className="bg-white">Shipped</option>
                          <option value="Delivered" className="bg-white">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mx-auto max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="mt-2 text-gray-500">There are currently no orders matching your search.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageOrders;