// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../utils/token";

const ProtectedRoute = () => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;