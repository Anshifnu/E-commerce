// src/PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const PublicRouter = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    if (user.role === "Admin") {
      return <Navigate to="/admin" />;
    } else if (user.role === "User") {
      return <Navigate to="/" />;
    }
  }

  return <Outlet />;
};

export default PublicRouter;
