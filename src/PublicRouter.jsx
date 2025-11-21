// src/PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const PublicRouter = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin" />;
    } else if (user.role === "user") {
      return <Navigate to="/" />;
    }
  }

  return <Outlet />;
};

export default PublicRouter;
