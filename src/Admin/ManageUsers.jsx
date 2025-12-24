import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../API/axios";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

 useEffect(() => {
  api
    .get(`admin/manage/users/`, {
      params: { search },   // 🔹 send query param
    })
    .then((res) => {
      setUsers(res.data || []);
    });
}, [search]); // 🔹 dependency


  const toggleBlockStatus = async (id, currentStatus) => {
    try {
      await api.patch(`admin/manage/users/${id}/`, {
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
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await api.patch(`admin/manage/users/${id}/`, {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">User Management</h1>
            <p className="text-gray-600">Manage user permissions and access levels</p>
          </div>
          <button
            onClick={() => navigate("/admin")}
            className="mt-4 md:mt-0 px-6 py-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        <div className="mb-6">
  <input
    type="text"
    placeholder="Search by name, username or email..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
  />
</div>

        {/* User Table */}
        {users.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">#</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">User</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Email</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Role</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">Joined {new Date().toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin" ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isBlock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.isBlock ? (
                            <span className="flex items-center">
                              <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                              Blocked
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                              Active
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => toggleBlockStatus(user.id, user.isBlock)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            user.isBlock 
                              ? 'bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800' 
                              : 'bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800'
                          } shadow-sm hover:shadow-md`}
                        >
                          {user.isBlock ? (
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              Unblock
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                              </svg>
                              Block
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => toggleAdminStatus(user.id, user.role)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            user.role === "admin" 
                              ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 hover:text-yellow-800' 
                              : 'bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800'
                          } shadow-sm hover:shadow-md`}
                        >
                          {user.role === "admin" ? (
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                              </svg>
                              Remove Admin
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                              </svg>
                              Make Admin
                            </span>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mx-auto max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
              <p className="mt-2 text-gray-500">There are currently no users in the system.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;