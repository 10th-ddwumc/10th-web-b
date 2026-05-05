import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";

const ProtectedLayout = () => {
    const { accessToken } = useAuth();
    const location = useLocation();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const hasAlerted = useRef(false);

    useEffect(() => {
        // StrictMode 등에서 중복 실행 방지 및 이미 리다이렉트 중인 경우 무시
        if (!accessToken && !hasAlerted.current) {
            hasAlerted.current = true;
            alert("로그인이 필요한 페이지입니다. 로그인 페이지로 이동합니다.");
            setShouldRedirect(true);
        }
    }, [accessToken]);

    if (!accessToken) {
        return shouldRedirect ? (
            <Navigate to={"/login"} state={{ from: location }} replace />
        ) : null;
    }

    return <Outlet />;
};

export default ProtectedLayout;