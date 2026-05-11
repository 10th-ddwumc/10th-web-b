// src/components/ProtectedRoute.tsx
import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/token";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = getAccessToken();

  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!");
      navigate("/login", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [accessToken, location.pathname, navigate]);

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;