import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

function ProtectedRoute({children}: ProtectedRouteProps) {
    const {status} = useAuth();

    if(status === 'loading'){
        return <div>로딩 중...</div>
    }

    if(status === 'unauthenticated'){
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;