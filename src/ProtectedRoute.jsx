import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user?.role === "User"
    ? <Outlet />
    : <Navigate to={user?.role === "Admin" ? "/admin" : "/login"} />;
};

export default ProtectedRoute;
