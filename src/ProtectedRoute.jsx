import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user?.role === "user"
    ? <Outlet />
    : <Navigate to={user?.role === "admin" ? "/admin" : "/login"} />;
};

export default ProtectedRoute;
