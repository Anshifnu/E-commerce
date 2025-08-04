import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    axios.get("http://localhost:3000/users").then((res) => {
      setUsers(res.data || []);
    });
  }, []);

  const toggleBlockStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:3000/users/${id}`, {
        isBlock: !currentStatus,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, isBlock: !currentStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating block status:", error);
    }
  };

  const toggleAdminStatus = async (id, currentRole) => {
    const newRole = currentRole === "Admin" ? "User" : "Admin";
    try {
      await axios.patch(`http://localhost:3000/users/${id}`, {
        role: newRole,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating admin status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold text-rose-700">Manage Users</h1>
  <button
    onClick={() => navigate("/admin")}
    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
  >
    Back to Dashboard
  </button>
</div>

        

        {users.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.role}</td>
                    <td className="px-4 py-3">
                      {user.isBlock ? (
                        <span className="text-red-500 font-semibold">
                          Blocked
                        </span>
                      ) : (
                        <span className="text-green-600 font-semibold">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 flex gap-2 flex-wrap">
                      <button
                        onClick={() => toggleBlockStatus(user.id, user.isBlock)}
                        className={`px-3 py-1 rounded-md text-white ${
                          user.isBlock ? "bg-green-600" : "bg-red-500"
                        }`}
                      >
                        {user.isBlock ? "Unblock" : "Block"}
                      </button>

                      <button
                        onClick={() => toggleAdminStatus(user.id, user.role)}
                        className={`px-3 py-1 rounded-md text-white ${
                          user.role === "Admin"
                            ? "bg-yellow-600"
                            : "bg-blue-600"
                        }`}
                      >
                        {user.role === "Admin"
                          ? "Remove Admin"
                          : "Make Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-6">No users found.</p>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;
