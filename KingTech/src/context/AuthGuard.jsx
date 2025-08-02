import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AuthGuard = ({children}) => {
    const {user} = useAuth();
    const location = useLocation();

    if(!user) {
        return <Navigate to="/account/login" state={{ from: location }} replace />
    }

    return children;
};

export default AuthGuard