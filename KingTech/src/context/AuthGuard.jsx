import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AuthGuard = ({children, roles = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null;

    if(!user) {
        return <Navigate to="/account/login" state={{ from: location }} replace />
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
        return <Navigate to="/403" replace />;
    };

    return children;
};

export default AuthGuard